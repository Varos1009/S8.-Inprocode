import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import { useData } from "../context/crudContext";


const Calendar = () => {
    const { events, loadingEvents, errorEvents, createEvent, deleteEvent, updateEvent } = useData();
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [screenSize, setScreenSize] = useState(window.innerWidth);
    const [calendarView, setCalendarView] = useState(screenSize < 768 ? "listWeek" : "dayGridMonth");
    const [formError, setFormError] = useState({
        name: false,
        date: false,
        time: false
    });

    const [editEvent, setEditEvent] = useState({
        id: "",
        name: "",
        date: "",
        time: "",
        competition: "",
        place: "",
    });
    const [newEvent, setNewEvent] = useState({
        name: "",
        date: "",
        time: "",
        competition: "",
        place: ""
    });


    useEffect(() => {
        setCalendarEvents(events.map(event => ({
            id: event._id,
            title: event.name,
            start: new Date(event.date),
            extendedProps: {
                time: new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                competition: event.competition,
                place: event.place
            }
        })));
    }, [events]);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setScreenSize(width);
            setCalendarView(width < 768 ? "listWeek" : "dayGridMonth");
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    const openAddModal = () => {
        setNewEvent({
            name: "",
            date: "",
            time: "",
            competition: "",
            place: "",
        });
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
        setNewEvent({
            name: "",
            date: "",
            time: "",
            competition: "",
            place: ""
        });
    };
    const openEventModal = (event) => {
        setSelectedEvent(event);
        setIsEventModalOpen(true);
    };
    const closeEventModal = () => setIsEventModalOpen(false);
    const openEditModal = () => {
        setIsEventModalOpen(false)
        setEditEvent({
            id: selectedEvent.id,
            name: selectedEvent.title,
            date: selectedEvent.start.toISOString().split("T")[0],
            time: selectedEvent.extendedProps.time,
            competition: selectedEvent.extendedProps.competition,
            place: selectedEvent.extendedProps.place,
        });
        setIsEditModalOpen(true);
    };
    const closeEditModal = () => setIsEditModalOpen(false);
    const openDeleteConfirm = () => {
        setIsEventModalOpen(false)
        setIsDeleteConfirmOpen(true);
    }
    const closeDeleteConfirm = () => setIsDeleteConfirmOpen(false);

    const handleAddEvent = () => {
        // Validate required fields
        const errors = {
            name: !newEvent.name,
            date: !newEvent.date,
            time: !newEvent.time
        };

        setFormError(errors);

        if (Object.values(errors).includes(true)) return;

        const eventDate = new Date(`${newEvent.date}T${newEvent.time}:00`);
        const eventToAdd = {
            name: newEvent.name,
            date: eventDate,
            competition: newEvent.competition || "Unknown",
            place: newEvent.place || "Unknown",
        };

        createEvent(eventToAdd);
        closeAddModal();  // Close modal
    };



    const handleEditChange = (e) => {
        setEditEvent({ ...editEvent, [e.target.name]: e.target.value });
    };

    const handleUpdateEvent = () => {
        const updatedEvent = {
            id: editEvent.id,
            name: editEvent.name,
            date: new Date(`${editEvent.date}T${editEvent.time}:00`),
            competition: editEvent.competition,
            place: editEvent.place,
        };
        updateEvent(editEvent.id, updatedEvent);
        closeEditModal();
        closeEventModal();
    };

    const handleDeleteEvent = () => {
        if (selectedEvent) {
            deleteEvent(selectedEvent.id);
            closeDeleteConfirm();
            closeEventModal();
        }
    };


    const renderEventContent = (eventInfo) => {
        return screenSize < 768 ? (
            <div className="bg-danger" onClick={() => openEventModal(eventInfo.event)} role="button">⚪</div>
        ) : (
            <div className="event-title" onClick={() => openEventModal(eventInfo.event)} role="button">
                <strong>{eventInfo.event.title}</strong>
                <br />
                {eventInfo.event.extendedProps.time}
            </div>
        );
    };

    if (loadingEvents) return <p className="text-center">Loading events...</p>;
    if (errorEvents) return <p className="text-danger text-center">{errorEvents}</p>;

    return (
        <div className="container mt-4">
            <h2 className="text-center">📅 Event Calendar</h2>

            {/* Add Event Button */}
            <div className="d-flex justify-content-center mb-3">
                <button className="btn btn-primary" onClick={openAddModal}>➕ Add Event</button>
            </div>



            {/* FullCalendar Component */}
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                initialView={calendarView}
                events={calendarEvents}
                eventContent={renderEventContent}
                height="auto"
                headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: screenSize < 768 ? "listWeek" : "dayGridMonth,timeGridWeek"
                }}
            />

            {/* 🔹 Add Event Modal */}
            <div className={`modal fade ${isAddModalOpen ? "show d-block" : ""}`} tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content cardFCB">
                        <div className="modal-header">
                            <h5 className="modal-title text-white">Add New Event</h5>
                            <button type="button" className="btn-close btn-close-white" onClick={closeAddModal}></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-2">
                                <label className="form-label text-white">Event Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    value={newEvent.name}
                                    onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                                />
                                {formError.name && <small className="text-danger">This field is required</small>}
                            </div>

                            <div className="mb-2">
                                <label className="form-label text-white">Date *</label>
                                <input
                                    type="date"
                                    name="date"
                                    className="form-control"
                                    value={newEvent.date}
                                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                />
                                {formError.date && <small className="text-danger">This field is required</small>}
                            </div>

                            <div className="mb-2">
                                <label className="form-label text-white">Time *</label>
                                <input
                                    type="time"
                                    name="time"
                                    className="form-control"
                                    value={newEvent.time}
                                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                                />
                                {formError.time && <small className="text-danger">This field is required</small>}
                            </div>

                            <div className="mb-2">
                                <label className="form-label text-white">Competition (Optional)</label>
                                <input
                                    type="text"
                                    name="competition"
                                    className="form-control"
                                    value={newEvent.competition}
                                    onChange={(e) => setNewEvent({ ...newEvent, competition: e.target.value })}
                                />
                            </div>

                            <div className="mb-2">
                                <label className="form-label text-white">Location (Optional)</label>
                                <input
                                    type="text"
                                    name="place"
                                    className="form-control"
                                    value={newEvent.place}
                                    onChange={(e) => setNewEvent({ ...newEvent, place: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-danger" onClick={closeAddModal}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleAddEvent}>Add Event</button>

                        </div>
                    </div>
                </div>
            </div>

            {/* 🔹 Edit Event Modal */}
            <div className={`modal fade ${isEditModalOpen ? "show d-block" : ""}`} tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content cardFCB">
                        <div className="modal-header">
                            <h5 className="modal-title text-white">Edit Event</h5>
                            <button type="button" className="btn-close btn-close-white" onClick={closeEditModal}></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-2">
                                <label className="form-label text-white">Event Name *</label>
                                <input type="text" name="name" className="form-control" value={editEvent.name} onChange={handleEditChange} />
                            </div>
                            <div className="mb-2">
                                <label className="form-label text-white">Date *</label>
                                <input type="date" name="date" className="form-control" value={editEvent.date} onChange={handleEditChange} />
                            </div>
                            <div className="mb-2">
                                <label className="form-label text-white">Time *</label>
                                <input type="time" name="time" className="form-control" value={editEvent.time} onChange={handleEditChange} />
                            </div>
                            <div className="mb-2">
                                <label className="form-label text-white">Competition (Optional)</label>
                                <input type="text" name="competition" className="form-control" value={editEvent.competition} onChange={handleEditChange} />
                            </div>
                            <div className="mb-2">
                                <label className="form-label text-white">Location (Optional)</label>
                                <input type="text" name="place" className="form-control" value={editEvent.place} onChange={handleEditChange} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-danger" onClick={closeEditModal}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleUpdateEvent}>Save Changes</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 🔹 Event Info Modal */}
            {selectedEvent && (
                <div className={`modal fade ${isEventModalOpen ? "show d-block" : ""}`} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content cardFCB">
                            <div className="modal-header">
                                <h5 className="modal-title text-white">{selectedEvent.title}</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={closeEventModal}></button>
                            </div>
                            <div className="modal-body text-white">
                                <p><strong>Date:</strong> {selectedEvent.start.toDateString()}</p>
                                <p><strong>Time:</strong> {selectedEvent.extendedProps.time}</p>
                                <p><strong>Competition:</strong> {selectedEvent.extendedProps.competition}</p>
                                <p><strong>Location:</strong> {selectedEvent.extendedProps.place}</p>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-warning" onClick={openEditModal}>Edit</button>
                                <button className="btn btn-danger" onClick={openDeleteConfirm}>Delete</button>
                                <button className="btn btn-primary" onClick={closeEventModal}>Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 🔹 Confirm Delete Modal */}
            <div className={`modal fade ${isDeleteConfirmOpen ? "show d-block" : ""}`} tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content cardFCB">
                        <div className="modal-header">
                            <h5 className="modal-title text-white">Confirm Delete</h5>
                        </div>
                        <div className="modal-body text-white">
                            <p>Are you sure you want to delete <strong>{selectedEvent?.title}</strong>?</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-danger" onClick={handleDeleteEvent}>Yes, Delete</button>
                            <button className="btn btn-primary" onClick={closeDeleteConfirm}>Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calendar;
