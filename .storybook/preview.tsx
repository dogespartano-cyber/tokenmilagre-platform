import type { Preview } from "@storybook/react";
import React from 'react';
import "../app/globals.css"; // Import global styles (Tailwind 4)

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        backgrounds: {
            default: 'dark',
            values: [
                {
                    name: 'light',
                    value: '#ffffff',
                },
                {
                    name: 'dark',
                    value: '#0f172a', // Obsidian/Slate-900
                },
            ],
        },
    },
    decorators: [
        (Story) => (
            <div className="font-sans antialiased" data-theme="dark">
                {/* Force Dark Mode wrapper for Zenith vibe */}
                <Story />
            </div>
        ),
    ],
};

export default preview;
