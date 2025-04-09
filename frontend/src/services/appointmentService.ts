import { api } from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Appointment {
  _id: string;
  expert: {
    id: string;
    name: string;
  };
  client: {
    id: string;
    name: string;
  };
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentData {
  expert: {
    id: string;
    name: string;
  };
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
}

class AppointmentService {
  async getAppointments(): Promise<Appointment[]> {
    const response = await api.get('/appointments');
    return response.data;
  }

  async createAppointment(data: CreateAppointmentData): Promise<Appointment> {
    const response = await api.post('/appointments', data);
    return response.data;
  }

  async updateAppointmentStatus(id: string, status: Appointment['status']): Promise<Appointment> {
    const response = await api.patch(`/appointments/${id}/status`, { status });
    return response.data;
  }

  async cancelAppointment(id: string): Promise<void> {
    await api.delete(`/appointments/${id}`);
  }
}

export const appointmentService = new AppointmentService(); 