import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useData } from "../context/crudContext";


const Calendar = () => {
    const { events, loadingEvents, errorEvents, createEvent, deleteEvent } = useData();
    const [calendarEvents, setCalendarEvents] = useState([]);

    // Modals state
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [eventToDelete, setEventToDelete] = useState(null);

    // New event state
    const [newEvent, setNewEvent] = useState({
        name: "",
        date: "",
        time: "",
        competition: "",
        place: "",
    });

    useEffect(() => {
        setCalendarEvents(
            events.map(event => ({
                id: event._id,
                title: event.name,
                start: new Date(event.date),
                extendedProps: {
                    competition: event.competition,
                    place: event.place
                }
            }))
        );
    }, [events]);

    // Open Add Event Modal
    const openAddModal = () => {
        setIsAddModalOpen(true);
    };

    // Close Add Event Modal
    const closeAddModal = () => {
        setIsAddModalOpen(false);
        setNewEvent({ name: "", date: "", time: "", competition: "", place: "" });
    };

    // Open Delete Event Modal
    const openDeleteModal = (event) => {
        setEventToDelete(event);
        setIsDeleteModalOpen(true);
    };

    // Close Delete Event Modal
    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setEventToDelete(null);
    };

    // Handle form input changes
    const handleChange = (e) => {
        setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
    };

    // Add Event
    const handleAddEvent = () => {
        if (!newEvent.name || !newEvent.date || !newEvent.time) {
            alert("Please fill in all required fields (Name, Date, Time)");
            return;
        }

        const eventToAdd = {
            name: newEvent.name,
            date: new Date(`${newEvent.date}T${newEvent.time}:00`),
            competition: newEvent.competition || "Unknown",
            place: newEvent.place || "Unknown",
        };

        createEvent(eventToAdd);
        closeAddModal();
    };

    // Delete Event
    const handleDeleteEvent = () => {
        if (eventToDelete) {
            deleteEvent(eventToDelete.id);
            closeDeleteModal();
        }
    };

    if (loadingEvents) return <p className="text-center">Loading events...</p>;
    if (errorEvents) return <p className="text-danger text-center">{errorEvents}</p>;

    return (
        <div className="container mt-4">
            <h2 className="text-center">📅 Event Calendar</h2>

            {/* Add Event Button */}
            <div className="d-flex justify-content-center my-3">
                <button onClick={openAddModal} className="btn btn-primary">
                    ➕ Add Event
                </button>
            </div>

            {/* FullCalendar Component */}
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={calendarEvents}
                eventClick={(info) => openDeleteModal(info.event)}
                height="auto"
            />

            {/* 🔹 Add Event Modal */}
            <div className={`modal fade ${isAddModalOpen ? "show d-block" : ""}`} tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Add New Event</h5>
                            <button type="button" className="btn-close" onClick={closeAddModal}></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-2">
                                <label className="form-label">Event Name *</label>
                                <input type="text" name="name" className="form-control" value={newEvent.name} onChange={handleChange} />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Date *</label>
                                <input type="date" name="date" className="form-control" value={newEvent.date} onChange={handleChange} />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Time *</label>
                                <input type="time" name="time" className="form-control" value={newEvent.time} onChange={handleChange} />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Competition (Optional)</label>
                                <input type="text" name="competition" className="form-control" value={newEvent.competition} onChange={handleChange} />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Location (Optional)</label>
                                <input type="text" name="place" className="form-control" value={newEvent.place} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={closeAddModal}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleAddEvent}>Add Event</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🔹 Delete Event Modal */}
            <div className={`modal fade ${isDeleteModalOpen ? "show d-block" : ""}`} tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Delete Event</h5>
                            <button type="button" className="btn-close" onClick={closeDeleteModal}></button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete <strong>{eventToDelete?.title}</strong>?</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={closeDeleteModal}>Cancel</button>
                            <button className="btn btn-danger" onClick={handleDeleteEvent}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bootstrap modal backdrop */}
            {(isAddModalOpen || isDeleteModalOpen) && <div className="modal-backdrop fade show"></div>}
        </div>
    );
};

export default Calendar;
