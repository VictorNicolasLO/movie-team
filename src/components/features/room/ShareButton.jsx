
import React, { useState } from 'react';
import { IconButton, Tooltip, Snackbar } from '@mui/material';
import { Share } from '@mui/icons-material';

const ShareButton = ({ roomName, roomKey }) => {
    const [open, setOpen] = useState(false);

    const handleShare = () => {
        try {
            // Encode the key in base64
            const encodedKey = btoa(roomKey);
            const link = `${window.location.origin}/join?room=${encodedKey}`;

            navigator.clipboard.writeText(link);
            setOpen(true);
        } catch (e) {
            console.error("Failed to generate link", e);
        }
    };

    return (
        <>
            <Tooltip title="Share Room Details">
                <IconButton onClick={handleShare} color="primary">
                    <Share />
                </IconButton>
            </Tooltip>
            <Snackbar
                open={open}
                autoHideDuration={2000}
                onClose={() => setOpen(false)}
                message="Room join link copied to clipboard!"
            />
        </>
    );
};

export default ShareButton;
