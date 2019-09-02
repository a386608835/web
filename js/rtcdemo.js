import AgoraRTC from 'agora-rtc-sdk'
(function () {

  var client = AgoraRTC.createClient({mode:"live",codec:"h264"});
  client.init("3f9f66a0b1294cbeaac13856cb4e8c5b",function () {
    console.log("AgoraRTC client initialized");

  }, function (err) {
    console.log("AgoraRTC client init failed", err);
  })
  client.join(null,"nnn",null,function () {

  })

})()