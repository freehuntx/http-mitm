var Http = require('http');
var PacketSession = require('./lib/packetsession');

class HttpMitm {
  constructor() {
    this._server = Http.createServer(this._onClientConnected.bind(this));
  }

  listen(port) {
    this._server.listen(port);
  }
  
  // Private
  _onClientConnected(request, response) {
    var self = this;
    var packetSession = new PacketSession();
    packetSession.request.setUrl(request.url);
    packetSession.request.setMethod(request.method);
    packetSession.request.setHeaders(request.headers);
    
    request.on('data', (chunk) => {
      packetSession.request.pushBody(chunk);
    });
    
    request.on('end', () => {
      if (self._onC2SCb !== undefined)
        self._onC2SCb(packetSession);
        
      var proxyRequest = Http.request({
        hostname: packetSession.request.getUrl().hostname,
        port: 80,
        method: packetSession.request.getMethod(),
        path: packetSession.request.getUrl().path,
        headers: packetSession.request.getHeaders()
      });
      
      proxyRequest.on('response', (proxyResponse) => {
        packetSession.response.setHeaders(proxyResponse.headers);
        
        proxyResponse.on('data', (chunk) => {
          packetSession.response.pushBody(chunk);
        });
        
        proxyResponse.on('end', () => {
          if (self._onS2CCb !== undefined)
            self._onS2CCb(packetSession);
            
          response.writeHead(proxyResponse.statusCode, packetSession.response.getHeaders());
          response.end(packetSession.response.getBody());
        });
      });
      
      proxyRequest.end(packetSession.request.getBody(), 'binary');
    });
  }

  // Event setters
  onC2S(callback) { this._onC2SCb = callback; }
  onS2C(callback) { this._onS2CCb = callback; }
}

module.exports = HttpMitm;