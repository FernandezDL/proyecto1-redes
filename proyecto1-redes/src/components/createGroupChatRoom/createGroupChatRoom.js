import React, { useState } from "react"; // Importa React y el hook useState
import "../addContact/addContact.css"; // Importa los estilos CSS para el componente

export default function CreateGroupChatRoom({ closePopup, createGroupChatRoom }) {
    const [roomName, setRoomName] = useState(""); // Estado local para almacenar el nombre de la sala grupal

    // Función para manejar la creación de la sala grupal
    const handleCreate = () => {
        if (roomName.trim() !== "") { // Verifica que el nombre de la sala no esté vacío
            createGroupChatRoom(roomName); // Llama a la función para crear la sala grupal con el nombre proporcionado
        }
    };

    // Render del componente
    return (
        <div className="popupContainer"> {/* Contenedor principal del popup */}
            <div className="popupContent"> {/* Contenedor del contenido del popup */}
                <h2>Crear nueva sala grupal</h2>
                <input
                    type="text"
                    placeholder="Nombre de la sala grupal" // Texto de placeholder para el input
                    value={roomName} // Valor del input, vinculado al estado roomName
                    onChange={(e) => setRoomName(e.target.value)} // Actualiza el estado roomName cuando el valor del input cambia
                />
                <div className="horizontalContainer"> {/* Contenedor para los botones */}
                    <button className="addbttn" onClick={handleCreate}>Crear</button> {/* Botón para crear la sala grupal */}
                    <button className="closebttn" onClick={closePopup}>Cancelar</button> {/* Botón para cerrar el popup */}
                </div>
            </div>
        </div>
    );
}
