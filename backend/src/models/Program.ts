import mongoose, { Document, Schema } from 'mongoose';

export interface IProgram extends Document {
  name: string;
  description: string;
  activities: Array<{
    activityId: mongoose.Types.ObjectId;
    order: number;
    frequency: 'daily' | 'weekly' | 'monthly';
  }>;
  createdBy: mongoose.Types.ObjectId;
  assignedTo: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  progress: Array<{
    activityId: mongoose.Types.ObjectId;
    date: Date;
    completed: boolean;
    notes: string;
  }>;
  status: 'active' | 'completed' | 'paused';
  createdAt: Date;
  updatedAt: Date;
}

const programSchema = new Schema<IProgram>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    activities: [{
      activityId: {
        type: Schema.Types.ObjectId,
        ref: 'Activity',
        required: true,
      },
      order: {
        type: Number,
        required: true,
        min: 0,
      },
      frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        required: true,
      },
    }],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    progress: [{
      activityId: {
        type: Schema.Types.ObjectId,
        ref: 'Activity',
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
      completed: {
        type: Boolean,
        required: true,
        default: false,
      },
      notes: {
        type: String,
        required: true,
      },
    }],
    status: {
      type: String,
      enum: ['active', 'completed', 'paused'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Tarih kontrolü
programSchema.pre('save', function(next) {
  if (this.startDate > this.endDate) {
    next(new Error('Başlangıç tarihi bitiş tarihinden sonra olamaz'));
  }
  next();
});

// Aktivite sırası kontrolü
programSchema.pre('save', function(next) {
  const orders = this.activities.map(a => a.order);
  const uniqueOrders = new Set(orders);
  if (orders.length !== uniqueOrders.size) {
    next(new Error('Aktivite sıraları benzersiz olmalıdır'));
  }
  next();
});

export const Program = mongoose.model<IProgram>('Program', programSchema); 