import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlayers } from "../context/crudContext";

const CreatePlayer = () => {
    const navigate = useNavigate();
    const { players, createPlayer } = usePlayers();
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        position: "",
        dorsal: "",
        age: "",
        nationality: "",
        id: `${players.length + 1}`,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if dorsal number is already taken
        const duplicateDorsal = players.some(
            (player) => player.dorsal === Number(formData.dorsal)
        );

        if (duplicateDorsal) {
            setShowModal(true);
            return;
        }

        try {
            await createPlayer(formData);
            navigate("/"); // Redirect to homepage
        } catch (err) {
            console.error("Error creating player:", err);
        }
    };

    return (
        <div className="container mt-3">
            <h2 className="text-center">Create Player</h2>
            <form onSubmit={handleSubmit} className="p-4 cardFCB shadow rounded bg-light">
                <div className="mb-2">
                    <label className="form-label">Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
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
                        value={formData.position}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="form-label">Dorsal Number:</label>
                    <input
                        type="number"
                        className="form-control"
                        name="dorsal"
                        value={formData.dorsal}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="form-label">Age:</label>
                    <input
                        type="number"
                        className="form-control"
                        name="age"
                        value={formData.age}
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
                        value={formData.nationality}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="d-flex justify-content-center">
                    <button type="submit" className="btn btn-primary me-2">Create</button>
                    <button type="button" className="btn btn-danger" onClick={() => navigate("/")}>
                        Cancel
                    </button>
                </div>
            </form>

            {/* Bootstrap Modal for Duplicate Dorsal */}
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

export default CreatePlayer;
