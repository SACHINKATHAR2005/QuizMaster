import mongoose, { Schema, Document } from "mongoose";

interface QuizQuestion {
  questionId: string;
  questionText: string;
  codeSnippet?: string;
  language?: string;
  options: string[];
  correctAnswer: string;
}

export interface IQuizHistory extends Document {
  userId: mongoose.Types.ObjectId;
  topic: string;
  difficulty: "easy" | "intermediate" | "hard";
  questions: QuizQuestion[];
  userAnswers?: string[];  
  score?: number;
  generatedAt: Date;
}

const QuizHistorySchema = new Schema<IQuizHistory>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  topic: { type: String, required: true },
  difficulty: { type: String, enum: ["easy", "intermediate", "hard"], required: true },
  questions: [
    {
      questionId: { type: String, required: true },
      questionText: { type: String, required: true },
      codeSnippet: { type: String },
      language: { type: String },
      options: [{ type: String, required: true }],
      correctAnswer: { type: String, required: true },
    },
  ],
  userAnswers: { type: [String], default: [] },
  score: { type: Number, default: 0 },
  generatedAt: { type: Date, default: Date.now }
});

export default mongoose.model<IQuizHistory>("QuizHistory", QuizHistorySchema);

//topic,difficulty, questions,userAnswers,score