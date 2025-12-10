'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimesCircle,
  faExclamationTriangle,
  faCheckCircle,
  faLightbulb,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';

interface Threat {
  level: 'critical' | 'warning' | 'suspicious';
  reasons: string[];
  educationalTip: string;
  similarLegitDomain?: string;
  source: string;
}

interface URLWarningModalProps {
  isOpen: boolean;
  url: string;
  threat: Threat;
  onClose: () => void;
  onProceed: () => void;
}

export default function URLWarningModal({
  isOpen,
  url,
  threat,
  onClose,
  onProceed,
}: URLWarningModalProps) {
  if (!isOpen) return null;

  const isCritical = threat.level === 'critical';
  const bgColor = isCritical ? '#fef2f2' : threat.level === 'warning' ? '#fefce8' : '#fff7ed';
  const borderColor = isCritical ? '#ef4444' : threat.level === 'warning' ? '#eab308' : '#f97316';
  const textColor = isCritical ? '#991b1b' : threat.level === 'warning' ? '#854d0e' : '#9a3412';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
      onClick={onClose}
    >
      <div
        className="max-w-lg w-full rounded-2xl shadow-2xl border-2 overflow-hidden"
        style={{ backgroundColor: bgColor, borderColor }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="p-6 border-b-2"
          style={{ borderColor, backgroundColor: isCritical ? '#fee2e2' : '#fef3c7' }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <FontAwesomeIcon
                icon={isCritical ? faTimesCircle : faExclamationTriangle}
                className="w-8 h-8"
                style={{ color: borderColor }}
              />
              <div>
                <h2 className="text-2xl font-bold" style={{ color: textColor }}>
                  {isCritical ? '🔴 SITE PERIGOSO DETECTADO' : '⚠️ SITE SUSPEITO'}
                </h2>
                <p className="text-sm opacity-80" style={{ color: textColor }}>
                  Pense duas vezes antes de continuar
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/50 transition-colors"
              aria-label="Fechar"
            >
              <FontAwesomeIcon icon={faTimes} className="w-5 h-5" style={{ color: textColor }} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* URL */}
          <div>
            <p className="text-sm font-semibold mb-2" style={{ color: textColor }}>
              Você está prestes a acessar:
            </p>
            <div
              className="p-3 rounded-lg font-mono text-sm break-all"
              style={{ backgroundColor: 'white', border: `1px solid ${borderColor}` }}
            >
              {url}
            </div>
          </div>

          {/* Reasons */}
          <div>
            <p className="font-semibold mb-2" style={{ color: textColor }}>
              Ameaças detectadas:
            </p>
            <ul className="space-y-2">
              {threat.reasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span style={{ color: borderColor }}>•</span>
                  <span style={{ color: textColor }}>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Educational Tip */}
          {threat.educationalTip && (
            <div
              className="p-4 rounded-lg border"
              style={{ backgroundColor: 'white', borderColor: '#fbbf24' }}
            >
              <p className="flex items-start gap-2 text-sm">
                <FontAwesomeIcon icon={faLightbulb} className="w-5 h-5 text-yellow-500 mt-0.5" />
                <span>
                  <strong className="text-yellow-900">Dica de Segurança:</strong>{' '}
                  <span className="text-yellow-800">{threat.educationalTip}</span>
                </span>
              </p>
            </div>
          )}

          {/* Similar Legit Domain */}
          {threat.similarLegitDomain && (
            <div
              className="p-4 rounded-lg border"
              style={{ backgroundColor: '#f0fdf4', borderColor: '#22c55e' }}
            >
              <p className="flex items-start gap-2 text-sm">
                <FontAwesomeIcon icon={faCheckCircle} className="w-5 h-5 text-green-600 mt-0.5" />
                <span>
                  <strong className="text-green-900">Você quis dizer:</strong>{' '}
                  <a
                    href={`https://${threat.similarLegitDomain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-700 underline hover:no-underline font-semibold"
                    onClick={onClose}
                  >
                    {threat.similarLegitDomain}
                  </a>
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t" style={{ borderColor }}>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: '#22c55e',
                color: 'white',
              }}
            >
              🛡️ Voltar com Segurança
            </button>
            <button
              onClick={onProceed}
              className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 border-2"
              style={{
                backgroundColor: 'transparent',
                borderColor,
                color: textColor,
              }}
            >
              ⚠️ Prosseguir Mesmo Assim
            </button>
          </div>
          <p className="text-xs text-center mt-3 opacity-70" style={{ color: textColor }}>
            $MILAGRE não se responsabiliza por danos causados por sites externos
          </p>
        </div>
      </div>
    </div>
  );
}
