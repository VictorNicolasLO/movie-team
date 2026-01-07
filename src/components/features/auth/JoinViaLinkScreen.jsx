import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Paper, Typography, Box } from '@mui/material';
import Input from '../../common/Input';
import Button from '../../common/Button';
import { useAuth } from '../../../contexts/AuthContext';
import { supabase } from '../../../lib/supabase';

const JoinViaLinkScreen = () => {
    const [searchParams] = useSearchParams();
    const [username, setUsername] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [roomName, setRoomName] = useState('');
    const [roomKey, setRoomKey] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const checkRoom = async () => {
            const encodedRoom = searchParams.get('room');
            if (!encodedRoom) {
                setError('Invalid link: Missing room parameters.');
                setLoading(false);
                return;
            }

            try {
                // Decode base64
                const decodedKey = atob(encodedRoom);
                setRoomKey(decodedKey);

                // Verify room exists
                const { data, error } = await supabase
                    .from('rooms')
                    .select('name, id')
                    .eq('hash_key', decodedKey)
                    .maybeSingle();

                if (error || !data) {
                    setError('Room not found or link is invalid.');
                } else {
                    setRoomName(data.name);
                }
            } catch (e) {
                console.error("Error decoding link", e);
                setError('Invalid link format.');
            } finally {
                setLoading(false);
            }
        };

        checkRoom();
    }, [searchParams]);

    const handleJoin = async () => {
        setError('');
        if (!roomKey) return;

        try {
            // Check room ID again to be safe and get ID
            const { data: roomData, error: roomError } = await supabase
                .from('rooms')
                .select('id, created_by')
                .eq('hash_key', roomKey)
                .single();

            if (roomError || !roomData) {
                setError('Room unavailable.');
                return;
            }

            // Check/Create User
            const { data: existingUser, error: userFetchError } = await supabase
                .from('room_users')
                .select('passkey')
                .eq('room_id', roomData.id)
                .eq('username', username)
                .maybeSingle();

            if (userFetchError) throw userFetchError;

            if (existingUser) {
                // User exists, allow join
            } else {
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
            login(username, roomKey, isAdmin);
            navigate(`/room/${roomData.id}`);

        } catch (err) {
            console.error(err);
            setError('Error joining room: ' + err.message);
        }
    };

    if (loading) {
        return (
            <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400, textAlign: 'center' }}>
                <Typography>Verifying link...</Typography>
            </Paper>
        );
    }

    if (error && !roomName) {
        return (
            <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400, textAlign: 'center' }}>
                <Typography color="error" gutterBottom>{error}</Typography>
                <Button onClick={() => navigate('/')}>Go Home</Button>
            </Paper>
        );
    }

    return (
        <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
            <Typography variant="h5" align="center" gutterBottom>
                Join {roomName}
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                You've been invited to join a movie room!
            </Typography>

            <Input
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />


            {error && (
                <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            )}

            <Button onClick={handleJoin} disabled={!username}>
                Join Room
            </Button>
            <Button variant="text" onClick={() => navigate('/')}>
                Cancel
            </Button>
        </Paper>
    );
};

export default JoinViaLinkScreen;
