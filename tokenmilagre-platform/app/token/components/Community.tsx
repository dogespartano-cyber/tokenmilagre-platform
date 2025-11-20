/**
 * Community Section - Social proof and testimonials
 */

'use client';

import { motion } from 'framer-motion';
import { Users, MessageCircle, Star, Github } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord, faTelegram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { animations } from '../utils/design-tokens';

interface StatProps {
  number: string;
  label: string;
  sublabel: string;
}

function BigStat({ number, label, sublabel }: StatProps) {
  return (
    <motion.div
      className="text-center"
      variants={animations.fadeInUp}
      whileHover={{ scale: 1.05, y: -8 }}
    >
      <motion.div
        className="text-6xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', duration: 1 }}
      >
        {number}
      </motion.div>
      <p className="text-xl font-bold text-white mb-1">{label}</p>
      <p className="text-sm text-gray-400">{sublabel}</p>
    </motion.div>
  );
}

interface TestimonialProps {
  avatar: string;
  name: string;
  role: string;
  text: string;
  verified?: boolean;
}

function Testimonial({ avatar, name, role, text, verified }: TestimonialProps) {
  return (
    <motion.div
      className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-4 mb-4">
        <div
          className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0"
        >
          {avatar}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-white">{name}</h4>
            {verified && <Star size={16} className="text-yellow-400 fill-yellow-400" />}
          </div>
          <p className="text-sm text-gray-400">{role}</p>
        </div>
      </div>

      <p className="text-gray-300 leading-relaxed italic">"{text}"</p>

      <div className="mt-4 flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
        ))}
      </div>
    </motion.div>
  );
}

interface SocialButtonProps {
  icon: React.ReactNode;
  label: string;
  members: string;
  href: string;
  color: string;
}

function SocialButton({ icon, label, members, href, color }: SocialButtonProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-4 p-6 rounded-2xl border-2 hover:scale-105 transition-all"
      style={{
        backgroundColor: `${color}10`,
        borderColor: `${color}30`,
      }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.95 }}
    >
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-bold text-white text-lg">{label}</p>
        <p className="text-sm text-gray-400">{members} membros</p>
      </div>
      <div className="text-purple-400 font-semibold">Juntar →</div>
    </motion.a>
  );
}

export default function Community() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 rounded-full border border-pink-500/30 mb-6">
            <Users size={18} className="text-pink-400" />
            <span className="text-sm font-semibold text-pink-300">COMUNIDADE</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">Comunidade Forte 🤝</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Mais de 2.000 pessoas aprendendo e crescendo juntas todos os dias.
          </p>
        </motion.div>

        {/* Stats Showcase */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={animations.staggerContainer}
        >
          <BigStat number="247" label="Holders únicos" sublabel="Crescendo 12% por semana" />
          <BigStat number="2,341" label="Membros Discord" sublabel="Comunidade ativa 24/7" />
          <BigStat number="15k+" label="Mensagens/semana" sublabel="Ajuda mútua e aprendizado" />
        </motion.div>

        {/* Testimonials */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-white text-center mb-10">O Que Os Holders Dizem</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Testimonial
              avatar="JS"
              name="João Silva"
              role="Holder desde o início"
              text="Aprendi mais em 2 meses na comunidade do Token Milagre do que em 2 anos tentando sozinho. E ainda fiz um bom ROI!"
              verified
            />

            <Testimonial
              avatar="MS"
              name="Maria Santos"
              role="Iniciante em crypto"
              text="Achei que crypto era só pra quem já sabia tudo. Aqui me receberam com paciência e hoje já faço meus trades."
              verified
            />

            <Testimonial
              avatar="PC"
              name="Pedro Costa"
              role="Trader experiente"
              text="Projeto sério com foco em educação. Raro encontrar algo assim no mundo crypto brasileiro."
              verified
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SocialButton
            icon={<FontAwesomeIcon icon={faDiscord} size="2x" className="text-white" />}
            label="Discord"
            members="2.3k"
            href="https://discord.gg/xk4zrz8j"
            color="#5865F2"
          />

          <SocialButton
            icon={<FontAwesomeIcon icon={faTelegram} size="2x" className="text-white" />}
            label="Telegram"
            members="1.8k"
            href="https://t.me/+Bop_TVFc_mg3Njlh"
            color="#0088cc"
          />

          <SocialButton
            icon={<FontAwesomeIcon icon={faTwitter} size="2x" className="text-white" />}
            label="Twitter"
            members="5.2k"
            href="https://twitter.com/tokenmilagre"
            color="#1DA1F2"
          />

          <SocialButton
            icon={<Github size={32} className="text-white" />}
            label="GitHub"
            members="142 stars"
            href="https://github.com/dogespartano-cyber/tokenmilagre-platform"
            color="#333333"
          />
        </div>

        {/* Community Values */}
        <motion.div
          className="mt-16 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 rounded-3xl p-8"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-bold text-white mb-6 text-center">❤️ Nunca Estarás Sozinho</h3>

          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <MessageCircle className="w-12 h-12 text-purple-400 mx-auto mb-3" />
              <h4 className="font-bold text-white mb-2">Suporte 24/7</h4>
              <p className="text-sm text-gray-400">
                Sempre tem alguém online para ajudar com suas dúvidas
              </p>
            </div>

            <div>
              <Users className="w-12 h-12 text-blue-400 mx-auto mb-3" />
              <h4 className="font-bold text-white mb-2">Zero Julgamento</h4>
              <p className="text-sm text-gray-400">
                Não existe pergunta boba. Todos começamos do zero
              </p>
            </div>

            <div>
              <Star className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
              <h4 className="font-bold text-white mb-2">Crescimento Coletivo</h4>
              <p className="text-sm text-gray-400">
                Quando um cresce, todos crescemos juntos
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
