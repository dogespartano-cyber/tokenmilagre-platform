export default function SecurityTips() {
  const tips = [
    {
      icon: '🔒',
      title: 'Verifique o Cadeado HTTPS',
      description: 'Sites legítimos sempre usam conexão segura (https://)'
    },
    {
      icon: '🔗',
      title: 'Salve nos Favoritos',
      description: 'Salve sites oficiais nos favoritos do navegador'
    },
    {
      icon: '❌',
      title: 'Evite Links Suspeitos',
      description: 'Não clique em links de e-mails ou mensagens diretas'
    },
    {
      icon: '👀',
      title: 'Confira a URL Completa',
      description: 'Golpistas usam URLs parecidas (ex: metarnask.io)'
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold font-[family-name:var(--font-poppins)]" style={{ color: 'var(--text-primary)' }}>
        Dicas de Segurança
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        {tips.map((tip, index) => (
          <div key={index} className="p-4 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{tip.icon}</span>
              <div>
                <h3 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {tip.title}
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {tip.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
