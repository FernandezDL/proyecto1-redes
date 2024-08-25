import "./login.css";
import {TextField} from "@mui/material";
import React from "react";
import { useState } from "react";
import XMPPService from "../../services/xmpp.js";
import { useNavigate } from "react-router-dom";

export default function Login(){
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState('');
    
    const navigate = useNavigate(); // Hook para navegar

    const handleLogin = async () => {
        try {
            await XMPPService.connect(user, password);
            
            setError("");
            navigate('/chat', { state: { user } });

        } catch (err) {
            console.error('Error en la conexión: ', err);
            setError('Error en la conexión o autenticación fallida');
        }
    };

    const handleRegister = async (event) => {
        event.preventDefault();
        setError('');
    
        try {
            // Registrar al usuario
            const response = await XMPPService.register(user, password);
            if (response.status) {
                setSuccess(response.message);
                console.log("Registro exitoso. Conectando...");
    
                // Conectar automáticamente después del registro exitoso
                await XMPPService.connect(user, password);
    
                // Redirigir al usuario a la página de chat
                navigate('/chat', { state: { user: user } });
            }
        } catch (err) {
            setError(err.message);
        }
    };
    
    return(
        <div>
            <div className="mainContenedor">
                <h2>Diana's Chat</h2>

                <TextField 
                    id="user" 
                    label="User" 
                    variant="outlined" 
                    sx={{ width: '90%' }}
                    onChange={(e) => 
                        {if(!e.target.value){
                            setError("Todos los campos deben completarse")
                        } else {
                            setUser(e.target.value)
                        }
                    }}
                />

                <TextField 
                    id="password" 
                    label="Password" 
                    variant="outlined" 
                    sx={{ width: '90%' }}
                    onChange={(e) => 
                        {if(!e.target.value){
                            setError("Todos los campos deben completarse")
                        } else {
                            setPassword(e.target.value)
                        }
                    }}
                />

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <div className="bttnContainer">
                    <button className="logInBttn" onClick={handleLogin}>Log In</button>
                    <button className="signUpBttn" onClick={handleRegister}>Sing up</button>
                </div>
            </div>
        </div>
    )
}