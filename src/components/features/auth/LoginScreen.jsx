
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, Typography, Box } from '@mui/material';
import Input from '../../common/Input';
import Button from '../../common/Button';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';

const LoginScreen = () => {
    const [roomName, setRoomName] = useState('');
    const [key, setKey] = useState('');
    const [username, setUsername] = useState('');

    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleJoin = async () => {
        setError('');
        const compositeKey = `${roomName.trim()}-${key.trim()}`;

        // Check if room exists
        const { data: roomData, error: roomError } = await supabase
            .from('rooms')
            .select('id, hash_key, created_by')
            .eq('hash_key', compositeKey)
            .maybeSingle();

        if (roomError || !roomData) {
            setError('Room not found! Check your name and key.');
            return;
        }

        // Check/Create User in Room
        try {
            const { data: existingUser, error: userFetchError } = await supabase
                .from('room_users')
                .select('passkey')
                .eq('room_id', roomData.id)
                .eq('username', username)
                .maybeSingle();

            if (userFetchError) throw userFetchError;

            if (existingUser) {
                // User exists, allow login without passkey check
            } else {
                // Register new user
                const { error: createError } = await supabase
                    .from('room_users')
                    .insert({
                        room_id: roomData.id,
                        username: username,
                        passkey: ''
                    });

                if (createError) throw createError;
            }

            const isAdmin = roomData.created_by === username;
            login(username, compositeKey, isAdmin);
            navigate(`/room/${roomData.id}`);

        } catch (err) {
            console.error(err);
            setError('Error joining room: ' + err.message);
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
            <Typography variant="h5" align="center" gutterBottom>
                Join a Room
            </Typography>

            <Input
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <Input
                label="Room Name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
            />
            <Input
                label="Room Key (Secret)"
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
            />

            {error && (
                <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}

            <Button onClick={handleJoin} disabled={!roomName || !key || !username}>
                Join Room
            </Button>
            <Button variant="text" onClick={() => navigate('/create')}>
                Create a new Room
            </Button>
        </Paper>
    );
};

export default LoginScreen;
