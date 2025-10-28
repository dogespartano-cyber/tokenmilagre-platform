'use client';

import { signIn, getSession } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      });

      if (result?.error) {
        setError('Credenciais inválidas');
        setLoading(false);
      } else {
        // Buscar sessão para obter a role do usuário
        const session = await getSession();

        if (session?.user?.role) {
          // Redirecionar baseado na role
          switch (session.user.role) {
            case 'ADMIN':
              router.push('/dashboard/admin');
              break;
            case 'EDITOR':
              router.push('/dashboard/criar-artigo');
              break;
            case 'VIEWER':
              router.push('/dashboard/noticias');
              break;
            default:
              router.push('/');
          }
        } else {
          router.push('/');
        }

        router.refresh();
      }
    } catch (error) {
      setError('Erro ao fazer login');
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #0A1628 0%, #1a2332 100%)'
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl border-2 shadow-2xl p-8"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--border-medium)'
        }}
      >
        {/* Header with Logo */}
        <div className="text-center mb-8">
          {/* Logo with effects */}
          <div className="flex justify-center mb-6">
            <div className="relative w-32 h-32">
              {/* Animated rings */}
              <div className="absolute inset-0 animate-spin-slow">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-yellow-400/30"></div>
              </div>
              <div className="absolute inset-2 animate-spin-reverse">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-purple-400/30"></div>
              </div>

              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/30 via-pink-300/30 to-purple-300/30 blur-2xl animate-pulse"></div>

              {/* Image */}
              <div className="relative z-10 transform hover:scale-105 transition-all duration-700">
                <Image
                  src="/images/TOKEN-MILAGRE-Hero.webp"
                  alt="$MILAGRE"
                  width={128}
                  height={128}
                  className="drop-shadow-2xl rounded-full"
                  priority
                />
              </div>
            </div>
          </div>

          <h1
            className="text-3xl font-bold mb-4 font-[family-name:var(--font-poppins)]"
            style={{ color: 'var(--text-primary)' }}
          >
            Token Milagre
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div
              className="p-4 rounded-lg border-2"
              style={{
                backgroundColor: 'var(--error-bg)',
                borderColor: 'var(--error-border)',
                color: 'var(--error)'
              }}
            >
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-light)',
                color: 'var(--text-primary)'
              }}
              placeholder="seu@email.com"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-light)',
                color: 'var(--text-primary)'
              }}
              placeholder="••••••••"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 rounded-xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 shadow-xl hover:shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-hover))'
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 15s linear infinite;
        }
      `}</style>
    </div>
  );
}
