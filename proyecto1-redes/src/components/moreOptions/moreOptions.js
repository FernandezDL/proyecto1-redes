import React from "react";
import "./moreOptions.css";

export default function MoreOptions({closePopup, openAddContactPopup, openNewChatPopup}){
    const handleAddContact = () => {
        closePopup(); // Cerrar el pop-up de más opciones
        openAddContactPopup(); // Abrir el pop-up de añadir contacto
    };

    return(
        <div className="popupContainer">
            <div className="popupContent">
                <h2>Más opciones :D</h2>
               
                <button className="otrosbttn" onClick={openNewChatPopup}>Nuevo chat</button>
                <button className="otrosbttn" >Nuevo chat grupal</button>
                <button className="addbttn" onClick={handleAddContact}>Añadir contacto</button>
                <button className="closebttn" onClick={closePopup}>Cerrar</button>
            </div>
        </div>
    );
}