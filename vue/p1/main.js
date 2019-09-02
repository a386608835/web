
var obj={s:"当前是动态创建的东西"};

var vue= new Vue({
    el:"#app",
    template:"<p>不知道说什么{{s}}</p>",
    data:obj
})
console.log("v->"+JSON.stringify(vue.$data));
//https://view.csslcloud.net/api/viw/index?roomid=".$this->cc_roomid."&userid=74DF2CB27CEB4EF6&autoLogin=true&viewername=".$this->nickname."&viewertoken=".$crs_cc_roompsd