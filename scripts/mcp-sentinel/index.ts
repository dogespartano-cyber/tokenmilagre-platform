#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListResourcesRequestSchema, ReadResourceRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

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
        ],
    };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    if (request.params.uri === "protocol://header/template") {
        return {
            contents: [
                {
                    uri: "protocol://header/template",
                    mimeType: "text/plain",
                    text: `🧠 Agent: [NOME]
📡 Graphiti: [online/offline]
📋 Contexto: [resumo de 1 linha]

(Obrigatório em TODA resposta)`,
                },
            ],
        };
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
    throw new Error("Tool not found");
});

const transport = new StdioServerTransport();
await server.connect(transport);
