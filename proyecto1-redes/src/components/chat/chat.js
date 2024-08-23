import "./chat.css";
import XMPPService from "../../services/xmpp.js";
import { useNavigate, useLocation  } from "react-router-dom";
import React, { useEffect, useState } from "react";
import AddContact from "../addContact/addContact.js";
import MoreOptions from "../moreOptions/moreOptions.js";
import NewChat from "../newChat/newChat.js";

export default function Chat() {
    const navigate = useNavigate(); 
    const location = useLocation(); 

    const { user } = location.state || {}; 

    const [contacts, setContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [message, setMessage] = useState("");
    const [conversations, setConversations] = useState({});

    const [addContactWindow, setAddContactWindow] = useState(false);
    const [moreOptionsWindow, setMoreOptionsWindow] = useState(false);
    const [newChatWindow, setNewChatWindow] = useState(false);

    const openAddContactPopup = () => {
        setMoreOptionsWindow(false); 
        setAddContactWindow(true); 
    };

    const openNewChatPopup = () => {
        setMoreOptionsWindow(false); 
        setNewChatWindow(true); 
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
            XMPPService.sendMessage(selectedContact.jid, message);
        
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

    useEffect(() => {
        refreshContacts();

        XMPPService.setOnContactPresenceUpdateCallback((updatedContacts) => {
            setContacts(Object.values(updatedContacts));
        });

        XMPPService.setOnMessageReceivedCallback((message) => {
            setConversations(prevConversations => ({
                ...prevConversations,
                [message.from]: [
                    ...(prevConversations[message.from] || []),
                    { text: message.text, timestamp: message.timestamp, sender: message.from }
                ]
            }));
        });

        return () => {
            XMPPService.setOnContactPresenceUpdateCallback(null);
            XMPPService.setOnMessageReceivedCallback(null);
        };
    }, []);

    return (
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
                                        key={`${contact.name}-${index}`}
                                        style={{
                                            color: contact.status === 'offline'
                                                ? '#a30808'
                                                : contact.status === 'away'
                                                    ? '#8d5f17'
                                                    : '#1d6317'
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

                    <button className="bttnLogOut" onClick={handleLogOut}>Log Out</button>
                </div>

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

            {moreOptionsWindow && (
                <MoreOptions
                    closePopup={() => setMoreOptionsWindow(false)}
                    openAddContactPopup={openAddContactPopup}
                    openNewChatPopup={openNewChatPopup}
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
        </>
    );
}
