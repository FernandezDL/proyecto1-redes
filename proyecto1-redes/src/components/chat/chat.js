import "./chat.css";
import XMPPService from "../../services/xmpp.js";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import AddContact from "../addContact/addContact.js";
import MoreOptions from "../moreOptions/moreOptions.js";
import NewChat from "../newChat/newChat.js";
import UserInformation from "../userInformation/userInformation.js";
import GroupChat from "../groupChat/groupChat.js";
import PresencePopup from "../presence/presence.js";
import EliminarCuenta from "../eliminarCuenta/eliminarCuenta.js";
import CreateGroupChatRoom from "../createGroupChatRoom/createGroupChatRoom.js";

export default function Chat() {
    const navigate = useNavigate(); 
    const location = useLocation(); 

    const { user } = location.state || {}; 

    const [contacts, setContacts] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [message, setMessage] = useState("");
    const [conversations, setConversations] = useState({});
    const [contactDetail, setContactDetail] = useState(null);
    
    const [addContactWindow, setAddContactWindow] = useState(false);
    const [moreOptionsWindow, setMoreOptionsWindow] = useState(false);
    const [newChatWindow, setNewChatWindow] = useState(false);
    const [showContactDetailWindow, setShowContactDetailWindow] = useState(false);
    const [groupChatWindow, setGroupChatWindow] = useState(false);
    const [presenceWindow, setPresenceWindow] = useState(false);
    const [eliminarCuentaWindow, setEliminarCuentaWindow] = useState(false);
    const [createGroupChatWindow, setCreateGroupChatWindow] = useState(false);


    const openAddContactPopup = () => {
        setMoreOptionsWindow(false); 
        setAddContactWindow(true); 
    };

    const openEliminarCuenta = () => {
        setMoreOptionsWindow(false); 
        setEliminarCuentaWindow(true); 
    };

    const openNewChatPopup = () => {
        setMoreOptionsWindow(false); 
        setNewChatWindow(true); 
    };

    const openGroupChatPopup = () => {
        setMoreOptionsWindow(false);
        setGroupChatWindow(true); // Abre el pop-up de unión a chat grupal
    };

    const closeGroupChatPopup = () => {
        setGroupChatWindow(false);
    };

    const openCreateGroupChatPopup = () => {
        setMoreOptionsWindow(false);
        setCreateGroupChatWindow(true);
    };

    // Función para crear la sala grupal
    const createGroupChatRoom = async (roomName) => {
        try {
            const roomJid = `${roomName.replaceAll(' ', '_')}@conference.alumchat.lol`;
            await XMPPService.createGroupChatRoom(roomName, user);

            // Agregar la nueva sala grupal al estado 'groups'
            setGroups(prevGroups => [
                ...prevGroups,
                { jid: roomJid, name: roomName }
            ]);

            // await refreshContacts();
            setCreateGroupChatWindow(false);
        } catch (error) {
            console.error("Error al crear la sala grupal: ", error);
        }
    };

    const joinGroupChat = async (groupJid) => {
        try {
            XMPPService.joinGroupChat(groupJid, user);
            setSelectedContact({ name: groupJid, jid: groupJid, status: 'available' });
            setGroupChatWindow(false);
        } catch (error) {
            console.error("Error al unirse al grupo: ", error);
        }
    };

    const openContactDetailPopup = async () => {
        if (selectedContact) {
            const details = await XMPPService.getContactDetails(selectedContact.name);
            setContactDetail(details);
            setShowContactDetailWindow(true);
        }

        console.log(contactDetail);
    };

    const handleLogOut = async () => {
        try {
            XMPPService.disconnect();
            navigate('/');
        } catch (err) {
            console.error('Error en la desconexión: ', err);
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
        
            setConversations(prevConversations => ({
                ...prevConversations,
                [selectedContact.name]: [
                    ...(prevConversations[selectedContact.name] || []),
                    { text: message, timestamp: new Date(), sender: 'Tú' }
                ]
            }));
        
            setMessage("");
        } else {
            console.error("No se puede enviar un mensaje vacío o sin un contacto seleccionado.");
        }
    };

    const startChat = (contact) => {
        setSelectedContact(contact); 
        setNewChatWindow(false); 
    };

    const openPresencePopup = () => {
        setMoreOptionsWindow(false);
        setPresenceWindow(true);
    };

    const updatePresence = (status, message) => {
        XMPPService.updatePresence(status, message);
        setPresenceWindow(false); // Cerrar la ventana después de actualizar la presencia
    };

    const eliminarCuenta = async () => {
        try {
            await XMPPService.deleteAccount();
            navigate('/');  // Redirigir al usuario a la página de inicio después de eliminar la cuenta
        } catch (err) {
            console.error('Error eliminando la cuenta:', err);
        }
    };

    // Función para recibir y manejar mensajes
    useEffect(() => {
        refreshContacts();
    
        XMPPService.setOnContactPresenceUpdateCallback((updatedContacts) => {
            setContacts(Object.values(updatedContacts));
        });
    
        XMPPService.setOnMessageReceivedCallback((message) => {
            const jid = message.room || message.from; // Usamos el JID de la sala si es un chat grupal

            setConversations(prevConversations => ({
                ...prevConversations,
                [jid]: [
                    ...(prevConversations[jid] || []),
                    { text: message.text, timestamp: message.timestamp, sender: message.from }
                ]
            }));
    
            // Actualizar el contacto con un mensaje no leído
            setContacts(prevContacts => 
                prevContacts.map(contact => 
                    contact.name === jid ? { ...contact, hasUnreadMessages: true } : contact
                )
            );
        });
    
        const loadContactsAndGroups = async () => {
            try {
                const [contactList, groupList] = await Promise.all([
                    XMPPService.getContacts(),
                    XMPPService.getUserGroups()
                ]);
    
                setContacts(contactList);
                setGroups(groupList);
            } catch (error) {
                console.error("Error obteniendo contactos o grupos: ", error);
                navigate('/');
            }
        };
    
        loadContactsAndGroups();
    
        return () => {
            XMPPService.setOnContactPresenceUpdateCallback(null);
            XMPPService.setOnMessageReceivedCallback(null);
        };
    }, []);

    return (
        <>
            <div className="chatContainer">
                <div className="menuContainer">
                    <div></div>
                    <h3>{user}</h3>

                    <div className="contactos">
                        {/* contactos */}
                        <div className="bottomBorder">
                            <div className="divCentrado">
                                <h3>Contactos</h3>

                                <button className="bttnAddContact" onClick={() => setMoreOptionsWindow(true)}>+</button>
                            </div>

                            <ul>
                                {contacts
                                    .filter(contact => contact.name && contact.name.trim() !== '' && contact.name && contact.name.trim() !== '')
                                    .map((contact, index) => (
                                        <li
                                            key={`${contact.name}-${index}`}
                                            style={{
                                                fontWeight: contact.hasUnreadMessages ? 'bold' : 'normal',
                                                color: contact.status === 'available'
                                                    ? '#1d6317'  // Verde para available
                                                    : contact.status === 'offline'
                                                        ? '#4c4a4a'  // Gris para offline
                                                        : contact.status === 'away'
                                                            ? '#815005'  // Anaranjado para away
                                                            : contact.status === 'xa' || contact.status === 'dnd'
                                                                ? '#a30808'  // Rojo para xa o dnd
                                                                : '#000000'  // Color por defecto (negro) si el estado no coincide con ninguno de los anteriores
                                            }}                                        
                                            onClick={() => setSelectedContact(contact)}
                                        >
                                            {contact.name}
                                        </li>
                                    ))}
                            </ul>
                        </div>

                        {/* Chats activos */}
                        <div className="bottomBorder">
                            <div className="divCentrado">
                                <h3>Chats activos</h3>
                            </div>

                            <ul>
                                {Object.keys(conversations).map((jid, index) => (
                                    <li
                                        key={index}
                                        onClick={() => {
                                            const contact = contacts.find(contact => contact.name === jid);
                                            if (contact) {
                                                setSelectedContact(contact);
                                            } else {
                                                setSelectedContact({ name: jid, jid, status: 'available' });
                                            }
                                        }}
                                    >
                                        {contacts.find(contact => contact.name === jid)?.name || jid}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Grupos */}
                        <div className="divCentrado">
                            <h3>Chats grupales</h3>
                        </div>

                        <ul>
                            {groups
                                .filter(group => group.jid && group.jid.trim() !== '' && group.name && group.name.trim() !== '')
                                .map((group, index) => (
                                    <li
                                        key={`${group.name}-${index}`}
                                        style={{ color: '#1d6317' }} // Color diferente para los grupos
                                        onClick={() => setSelectedContact({ name: group.name, jid: group.jid })}
                                    >
                                        {group.name}
                                    </li>
                                ))
                            }
                        </ul>
                    </div>

                    <button className="bttnLogOut" onClick={handleLogOut}>Log Out</button>
                </div>

                {selectedContact && (
                    <div>
                        <div className="messageContainer">
                            <div className="contacNameContainer" onClick={openContactDetailPopup}>
                                <div className="contactImage">
                                    <img
                                        src={"./images/usuario.png"}
                                        alt="User"
                                        style={{ width: '100%', height: 'auto' }}
                                    />
                                </div>
                                
                                <div className="contactUserContainer">
                                    {selectedContact.name}
                                </div>
                            </div>

                            <div className="showMessagesContainer">
                                {conversations[selectedContact.name]?.map((msg, index) => (
                                    <div key={index}>
                                        <div style={{
                                            color: msg.sender === 'Tú'
                                                ? '#873091'
                                                : '#3792a4',
                                            fontWeight: 'bold'
                                        }}>{msg.sender}:</div>

                                        <div className="message">
                                            <div className="messageText">{msg.text}</div>
                                            <div className="messageTimestamp">{msg.timestamp.toLocaleTimeString()}</div>
                                        </div>
                                    </div>
                                ))}
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

            {groupChatWindow && (
                <GroupChat
                    closePopup={closeGroupChatPopup}
                    joinGroupChat={joinGroupChat}
                />
            )}
            
            {/* Mostrar el pop-up cuando se haga clic en el nombre del contacto */}
            {showContactDetailWindow && (
                <UserInformation
                    closePopup={() => setShowContactDetailWindow(false)}
                    contactDetail={contactDetail}
                />
            )}

            {moreOptionsWindow && (
                <MoreOptions
                    closePopup={() => setMoreOptionsWindow(false)}
                    openAddContactPopup={openAddContactPopup}
                    openNewChatPopup={openNewChatPopup}
                    openGroupChatPopup={openGroupChatPopup} // Asegúrate de pasar esta función
                    openPresencePopup={openPresencePopup} // Pasar la función para abrir el popup de presencia
                    openEliminarCuenta = {openEliminarCuenta}
                    openCreateGroupChatPopup={openCreateGroupChatPopup}
                />
            )}

            {newChatWindow && (
                <NewChat
                    closePopup={() => setNewChatWindow(false)}
                    startChat={startChat}
                />
            )}

            {addContactWindow && (
                <AddContact closePopup={() => setAddContactWindow(false)} refreshContacts={refreshContacts}/>
            )}

            {presenceWindow && (
                <PresencePopup 
                    closePopup={() => setPresenceWindow(false)}
                    updatePresence={updatePresence}
                />
            )}

            {eliminarCuentaWindow && (
                <EliminarCuenta 
                    closePopup={() => setEliminarCuentaWindow(false)}
                    eliminarCuenta={eliminarCuenta}
                />
            )}

            {/* Mostrar el pop-up de creación de sala grupal */}
            {createGroupChatWindow && (
                <CreateGroupChatRoom
                    closePopup={() => setCreateGroupChatWindow(false)}
                    createGroupChatRoom={createGroupChatRoom}
                />
            )}
        </>
    );
}
