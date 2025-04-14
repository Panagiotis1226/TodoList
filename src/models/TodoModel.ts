import mongoose, { Schema, Document } from 'mongoose';

export interface ITodo extends Document {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
  category?: string;
}

const TodoSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  category: { type: String }
});

export default mongoose.model<ITodo>('Todo', TodoSchema); 