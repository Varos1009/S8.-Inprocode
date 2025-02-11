import React, { useEffect, useState } from "react";
import { useData } from "../context/crudContext";


const MyMap = () => {
    const { places, loadingPlaces, errorPlaces, fetchPlaces } = useData();
    
    const [minCapacity, setMinCapacity] = useState("");
    const [maxCapacity, setMaxCapacity] = useState("");
    const [selectedCommunity, setSelectedCommunity] = useState("");

    useEffect(() => {
        fetchPlaces();
    }, []);

    // Get unique communities from database
    const uniqueCommunities = [...new Set(places.map(place => place.community).filter(Boolean))];

    useEffect(() => {
        const map = L.map("map").setView([40.4168, -3.7038], 6); // Default to Madrid, Spain
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        places
            .filter(place => {
                const capacity = parseInt(place.capacity, 10);
                return (!minCapacity || capacity >= minCapacity) && (!maxCapacity || capacity <= maxCapacity);
            })
            .filter(place => !selectedCommunity || place.community === selectedCommunity)
            .forEach((place) => {
                if (place.lat && place.lng) {
                    L.marker([place.lat, place.lng])
                        .addTo(map)
                        .bindPopup(`<b style="color: red">${place.stadium}</b>
                            <span style="color: blue"><br>${place.club}</span>
                            <span style="color: green"><br>Capacity: ${place.capacity}</span>`);
                } else {
                    console.warn(`Invalid coordinates for: ${place.stadium}`);
                }
            });

        return () => map.remove();
    }, [places, minCapacity, maxCapacity, selectedCommunity]);

    if (loadingPlaces) return <p>Loading map...</p>;
    if (errorPlaces) return <p>{errorPlaces}</p>;

    return (
        <div className="container mt-3">
            {/* Filters */}
            <div className="row g-3 align-items-end">
                <div className="col-md-4">
                    <label className="form-label fs-5 text-danger fw-bold">Min Capacity</label>
                    <input 
                        type="number" 
                        className="form-control" 
                        value={minCapacity} 
                        onChange={(e) => setMinCapacity(e.target.value)} 
                        placeholder="Enter min capacity"
                    />
                </div>
                <div className="col-md-4">
                    <label className="form-label fs-5 text-danger fw-bold">Max Capacity</label>
                    <input 
                        type="number" 
                        className="form-control" 
                        value={maxCapacity} 
                        onChange={(e) => setMaxCapacity(e.target.value)} 
                        placeholder="Enter max capacity"
                    />
                </div>
                <div className="col-md-4">
                    <label className="form-label fs-5 text-danger fw-bold">Community</label>
                    <select 
                        className="form-select" 
                        value={selectedCommunity} 
                        onChange={(e) => setSelectedCommunity(e.target.value)}
                    >
                        <option value="">All Communities of Spain</option>
                        {uniqueCommunities.map((community) => (
                            <option key={community} value={community}>{community}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Map */}
            <div id="map" className="mt-4"></div>
        </div>
    );
};

export default MyMap;
