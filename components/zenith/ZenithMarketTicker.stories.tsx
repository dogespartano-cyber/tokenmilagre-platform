import type { Meta, StoryObj } from '@storybook/react';
import { ZenithMarketTicker } from './ZenithMarketTicker';
import { mockMarketData, mockMarketDataNegative } from './mocks';

// Mock dnd-kit context if needed or wrap in a decorator
// For now, testing basic rendering

const meta: Meta<typeof ZenithMarketTicker> = {
    title: 'Zenith/ZenithMarketTicker',
    component: ZenithMarketTicker,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
    },
};

export default meta;
type Story = StoryObj<typeof ZenithMarketTicker>;

export const BullMarket: Story = {
    args: {
        marketData: mockMarketData,
    },
};

export const BearMarket: Story = {
    args: {
        marketData: mockMarketDataNegative,
    },
};

export const LoadingState: Story = {
    args: {
        marketData: null,
    },
};
