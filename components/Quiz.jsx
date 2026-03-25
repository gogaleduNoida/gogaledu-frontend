// components/Quiz.jsx

// ─────────────────────────────────────────────────────────────────
// Module Quiz Component
//
// PROPS:
//   questions     — Array of { question, options, answer } from spcourses.js
//   moduleIndex   — 0-based index of the module this quiz belongs to
//   passedQuizzes — Array of moduleIndex values that have been passed
//   quizScore     — Saved score % for this module (shown in passed badge)
//   onPass        — Callback(moduleIndex, score) when student passes ≥60%
//
// PASS CONDITION: ≥ 60% correct answers
//
// BEHAVIOR:
//   • If no questions → shows "No quiz" message
//   • If already passed → shows green badge with saved score %
//   • Otherwise → shows questions with radio buttons
//   • Submit button disabled until ALL questions answered
//   • On submit:
//       PASS (≥60%) → shows score banner, next module unlocks
//       FAIL (<60%) → shows score banner + Retake button
//       ⚠️  NEVER reveals which answers were correct/wrong
// ─────────────────────────────────────────────────────────────────

"use client";

import { useState } from "react";
import { RefreshCw, Trophy } from "lucide-react";

export default function Quiz({
  questions     = [],
  moduleIndex,
  passedQuizzes = [],
  quizScore,          // saved score % to display in the passed badge
  onPass              // Callback(moduleIndex, score)
}) {

  const [answers,   setAnswers]   = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score,     setScore]     = useState(0);

  // ── NO QUESTIONS GUARD ────────────────────────────────────────
  if (!questions || questions.length === 0) {
    return (
      <div className="mt-4 text-sm text-gray-400 text-center py-3">
        No quiz for this module.
      </div>
    );
  }

  // ── ALREADY PASSED ────────────────────────────────────────────
  const alreadyPassed = passedQuizzes.includes(moduleIndex);

  if (alreadyPassed) {
    return (
      <div className="mt-4 flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
        <Trophy className="text-green-600 flex-shrink-0" size={22} />
        <div className="flex-1">
          <p className="font-semibold text-green-700 text-sm">Module Quiz Passed!</p>
          <p className="text-green-600 text-xs">Next module is now unlocked.</p>
        </div>
        {quizScore !== undefined ? (
          <div className="flex flex-col items-center justify-center bg-green-100 border border-green-300 rounded-xl px-4 py-2 flex-shrink-0">
            <span className="text-green-700 font-bold text-xl leading-none">{quizScore}%</span>
            <span className="text-green-600 text-xs mt-0.5">Your Score</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center bg-green-100 border border-green-300 rounded-xl px-4 py-2 flex-shrink-0">
            <span className="text-green-700 font-bold text-xl leading-none">✓</span>
            <span className="text-green-600 text-xs mt-0.5">Passed</span>
          </div>
        )}
      </div>
    );
  }

  // ── ALL QUESTIONS ANSWERED CHECK ─────────────────────────────
  const allAnswered = questions.every((_, i) => answers[i] !== undefined);

  // ── SUBMIT QUIZ ───────────────────────────────────────────────
  const handleSubmit = () => {
    if (!allAnswered) return;
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.answer) correct++;
    });
    const percentage = Math.round((correct / questions.length) * 100);
    setScore(percentage);
    setSubmitted(true);
    if (percentage >= 60 && typeof onPass === "function") {
      onPass(moduleIndex, percentage);
    }
  };

  // ── RETRY QUIZ ────────────────────────────────────────────────
  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  const passed = score >= 60;

  return (
    <div className="mt-4 border border-gray-200 rounded-xl overflow-hidden">

      {/* ── Quiz Header ───────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 px-5 py-3 flex items-center gap-2">
        <Trophy size={18} className="text-white" />
        <span className="font-semibold text-white text-sm">
          Module Quiz — {questions.length} Question{questions.length !== 1 ? "s" : ""}
        </span>
        <span className="ml-auto text-green-100 text-xs">Pass mark: 60%</span>
      </div>

      <div className="p-5 bg-white space-y-5">

        {/* ── Questions ─────────────────────────────────────── */}
        {questions.map((q, i) => {
          const selected = answers[i];
          return (
            <div key={i} className="space-y-2">
              <p className="font-medium text-gray-800 text-sm">
                {i + 1}. {q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((option, j) => {
                  // ── Option style — NEVER reveals correct answer ─
                  let optionStyle;
                  if (!submitted) {
                    optionStyle = selected === j
                      ? "border-green-500 bg-green-50 cursor-pointer"
                      : "border-gray-200 bg-white hover:border-green-400 hover:bg-green-50 cursor-pointer";
                  } else {
                    // Post-submit: student's pick shown in neutral blue, rest dimmed
                    // No green = correct, no red = wrong — answers are hidden
                    optionStyle = selected === j
                      ? "border-blue-400 bg-blue-50 cursor-default"
                      : "border-gray-200 bg-white opacity-50 cursor-default";
                  }

                  return (
                    <label
                      key={j}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition text-sm ${optionStyle}`}
                    >
                      <input
                        type="radio"
                        name={`q-${moduleIndex}-${i}`}
                        checked={selected === j}
                        onChange={() => !submitted && setAnswers(prev => ({ ...prev, [i]: j }))}
                        disabled={submitted}
                        className="accent-green-600"
                      />
                      <span className="flex-1 text-gray-700">{option}</span>
                      {/* No icons — answers never revealed */}
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* ── Result Banner ─────────────────────────────────── */}
        {submitted && (
          <div className={`rounded-xl p-4 flex items-center gap-3 ${
            passed ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
          }`}>
            {/* Score circle */}
            <div className={`w-14 h-14 rounded-full flex flex-col items-center justify-center flex-shrink-0 font-bold ${
              passed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
            }`}>
              <span className="text-lg leading-none">{score}%</span>
              <span className="text-xs font-normal leading-none mt-0.5">{passed ? "Pass" : "Fail"}</span>
            </div>

            <div className="flex-1">
              <p className={`font-semibold text-sm ${passed ? "text-green-700" : "text-red-600"}`}>
                {passed
                  ? `You scored ${score}% — Module Passed! 🎉`
                  : `You scored ${score}% — Need at least 60% to pass.`
                }
              </p>
              <p className={`text-xs mt-0.5 ${passed ? "text-green-600" : "text-red-500"}`}>
                {passed
                  ? "Next module is now unlocked."
                  : "Review the lessons and retake the quiz. Correct answers are not shown."
                }
              </p>
            </div>

            {!passed && (
              <button
                onClick={handleRetry}
                className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition flex-shrink-0"
              >
                <RefreshCw size={13} />
                Retake
              </button>
            )}
          </div>
        )}

        {/* ── Submit Button ─────────────────────────────────── */}
        {!submitted && (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition ${
              allAnswered
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            {allAnswered
              ? "Submit Quiz"
              : `Answer all ${questions.length} question${questions.length !== 1 ? "s" : ""} to submit`
            }
          </button>
        )}

      </div>
    </div>
  );
}