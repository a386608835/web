
addEventListener("message",function (e) {
  fetch("http://view.csslcloud.net/api/vod/v2/play/h5?userid=4E4064DCDE2BD0B8&recordid=239E8AE2242A0A50")
    .then((res)=>{
      return res.json();
    }).then((d)=>{
    postMessage({action:"request",data:d})
  }).catch((e)=>{
    postMessage({action:"error"});
  })
  navigator.geolocation.getCurrentPosition(geoSuccess,geoError);
  function geoSuccess(e){

    postMessage({action:"position",coordsX:e.coords.latitude,coordsY:e.coords.longitude})
  }
  function geoError(e){

    postMessage({action:"error"})
  }
})
