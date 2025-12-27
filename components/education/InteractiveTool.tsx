'use client';

import { useState, useEffect } from 'react';
import { Calculator, TrendingUp, DollarSign, Info } from 'lucide-react';

interface ToolField {
 id: string;
 label: string;
 type: 'number' | 'slider' | 'select';
 defaultValue: number | string;
 min?: number;
 max?: number;
 step?: number;
 options?: { value: string; label: string }[];
 suffix?: string;
 info?: string;
}

interface ToolConfig {
 title: string;
 description: string;
 type: 'calculator' | 'simulator';
 fields: ToolField[];
 formula: string; // Nome da fórmula a ser usada
 resultLabel: string;
 resultSuffix?: string;
}

interface InteractiveToolProps {
 config: ToolConfig;
}

export default function InteractiveTool({ config }: InteractiveToolProps) {
 const [values, setValues] = useState<Record<string, number | string>>({});
 const [result, setResult] = useState<number | null>(null);

 // Inicializar valores padrão
 useEffect(() => {
  const initial: Record<string, number | string> = {};
  config.fields.forEach((field) => {
   initial[field.id] = field.defaultValue;
  });
  setValues(initial);
 }, [config]);

 // Calcular resultado quando valores mudam
 useEffect(() => {
  if (Object.keys(values).length > 0) {
   const calculated = calculateResult(config.formula, values);
   setResult(calculated);
  }
 }, [values, config.formula]);

 const handleChange = (id: string, value: number | string) => {
  setValues((prev) => ({ ...prev, [id]: value }));
 };

 // Função genérica de cálculo
 const calculateResult = (formula: string, vals: Record<string, number | string>): number => {
  try {
   switch (formula) {
    case 'dca': {
     // Dollar Cost Averaging
     const investment = Number(vals.monthlyInvestment || 0);
     const months = Number(vals.months || 0);
     const returnRate = Number(vals.returnRate || 0) / 100;

     let total = 0;
     for (let i = 0; i < months; i++) {
      total = (total + investment) * (1 + returnRate / 12);
     }
     return total;
    }

    case 'roi': {
     // Return on Investment
     const initial = Number(vals.initialInvestment || 0);
     const final = Number(vals.finalValue || 0);
     return ((final - initial) / initial) * 100;
    }

    case 'risk': {
     // Cálculo de risco simplificado
     const amount = Number(vals.investmentAmount || 0);
     const riskLevel = Number(vals.riskLevel || 1);
     const volatility = Number(vals.volatility || 10) / 100;

     return amount * volatility * riskLevel;
    }

    case 'compound': {
     // Juros compostos
     const principal = Number(vals.principal || 0);
     const rate = Number(vals.annualRate || 0) / 100;
     const time = Number(vals.years || 0);

     return principal * Math.pow(1 + rate, time);
    }

    default:
     return 0;
   }
  } catch (error) {
   console.error('Error calculating:', error);
   return 0;
  }
 };

 return (
  <div className="rounded-xl border shadow-lg overflow-hidden bg-[var(--bg-secondary)] border-[var(--border-light)]">
   {/* Header */}
   <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
    <div className="flex items-center gap-3 mb-2">
     <Calculator className="w-6 h-6" />
<h2 className="title-newtab text-2xl">{config.title}</h2>
    </div>
    <p className="text-purple-100">{config.description}</p>
   </div>

   {/* Campos */}
   <div className="p-6 space-y-6">
    {config.fields.map((field) => (
     <div key={field.id} className="space-y-2">
      <div className="flex items-center justify-between">
       <label className="font-medium text-[var(--text-primary)] flex items-center gap-2">
        {field.label}
        {field.info && (
         <div className="group relative">
          <Info className="w-4 h-4 text-gray-400 cursor-help" />
          <div className="absolute left-0 top-6 w-64 bg-gray-900 dark:bg-gray-800 text-white text-xs p-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
           {field.info}
          </div>
         </div>
        )}
       </label>

       {field.type !== 'select' && (
        <span className="font-semibold text-purple-600">
         {values[field.id] !== undefined ? values[field.id] : field.defaultValue}
         {field.suffix && ` ${field.suffix}`}
        </span>
       )}
      </div>

      {field.type === 'number' && (
       <input
        type="number"
        value={values[field.id] !== undefined ? Number(values[field.id]) : Number(field.defaultValue)}
        onChange={(e) => handleChange(field.id, Number(e.target.value))}
        min={field.min}
        max={field.max}
        step={field.step}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-[var(--bg-secondary)] border-[var(--border-medium)] text-[var(--text-primary)]"
       />
      )}

      {field.type === 'slider' && (
       <input
        type="range"
        value={values[field.id] !== undefined ? Number(values[field.id]) : Number(field.defaultValue)}
        onChange={(e) => handleChange(field.id, Number(e.target.value))}
        min={field.min || 0}
        max={field.max || 100}
        step={field.step || 1}
        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
       />
      )}

      {field.type === 'select' && field.options && (
       <select
        value={values[field.id] !== undefined ? String(values[field.id]) : String(field.defaultValue)}
        onChange={(e) => handleChange(field.id, e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
       >
        {field.options.map((option) => (
         <option key={option.value} value={option.value}>
          {option.label}
         </option>
        ))}
       </select>
      )}
     </div>
    ))}
   </div>

   {/* Resultado */}
   <div className="p-6 border-t bg-purple-50/50 dark:bg-purple-900/10 border-[var(--border-light)]">
    <div className="flex items-center justify-between">
     <div className="flex items-center gap-3">
      <TrendingUp className="w-6 h-6 text-purple-600" />
      <span className="font-medium text-[var(--text-secondary)]">{config.resultLabel}</span>
     </div>

     <div className="text-right">
      <div className="text-3xl font-bold text-purple-600">
       {config.resultSuffix && config.resultSuffix === '%'
        ? result?.toFixed(2)
        : result?.toLocaleString('pt-BR', {
         minimumFractionDigits: 2,
         maximumFractionDigits: 2,
        })}
       {config.resultSuffix && ` ${config.resultSuffix}`}
      </div>
     </div>
    </div>
   </div>
  </div>
 );
}
