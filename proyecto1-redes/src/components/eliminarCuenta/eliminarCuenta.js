import React from "react";
import "../addContact/addContact.css";

export default function EliminarCuenta({ closePopup, eliminarCuenta }) {
    
    return(
        <div className="popupContainer">
            <div className="popupContent">
                <h2>¡Cuidado!</h2>
               
                <h3>Vas a eliminar tu cuenta</h3>
                <h3>¿Seguro que quieres seguir?</h3>

                <div className="horizontalContainer">
                    <button className="addbttn" onClick={closePopup}>Regresar</button>
                    <button className="closebttn" onClick={eliminarCuenta}>Eliminar cuenta</button>
                </div>
            </div>
        </div>
    );
}
