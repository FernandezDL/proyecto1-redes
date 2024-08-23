import React from "react";
import "../addContact/addContact.css";

export default function UserInformation({ contactDetail, closePopup }) {
    return (
        <div className="popupContainer">
            <div className="popupContent">
                <h2>Información del contacto</h2>

                <div className="userInfo">
                    <p><strong>JID:</strong> {contactDetail.jid}</p>
                    <p><strong>Nombre:</strong> {contactDetail.name}</p>
                    <p><strong>Estado:</strong> {contactDetail.status}</p>
                    <p><strong>Mensaje de presencia:</strong> {contactDetail.presence}</p>
                    <p><strong>Suscripción:</strong> {contactDetail.subscription}</p>
                </div>

                <div className="bttnContainer">
                    <button className="closebttn" onClick={closePopup}>Cerrar</button>
                </div>
            </div>
        </div>
    );
}
