import React, { useState } from "react"; // Importa React y el hook useState
import "./addContact.css"; // Importa los estilos CSS para el componente
import { TextField } from "@mui/material"; // Importa el componente TextField de Material-UI
import XMPPService from "../../services/xmpp.js"; // Importa el servicio XMPP para manejar la comunicación con el servidor

// Componente para agregar un nuevo contacto
export default function AddContact({ closePopup, refreshContacts }) {
    const [user, setUser] = useState(""); // Estado local para almacenar el nombre del usuario que se va a agregar
    const [error, setError] = useState(null); // Estado local para manejar los mensajes de error

    // Función para manejar la adición de un contacto
    const handleAddContact = async () => {
        if (!user) { // Verifica si el campo de usuario está vacío
            setError("Ingrese un usuario"); // Muestra un mensaje de error si el campo está vacío
            return;
        }

        try {
            await XMPPService.addContact(user); // Llama al servicio XMPP para agregar el contacto
            alert(`Contacto ${user} añadido correctamente.`); // Muestra una alerta de éxito
            closePopup();  // Cierra el popup después de añadir el contacto
            refreshContacts();  // Actualiza la lista de contactos
        } catch (err) {
            console.error("Error añadiendo contacto: ", err); // Muestra un error en la consola si falla la adición
            setError("Error añadiendo el contacto."); // Establece un mensaje de error en el estado
        }
    };

    // Render del componente
    return (
        <div className="popupContainer"> {/* Contenedor principal del popup */}
            <div className="popupContent"> {/* Contenedor del contenido del popup */}
                <h2>Agregar Contacto</h2> {/* Título del popup */}
               
                <TextField
                    id="JID"
                    label="User"
                    variant="outlined"
                    sx={{ width: '100%' }} // Estilo para hacer el campo de texto 100% ancho
                    onChange={(e) => { // Maneja los cambios en el campo de texto
                        if (!e.target.value) {
                            setError("Ingrese un usuario"); // Muestra un error si el campo está vacío
                        } else {
                            setUser(e.target.value); // Actualiza el estado con el valor ingresado
                            setError(null); // Limpia cualquier error previo si se ingresa un valor
                        }
                    }}
                />

                <div className="bttnContainer"> {/* Contenedor para los botones */}
                    <button className="addbttn" onClick={handleAddContact}>Agregar</button> {/* Botón para agregar el contacto */}
                    <button className="closebttn" onClick={closePopup}>Cerrar</button> {/* Botón para cerrar el popup */}
                </div>
            </div>
        </div>
    );
}
