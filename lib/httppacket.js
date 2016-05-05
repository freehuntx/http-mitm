const URL = require('url');

class HttpPacket {
  constructor(options = {}) {
    this._url = options.url || {};
    this._method = options.method;
    this._headers = options.headers || {};
    this._body = options.body || new Buffer([]);
  }
  
  setUrl(url) {
    if(typeof(url) == 'string')
      this._url = URL.parse(url);
    else
      this._url = url;
  }
  getUrl() { return this._url; }
  
  setMethod(method) { this._method = method; }
  getMethod() { return this._method; }
  
  setHeaders(headers) { this._headers = headers; }
  getHeaders() { return this._headers; }
  setHeader(name, value) { this._headers[name] = value; }
  getHeader(name) { return this._headers[name]; }
  
  pushBody(chunk) {
    this._body = Buffer.concat([this._body, chunk]);
    this._fixContentSize();
  }
  setBody(body) { 
    this._body = new Buffer(body);
    this._fixContentSize();
  }
  getBody() { return this._body; }
  
  // Private
  _fixContentSize() {
    this._headers['content-size'] = this._body.length;
  }
}

module.exports = HttpPacket;