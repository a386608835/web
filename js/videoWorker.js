

self.addEventListener("message",function (e) {

  var info = e.data;
  var type = info?info.action:""
  var url = info.url;
  self.window = info.w
  importScripts("hls.js");
  // var el = info.el;
  switch (type) {
    case "playVideo":
        appendHls();
        break;
  }
  function appendHls() {

    if(Hls.isSupported()){
      console.log("添加hls")
      var hls = new Hls;
      // hls.attachMedia(el)
      // hls.on(Hls.Events.MEDIA_ATTACHED,function () {
      //   hls.loadSource(url);
      // })
      self.postMessage("message",{action:"video",obj:hls,t:Hls.Events.MEDIA_ATTACHED})
    }

  }
})