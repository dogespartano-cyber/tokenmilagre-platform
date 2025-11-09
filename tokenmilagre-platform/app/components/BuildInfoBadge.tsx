'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCodeBranch, faCircleCheck, faTriangleExclamation, faClock, faCopy, faCheck } from '@fortawesome/free-solid-svg-icons';

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

export default function BuildInfoBadge() {
  const [buildInfo, setBuildInfo] = useState<BuildInfo | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchBuildInfo = async () => {
      try {
        const response = await fetch('/api/build-info');
        const result = await response.json();

        if (result.success && result.data) {
          setBuildInfo(result.data);
        }
      } catch (error) {
        console.error('Error fetching build info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBuildInfo();
  }, []);

  const copyToClipboard = async () => {
    if (!buildInfo) return;

    const text = `Build Info - Token Milagre Platform
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Type: ${buildInfo.type}
Branch: ${buildInfo.branch}
Commit: ${buildInfo.commitHash} - ${buildInfo.commitMessage}
Status: ${buildInfo.gitStatus}${buildInfo.changedFiles ? ` (${buildInfo.changedFiles} files)` : ''}
Updated: ${formatDate(buildInfo.lastUpdate)}${buildInfo.compareMain ? `\nvs Main: ${buildInfo.compareMain}` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  if (isLoading || !buildInfo) {
    return null;
  }

  // Cores baseadas no tipo
  const typeColors = {
    Production: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30',
    Preview: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30',
    Development: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/30',
  };

  const typeIcons = {
    Production: '🚀',
    Preview: '🔍',
    Development: '🔧',
  };

  const typeColor = typeColors[buildInfo.type];
  const typeIcon = typeIcons[buildInfo.type];

  // Formatação da data
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <div
      className="fixed bottom-4 right-4 z-50"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Badge compacto */}
      <div
        className={`
          ${typeColor}
          border rounded-lg shadow-lg backdrop-blur-sm
          transition-all duration-300 ease-in-out
          ${isExpanded ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
        `}
      >
        <div className="px-3 py-2 flex items-center gap-2 text-sm font-medium">
          <span className="text-base">{typeIcon}</span>
          <span>{buildInfo.type}</span>
          <span className="opacity-60">•</span>
          <span className="font-mono text-xs">{buildInfo.commitHash}</span>
        </div>
      </div>

      {/* Painel expandido */}
      <div
        className={`
          absolute bottom-0 right-0
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          rounded-lg shadow-2xl backdrop-blur-sm
          transition-all duration-300 ease-in-out
          ${isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
        `}
        style={{ minWidth: '320px' }}
      >
        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <FontAwesomeIcon icon={faCodeBranch} className="text-gray-500" />
              Build Info
            </h3>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded ${typeColor} border`}>
                {typeIcon} {buildInfo.type}
              </span>
              <button
                onClick={copyToClipboard}
                className={`
                  p-1.5 rounded transition-all duration-200
                  ${copied
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }
                `}
                title={copied ? 'Copiado!' : 'Copiar informações'}
              >
                <FontAwesomeIcon
                  icon={copied ? faCheck : faCopy}
                  className="text-xs"
                />
              </button>
            </div>
          </div>

          {/* Branch */}
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Branch</div>
            <div className="text-sm font-mono text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              {buildInfo.branch}
            </div>
          </div>

          {/* Commit */}
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Commit</div>
            <div className="text-xs font-mono text-gray-700 dark:text-gray-300">
              <span className="text-blue-600 dark:text-blue-400 font-semibold">{buildInfo.commitHash}</span>
              {' - '}
              {buildInfo.commitMessage}
            </div>
          </div>

          {/* Git Status */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500 dark:text-gray-400">Status</div>
            <div className={`text-xs flex items-center gap-1 ${
              buildInfo.gitStatus === 'Clean'
                ? 'text-green-600 dark:text-green-400'
                : 'text-yellow-600 dark:text-yellow-400'
            }`}>
              <FontAwesomeIcon
                icon={buildInfo.gitStatus === 'Clean' ? faCircleCheck : faTriangleExclamation}
                className="text-xs"
              />
              {buildInfo.gitStatus}
              {buildInfo.changedFiles && (
                <span className="ml-1 opacity-70">({buildInfo.changedFiles} files)</span>
              )}
            </div>
          </div>

          {/* Última atualização */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <FontAwesomeIcon icon={faClock} className="text-xs" />
              Updated
            </div>
            <div className="text-xs text-gray-700 dark:text-gray-300">
              {formatDate(buildInfo.lastUpdate)}
            </div>
          </div>

          {/* Comparação com main */}
          {buildInfo.compareMain && (
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">vs Production</div>
              <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {buildInfo.compareMain}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
