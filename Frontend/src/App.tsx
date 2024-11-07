import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { LoadingProvider } from './context/LoadingContext';
import { ErrorProvider } from './context/ErrorContext';
import { AuthProvider } from './context/AuthContext';
import { ConfirmProvider } from './context/ConfirmContext';
import { AppRoutes } from './routes';

function App() {
  return (
    <Router>
      <LoadingProvider>
        <ErrorProvider>
          <AuthProvider>
            <ConfirmProvider>
              <AppRoutes />
            </ConfirmProvider>
          </AuthProvider>
        </ErrorProvider>
      </LoadingProvider>
    </Router>
  );
}