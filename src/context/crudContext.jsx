import React, { createContext, useContext, useState, useEffect } from "react";

// Create the context
const AllContext = createContext();

// Custom hook to use the context
export const usePlayers = () => {
    return useContext(AllContext);
};

// Provider component
export const DataProvider = ({ children }) => {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all players
    const fetchPlayers = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5000/players");
            const data = await response.json();
            setPlayers(data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch players");
        } finally {
            setLoading(false);
        }
    };

    // Create a new player
    const createPlayer = async (newPlayer) => {
        try {
            const response = await fetch("http://localhost:5000/players", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newPlayer),
            });
            const createdPlayer = await response.json();
            setPlayers((prev) => [...prev, createdPlayer]);
        } catch (err) {
            setError("Failed to create player");
        }
    };

    // Update an existing player
    const updatePlayer = async (id, updatedPlayer) => {
        try {
            // Ensure the ID passed is a valid MongoDB ObjectId format.
            console.log("Updating player with ID:", id);  // Log the ID to check its format
            const response = await fetch(`http://localhost:5000/players/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedPlayer),
            });
    
            if (!response.ok) {
                throw new Error("Error updating player");
            }
    
            const updatedData = await response.json();
            setPlayers((prev) =>
                prev.map((player) => (player._id === id ? updatedData : player))
            );
        } catch (err) {
            console.error("Update error:", err);
            setError("Failed to update player");
        }
    };
    

    // Delete a player
    const deletePlayer = async (id) => {
        console.log("Deleting player with ID:", id);  // Log the ID to check its format
        try {
            const response = await fetch(`http://localhost:5000/players/${id}`, {
                method: "DELETE",
            });
    
            if (!response.ok) {
                throw new Error("Error deleting player");
            }
    
            setPlayers((prev) => prev.filter((player) => player._id !== id));
        } catch (err) {
            console.error("Delete error:", err);
            setError("Failed to delete player");
        }
    };
    


    useEffect(() => {
        fetchPlayers();
    }, []);

    return (
        <AllContext.Provider
            value={{
                players,
                loading,
                error,
                fetchPlayers,
                createPlayer,
                updatePlayer,
                deletePlayer,
            }}
        >
            {children}
        </AllContext.Provider>
    );
};
