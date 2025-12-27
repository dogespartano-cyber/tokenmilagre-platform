'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
 faArrowLeft,
 faSpinner,
 faSave,
 faExclamationTriangle,
 faPaperPlane,
 faPen
} from '@fortawesome/free-solid-svg-icons';
import { AdminRoute } from '@/lib/domains/users';
import ArticlePreview from '@/components/admin/ArticlePreview';

function EditorContent() {
 const router = useRouter();
 const searchParams = useSearchParams();
 const type = searchParams.get('type'); // 'resource', 'news', 'educational'
 const slug = searchParams.get('slug');
 const refineSectionRef = useRef<HTMLDivElement>(null);

 const [item, setItem] = useState<any>(null);
 const [editedItem, setEditedItem] = useState<any>(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const [saving, setSaving] = useState(false);
 const [refinePrompt, setRefinePrompt] = useState('');
 const [refining, setRefining] = useState(false);

 useEffect(() => {
  if (!type || !slug) {
   setError('Parâmetros inválidos');
   setLoading(false);
   return;
  }

  fetchItem();
 }, [type, slug]);

 // Auto-scroll to refine section when it appears
 useEffect(() => {
  if (editedItem && refineSectionRef.current) {
   setTimeout(() => {
    refineSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
   }, 100);
  }
 }, [editedItem]);

 const fetchItem = async () => {
  try {
   setLoading(true);

   const endpoint = type === 'resource'
    ? `/api/resources/${slug}`
    : `/api/articles/${slug}`;

   const response = await fetch(endpoint);
   const data = await response.json();

   if (!data.success) {
    throw new Error(data.error || 'Erro ao buscar item');
   }

   let fetchedItem = data.data;

   // Parse JSON fields for articles
   if (type !== 'resource' && fetchedItem) {
    fetchedItem = {
     ...fetchedItem,
     tags: typeof fetchedItem.tags === 'string' ? JSON.parse(fetchedItem.tags) : fetchedItem.tags,
    };
   }

   // Parse JSON fields for resources
   if (type === 'resource' && fetchedItem) {
    fetchedItem = {
     ...fetchedItem,
     platforms: typeof fetchedItem.platforms === 'string' ? JSON.parse(fetchedItem.platforms) : fetchedItem.platforms,
     tags: typeof fetchedItem.tags === 'string' ? JSON.parse(fetchedItem.tags) : fetchedItem.tags,
     features: typeof fetchedItem.features === 'string' ? JSON.parse(fetchedItem.features) : fetchedItem.features,
     howToStartSteps: typeof fetchedItem.howToStartSteps === 'string' ? JSON.parse(fetchedItem.howToStartSteps) : fetchedItem.howToStartSteps,
     pros: typeof fetchedItem.pros === 'string' ? JSON.parse(fetchedItem.pros) : fetchedItem.pros,
     cons: typeof fetchedItem.cons === 'string' ? JSON.parse(fetchedItem.cons) : fetchedItem.cons,
     faq: typeof fetchedItem.faq === 'string' ? JSON.parse(fetchedItem.faq) : fetchedItem.faq,
     securityTips: typeof fetchedItem.securityTips === 'string' ? JSON.parse(fetchedItem.securityTips) : fetchedItem.securityTips,
     whyGoodContent: typeof fetchedItem.whyGoodContent === 'string' ? JSON.parse(fetchedItem.whyGoodContent) : fetchedItem.whyGoodContent,
     relatedResources: fetchedItem.relatedResources ? (typeof fetchedItem.relatedResources === 'string' ? JSON.parse(fetchedItem.relatedResources) : fetchedItem.relatedResources) : [],
    };
   }

   setItem(fetchedItem);
   setEditedItem(fetchedItem);
  } catch (err) {
   setError(err instanceof Error ? err.message : 'Erro desconhecido');
  } finally {
   setLoading(false);
  }
 };

 const handleRefine = async () => {
  if (!refinePrompt.trim() || !editedItem) return;

  const refinementRequest = refinePrompt.trim();
  setRefinePrompt('');
  setRefining(true);

  try {
   const response = await fetch('/api/refine-article', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
     article: editedItem,
     refinementPrompt: refinementRequest,
     articleType: type
    })
   });

   if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Erro ao refinar artigo');
   }

   const { article: refinedArticle } = await response.json();

   setEditedItem({
    ...refinedArticle,
    type: type
   });

   alert('✅ Artigo refinado com sucesso!');

  } catch (error: any) {
   console.error('Erro ao refinar:', error);
   alert(`❌ Erro ao refinar: ${error.message}`);
  } finally {
   setRefining(false);
  }
 };

 const handleSave = async () => {
  setSaving(true);
  try {
   const apiEndpoint = type === 'resource'
    ? `/api/resources/${slug}`
    : `/api/articles/${slug}`;

   // Preparar dados para envio
   const dataToSave = { ...editedItem };

   // Para artigos, garantir que tags seja string JSON
   if (type !== 'resource') {
    dataToSave.tags = typeof dataToSave.tags === 'string'
     ? dataToSave.tags
     : JSON.stringify(dataToSave.tags || []);
   }

   const response = await fetch(apiEndpoint, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataToSave)
   });

   if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Erro ao salvar');
   }

   alert('✅ Salvo com sucesso!');
   router.push('/dashboard/artigos');

  } catch (error: any) {
   alert(`Erro ao salvar: ${error.message}`);
  } finally {
   setSaving(false);
  }
 };

 if (!type || !slug) {
  return (
   <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
    <div className="text-center">
     <FontAwesomeIcon icon={faExclamationTriangle} className="text-5xl mb-4 " />
     <p className="text-xl" style={{ color: 'var(--text-primary)' }}>Parâmetros inválidos</p>
    </div>
   </div>
  );
 }

 if (loading) {
  return (
   <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
    <FontAwesomeIcon icon={faSpinner} spin className="text-5xl" style={{ color: 'var(--brand-primary)' }} />
   </div>
  );
 }

 if (error || !item) {
  return (
   <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
    <div className="text-center">
     <FontAwesomeIcon icon={faExclamationTriangle} className="text-5xl mb-4 " />
     <p className="text-xl mb-4" style={{ color: 'var(--text-primary)' }}>{error || 'Item não encontrado'}</p>
     <button
      onClick={() => router.push('/dashboard/artigos')}
      className="px-6 py-3 rounded-lg font-bold"
      style={{ backgroundColor: 'var(--brand-primary)', color: 'white' }}
     >
      <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
      Voltar
     </button>
    </div>
   </div>
  );
 }

 return (
  <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
   <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8">
    {/* Header */}
    <div className="mb-8 flex items-center justify-between">
     <div>
      <button
       onClick={() => router.push('/dashboard/artigos')}
       className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-70 mb-4"
       style={{ color: 'var(--text-secondary)' }}
      >
       <FontAwesomeIcon icon={faArrowLeft} />
       Voltar para Artigos
      </button>
      <h1
className="text-4xl title-newtab mb-2"
       style={{ color: 'var(--text-primary)' }}
      >
       Editar com IA
      </h1>
      <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
       {type === 'resource' ? item.name : item.title}
      </p>
     </div>
     <button
      onClick={handleSave}
      disabled={saving}
      className="px-6 py-3 rounded-lg font-bold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      style={{ backgroundColor: '#10B981', color: 'white' }}
     >
      {saving ? (
       <>
        <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
        Salvando...
       </>
      ) : (
       <>
        <FontAwesomeIcon icon={faSave} className="mr-2" />
        Salvar Alterações
       </>
      )}
     </button>
    </div>

    {/* Preview do Artigo */}
    {editedItem && type !== 'resource' && (
     <div className="mb-8">
      <ArticlePreview
       article={{
        ...editedItem,
        content: editedItem.content || ''
       }}
       articleType={type as 'news' | 'educational'}
      />
     </div>
    )}

    {/* Seção de Refinamento com Gemini */}
    <div
     ref={refineSectionRef}
     className="rounded-2xl border p-6"
     style={{
      backgroundColor: 'var(--bg-elevated)',
      borderColor: 'var(--border-medium)',
     }}
    >
     <div className="flex items-center gap-3 mb-4">
      <div
       className="w-10 h-10 rounded-full flex items-center justify-center"
       style={{ background: 'linear-gradient(135deg, #7C3AED, #F59E0B)' }}
      >
       <FontAwesomeIcon icon={faPen} className="text-white" />
      </div>
      <div>
<h3 className="title-newtab text-lg" style={{ color: 'var(--text-primary)' }}>
        Refinar com Gemini
       </h3>
       <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        Peça mudanças, correções ou melhorias no artigo
       </p>
      </div>
     </div>

     <div className="flex gap-3">
      <input
       type="text"
       value={refinePrompt}
       onChange={(e) => setRefinePrompt(e.target.value)}
       onKeyDown={(e) => {
        if (e.key === 'Enter' && !refining && refinePrompt.trim()) {
         handleRefine();
        }
       }}
       placeholder="Ex: Adicione mais exemplos práticos, Melhore a introdução, Corrija erros..."
       disabled={refining}
       className="flex-1 px-4 py-3 rounded-lg border transition-all focus:outline-none focus:ring-2"
       style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--border-medium)',
        color: 'var(--text-primary)',
       }}
      />
      <button
       onClick={handleRefine}
       disabled={refining || !refinePrompt.trim()}
       className="px-6 py-3 rounded-lg font-bold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
       style={{
        background: 'linear-gradient(135deg, #7C3AED, #F59E0B)',
        color: 'white'
       }}
      >
       {refining ? (
        <>
         <FontAwesomeIcon icon={faSpinner} spin />
         Refinando...
        </>
       ) : (
        <>
         <FontAwesomeIcon icon={faPaperPlane} />
         Refinar
        </>
       )}
      </button>
     </div>

     <div className="mt-4 text-sm" style={{ color: 'var(--text-tertiary)' }}>
      💡 <strong>Dicas:</strong> Seja específico nas suas solicitações. Ex: "Adicione 3 exemplos práticos na seção X", "Simplifique a linguagem", "Adicione mais detalhes técnicos"
     </div>
    </div>
   </div>
  </div>
 );
}

export default function EditorPage() {
 return (
  <AdminRoute allowEditor={true}>
   <Suspense fallback={
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
     <FontAwesomeIcon icon={faSpinner} spin className="text-5xl" style={{ color: 'var(--brand-primary)' }} />
    </div>
   }>
    <EditorContent />
   </Suspense>
  </AdminRoute>
 );
}
