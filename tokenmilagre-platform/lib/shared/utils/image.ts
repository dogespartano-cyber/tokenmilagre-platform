/**
 * Utilitários para salvar e gerenciar imagens de capa
 */

import fs from 'fs';
import path from 'path';

interface SaveImageOptions {
  imageBase64: string;
  mimeType: string;
  slug: string;
  articleType: 'news' | 'educational' | 'resource';
}

interface SaveImageResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Salva imagem base64 no sistema de arquivos
 * Retorna URL pública da imagem
 */
export async function saveCoverImage(options: SaveImageOptions): Promise<SaveImageResult> {
  try {
    const { imageBase64, mimeType, slug, articleType } = options;

    console.log('[saveCoverImage] 💾 Iniciando salvamento...');
    console.log('[saveCoverImage] Parâmetros:', {
      mimeType,
      slug,
      articleType,
      base64Length: imageBase64.length
    });

    // Determinar extensão do arquivo
    const extension = mimeType.split('/')[1] || 'jpg';
    console.log('[saveCoverImage] 📝 Extensão:', extension);

    // Criar estrutura de diretórios
    const baseDir = path.join(process.cwd(), 'public', 'images', 'covers', articleType);
    console.log('[saveCoverImage] 📁 Diretório base:', baseDir);

    // Criar diretório se não existir
    if (!fs.existsSync(baseDir)) {
      console.log('[saveCoverImage] 📂 Criando diretório...');
      fs.mkdirSync(baseDir, { recursive: true });
    } else {
      console.log('[saveCoverImage] ✅ Diretório já existe');
    }

    // Nome do arquivo (slug + timestamp para garantir unicidade)
    const timestamp = Date.now();
    const filename = `${slug}-${timestamp}.${extension}`;
    const filePath = path.join(baseDir, filename);
    console.log('[saveCoverImage] 📄 Nome do arquivo:', filename);
    console.log('[saveCoverImage] 🗂️ Caminho completo:', filePath);

    // Converter base64 para buffer
    console.log('[saveCoverImage] 🔄 Convertendo base64 para buffer...');
    const imageBuffer = Buffer.from(imageBase64, 'base64');
    console.log('[saveCoverImage] 📊 Tamanho do buffer:', imageBuffer.length, 'bytes');

    // Salvar arquivo
    console.log('[saveCoverImage] 💿 Salvando arquivo...');
    fs.writeFileSync(filePath, imageBuffer);
    console.log('[saveCoverImage] ✅ Arquivo salvo com sucesso!');

    // Verificar se arquivo existe
    const fileExists = fs.existsSync(filePath);
    console.log('[saveCoverImage] 🔍 Verificação: arquivo existe?', fileExists);

    if (fileExists) {
      const stats = fs.statSync(filePath);
      console.log('[saveCoverImage] 📊 Tamanho do arquivo salvo:', stats.size, 'bytes');
    }

    // Construir URL pública
    const publicUrl = `/images/covers/${articleType}/${filename}`;
    console.log('[saveCoverImage] 🌐 URL pública:', publicUrl);

    return {
      success: true,
      url: publicUrl
    };

  } catch (error: any) {
    console.error('[saveCoverImage] ❌ Erro ao salvar imagem:', error);
    console.error('[saveCoverImage] Stack:', error.stack);
    return {
      success: false,
      error: error.message || 'Erro ao salvar imagem'
    };
  }
}

/**
 * Deleta imagem de capa (útil para limpeza ou regeneração)
 */
export function deleteCoverImage(imageUrl: string): boolean {
  try {
    // Converter URL pública para caminho do sistema de arquivos
    const filePath = path.join(process.cwd(), 'public', imageUrl);

    // Verificar se arquivo existe
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Erro ao deletar imagem:', error);
    return false;
  }
}

/**
 * Verifica se imagem existe no sistema de arquivos
 */
export function imageExists(imageUrl: string): boolean {
  try {
    const filePath = path.join(process.cwd(), 'public', imageUrl);
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

/**
 * Limpa imagens antigas (útil para manutenção)
 * Remove imagens mais antigas que X dias
 */
export function cleanOldImages(daysOld: number = 90): number {
  try {
    let deletedCount = 0;
    const coversDirs = ['news', 'educational', 'resource'];
    const now = Date.now();
    const maxAge = daysOld * 24 * 60 * 60 * 1000; // Converter dias para ms

    coversDirs.forEach(type => {
      const dirPath = path.join(process.cwd(), 'public', 'images', 'covers', type);

      if (!fs.existsSync(dirPath)) return;

      const files = fs.readdirSync(dirPath);

      files.forEach(file => {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);

        // Verificar idade do arquivo
        if (now - stats.mtimeMs > maxAge) {
          fs.unlinkSync(filePath);
          deletedCount++;
        }
      });
    });

    return deletedCount;
  } catch (error) {
    console.error('Erro ao limpar imagens antigas:', error);
    return 0;
  }
}

/**
 * Retorna imagem placeholder baseada na categoria
 * Usado como fallback quando geração falha
 */
export function getPlaceholderImage(category: string, articleType: string): string {
  // Mapeamento de placeholders por categoria
  const placeholders: Record<string, string> = {
    bitcoin: '/images/placeholders/bitcoin-cover.jpg',
    ethereum: '/images/placeholders/ethereum-cover.jpg',
    defi: '/images/placeholders/defi-cover.jpg',
    politica: '/images/placeholders/politica-cover.jpg',
    nfts: '/images/placeholders/nfts-cover.jpg',
    default: '/images/placeholders/default-cover.jpg'
  };

  return placeholders[category] || placeholders.default;
}

/**
 * Cria alt text descritivo para a imagem
 */
export function generateImageAltText(title: string, category: string, articleType: string): string {
  const typeLabel = articleType === 'news' ? 'Notícia' : articleType === 'educational' ? 'Artigo educacional' : 'Recurso';
  return `${typeLabel} sobre ${category}: ${title}`;
}

/**
 * Valida tamanho da imagem (para evitar arquivos muito grandes)
 */
export function validateImageSize(base64: string, maxSizeMB: number = 2): boolean {
  try {
    const sizeInBytes = ((base64.length * 3) / 4);
    const sizeInMB = sizeInBytes / (1024 * 1024);
    return sizeInMB <= maxSizeMB;
  } catch {
    return false;
  }
}
