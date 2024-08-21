import "./chat.css";
import XMPPService from "../../services/xmpp.js";
import { useNavigate, useLocation  } from "react-router-dom";
import { useEffect, useState } from "react";
import AddContact from "../addContact/addContact.js";

export default function Chat(){
    const navigate = useNavigate(); // Hook para navegar
    const location = useLocation(); // Hook para acceder al estado pasado con navigate

    const { user } = location.state || {}; // Obtener el user del estado pasado

    const [contacts, setContacts] = useState([]);
    const [addContactWindow, setAddContactWindow] = useState(false);

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
                        <div className="divCentrado">
                            <h3>Contactos</h3>

                            <button className="bttnAddContact" onClick={() => setAddContactWindow(true)}>+</button>
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
                                >
                                    {contact.name}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button className="bttnLogOut" onClick={handleLogOut}>Log Out</button>
                </div>
            </div>

                {addContactWindow && (
                    <AddContact closePopup={() => setAddContactWindow(false)} refreshContacts={refreshContacts}/>
                )}
        </>
    )
}