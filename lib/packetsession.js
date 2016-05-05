var HttpPacket = require('./httppacket');

class PacketSession {
  constructor() {
    this.request = new HttpPacket();
    this.response = new HttpPacket();
  }
}

module.exports = PacketSession;