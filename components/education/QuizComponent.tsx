'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faTrophy, faRedo, faLightbulb } from '@fortawesome/free-solid-svg-icons';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
  explanation?: string;
}

interface QuizProps {
  title?: string;
  questions: Question[];
}

export default function QuizComponent({ title = 'Teste seus Conhecimentos', questions }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;

    const isCorrect = selectedOption === questions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResults(false);
  };

  if (showResults) {
    const percentage = (score / questions.length) * 100;
    let message = '';
    let color = '';

    if (percentage === 100) {
      message = 'Perfeito! Você é um mestre!';
      color = '';
    } else if (percentage >= 70) {
      message = 'Muito bem! Você entendeu o conceito.';
      color = '';
    } else {
      message = 'Continue estudando! Você vai chegar lá.';
      color = '';
    }

    return (
      <div className="glass-card p-8 rounded-2xl text-center animate-fade-in">
        <div className={`w-20 h-20 rounded-full bg-[var(--bg-primary)] flex items-center justify-center mx-auto mb-6 text-4xl ${color} shadow-lg`}>
          <FontAwesomeIcon icon={faTrophy} />
        </div>
        <h3 className="title-newtab text-2xl mb-2">Quiz Finalizado!</h3>
        <p className="text-lg text-[var(--text-secondary)] mb-6">{message}</p>

        <div className="text-5xl font-extrabold mb-8 text-[var(--text-primary)]">
          {score}/{questions.length}
        </div>

        <button
          onClick={handleRestart}
          className="px-8 py-3 rounded-xl bg-[var(--brand-primary)] text-white font-bold hover:bg-[var(--brand-hover)] transition-all flex items-center gap-2 mx-auto"
        >
          <FontAwesomeIcon icon={faRedo} />
          Tentar Novamente
        </button>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="glass-card p-6 md:p-8 rounded-2xl border-t-4 border-[var(--brand-primary)] bg-white dark:bg-[#1a1b1e]/60 shadow-md dark:shadow-none">
      <div className="flex justify-between items-center mb-6">
        <h3 className="title-newtab text-xl text-gray-900 dark:text-gray-100">{title}</h3>
        <span className="text-sm font-semibold text-gray-600 dark:text-[var(--text-tertiary)] bg-gray-100 dark:bg-[var(--bg-primary)] px-3 py-1 rounded-full">
          Questão {currentQuestion + 1} de {questions.length}
        </span>
      </div>

      <div className="mb-8">
        <p className="text-lg font-medium text-gray-800 dark:text-[var(--text-primary)] leading-relaxed">
          {question.text}
        </p>
      </div>

      <div className="space-y-3 mb-8">
        {question.options.map((option, index) => {
          let optionClass = "w-full p-4 rounded-xl text-left transition-all border-2 ";

          if (isAnswered) {
            if (index === question.correctAnswer) {
              optionClass += "bg-green-100 border-green-500 text-green-800 dark:bg-green-500/10 dark:text-green-400 ";
            } else if (index === selectedOption) {
              optionClass += "bg-red-100 border-red-500 text-red-800 dark:bg-red-500/10 dark:text-red-400 ";
            } else {
              optionClass += "border-transparent bg-gray-50 text-gray-400 dark:bg-[var(--bg-primary)] dark:opacity-50 ";
            }
          } else {
            if (selectedOption === index) {
              optionClass += "border-[var(--brand-primary)] bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] font-medium ";
            } else {
              optionClass += "border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 dark:border-transparent dark:bg-[var(--bg-primary)] dark:hover:bg-[var(--bg-secondary)] dark:text-[var(--text-secondary)] ";
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleOptionClick(index)}
              disabled={isAnswered}
              className={optionClass}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {isAnswered && index === question.correctAnswer && (
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 dark:text-green-500" />
                )}
                {isAnswered && index === selectedOption && index !== question.correctAnswer && (
                  <FontAwesomeIcon icon={faTimesCircle} className="text-red-600 dark:text-red-500" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {isAnswered && question.explanation && (
        <div className="mb-6 p-5 rounded-r-xl border-l-4 border-[var(--brand-primary)] bg-[var(--brand-primary)]/5 flex gap-3">
          <div className="text-[var(--brand-primary)] mt-0.5">
            <FontAwesomeIcon icon={faLightbulb} />
          </div>
          <div className="text-sm text-[var(--text-secondary)] leading-relaxed">
            <strong className="block text-[var(--brand-primary)] mb-1">Explicação:</strong>
            {question.explanation}
          </div>
        </div>
      )}

      <div className="flex justify-end">
        {!isAnswered ? (
          <button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${selectedOption !== null
              ? 'bg-[var(--brand-primary)] text-white hover:bg-[var(--brand-hover)] shadow-lg'
              : 'bg-[var(--bg-secondary)] text-[var(--text-disabled)] cursor-not-allowed'
              }`}
          >
            Confirmar Resposta
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-3 rounded-xl bg-[var(--brand-primary)] text-white font-bold hover:bg-[var(--brand-hover)] transition-all shadow-lg"
          >
            {currentQuestion < questions.length - 1 ? 'Próxima Questão' : 'Ver Resultados'}
          </button>
        )}
      </div>
    </div>
  );
}
