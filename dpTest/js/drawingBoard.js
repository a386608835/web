!(function ($, window, document) {

    var Utils = {

        // 如果参数为string，转换为json
        toJson: function (j) {
            if (typeof j === "string") {
                j = JSON.parse(j);
            }
            return j;
        }

    };

    window.dpc = new Dpc();


    function debug(msg) {
        return;
        console.error('DB', msg);
    }


    $.extend({
        DrawingBoard: {
            config: function () {
                debug('config');
            },

            redraw: function () {
                debug('redraw');
            },

            /**
             * 更新幻灯片的宽度和高度
             *
             * @param width
             * @param height
             * */
            resizePresentation: function (width, height) {
                debug('resizePresentation');
            },

            /**
             * 获取直播画板历史元数据
             *
             * @param meta
             * */
            history: function (meta) {
                debug('history');

                var draw = meta.draw || [];

                var pageChange = meta.pageChange || [];
                pageChange.sort(function (p1, p2) {
                    return parseInt(p1.time) - parseInt(p2.time);
                });

                var currentpctime = 0;
                var pc = pageChange.pop();
                if (pc) {
                    currentpctime = pc.time;

                    dpc.pageChange(pc);
                }

                var animation = meta.animation || [];
                animation.sort(function (p1, p2) {
                    return parseInt(p1.time) - parseInt(p2.time);
                });

                var an = animation.pop();
                if (an && an.time >= currentpctime) {

                    dpc.animationChange(an);
                }
            },

            db: function (data) {
                data = Utils.toJson(data);

                var action = data.action;

                if (action === 'page_change') {
                    dpc.pageChange(data);
                } else if (action === 'draw') {
                    debug('draw'); // TODO
                } else if (action === 'animation_change') {
                    dpc.animationChange(data);
                }
            },

            clearAll: function () {
                debug('clearAll');
            },

            clear: function () {
                debug('clear');
            },

            setupInterval: function () {
                debug('setupInterval');
            },

            clearTimer: function () {
                debug('clearTimer');
            }
        }
    });

})(jQuery, window, document, undefined);