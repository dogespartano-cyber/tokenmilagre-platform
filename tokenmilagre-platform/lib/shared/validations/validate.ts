import { z } from 'zod';
import { NextResponse } from 'next/server';

/**
 * Helper para validar dados com Zod e retornar resposta formatada
 *
 * @param schema - Schema Zod para validação
 * @param data - Dados a serem validados
 * @returns Objeto com sucesso/erro e dados validados ou erros
 */
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown) {
  try {
    const validatedData = schema.parse(data);
    return { success: true as const, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zodError = error as z.ZodError<T>;
      const errors = zodError.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return {
        success: false as const,
        errors,
        message: 'Validação falhou',
      };
    }

    return {
      success: false as const,
      errors: [],
      message: 'Erro desconhecido na validação',
    };
  }
}

/**
 * Helper para validar e retornar NextResponse com erro formatado
 *
 * @param schema - Schema Zod para validação
 * @param data - Dados a serem validados
 * @returns NextResponse com erro 400 se validação falhar, ou dados validados
 */
export function validateOrRespond<T>(schema: z.ZodSchema<T>, data: unknown) {
  const result = validateData(schema, data);

  if (!result.success) {
    return NextResponse.json(
      {
        error: result.message,
        details: result.errors,
      },
      { status: 400 }
    );
  }

  return { data: result.data };
}

/**
 * Helper para validar query parameters de URL
 *
 * @param searchParams - URLSearchParams do Next.js
 * @param schema - Schema Zod para validação
 * @returns Dados validados ou erro
 */
export function validateSearchParams<T>(
  searchParams: URLSearchParams,
  schema: z.ZodSchema<T>
) {
  const params = Object.fromEntries(searchParams.entries());
  return validateData(schema, params);
}
