const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id: "AbKl4EXOQss0y-n_Wxf6RVJSdW1wXlyHHzWeV2AI-lZ-Jl5QGaHtcGomRi7_KFCIhyq9jY0qD7S1Z-MN",
  client_secret: "EHlEDIQw5XPop2b3oTHb3wfzfF5vixJcPXHaGFYnqWqaFif2Mj0YNYVis_5cq97cBprd7rt6-70kBK9e",
});

module.exports = paypal;