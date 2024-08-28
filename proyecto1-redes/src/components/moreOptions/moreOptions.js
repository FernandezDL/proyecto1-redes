import React from "react"; // Importa React
import "./moreOptions.css"; // Importa los estilos CSS para el componente

// Componente para mostrar más opciones en un popup
export default function MoreOptions({ 
    closePopup, 
    openAddContactPopup, 
    openNewChatPopup, 
    openGroupChatPopup, 
    openPresencePopup, 
    openEliminarCuenta, 
    openCreateGroupChatPopup 
}) {

    // Función para manejar la apertura del popup para añadir un contacto
    const handleAddContact = () => {
        closePopup(); // Cierra el popup actual
        openAddContactPopup(); // Abre el popup para añadir un contacto
    };

    // Función para manejar la apertura del popup para unirse a un chat grupal
    const handleGroupChat = () => {
        closePopup(); // Cierra el popup actual
        openGroupChatPopup(); // Abre el popup para unirse a un chat grupal
    };

    // Función para manejar la apertura del popup para cambiar el mensaje de presencia
    const handlePresencePopup = () => {
        closePopup(); // Cierra el popup actual
        openPresencePopup(); // Abre el popup de cambiar presencia
    };

    // Función para manejar la apertura del popup para eliminar la cuenta
    const handleEliminarCuenta = () => {
        closePopup(); // Cierra el popup actual
        openEliminarCuenta(); // Abre el popup para eliminar la cuenta
    };

    // Función para manejar la apertura del popup para crear una nueva sala grupal
    const handleCreateGroupChat = () => {
        closePopup(); // Cierra el popup actual
        openCreateGroupChatPopup(); // Abre el popup para crear una nueva sala grupal
    };

    // Render del componente
    return (
        <div className="popupContainer"> {/* Contenedor principal del popup */}
            <div className="popupContent"> {/* Contenedor del contenido del popup */}
                <h2>Más opciones :D</h2> {/* Título del popup */}
               
                <div className="horizontalContainer"> {/* Contenedor para los botones en horizontal */}
                    <button className="otrosbttn" onClick={openNewChatPopup}>Nuevo chat</button> {/* Botón para iniciar un nuevo chat */}
                    <button className="otrosbttn" onClick={handleGroupChat}>Unirse a chat grupal</button> {/* Botón para unirse a un chat grupal */}
                </div>
                
                <div className="horizontalContainer"> {/* Contenedor para los botones en horizontal */}
                    <button className="addbttn" onClick={handleCreateGroupChat}>Nueva sala grupal</button> {/* Botón para crear una nueva sala grupal */}
                    <button className="addbttn" onClick={handleAddContact}>Añadir contacto</button> {/* Botón para añadir un nuevo contacto */}
                </div>
                
                <div className="horizontalContainer"> {/* Contenedor para los botones en horizontal */}
                    <button className="addbttn" onClick={handlePresencePopup}>Cambiar mensaje de presencia</button> {/* Botón para cambiar el mensaje de presencia */}
                    <button className="closebttn" onClick={handleEliminarCuenta}>Eliminar sesión</button> {/* Botón para eliminar la cuenta */}
                </div>

                <button className="closebttn" onClick={closePopup}>Cerrar</button> {/* Botón para cerrar el popup */}
            </div>
        </div>
    );
}
