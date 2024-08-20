import "./chat.css";
import XMPPService from "../../services/xmpp.js";
import { useNavigate, useLocation  } from "react-router-dom";
import { useEffect, useState } from "react";
export default function Chat(){
    const navigate = useNavigate(); // Hook para navegar
    const location = useLocation(); // Hook para acceder al estado pasado con navigate

    const { user } = location.state || {}; // Obtener el user del estado pasado

    const [contacts, setContacts] = useState([]);

    const handleLogOut = async () =>{
        try {
                XMPPService.disconnect();
            navigate('/');
            
        } catch (err) {
            console.error('Error en la desconexión: ', err);
            console.log('Error en la desconexión');
        }
    };

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const contacts = await XMPPService.getContacts();
                setContacts(contacts);
                console.log(contacts)
            } catch (error) {
                console.error("Error obteniendo los contactos: ", error);
            }
        };

        fetchContacts();
    }, []);

    return(
        <>
            <div className="chatContainer">
                <div className="menuContainer">
                    <h3>{user}</h3>
                    
                    <div className="contactos">
                        <div className="divCentrado">
                            <h3>Contactos</h3>
                        </div>

                        <ul>
                            {contacts.map(contact => (
                                <li key={contact.jid} style={{ color: contact.status === 'offline' ? '#a30808' : '#208f17' }} >
                                    {contact.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <button className="bttnLogOut" onClick={handleLogOut}>Log Out</button>
                </div>
            </div>
        </>
    )
}