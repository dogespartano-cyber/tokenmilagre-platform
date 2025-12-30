import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus, faCheckCircle, faQuestionCircle, faTimesCircle, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';

export function QuizView(props: NodeViewProps) {
    const { node, updateAttributes, editor } = props;
    const { question, options, correctAnswer, explanation } = node.attrs;

    // View State (only for read-only mode)
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // =========================================
    // EDIT MODE
    // =========================================
    if (editor.isEditable) {
        const handleOptionChange = (index: number, value: string) => {
            const newOptions = [...(options || [])];
            newOptions[index] = value;
            updateAttributes({ options: newOptions });
        };

        const addOption = () => {
            updateAttributes({ options: [...(options || []), 'Nova opção'] });
        };

        const removeOption = (index: number) => {
            const newOptions = options.filter((_: string, i: number) => i !== index);
            updateAttributes({ options: newOptions });
        };

        return (
            <NodeViewWrapper className="my-6 p-6 border rounded-xl bg-milagre-darker border-milagre-700">
                <div className="flex items-center gap-2 mb-4 text-milagre-gold">
                    <FontAwesomeIcon icon={faQuestionCircle} />
                    <span className="font-bold uppercase text-xs tracking-wider">Quiz Block (Editor)</span>
                </div>

                {/* Question */}
                <div className="mb-4">
                    <label className="block text-xs text-gray-400 mb-1">Pergunta</label>
                    <input
                        type="text"
                        value={question || ''}
                        onChange={(e) => updateAttributes({ question: e.target.value })}
                        className="w-full bg-milagre-900 border border-milagre-700 rounded p-2 text-white focus:border-milagre-gold outline-none"
                        placeholder="Digite a pergunta aqui..."
                    />
                </div>

                {/* Options */}
                <div className="mb-4 space-y-2">
                    <label className="block text-xs text-gray-400 mb-1">Opções (Marque a correta)</label>
                    {(options || []).map((opt: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                            <button
                                onClick={() => updateAttributes({ correctAnswer: index })}
                                className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${correctAnswer === index
                                        ? 'bg-green-500 border-green-500 text-white'
                                        : 'border-gray-500 hover:border-gray-300'
                                    }`}
                                title="Marcar como correta"
                            >
                                {correctAnswer === index && <FontAwesomeIcon icon={faCheckCircle} size="xs" />}
                            </button>

                            <input
                                type="text"
                                value={opt}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                className="flex-1 bg-milagre-900 border border-milagre-700 rounded p-2 text-sm text-white focus:border-milagre-gold outline-none"
                            />

                            <button
                                onClick={() => removeOption(index)}
                                className="text-red-500 hover:text-red-400 p-2"
                            >
                                <FontAwesomeIcon icon={faTrash} size="sm" />
                            </button>
                        </div>
                    ))}

                    <button
                        onClick={addOption}
                        className="text-xs flex items-center gap-1 text-milagre-gold hover:text-yellow-300 mt-2"
                    >
                        <FontAwesomeIcon icon={faPlus} /> Adicionar Opção
                    </button>
                </div>

                {/* Explanation */}
                <div>
                    <label className="block text-xs text-gray-400 mb-1">Explicação da Resposta</label>
                    <textarea
                        value={explanation || ''}
                        onChange={(e) => updateAttributes({ explanation: e.target.value })}
                        className="w-full bg-milagre-900 border border-milagre-700 rounded p-2 text-sm text-white focus:border-milagre-gold outline-none min-h-[80px]"
                        placeholder="Explique por que a resposta está correta..."
                    />
                </div>
            </NodeViewWrapper>
        );
    }

    // =========================================
    // READ-ONLY / PLAYER MODE
    // =========================================

    const handleSubmit = () => {
        if (selectedOption !== null) {
            setIsSubmitted(true);
        }
    };

    const isCorrect = selectedOption === correctAnswer;

    return (
        <NodeViewWrapper className="my-8 max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-milagre-900 to-milagre-darker border border-milagre-800 rounded-2xl overflow-hidden shadow-xl">
                {/* Header */}
                <div className="bg-milagre-900/50 p-4 border-b border-milagre-800 flex items-center gap-2">
                    <span className="bg-milagre-gold text-milagre-900 text-xs font-bold px-2 py-1 rounded shadow-sm">
                        QUIZ
                    </span>
                    <h3 className="text-lg font-bold text-white leading-tight flex-1">
                        {question || 'Pergunta não definida'}
                    </h3>
                </div>

                {/* Options */}
                <div className="p-6 space-y-3">
                    {(options || []).map((opt: string, index: number) => {
                        let optionClass = "w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 group relative overflow-hidden ";

                        if (isSubmitted) {
                            if (index === correctAnswer) {
                                optionClass += "border-green-500 bg-green-500/10 text-green-200";
                            } else if (index === selectedOption) {
                                optionClass += "border-red-500 bg-red-500/10 text-red-200";
                            } else {
                                optionClass += "border-transparent bg-milagre-900/50 text-gray-400 opacity-50";
                            }
                        } else {
                            if (selectedOption === index) {
                                optionClass += "border-milagre-gold bg-milagre-gold/10 text-white shadow-[0_0_15px_rgba(234,179,8,0.1)]";
                            } else {
                                optionClass += "border-transparent bg-milagre-900/50 text-gray-300 hover:bg-milagre-800 hover:scale-[1.01]";
                            }
                        }

                        return (
                            <button
                                key={index}
                                onClick={() => !isSubmitted && setSelectedOption(index)}
                                disabled={isSubmitted}
                                className={optionClass}
                            >
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isSubmitted && index === correctAnswer ? 'border-green-500 bg-green-500 text-milagre-900' :
                                        isSubmitted && index === selectedOption ? 'border-red-500 bg-red-500 text-white' :
                                            selectedOption === index ? 'border-milagre-gold bg-milagre-gold' :
                                                'border-gray-500 group-hover:border-gray-400'
                                    }`}>
                                    {isSubmitted && index === correctAnswer ? <FontAwesomeIcon icon={faCheckCircle} size="xs" /> :
                                        isSubmitted && index === selectedOption ? <FontAwesomeIcon icon={faTimesCircle} size="xs" /> :
                                            <span className="text-[10px] font-bold">{String.fromCharCode(65 + index)}</span>}
                                </div>
                                <span className="font-medium">{opt}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Footer / Results */}
                <div className="p-4 bg-milagre-900/30 border-t border-milagre-800 flex flex-col md:flex-row items-center justify-between gap-4">
                    {!isSubmitted ? (
                        <button
                            onClick={handleSubmit}
                            disabled={selectedOption === null}
                            className={`w-full md:w-auto px-8 py-3 rounded-xl font-bold uppercase tracking-wider text-sm shadow-lg transition-all ${selectedOption !== null
                                    ? 'bg-gradient-to-r from-milagre-gold to-yellow-500 text-milagre-900 hover:scale-105 hover:shadow-yellow-500/20'
                                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            Verificar Resposta
                        </button>
                    ) : (
                        <div className={`w-full p-4 rounded-xl border ${isCorrect ? 'bg-green-500/10 border-green-500/50' : 'bg-red-500/10 border-red-500/50'
                            }`}>
                            <div className="flex items-start gap-3">
                                <FontAwesomeIcon
                                    icon={isCorrect ? faCheckCircle : faTimesCircle}
                                    className={`text-xl mt-1 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}
                                />
                                <div>
                                    <h4 className={`font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                        {isCorrect ? 'Resposta Correta!' : 'Incorreto'}
                                    </h4>
                                    {explanation && (
                                        <p className="text-sm text-gray-300 mt-2 leading-relaxed">
                                            <FontAwesomeIcon icon={faLightbulb} className="text-milagre-gold mr-2" />
                                            {explanation}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => { setIsSubmitted(false); setSelectedOption(null); }}
                                className="mt-4 text-xs text-gray-400 underline hover:text-white"
                            >
                                Tentar novamente
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </NodeViewWrapper>
    );
}
