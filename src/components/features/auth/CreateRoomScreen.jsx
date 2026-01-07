
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
    const [passkey, setPasskey] = useState(''); // New state
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
                    hash_key: compositeKey,
                    created_by: username
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

        // Register Creator in room_users
        const { error: userError } = await supabase
            .from('room_users')
            .insert({
                room_id: data.id,
                username: username,
                passkey: passkey
            });

        if (userError) {
            console.error("Error creating user:", userError);
            setError('Room created but failed to register user. Please try joining manually.');
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
                label="Your Passkey"
                type="password"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                placeholder="Secure your identity"
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

            <Button onClick={handleCreate} disabled={!roomName || !key || !username || !passkey}>
                Create & Join
            </Button>
            <Button variant="text" onClick={() => navigate('/')}>
                Back to Login
            </Button>
        </Paper>
    );
};

export default CreateRoomScreen;
