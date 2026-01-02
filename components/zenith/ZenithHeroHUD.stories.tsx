import type { Meta, StoryObj } from '@storybook/react';
import { ZenithHeroHUD } from './ZenithHeroHUD';
import { mockMarketData, mockDailyAnalysis } from './mocks';

const meta: Meta<typeof ZenithHeroHUD> = {
    title: 'Zenith/ZenithHeroHUD',
    component: ZenithHeroHUD,
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
    },
};

export default meta;
type Story = StoryObj<typeof ZenithHeroHUD>;

export const Default: Story = {
    args: {
        marketData: mockMarketData,
        dailyAnalysis: mockDailyAnalysis,
    },
};

export const LoadingState: Story = {
    args: {
        marketData: null,
        dailyAnalysis: null,
    },
};
