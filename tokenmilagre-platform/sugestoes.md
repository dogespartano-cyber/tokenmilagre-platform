# Sugestões e Documentação Técnica

## Funcionalidade: Drag-and-Drop (Arrastar e Soltar)

**Biblioteca utilizada:** `@dnd-kit`

### Componentes Implementados

1.  **Sessões da Home** (Notícias, Gráficos, etc.):
    *   **Arquivo:** `app/page.tsx`
    *   **Componente Principal:** `HomePage`
    *   **Componente Interno:** `SortableSection`
    *   **Detalhe:** Implementado com uma alça de movimento (ícone `faGripVertical`) lateral estilo Notion para evitar conflitos de clique.

2.  **Sessão de Capitalização** (Métricas de Mercado):
    *   **Arquivo:** `app/components/home/ZenithMarketTicker.tsx`
    *   **Componente Principal:** `ZenithMarketTicker`
    *   **Componente Interno:** `SortableCard`
    *   **Detalhe:** Cards reordenáveis (Capitalização, Volume, Dominância BTC/ETH).

3.  **Botões "Comece por Aqui"**:
    *   **Arquivo:** `app/components/home/QuickStartGrid.tsx`
    *   **Componente Principal:** `QuickStartGrid`
    *   **Componente Interno:** `SortableCard`

4.  **Menu Lateral**:
    *   **Arquivo:** `app/components/layout/Sidebar.tsx`
    *   **Componente Principal:** `Sidebar`
    *   **Componente Interno:** `SortableMenuItem`

### Restaurar Padrão
Foi adicionado um botão "Restaurar Organização Padrão" no rodapé da página inicial que, ao ser confirmado, limpa as configurações salvas no `localStorage` e recarrega a página.
