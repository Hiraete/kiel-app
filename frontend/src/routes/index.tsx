import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CreateAppointmentScreen } from '../screens/CreateAppointmentScreen';
import { useAuth } from '../contexts/AuthContext';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/appointments/create"
        element={
          user ? (
            <CreateAppointmentScreen />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      {/* Diğer route'lar buraya eklenecek */}
    </Routes>
  );
};

export default AppRoutes; 