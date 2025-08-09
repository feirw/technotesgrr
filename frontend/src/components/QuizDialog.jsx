import React, { useState, useEffect } from 'react';

const QuizDialog = ({ quiz, isOpen, onClose, onQuestionAnswered, selectedAnswers }) => {
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(false);

  const BRAND = '#fda8a9';
  const BRAND_DARK = '#f88b8c';
  const BRAND_LIGHT = '#ffe6e6';

  const selected = selectedAnswers?.[current] ?? null;
  const question = quiz?.questions?.[current];

  useEffect(() => {
    setCurrent(0);
  }, [isOpen, quiz]);

  if (!isOpen || !quiz) return null;

  const handleSelect = async (idx) => {
    if (selected == null && onQuestionAnswered) {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8001/api/quiz/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nickname: localStorage.getItem('nickname') || 'Anonymous',
            question_id: question.id,
            selected_answer: idx,
          }),
        });
        const result = await response.json();
        onQuestionAnswered(quiz.id, current, idx, result.correct, result.points_earned);
      } catch (error) {
        console.error('Error submitting answer:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleNext = () => setCurrent((p) => p + 1);
  const handlePrev = () => setCurrent((p) => p - 1);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      style={{
        background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(2px)',
      }}
    >
      <div
        className="flex flex-col w-full max-w-2xl rounded-3xl p-8 shadow-2xl"
        style={{
          background: '#fff',
          border: `4px solid ${BRAND_LIGHT}`,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3
            className="text-2xl font-extrabold tracking-wide drop-shadow"
            style={{ color: BRAND_DARK }}
          >
            Ερώτηση {current + 1} από {quiz.questions.length}
          </h3>
          <button
            onClick={onClose}
            className="text-2xl font-bold transition-colors"
            style={{ color: BRAND_LIGHT }}
            onMouseEnter={(e) => (e.currentTarget.style.color = BRAND_DARK)}
            onMouseLeave={(e) => (e.currentTarget.style.color = BRAND_LIGHT)}
            aria-label="Κλείσιμο"
          >
            ✕
          </button>
        </div>

        {/* Question */}
        <div
          className="mb-10 mt-6 text-xl text-center flex-grow min-h-[120px] flex items-center justify-center font-medium"
          style={{ color: BRAND_DARK }}
        >
          {question?.question}
        </div>

        {/* Answers */}
        <div className="flex flex-col gap-4 mb-12">
          {loading ? (
            <div className="flex justify-center my-8">
              <div
                className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2"
                style={{ borderColor: BRAND }}
              ></div>
            </div>
          ) : (
            question.answers.map((ans, idx) => {
              let base =
                'rounded-xl px-6 py-3 border-2 transition-all font-semibold shadow-sm focus:outline-none';
              let styles = {};
              if (selected !== null) {
                if (ans.correct) {
                  styles = {
                    background: '#d1fae5', // πράσινο πολύ ανοιχτό
                    borderColor: '#34d399',
                    color: '#065f46',
                  };
                } else {
                  styles = {
                    background: '#fee2e2', // κόκκινο πολύ ανοιχτό
                    borderColor: '#f87171',
                    color: '#7f1d1d',
                  };
                }
                if (selected === idx) {
                  styles.transform = 'scale(1.05)';
                } else {
                  styles.opacity = 0.6;
                }
              } else {
                styles = {
                  background: '#fff',
                  borderColor: BRAND_LIGHT,
                  color: BRAND_DARK,
                };
              }
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={selected !== null}
                  className={base}
                  style={styles}
                >
                  {ans.text}
                </button>
              );
            })
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={handlePrev}
            disabled={current === 0}
            className="rounded-lg px-6 py-2 font-semibold shadow"
            style={{
              background: '#fff',
              border: `2px solid ${BRAND_LIGHT}`,
              color: BRAND_DARK,
              opacity: current === 0 ? 0.5 : 1,
            }}
          >
            Προηγούμενη
          </button>
          <button
            onClick={handleNext}
            disabled={current === quiz.questions.length - 1}
            className="rounded-lg px-6 py-2 font-bold shadow text-white"
            style={{
              background: BRAND,
              opacity: current === quiz.questions.length - 1 ? 0.5 : 1,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = BRAND_DARK)}
            onMouseLeave={(e) => (e.currentTarget.style.background = BRAND)}
          >
            Επόμενη
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizDialog;
