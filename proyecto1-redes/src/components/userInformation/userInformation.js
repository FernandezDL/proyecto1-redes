import React from "react"; // Importa React
import "../addContact/addContact.css"; // Importa los estilos CSS para el componente

// Componente para mostrar la información detallada de un contacto
export default function UserInformation({ contactDetail, closePopup }) {
    return (
        <div className="popupContainer"> {/* Contenedor principal del popup */}
            <div className="popupContent"> {/* Contenedor del contenido del popup */}
                <h2>Información del contacto</h2> {/* Título del popup */}

                <div className="userInfo"> {/* Contenedor para la información del contacto */}
                    <p><strong>JID:</strong> {contactDetail.jid}</p> {/* Muestra el JID del contacto */}
                    <p><strong>Nombre:</strong> {contactDetail.name}</p> {/* Muestra el nombre del contacto */}
                    <p><strong>Estado:</strong> {contactDetail.status}</p> {/* Muestra el estado de presencia del contacto */}
                    <p><strong>Mensaje de presencia:</strong> {contactDetail.presence}</p> {/* Muestra el mensaje de presencia del contacto */}
                    <p><strong>Suscripción:</strong> {contactDetail.subscription}</p> {/* Muestra el estado de suscripción del contacto */}
                </div>

                <div className="bttnContainer"> {/* Contenedor para el botón */}
                    <button className="closebttn" onClick={closePopup}>Cerrar</button> {/* Botón para cerrar el popup */}
                </div>
            </div>
        </div>
    );
}
