var HttpMitm = require('../');

var mitm = new HttpMitm();

mitm.onC2S((data) => {
  console.log(data.path);
});

mitm.onS2C((data) => {
  console.log(data.path);
});

mitm.listen(8080);