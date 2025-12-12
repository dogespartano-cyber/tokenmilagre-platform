/**
 * ESLint Plugin: No Hardcoded Colors
 * 
 * Previne o uso de cores hexadecimais hardcoded em código JSX.
 * Força o uso de CSS variables (var(--token)) ou classes Tailwind.
 * 
 * @module eslint-plugin-theme
 */

/**
 * Cores permitidas (identidade visual de terceiros e gradientes)
 * Estas cores são exceções intencionais
 */
const ALLOWED_COLORS = [
    // Discord brand color
    '#5865F2', '#4752C4',
    // Telegram brand color  
    '#0088cc', '#0077b3',
    // Bitcoin brand color
    '#F7931A',
    // Ethereum brand color
    '#627EEA',
    // Solana brand color
    '#9945FF', '#14F195',
];

/**
 * Arquivos ignorados (não aplicar regra)
 */
const IGNORED_PATTERNS = [
    // Storybook
    '.stories.',
    // CSS files (variáveis são definidas lá)
    'globals.css',
    // Tailwind config
    'tailwind.config',
];

/**
 * Detecta se uma string contém cor hexadecimal
 * @param {string} value 
 * @returns {RegExpMatchArray | null}
 */
function findHexColors(value) {
    // Matches #RGB, #RRGGBB, #RRGGBBAA
    return value.match(/#[0-9A-Fa-f]{3,8}\b/g);
}

/**
 * Verifica se a cor está na lista de permitidas
 * @param {string} color 
 * @returns {boolean}
 */
function isAllowedColor(color) {
    return ALLOWED_COLORS.some(allowed =>
        allowed.toLowerCase() === color.toLowerCase()
    );
}

/**
 * Verifica se o arquivo deve ser ignorado
 * @param {string} filename 
 * @returns {boolean}
 */
function shouldIgnoreFile(filename) {
    return IGNORED_PATTERNS.some(pattern => filename.includes(pattern));
}

/**
 * Regra ESLint: no-hardcoded-colors
 */
const noHardcodedColors = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Proíbe o uso de cores hexadecimais hardcoded. Use var(--token) ou classes Tailwind.',
            category: 'Best Practices',
            recommended: true,
        },
        messages: {
            hardcodedColor: 'Cor hardcoded "{{color}}" detectada. Use CSS variable (var(--token)) ou classe Tailwind com dark: equivalente.',
        },
        schema: [],
    },

    create(context) {
        const filename = context.getFilename();

        // Ignorar arquivos na lista de exceções
        if (shouldIgnoreFile(filename)) {
            return {};
        }

        return {
            // Verificar strings literais em JSX
            Literal(node) {
                if (typeof node.value !== 'string') return;

                const colors = findHexColors(node.value);
                if (!colors) return;

                for (const color of colors) {
                    if (!isAllowedColor(color)) {
                        context.report({
                            node,
                            messageId: 'hardcodedColor',
                            data: { color },
                        });
                    }
                }
            },

            // Verificar template literals
            TemplateLiteral(node) {
                for (const quasi of node.quasis) {
                    const colors = findHexColors(quasi.value.raw);
                    if (!colors) continue;

                    for (const color of colors) {
                        if (!isAllowedColor(color)) {
                            context.report({
                                node,
                                messageId: 'hardcodedColor',
                                data: { color },
                            });
                        }
                    }
                }
            },

            // Verificar propriedades de objeto (style={{ color: '#fff' }})
            Property(node) {
                if (
                    node.value &&
                    node.value.type === 'Literal' &&
                    typeof node.value.value === 'string'
                ) {
                    const colors = findHexColors(node.value.value);
                    if (!colors) return;

                    for (const color of colors) {
                        if (!isAllowedColor(color)) {
                            context.report({
                                node: node.value,
                                messageId: 'hardcodedColor',
                                data: { color },
                            });
                        }
                    }
                }
            },
        };
    },
};

/**
 * Plugin ESLint para regras de tema
 */
const plugin = {
    meta: {
        name: 'eslint-plugin-theme',
        version: '1.0.0',
    },
    rules: {
        'no-hardcoded-colors': noHardcodedColors,
    },
};

export default plugin;
