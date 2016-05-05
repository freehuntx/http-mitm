var HttpMitm = require('../');
var mitm = new HttpMitm();

mitm.onC2S((packetSession) => {
  console.log(packetSession);
});

mitm.onS2C((packetSession) => {
  console.log(packetSession);
});

mitm.listen(8080);