/**
 * DPC
 *
 * Version 0.0.1
 *
 * Created by shanglt on 2018/05/21.
 */
!(function (window, document) {

    var Utils = {

        // 如果参数为string，转换为json
        toJson: function (j) {
            if (typeof j === "string") {
                j = JSON.parse(j);
            }
            return j;
        }

    };

    var opts = {
        dpc: {
            id: 'dpa'
        },

        displayMode: 0
    };


    var Dpc = function (socket) {

        var df = document.getElementById(opts.dpc.id);

        if (!df) {
            throw new Error('iframe element is not exists');
        }

        this.df = df;


        (function (d, s) {

            setInterval(function () {
                d.df.style.width = d.df.parentElement.style.width;
                d.df.style.height = d.df.parentElement.style.height;

                if (!d.df.contentWindow) {
                    d.df = document.getElementById(opts.dpc.id);

                    d.df.onload = function () {
                        if (!this.src) {
                            return;
                        }

                        // 重新加载
                        if (d.isLoaded) {
                            d.reload();
                        } else {
                            d.isLoaded = true;
                            d.pmBuffers();
                        }
                    };
                }
            }, 50);
            d.df.contentWindow.onbeforeunload = function () {
                console.log('UNLOAD.');
            };

            d.df.onload = function () {
                console.log('ONLOAD.');

                if (!this.src) {
                    return;
                }

                // 重新加载
                if (d.isLoaded) {
                    d.reload();
                } else {
                    d.isLoaded = true;
                    d.pmBuffers();
                }
            };

            if (s) {
                // 画板文档翻页
                s.on('page_change', function (data) {
                    d.pageChange(data);
                });

                // 动画翻页
                s.on('animation_change', function (data) {
                    d.animationChange(data);
                });
            }

        })(this, socket);

        this.df.src = 'https://image.csslcloud.net/dp/dp.html?displayMode=' + opts.displayMode;

        this.isLoaded = false;

        this.buffers = [];

        this.reload = function () {
            if (!this.latestPageChange) {
                return;
            }

            this.pageChange(this.latestPageChange);

            if (!this.latestAnimationChange) {
                return
            }

            this.animationChange(this.latestAnimationChange);
        };

        this.pmBuffers = function () {
            var bs = this.buffers;
            if (!bs.length) {
                return;
            }

            for (var i = 0; i < bs.length; i++) {
                this.pm(bs[i]);
            }

            this.buffers = [];
        };

        /**
         * 通过postMessage将翻页等数据告知给dp页面，兼容低版本IE，内容必须转换为字符串
         *
         * */
        this.pm = function (data) {
            if (!this.isLoaded) {
                return this.buffers.push(data);
            }

            // debug('pm ' + data);

            if (typeof data != 'string') {
                data = JSON.stringify(data);
            }

            if (this.df && this.df.contentWindow) {
                this.df.contentWindow.postMessage(data, '*');
            } else {
                console.error('dpc', 'df is null');
            }
        };

        this.latestPageChange = null;
        this.latestAnimationChange = null;

        this.pageChange = function (data) {
            var page_change = {
                from_socket: {
                    "action": "page_change",
                    "time": 0,
                    "value": {
                        "docid": "77FAF14FB73732809C33DC5901307461",
                        "fileName": "Java核心技术+卷1：基础知识.pdf",
                        "height": 1800,
                        "page": 1,
                        "pageTitle": "",
                        "totalPage": 105,
                        "url": "http://image.csslcloud.net/image/CFEF49CF1DE9CA019C33DC5901307461/77FAF14FB73732809C33DC5901307461/1.jpg",
                        "useSDK": false,
                        "width": 1408
                    }
                },

                from_histroy: {
                    "time": 1,
                    "url": "http://image.csslcloud.net/image/CFEF49CF1DE9CA019C33DC5901307461/77FAF14FB73732809C33DC5901307461/1.jpg",
                    "docId": "77FAF14FB73732809C33DC5901307461",
                    "docName": "Java核心技术+卷1：基础知识.pdf",
                    "docTotalPage": 105,
                    "pageNum": 1,
                    "encryptDocId": "77FAF14FB73732809C33DC5901307461",
                    "useSDK": false,
                    "width": 1408,
                    "height": 1800,
                    "pageTitle": ""
                }
            };

            data = Utils.toJson(data);

            this.latestPageChange = data;
            this.latestAnimationChange = null;

            var pc = {};
            if (data.action === 'page_change') {
                pc.docId = data.value.docid;
                pc.docName = data.value.fileName;
                pc.docTotalPage = data.value.totalPage;
                pc.width = data.value.width;
                pc.height = data.value.height;
                pc.useSDK = data.value.useSDK;
                pc.pageTitle = data.value.pageTitle;
                pc.pageNum = data.value.page;
                pc.url = data.value.url;
                pc.mode = data.value.mode;
                pc.time = data.time;

            } else {
                pc.docId = data.docId;
                pc.docName = data.docName;
                pc.docTotalPage = data.docTotalPage;
                pc.width = data.width;
                pc.height = data.height;
                pc.useSDK = data.useSDK;
                pc.pageTitle = data.pageTitle;
                pc.pageNum = data.pageNum;
                pc.url = data.url;
                pc.time = data.time;
                pc.mode = data.mode;
            }

            // TODO 测试
            if (pc.docName.indexOf('_fast_') > -1) {
                pc.mode = 1;
            }

            this.pm({
                action: 'page_change_from_dpc',
                value: pc
            });
        };

        this.animationChange = function (data) {
            var animation_change = {
                from_socket: {
                    "action": "animation_change",
                    "time": 0,
                    "value": {
                        "docid": "B6512034034633E59C33DC5901307461",
                        "page": 1,
                        "step": 1
                    }
                },

                from_histroy: {
                    "time": 10671,
                    "docTotalPage": 0,
                    "pageNum": 1,
                    "encryptDocId": "B6512034034633E59C33DC5901307461",
                    "step": 1
                }
            };

            data = Utils.toJson(data);

            this.latestAnimationChange = data;

            var ac = {};
            if (data.action === 'animation_change') {
                ac.docId = data.value.docid;
                ac.pageNum = data.value.page;
                ac.step = data.value.step;
                ac.time = data.time;
            } else {
                ac.docId = data.docId;
                ac.pageNum = data.pageNum;
                ac.step = data.step;
                ac.time = data.time;
            }

            this.pm({
                action: 'animation_change_from_dpc',
                value: ac
            });
        };

    };

    window.Dpc = Dpc;

})(window, document, undefined);