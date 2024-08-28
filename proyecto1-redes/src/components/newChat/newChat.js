import React, { useState } from "react"; // Importa React y el hook useState
import "../addContact/addContact.css"; // Importa los estilos CSS para el componente
import { TextField } from "@mui/material"; // Importa el componente TextField de Material-UI

// Componente para iniciar un nuevo chat
export default function NewChat({ closePopup, startChat }) {
    const [user, setUser] = useState(""); // Estado local para almacenar el nombre del usuario
    const [error, setError] = useState(null); // Estado local para manejar mensajes de error

    // Función para manejar el inicio de un nuevo chat
    const handleStartChat = async () => {
        if (!user) { // Verifica si el campo de usuario está vacío
            setError("Ingrese un usuario"); // Muestra un mensaje de error si el campo está vacío
            return;
        }

        try {
            const contact = { name: user, jid: user, status: 'available' }; // Crear un contacto temporal con el nombre de usuario
            startChat(contact); // Llama a la función para iniciar el chat con el contacto creado
            closePopup();  // Cierra el popup después de iniciar el chat
        } catch (err) {
            console.error("Error iniciando un nuevo chat: ", err); // Muestra el error en la consola si falla el inicio del chat
            setError("Error iniciando nuevo chat"); // Establece un mensaje de error en el estado
        }
    };

    // Render del componente
    return (
        <div className="popupContainer"> {/* Contenedor principal del popup */}
            <div className="popupContent"> {/* Contenedor del contenido del popup */}
                <h2>Nuevo chat</h2> {/* Título del popup */}
               
                <TextField
                    id="JID"
                    label="User" 
                    variant="outlined"
                    sx={{ width: '100%' }} // Estilo para hacer el campo de texto 100% ancho
                    onChange={(e) => { // Maneja los cambios en el campo de texto del usuario
                        if (!e.target.value) {
                            setError("Ingrese un usuario"); // Muestra un error si el campo está vacío
                        } else {
                            setUser(e.target.value); // Actualiza el estado del usuario con el valor ingresado
                            setError(null); // Limpia el mensaje de error
                        }
                    }}
                />

                <div className="bttnContainer"> {/* Contenedor para los botones */}
                    <button className="addbttn" onClick={handleStartChat}>Nuevo chat</button> {/* Botón para iniciar un nuevo chat */}
                    <button className="closebttn" onClick={closePopup}>Cerrar</button> {/* Botón para cerrar el popup */}
                </div>
            </div>
        </div>
    );
}
