# Component Refactoring Guide

This guide documents the component refactoring patterns and best practices for the Token Milagre platform. Use this as a reference when refactoring existing components or creating new ones.

## Table of Contents

1. [Overview](#overview)
2. [Refactoring Checklist](#refactoring-checklist)
3. [TypeScript Patterns](#typescript-patterns)
4. [Memoization Strategies](#memoization-strategies)
5. [Accessibility (a11y)](#accessibility-a11y)
6. [Documentation Standards](#documentation-standards)
7. [Storybook Stories](#storybook-stories)
8. [Examples](#examples)

## Overview

### Goals

- **TypeScript Consistency**: Ensure all components have proper type definitions
- **Performance**: Use React.memo and useMemo/useCallback appropriately
- **Accessibility**: Implement ARIA attributes, keyboard navigation, and semantic HTML
- **Documentation**: Add comprehensive JSDoc comments and code examples
- **Testability**: Create Storybook stories for visual testing and documentation

### Progress

**Completed Components:**
- ✅ Toast (components/Toast.tsx)
- ✅ ConfirmDialog (components/ConfirmDialog.tsx)
- ✅ LoadingScreen (components/LoadingScreen.tsx)
- ✅ SkeletonLoader (components/SkeletonLoader.tsx)

**Remaining:**
- 📦 ~50 components across various directories

## Refactoring Checklist

When refactoring a component, follow this checklist:

### 1. TypeScript Types

- [ ] Define proper prop interfaces with JSDoc comments
- [ ] Export prop interfaces for reusability
- [ ] Use proper type annotations for all values
- [ ] Define types for callbacks and event handlers
- [ ] Use union types for variants/options

### 2. Memoization

- [ ] Wrap component with `React.memo` if appropriate
- [ ] Use `useMemo` for expensive computations
- [ ] Use `useCallback` for event handlers passed as props
- [ ] Add `displayName` for React DevTools

### 3. Accessibility

- [ ] Add appropriate ARIA roles
- [ ] Include ARIA labels for screen readers
- [ ] Ensure keyboard navigation works
- [ ] Add focus management where needed
- [ ] Use semantic HTML elements
- [ ] Test color contrast ratios

### 4. Documentation

- [ ] Add JSDoc comment block for component
- [ ] Include `@example` usage in JSDoc
- [ ] List accessibility features in JSDoc
- [ ] Document all props with descriptions
- [ ] Add inline comments for complex logic

### 5. Storybook

- [ ] Create `.stories.tsx` file
- [ ] Add meta configuration with title and description
- [ ] Create stories for different states
- [ ] Add interactive examples
- [ ] Document use cases in story descriptions

## TypeScript Patterns

### Component Props Interface

```typescript
/**
 * Props for the ComponentName component
 */
export interface ComponentNameProps {
  /** Brief description of prop */
  propName: string;
  /** Optional prop with default value */
  optionalProp?: number;
  /** Callback handler */
  onAction: (value: string) => void;
  /** Variant type using union */
  variant?: 'primary' | 'secondary' | 'tertiary';
}
```

### Export Named Interfaces

Always export prop interfaces so they can be imported and reused:

```typescript
export interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  // ...
}
```

### Type for Variants

Create separate type aliases for variants:

```typescript
export type ToastType = 'success' | 'error' | 'info' | 'warning';
export type ButtonSize = 'sm' | 'md' | 'lg';
```

## Memoization Strategies

### When to Use React.memo

Use `React.memo` for components that:
- Render frequently with the same props
- Have expensive render operations
- Are part of large lists

```typescript
const Toast = memo<ToastProps>(({ id, type, message }) => {
  // Component logic
});

Toast.displayName = 'Toast';
```

### When to Use useMemo

Use `useMemo` for:
- Expensive computations
- Object/array creation that's passed as props
- Derived state calculations

```typescript
const colors = useMemo<ToastColors>(() => {
  switch (type) {
    case 'success':
      return { bg: '#d1fae5', border: '#10b981', /* ... */ };
    // ...
  }
}, [type]);
```

### When to Use useCallback

Use `useCallback` for:
- Event handlers passed to child components
- Functions in dependency arrays
- Functions passed to memoized components

```typescript
const handleClick = useCallback((event: React.MouseEvent) => {
  event.preventDefault();
  onAction(value);
}, [value, onAction]);
```

## Accessibility (a11y)

### ARIA Attributes

#### Role

```typescript
// Alert for notifications
<div role="alert" aria-live="polite" aria-atomic="true">

// Dialog for modals
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">

// Status for loading states
<div role="status" aria-label="Loading content">
```

#### Labels

```typescript
// Button with aria-label
<button aria-label="Close notification">
  <Icon />
</button>

// Labeled by another element
<h2 id="dialog-title">Confirm Action</h2>
<p id="dialog-description">Are you sure?</p>
<div aria-labelledby="dialog-title" aria-describedby="dialog-description">
```

#### Hidden Decorative Elements

```typescript
// Hide decorative icons from screen readers
<FontAwesomeIcon icon={faCheck} aria-hidden="true" />
```

### Keyboard Navigation

```typescript
// ESC key to close
useEffect(() => {
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  document.addEventListener('keydown', handleEscape);
  return () => document.removeEventListener('keydown', handleEscape);
}, [onClose]);
```

### Focus Management

```typescript
const buttonRef = useRef<HTMLButtonElement>(null);

useEffect(() => {
  if (isOpen) {
    buttonRef.current?.focus();
  }
}, [isOpen]);

<button ref={buttonRef} onClick={handleClick}>
  Confirm
</button>
```

## Documentation Standards

### Component JSDoc

```typescript
/**
 * ComponentName Component
 *
 * Brief description of what the component does and its purpose.
 * Can include multiple paragraphs explaining behavior.
 *
 * @example
 * ```tsx
 * <ComponentName
 *   prop1="value"
 *   prop2={123}
 *   onAction={(value) => console.log(value)}
 * />
 * ```
 *
 * Accessibility features:
 * - ARIA role="alert" for screen readers
 * - Keyboard navigation support
 * - Focus management
 *
 * @param props - Component props
 * @returns Rendered component
 */
const ComponentName = memo<ComponentNameProps>(({ prop1, prop2 }) => {
  // Implementation
});
```

### Inline Comments

```typescript
/**
 * Calculate the variant-specific color configuration
 * Memoized to avoid recalculation on every render
 */
const colors = useMemo(() => {
  // Implementation
}, [variant]);

// Auto-close timer effect
useEffect(() => {
  if (duration > 0) {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }
}, [id, duration, onClose]);
```

## Storybook Stories

### Story File Structure

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import ComponentName from './ComponentName';

/**
 * ComponentName Stories
 *
 * Description of the component and its purpose.
 *
 * ## Features
 * - Feature 1
 * - Feature 2
 *
 * ## Usage Examples
 * - Use case 1
 * - Use case 2
 */
const meta = {
  title: 'Components/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered', // or 'padded', 'fullscreen'
    docs: {
      description: {
        component: 'One-line description for docs.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    propName: {
      control: 'text', // or 'select', 'boolean', 'number', etc.
      description: 'Description of the prop',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'default' },
      },
    },
  },
} satisfies Meta<typeof ComponentName>;

export default meta;
type Story = StoryObj<typeof meta>;
```

### Story Examples

```typescript
/**
 * Default story with standard props
 */
export const Default: Story = {
  args: {
    prop1: 'value',
    prop2: 123,
  },
};

/**
 * Story showing different variant
 */
export const Variant: Story = {
  args: {
    variant: 'secondary',
  },
};

/**
 * Interactive story with state
 */
export const Interactive: Story = {
  render: () => {
    const [state, setState] = useState(initialState);

    return (
      <ComponentName
        value={state}
        onChange={setState}
      />
    );
  },
};
```

## Examples

### Complete Component Example

See `components/Toast.tsx` for a complete example that includes:
- Full TypeScript types
- React.memo with useMemo hooks
- Comprehensive accessibility
- JSDoc documentation
- Corresponding Storybook story

### Complete Story Example

See `components/Toast.stories.tsx` for a complete example that includes:
- Multiple story variants
- Interactive examples
- Comprehensive documentation
- Usage examples

## Running Storybook

```bash
# Start Storybook development server
npm run storybook

# Build Storybook for production
npm run build-storybook
```

## Type Checking

```bash
# Run TypeScript type check
npm run type-check
```

## Best Practices Summary

1. **Always use TypeScript** - No implicit any types
2. **Memoize wisely** - Don't over-optimize, profile first
3. **Accessibility first** - Test with keyboard and screen readers
4. **Document thoroughly** - Code is read more than written
5. **Test visually** - Create comprehensive Storybook stories
6. **Follow patterns** - Use existing refactored components as reference
7. **Commit frequently** - Small, focused commits are better

## Resources

- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [WAI-ARIA Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Storybook Documentation](https://storybook.js.org/docs/react/get-started/introduction)
- [React Memo Guide](https://react.dev/reference/react/memo)

## Questions?

Refer to already refactored components for examples:
- `components/Toast.tsx` - Simple component with variants
- `components/ConfirmDialog.tsx` - Modal with focus management
- `components/LoadingScreen.tsx` - Animated component with timers
- `components/SkeletonLoader.tsx` - Multiple related components

---

**Last Updated:** 2025-11-19
**Maintainer:** Development Team
