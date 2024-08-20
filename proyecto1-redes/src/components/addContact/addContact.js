import React, { useState } from "react";
import "./addContact.css";  // Asegúrate de que los estilos CSS estén en este archivo
import {TextField} from "@mui/material";

export default function AddContact({ closePopup }) {
    const [user, setUser] = useState("");
    const [error, setError] = useState(null);

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
                    <button className="addbttn">Agregar</button>
                    <button className="closebttn" onClick={closePopup}>Cerrar</button>
                </div>
            </div>
        </div>
    );
}
