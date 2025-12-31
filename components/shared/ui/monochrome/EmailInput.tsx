/**
 * EmailInput Component - Sem Roxo
 *
 * Input de email com validação visual integrada
 * - Validação em tempo real
 * - Estados de validação: válido, inválido, neutro
 * - Mensagens de erro descritivas
 * - Suporte a dark mode
 *
 * Acessibilidade:
 * - Labels associadas corretamente
 * - aria-describedby para mensagens de erro
 * - aria-invalid para estado de erro
 * - Focus visível com outline
 * - Contraste WCAG AA
 */

'use client';

import { useState, useCallback, InputHTMLAttributes, useId } from 'react';

interface EmailInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
    /** Label do campo */
    label?: string;
    /** Placeholder customizado */
    placeholder?: string;
    /** Mensagem de erro customizada */
    errorMessage?: string;
    /** Se deve validar em tempo real enquanto digita */
    validateOnChange?: boolean;
    /** Se deve validar ao sair do campo */
    validateOnBlur?: boolean;
    /** Callback quando o valor muda */
    onChange?: (value: string) => void;
    /** Callback quando a validação muda */
    onValidationChange?: (isValid: boolean) => void;
    /** Texto auxiliar abaixo do input */
    helperText?: string;
    /** Se o campo é obrigatório */
    required?: boolean;
    /** Tamanho do input */
    size?: 'sm' | 'md' | 'lg';
    /** Se deve mostrar ícone de status */
    showStatusIcon?: boolean;
}

// Regex para validação de email (RFC 5322 simplificado)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailInput({
    label,
    placeholder = 'Digite seu email',
    errorMessage = 'Por favor, insira um email válido',
    validateOnChange = true,
    validateOnBlur = true,
    onChange,
    onValidationChange,
    helperText,
    required = false,
    size = 'md',
    showStatusIcon = true,
    className = '',
    disabled,
    value: controlledValue,
    ...props
}: EmailInputProps) {
    const id = useId();
    const inputId = props.id || `email-input-${id}`;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    const [internalValue, setInternalValue] = useState('');
    const [touched, setTouched] = useState(false);
    const [validationState, setValidationState] = useState<'neutral' | 'valid' | 'invalid'>('neutral');

    const value = controlledValue !== undefined ? String(controlledValue) : internalValue;

    const validateEmail = useCallback((email: string): boolean => {
        if (!email) {
            return !required;
        }
        return EMAIL_REGEX.test(email);
    }, [required]);

    const updateValidation = useCallback((email: string) => {
        if (!email && !required) {
            setValidationState('neutral');
            onValidationChange?.(true);
            return;
        }

        const isValid = validateEmail(email);
        setValidationState(isValid ? 'valid' : 'invalid');
        onValidationChange?.(isValid);
    }, [validateEmail, required, onValidationChange]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;

        if (controlledValue === undefined) {
            setInternalValue(newValue);
        }

        onChange?.(newValue);

        if (validateOnChange && touched) {
            updateValidation(newValue);
        }
    };

    const handleBlur = () => {
        setTouched(true);
        if (validateOnBlur) {
            updateValidation(value);
        }
    };

    const handleFocus = () => {
        if (validationState === 'invalid') {
            // Mantém o estado de erro durante edição
        }
    };

    const showError = validationState === 'invalid' && touched;
    const showSuccess = validationState === 'valid' && touched && value;

    const describedBy = [
        showError ? errorId : null,
        helperText ? helperId : null
    ].filter(Boolean).join(' ') || undefined;

    return (
        <>
            <Styles />
            <div className={`email-input-wrapper email-input-${size} ${className}`}>
                {label && (
                    <label htmlFor={inputId} className="email-input-label">
                        {label}
                        {required && <span className="email-input-required" aria-hidden="true">*</span>}
                    </label>
                )}

                <div className={`email-input-container ${showError ? 'has-error' : ''} ${showSuccess ? 'has-success' : ''} ${disabled ? 'is-disabled' : ''}`}>
                    <span className="email-input-icon" aria-hidden="true">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                        </svg>
                    </span>

                    <input
                        {...props}
                        id={inputId}
                        type="email"
                        className="email-input"
                        placeholder={placeholder}
                        value={value}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onFocus={handleFocus}
                        disabled={disabled}
                        required={required}
                        aria-invalid={showError}
                        aria-describedby={describedBy}
                        autoComplete="email"
                    />

                    {showStatusIcon && (showError || showSuccess) && (
                        <span className={`email-input-status ${showError ? 'status-error' : 'status-success'}`} aria-hidden="true">
                            {showError ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="15" y1="9" x2="9" y2="15" />
                                    <line x1="9" y1="9" x2="15" y2="15" />
                                </svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                            )}
                        </span>
                    )}
                </div>

                {showError && (
                    <p id={errorId} className="email-input-error" role="alert">
                        {errorMessage}
                    </p>
                )}

                {helperText && !showError && (
                    <p id={helperId} className="email-input-helper">
                        {helperText}
                    </p>
                )}
            </div>
        </>
    );
}

function Styles() {
    return (
        <style jsx global>{`
      .email-input-wrapper {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        font-family: var(--font-sans);
        width: 100%;
      }

      .email-input-label {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: var(--text-primary);
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }

      .email-input-required {
        color: var(--state-error);
        font-weight: var(--font-weight-bold);
      }

      .email-input-container {
        display: flex;
        align-items: center;
        background-color: var(--bg-card);
        border: 2px solid var(--border-medium);
        border-radius: var(--radius-md);
        transition: all var(--transition-fast);
        position: relative;
      }

      .email-input-container:focus-within {
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px var(--color-primary-lighter);
      }

      .email-input-container.has-error {
        border-color: var(--state-error);
      }

      .email-input-container.has-error:focus-within {
        box-shadow: 0 0 0 3px var(--color-red-lighter);
      }

      .email-input-container.has-success {
        border-color: var(--state-success);
      }

      .email-input-container.has-success:focus-within {
        box-shadow: 0 0 0 3px var(--color-green-lighter);
      }

      .email-input-container.is-disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background-color: var(--color-neutral-light);
      }

      .email-input-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-left: 1rem;
        color: var(--text-tertiary);
      }

      .email-input-container.has-error .email-input-icon {
        color: var(--state-error);
      }

      .email-input-container.has-success .email-input-icon {
        color: var(--state-success);
      }

      .email-input {
        flex: 1;
        border: none;
        background: transparent;
        font-family: inherit;
        color: var(--text-primary);
        width: 100%;
        outline: none;
      }

      .email-input::placeholder {
        color: var(--text-tertiary);
      }

      .email-input:disabled {
        cursor: not-allowed;
      }

      .email-input-status {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-right: 1rem;
      }

      .email-input-status.status-error {
        color: var(--state-error);
      }

      .email-input-status.status-success {
        color: var(--state-success);
      }

      .email-input-error {
        font-size: var(--font-size-sm);
        color: var(--state-error);
        margin: 0;
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }

      .email-input-helper {
        font-size: var(--font-size-sm);
        color: var(--text-tertiary);
        margin: 0;
      }

      /* Sizes */
      .email-input-sm .email-input {
        padding: 0.5rem 0.75rem;
        font-size: var(--font-size-sm);
      }

      .email-input-sm .email-input-icon svg,
      .email-input-sm .email-input-status svg {
        width: 16px;
        height: 16px;
      }

      .email-input-md .email-input {
        padding: 0.75rem 1rem;
        font-size: var(--font-size-base);
      }

      .email-input-lg .email-input {
        padding: 1rem 1.25rem;
        font-size: var(--font-size-lg);
      }

      .email-input-lg .email-input-icon svg,
      .email-input-lg .email-input-status svg {
        width: 24px;
        height: 24px;
      }
    `}</style>
    );
}

/**
 * Hook para validação de email
 * Útil quando precisa validar emails em outros contextos
 */
export function useEmailValidation() {
    const validateEmail = useCallback((email: string): boolean => {
        if (!email) return false;
        return EMAIL_REGEX.test(email);
    }, []);

    const getEmailError = useCallback((email: string): string | null => {
        if (!email) return 'Email é obrigatório';
        if (!EMAIL_REGEX.test(email)) return 'Por favor, insira um email válido';
        return null;
    }, []);

    return { validateEmail, getEmailError };
}
