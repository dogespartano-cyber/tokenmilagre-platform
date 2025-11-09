import { NextResponse } from 'next/server';
import { execSync } from 'child_process';

export const dynamic = 'force-dynamic';

interface BuildInfo {
  branch: string;
  type: 'Production' | 'Preview' | 'Development';
  commitHash: string;
  commitMessage: string;
  gitStatus: 'Clean' | 'Dirty';
  changedFiles?: number;
  lastUpdate: string;
  compareMain?: string;
  environment?: string;
}

function execGitCommand(command: string): string {
  try {
    return execSync(command, {
      cwd: process.cwd(),
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'], // Ignora stderr
    }).trim();
  } catch (error) {
    return '';
  }
}

// Informações do Git via variáveis de ambiente da Vercel (Produção/Preview)
function getVercelBuildInfo(): BuildInfo | null {
  const {
    VERCEL_GIT_COMMIT_SHA,
    VERCEL_GIT_COMMIT_REF,
    VERCEL_GIT_COMMIT_MESSAGE,
    VERCEL_ENV,
  } = process.env;

  // Se não tiver as variáveis da Vercel, retorna null (ambiente local)
  if (!VERCEL_GIT_COMMIT_SHA || !VERCEL_GIT_COMMIT_REF) {
    return null;
  }

  const branch = VERCEL_GIT_COMMIT_REF;

  // Determinar tipo baseado na branch e VERCEL_ENV
  let type: BuildInfo['type'] = 'Development';
  if (VERCEL_ENV === 'production' || branch === 'main') {
    type = 'Production';
  } else if (VERCEL_ENV === 'preview' || branch.startsWith('claude/')) {
    type = 'Preview';
  }

  // Commit hash (7 caracteres)
  const commitHash = VERCEL_GIT_COMMIT_SHA.substring(0, 7);

  // Mensagem do commit
  let commitMessage = VERCEL_GIT_COMMIT_MESSAGE || 'No message';
  if (commitMessage.length > 60) {
    commitMessage = commitMessage.substring(0, 57) + '...';
  }

  // Em produção/preview sempre Clean (não há git status)
  const gitStatus: BuildInfo['gitStatus'] = 'Clean';

  // Data de build (usar data atual já que não temos git log)
  const lastUpdate = new Date().toISOString();

  return {
    branch,
    type,
    commitHash,
    commitMessage,
    gitStatus,
    lastUpdate,
    environment: VERCEL_ENV || 'vercel',
  };
}

// Informações do Git via comandos (Desenvolvimento Local)
function getLocalBuildInfo(): BuildInfo {
  // Branch atual
  const branch = execGitCommand('git branch --show-current');

  // Determinar tipo baseado na branch
  let type: BuildInfo['type'] = 'Development';
  if (branch === 'main') {
    type = 'Production';
  } else if (branch.startsWith('claude/')) {
    type = 'Preview';
  }

  // Commit hash (7 caracteres)
  const commitHash = execGitCommand('git rev-parse --short=7 HEAD');

  // Mensagem do commit (primeira linha, max 60 chars)
  let commitMessage = execGitCommand('git log -1 --pretty=format:"%s"');
  if (commitMessage.length > 60) {
    commitMessage = commitMessage.substring(0, 57) + '...';
  }

  // Estado Git (Clean ou Dirty)
  const gitStatusOutput = execGitCommand('git status --porcelain');
  const changedFiles = gitStatusOutput
    ? gitStatusOutput.split('\n').filter(line => line.trim()).length
    : 0;

  const gitStatus: BuildInfo['gitStatus'] = changedFiles === 0 ? 'Clean' : 'Dirty';

  // Última atualização (data/hora do commit)
  const lastUpdate = execGitCommand('git log -1 --pretty=format:"%ci"');

  // Comparação com origin/main (se não estiver na main)
  let compareMain: string | undefined;
  if (branch !== 'main') {
    const ahead = parseInt(execGitCommand('git rev-list --count origin/main..HEAD') || '0');
    const behind = parseInt(execGitCommand('git rev-list --count HEAD..origin/main') || '0');

    if (ahead > 0 && behind > 0) {
      compareMain = `${ahead} ahead, ${behind} behind`;
    } else if (ahead > 0) {
      compareMain = `${ahead} ahead`;
    } else if (behind > 0) {
      compareMain = `${behind} behind`;
    } else {
      compareMain = 'up to date';
    }
  }

  return {
    branch,
    type,
    commitHash,
    commitMessage,
    gitStatus,
    changedFiles: changedFiles > 0 ? changedFiles : undefined,
    lastUpdate,
    compareMain,
    environment: 'local',
  };
}

export async function GET() {
  try {
    // Tentar usar variáveis da Vercel primeiro (produção/preview)
    let buildInfo = getVercelBuildInfo();

    // Se não estiver na Vercel, usar comandos Git (desenvolvimento local)
    if (!buildInfo) {
      buildInfo = getLocalBuildInfo();

      // Validar se conseguiu obter informações
      if (!buildInfo.branch) {
        return NextResponse.json({
          success: false,
          error: 'Not a git repository',
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: buildInfo,
    });
  } catch (error) {
    console.error('Error getting build info:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get build info',
      },
      { status: 500 }
    );
  }
}
