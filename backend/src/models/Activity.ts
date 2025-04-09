import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity extends Document {
  title: string;
  description: string;
  type: 'egzersiz' | 'oyun' | 'terapi';
  difficulty: 'kolay' | 'orta' | 'zor';
  duration: number;
  materials: string[];
  steps: string[];
  targetSkills: string[];
  ageRange: {
    min: number;
    max: number;
  };
  createdBy: mongoose.Types.ObjectId;
  ratings: Array<{
    userId: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['egzersiz', 'oyun', 'terapi'],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['kolay', 'orta', 'zor'],
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    materials: [{
      type: String,
      required: true,
    }],
    steps: [{
      type: String,
      required: true,
    }],
    targetSkills: [{
      type: String,
      required: true,
    }],
    ageRange: {
      min: {
        type: Number,
        required: true,
        min: 0,
      },
      max: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ratings: [{
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      comment: {
        type: String,
        required: true,
      },
    }],
  },
  {
    timestamps: true,
  }
);

// Yaş aralığı kontrolü
activitySchema.pre('save', function(next) {
  if (this.ageRange.min > this.ageRange.max) {
    next(new Error('Minimum yaş maksimum yaştan büyük olamaz'));
  }
  next();
});

export const Activity = mongoose.model<IActivity>('Activity', activitySchema); 