import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Toast, { ToastType } from './Toast';

/**
 * Toast Component Stories
 *
 * The Toast component displays temporary notification messages to users.
 * It supports multiple types (success, error, info, warning) and automatically
 * dismisses after a configurable duration.
 *
 * ## Features
 * - Auto-dismiss with configurable duration
 * - Manual close button
 * - Multiple visual variants
 * - Accessible (ARIA labels, keyboard navigation)
 * - Responsive design
 *
 * ## Usage Examples
 * Use Toast to provide feedback after user actions:
 * - Success: "Settings saved successfully"
 * - Error: "Failed to upload file"
 * - Info: "New feature available"
 * - Warning: "Your session will expire soon"
 */
const meta = {
  title: 'Components/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A notification toast component that displays temporary messages with various types and auto-dismissal.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['success', 'error', 'info', 'warning'],
      description: 'Visual variant of the toast',
      table: {
        type: { summary: 'success | error | info | warning' },
        defaultValue: { summary: 'info' },
      },
    },
    message: {
      control: 'text',
      description: 'Message to display in the toast',
    },
    duration: {
      control: 'number',
      description: 'Auto-dismiss duration in milliseconds (0 to disable)',
      table: {
        defaultValue: { summary: '5000' },
      },
    },
    onClose: {
      description: 'Callback when toast is closed',
    },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default toast with success type
 */
export const Default: Story = {
  args: {
    id: 'toast-default',
    type: 'success',
    message: 'Operation completed successfully!',
    duration: 5000,
    onClose: (id) => console.log('Toast closed:', id),
  },
};

/**
 * Success toast for positive feedback
 */
export const Success: Story = {
  args: {
    id: 'toast-success',
    type: 'success',
    message: 'Your changes have been saved successfully.',
    duration: 5000,
    onClose: (id) => console.log('Success toast closed:', id),
  },
};

/**
 * Error toast for error messages
 */
export const Error: Story = {
  args: {
    id: 'toast-error',
    type: 'error',
    message: 'An error occurred while processing your request.',
    duration: 5000,
    onClose: (id) => console.log('Error toast closed:', id),
  },
};

/**
 * Info toast for informational messages
 */
export const Info: Story = {
  args: {
    id: 'toast-info',
    type: 'info',
    message: 'A new version of the app is available.',
    duration: 5000,
    onClose: (id) => console.log('Info toast closed:', id),
  },
};

/**
 * Warning toast for warning messages
 */
export const Warning: Story = {
  args: {
    id: 'toast-warning',
    type: 'warning',
    message: 'Your session will expire in 5 minutes.',
    duration: 5000,
    onClose: (id) => console.log('Warning toast closed:', id),
  },
};

/**
 * Toast without auto-dismiss (duration = 0)
 */
export const NoAutoDismiss: Story = {
  args: {
    id: 'toast-no-dismiss',
    type: 'info',
    message: 'This toast will not auto-dismiss. Click the close button.',
    duration: 0,
    onClose: (id) => console.log('Toast manually closed:', id),
  },
};

/**
 * Long message toast to show text wrapping
 */
export const LongMessage: Story = {
  args: {
    id: 'toast-long',
    type: 'info',
    message: 'This is a very long message to demonstrate how the toast component handles longer text content. The component should wrap the text appropriately and maintain good readability.',
    duration: 7000,
    onClose: (id) => console.log('Long message toast closed:', id),
  },
};

/**
 * Interactive example showing all toast types
 */
export const AllTypes = {
  render: () => {
    const [toasts, setToasts] = useState<Array<{ id: string; type: ToastType; message: string }>>([]);

    const addToast = (type: ToastType) => {
      const messages = {
        success: 'Success! Your action completed successfully.',
        error: 'Error! Something went wrong.',
        info: 'Info: Here\'s some information for you.',
        warning: 'Warning! Please be careful.',
      };

      const newToast = {
        id: `toast-${Date.now()}`,
        type,
        message: messages[type],
      };

      setToasts((prev) => [...prev, newToast]);
    };

    const removeToast = (id: string) => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => addToast('success')}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Show Success
          </button>
          <button
            onClick={() => addToast('error')}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Show Error
          </button>
          <button
            onClick={() => addToast('info')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Show Info
          </button>
          <button
            onClick={() => addToast('warning')}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Show Warning
          </button>
        </div>

        <div className="fixed top-4 right-4 flex flex-col gap-2 z-50">
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              id={toast.id}
              type={toast.type}
              message={toast.message}
              duration={5000}
              onClose={removeToast}
            />
          ))}
        </div>
      </div>
    );
  },
};
