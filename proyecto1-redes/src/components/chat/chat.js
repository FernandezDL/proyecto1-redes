import "./chat.css";
import XMPPService from "../../services/xmpp.js";
import { useNavigate, useLocation  } from "react-router-dom";
import React, { useEffect, useState } from "react";
import AddContact from "../addContact/addContact.js";
import MoreOptions from "../moreOptions/moreOptions.js";
import NewChat from "../newChat/newChat.js";

export default function Chat(){
    const navigate = useNavigate(); // Hook para navegar
    const location = useLocation(); // Hook para acceder al estado pasado con navigate

    const { user } = location.state || {}; // Obtener el user del estado pasado

    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [message, setMessage] = useState("");
    const [activeConversations, setActiveConversations] = useState([]);
    const [sentMessages, setSentMessages] = useState({});

    const [addContactWindow, setAddContactWindow] = useState(false);
    const [moreOptionsWindow, setMoreOptionsWindow] = useState(false);
    const [newChatWindow, setNewChatWindow] = useState(false);

    const openAddContactPopup = () => {
        setMoreOptionsWindow(false); // Cerrar el pop-up de más opciones
        setAddContactWindow(true); // Abrir el pop-up de añadir contacto
    };

    const openNewChatPopup = () => {
        setMoreOptionsWindow(false); // Cerrar el pop-up de más opciones
        setNewChatWindow(true); // Abrir el pop-up de nuevo chat
    };

    const handleLogOut = async () =>{
        try {
                XMPPService.disconnect();
            navigate('/');

        } catch (err) {
            console.error('Error en la desconexión: ', err);
            console.log('Error en la desconexión');
        }
    };

    const refreshContacts = async () => {
        try {
            const contactList = await XMPPService.getContacts();
            setContacts(contactList);
        } catch (error) {
            console.error("Error obteniendo los contactos: ", error);
            navigate('/');
        }
    };

    const handleSendMessage = () => {
        if (selectedContact && message) {
            XMPPService.sendMessage(selectedContact.name, message);
    
            // Guardar solo el nombre del destinatario en la lista
            setActiveConversations(prevMessages => [
                ...prevMessages,
                selectedContact.name
            ]);
    
            setMessage(""); // Limpiar el campo del mensaje después de enviarlo
        } else {
            console.error("No se puede enviar un mensaje vacío o sin un contacto seleccionado.");
        }
    };  
    
    const startChat = (contact) => {
        setSelectedContact(contact); // Selecciona el contacto para comenzar el chat
        setNewChatWindow(false); // Cierra la ventana de nuevo chat
    };

    useEffect(() => {
        refreshContacts();

        // Configurar el callback para actualizar el estado cuando la presencia cambie
        XMPPService.setOnContactPresenceUpdateCallback((updatedContacts) => {
            setContacts(Object.values(updatedContacts));
        });

        // Limpiar el callback cuando el componente se desmonte
        return () => {
            XMPPService.setOnContactPresenceUpdateCallback(null);
        };
    }, []);

    return(
        <>
            <div className="chatContainer">
                <div className="menuContainer">
                    <h3>{user}</h3>

                    <div className="contactos">
                        <div className="bottomBorder">
                            <div className="divCentrado">
                                <h3>Contactos</h3>

                                <button className="bttnAddContact" onClick={() => setMoreOptionsWindow(true)}>+</button>
                            </div>

                            <ul>
                                {contacts.map((contact, index) => (
                                    <li
                                        key={`${contact.jid}-${index}`}  // Combinando jid con el índice para garantizar unicidad
                                        style={{
                                            color: contact.status === 'offline'
                                                ? '#a30808'  // Rojo para offline
                                                : contact.status === 'away'
                                                    ? '#8d5f17'  // Marrón para away
                                                    : '#1d6317'  // Verde para online o cualquier otro estado
                                        }}
                                        onClick={() => setSelectedContact(contact)}
                                    >
                                        {contact.name}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="divCentrado">
                            <h3>Chats activos</h3>
                        </div>

                        <ul>
                            {activeConversations.map((name, index) => (
                                <li key={index}>
                                    {name}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button className="bttnLogOut" onClick={handleLogOut}>Log Out</button>
                </div>

                {/* Mostrar messageContainer solo si hay un contacto seleccionado */}
                {selectedContact && (
                    <div>
                        <div className="messageContainer">
                            <div className="contacNameContainer">
                                <div className="contactImage">
                                    <img
                                        src={"./images/usuario.png"}
                                        alt="User"
                                        style={{ width: '100%', height: 'auto' }}
                                    />
                                </div>
                                
                                <div className="contactUserContainer">
                                    {selectedContact.name}  {/* Mostrar el nombre del contacto seleccionado */}
                                </div>
                            </div>

                            <div className="showMessagesContainer">
                                probando
                            </div>

                            <div className="messageSpace">
                                <textarea
                                    className="messageInput"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Escribe un mensaje..."
                                />

                                <div className="messageSpaceBttn">
                                    <button className="sendBttn" onClick={handleSendMessage}>Enviar</button>
                                    <button className="archivosBttn">Adjuntar archivos</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Pop Up mas opciones */}
            {moreOptionsWindow && (
                <MoreOptions
                    closePopup={() => setMoreOptionsWindow(false)}
                    openAddContactPopup={openAddContactPopup}
                    openNewChatPopup = {openNewChatPopup}
                />
            )}

            {/* Pop Up nuevo chat */}
            {newChatWindow && (
                <NewChat
                    closePopup={() => setNewChatWindow(false)}
                    startChat={startChat}
                />
            )}

            {/* Pop Up añadir contacto */}
            {addContactWindow && (
                <AddContact closePopup={() => setAddContactWindow(false)} refreshContacts={refreshContacts}/>
            )}
        </>
    )
}