/**
 * Tipos centralizados para Resource
 */

export interface Resource {
  id: string;
  slug: string;
  name: string;
  category: ResourceCategory;
  verified: boolean;

  // Básico
  shortDescription: string;
  officialUrl: string;
  platforms: string; // JSON array: ["Web", "iOS", "Android"]
  tags: string; // JSON array: ["DeFi", "NFTs"]

  // Hero section
  heroTitle: string;
  heroDescription: string;
  heroGradient: string;

  // Why good section
  whyGoodTitle: string;
  whyGoodContent: string; // JSON array de paragraphs

  // Features
  features: string; // JSON array: [{ icon, title, description }]

  // How to start
  howToStartTitle: string;
  howToStartSteps: string; // JSON array: [{ number, title, description }]

  // Pros and Cons
  pros: string; // JSON array
  cons: string; // JSON array

  // FAQ
  faq: string; // JSON array: [{ question, answer }]

  // Security tips
  securityTips: string; // JSON array: [{ icon, title, description }]

  // Auditoria
  securityAudit?: string | null;
  securityAuditDate?: Date | string | null;
  auditedByCommunity: boolean;

  // Ferramentas Interativas
  toolConfig?: string | null;
  interactiveType?: 'calculator' | 'simulator' | 'map' | null;

  // Opcionais
  showCompatibleWallets: boolean;
  relatedResources?: string | null; // JSON array de slugs

  // Metadados
  views: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  lastVerified: Date | string;
}

export type ResourceCategory =
  | 'wallets'
  | 'exchanges'
  | 'browsers'
  | 'defi'
  | 'explorers'
  | 'tools';

/**
 * Item de recurso para homepage/listagens
 */
export interface ResourceItem {
  name: string;
  category: string;
  description: string;
  gradient: string;
  stats: string;
  verified: boolean;
  url: string;
}

/**
 * Feature de recurso (parsed from JSON)
 */
export interface ResourceFeature {
  icon: string;
  title: string;
  description: string;
}

/**
 * Passo de "Como Começar" (parsed from JSON)
 */
export interface ResourceStep {
  number: number;
  title: string;
  description: string;
}

/**
 * FAQ de recurso (parsed from JSON)
 */
export interface ResourceFAQ {
  question: string;
  answer: string;
}

/**
 * Security Tip (parsed from JSON)
 */
export interface ResourceSecurityTip {
  icon: string;
  title: string;
  description: string;
}
