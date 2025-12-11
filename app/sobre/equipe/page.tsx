import { redirect } from 'next/navigation';

export default function EquipePage() {
  // Redireciona para a página "sobre" principal
  // Não faz mais sentido ter uma página de "equipe" pois o projeto é solo
  redirect('/sobre');
}
