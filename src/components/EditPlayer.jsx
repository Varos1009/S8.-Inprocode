import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "../context/crudContext";


const EditPlayer = () => {
    const { id } = useParams();  // Get player ID from URL
    const navigate = useNavigate();
    const { players, updatePlayer } = useData();
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);

    // Find player data from context
    const existingPlayer = players.find((player) => player._id === id);
    const [formData, setFormData] = useState(existingPlayer || {});

    // ✅ Prevent infinite re-renders by checking if the data actually changes
    useEffect(() => {
        if (existingPlayer && existingPlayer._id !== formData._id) {
            setFormData(existingPlayer);
        }
    }, [existingPlayer]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if dorsal number is already taken
        const duplicateDorsal = players.some(
            (player) => player.dorsal === Number(formData.dorsal) && player._id !== id
        );

        if (duplicateDorsal) {
            setShowModal(true); // Show modal if duplicate dorsal number exists
            return;
        }

        try {
            await updatePlayer(id, formData);
            navigate("/");
        } catch (err) {
            setError("Error updating player.");
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

            {showModal && <div className="modal-backdrop fade show"></div>}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Dorsal Number Error</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>The dorsal number is already taken by another player. Please choose a different number.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" onClick={() => setShowModal(false)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditPlayer;
