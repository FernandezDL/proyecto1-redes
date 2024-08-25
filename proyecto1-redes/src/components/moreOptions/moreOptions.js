import React from "react";
import "./moreOptions.css";

export default function MoreOptions({ closePopup, openAddContactPopup, openNewChatPopup, openGroupChatPopup, openPresencePopup, openEliminarCuenta }) {
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

    const handleEliminarCuenta = () => {
        closePopup();
        openEliminarCuenta(); 
    };

    return(
        <div className="popupContainer">
            <div className="popupContent">
                <h2>Más opciones :D</h2>
               
                <div className="horizontalContainer">
                    <button className="otrosbttn" onClick={openNewChatPopup}>Nuevo chat</button>
                    <button className="otrosbttn" onClick={handleGroupChat}>Nuevo chat grupal</button>
                </div>
                
                <div className="horizontalContainer">
                    <button className="addbttn" onClick={handleAddContact}>Añadir contacto</button>
                    <button className="addbttn" onClick={handlePresencePopup}>Cambiar mensaje de presencia</button>
                </div>
                
                <div className="horizontalContainer">
                    <button className="closebttn" onClick={handleEliminarCuenta}>Eliminar sesión</button>
                    <button className="closebttn" onClick={closePopup}>Cerrar</button>
                </div>
            </div>
        </div>
    );
}
