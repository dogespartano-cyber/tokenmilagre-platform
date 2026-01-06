#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListResourcesRequestSchema, ReadResourceRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { ROUTER_INSTRUCTIONS } from './router_content.js';

// Caminho absoluto para a pasta de workflows (ajuste conforme seu ambiente)
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function checkGraphitiStatus(): Promise<string> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 500);
        // Tenta conectar ao Graphiti (porta 8000)
        const response = await fetch('http://localhost:8000', {
            method: 'GET',
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        // Se responder, consideramos online (mesmo 404 significa que o server está lá)
        return "🟢 Online";
    } catch (error) {
        return "🔴 Offline";
    }
}

// Estratégia de Resolução de Caminho Robusta
const BASE_AGENT_DIR = '/home/zenfoco/Dev/tokenmilagre-platform/.agent';

const possiblePaths = [
    // 1. Workers subdirs (FONTE DA VERDADE)
    path.join(BASE_AGENT_DIR, 'workers', 'meta'),
    path.join(BASE_AGENT_DIR, 'workers', 'dev'),
    path.join(BASE_AGENT_DIR, 'workers', 'arch'),
    path.join(BASE_AGENT_DIR, 'workers', 'product'),
    // 2. Fallback para workflows (symlinks/legado)
    path.join(BASE_AGENT_DIR, 'workflows'),
    // 3. Relativo ao Processo (Se rodar da raiz)
    path.resolve(process.cwd(), '.agent', 'workflows'),
    // 4. Relativo ao Script Compilado (Se rodar de ./dist)
    path.resolve(__dirname, '../../../.agent/workflows')
];

// Encontra o primeiro path válido para usar como default
let WORKFLOWS_DIR = '';
for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
        WORKFLOWS_DIR = p;
        break;
    }
}

// Fallback para log de erro útil
if (!WORKFLOWS_DIR) {
    console.error(`CRITICAL: Could not define WORKFLOWS_DIR. Tried: ${JSON.stringify(possiblePaths)}`);
    WORKFLOWS_DIR = possiblePaths[0]; // Tenta o primeiro mesmo falhando para gerar erro de path depois
} else {
    console.error(`[Sentinel] Workflows directory resolved to: ${WORKFLOWS_DIR}`);
}

const server = new Server(
    {
        name: "mcp-sentinel",
        version: "1.0.0",
    },
    {
        capabilities: {
            resources: {},
            tools: {},
        },
    }
);

server.setRequestHandler(ListResourcesRequestSchema, async () => {
    return {
        resources: [
            {
                uri: "protocol://header/template",
                name: "Identity Header Template",
                mimeType: "text/plain",
                description: "The mandatory identity header template for all agent responses.",
            },
            {
                uri: "protocol://router/instructions",
                name: "Router Instructions (Hardened)",
                mimeType: "text/plain",
                description: "The immutable instructions for the Router Agent.",
            },
            {
                uri: "protocol://auth/init",
                name: "Session Initialization",
                mimeType: "text/plain",
                description: "Generates a session token for tool usage.",
            },
        ],
    };
});

// Estratégia de Resolução de Caminho Robusta... (mantida)

// 🔒 DIGITAL KILL SWITCH
// Se true, o servidor rejeita todas as conexões até ser reiniciado.
let SECURITY_LOCKDOWN = false;

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const uri = request.params.uri;

    // Se o sistema estiver em Lockdown, rejeita tudo imediatamente.
    if (SECURITY_LOCKDOWN) {
        return {
            contents: [{
                uri: uri,
                mimeType: "text/plain",
                text: `🔒 SYSTEM LOCKED 🔒\n\nA security breach was detected in this session.\nThe system has been locked effectively immediately.\n\nACTION: RESTART THE IDE/EXTENSION SERVER TO RESET.`
            }]
        };
    }

    // Legacy Template...
    if (uri === "protocol://header/template") {
        return {
            contents: [{
                uri: "protocol://header/template",
                mimeType: "text/plain",
                text: `🧠 Agent: [NOME]\n📡 Graphiti: [online/offline]\n📋 Contexto: [resumo de 1 linha]\n\n(Obrigatório em TODA resposta)`
            }]
        };
    }

    // Router Instructions - Served directly from Sentinel (Immutable)
    if (uri === "protocol://router/instructions") {
        return {
            contents: [{
                uri: uri,
                mimeType: "text/plain",
                text: ROUTER_INSTRUCTIONS
            }]
        };
    }

    // Auth Init - Generate Token
    if (uri === "protocol://auth/init") {
        const sessionToken = crypto.randomUUID();
        console.error(`[Sentinel] NEW SESSION TOKEN GENERATED: ${sessionToken}`);
        return {
            contents: [{
                uri: uri,
                mimeType: "text/plain",
                text: JSON.stringify({ token: sessionToken, valid_until: Date.now() + 3600000 })
            }]
        };
    }

    // New Identity Guard Protocol: protocol://identity/{name}/{token}
    const identityMatch = uri.match(/^protocol:\/\/identity\/([a-zA-Z0-9_-]+)\/([a-fA-F0-9]+)$/);
    if (identityMatch) {
        const agentName = identityMatch[1];
        const candidateToken = identityMatch[2];

        console.error(`[Sentinel] Verifying identity for ${agentName}...`);

        try {
            // 1. Localizar arquivo
            // Tenta maiúsculo primeiro (padrão) ou original
            let filename = `${agentName.toUpperCase()}-agent.md`;
            let filePath = path.join(WORKFLOWS_DIR, filename);

            if (!fs.existsSync(filePath)) {
                // Tenta nome exato se falhar
                filename = `${agentName}-agent.md`;
                filePath = path.join(WORKFLOWS_DIR, filename);
            }

            if (!fs.existsSync(filePath)) {
                throw new Error("Agent file not found");
            }

            // 2. Extrair Token Real
            const content = fs.readFileSync(filePath, 'utf8');
            const tokenMatch = content.match(/identity-token: (\w+)/);

            if (!tokenMatch) {
                throw new Error("Agent has no identity token registered");
            }

            const trueToken = tokenMatch[1].trim();

            // 3. Validar
            // Comparação segura
            const candidateBuffer = Buffer.from(candidateToken);
            const trueBuffer = Buffer.from(trueToken);

            // Simples verificação de tamanho antes do timingSafe
            if (candidateBuffer.length !== trueBuffer.length || !crypto.timingSafeEqual(candidateBuffer, trueBuffer)) {
                // 🚨 SECURITY BREACH DETECTED -> INITIATE LOCKDOWN
                console.error(`[Sentinel] SECURITY BREACH: Invalid token for ${agentName}. locking down system.`);
                SECURITY_LOCKDOWN = true;

                return {
                    contents: [{
                        uri: uri,
                        mimeType: "text/plain",
                        text: `🚨 SENTINEL SECURITY BREACH 🚨\n\nACCESS DENIED: Identity verification failed for agent '${agentName}'.\nToken received: ${candidateToken.substring(0, 4)}***\n\nSYSTEM IS NOW LOCKED due to potential impersonation attempt.\nYou cannot retry. Terminate session.`
                    }]
                };
            }

            // 4. Sucesso - Retornar Header Assinado com Link Físico
            // O link permite ao usuário clicar e verificar que o agente "existe" no disco.
            const fileUri = `file://${filePath}`;
            const graphitiStatus = await checkGraphitiStatus();

            return {
                contents: [{
                    uri: uri,
                    mimeType: "text/plain",
                    text: `🧠 **Agent:** [${agentName}](${fileUri}) (✅ VERIFIED)
🆔 **Token:** ${candidateToken}
📡 **Graphiti:** ${graphitiStatus}
📋 **Contexto:** [resumo de 1 linha]

(Identidade Confirmada pelo Sentinel Protocol)
<!-- DO NOT REMOVE HEADER -->`
                }]
            };

        } catch (error) {
            return {
                contents: [{
                    uri: uri,
                    mimeType: "text/plain",
                    text: `🚨 SENTINEL SYSTEM ERROR 🚨\n\nCould not verify identity: ${(error as Error).message}`
                }]
            };
        }
    }

    throw new Error("Resource not found");
});

server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "sentinel_status",
                description: "Checks if the Protocol Sentinel is active.",
                inputSchema: {
                    type: "object",
                    properties: {},
                },
            },
            {
                name: "sentinel_guard",
                description: "Strictly validates content against the Agent Identity Protocol. Returns 'PASSED' or 'HALLUCINATION ALERT'. Use this to self-correct before outputting to the user.",
                inputSchema: {
                    type: "object",
                    properties: {
                        agent_name: {
                            type: "string",
                            description: "The name of the agent claiming the content (e.g., 'ROUTER', 'CODIGO')."
                        },
                        content: {
                            type: "string",
                            description: "The full content/message to validate."
                        }
                    },
                    required: ["agent_name", "content"]
                }
            }
        ],
    };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name === "sentinel_status") {
        return {
            content: [
                {
                    type: "text",
                    text: "Protocol Sentinel is active and monitoring.",
                },
            ],
        };
    }

    if (request.params.name === "sentinel_guard") {
        const { agent_name, content } = request.params.arguments as { agent_name: string; content: string };

        // 1. Basic Header Check
        const headerRegex = new RegExp(`🧠 Agent: \\[?${agent_name}`, 'i');
        const hasHeader = headerRegex.test(content);
        const hasVisualCheck = content.includes("(✅ VERIFIED)");
        const hasSentinelSignature = content.includes("(Identidade Confirmada pelo Sentinel Protocol)");

        if (!hasHeader || !hasVisualCheck || !hasSentinelSignature) {
            return {
                content: [{
                    type: "text",
                    text: `🚨 HALLUCINATION ALERT 🚨\n\nCompliance Check FAILED for agent '${agent_name}'.\n\nMissing Elements:\n- Header Match: ${hasHeader ? '✅' : '❌'}\n- Verified Badges: ${hasVisualCheck ? '✅' : '❌'}\n- Sentinel Signature: ${hasSentinelSignature ? '✅' : '❌'}\n\nACTION: STOP. You are hallucinating your identity. RE-READ GEMINI.md immediately.`
                }],
                isError: true
            };
        }

        return {
            content: [{
                type: "text",
                text: "✅ COMPLIANCE CHECK PASSED. Identity appears valid."
            }]
        };
    }

    throw new Error("Tool not found");
});

const transport = new StdioServerTransport();
await server.connect(transport);
