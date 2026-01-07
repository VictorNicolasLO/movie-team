
import React from 'react';
import { Box, Typography } from '@mui/material';
import MovieItem from './MovieItem';

const MovieList = ({ suggestions }) => {
    if (!suggestions || suggestions.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 4, opacity: 0.7 }}>
                <Typography variant="body1">No movies yet.</Typography>
                <Typography variant="body2">Be the first to suggest one!</Typography>
            </Box>
        );
    }

    // Sort by score (desc) then by creation time
    const sortedSuggestions = [...suggestions].sort((a, b) => b.score - a.score);

    return (
        <Box>
            {sortedSuggestions.map((suggestion) => (
                <MovieItem key={suggestion.id} suggestion={suggestion} />
            ))}
        </Box>
    );
};

export default MovieList;
