
import React from 'react';
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Box,
    IconButton,
    Chip,
    Tooltip
} from '@mui/material';
import {
    ArrowUpward,
    ArrowDownward,
    Delete,
    CheckCircle,
    CheckCircleOutline
} from '@mui/icons-material';
import { getImageUrl } from '../../../lib/tmdb';
import { useAuth } from '../../../contexts/AuthContext';
import { useRoom } from '../../../contexts/RoomContext';

const MovieItem = ({ suggestion }) => {
    const { isAdmin, username } = useAuth();
    const { vote, removeSuggestion, toggleWatched } = useRoom();
    const {
        id,
        title,
        poster_path,
        score,
        suggested_by,
        is_watched,
        myVote
    } = suggestion;

    const canRemove = isAdmin || suggested_by === username;

    return (
        <Card sx={{ display: 'flex', mb: 2, position: 'relative', overflow: 'visible' }}>
            {/* Poster Image */}
            <CardMedia
                component="img"
                sx={{ width: 100 }}
                image={getImageUrl(poster_path)}
                alt={title}
            />

            {/* Content */}
            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <CardContent sx={{ flex: '1 0 auto', pb: 1 }}>
                    <Typography component="div" variant="h6" sx={{ lineHeight: 1.2, mb: 0.5 }}>
                        {title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" component="div">
                        Suggested by {suggested_by}
                    </Typography>
                </CardContent>

                {/* Actions Bar */}
                <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1, pr: 1 }}>

                    {/* Voting */}
                    {!is_watched && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mr: 'auto', bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1 }}>
                            <IconButton
                                size="small"
                                onClick={() => vote(id, 1)}
                                color={myVote === 1 ? 'primary' : 'default'}
                            >
                                <ArrowUpward fontSize="small" />
                            </IconButton>
                            <Typography variant="body2" sx={{ mx: 1, fontWeight: 'bold' }}>
                                {score}
                            </Typography>
                            <IconButton
                                size="small"
                                onClick={() => vote(id, -1)}
                                color={myVote === -1 ? 'secondary' : 'default'}
                            >
                                <ArrowDownward fontSize="small" />
                            </IconButton>
                        </Box>
                    )}

                    {/* Admin/Owner Actions */}
                    <Box>
                        {isAdmin && (
                            <Tooltip title={is_watched ? "Mark as Unwatched" : "Mark as Watched"}>
                                <IconButton onClick={() => toggleWatched(id, is_watched)}>
                                    {is_watched ? <CheckCircle color="success" /> : <CheckCircleOutline />}
                                </IconButton>
                            </Tooltip>
                        )}

                        {canRemove && (
                            <Tooltip title="Remove suggestion">
                                <IconButton onClick={() => removeSuggestion(id)} color="error">
                                    <Delete fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                </Box>
            </Box>
        </Card>
    );
};

export default MovieItem;
