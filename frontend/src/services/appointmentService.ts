import api from './api';
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

interface CreateAppointmentPayload {
  expertId: string;
  date: string;
  startTime: string;
  endTime: string;
  notes?: string;
}

interface AppointmentFilter {
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  expertId?: string;
  clientId?: string;
  startDate?: string;
  endDate?: string;
}

export const appointmentService = {
  createAppointment: async (payload: CreateAppointmentPayload) => {
    const response = await api.post('/appointments', payload);
    return response.data;
  },

  getAppointments: async (filters?: AppointmentFilter) => {
    const response = await api.get('/appointments', { params: filters });
    return response.data;
  },

  getAppointmentById: async (id: string) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  updateAppointment: async (id: string, payload: Partial<CreateAppointmentPayload>) => {
    const response = await api.put(`/appointments/${id}`, payload);
    return response.data;
  },

  cancelAppointment: async (id: string) => {
    const response = await api.put(`/appointments/${id}/cancel`);
    return response.data;
  },

  confirmAppointment: async (id: string) => {
    const response = await api.put(`/appointments/${id}/confirm`);
    return response.data;
  },

  rateAppointment: async (id: string, rating: number, review?: string) => {
    const response = await api.put(`/appointments/${id}/rate`, { rating, review });
    return response.data;
  }
}; 