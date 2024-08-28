import "./login.css"; // Importa los estilos CSS para el componente
import { TextField } from "@mui/material"; // Importa el componente TextField de Material-UI
import React from "react"; // Importa React
import { useState } from "react"; // Importa el hook useState de React
import XMPPService from "../../services/xmpp.js"; // Importa el servicio XMPP para manejar la comunicación con el servidor
import { useNavigate } from "react-router-dom"; // Importa el hook useNavigate para la navegación en React Router

// Componente de inicio de sesión
export default function Login(){
    const [user, setUser] = useState(''); // Estado local para almacenar el nombre de usuario
    const [password, setPassword] = useState(''); // Estado local para almacenar la contraseña
    const [error, setError] = useState(null); // Estado local para manejar mensajes de error
    
    const navigate = useNavigate(); // Hook para navegar entre rutas

    // Función para manejar el inicio de sesión
    const handleLogin = async () => {
        try {
            await XMPPService.connect(user, password); // Intenta conectar con el servicio XMPP usando el usuario y la contraseña
            setError(""); // Limpia cualquier mensaje de error previo
            navigate('/chat', { state: { user } }); // Navega a la página de chat si la conexión es exitosa
        } catch (err) {
            console.error('Error en la conexión: ', err); // Muestra el error en la consola
            setError('Error en la conexión o autenticación fallida'); // Establece un mensaje de error en el estado
        }
    };

    // Función para manejar el registro de un nuevo usuario
    const handleRegister = async (event) => {
        event.preventDefault(); // Previene la recarga de la página
        setError(''); // Limpia cualquier mensaje de error previo
    
        try {
            const response = await XMPPService.register(user, password); // Intenta registrar un nuevo usuario en el servicio XMPP
            if (response.status) {
                console.log("Registro exitoso. Conectando...");
                await XMPPService.connect(user, password); // Conecta automáticamente después del registro exitoso
                navigate('/chat', { state: { user: user } }); // Navega a la página de chat
            }
        } catch (err) {
            setError(err.message); // Establece un mensaje de error en el estado si falla el registro
        }
    };
    
    // Render del componente
    return(
        <div>
            <div className="mainContenedor"> {/* Contenedor principal */}
                <h2>Diana's Chat</h2> {/* Título del formulario de inicio de sesión */}

                <TextField 
                    id="user" 
                    label="User" 
                    variant="outlined" 
                    sx={{ width: '90%' }} // Estilo para hacer el campo de texto 90% ancho
                    onChange={(e) => { // Maneja los cambios en el campo de texto del usuario
                        if (!e.target.value) {
                            setError("Todos los campos deben completarse"); // Establece un mensaje de error si el campo está vacío
                        } else {
                            setUser(e.target.value); // Actualiza el estado del usuario con el valor ingresado
                            setError(null); // Limpia el mensaje de error
                        }
                    }}
                />

                <TextField 
                    id="password" 
                    label="Password" 
                    variant="outlined" 
                    sx={{ width: '90%' }} // Estilo para hacer el campo de texto 90% ancho
                    onChange={(e) => { // Maneja los cambios en el campo de texto de la contraseña
                        if (!e.target.value) {
                            setError("Todos los campos deben completarse"); // Establece un mensaje de error si el campo está vacío
                        } else {
                            setPassword(e.target.value); // Actualiza el estado de la contraseña con el valor ingresado
                            setError(null); // Limpia el mensaje de error
                        }
                    }}
                />

                {error && <p style={{ color: 'red' }}>{error}</p>} {/* Muestra un mensaje de error en rojo si existe */}

                <div className="bttnContainer"> {/* Contenedor para los botones */}
                    <button className="logInBttn" onClick={handleLogin}>Log In</button> {/* Botón para iniciar sesión */}
                    <button className="signUpBttn" onClick={handleRegister}>Sign up</button> {/* Botón para registrarse */}
                </div>
            </div>
        </div>
    )
}
