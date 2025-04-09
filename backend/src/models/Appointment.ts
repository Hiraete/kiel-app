import mongoose, { Schema, Document } from 'mongoose';

export interface IAppointment extends Document {
  expert: {
    id: string;
    name: string;
  };
  client: {
    id: string;
    name: string;
  };
  date: Date;
  startTime: string;
  endTime: string;
  notes?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema({
  expert: {
    id: { type: String, required: true },
    name: { type: String, required: true }
  },
  client: {
    id: { type: String, required: true },
    name: { type: String, required: true }
  },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  notes: { type: String },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Randevu çakışmalarını kontrol etmek için index
appointmentSchema.index({ expert: 1, date: 1, startTime: 1 }, { unique: true });

export const Appointment = mongoose.model<IAppointment>('Appointment', appointmentSchema); 