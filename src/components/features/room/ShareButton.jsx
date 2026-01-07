
import React, { useState } from 'react';
import { IconButton, Tooltip, Snackbar } from '@mui/material';
import { Share } from '@mui/icons-material';

const ShareButton = ({ roomName, roomKey }) => {
    const [open, setOpen] = useState(false);

    const handleShare = () => {
        // For now, we will just copy the Room Name and Key
        // Or we could construct a URL if we had a dedicated join route with query params
        // But per requirements: "If you are joining from a link you should be able to put your username and a secretKey"
        // I will just copy the text for now as a simple implementation or generate a hypothetical link

        // We didn't build a /join?key=... route yet, so let's stick to copying info
        const text = `Join my Movie Night room!\nRoom: ${roomName}\nKey: ${roomKey.split('-').pop()}`; // Assuming composite key roomName-key

        navigator.clipboard.writeText(text);
        setOpen(true);
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
                message="Room details copied to clipboard!"
            />
        </>
    );
};

export default ShareButton;
