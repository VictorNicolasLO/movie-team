
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './components/features/auth/LoginScreen';
import CreateRoomScreen from './components/features/auth/CreateRoomScreen';
import JoinViaLinkScreen from './components/features/auth/JoinViaLinkScreen';
import RoomView from './components/features/room/RoomView';
import Layout from './components/common/Layout';
import { useAuth } from './contexts/AuthContext';
import AuthLayout from './components/common/AuthLayout';

const ProtectedRoute = ({ children }) => {
  const { username, roomKey } = useAuth();
  if (!username || !roomKey) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthLayout><LoginScreen /></AuthLayout>} />
      <Route path="/create" element={<AuthLayout><CreateRoomScreen /></AuthLayout>} />
      <Route path="/join" element={<AuthLayout><JoinViaLinkScreen /></AuthLayout>} />
      <Route
        path="/room/:id"
        element={
          <ProtectedRoute>
            <Layout><RoomView /></Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
