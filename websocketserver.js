const WebSocketServer = require('ws').Server;

class WsServer {
    constructor(server) {
        this.connections = [];
        this.wsServer = new WebSocketServer({
            server: server
        });
        this.wsServer.on('connection', (connection) => {
            this.addConnection(connection);
            //connection.send("Response string at connection!");
            connection.on('message', (message) => {
                const dataStr = message.toString();
                console.log(`Got data: ${dataStr}`);
                connection.send(`Echo: ${dataStr}`);
            });
            connection.on('close', () => this.removeConnection(connection));
        });
    }

    addConnection(connection) {
        this.connections.push(connection);
    }
    removeConnection(connection) {
        this.connections = this.connections.filter(x => x !== connection);
    }

    notifyAll(msgTitle, msgText, entityId) {
        console.log(`WS> Notify all (${this.connections.length}) with: ${msgText}`);
        let msg = {
            Title: msgTitle,
            Text: msgText,
            Id: entityId
        };
        for (const connection of this.connections) {
            connection.send(JSON.stringify(msg));
        }
    }


};

module.exports = WsServer;