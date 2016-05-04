const URL = require('url');
var http = require('http');

class HttpMitm {
  constructor() {
    var self = this;

    this._server = http.createServer((request, response) => {
      var sendChunks = [];

      request.addListener('data', (chunk) => {
        sendChunks.push(chunk);
      });

      request.addListener('end', () => {
        var sendHeader = request.headers,
          sendData = Buffer.concat(sendChunks);

        if(self._onC2SCb !== undefined) {
          var data = {
            path: URL.parse(request.url).path,
            header: sendHeader,
            data: sendData
          };

          self._onC2SCb(data);

          sendHeader = data.header;
          sendData = data.data;
          sendHeader['content-length'] = sendData.length;
        }

        var proxyReq = http.request({
          hostname: sendHeader['host'],
          post: 80,
          method: request.method,
          path: URL.parse(request.url).path,
          headers: sendHeader
        });

        proxyReq.addListener('response', (proxyRes) => {
          var recvChunks = [];

          proxyRes.addListener('data', (chunk) => {
            recvChunks.push(chunk);
          });

          proxyRes.addListener('end', () => {
            var recvHeader = proxyRes.headers,
                recvData = Buffer.concat(recvChunks);

            if(self._onS2CCb !== undefined) {
              // Call the eventListener
              var data = {
                path: URL.parse(request.url).path,
                header: recvHeader,
                data: recvData
              };

              self._onS2CCb(data);

              recvHeader = data.header;
              recvData = data.data;
              recvHeader['content-length'] = recvData.length;
            }

            response.writeHead(proxyRes.statusCode, recvHeader);
            response.end(recvData, 'binary');
          });
        });

        proxyReq.end(sendData, 'binary');
      });
    });
  }

  listen(port) {
    this._server.listen(port);
  }

  // Event setters
  onC2S(callback) { this._onC2SCb = callback; }
  onS2C(callback) { this._onS2CCb = callback; }
}

module.exports = HttpMitm;