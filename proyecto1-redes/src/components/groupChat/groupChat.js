import React, { useState } from "react";
import "../addContact/addContact.css";

export default function GroupChat({ closePopup, joinGroupChat }) {
    const [groupJid, setGroupJid] = useState('');

    const handleJoinGroup = () => {
        if (groupJid) {
            joinGroupChat(groupJid);
            closePopup();
        } else {
            alert("Por favor ingrese un JID válido");
        }
    };

    return (
        <div className="popupContainer">
            <div className="popupContent">
                <h2>Unirse a un chat grupal</h2>
                <input
                    type="text"
                    value={groupJid}
                    onChange={(e) => setGroupJid(e.target.value)}
                    placeholder="Ingrese el JID del grupo"
                />
                <button className="otrosbttn" onClick={handleJoinGroup}>
                    Unirse al grupo
                </button>
                <button className="closebttn" onClick={closePopup}>Cerrar</button>
            </div>
        </div>
    );
}