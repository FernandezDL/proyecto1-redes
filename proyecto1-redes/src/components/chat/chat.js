import "./chat.css"; // Importa los estilos CSS para el componente
import XMPPService from "../../services/xmpp.js"; // Importa el servicio XMPP para manejar la comunicación con el servidor
import { useNavigate, useLocation } from "react-router-dom"; // Importa hooks para la navegación y para obtener la ubicación actual en React Router
import React, { useEffect, useState } from "react"; // Importa React y los hooks useEffect y useState
import AddContact from "../addContact/addContact.js"; // Importa el componente para agregar contactos
import MoreOptions from "../moreOptions/moreOptions.js"; // Importa el componente para mostrar más opciones
import NewChat from "../newChat/newChat.js"; // Importa el componente para iniciar un nuevo chat
import UserInformation from "../userInformation/userInformation.js"; // Importa el componente para mostrar la información de un usuario
import GroupChat from "../groupChat/groupChat.js"; // Importa el componente para unirse a un chat grupal
import PresencePopup from "../presence/presence.js"; // Importa el componente para mostrar el popup de presencia
import EliminarCuenta from "../eliminarCuenta/eliminarCuenta.js"; // Importa el componente para eliminar una cuenta
import CreateGroupChatRoom from "../createGroupChatRoom/createGroupChatRoom.js"; // Importa el componente para crear una sala de chat grupal

export default function Chat() {
    const navigate = useNavigate(); // Hook para navegar entre páginas
    const location = useLocation(); // Hook para obtener la ubicación actual

    const { user } = location.state || {}; // Obtiene el usuario del estado de la ubicación o establece un objeto vacío si no existe

    // Estados locales para manejar los contactos, grupos, mensajes, y ventanas de diálogo
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

    // Función para abrir el popup de agregar contactos
    const openAddContactPopup = () => {
        setMoreOptionsWindow(false); // Cierra la ventana de más opciones
        setAddContactWindow(true); // Abre la ventana de agregar contactos
    };

    // Función para abrir el popup de eliminar cuenta
    const openEliminarCuenta = () => {
        setMoreOptionsWindow(false); // Cierra la ventana de más opciones
        setEliminarCuentaWindow(true); // Abre la ventana de eliminar cuenta
    };

    // Función para abrir el popup de nuevo chat
    const openNewChatPopup = () => {
        setMoreOptionsWindow(false); // Cierra la ventana de más opciones
        setNewChatWindow(true); // Abre la ventana de nuevo chat
    };

    // Función para abrir el popup de unión a chat grupal
    const openGroupChatPopup = () => {
        setMoreOptionsWindow(false); // Cierra la ventana de más opciones
        setGroupChatWindow(true); // Abre la ventana de unión a chat grupal
    };

    // Función para cerrar el popup de unión a chat grupal
    const closeGroupChatPopup = () => {
        setGroupChatWindow(false); // Cierra la ventana de unión a chat grupal
    };

    // Función para abrir el popup de creación de sala grupal
    const openCreateGroupChatPopup = () => {
        setMoreOptionsWindow(false); // Cierra la ventana de más opciones
        setCreateGroupChatWindow(true); // Abre la ventana de creación de sala grupal
    };

    // Función para crear la sala grupal
    const createGroupChatRoom = async (roomName) => {
        try {
            const roomJid = `${roomName.replaceAll(' ', '_')}@conference.alumchat.lol`; // Crea el JID de la sala grupal
            await XMPPService.createGroupChatRoom(roomName, user); // Llama al servicio XMPP para crear la sala

            // Agregar la nueva sala grupal al estado 'groups'
            setGroups(prevGroups => [
                ...prevGroups,
                { jid: roomJid, name: roomName }
            ]);

            setCreateGroupChatWindow(false); // Cierra la ventana de creación de sala grupal
        } catch (error) {
            console.error("Error al crear la sala grupal: ", error); // Muestra un error si falla la creación
        }
    };

    // Función para unirse a un chat grupal
    const joinGroupChat = async (groupJid) => {
        try {
            XMPPService.joinGroupChat(groupJid, user); // Llama al servicio XMPP para unirse al chat grupal
            setSelectedContact({ name: groupJid, jid: groupJid, status: 'available' }); // Establece el contacto seleccionado al grupo
            setGroupChatWindow(false); // Cierra la ventana de unión a chat grupal
        } catch (error) {
            console.error("Error al unirse al grupo: ", error); // Muestra un error si falla la unión
        }
    };

    // Función para abrir el popup de detalles de contacto
    const openContactDetailPopup = async () => {
        if (selectedContact) {
            const details = await XMPPService.getContactDetails(selectedContact.name); // Obtiene los detalles del contacto seleccionado
            setContactDetail(details); // Establece los detalles en el estado
            setShowContactDetailWindow(true); // Abre la ventana de detalles del contacto
        }

        console.log(contactDetail); // Muestra los detalles del contacto en la consola
    };

    // Función para manejar el cierre de sesión
    const handleLogOut = async () => {
        try {
            XMPPService.disconnect(); // Llama al servicio XMPP para desconectar al usuario
            navigate('/'); // Navega a la página de inicio después de la desconexión
        } catch (err) {
            console.error('Error en la desconexión: ', err); // Muestra un error si falla la desconexión
        }
    };

    // Función para actualizar la lista de contactos
    const refreshContacts = async () => {
        try {
            const contactList = await XMPPService.getContacts(); // Obtiene la lista de contactos desde el servicio XMPP
            setContacts(contactList); // Establece la lista de contactos en el estado
        } catch (error) {
            console.error("Error obteniendo los contactos: ", error); // Muestra un error si falla la obtención de contactos
            navigate('/'); // Navega a la página de inicio si hay un error
        }
    };

    // Función para enviar un mensaje
    const handleSendMessage = () => {
        if (selectedContact && message) {
            XMPPService.sendMessage(selectedContact.name, message); // Llama al servicio XMPP para enviar el mensaje
        
            setConversations(prevConversations => ({
                ...prevConversations,
                [selectedContact.name]: [
                    ...(prevConversations[selectedContact.name] || []),
                    { text: message, timestamp: new Date(), sender: 'Tú' }
                ]
            }));
        
            setMessage(""); // Limpia el input de mensaje después de enviarlo
        } else {
            console.error("No se puede enviar un mensaje vacío o sin un contacto seleccionado."); // Muestra un error si no hay contacto seleccionado o el mensaje está vacío
        }
    };

    // Función para iniciar un chat con un contacto
    const startChat = (contact) => {
        setSelectedContact(contact); // Establece el contacto seleccionado
        setNewChatWindow(false); // Cierra la ventana de nuevo chat
    };

    // Función para abrir el popup de estado de presencia
    const openPresencePopup = () => {
        setMoreOptionsWindow(false); // Cierra la ventana de más opciones
        setPresenceWindow(true); // Abre la ventana de estado de presencia
    };

    // Función para actualizar el estado de presencia
    const updatePresence = (status, message) => {
        XMPPService.updatePresence(status, message); // Llama al servicio XMPP para actualizar la presencia
        setPresenceWindow(false); // Cierra la ventana de presencia después de actualizarla
    };

    // Función para eliminar la cuenta
    const eliminarCuenta = async () => {
        try {
            await XMPPService.deleteAccount(); // Llama al servicio XMPP para eliminar la cuenta
            navigate('/');  // Redirige al usuario a la página de inicio después de eliminar la cuenta
        } catch (err) {
            console.error('Error eliminando la cuenta:', err); // Muestra un error si falla la eliminación
        }
    };

    // useEffect para manejar las actualizaciones de presencia y mensajes
    useEffect(() => {
        refreshContacts(); // Actualiza la lista de contactos al montar el componente
    
        // Configura el callback para actualizar la lista de contactos cuando cambie la presencia
        XMPPService.setOnContactPresenceUpdateCallback((updatedContacts) => {
            setContacts(Object.values(updatedContacts)); // Actualiza los contactos en el estado
        });
    
        // Configura el callback para manejar mensajes entrantes
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
    
        // Carga los contactos y grupos del usuario al montar el componente
        const loadContactsAndGroups = async () => {
            try {
                const [contactList, groupList] = await Promise.all([
                    XMPPService.getContacts(), // Obtiene la lista de contactos
                    XMPPService.getUserGroups() // Obtiene la lista de grupos
                ]);
    
                setContacts(contactList); // Establece la lista de contactos en el estado
                setGroups(groupList); // Establece la lista de grupos en el estado
            } catch (error) {
                console.error("Error obteniendo contactos o grupos: ", error); // Muestra un error si falla la obtención
                navigate('/'); // Navega a la página de inicio si hay un error
            }
        };
    
        loadContactsAndGroups(); // Llama a la función para cargar contactos y grupos
    
        return () => {
            XMPPService.setOnContactPresenceUpdateCallback(null); // Limpia el callback de presencia al desmontar el componente
            XMPPService.setOnMessageReceivedCallback(null); // Limpia el callback de mensajes al desmontar el componente
        };
    }, []);

    // Render del componente
    return (
        <>
            <div className="chatContainer">
                <div className="menuContainer">
                    <div></div>
                    <h3>{user}</h3> {/* Muestra el nombre de usuario en el menú */}

                    <div className="contactos">
                        {/* Lista de contactos */}
                        <div className="bottomBorder">
                            <div className="divCentrado">
                                <h3>Contactos</h3>

                                <button className="bttnAddContact" onClick={() => setMoreOptionsWindow(true)}>+</button>
                            </div>

                            <ul>
                                {contacts
                                    .filter(contact => contact.name && contact.name.trim() !== '')
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

                        {/* Lista de chats activos */}
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
                                                setSelectedContact(contact); // Selecciona el contacto si está en la lista de contactos
                                            } else {
                                                setSelectedContact({ name: jid, jid, status: 'available' }); // Selecciona el contacto como un nuevo contacto
                                            }
                                        }}
                                    >
                                        {contacts.find(contact => contact.name === jid)?.name || jid}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Lista de chats grupales */}
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

                    <button className="bttnLogOut" onClick={handleLogOut}>Log Out</button> {/* Botón para cerrar sesión */}
                </div>

                {selectedContact && ( // Si hay un contacto seleccionado, muestra la ventana de mensajes
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
                                                ? '#873091' // Color para los mensajes enviados por el usuario
                                                : '#3792a4', // Color para los mensajes recibidos
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
                                    <button className="sendBttn" onClick={handleSendMessage}>Enviar</button> {/* Botón para enviar mensajes */}
                                    <button className="archivosBttn">Adjuntar archivos</button> {/* Botón para adjuntar archivos */}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {groupChatWindow && ( // Muestra el popup de unión a chat grupal si está abierto
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

            {moreOptionsWindow && ( // Muestra el popup de más opciones si está abierto
                <MoreOptions
                    closePopup={() => setMoreOptionsWindow(false)}
                    openAddContactPopup={openAddContactPopup}
                    openNewChatPopup={openNewChatPopup}
                    openGroupChatPopup={openGroupChatPopup}
                    openPresencePopup={openPresencePopup}
                    openEliminarCuenta={openEliminarCuenta}
                    openCreateGroupChatPopup={openCreateGroupChatPopup}
                />
            )}

            {newChatWindow && ( // Muestra el popup de nuevo chat si está abierto
                <NewChat
                    closePopup={() => setNewChatWindow(false)}
                    startChat={startChat}
                />
            )}

            {addContactWindow && ( // Muestra el popup de agregar contacto si está abierto
                <AddContact closePopup={() => setAddContactWindow(false)} refreshContacts={refreshContacts}/>
            )}

            {presenceWindow && ( // Muestra el popup de estado de presencia si está abierto
                <PresencePopup 
                    closePopup={() => setPresenceWindow(false)}
                    updatePresence={updatePresence}
                />
            )}

            {eliminarCuentaWindow && ( // Muestra el popup de eliminar cuenta si está abierto
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