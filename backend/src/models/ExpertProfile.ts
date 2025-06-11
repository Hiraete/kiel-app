import mongoose, { Document, Schema } from 'mongoose';

export interface IExpertProfile extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  specialization: string[];
  experience: number;
  rating: number;
  totalReviews: number;
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
  };
}

const expertProfileSchema = new Schema<IExpertProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    specialization: [{
      type: String,
      required: true,
    }],
    experience: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    availability: {
      monday: {
        type: Boolean,
        default: false,
      },
      tuesday: {
        type: Boolean,
        default: false,
      },
      wednesday: {
        type: Boolean,
        default: false,
      },
      thursday: {
        type: Boolean,
        default: false,
      },
      friday: {
        type: Boolean,
        default: false,
      },
      saturday: {
        type: Boolean,
        default: false,
      },
      sunday: {
        type: Boolean,
        default: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const ExpertProfile = mongoose.model<IExpertProfile>('ExpertProfile', expertProfileSchema); 