import { Strophe, $pres, $msg, $iq } from 'strophe.js';
import { client, xml } from '@xmpp/client';
import debug from '@xmpp/debug';

class XMPPService {
    constructor() {
        this.connection = new Strophe.Connection('ws://alumchat.lol:7070/ws/');
        this.userJid = '';
        this.status = '';
        this.contacts = {};
        this.onContactPresenceUpdate = null;  // Callback para notificar al Chat
        this.onMessageReceived = null;  // Callback para notificar al Chat de mensajes entrantes
    }

    // Método para manejar la conexión de un usuario
    connect(user, password) {
        return new Promise((resolve, reject) => {
            // Verifica si el usuario ya tiene '@alumchat.lol' al final, si no, agrégalo
            if (!user.includes('@')) {
                user = `${user}@alumchat.lol`;
            }
    
            this.connection.connect(user, password, (status) => {
                if (status === Strophe.Status.CONNECTED) {
                    this.connection.addHandler(this.onPresence.bind(this), null, 'presence', null, null, null);
                    this.connection.addHandler(this.onMessage.bind(this), null, 'message', null, null, null);
                    this.connection.send($pres().tree());
                    this.userJid = Strophe.getBareJidFromJid(this.connection.jid);
                    resolve(status);
                } else if (status === Strophe.Status.DISCONNECTED) {
                    reject('Desconectado');
                } else if (status === Strophe.Status.AUTHFAIL) {
                    reject('Error de autenticación');
                }
            });
        });
    }    

    // Método para registrar nuevas cuentas
    register(user, password) {
        try {
          const xmppClient = client({
            service: 'ws://alumchat.lol:7070/ws',
            resource: '',
            sasl: ['PLAIN'],
          });
          debug(xmppClient, true);
    
          return new Promise((resolve, reject) => {
            xmppClient.on('error', (err) => {
              if (err.code === 'ECONERROR') {
                console.error('Error de conexión', err);
                xmppClient.stop();
                xmppClient.removeAllListeners();
                reject({ status: false, message: 'Error en el cliente XMPP' });
              }
            });
    
            xmppClient.on('open', () => {
              console.log('Connection established');
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
              xmppClient.send(iq);
            });
      
            xmppClient.on('stanza', async (stanza) => {
              if (stanza.is('iq') && stanza.getAttr("id") === "register") {
                console.log('Registro exitoso', stanza);
                await xmppClient.stop();
                xmppClient.removeAllListeners();
                if (stanza.getAttr("type") === "result") {
                  resolve({ status: true, message: 'Registro exitoso. Ahora puedes hacer login.' });
                } else if (stanza.getAttr("type") === "error") {
                  console.log('Error en registro', stanza);
                  const error = stanza.getChild("error");
                  if (error?.getChild("conflict")) {
                    reject({ status: false, message: 'El usuario ya está en uso.' });
                  }
                  reject({ status: false, message: 'Ocurrió un error en tu registro. Intenta nuevamente' });
                }
              }
            });
    
            xmppClient.start().catch((err) => { 
              console.log(err);
             });
          });
        } catch (error) {
          console.error('Error en el registro', error);
          throw error;
        }
    }

    // Método para eliminar cuentas
    deleteAccount() {
        return new Promise((resolve, reject) => {
            if (!this.connection || !this.connection.connected) {
                reject('No hay conexión establecida con el servidor XMPP');
                return;
            }
    
            const iq = $iq({ type: 'set', to: 'alumchat.lol' })
                .c('query', { xmlns: 'jabber:iq:register' })
                .c('remove');  // Indica la eliminación de la cuenta
    
            this.connection.sendIQ(iq, (iqResult) => {
                console.log('Cuenta eliminada exitosamente');
                this.disconnect();  // Desconecta al usuario después de eliminar la cuenta
                resolve('Cuenta eliminada exitosamente');
            }, (error) => {
                console.error('Error al eliminar la cuenta', error);
                reject('Error al eliminar la cuenta');
            });
        });
    }    

    // Método para enviar mensajes
    sendMessage(toJid, message) {
        if (!this.connection || !this.connection.connected) {
            console.error('No hay conexión establecida con el servidor XMPP');
            return;
        }

        const messageStanza = $msg({ to: toJid, from: this.userJid, type: 'chat' })
            .c('body')
            .t(message);

        this.connection.send(messageStanza.tree());
        console.log(`Mensaje enviado a ${toJid}: ${message}`);
    }

    // Método para manejar mensajes entrantes
    onMessage(message) {
        let from = Strophe.getBareJidFromJid(message.getAttribute('from'));
        const type = message.getAttribute('type');
        const body = message.getElementsByTagName('body')[0];
        let time = new Date();
    
        if (body) {
            const text = body.textContent;
            
            if (type === 'groupchat') {
                const roomJid = Strophe.getBareJidFromJid(from); // El JID del grupo
                const nickname = Strophe.getResourceFromJid(message.getAttribute('from')); // El remitente del mensaje en el grupo
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
        this.onMessageReceived = callback;
    }    

    // Método para buscar los contactos de un usuario
    getContacts() {
        return new Promise((resolve, reject) => {
            if (!this.connection || !this.connection.connected) {
                reject('No hay conexión establecida con el servidor XMPP');
                return;
            }
    
            const iq = $iq({ type: 'get' }).c('query', { xmlns: 'jabber:iq:roster' });
    
            this.connection.sendIQ(iq, (iqResult) => {
                const contacts = [];
                const items = iqResult.getElementsByTagName('item');
    
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    const jid = item.getAttribute('jid');
                    const name = item.getAttribute('name') || jid;
    
                    // Filtrar contactos con JID o nombre vacíos
                    if (!jid || jid.trim() === '' || name.trim() === '') {
                        continue; // Saltar este contacto
                    }
    
                    const subscription = item.getAttribute('subscription');
    
                    contacts.push({ jid, name, subscription, status: 'offline' });
                    this.contacts[jid] = { name, subscription, status: 'offline' };
    
                    // Enviar una sonda de presencia para obtener el estado actual
                    this.sendPresenceProbe(jid);
                }
    
                resolve(contacts);
            }, (error) => {
                console.error('Error obteniendo los contactos', error);
                reject(error);
            });
        });
    }      

    sendPresenceProbe(jid) {
        const presence = $pres({ type: 'probe', to: jid });
        this.connection.send(presence.tree());
    }

    // Método para buscar la presencia de un usuario
    onPresence(presence) {
        const type = presence.getAttribute('type');
        const from = Strophe.getBareJidFromJid(presence.getAttribute('from'));
        let status = 'available';
        const show = presence.getElementsByTagName('show')[0];
        const message = presence.getElementsByTagName('status')[0]?.textContent || '';
    
        if (type === 'unavailable') {
            status = 'offline';
        } else if (show) {
            status = show.textContent;
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
            this.onContactPresenceUpdate(this.contacts);
        }
    
        return true;
    }
   
    // Método para manejar la desconexión de una cuenta
    disconnect() {
        if (this.connection && this.connection.connected) {
            this.connection.disconnect();
        }
    }

    setOnContactPresenceUpdateCallback(callback) {
        this.onContactPresenceUpdate = callback;
    }

    // Método para manejar la adición de nuevos contactos
    addContact(jid) {
        return new Promise((resolve, reject) => {
            if (!this.connection || !this.connection.connected) {
                reject('No hay conexión establecida con el servidor XMPP');
                return;
            }
    
            const iq = $iq({ type: 'set' })
                .c('query', { xmlns: 'jabber:iq:roster' })
                .c('item', { jid, name: jid, subscription: 'none' });
    
            this.connection.sendIQ(iq, (iqResult) => {
                console.log(`Contacto ${jid} añadido correctamente.`);
                resolve(iqResult);
            }, (error) => {
                console.error('Error al añadir el contacto', error);
                reject(error);
            });
        });
    }
    
    // Método para buscar la información de un contacto
    getContactDetails(jid) {
        return new Promise((resolve, reject) => {
            if (this.contacts[jid]) {
                resolve(this.contacts[jid]);
            } else {
                reject('Contacto no encontrado');
            }
        });
    }   
    
    // Método en XMPPService para unirse a un grupo
    joinGroupChat(roomJid, nickname) {
        const presence = $pres({ to: `${roomJid}/${nickname}` })
            .c('x', { xmlns: 'http://jabber.org/protocol/muc' });
        this.connection.send(presence);
        console.log(`Se unió al grupo: ${roomJid} as ${nickname}`);
    }

    // Método para buscar los grupos existentes
    getUserGroups() {
        return new Promise((resolve, reject) => {
            if (!this.connection || !this.connection.connected) {
                reject('No hay conexión establecida con el servidor XMPP');
                return;
            }
    
            const iq = $iq({ type: 'get', to: 'conference.alumchat.lol' }) // Direccionando a la conferencia (grupo)
                .c('query', { xmlns: 'http://jabber.org/protocol/disco#items' }); // Namespace de descubrimiento de items
    
            this.connection.sendIQ(iq, (iqResult) => {
                const groups = [];
                const items = iqResult.getElementsByTagName('item');
    
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    const jid = item.getAttribute('jid');
                    const name = item.getAttribute('name') || jid;
    
                    // Filtrar grupos con JID o nombre vacíos
                    if (!jid || jid.trim() === '' || name.trim() === '') {
                        continue; // Saltar este grupo
                    }
    
                    groups.push({ jid, name });
                }
    
                resolve(groups);
            }, (error) => {
                console.error('Error obteniendo los grupos del usuario', error);
                reject(error);
            });
        });
    }    

    // Método para manejar la actualización de la presencia del usuario conectado
    updatePresence(status, statusMessage) {
        let presence = $pres();
    
        if (status !== "available" && status !== "offline") {
            presence.c("show").t(status).up();
        }
    
        if (statusMessage) {
            presence.c("status").t(statusMessage);
        }
    
        this.connection.send(presence.tree());
        console.log(`Presencia actualizada: ${status}, Mensaje: ${statusMessage}`);
    }    
}

export default new XMPPService();
