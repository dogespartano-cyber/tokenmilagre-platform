import type { Meta, StoryObj } from '@storybook/react';
import {
  Skeleton,
  NewsCardSkeleton,
  ArticleSkeleton,
  NewsGridSkeleton,
  ListSkeleton,
} from './SkeletonLoader';

/**
 * SkeletonLoader Component Stories
 *
 * Skeleton loaders provide visual placeholder content while actual data is loading.
 * They improve perceived performance by giving users feedback that content is on its way.
 *
 * ## Features
 * - Multiple pre-built skeleton variants
 * - Pulsing animation effect
 * - Customizable sizing with Tailwind classes
 * - Accessible (ARIA attributes for screen readers)
 * - Responsive layouts
 *
 * ## Available Components
 * - **Skeleton**: Base component for custom layouts
 * - **NewsCardSkeleton**: News card layout
 * - **ArticleSkeleton**: Full article page layout
 * - **NewsGridSkeleton**: Grid of news cards
 * - **ListSkeleton**: Vertical list with avatars
 */
const meta = {
  title: 'Components/SkeletonLoader',
  component: Skeleton,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Skeleton loader components for displaying loading states with visual placeholders.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Base skeleton component with custom dimensions
 */
export const BaseSkeleton: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="font-bold">Base Skeleton Examples</h3>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-12 w-12 rounded-full" />
    </div>
  ),
};

/**
 * News card skeleton for news listing pages
 */
export const NewsCard: Story = {
  render: () => <NewsCardSkeleton />,
};

/**
 * Multiple news cards in a grid
 */
export const NewsGrid: Story = {
  render: () => <NewsGridSkeleton count={6} />,
};

/**
 * Customizable news grid count
 */
export const NewsGridCustomCount: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold mb-4">3 Cards</h3>
        <NewsGridSkeleton count={3} />
      </div>
      <div>
        <h3 className="font-bold mb-4">9 Cards</h3>
        <NewsGridSkeleton count={9} />
      </div>
    </div>
  ),
};

/**
 * Full article page skeleton
 */
export const Article: Story = {
  render: () => <ArticleSkeleton />,
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * List skeleton for user lists or comments
 */
export const List: Story = {
  render: () => <ListSkeleton count={5} />,
};

/**
 * Customizable list count
 */
export const ListCustomCount: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-bold mb-4">3 Items</h3>
        <ListSkeleton count={3} />
      </div>
      <div>
        <h3 className="font-bold mb-4">10 Items</h3>
        <ListSkeleton count={10} />
      </div>
    </div>
  ),
};

/**
 * Custom skeleton layouts examples
 */
export const CustomLayouts: Story = {
  render: () => (
    <div className="space-y-8">
      {/* Profile card skeleton */}
      <div>
        <h3 className="font-bold mb-4">Profile Card</h3>
        <div className="border rounded-lg p-6 bg-white">
          <div className="flex items-center gap-4 mb-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>

      {/* Table skeleton */}
      <div>
        <h3 className="font-bold mb-4">Table</h3>
        <div className="border rounded-lg overflow-hidden bg-white">
          <div className="p-4 border-b">
            <div className="flex gap-4">
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-5 w-1/4" />
              <Skeleton className="h-5 w-1/4" />
            </div>
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 border-b last:border-b-0">
              <div className="flex gap-4">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form skeleton */}
      <div>
        <h3 className="font-bold mb-4">Form</h3>
        <div className="border rounded-lg p-6 space-y-4 bg-white">
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  ),
};

/**
 * All skeleton types showcase
 */
export const AllTypes: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">All Skeleton Types</h2>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">1. Base Skeleton</h3>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">2. News Card Skeleton</h3>
        <NewsCardSkeleton />
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">3. List Skeleton</h3>
        <ListSkeleton count={3} />
      </div>
    </div>
  ),
};

/**
 * Simulating loading state with transition
 */
export const LoadingSimulation: Story = {
  render: () => {
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
      const timer = setTimeout(() => setIsLoading(false), 3000);
      return () => clearTimeout(timer);
    }, []);

    return (
      <div>
        <button
          onClick={() => setIsLoading(true)}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reload (3s)
        </button>

        {isLoading ? (
          <ListSkeleton count={5} />
        ) : (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="backdrop-blur-lg rounded-xl p-4 border-2 bg-white border-gray-200"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">Item {i + 1}</h4>
                    <p className="text-sm text-gray-600">This is actual content loaded after skeleton</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
};

// Add React import for the LoadingSimulation story
import React from 'react';
