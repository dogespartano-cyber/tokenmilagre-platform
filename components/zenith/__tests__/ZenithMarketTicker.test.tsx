import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ZenithMarketTicker } from '../ZenithMarketTicker';
import { mockMarketData } from '../mocks'; // Reusing mocks created for Storybook

// Mock useCryptoData hook
jest.mock('@/lib/domains/crypto/hooks/useCryptoData', () => ({
    useCryptoData: () => ({
        data: [],
        isLoading: false,
        error: null,
    }),
}));

// Mock dnd-kit (simplified for rendering tests)
jest.mock('@dnd-kit/core', () => ({
    ...jest.requireActual('@dnd-kit/core'),
    DndContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('@dnd-kit/sortable', () => ({
    ...jest.requireActual('@dnd-kit/sortable'),
    SortableContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    useSortable: () => ({
        attributes: {},
        listeners: {},
        setNodeRef: jest.fn(),
        transform: null,
        transition: null,
        isDragging: false,
    }),
}));

// Mock icon libraries to avoid ESM issues
jest.mock('@token-icons/react', () => ({
    TokenBTC: () => <div data-testid="token-btc" />,
    TokenETH: () => <div data-testid="token-eth" />,
}));

jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: () => <div data-testid="fa-icon" />,
}));

describe('ZenithMarketTicker', () => {
    it('renders nothing when marketData is null', () => {
        const { container } = render(<ZenithMarketTicker marketData={null} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('renders all ticker cards when marketData is provided', () => {
        render(<ZenithMarketTicker marketData={mockMarketData} />);

        // Check for titles (might appear multiple times due to FlipCard front/back/mobile/desktop)
        expect(screen.getAllByText('Capitalização')[0]).toBeInTheDocument();
        expect(screen.getAllByText('Volume 24h')[0]).toBeInTheDocument();
        expect(screen.getAllByText('Dominância BTC')[0]).toBeInTheDocument();
        expect(screen.getAllByText('Dominância ETH')[0]).toBeInTheDocument();
    });

    it('displays formatted market cap correctly', () => {
        render(<ZenithMarketTicker marketData={mockMarketData} />);
        // mockMarketData has 2.54T
        expect(screen.getByText('$2.54T')).toBeInTheDocument();
    });

    it('displays correct dominance values', () => {
        render(<ZenithMarketTicker marketData={mockMarketData} />);
        expect(screen.getByText('52.40%')).toBeInTheDocument(); // BTC
        expect(screen.getByText('16.80%')).toBeInTheDocument(); // ETH
    });
});
