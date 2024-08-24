import React from "react";
import "./moreOptions.css";

export default function MoreOptions({ closePopup, openAddContactPopup, openNewChatPopup, openGroupChatPopup, openPresencePopup }) {
    const handleAddContact = () => {
        closePopup(); 
        openAddContactPopup(); 
    };

    const handleGroupChat = () => {
        closePopup();
        openGroupChatPopup(); 
    };

    const handlePresencePopup = () => {
        closePopup();
        openPresencePopup(); // Abre el popup de cambiar presencia
    };

    return(
        <div className="popupContainer">
            <div className="popupContent">
                <h2>Más opciones :D</h2>
               
                <button className="otrosbttn" onClick={openNewChatPopup}>Nuevo chat</button>
                <button className="otrosbttn" onClick={handleGroupChat}>Nuevo chat grupal</button>
                <button className="addbttn" onClick={handleAddContact}>Añadir contacto</button>
                <button className="addbttn" onClick={handlePresencePopup}>Cambiar mensaje de presencia</button>
                <button className="closebttn" onClick={closePopup}>Cerrar</button>
            </div>
        </div>
    );
}
