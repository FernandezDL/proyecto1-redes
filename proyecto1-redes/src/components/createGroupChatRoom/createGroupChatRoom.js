import React, { useState } from "react";
import "../addContact/addContact.css";

export default function CreateGroupChatRoom({ closePopup, createGroupChatRoom }) {
    const [roomName, setRoomName] = useState("");

    const handleCreate = () => {
        if (roomName.trim() !== "") {
            createGroupChatRoom(roomName);
        }
    };

    return (
        <div className="popupContainer">
            <div className="popupContent">
                <h2>Crear nueva sala grupal</h2>
                <input
                    type="text"
                    placeholder="Nombre de la sala grupal"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                />
                <div className="horizontalContainer">
                    <button className="addbttn" onClick={handleCreate}>Crear</button>
                    <button className="closebttn" onClick={closePopup}>Cancelar</button>
                </div>
            </div>
        </div>
    );
}
