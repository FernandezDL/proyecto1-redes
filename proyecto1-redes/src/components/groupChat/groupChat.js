import React, { useState } from "react"; // Importa React y el hook useState
import "../addContact/addContact.css"; // Importa los estilos CSS para el componente

// Componente para unirse a un chat grupal
export default function GroupChat({ closePopup, joinGroupChat }) {
    const [groupJid, setGroupJid] = useState(''); // Estado local para almacenar el JID del grupo que se va a unir

    // Función para manejar la acción de unirse a un grupo
    const handleJoinGroup = () => {
        if (groupJid) { // Verifica si el JID del grupo no está vacío
            joinGroupChat(groupJid); // Llama a la función para unirse al grupo con el JID proporcionado
            closePopup(); // Cierra el popup después de unirse al grupo
        } else {
            alert("Por favor ingrese un JID válido"); // Muestra una alerta si el JID está vacío
        }
    };

    // Render del componente
    return (
        <div className="popupContainer"> {/* Contenedor principal del popup */}
            <div className="popupContent"> {/* Contenedor del contenido del popup */}
                <h2>Unirse a un chat grupal</h2> {/* Título del popup */}
                <input
                    type="text"
                    value={groupJid} // Valor del input, vinculado al estado groupJid
                    onChange={(e) => setGroupJid(e.target.value)} // Actualiza el estado groupJid cuando el valor del input cambia
                    placeholder="Ingrese el JID del grupo" // Placeholder del input
                />
                <button className="otrosbttn" onClick={handleJoinGroup}>
                    Unirse al grupo
                </button> {/* Botón para unirse al grupo */}
                <button className="closebttn" onClick={closePopup}>Cerrar</button> {/* Botón para cerrar el popup */}
            </div>
        </div>
    );
}
