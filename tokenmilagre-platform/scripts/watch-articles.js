#!/usr/bin/env node

// Carregar variáveis de ambiente do .env
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const chokidar = require('chokidar');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Configuração
const ARTICLES_DIR = process.env.ARTICLES_DIR || path.join(os.homedir(), 'Trabalho', 'gemini', 'articles');
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const IMPORT_ENDPOINT = `${API_URL}/api/articles/import`;
const FACT_CHECK_ENDPOINT = `${API_URL}/api/articles/fact-check`;
const ENABLE_FACT_CHECK = process.env.ENABLE_FACT_CHECK !== 'false'; // Habilitado por padrão

// Cores para console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

function log(message, color = 'reset') {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`${colors.gray}[${timestamp}]${colors.reset} ${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'cyan');
}

function logWarn(message) {
  log(`⚠️  ${message}`, 'yellow');
}

// Fact-check do artigo
async function factCheckArticle(markdown) {
  try {
    logInfo('🔍 Realizando fact-checking...');

    const response = await fetch(FACT_CHECK_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        markdown,
        threshold: 70, // Score mínimo: 70%
        maxClaims: 10  // Máximo de claims: 10
      })
    });

    const result = await response.json();

    if (!result.success) {
      logWarn(`Erro no fact-check: ${result.error}`);
      return null; // Em caso de erro, prosseguir sem fact-check
    }

    const data = result.data;

    // Exibir resultado do fact-check
    if (data.status === 'skipped') {
      logWarn('⚠️  Fact-check pulado (APIs não configuradas)');
      return null;
    }

    logInfo(`   Status: ${data.passed ? '✅ APROVADO' : '❌ REPROVADO'}`);
    logInfo(`   Score: ${data.score}/${data.threshold}`);
    logInfo(`   Claims verificados: ${data.verifiedClaims}/${data.totalClaims}`);
    logInfo(`   Fontes consultadas: ${data.sources.length}`);
    logInfo(`   APIs usadas: ${data.searchAPIsUsed.join(', ')}`);

    return data;
  } catch (error) {
    logError(`Erro ao realizar fact-check: ${error.message}`);
    return null; // Em caso de erro, prosseguir sem fact-check
  }
}

// Importar artigo para API
async function importArticle(filePath) {
  try {
    const filename = path.basename(filePath);

    // Ignorar arquivos que começam com _ ou .
    if (filename.startsWith('_') || filename.startsWith('.')) {
      logInfo(`Ignorando arquivo: ${filename}`);
      return;
    }

    // Ignorar README
    if (filename.toUpperCase() === 'README.MD') {
      return;
    }

    logInfo(`Processando: ${filename}`);

    // Ler conteúdo do arquivo
    const markdown = fs.readFileSync(filePath, 'utf8');

    // Realizar fact-checking (se habilitado)
    let factCheckResult = null;
    if (ENABLE_FACT_CHECK) {
      factCheckResult = await factCheckArticle(markdown);

      // Se fact-check falhou, mover para pasta de revisão
      if (factCheckResult && !factCheckResult.passed) {
        logWarn('⚠️  Artigo reprovado no fact-checking!');

        const reviewDir = path.join(ARTICLES_DIR, '.review');
        if (!fs.existsSync(reviewDir)) {
          fs.mkdirSync(reviewDir, { recursive: true });
        }

        const reviewPath = path.join(reviewDir, filename);
        fs.renameSync(filePath, reviewPath);
        logWarn(`   Movido para revisão: .review/${filename}`);
        logInfo('   💡 Revise manualmente e mova para /articles se aprovar');
        return;
      }
    }

    // Enviar para API com resultado do fact-check
    const headers = {
      'Content-Type': 'application/json'
    };

    // Adicionar API Key se configurada
    const apiKey = process.env.ARTICLES_API_KEY;
    if (apiKey) {
      headers['x-api-key'] = apiKey;
    }

    const response = await fetch(IMPORT_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        markdown,
        filename,
        factCheckResult
      })
    });

    const result = await response.json();

    if (result.success) {
      logSuccess(`${result.data.message}`);
      logInfo(`   Slug: ${result.data.slug}`);
      logInfo(`   URL: ${API_URL}/dashboard/noticias/${result.data.slug}`);

      // Mover arquivo para pasta 'processed'
      const processedDir = path.join(ARTICLES_DIR, '.processed');
      if (!fs.existsSync(processedDir)) {
        fs.mkdirSync(processedDir, { recursive: true });
      }

      const processedPath = path.join(processedDir, filename);
      fs.renameSync(filePath, processedPath);
      logInfo(`   Movido para: .processed/${filename}`);
    } else {
      logError(`Falha ao importar: ${result.error}`);
    }
  } catch (error) {
    logError(`Erro ao processar ${path.basename(filePath)}: ${error.message}`);
  }
}

// Verificar se diretório existe
if (!fs.existsSync(ARTICLES_DIR)) {
  logError(`Pasta ${ARTICLES_DIR} não existe!`);
  logInfo('Criando pasta...');
  fs.mkdirSync(ARTICLES_DIR, { recursive: true });
  logSuccess('Pasta criada!');
}

// Banner inicial
console.log('\n' + colors.bright + colors.cyan);
console.log('╔══════════════════════════════════════════════════════╗');
console.log('║                                                      ║');
console.log('║         📝 TokenMilagre Articles Watcher 📝         ║');
console.log('║                                                      ║');
console.log('╚══════════════════════════════════════════════════════╝');
console.log(colors.reset);

logInfo(`Monitorando: ${ARTICLES_DIR}`);
logInfo(`API: ${IMPORT_ENDPOINT}`);
logInfo(`Fact-checking: ${ENABLE_FACT_CHECK ? '✅ HABILITADO' : '❌ DESABILITADO'}`);
if (ENABLE_FACT_CHECK) {
  logInfo(`   Threshold: 70%`);
  logInfo(`   APIs necessárias: Google Custom Search, Brave Search`);
}
logInfo('');
logSuccess('✨ Watcher iniciado! Aguardando arquivos .md...\n');

// Processar arquivos existentes na inicialização
const existingFiles = fs.readdirSync(ARTICLES_DIR)
  .filter(f => f.endsWith('.md') && !f.startsWith('_') && !f.startsWith('.'))
  .filter(f => f.toUpperCase() !== 'README.MD');

if (existingFiles.length > 0) {
  logWarn(`Encontrados ${existingFiles.length} arquivo(s) .md existente(s)`);
  logInfo('Importando arquivos pendentes...\n');

  // Processar cada arquivo sequencialmente
  (async () => {
    for (const file of existingFiles) {
      const filePath = path.join(ARTICLES_DIR, file);
      await importArticle(filePath);
      // Pequena pausa entre arquivos
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    logSuccess('✨ Todos os arquivos pendentes foram processados!\n');
  })();
}

// Iniciar watcher - monitorar diretório inteiro
const watcher = chokidar.watch(ARTICLES_DIR, {
  persistent: true,
  ignoreInitial: true, // Não processar arquivos existentes automaticamente
  ignored: /(^|[\/\\])\../, // Ignorar arquivos/pastas ocultos
  awaitWriteFinish: {
    stabilityThreshold: 2000,
    pollInterval: 100
  },
  usePolling: true,   // Usar polling (mais confiável em alguns sistemas)
  interval: 1000,     // Verificar a cada 1 segundo
  binaryInterval: 3000 // Arquivos binários a cada 3 segundos
});

// Eventos
watcher
  .on('add', (filePath) => {
    const filename = path.basename(filePath);

    // Processar apenas arquivos .md
    if (!filename.endsWith('.md')) {
      return;
    }

    // Ignorar README e TEMPLATE
    if (filename.toUpperCase() === 'README.MD' || filename.startsWith('_')) {
      return;
    }

    log(`\n📄 Novo arquivo detectado: ${filename}`, 'bright');
    importArticle(filePath);
  })
  .on('change', (filename) => {
    logWarn(`Arquivo modificado: ${filename} (alterações não são importadas automaticamente)`);
  })
  .on('error', (error) => {
    logError(`Erro no watcher: ${error.message}`);
  });

// Graceful shutdown
process.on('SIGINT', () => {
  log('\n👋 Encerrando watcher...', 'yellow');
  watcher.close();
  process.exit(0);
});

// Keep alive
process.stdin.resume();
