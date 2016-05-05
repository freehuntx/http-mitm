Example:
```
var HttpMitm = require('http-mitm');
var mitm = new HttpMitm();

mitm.onC2S((packetSession) => {
});

mitm.onS2C((packetSession) => {
});

mitm.listen(8080);
```

packetSession type:
- request | response
  - getUrl()
  - setMethod(method: string)
  - getMethod()
  - setHeaders(headers: object)
  - getHeaders()
  - setHeader(name: string, value: any)
  - getHeader(name: string)
  - pushBody(chunk: Buffer)
  - setBody(body: Buffer)
  - getBody()