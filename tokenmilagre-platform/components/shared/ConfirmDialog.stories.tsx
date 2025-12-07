import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import ConfirmDialog, { ConfirmDialogVariant } from './ConfirmDialog';

/**
 * ConfirmDialog Component Stories
 *
 * The ConfirmDialog component displays a modal confirmation dialog with
 * customizable variants for different action severities (danger, warning, info).
 *
 * ## Features
 * - Multiple visual variants (danger, warning, info)
 * - Backdrop click to close
 * - ESC key to close
 * - Focus trap
 * - Customizable labels
 * - Accessible (ARIA attributes, keyboard navigation)
 *
 * ## Usage Examples
 * Use ConfirmDialog to confirm destructive or important actions:
 * - Danger: Delete operations, permanent changes
 * - Warning: Actions with consequences
 * - Info: Non-critical confirmations
 */
const meta = {
  title: 'Components/ConfirmDialog',
  component: ConfirmDialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A modal confirmation dialog for confirming user actions with various severity levels.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Controls dialog visibility',
      table: {
        type: { summary: 'boolean' },
      },
    },
    title: {
      control: 'text',
      description: 'Dialog title',
    },
    message: {
      control: 'text',
      description: 'Dialog message/description',
    },
    confirmLabel: {
      control: 'text',
      description: 'Label for confirm button',
      table: {
        defaultValue: { summary: 'Confirmar' },
      },
    },
    cancelLabel: {
      control: 'text',
      description: 'Label for cancel button',
      table: {
        defaultValue: { summary: 'Cancelar' },
      },
    },
    variant: {
      control: 'select',
      options: ['danger', 'warning', 'info'],
      description: 'Visual variant of the dialog',
      table: {
        type: { summary: 'danger | warning | info' },
        defaultValue: { summary: 'danger' },
      },
    },
    onConfirm: {
      description: 'Callback when confirm button is clicked',
    },
    onCancel: {
      description: 'Callback when dialog is cancelled or closed',
    },
  },
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default danger variant for destructive actions
 */
export const Default: Story = {
  args: {
    isOpen: true,
    title: 'Confirmar Ação',
    message: 'Tem certeza que deseja realizar esta ação?',
    confirmLabel: 'Confirmar',
    cancelLabel: 'Cancelar',
    variant: 'danger',
    onConfirm: () => console.log('Confirmed'),
    onCancel: () => console.log('Cancelled'),
  },
};

/**
 * Danger variant for destructive actions like deleting items
 */
export const DangerDelete: Story = {
  args: {
    isOpen: true,
    title: 'Excluir Item',
    message: 'Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.',
    confirmLabel: 'Excluir',
    cancelLabel: 'Cancelar',
    variant: 'danger',
    onConfirm: () => console.log('Item deleted'),
    onCancel: () => console.log('Delete cancelled'),
  },
};

/**
 * Warning variant for actions with consequences
 */
export const Warning: Story = {
  args: {
    isOpen: true,
    title: 'Ação Importante',
    message: 'Esta ação pode afetar outros usuários. Deseja continuar?',
    confirmLabel: 'Continuar',
    cancelLabel: 'Voltar',
    variant: 'warning',
    onConfirm: () => console.log('Action confirmed'),
    onCancel: () => console.log('Action cancelled'),
  },
};

/**
 * Info variant for non-critical confirmations
 */
export const Info: Story = {
  args: {
    isOpen: true,
    title: 'Confirmar Envio',
    message: 'Deseja enviar este formulário agora?',
    confirmLabel: 'Enviar',
    cancelLabel: 'Revisar',
    variant: 'info',
    onConfirm: () => console.log('Form submitted'),
    onCancel: () => console.log('Review form'),
  },
};

/**
 * Long message example
 */
export const LongMessage: Story = {
  args: {
    isOpen: true,
    title: 'Termos e Condições',
    message: 'Ao confirmar, você concorda com nossos termos de serviço e política de privacidade. Esta ação irá criar uma nova conta e você receberá um email de confirmação. Seus dados serão processados de acordo com a LGPD.',
    confirmLabel: 'Aceitar',
    cancelLabel: 'Recusar',
    variant: 'info',
    onConfirm: () => console.log('Terms accepted'),
    onCancel: () => console.log('Terms declined'),
  },
};

/**
 * Custom labels example
 */
export const CustomLabels: Story = {
  args: {
    isOpen: true,
    title: 'Sair da Aplicação',
    message: 'Você tem alterações não salvas. Deseja sair mesmo assim?',
    confirmLabel: 'Sair sem Salvar',
    cancelLabel: 'Voltar',
    variant: 'warning',
    onConfirm: () => console.log('Exiting without saving'),
    onCancel: () => console.log('Staying in app'),
  },
};

/**
 * Interactive example with state management
 */
export const Interactive = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [variant, setVariant] = useState<ConfirmDialogVariant>('danger');
    const [result, setResult] = useState<string>('');

    const handleOpen = (selectedVariant: ConfirmDialogVariant) => {
      setVariant(selectedVariant);
      setIsOpen(true);
      setResult('');
    };

    const handleConfirm = () => {
      setResult(`Confirmed (${variant})`);
      setIsOpen(false);
    };

    const handleCancel = () => {
      setResult(`Cancelled (${variant})`);
      setIsOpen(false);
    };

    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => handleOpen('danger')}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Show Danger
          </button>
          <button
            onClick={() => handleOpen('warning')}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Show Warning
          </button>
          <button
            onClick={() => handleOpen('info')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Show Info
          </button>
        </div>

        {result && (
          <div className="p-4 bg-gray-100 rounded">
            <strong>Result:</strong> {result}
          </div>
        )}

        <ConfirmDialog
          isOpen={isOpen}
          title={`${variant.charAt(0).toUpperCase() + variant.slice(1)} Dialog`}
          message={`This is a ${variant} confirmation dialog. Click confirm or cancel to see the result.`}
          confirmLabel="Confirm"
          cancelLabel="Cancel"
          variant={variant}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      </div>
    );
  },
};

/**
 * Keyboard navigation example
 */
export const KeyboardNavigation = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="flex flex-col gap-4">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Open Dialog
        </button>

        <div className="p-4 bg-gray-100 rounded text-sm">
          <strong>Keyboard shortcuts:</strong>
          <ul className="list-disc list-inside mt-2">
            <li>Press ESC to close the dialog</li>
            <li>Tab to navigate between buttons</li>
            <li>Enter to activate focused button</li>
          </ul>
        </div>

        <ConfirmDialog
          isOpen={isOpen}
          title="Keyboard Navigation"
          message="Try using ESC to close, or Tab to navigate between buttons."
          confirmLabel="Confirm"
          cancelLabel="Cancel"
          variant="info"
          onConfirm={() => {
            console.log('Confirmed via keyboard or mouse');
            setIsOpen(false);
          }}
          onCancel={() => {
            console.log('Cancelled via keyboard or mouse');
            setIsOpen(false);
          }}
        />
      </div>
    );
  },
};
