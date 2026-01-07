
import React from 'react';
import { Container, Box, Typography } from '@mui/material';

const Layout = ({ children }) => {
    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4, background: 'white', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Movie team
                </Typography>
                <Box sx={{ width: '100%' }}>
                    {children}
                </Box>
            </Box>
        </Container>
    );
};

export default Layout;
