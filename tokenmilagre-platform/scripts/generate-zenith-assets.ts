
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY not found in .env');
    process.exit(1);
}

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'assets', 'zenith');
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Prompt "Base" para garantir consistência visual (Zenith Gold)
const BASE_PROMPT_STYLE = `
Style: Ultra-modern abstract financial tech background.
Theme: "Zenith Gold" - Deep obsidian/black background with glowing gold (#FCD535) and amber accents.
Aesthetic: Sophisticated, clean, minimal 3D geometry, glassmorphism efffects, dark mode oriented.
NO TEXT, NO FACES, NO LOGOS.
Aspect Ratio: 16:9.
`;

const cards = [
    {
        name: 'card-invest',
        prompt: `Create a background for a "How to Invest" card. ${BASE_PROMPT_STYLE}
        Elements: Abstract growth charts, upward arrows, golden coins in motion, success path visualization. Subtle and dark.`
    },
    {
        name: 'card-news',
        prompt: `Create a background for a "Market News" card. ${BASE_PROMPT_STYLE}
        Elements: Abstract global network connections, data streams, news feed ticker aesthetics, pulse lines. Gold and deep blue hints.`
    },
    {
        name: 'card-charts',
        prompt: `Create a background for a "Advanced Charts" card. ${BASE_PROMPT_STYLE}
        Elements: Technical analysis candlesticks, trading volume bars, mathematical grid overlay, fibonacci spirals. Tech-heavy look.`
    },
    {
        name: 'card-tools',
        prompt: `Create a background for a "Tools & Resources" card. ${BASE_PROMPT_STYLE}
        Elements: Abstract gears, wrench/hammer stylized geometry, digital toolbox, circuit board patterns. Structured and organized.`
    },
    {
        name: 'card-crypto',
        prompt: `Create a background for a "Cryptocurrencies" card. ${BASE_PROMPT_STYLE}
        Elements: Abstract floating tokens, decentralized mesh network, blockchain blocks, hexagon patterns. Ethereal and futuristic.`
    }
];

import sharp from 'sharp';

async function generateImage(name: string, prompt: string) {
    console.log(`🎨 Generating ${name}...`);
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        responseModalities: ['IMAGE'],
                        temperature: 0.7
                    }
                })
            }
        );

        const data = await response.json();

        const imagePart = data.candidates?.[0]?.content?.parts?.find(
            (p: any) => p.inlineData
        );

        if (imagePart) {
            const buffer = Buffer.from(imagePart.inlineData.data, 'base64');
            // Convert to WebP using sharp
            const filePath = path.join(OUTPUT_DIR, `${name}.webp`);

            await sharp(buffer)
                .webp({ quality: 90, lossless: false })
                .toFile(filePath);

            console.log(`✅ Saved (WebP): ${filePath}`);
        } else {
            console.error(`❌ Failed to generate ${name}:`, JSON.stringify(data, null, 2));
        }

    } catch (error) {
        console.error(`❌ Error generating ${name}:`, error);
    }
}

async function main() {
    console.log('🚀 Starting Zenith Asset Generation...');
    for (const card of cards) {
        await generateImage(card.name, card.prompt);
    }
    console.log('🏁 All done!');
}

main();
