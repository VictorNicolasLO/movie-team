
import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Typography,
    CircularProgress,
    Stack,
    IconButton,
    useMediaQuery,
    useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Input from '../../common/Input';
import { searchMovies, getImageUrl } from '../../../lib/tmdb';

const MovieSearcher = ({ open, onClose, onSelect }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const searchTimeout = useRef(null);

    useEffect(() => {
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        if (!query) {
            setResults([]);
            return;
        }

        // Debounce search by 2 seconds (as requested)
        searchTimeout.current = setTimeout(async () => {
            setLoading(true);
            const movies = await searchMovies(query);
            setResults(movies);
            setLoading(false);
        }, 300);

        return () => clearTimeout(searchTimeout.current);
    }, [query]);

    const handleClose = () => {
        setQuery('');
        setResults([]);
        onClose();
    };
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" fullScreen={isMobile}>
            <DialogTitle sx={{ m: 0, p: 2 }}>
                Suggest a Movie
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent style={{ overflow: 'visible' }}>
                <Stack>
                    <Input

                        autoFocus
                        label="Search Movie..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Type to search..."
                        style={{
                            overflow: 'visible'
                        }}
                    />

                    {loading && (
                        <Box display="flex" justifyContent="center" my={2}>
                            <CircularProgress />
                        </Box>
                    )}

                    <List>
                        {results.map((movie) => (
                            <ListItem
                                key={movie.id}
                                button
                                onClick={() => {
                                    onSelect(movie);
                                    handleClose();
                                }}
                                sx={{
                                    // flexDirection: { xs: 'column', sm: 'row' },
                                    alignItems: 'center',
                                    textAlign: { xs: 'center', sm: 'left' },
                                    py: { xs: 2, sm: 1 }
                                }}
                            >
                                <Box
                                    component="img"
                                    src={getImageUrl(movie.poster_path)}
                                    alt={movie.title}
                                    sx={{
                                        width: { xs: 120, sm: 50 },
                                        height: { xs: 180, sm: 75 },
                                        borderRadius: 1,
                                        objectFit: 'cover',
                                        mr: { xs: 0, sm: 2 },
                                        mb: { xs: 2, sm: 0 },
                                        boxShadow: { xs: 3, sm: 0 }
                                    }}
                                />
                                <ListItemText
                                    primary={movie.title}
                                    secondary={movie.release_date ? movie.release_date.split('-')[0] : 'Unknown Year'}
                                    primaryTypographyProps={{
                                        fontWeight: 'bold',
                                        fontSize: { xs: '1.1rem', sm: '1rem' }
                                    }}
                                />
                            </ListItem>
                        ))}
                        {!loading && query && results.length === 0 && (
                            <Typography variant="body2" align="center" color="textSecondary">
                                No movies found.
                            </Typography>
                        )}
                    </List>
                </Stack>

            </DialogContent>
        </Dialog>
    );
};

export default MovieSearcher;
