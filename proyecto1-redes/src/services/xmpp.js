import { Strophe, $pres, $msg, $iq } from 'strophe.js';

class XMPPService {
    constructor() {
        this.connection = new Strophe.Connection('ws://alumchat.lol:7070/ws/');
        this.userJid = '';
        this.status = '';
        this.contacts = {};
        this.onContactPresenceUpdate = null;  // Callback para notificar al Chat
    }

    connect(user, password) {
        return new Promise((resolve, reject) => {
            this.connection.connect(user, password, (status) => {
                if (status === Strophe.Status.CONNECTED) {
                    this.connection.addHandler(this.onPresence.bind(this), null, 'presence', null, null, null);
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

                    // Filtrar el JID del usuario actual
                    if (jid === this.userJid) {
                        continue; // Saltar el propio JID
                    }
                    
                    const name = item.getAttribute('name') || jid;
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

    onPresence(presence) {
        const from = Strophe.getBareJidFromJid(presence.getAttribute('from'));

        // Ignorar las presencias que provienen del propio usuario
        if (from === this.userJid) {
            return true; // Salir de la función sin procesar esta presencia
        }
        
        const type = presence.getAttribute('type');
        const show = presence.getElementsByTagName('show')[0];
        const status = show ? show.textContent : (type === 'unavailable' ? 'offline' : 'available');

        // Verificar si el contacto existe en el objeto this.contacts
        if (!this.contacts[from]) {
            // Si el contacto no existe, agregarlo con un estado por defecto
            this.contacts[from] = {
                name: from,
                subscription: 'none',  // Puedes ajustar esto según tus necesidades
                status: 'offline'  // Establecer un estado por defecto
            };
        }

        // Actualizar el estado del contacto basado en el tipo de presencia
        if (type === 'unavailable') {
            this.contacts[from].status = 'offline';
        } else {
            this.contacts[from].status = status;
        }

        console.log('Presence updated for', from, 'to', this.contacts[from].status);

        // Notificar al componente Chat sobre la actualización
        if (this.onContactPresenceUpdate) {
            this.onContactPresenceUpdate(this.contacts);
        }
    
        return true;
    }
   
    disconnect() {
        if (this.connection && this.connection.connected) {
            this.connection.disconnect();
        }
    }

    onMessage(message) {
        return true;
    }

    setOnContactPresenceUpdateCallback(callback) {
        this.onContactPresenceUpdate = callback;
    }
}

export default new XMPPService();
