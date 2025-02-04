import React, { useEffect } from "react";
import { useData } from "../context/crudContext";


const Map = () => {
    const { places, loadingPlaces, errorPlaces, fetchPlaces } = useData();

    useEffect(() => {
        fetchPlaces();
    }, []);

    useEffect(() => {
        const map = L.map("map").setView([40.4168, -3.7038], 6); // Default to Madrid, Spain
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        // Place markers for each place, but ensure lat and lng are valid
        places.forEach((place) => {
            // Validate lat and lng before using them
            if (place.lat && place.lng) {
                L.marker([place.lat, place.lng])
                    .addTo(map)
                    .bindPopup(`<b style="color: red">${place.stadium}</b>
                        <span style="color: blue">
                          <br>${place.club}
                        </span>
                        <span style="color: green">  
                          <br>Capacity: ${place.capacity}
                        </span>`);
            } else {
                console.warn(`Invalid coordinates for place: ${place.stadium}`);
            }
        });

        return () => map.remove();
    }, [places]);

    if (loadingPlaces) return <p>Loading map...</p>;
    if (errorPlaces) return <p>{errorPlaces}</p>;

    return <div id="map"></div>;
};

export default Map;
