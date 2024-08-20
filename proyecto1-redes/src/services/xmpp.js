import { Strophe, $pres, $msg, $iq } from 'strophe.js';

class XMPPService {
    constructor() {
        this.connection = new Strophe.Connection('ws://alumchat.lol:7070/ws/');
        this.userJid = '';
        this.status = '';
        this.contacts = {};
    }

    connect(user, password) {
        return new Promise((resolve, reject) => {
            this.connection.connect(user, password, (status) => {
                console.log('Status: ', status);

                if (status === Strophe.Status.CONNECTED) {
                    console.log('Conectado');
                    this.connection.addHandler(this.onPresence.bind(this), null, 'presence', null, null, null);
                    this.connection.addHandler(this.onMessage.bind(this), null, 'message', null, null, null);
                    this.connection.send($pres().tree());
                    this.userJid = Strophe.getBareJidFromJid(this.connection.jid);
                    resolve(status);
                } else if (status === Strophe.Status.DISCONNECTED) {
                    console.log('Desconectado (error de loggin)');
                    reject('Desconectado');
                } else if (status === Strophe.Status.AUTHFAIL) {
                    console.log('Error de autenticación');
                    reject('Error de autenticación');
                }
            });
        });
    }

    getContacts() {
        return new Promise((resolve, reject) => {
            const iq = $iq({ type: 'get' }).c('query', { xmlns: 'jabber:iq:roster' });

            this.connection.sendIQ(iq, (iqResult) => {
                const contacts = [];
                const items = iqResult.getElementsByTagName('item');

                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    const jid = item.getAttribute('jid');
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
        const type = presence.getAttribute('type');
        const from = Strophe.getBareJidFromJid(presence.getAttribute('from'));
        const show = presence.getElementsByTagName('show')[0];
        const status = show ? show.textContent : 'available';

        if (type === 'unavailable') {
            this.contacts[from].status = 'offline';
        } else {
            this.contacts[from].status = status;
        }

        console.log('Presence updated for', from, 'to', this.contacts[from].status);

        return true;
    }

    disconnect() {
        if (this.connection && this.connection.connected) {
            this.connection.disconnect();
            console.log('Desconectado');
        } else {
            console.log('No hay conexión para desconectar');
        }
    }

    onMessage(message) {
        console.log('Mensaje recibido: ', message);
        return true;
    }
}

export default new XMPPService();
