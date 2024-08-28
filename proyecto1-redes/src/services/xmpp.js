import { Strophe, $pres, $msg, $iq } from 'strophe.js'; // Importa Strophe.js y utilidades XMPP para manejar mensajes, presencia y IQs
import { client, xml } from '@xmpp/client'; // Importa un cliente XMPP y utilidades para manejar XML
import debug from '@xmpp/debug'; // Importa la herramienta de depuración para XMPP

class XMPPService {
    constructor() {
        this.connection = new Strophe.Connection('ws://alumchat.lol:7070/ws/'); // Establece la conexión con el servidor XMPP
        this.userJid = ''; // JID del usuario (se asigna después de la conexión)
        this.status = ''; // Estado actual de la conexión
        this.contacts = {}; // Objeto para almacenar la lista de contactos
        this.onContactPresenceUpdate = null;  // Callback para notificar al chat sobre actualizaciones de presencia de contactos
        this.onMessageReceived = null;  // Callback para notificar al chat sobre mensajes entrantes
    }

    // Método para manejar la conexión de un usuario
    connect(user, password) {
        return new Promise((resolve, reject) => {
            // Verifica si el usuario ya tiene '@alumchat.lol' al final, si no, lo agrega
            if (!user.includes('@')) {
                user = `${user}@alumchat.lol`;
            }
    
            this.connection.connect(user, password, (status) => {
                if (status === Strophe.Status.CONNECTED) {
                    // Configura manejadores para presencia y mensajes cuando la conexión es exitosa
                    this.connection.addHandler(this.onPresence.bind(this), null, 'presence', null, null, null);
                    this.connection.addHandler(this.onMessage.bind(this), null, 'message', null, null, null);
                    this.connection.send($pres().tree()); // Envía una presencia inicial
                    this.userJid = Strophe.getBareJidFromJid(this.connection.jid); // Almacena el JID del usuario
                    resolve(status); // Resuelve la promesa con el estado de la conexión
                } else if (status === Strophe.Status.DISCONNECTED) {
                    reject('Desconectado'); // Rechaza la promesa si se desconecta
                } else if (status === Strophe.Status.AUTHFAIL) {
                    reject('Error de autenticación'); // Rechaza la promesa si hay un fallo de autenticación
                }
            });
        });
    }    

    // Método para registrar nuevas cuentas
    register(user, password) {
        try {
            const xmppClient = client({
                service: 'ws://alumchat.lol:7070/ws', // URL del servicio XMPP
                resource: '',
                sasl: ['PLAIN'], // Métodos de autenticación
            });
            debug(xmppClient, true); // Habilita la depuración para el cliente XMPP
    
            return new Promise((resolve, reject) => {
                xmppClient.on('error', (err) => {
                    if (err.code === 'ECONERROR') {
                        console.error('Error de conexión', err);
                        xmppClient.stop(); // Detiene el cliente en caso de error de conexión
                        xmppClient.removeAllListeners(); // Elimina todos los listeners
                        reject({ status: false, message: 'Error en el cliente XMPP' }); // Rechaza la promesa con un mensaje de error
                    }
                });
    
                xmppClient.on('open', () => {
                    console.log('Connection established');
                    // Crea una solicitud IQ para registrar una nueva cuenta
                    const iq = xml(
                        'iq',
                        { type: 'set', to: 'alumchat.lol', id: 'register' },
                        xml(
                            'query',
                            { xmlns: 'jabber:iq:register' },
                            xml('username', {}, user),
                            xml('password', {}, password)
                        )
                    );
                    xmppClient.send(iq); // Envía la solicitud IQ
                });
      
                xmppClient.on('stanza', async (stanza) => {
                    if (stanza.is('iq') && stanza.getAttr("id") === "register") {
                        console.log('Registro exitoso', stanza);
                        await xmppClient.stop(); // Detiene el cliente después de un registro exitoso
                        xmppClient.removeAllListeners(); // Elimina todos los listeners
                        if (stanza.getAttr("type") === "result") {
                            resolve({ status: true, message: 'Registro exitoso. Ahora puedes hacer login.' }); // Resuelve la promesa en caso de éxito
                        } else if (stanza.getAttr("type") === "error") {
                            console.log('Error en registro', stanza);
                            const error = stanza.getChild("error");
                            if (error?.getChild("conflict")) {
                                reject({ status: false, message: 'El usuario ya está en uso.' }); // Rechaza la promesa si el usuario ya existe
                            }
                            reject({ status: false, message: 'Ocurrió un error en tu registro. Intenta nuevamente' }); // Otro tipo de error de registro
                        }
                    }
                });
    
                xmppClient.start().catch((err) => { 
                    console.log(err);
                });
            });
        } catch (error) {
            console.error('Error en el registro', error);
            throw error; // Lanza una excepción en caso de error durante el registro
        }
    }

    // Método para eliminar cuentas
    deleteAccount() {
        return new Promise((resolve, reject) => {
            if (!this.connection || !this.connection.connected) {
                reject('No hay conexión establecida con el servidor XMPP'); // Rechaza la promesa si no hay conexión
                return;
            }
    
            const iq = $iq({ type: 'set', to: 'alumchat.lol' })
                .c('query', { xmlns: 'jabber:iq:register' })
                .c('remove');  // Indica la eliminación de la cuenta
    
            this.connection.sendIQ(iq, (iqResult) => {
                console.log('Cuenta eliminada exitosamente');
                this.disconnect();  // Desconecta al usuario después de eliminar la cuenta
                resolve('Cuenta eliminada exitosamente'); // Resuelve la promesa si se elimina la cuenta con éxito
            }, (error) => {
                console.error('Error al eliminar la cuenta', error);
                reject('Error al eliminar la cuenta'); // Rechaza la promesa si hay un error durante la eliminación
            });
        });
    }    

    // Método para enviar mensajes
    sendMessage(toJid, message) {
        if (!this.connection || !this.connection.connected) {
            console.error('No hay conexión establecida con el servidor XMPP'); // Muestra un error si no hay conexión
            return;
        }

        // Crea un mensaje XMPP y lo envía
        const messageStanza = $msg({ to: toJid, from: this.userJid, type: 'chat' })
            .c('body')
            .t(message);

        this.connection.send(messageStanza.tree()); // Envía el mensaje
        console.log(`Mensaje enviado a ${toJid}: ${message}`);
    }

    // Método para manejar mensajes entrantes
    onMessage(message) {
        let from = Strophe.getBareJidFromJid(message.getAttribute('from')); // Obtiene el JID del remitente
        const type = message.getAttribute('type'); // Obtiene el tipo de mensaje (chat o groupchat)
        const body = message.getElementsByTagName('body')[0]; // Obtiene el cuerpo del mensaje
        let time = new Date(); // Obtiene la fecha y hora actual
    
        if (body) {
            const text = body.textContent; // Extrae el texto del mensaje
            
            if (type === 'groupchat') {
                const roomJid = Strophe.getBareJidFromJid(from); // Obtiene el JID del grupo
                const nickname = Strophe.getResourceFromJid(message.getAttribute('from')); // Obtiene el nickname del remitente en el grupo
                console.log(`Mensaje recibido en grupo ${roomJid} de ${nickname}: ${text}`);
    
                if (this.onMessageReceived) {
                    this.onMessageReceived({
                        from: nickname,  // Nombre del remitente
                        text,
                        timestamp: time,
                        room: roomJid,   // JID del grupo
                    });
                }
            } else if (type === 'chat') {
                console.log(`Mensaje recibido de ${from}: ${text}`);
    
                if (this.onMessageReceived) {
                    this.onMessageReceived({
                        from,
                        text,
                        timestamp: time
                    });
                }
            }
        } else {
            console.log(`Mensaje recibido de ${from} sin cuerpo:`, message);
        }
    
        return true;
    }     

    // Configurar el callback para manejar mensajes
    setOnMessageReceivedCallback(callback) {
        console.log("Registrando el callback de mensaje recibido");
        this.onMessageReceived = callback; // Registra el callback para manejar los mensajes entrantes
    }    

    // Método para buscar los contactos de un usuario
    getContacts() {
        return new Promise((resolve, reject) => {
            if (!this.connection || !this.connection.connected) {
                reject('No hay conexión establecida con el servidor XMPP'); // Rechaza la promesa si no hay conexión
                return;
            }
    
            const iq = $iq({ type: 'get' }).c('query', { xmlns: 'jabber:iq:roster' }); // Crea una solicitud IQ para obtener el roster
    
            this.connection.sendIQ(iq, (iqResult) => {
                const contacts = [];
                const items = iqResult.getElementsByTagName('item'); // Obtiene los items del roster
    
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    const jid = item.getAttribute('jid'); // Obtiene el JID del contacto
                    const name = item.getAttribute('name') || jid; // Obtiene el nombre del contacto
    
                    // Filtra contactos con JID o nombre vacíos
                    if (!jid || jid.trim() === '' || name.trim() === '') {
                        continue; // Saltar este contacto
                    }
    
                    const subscription = item.getAttribute('subscription'); // Obtiene la suscripción del contacto
    
                    contacts.push({ jid, name, subscription, status: 'offline' }); // Agrega el contacto a la lista
                    this.contacts[jid] = { name, subscription, status: 'offline' };
    
                    // Enviar una sonda de presencia para obtener el estado actual
                    this.sendPresenceProbe(jid);
                }
    
                resolve(contacts); // Resuelve la promesa con la lista de contactos
            }, (error) => {
                console.error('Error obteniendo los contactos', error);
                reject(error); // Rechaza la promesa si hay un error al obtener los contactos
            });
        });
    }      

    // Método para enviar una sonda de presencia
    sendPresenceProbe(jid) {
        const presence = $pres({ type: 'probe', to: jid });
        this.connection.send(presence.tree()); // Envía la sonda de presencia
    }

    // Método para crear un nuevo chat grupal
    createGroupChatRoom(roomName, nickname) {
        return new Promise((resolve, reject) => {
            if (!this.connection || !this.connection.connected) {
                return reject(new Error('La conexión no está activa.')); // Rechaza la promesa si la conexión no está activa
            }

            const roomJid = `${roomName.replaceAll(' ', '_')}@conference.alumchat.lol`; // Formatea el JID de la sala grupal

            // Envía una presencia a la sala para unirse a ella
            const presence = $pres({ to: `${roomJid}/${nickname}` })
                .c('x', { xmlns: 'http://jabber.org/protocol/muc' });

            this.connection.send(presence.tree()); // Envía la presencia para unirse a la sala

            setTimeout(() => {
                // Crea una solicitud IQ para configurar la sala
                const iq = $iq({ type: 'set', to: roomJid, id: 'create_room' })
                    .c('query', { xmlns: 'http://jabber.org/protocol/muc#owner' })
                    .c('x', { xmlns: 'jabber:x:data', type: 'submit' })
                    .c('field', { var: 'FORM_TYPE' })
                    .c('value').t('http://jabber.org/protocol/muc#roomconfig').up()
                    .up()
                    .c('field', { var: 'muc#roomconfig_roomname' })
                    .c('value').t(roomName).up()
                    .c('field', { var: 'muc#roomconfig_nickname' })
                    .c('value').t(nickname);

                this.connection.sendIQ(iq,
                    () => {
                        resolve('Sala grupal creada con éxito.'); // Resuelve la promesa si la sala se crea con éxito
                    },
                    (error) => {
                        console.error('Error al crear la sala grupal:', error);
                        reject(new Error(`Error al crear la sala grupal: ${error.condition}`)); // Rechaza la promesa si hay un error
                    }
                );
            }, 1000); // Espera un segundo antes de enviar la solicitud de configuración
        });
    }    
    
    // Método para manejar la presencia de un usuario
    onPresence(presence) {
        const type = presence.getAttribute('type'); // Obtiene el tipo de presencia
        const from = Strophe.getBareJidFromJid(presence.getAttribute('from')); // Obtiene el JID del remitente de la presencia
        let status = 'available'; // Estado por defecto es "available"
        const show = presence.getElementsByTagName('show')[0]; // Obtiene el estado mostrado
        const message = presence.getElementsByTagName('status')[0]?.textContent || ''; // Obtiene el mensaje de presencia
    
        if (type === 'unavailable') {
            status = 'offline'; // Si el tipo es 'unavailable', el estado es "offline"
        } else if (show) {
            status = show.textContent; // Si hay un estado mostrado, se actualiza el estado
        }
    
        if (from !== this.userJid) {
            this.contacts[from] = {
                ...this.contacts[from],
                status,
                presence: message,
            };
        }
    
        console.log(`Presencia actualizada para ${from}: ${status}`);
    
        if (this.onContactPresenceUpdate) {
            this.onContactPresenceUpdate(this.contacts); // Notifica al chat sobre la actualización de presencia
        }
    
        return true;
    }
   
    // Método para manejar la desconexión de una cuenta
    disconnect() {
        if (this.connection && this.connection.connected) {
            this.connection.disconnect(); // Desconecta la conexión si está activa
        }
    }

    // Configurar el callback para manejar actualizaciones de presencia de contactos
    setOnContactPresenceUpdateCallback(callback) {
        this.onContactPresenceUpdate = callback; // Registra el callback para manejar actualizaciones de presencia
    }

    // Método para manejar la adición de nuevos contactos
    addContact(jid) {
        return new Promise((resolve, reject) => {
            if (!this.connection || !this.connection.connected) {
                reject('No hay conexión establecida con el servidor XMPP'); // Rechaza la promesa si no hay conexión
                return;
            }
    
            const iq = $iq({ type: 'set' })
                .c('query', { xmlns: 'jabber:iq:roster' })
                .c('item', { jid, name: jid, subscription: 'none' });
    
            this.connection.sendIQ(iq, (iqResult) => {
                console.log(`Contacto ${jid} añadido correctamente.`);
                resolve(iqResult); // Resuelve la promesa si el contacto se añade correctamente
            }, (error) => {
                console.error('Error al añadir el contacto', error);
                reject(error); // Rechaza la promesa si hay un error al añadir el contacto
            });
        });
    }
    
    // Método para buscar la información de un contacto
    getContactDetails(jid) {
        return new Promise((resolve, reject) => {
            if (this.contacts[jid]) {
                resolve(this.contacts[jid]); // Resuelve la promesa con los detalles del contacto si existe
            } else {
                reject('Contacto no encontrado'); // Rechaza la promesa si el contacto no se encuentra
            }
        });
    }   
    
    // Método para unirse a un grupo
    joinGroupChat(roomJid, nickname) {
        const presence = $pres({ to: `${roomJid}/${nickname}` })
            .c('x', { xmlns: 'http://jabber.org/protocol/muc' });
        this.connection.send(presence); // Envía la presencia para unirse al grupo
        console.log(`Se unió al grupo: ${roomJid} as ${nickname}`);
    }

    // Método para buscar los grupos existentes
    getUserGroups() {
        return new Promise((resolve, reject) => {
            if (!this.connection || !this.connection.connected) {
                reject('No hay conexión establecida con el servidor XMPP'); // Rechaza la promesa si no hay conexión
                return;
            }
    
            const iq = $iq({ type: 'get', to: 'conference.alumchat.lol' }) // Solicita la lista de grupos en el servidor
                .c('query', { xmlns: 'http://jabber.org/protocol/disco#items' }); // Namespace para descubrimiento de items
    
            this.connection.sendIQ(iq, (iqResult) => {
                const groups = [];
                const items = iqResult.getElementsByTagName('item');
    
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    const jid = item.getAttribute('jid'); // Obtiene el JID del grupo
                    const name = item.getAttribute('name') || jid; // Obtiene el nombre del grupo
    
                    // Filtra grupos con JID o nombre vacíos
                    if (!jid || jid.trim() === '' || name.trim() === '') {
                        continue; // Saltar este grupo
                    }
    
                    groups.push({ jid, name }); // Añade el grupo a la lista de grupos
                }
    
                resolve(groups); // Resuelve la promesa con la lista de grupos
            }, (error) => {
                console.error('Error obteniendo los grupos del usuario', error);
                reject(error); // Rechaza la promesa si hay un error al obtener los grupos
            });
        });
    }    

    // Método para manejar la actualización de la presencia del usuario conectado
    updatePresence(status, statusMessage) {
        let presence = $pres(); // Crea un mensaje de presencia
    
        if (status !== "available" && status !== "offline") {
            presence.c("show").t(status).up(); // Si el estado no es "available" o "offline", lo añade al mensaje de presencia
        }
    
        if (statusMessage) {
            presence.c("status").t(statusMessage); // Añade un mensaje de estado si se proporciona
        }
    
        this.connection.send(presence.tree()); // Envía el mensaje de presencia
        console.log(`Presencia actualizada: ${status}, Mensaje: ${statusMessage}`);
    }    
}

export default new XMPPService(); // Exporta una instancia de la clase XMPPService