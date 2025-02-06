import React, { createContext, useContext, useState, useEffect } from "react";

// Create context
const DataContext = createContext();

// Custom hook to use the context
export const useData = () => {
    return useContext(DataContext);
};

// Provider component
export const DataProvider = ({ children }) => {
    // State for players
    const [players, setPlayers] = useState([]);
    const [loadingPlayers, setLoadingPlayers] = useState(false);
    const [errorPlayers, setErrorPlayers] = useState(null);

    // State for stadium locations
    const [places, setPlaces] = useState([]);
    const [loadingPlaces, setLoadingPlaces] = useState(false);
    const [errorPlaces, setErrorPlaces] = useState(null);

    // State for events
    const [events, setEvents] = useState([]);
    const [loadingEvents, setLoadingEvents] = useState(false);
    const [errorEvents, setErrorEvents] = useState(null);

    // 🔹 Fetch all players
    const fetchPlayers = async () => {
        setLoadingPlayers(true);
        try {
            const response = await fetch("http://localhost:5000/players");
            const data = await response.json();
            setPlayers(data);
            setErrorPlayers(null);
        } catch (err) {
            setErrorPlayers("Failed to fetch players");
        } finally {
            setLoadingPlayers(false);
        }
    };

    // 🔹 Create a new player
    const createPlayer = async (newPlayer) => {
        try {
            const response = await fetch("http://localhost:5000/players", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newPlayer),
            });

            if (!response.ok) throw new Error("Failed to create player");
            const createdPlayer = await response.json();
            setPlayers((prev) => [...prev, createdPlayer]);
        } catch (err) {
            setErrorPlayers(err.message);
        }
    };

    // 🔹 Update an existing player
    const updatePlayer = async (id, updatedPlayer) => {
        try {
            const response = await fetch(`http://localhost:5000/players/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedPlayer),
            });

            if (!response.ok) throw new Error("Failed to update player");
            const updatedData = await response.json();
            setPlayers((prev) =>
                prev.map((player) => (player._id === id ? updatedData : player))
            );
        } catch (err) {
            setErrorPlayers("Failed to update player");
        }
    };

    // 🔹 Delete a player
    const deletePlayer = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/players/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete player");
            setPlayers((prev) => prev.filter((player) => player._id !== id));
        } catch (err) {
            setErrorPlayers("Failed to delete player");
        }
    };

    // 🔹 Fetch all stadium locations
    const fetchPlaces = async () => {
        setLoadingPlaces(true);
        try {
            const response = await fetch("http://localhost:5000/map");
            const data = await response.json();
            setPlaces(data);
            setErrorPlaces(null);
        } catch (err) {
            setErrorPlaces("Failed to fetch places");
        } finally {
            setLoadingPlaces(false);
        }
    };

    // 🔹 Create a new stadium
    const createPlace = async (newPlace) => {
        try {
            const response = await fetch("http://localhost:5000/map", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newPlace),
            });

            if (!response.ok) throw new Error("Failed to create place");
            const createdPlace = await response.json();
            setPlaces((prev) => [...prev, createdPlace]);
        } catch (err) {
            setErrorPlaces(err.message);
        }
    };

    // 🔹 Update a stadium
    const updatePlace = async (id, updatedPlace) => {
        try {
            const response = await fetch(`http://localhost:5000/map/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedPlace),
            });

            if (!response.ok) throw new Error("Failed to update place");
            const updatedData = await response.json();
            setPlaces((prev) =>
                prev.map((place) => (place._id === id ? updatedData : place))
            );
        } catch (err) {
            setErrorPlaces("Failed to update place");
        }
    };

    // 🔹 Delete a stadium
    const deletePlace = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/map${id}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("Failed to delete place");
            setPlaces((prev) => prev.filter((place) => place._id !== id));
        } catch (err) {
            setErrorPlaces("Failed to delete place");
        }
    };
    // 🔹 Fetch all events
    const fetchEvents = async () => {
        setLoadingEvents(true);
        try {
            const response = await fetch("http://localhost:5000/event");
            const data = await response.json();
            setEvents(data);
            setErrorEvents(null);
        } catch (err) {
            setErrorEvents("Failed to fetch events");
        } finally {
            setLoadingEvents(false);
        }
    };

    // 🔹 Add a new event
    const createEvent = async (newEvent) => {
        try {
            // Ensure the date is a string in ISO 8601 format
            const formattedEvent = {
                ...newEvent,
                date: new Date(newEvent.date).toISOString(), // Convert to ISO string
            };
    
            const response = await fetch("http://localhost:5000/event", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formattedEvent),
            });
    
            if (!response.ok) throw new Error("Failed to add event");
            const createdEvent = await response.json();
            setEvents((prev) => [...prev, createdEvent]);
        } catch (err) {
            setErrorEvents(err.message);
        }
    };
    

    // 🔹 Update an existing event
    const updateEvent = async (id, updatedEvent) => {
        try {
            const response = await fetch(`http://localhost:5000/event/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedEvent),
            });

            if (!response.ok) throw new Error("Failed to update event");
            const updatedData = await response.json();
            setEvents((prev) =>
                prev.map((event) => (event._id === id ? updatedData : event))
            );
        } catch (err) {
            setErrorEvents("Failed to update event");
        }
    };

    // 🔹 Delete an event
    const deleteEvent = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/event/${id}`, {
                method: "DELETE",
            });
    
            if (!response.ok) throw new Error("Failed to delete event");
    
            setEvents((prev) => prev.filter((event) => event._id !== id));
        } catch (err) {
            setErrorEvents("Failed to delete event");
        }
    };
    
    


    // Fetch data when component mounts
    useEffect(() => {
        fetchPlayers();
        fetchPlaces();
        fetchEvents();
    }, []);

    return (
        <DataContext.Provider
            value={{
                players,
                loadingPlayers,
                errorPlayers,
                fetchPlayers,
                createPlayer,
                updatePlayer,
                deletePlayer,
                places,
                loadingPlaces,
                errorPlaces,
                fetchPlaces,
                createPlace,
                updatePlace,
                deletePlace,
                events,
                loadingEvents,
                errorEvents,
                fetchEvents,
                createEvent,
                updateEvent,
                deleteEvent
            }}
        >
            {children}
        </DataContext.Provider>
    );
};
