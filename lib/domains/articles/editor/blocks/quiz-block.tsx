'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheck,
    faTimes,
    faQuestionCircle,
    faArrowRight,
    faArrowLeft,
    faRedo
} from '@fortawesome/free-solid-svg-icons';

export interface QuizQuestion {
    id: number;
    text: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

interface QuizBlockProps {
    questions: QuizQuestion[];
    title?: string;
}

/**
 * Bloco de Quiz interativo para artigos educacionais
 */
export function QuizBlock({ questions, title = 'Teste Seus Conhecimentos!' }: QuizBlockProps) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));

    const question = questions[currentQuestion];
    const isAnswered = selectedAnswer !== null;
    const isCorrect = selectedAnswer === question?.correctAnswer;
    const isComplete = currentQuestion >= questions.length;

    const handleSelectAnswer = (index: number) => {
        if (isAnswered) return;

        setSelectedAnswer(index);
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = index;
        setAnswers(newAnswers);

        if (index === question.correctAnswer) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
            setSelectedAnswer(null);
        } else {
            setShowResult(true);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
            setSelectedAnswer(answers[currentQuestion - 1]);
        }
    };

    const handleReset = () => {
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setScore(0);
        setAnswers(new Array(questions.length).fill(null));
    };

    if (!questions || questions.length === 0) {
        return null;
    }

    // Tela de resultado
    if (showResult) {
        const percentage = Math.round((score / questions.length) * 100);
        const isGood = percentage >= 70;

        return (
            <div
                className="my-8 p-6 rounded-2xl"
                style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-light)'
                }}
            >
                <h3
                    className="text-2xl font-bold mb-4 text-center"
                    style={{ color: 'var(--text-primary)' }}
                >
                    🎯 Resultado do Quiz
                </h3>

                <div className="text-center py-8">
                    <div
                        className="text-6xl font-bold mb-2"
                        style={{
                            color: isGood ? 'var(--states-success-base)' : 'var(--states-warning-base)'
                        }}
                    >
                        {percentage}%
                    </div>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Você acertou {score} de {questions.length} perguntas
                    </p>
                    <p
                        className="mt-4 text-lg"
                        style={{ color: 'var(--text-primary)' }}
                    >
                        {isGood ? '🎉 Excelente! Você dominou o conteúdo!' : '📚 Continue estudando e tente novamente!'}
                    </p>
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all"
                        style={{
                            background: 'var(--brand-primary)',
                            color: 'var(--text-inverse)'
                        }}
                    >
                        <FontAwesomeIcon icon={faRedo} />
                        Tentar Novamente
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="my-8 rounded-2xl overflow-hidden"
            style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-light)'
            }}
        >
            {/* Header */}
            <div
                className="px-6 py-4"
                style={{
                    background: 'var(--bg-tertiary)',
                    borderBottom: '1px solid var(--border-light)'
                }}
            >
                <div className="flex items-center justify-between">
                    <h3
                        className="text-lg font-bold flex items-center gap-2"
                        style={{ color: 'var(--brand-primary)' }}
                    >
                        <FontAwesomeIcon icon={faQuestionCircle} />
                        {title}
                    </h3>
                    <span style={{ color: 'var(--text-secondary)' }}>
                        {currentQuestion + 1} / {questions.length}
                    </span>
                </div>

                {/* Progress bar */}
                <div
                    className="mt-3 h-2 rounded-full overflow-hidden"
                    style={{ background: 'var(--bg-primary)' }}
                >
                    <div
                        className="h-full rounded-full transition-all"
                        style={{
                            width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                            background: 'var(--brand-primary)'
                        }}
                    />
                </div>
            </div>

            {/* Question */}
            <div className="p-6">
                <p
                    className="text-lg font-medium mb-6"
                    style={{ color: 'var(--text-primary)' }}
                >
                    {question.text}
                </p>

                {/* Options */}
                <div className="space-y-3">
                    {question.options.map((option, index) => {
                        const isSelected = selectedAnswer === index;
                        const isCorrectAnswer = index === question.correctAnswer;

                        let bgColor = 'var(--bg-tertiary)';
                        let borderColor = 'var(--border-light)';
                        let textColor = 'var(--text-primary)';

                        if (isAnswered) {
                            if (isCorrectAnswer) {
                                bgColor = 'color-mix(in srgb, var(--states-success-base) 15%, transparent)';
                                borderColor = 'var(--states-success-base)';
                                textColor = 'var(--states-success-base)';
                            } else if (isSelected && !isCorrectAnswer) {
                                bgColor = 'color-mix(in srgb, var(--states-error-base) 15%, transparent)';
                                borderColor = 'var(--states-error-base)';
                                textColor = 'var(--states-error-base)';
                            }
                        } else if (isSelected) {
                            borderColor = 'var(--brand-primary)';
                        }

                        return (
                            <button
                                key={index}
                                onClick={() => handleSelectAnswer(index)}
                                disabled={isAnswered}
                                className="w-full p-4 rounded-xl text-left transition-all flex items-center gap-3"
                                style={{
                                    background: bgColor,
                                    border: `2px solid ${borderColor}`,
                                    color: textColor,
                                    cursor: isAnswered ? 'default' : 'pointer'
                                }}
                            >
                                <span
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                                    style={{
                                        background: 'var(--bg-primary)',
                                        color: 'var(--text-secondary)'
                                    }}
                                >
                                    {String.fromCharCode(65 + index)}
                                </span>
                                <span className="flex-1">{option}</span>
                                {isAnswered && isCorrectAnswer && (
                                    <FontAwesomeIcon icon={faCheck} className="text-lg" />
                                )}
                                {isAnswered && isSelected && !isCorrectAnswer && (
                                    <FontAwesomeIcon icon={faTimes} className="text-lg" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Explanation */}
                {isAnswered && question.explanation && (
                    <div
                        className="mt-6 p-4 rounded-xl"
                        style={{
                            background: isCorrect
                                ? 'color-mix(in srgb, var(--states-success-base) 10%, transparent)'
                                : 'color-mix(in srgb, var(--states-error-base) 10%, transparent)',
                            border: `1px solid ${isCorrect ? 'var(--states-success-base)' : 'var(--states-error-base)'}`
                        }}
                    >
                        <p
                            className="font-medium mb-2"
                            style={{ color: isCorrect ? 'var(--states-success-base)' : 'var(--states-error-base)' }}
                        >
                            {isCorrect ? '✅ Correto!' : '❌ Incorreto'}
                        </p>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            {question.explanation}
                        </p>
                    </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-6 pt-4" style={{ borderTop: '1px solid var(--border-light)' }}>
                    <button
                        onClick={handlePrevious}
                        disabled={currentQuestion === 0}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all disabled:opacity-30"
                        style={{
                            background: 'var(--bg-tertiary)',
                            color: 'var(--text-secondary)'
                        }}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                        Anterior
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={!isAnswered}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-30"
                        style={{
                            background: 'var(--brand-primary)',
                            color: 'var(--text-inverse)'
                        }}
                    >
                        {currentQuestion < questions.length - 1 ? 'Próxima' : 'Ver Resultado'}
                        <FontAwesomeIcon icon={faArrowRight} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default QuizBlock;
