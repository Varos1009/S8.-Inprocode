import React, { useState } from "react";
import { Link } from "react-router-dom";
import { usePlayers } from "../context/crudContext";


const Home = () => {
    const { players, loading, error, deletePlayer } = usePlayers();
    const [showModal, setShowModal] = useState(false);
    const [playerToDelete, setPlayerToDelete] = useState(null);

    // Show confirmation modal before deleting
    const handleDeleteClick = (id) => {
        setPlayerToDelete(id);
        setShowModal(true);
    };

    // Confirm and delete player
    const confirmDelete = async () => {
        if (playerToDelete) {
            await deletePlayer(playerToDelete); // Ensure the delete request happens
        }
        setShowModal(false);
        setPlayerToDelete(null);
    };

    // Close modal without deleting
    const cancelDelete = () => {
        setShowModal(false);
        setPlayerToDelete(null);
    };

    if (loading) return <p className="text-center mt-3">Loading...</p>;
    if (error) return <p className="text-center text-danger">{error}</p>;

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Players List</h2>
            <div className="row">
                {players.map((player) => (
                    <div key={player._id} className="col-md-4 col-lg-3 col-sm-6 mb-4">
                        <div className="card cardFCB shadow-sm h-100 text-white">
                            <div className="card-body text-center">
                                <h5 className="card-title text-warning fw-bold">{player.name}</h5>
                                <h6 className="card-subtitle mb-2 ">{player.position}</h6>
                                <p className="card-text">
                                    <strong>Dorsal:</strong> {player.dorsal} <br />
                                    <strong>Age:</strong> {player.age} <br />
                                    <strong>Nationality:</strong> {player.nationality}
                                </p>
                                <Link to={`/edit/${player._id}`} className="btn btn-primary btn-sm me-2">
                                    Edit
                                </Link>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDeleteClick(player._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Delete Confirmation Modal */}
            {showModal && <div className="modal-backdrop fade show"></div>}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content ">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Deletion</h5>
                                <button type="button" className="btn-close" onClick={cancelDelete}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete this player? This action cannot be undone.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={cancelDelete}>
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-danger" onClick={confirmDelete}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
