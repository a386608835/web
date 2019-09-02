/**
 * PC端直播间页面common.js
 *
 * */
if(!window.Lr) {
    var Lr = {
        errorNotInstallFlash0: '您还没有安装flash播放器,请点击',
        errorNotInstallFlash1: '这里',
        errorNotInstallFlash2: '安装'
    };
}

!(function ($, window, document) {
    // 没有Flash插件，增加提示样式
    var FlashTip = {
        show: function () {
            var tip = '<div class="flashtip"><p>' + Lr.errorNotInstallFlash0
                + '<a href="http://www.adobe.com/go/getflash" target="_blank">' + Lr.errorNotInstallFlash1
                + '</a>' + Lr.errorNotInstallFlash2 + '</p></div>';
            $("#callbackPlayer, #livePlayer, #drawPanel, #playbackPanel, #playbackPlayer, #swfId").append(tip);
        },

        checkFlash: function () {
            var isIE = (navigator.appVersion.indexOf("MSIE") >= 0);
            var hasFlash = true;

            if (isIE) {
                try {
                    var objFlash = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                } catch (e) {
                    hasFlash = false;
                }
            } else {
                if (!navigator.plugins["Shockwave Flash"]) {
                    hasFlash = false;
                }
            }
            return hasFlash;
        },

        init: function () {
            if (!FlashTip.checkFlash()) {
                if(typeof defultVideoSize =='function'){
                    window.defultVideoSize();
                }
                FlashTip.show();
            }
        }
    };


    $(function () {
        FlashTip.init();
    });
})(jQuery, window, document, undefined);