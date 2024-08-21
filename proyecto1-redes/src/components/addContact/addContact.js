import React, { useState } from "react";
import "./addContact.css";  // Asegúrate de que los estilos CSS estén en este archivo
import {TextField} from "@mui/material";
import XMPPService from "../../services/xmpp.js";

export default function AddContact({ closePopup, refreshContacts }) {
    const [user, setUser] = useState("");
    const [error, setError] = useState(null);

    const handleAddContact = async () => {
        if (!user) {
            setError("Ingrese un usuario");
            return;
        }

        try {
            await XMPPService.addContact(user);
            alert(`Contacto ${user} añadido correctamente.`);
            closePopup();  // Cerrar el popup después de añadir el contacto
            refreshContacts();  // Actualizar la lista de contactos
        } catch (err) {
            console.error("Error añadiendo contacto: ", err);
            setError("Error añadiendo el contacto.");
        }
    };

    return (
        <div className="popupContainer">
            <div className="popupContent">
                <h2>Agregar Contacto</h2>
               
                <TextField
                    id="JID"
                    label = "User"
                    variant="outlined"
                    sx={{ width: '100%'}}
                    onChange={(e) => 
                        {if(!e.target.value){
                            setError("Ingrese un usuario")
                        } else {
                            setUser(e.target.value)
                        }
                    }}
                />

                <div className="bttnContainer">
                    <button className="addbttn" onClick={handleAddContact}>Agregar</button>
                    <button className="closebttn" onClick={closePopup}>Cerrar</button>
                </div>
            </div>
        </div>
    );
}
