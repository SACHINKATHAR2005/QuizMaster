import mongoose, { Schema, Document } from "mongoose";

export interface IFile extends Document {
  userId: mongoose.Types.ObjectId;
  fileName: string;
  language: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
}

const FileSchema = new Schema<IFile>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  fileName: { type: String, required: true },
  language: { type: String, required: true },
  code: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Ensure unique file names per user
FileSchema.index({ userId: 1, fileName: 1 }, { unique: true });

export default mongoose.model<IFile>("File", FileSchema);
