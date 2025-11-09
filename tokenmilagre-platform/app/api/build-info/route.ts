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

export async function GET() {
  try {
    // Branch atual
    const branch = execGitCommand('git branch --show-current');

    if (!branch) {
      return NextResponse.json({
        success: false,
        error: 'Not a git repository',
      });
    }

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

    const buildInfo: BuildInfo = {
      branch,
      type,
      commitHash,
      commitMessage,
      gitStatus,
      changedFiles: changedFiles > 0 ? changedFiles : undefined,
      lastUpdate,
      compareMain,
    };

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
