'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagic, faImage, faDownload, faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function ImageGeneratorPage() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;

    setLoading(true);
    setError(null);
    setImage(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Falha ao gerar imagem');
      }

      if (data.success && data.image) {
        setImage(data.image);
      }
    } catch (err: any) {
      console.error(err);
      if (err.message && (err.message.includes('Quota exceeded') || err.message.includes('429'))) {
        setError('⚠️ Limite Gratuito Atingido (Quota Exceeded). O Google restringiu a geração de imagens para contas gratuitas neste modelo. Tente novamente mais tarde ou verifique seu plano.');
      } else if (err.message && err.message.includes('503')) {
        setError('⚠️ Serviço Sobrecarregado. O modelo está muito ocupado no momento. Tente novamente em alguns instantes.');
      } else {
        setError(err.message || 'Erro desconhecido ao gerar imagem.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
<h1 className="title-newtab text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-secondary)] filter drop-shadow-lg">
            Estúdio Criativo IA
          </h1>
          <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
            Transforme suas ideias em realidade visual com o poder do Gemini 2.0.
            Experimente prompts detalhados para melhores resultados.
          </p>
        </div>

        {/* Main Card */}
        <div className="zenith-card p-8 rounded-3xl">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">
                Seu Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: Um robô futurista analisando gráficos de bitcoin em estilo cyberpunk neon..."
                className="w-full h-32 bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-xl p-4 text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--brand-primary)] focus:border-transparent outline-none transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !prompt}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${loading || !prompt
                ? 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] cursor-not-allowed'
                : 'bg-[var(--brand-primary)] text-black hover:scale-[1.02] shadow-[0_0_20px_rgba(252,213,53,0.3)]'
                }`}
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                  Gerando Arte...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faMagic} />
                  Gerar Imagem
                </>
              )}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
              {error}
            </div>
          )}
        </div>

        {/* Result Area */}
        {image && (
          <div className="zenith-card p-4 rounded-3xl animate-fade-in-up">
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black/50">
              <img
                src={image}
                alt="Generated Content"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <a
                href={image}
                download={`zenith-ai-${Date.now()}.png`}
                className="px-6 py-2 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] border border-[var(--border-light)] flex items-center gap-2 transition-colors"
              >
                <FontAwesomeIcon icon={faDownload} />
                Download
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
