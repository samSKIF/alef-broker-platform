import type { Database } from "@/types/database";

export type Module = Database["public"]["Tables"]["modules"]["Row"];

// PRD §8.3: quiz jsonb is "array of {q, options[], correct}".
export type QuizQuestion = {
  q: string;
  options: string[];
  correct: number;
};
