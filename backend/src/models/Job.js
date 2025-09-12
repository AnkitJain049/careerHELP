import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  company: { type: String, required: true },
  status: { type: String, default: 'applied' },
  notes: { type: String },
}, { timestamps: true });

export default mongoose.model('Job', jobSchema);
