import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faBookmark, faBan, faEye } from '@fortawesome/free-solid-svg-icons';
import ZenithCard from '@/components/ui/ZenithCard';

export default function SecurityTips() {
 const tips = [
  {
   icon: faLock,
   title: 'Verifique o Cadeado HTTPS',
   description: 'Sites legítimos sempre usam conexão segura (https://)',
   variant: 'success'
  },
  {
   icon: faBookmark,
   title: 'Salve nos Favoritos',
   description: 'Salve sites oficiais nos favoritos do navegador',
   variant: 'indigo'
  },
  {
   icon: faBan,
   title: 'Evite Links Suspeitos',
   description: 'Não clique em links de e-mails ou mensagens diretas',
   variant: 'danger'
  },
  {
   icon: faEye,
   title: 'Confira a URL Completa',
   description: 'Golpistas usam URLs parecidas (ex: metarnask.io)',
   variant: 'warning'
  }
 ];

 return (
  <div className="space-y-6">
<h2 className="text-3xl title-newtab ">
    Dicas de Segurança
   </h2>

   <div className="grid md:grid-cols-2 gap-4">
    {tips.map((tip, index) => {
     const colorMap: Record<string, string> = {
      success: '',
      indigo: '',
      danger: '',
      warning: ''
     };

     return (
      <ZenithCard
       key={index}
       variant={tip.variant as any}
       className="flex items-start gap-4"
      >
       <div className={`mt-1 ${colorMap[tip.variant]}`}>
        <FontAwesomeIcon icon={tip.icon} className="w-6 h-6" />
       </div>
       <div>
<h3 className="title-newtab mb-1">
         {tip.title}
        </h3>
        <p className="text-sm text-[var(--text-secondary)]">
         {tip.description}
        </p>
       </div>
      </ZenithCard>
     );
    })}
   </div>
  </div>
 );
}
