
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, Typography } from '@mui/material';
import Input from '../../common/Input';
import Button from '../../common/Button';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';

const CreateRoomScreen = () => {
    const [roomName, setRoomName] = useState('');
    const [key, setKey] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleCreate = async () => {
        setError('');
        const compositeKey = `${roomName.trim()}-${key.trim()}`;

        // Create room in Supabase
        const { data, error: insertError } = await supabase
            .from('rooms')
            .insert([
                {
                    name: roomName,
                    hash_key: compositeKey
                }
            ])
            .select()
            .single();

        if (insertError) {
            if (insertError.code === '23505') { // Unique violation
                setError('Room with this name and key already exists.');
            } else {
                setError('Error creating room: ' + insertError.message);
            }
            return;
        }

        login(username, compositeKey, true); // Creator is admin
        navigate(`/room/${data.id}`);
    };

    return (
        <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
            <Typography variant="h5" align="center" gutterBottom>
                Create a Room
            </Typography>

            <Input
                label="Your Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <Input
                label="Room Name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
            />
            <Input
                label="Secret Key (for access)"
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
            />

            {error && (
                <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}

            <Button onClick={handleCreate} disabled={!roomName || !key || !username}>
                Create & Join
            </Button>
            <Button variant="text" onClick={() => navigate('/')}>
                Back to Login
            </Button>
        </Paper>
    );
};

export default CreateRoomScreen;
