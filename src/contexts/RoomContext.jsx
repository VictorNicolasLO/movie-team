
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const RoomContext = createContext();

export const useRoom = () => useContext(RoomContext);

export const RoomProvider = ({ children }) => {
    const { roomKey, username } = useAuth();
    const [roomData, setRoomData] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchRoom = useCallback(async () => {
        if (!roomKey) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('rooms')
                .select('*')
                .eq('hash_key', roomKey)
                .single();

            if (error) throw error;
            setRoomData(data);

            if (data) {
                // Fetch suggestions
                refreshSuggestions(data.id);
            }
        } catch (err) {
            console.error("Error fetching room:", err);
            setError(err.message);
            setRoomData(null);
        } finally {
            setLoading(false);
        }
    }, [roomKey]);

    const refreshSuggestions = async (roomId) => {
        if (!roomId) roomId = roomData?.id;
        if (!roomId) return;

        const { data, error } = await supabase
            .from('suggestions')
            .select(`
        *,
        votes (
          voter_id,
          value
        )
      `)
            .eq('room_id', roomId);

        if (error) {
            console.error("Error fetching suggestions:", error);
            return;
        }

        // Calculate vote counts
        const processedSuggestions = data.map(s => {
            const upvotes = s.votes.filter(v => v.value === 1).length;
            const downvotes = s.votes.filter(v => v.value === -1).length;
            const score = upvotes - downvotes;
            const myVote = s.votes.find(v => v.voter_id === username)?.value || 0;
            return { ...s, score, myVote };
        });

        setSuggestions(processedSuggestions);
    };


    const addSuggestion = async (movie) => {
        if (!roomData?.id || !username) return;

        // Check if already suggested
        const exists = suggestions.find(s => s.tmdb_id === movie.id.toString());
        if (exists) return; // Or show error

        const { data: suggestionData, error: suggestionError } = await supabase
            .from('suggestions')
            .insert({
                room_id: roomData.id,
                tmdb_id: movie.id.toString(),
                title: movie.title,
                poster_path: movie.poster_path,
                suggested_by: username,
            })
            .select()
            .single();

        if (suggestionError) {
            console.error("Error adding suggestion:", suggestionError);
            return;
        }

        // Auto-vote up by suggester
        await vote(suggestionData.id, 1);

        refreshSuggestions(roomData.id);
    };

    const vote = async (suggestionId, value) => {
        if (!username) return;

        // Upsert vote
        const { error } = await supabase
            .from('votes')
            .upsert({
                suggestion_id: suggestionId,
                voter_id: username,
                value: value
            }, { onConflict: 'suggestion_id, voter_id' });

        if (error) {
            console.error("Error voting:", error);
        } else {
            refreshSuggestions(roomData.id);
        }
    };

    const removeSuggestion = async (suggestionId) => {
        const { error } = await supabase
            .from('suggestions')
            .delete()
            .eq('id', suggestionId);

        if (!error) refreshSuggestions(roomData.id);
    };

    const toggleWatched = async (suggestionId, currentStatus) => {
        const { error } = await supabase
            .from('suggestions')
            .update({ is_watched: !currentStatus })
            .eq('id', suggestionId);

        if (!error) refreshSuggestions(roomData.id);
    };

    useEffect(() => {
        fetchRoom();
    }, [fetchRoom]);

    return (
        <RoomContext.Provider value={{
            roomData,
            suggestions,
            loading,
            error,
            refreshSuggestions,
            fetchRoom,
            addSuggestion,
            vote,
            removeSuggestion,
            toggleWatched
        }}>
            {children}
        </RoomContext.Provider>
    );
};
