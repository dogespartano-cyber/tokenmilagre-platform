#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema, CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

const GRAPHITI_URL = "http://localhost:8000";

const server = new Server(
    {
        name: "mcp-graphiti",
        version: "1.0.0",
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "graphiti_search",
                description: "Search the Graphiti knowledge graph for relevant memories and context.",
                inputSchema: {
                    type: "object",
                    properties: {
                        query: { type: "string", description: "Semantic search query." },
                        limit: { type: "number", description: "Max results to return (default 3)." },
                    },
                    required: ["query"],
                },
            },
            {
                name: "graphiti_add_episode",
                description: "Record a new memory/episode into Graphiti.",
                inputSchema: {
                    type: "object",
                    properties: {
                        name: { type: "string", description: "Title of the episode." },
                        text: { type: "string", description: "Full content of the episode." },
                        source: { type: "string", description: "Source identifier (e.g. 'session', 'analysis')." },
                        source_description: { type: "string", description: "Context for the source." },
                    },
                    required: ["name", "text", "source"],
                },
            },
            {
                name: "graphiti_health",
                description: "Check if the Graphiti API is reachable.",
                inputSchema: {
                    type: "object",
                    properties: {},
                },
            },
        ],
    };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
        if (name === "graphiti_search") {
            const query = String(args?.query);
            const limit = Number(args?.limit) || 3;

            const response = await fetch(`${GRAPHITI_URL}/search`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query, limit }),
            });

            if (!response.ok) throw new Error(`Status: ${response.status}`);
            const data = await response.json();

            return {
                content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
            };
        }

        if (name === "graphiti_add_episode") {
            const response = await fetch(`${GRAPHITI_URL}/add-episode`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: "zenfoco",
                    ...args
                }),
            });

            if (!response.ok) throw new Error(`Status: ${response.status}`);
            const data = await response.json();

            return {
                content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
            };
        }

        if (name === "graphiti_health") {
            const response = await fetch(`${GRAPHITI_URL}/health`);
            if (!response.ok) throw new Error(`Status: ${response.status}`);
            const data = await response.json();

            return {
                content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
            };
        }

        throw new Error("Tool not found");
    } catch (error: any) {
        return {
            content: [{ type: "text", text: `Error connecting to Graphiti: ${error.message}` }],
            isError: true
        };
    }
});

const transport = new StdioServerTransport();
await server.connect(transport);
