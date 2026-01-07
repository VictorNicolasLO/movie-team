
import React from 'react';
import { Button as MuiButton } from '@mui/material';

const Button = ({ children, onClick, variant = 'contained', color = 'primary', ...props }) => {
    return (
        <MuiButton
            fullWidth
            variant={variant}
            color={color}
            onClick={onClick}
            sx={{ py: 1.5, my: 1, fontWeight: 'bold' }}
            {...props}
        >
            {children}
        </MuiButton>
    );
};

export default Button;
