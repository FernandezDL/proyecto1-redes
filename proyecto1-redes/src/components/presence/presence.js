import React, { useState } from "react"; // Importa React y el hook useState
import "../addContact/addContact.css"; // Importa los estilos CSS para el componente

// Componente para cambiar el estado de presencia del usuario
export default function PresencePopup({ closePopup, updatePresence }) {
    const [status, setStatus] = useState("available"); // Estado local para almacenar el estado de presencia seleccionado
    const [statusMessage, setStatusMessage] = useState(""); // Estado local para almacenar el mensaje de estado personalizado

    // Función para manejar el cambio de presencia
    const handlePresenceChange = () => {
        updatePresence(status, statusMessage); // Llama a la función para actualizar la presencia con el estado y mensaje seleccionados
        closePopup(); // Cierra el popup después de actualizar la presencia
    };

    // Render del componente
    return (
        <div className="popupContainer"> {/* Contenedor principal del popup */}
            <div className="popupContent"> {/* Contenedor del contenido del popup */}
                <h2>Cambiar Presencia</h2> {/* Título del popup */}

                {/* Dropdown para seleccionar el estado de presencia */}
                <select value={status} onChange={(e) => setStatus(e.target.value)}> 
                    <option value="available">Available</option> {/* Opción para estado disponible */}
                    <option value="away">Away</option> {/* Opción para estado ausente */}
                    <option value="xa">Not Available</option> {/* Opción para estado no disponible */}
                    <option value="dnd">Busy</option> {/* Opción para estado ocupado */}
                    <option value="offline">Offline</option> {/* Opción para estado desconectado */}
                </select>

                {/* Input para ingresar un mensaje de estado personalizado */}
                <input
                    type="text"
                    value={statusMessage} // Valor del input, vinculado al estado statusMessage
                    onChange={(e) => setStatusMessage(e.target.value)} // Actualiza el estado del mensaje de estado
                    placeholder="Mensaje de estado" // Placeholder para el input
                />

                <button className="otrosbttn" onClick={handlePresenceChange}>Actualizar</button> {/* Botón para actualizar la presencia */}
                <button className="closebttn" onClick={closePopup}>Cerrar</button> {/* Botón para cerrar el popup */}
            </div>
        </div>
    );
}
