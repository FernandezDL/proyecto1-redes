import React, { useState } from "react";
import "../addContact/addContact.css";

export default function PresencePopup({ closePopup, updatePresence }) {
    const [status, setStatus] = useState("available");
    const [statusMessage, setStatusMessage] = useState("");

    const handlePresenceChange = () => {
        updatePresence(status, statusMessage);
        closePopup();
    };

    return (
        <div className="popupContainer">
            <div className="popupContent">
                <h2>Cambiar Presencia</h2>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="available">Available</option>
                    <option value="away">Away</option>
                    <option value="xa">Not Available</option>
                    <option value="dnd">Busy</option>
                    <option value="offline">Offline</option>
                </select>
                <input
                    type="text"
                    value={statusMessage}
                    onChange={(e) => setStatusMessage(e.target.value)}
                    placeholder="Mensaje de estado"
                />
                <button className="otrosbttn" onClick={handlePresenceChange}>Actualizar</button>
                <button className="closebttn" onClick={closePopup}>Cerrar</button>
            </div>
        </div>
    );
}
