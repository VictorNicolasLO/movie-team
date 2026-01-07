
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './components/features/auth/LoginScreen';
import CreateRoomScreen from './components/features/auth/CreateRoomScreen';
import RoomView from './components/features/room/RoomView';
import Layout from './components/common/Layout';
import { useAuth } from './contexts/AuthContext';

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
      <Route path="/" element={<Layout><LoginScreen /></Layout>} />
      <Route path="/create" element={<Layout><CreateRoomScreen /></Layout>} />
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
