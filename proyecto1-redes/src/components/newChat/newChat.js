import React, { useState } from "react";
import "../addContact/addContact.css";
import {TextField} from "@mui/material";
import XMPPService from "../../services/xmpp.js";

export default function NewChat({ closePopup, startChat }) {
    const [user, setUser] = useState("");
    const [error, setError] = useState(null);

    const handleStartChat = async () => {
        if (!user) {
            setError("Ingrese un usuario");
            return;
        }

        try {
            const contact = { name: user, jid: user, status: 'available' }; // Crear un contacto temporal
            startChat(contact); // Iniciar el chat
            closePopup();  // Cerrar el popup después de iniciar el chat
        } catch (err) {
            console.error("Error iniciando un nuevo chat: ", err);
            setError("Error iniciando nuevo chat");
        }
    };

    return (
        <div className="popupContainer">
            <div className="popupContent">
                <h2>Nuevo chat</h2>
               
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
                    <button className="addbttn" onClick={handleStartChat}>Nuevo chat</button>
                    <button className="closebttn" onClick={closePopup}>Cerrar</button>
                </div>
            </div>
        </div>
    );
}
