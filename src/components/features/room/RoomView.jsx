
import React, { useState } from 'react';
import {
    Paper,
    Typography,
    Box,
    Tabs,
    Tab,
    Fab
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useRoom } from '../../../contexts/RoomContext';
import { useAuth } from '../../../contexts/AuthContext';
import MovieList from './MovieList';
import MovieSearcher from '../search/MovieSearcher';
import ShareButton from './ShareButton';
import Button from '../../common/Button';
import { useNavigate } from 'react-router-dom';

const RoomView = () => {
    const { roomData, suggestions, loading, addSuggestion } = useRoom();
    const { isAdmin, logout, roomKey } = useAuth(); // Assuming roomKey is stored in AuthContext
    const [tabValue, setTabValue] = useState(0);
    const [searchOpen, setSearchOpen] = useState(false);
    const navigate = useNavigate();

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleExit = () => {
        logout();
        navigate('/');
    };

    if (!roomData) {
        if (loading) return <Typography>Loading room...</Typography>;
        return <Typography>Room not found.</Typography>;
    }

    const activeMovies = suggestions.filter(s => !s.is_watched);
    const watchedMovies = suggestions.filter(s => s.is_watched);

    return (
        <Box>
            {/* Header */}
            <Paper elevation={2} sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h5" fontWeight="bold">{roomData.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                        Hosted by Admin • {suggestions.length} Movies
                    </Typography>
                </Box>
                <Box>
                    {isAdmin && <ShareButton roomName={roomData.name} roomKey={roomData.hash_key} />}
                    <Button variant="outlined" size="small" onClick={handleExit} sx={{ ml: 1, minWidth: 'auto' }}>
                        Exit
                    </Button>
                </Box>
            </Paper>

            {/* Tabs */}
            <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ mb: 2 }}>
                <Tab label={`Pending (${activeMovies.length})`} />
                <Tab label={`Watched (${watchedMovies.length})`} />
            </Tabs>

            {/* Content */}
            <Box sx={{ minHeight: 300 }}>
                {tabValue === 0 ? (
                    <MovieList suggestions={activeMovies} />
                ) : (
                    <MovieList suggestions={watchedMovies} />
                )}
            </Box>

            {/* Floating Action Button for Adding */}
            <Fab
                color="primary"
                aria-label="add"
                sx={{ position: 'fixed', bottom: 32, right: 32 }}
                onClick={() => setSearchOpen(true)}
            >
                <Add />
            </Fab>

            {/* Search Modal */}
            <MovieSearcher
                open={searchOpen}
                onClose={() => setSearchOpen(false)}
                onSelect={(movie) => addSuggestion(movie)}
            />
        </Box>
    );
};

export default RoomView;
