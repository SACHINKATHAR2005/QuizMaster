import mongoose, { Document, Schema } from 'mongoose';

export interface IChallenge extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  technology: string;
  starterCode: string;
  solution: string;
  hints: string[];
  testCases?: any[];
  apiEndpoint?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const challengeSchema = new Schema<IChallenge>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  technology: {
    type: String,
    required: true
  },
  starterCode: {
    type: String,
    required: true
  },
  solution: {
    type: String,
    required: true
  },
  hints: [{
    type: String
  }],
  testCases: [{
    input: Schema.Types.Mixed,
    expectedOutput: Schema.Types.Mixed,
    description: String
  }],
  apiEndpoint: {
    type: String
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

export default mongoose.model<IChallenge>('Challenge', challengeSchema);
