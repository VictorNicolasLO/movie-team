
import React from 'react';
import { TextField } from '@mui/material';

const Input = ({ label, value, onChange, type = 'text', ...props }) => {
    return (
        <TextField
            fullWidth
            variant="outlined"
            label={label}
            value={value}
            onChange={onChange}
            type={type}
            sx={{ mb: 2 }}
            InputLabelProps={{
                style: { color: '#bbb' },
            }}
            {...props}
        />
    );
};

export default Input;
