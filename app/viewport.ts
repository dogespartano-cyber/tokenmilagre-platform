import type { Viewport } from 'next';

/**
 * Viewport configuration for the application
 * 
 * Sets the theme-color meta tag to match the background color
 * so Android navigation bar respects the app theme.
 */
export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#F3F4F6' }, // --bg-primary light
        { media: '(prefers-color-scheme: dark)', color: '#050A14' },  // --bg-primary dark
    ],
    colorScheme: 'dark light',
};
