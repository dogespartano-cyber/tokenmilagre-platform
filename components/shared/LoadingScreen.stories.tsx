import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import LoadingScreen from './LoadingScreen';

/**
 * LoadingScreen Component Stories
 *
 * The LoadingScreen component displays a full-screen loading animation
 * with the $MILAGRE logo. It automatically fades out after a configurable
 * duration and calls a completion callback.
 *
 * ## Features
 * - Full-screen overlay
 * - Animated $MILAGRE logo
 * - Configurable duration
 * - Smooth fade out transition
 * - Accessible (ARIA attributes)
 *
 * ## Usage Examples
 * Use LoadingScreen for:
 * - Initial app loading
 * - Route transitions
 * - Data fetching operations
 * - Authentication flows
 */
const meta = {
 title: 'Components/LoadingScreen',
 component: LoadingScreen,
 parameters: {
  layout: 'fullscreen',
  docs: {
   description: {
    component: 'A full-screen loading animation component with the $MILAGRE branding.',
   },
  },
 },
 tags: ['autodocs'],
 argTypes: {
  onLoadingComplete: {
   description: 'Callback when loading animation completes',
  },
  duration: {
   control: { type: 'number', min: 500, max: 5000, step: 100 },
   description: 'Duration before fade out starts (ms)',
   table: {
    defaultValue: { summary: '1500' },
   },
  },
  fadeOutDuration: {
   control: { type: 'number', min: 100, max: 2000, step: 100 },
   description: 'Duration of fade out animation (ms)',
   table: {
    defaultValue: { summary: '500' },
   },
  },
 },
} satisfies Meta<typeof LoadingScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default loading screen with standard timing
 */
export const Default: Story = {
 args: {
  onLoadingComplete: () => console.log('Loading complete'),
  duration: 1500,
  fadeOutDuration: 500,
 },
};

/**
 * Quick loading animation (1 second)
 */
export const Quick: Story = {
 args: {
  onLoadingComplete: () => console.log('Quick loading complete'),
  duration: 1000,
  fadeOutDuration: 300,
 },
};

/**
 * Slow loading animation (3 seconds)
 */
export const Slow: Story = {
 args: {
  onLoadingComplete: () => console.log('Slow loading complete'),
  duration: 3000,
  fadeOutDuration: 800,
 },
};

/**
 * Very fast loading (500ms)
 */
export const VeryFast: Story = {
 args: {
  onLoadingComplete: () => console.log('Very fast loading complete'),
  duration: 500,
  fadeOutDuration: 200,
 },
};

/**
 * Interactive example with state management
 */
export const Interactive = {
 render: () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCount, setLoadingCount] = useState(0);

  const startLoading = () => {
   setIsLoading(true);
   setLoadingCount((prev) => prev + 1);
  };

  const handleLoadingComplete = () => {
   setIsLoading(false);
   console.log('Loading completed!');
  };

  return (
   <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
    <div className="text-center">
<h2 className="title-newtab text-2xl mb-2">Loading Screen Demo</h2>
     <p className="text-gray-600 mb-4">
      Click the button to trigger the loading screen
     </p>
    </div>

    <button
     onClick={startLoading}
     disabled={isLoading}
     className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
    >
     {isLoading ? 'Loading...' : 'Start Loading'}
    </button>

    <div className="p-4 bg-gray-100 rounded">
     <p className="text-sm">
      <strong>Times triggered:</strong> {loadingCount}
     </p>
    </div>

    {isLoading && (
     <LoadingScreen
      onLoadingComplete={handleLoadingComplete}
      duration={1500}
      fadeOutDuration={500}
     />
    )}
   </div>
  );
 },
};

/**
 * With callback logging example
 */
export const WithCallbackLogging = {
 render: () => {
  const [isLoading, setIsLoading] = useState(true);
  const [logs, setLogs] = useState<string[]>(['Loading started...']);

  const handleLoadingComplete = () => {
   setLogs((prev) => [...prev, 'Loading completed!']);
   setIsLoading(false);
  };

  const restart = () => {
   setLogs(['Loading restarted...']);
   setIsLoading(true);
  };

  return (
   <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
    {!isLoading && (
     <div className="text-center">
<h2 className="title-newtab text-2xl mb-4">Loading Complete!</h2>
      <button
       onClick={restart}
       className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
      >
       Restart Loading
      </button>

      <div className="mt-6 p-4 bg-gray-100 rounded max-w-md">
<h3 className="title-newtab mb-2">Event Log:</h3>
       <ul className="text-sm text-left space-y-1">
        {logs.map((log, index) => (
         <li key={index} className="text-gray-700">
          {index + 1}. {log}
         </li>
        ))}
       </ul>
      </div>
     </div>
    )}

    {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}
   </div>
  );
 },
};

/**
 * Custom duration example
 */
export const CustomDuration = {
 render: () => {
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState(1500);

  const startLoading = (customDuration: number) => {
   setDuration(customDuration);
   setIsLoading(true);
  };

  return (
   <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8">
    <div className="text-center">
<h2 className="title-newtab text-2xl mb-4">Custom Duration Example</h2>
     <p className="text-gray-600 mb-4">Choose a loading duration:</p>
    </div>

    <div className="flex gap-2">
     <button
      onClick={() => startLoading(500)}
      className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
     >
      0.5s
     </button>
     <button
      onClick={() => startLoading(1500)}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
     >
      1.5s
     </button>
     <button
      onClick={() => startLoading(3000)}
      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
     >
      3s
     </button>
     <button
      onClick={() => startLoading(5000)}
      className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
     >
      5s
     </button>
    </div>

    {isLoading && (
     <LoadingScreen
      onLoadingComplete={() => setIsLoading(false)}
      duration={duration}
      fadeOutDuration={500}
     />
    )}
   </div>
  );
 },
};
