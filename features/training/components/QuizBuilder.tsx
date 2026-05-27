"use client";

import { useState } from "react";
import { Icon } from "@/components/shared";
import type { QuizQuestion } from "../types";

// Dynamic quiz editor (PRD §7.4). Manages an array of QuizQuestion. Holds
// state, renders inputs, and writes the full JSON into a hidden form input
// so the parent form's `action={upsertModule}` picks it up.

type QuizBuilderProps = {
  initial?: QuizQuestion[];
  /** Name of the hidden input that holds the serialised JSON. */
  hiddenName: string;
};

function emptyQuestion(): QuizQuestion {
  return { q: "", options: ["", ""], correct: 0 };
}

export function QuizBuilder({ initial, hiddenName }: QuizBuilderProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>(
    initial && initial.length > 0 ? initial : [],
  );

  function updateQuestion(idx: number, patch: Partial<QuizQuestion>) {
    setQuestions((prev) =>
      prev.map((q, i) => (i === idx ? { ...q, ...patch } : q)),
    );
  }

  function updateOption(qIdx: number, oIdx: number, value: string) {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIdx) return q;
        const options = [...q.options];
        options[oIdx] = value;
        return { ...q, options };
      }),
    );
  }

  function addOption(qIdx: number) {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIdx ? { ...q, options: [...q.options, ""] } : q,
      ),
    );
  }

  function removeOption(qIdx: number, oIdx: number) {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIdx) return q;
        const options = q.options.filter((_, j) => j !== oIdx);
        const correct = Math.min(q.correct, Math.max(0, options.length - 1));
        return { ...q, options, correct };
      }),
    );
  }

  function addQuestion() {
    setQuestions((prev) => [...prev, emptyQuestion()]);
  }

  function removeQuestion(idx: number) {
    setQuestions((prev) => prev.filter((_, i) => i !== idx));
  }

  return (
    <div>
      <input type="hidden" name={hiddenName} value={JSON.stringify(questions)} />

      {questions.length === 0 ? (
        <div className="rounded-md border border-dashed border-line bg-bg p-4 text-center text-[13px] text-ink-3">
          No quiz questions yet — optional.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {questions.map((q, qi) => (
            <div
              key={qi}
              className="rounded-lg border border-line bg-card p-4 shadow-soft-sm"
            >
              <div className="mb-2 flex items-baseline justify-between">
                <div className="text-[10.5px] font-bold uppercase tracking-[0.13em] text-ink-3">
                  Question {qi + 1}
                </div>
                <button
                  type="button"
                  onClick={() => removeQuestion(qi)}
                  className="text-[11px] font-semibold text-ink-3 hover:text-[#E53E3E]"
                >
                  Remove
                </button>
              </div>
              <input
                value={q.q}
                onChange={(e) => updateQuestion(qi, { q: e.target.value })}
                placeholder="What's the question?"
                className="mb-3 block w-full rounded-md border border-line bg-card px-3 py-2 text-[14px] outline-none focus:border-ink"
              />
              <div className="mb-2 text-[10.5px] font-bold uppercase tracking-[0.13em] text-ink-3">
                Options · tap the circle to mark correct
              </div>
              <div className="flex flex-col gap-2">
                {q.options.map((opt, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuestion(qi, { correct: oi })}
                      aria-label={`Mark option ${oi + 1} correct`}
                      className={[
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                        q.correct === oi
                          ? "border-success bg-success/15 text-success"
                          : "border-line text-transparent hover:border-ink-3",
                      ].join(" ")}
                    >
                      {q.correct === oi && (
                        <Icon name="check" size={11} strokeWidth={2.6} />
                      )}
                    </button>
                    <input
                      value={opt}
                      onChange={(e) => updateOption(qi, oi, e.target.value)}
                      placeholder={`Option ${oi + 1}`}
                      className="flex-1 rounded-md border border-line bg-card px-3 py-1.5 text-[13.5px] outline-none focus:border-ink"
                    />
                    {q.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(qi, oi)}
                        aria-label="Remove option"
                        className="flex h-6 w-6 items-center justify-center rounded-pill text-ink-3 hover:bg-bg hover:text-[#E53E3E]"
                      >
                        <Icon name="close" size={12} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addOption(qi)}
                  className="self-start text-[12px] font-semibold text-accent hover:underline"
                >
                  + Add option
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={addQuestion}
        className="mt-3 inline-flex items-center gap-1.5 rounded-pill border border-dashed border-accent/40 bg-accent/5 px-3.5 py-2 text-[12.5px] font-semibold text-accent hover:bg-accent/10"
      >
        <Icon name="plus" size={14} />
        Add question
      </button>
    </div>
  );
}
