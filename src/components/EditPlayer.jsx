import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePlayers } from "../context/crudContext";


const EditPlayer = () => {
    const { id } = useParams();  // Get player ID from URL
    const navigate = useNavigate();
    const { players, updatePlayer } = usePlayers();
    const [error, setError] = useState("");

    // Find player data from context
    const existingPlayer = players.find((player) => player._id === id) || {};
    const [formData, setFormData] = useState(existingPlayer);

    useEffect(() => {
        setFormData(existingPlayer);
    }, [existingPlayer]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updatePlayer(id, formData);
            navigate("/");
        } catch (err) {
            setError(err.message || "Failed to update player.");
        }
    };

    return (
        <div className="container mt-1">
            <h2 className="text-center">Edit Player</h2>
            <form onSubmit={handleSubmit} className="p-4 cardFCB shadow rounded bg-light">
                <div className="mb-2">
                    <label className="form-label">Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name || ""}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="form-label">Position:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="position"
                        value={formData.position || ""}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="form-label">Dorsal Number:</label>
                    <input
                        type="number"
                        className={`form-control ${error ? "is-invalid" : ""}`}
                        name="dorsal"
                        value={formData.dorsal || ""}
                        onChange={handleChange}
                        required
                    />
                    {error && <div className="invalid-feedback">{error}</div>}
                </div>
                <div className="mb-2">
                    <label className="form-label">Age:</label>
                    <input
                        type="number"
                        className="form-control"
                        name="age"
                        value={formData.age || ""}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Nationality:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="nationality"
                        value={formData.nationality || ""}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="d-flex justify-content-center">
                    <button type="submit" className="btn btn-primary me-2">Update</button>
                    <button type="button" className="btn btn-danger" onClick={() => navigate("/")}>
                        Cancel
                    </button>
                </div>

            </form>
        </div>
    );
};

export default EditPlayer;
