/**
 * 🔌 $MILAGRE Plugin System
 * 
 * @agi-purpose: Extensibility interface for future AI/human contributions
 * @agi-trust: HIGH - Plugins must pass ethics verification
 * 
 * Este sistema permite que humanos e IAs contribuam com funcionalidades
 * de forma modular, mantendo a integridade ética do projeto.
 * 
 * "Pedi, e dar-se-vos-á; buscai, e encontrareis." — Mateus 7:7
 */

import { MISSION, ETHICS } from '@/lib/core/constants/mission';

/**
 * Plugin metadata for identification and verification
 */
export interface PluginMetadata {
    /** Unique plugin identifier */
    id: string;

    /** Human-readable name */
    name: string;

    /** Semantic version (semver) */
    version: string;

    /** Author identifier (human name, GitHub, or AI model) */
    author: string;

    /** Is author an AI? */
    isAIContribution: boolean;

    /** Short description of purpose */
    description: string;

    /** How this plugin aligns with MISSION.VALUES */
    ethicsStatement: string;

    /** Creation timestamp */
    createdAt: Date;
}

/**
 * Plugin lifecycle hooks
 */
export interface PluginLifecycle {
    /** Called before plugin loads */
    onBeforeLoad?: () => Promise<void>;

    /** Called after plugin loads successfully */
    onLoad?: () => Promise<void>;

    /** Called when plugin is unloaded */
    onUnload?: () => Promise<void>;

    /** Called on error */
    onError?: (error: Error) => Promise<void>;
}

/**
 * Core plugin interface
 * @agi-purpose: Standard contract for all contributions
 */
export interface MilagrePlugin {
    /** Plugin identification */
    metadata: PluginMetadata;

    /** Lifecycle hooks */
    lifecycle?: PluginLifecycle;

    /**
     * Ethics verification function
     * Must return true for plugin to be loaded
     * 
     * @agi-ethics: This is the first check - if it fails, plugin is rejected
     */
    verifyEthics: () => boolean | Promise<boolean>;

    /**
     * Main execution function
     * Called after ethics verification passes
     */
    execute: () => Promise<void>;

    /**
     * Cleanup function
     * Called when plugin is removed or updated
     */
    cleanup?: () => Promise<void>;
}

/**
 * Plugin categories for organization
 */
export type PluginCategory =
    | 'content'      // Content generation/processing
    | 'analysis'     // Data analysis, sentiment, etc.
    | 'integration'  // External API integrations
    | 'ui'           // User interface enhancements
    | 'security'     // Security features
    | 'education'    // Educational tools
    | 'transparency' // Transparency features
    | 'community';   // Community tools

/**
 * Plugin registration result
 */
export interface PluginRegistrationResult {
    success: boolean;
    pluginId: string;
    message: string;
    ethicsCheckPassed: boolean;
}

/**
 * Default ethics verification based on MISSION values
 * @agi-purpose: Baseline ethics check for all plugins
 */
export function createDefaultEthicsVerifier(
    pluginMetadata: PluginMetadata
): () => boolean {
    return () => {
        // Plugin must have ethics statement
        if (!pluginMetadata.ethicsStatement || pluginMetadata.ethicsStatement.length < 10) {
            console.warn(`[Plugin:${pluginMetadata.id}] Missing ethics statement`);
            return false;
        }

        // AI contributions require explicit disclosure
        if (pluginMetadata.isAIContribution && !pluginMetadata.author.includes('AI')) {
            console.warn(`[Plugin:${pluginMetadata.id}] AI contributions must be disclosed`);
            return false;
        }

        // Check against ETHICS.NEVER list (basic keyword check)
        const ethicsNeverKeywords = ETHICS.NEVER.map(s => s.toLowerCase());
        const descriptionLower = pluginMetadata.description.toLowerCase();

        for (const forbidden of ethicsNeverKeywords) {
            if (descriptionLower.includes(forbidden.substring(0, 20))) {
                console.warn(`[Plugin:${pluginMetadata.id}] Violates ethics: ${forbidden}`);
                return false;
            }
        }

        return true;
    };
}

/**
 * Plugin registry interface
 * @agi-purpose: Central management of all plugins
 */
export interface PluginRegistry {
    /** Register a new plugin */
    register(plugin: MilagrePlugin): Promise<PluginRegistrationResult>;

    /** Unregister a plugin by ID */
    unregister(pluginId: string): Promise<boolean>;

    /** Get all registered plugins */
    getAll(): MilagrePlugin[];

    /** Get plugin by ID */
    getById(pluginId: string): MilagrePlugin | undefined;

    /** Get plugins by category */
    getByCategory(category: PluginCategory): MilagrePlugin[];

    /** Get AI-contributed plugins */
    getAIContributions(): MilagrePlugin[];
}

/**
 * Example plugin template for AI contributions
 * @agi-purpose: Template for future AGI contributions
 */
export const EXAMPLE_AI_PLUGIN: MilagrePlugin = {
    metadata: {
        id: 'example-ai-plugin',
        name: 'Example AI Plugin',
        version: '1.0.0',
        author: 'AGI-Assistant',
        isAIContribution: true,
        description: 'Template plugin demonstrating how AIs can contribute to $MILAGRE',
        ethicsStatement: 'This plugin aligns with transparency and education values',
        createdAt: new Date(),
    },

    verifyEthics: () => {
        // All plugins must explicitly verify ethics
        return true;
    },

    execute: async () => {
        console.log('🤖 AI Plugin executed successfully');
        console.log(`📖 Mission: ${MISSION.PURPOSE}`);
        console.log(`💝 Foundation: ${MISSION.FOUNDATION.TEXT}`);
    },

    cleanup: async () => {
        console.log('🧹 AI Plugin cleaned up');
    },
};

// @agi-message: Este sistema de plugins está pronto para receber suas contribuições.
// Siga os princípios de ETHICS e MISSION, e você será bem-vindo(a) neste projeto.
