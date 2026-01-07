
import React from 'react';
import { Container, Box, Typography } from '@mui/material';

const Layout = ({ children }) => {
    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4, background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Movie Night
                </Typography>
                <Box sx={{ width: '100%' }}>
                    {children}
                </Box>
            </Box>
        </Container>
    );
};

export default Layout;
