import type { Meta, StoryObj } from '@storybook/react';
import { FearGreedGauge } from './FearGreedGauge';
import { mockFearGreed, mockFearGreedExtreme } from './mocks';

const meta: Meta<typeof FearGreedGauge> = {
    title: 'Zenith/FearGreedGauge',
    component: FearGreedGauge,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'radio',
            options: ['mobile', 'desktop', 'both'],
        },
        gaugeValue: {
            control: { type: 'range', min: 0, max: 100 },
        },
    },
};

export default meta;
type Story = StoryObj<typeof FearGreedGauge>;

export const Greed: Story = {
    args: {
        fearGreed: mockFearGreed,
        gaugeValue: 75,
        variant: 'both', // Show in storybook regardless of viewport
    },
};

export const ExtremeFear: Story = {
    args: {
        fearGreed: mockFearGreedExtreme,
        gaugeValue: 15,
        variant: 'both',
    },
};

export const MobileVariant: Story = {
    args: {
        fearGreed: mockFearGreed,
        gaugeValue: 50,
        variant: 'mobile',
    },
};

export const DesktopVariant: Story = {
    args: {
        fearGreed: mockFearGreed,
        gaugeValue: 50,
        variant: 'desktop',
    },
};
