/**
 * dp
 *
 * Version 0.1.4
 *
 * Created by shanglt on 2018/05/21.
 */
!(function (window, document) {

    /**
     * ispring 的HTML页面宽度和高度如果超过了原始的宽度和高度，布局上会存在问题，
     * 通过代码：
     * */
    var PC = function () {

        var ifr = document.getElementById('ifr');

        var img = document.getElementById('picture1');

        var wb = document.getElementById('whiteBoard');
        var wbContext = wb.getContext('2d');
        this.showImageType = 'complete';
        // if(Utils.getTerminalType() ==='ios'){
        //     ifr.setAttribute('sandbox','allow-scripts');
        // }
        this.ifr = ifr;
        this.img = img;
        this.wb = wb;
        this.wbContext = wbContext;

        this.displayMode = new DisplayMode();
        // this.db = new DrawingBoard();

        // 当前翻页数据，默认没有翻页数据
        this.current = {
            docId: 'nodoc',
            docName: '暂无文档',
            docTotalPage: 0,
            width: '200',
            height: '200',
            pageTitle: '暂无文档',
            pageNum: 0,
            url: '',
            mode: 0,
            time: 0
        };

        (function (p) {
            // p.img.onload = function () {
            //     this.style.visibility = '';
            // };

            p.ifr.onload = function () {
                // console.log('dp iframe is onload ' + this.src);

                if (!this.src) {
                    return;
                }

                var width = this.style.width.replace('px', '');
                var height = this.style.height.replace('px', '');

                setTimeout(function () {
                    Utils.pmToIfr({
                        action: 'resize',
                        width: width,
                        height: height
                    });
                }, 50);

            };
        })(this);
    };

    PC.prototype.showDefaultPageChange = function () {
        // 画板展示的宽和高
        var dpDisplayedWidth = window.innerWidth;
        var dpDisplayedHeight = window.innerHeight;

        var pc = this;
        pc.ifr.style.display = 'none';
        pc.wb.style.display = 'none';
        pc.isDefaultImage = true;
        var img = pc.img;

        img.style.display = 'block';
        img.style.marginLeft = '';
        img.style.marginTop = '';

        // 默认部署宽高与实际宽高一致
        var displayedWidth = 100;
        var displayedHeight = 120;

        img.style.marginLeft = ((dpDisplayedWidth - displayedWidth) / 2) + 'px';
        img.style.marginTop = ((dpDisplayedHeight - displayedHeight) / 2) + 'px';
        img.style.width = displayedWidth + 'px';
        img.style.height = displayedHeight + 'px';

        img.src = '//image.csslcloud.net/dp/d.png';


    };

    PC.prototype.animationCallback = function (data) {

        var currentPageChange = this.current;

        if (currentPageChange.isAnimationFastestMode) {
            if (currentPageChange.pageNum == data.currentSlideIndex && data.currentStepIndex == 0) {
                this.ifr.style.visibility = '';
                this.current.isReadyTriggerAnimation = true;
            }
        } else if (currentPageChange.isAnimationSlowMode) {
            this.ifr.style.visibility = '';
            this.current.isReadyTriggerAnimation = true;
        }
        //console.log('文档加载完成');
        this.current.triggerAnimationStep = data.currentStep;
    };

    /**
     * 触发动画
     *
     * */
    PC.prototype.animation = function (a) {
        if (this.current.isReadyTriggerAnimation) {
            Utils.pmToIfr({
                action: 'animation_change',
                step: a.step
            });
        } else {
            (function (p, a) {
                setTimeout(function () {
                    p.animation(a);
                }, 300);
            })(this, a);
        }
    };

    /**
     * resize
     *
     * */
    PC.prototype.resize = function () {
        var d = this.current;

        if (this.current.isAnimation) {
            var dpDisplayedWidth = window.innerWidth;
            var dpDisplayedHeight = window.innerHeight;

            // 文档实际的宽和高
            var practicalWidth = d.width;
            var practicalHeight = d.height;

            // 垂直方向优先
            var isVerticalDisplayedPriority = (dpDisplayedWidth / dpDisplayedHeight) > (practicalWidth / practicalHeight);

            var pc = this;
            pc.img.style.display = 'none';
            pc.wb.style.display = 'none';

            var ifr = pc.ifr;
            ifr.style.display = 'block';
            ifr.style.marginTop = '';
            ifr.style.marginLeft = '';

            // 默认部署宽高与实际宽高一致
            var displayedWidth = practicalWidth;
            var displayedHeight = practicalHeight;
            var displayedMarginTop = 0;
            var displayedMarginLeft = 0;

            if (pc.displayMode.isSuitableForWidth) {
                displayedWidth = dpDisplayedWidth;
                displayedHeight = dpDisplayedWidth * practicalHeight / practicalWidth;

                if (pc.displayMode.isVerticalCenter && displayedHeight < dpDisplayedHeight) {
                    displayedMarginTop = (dpDisplayedHeight - displayedHeight) / 2;
                }
            } else if (pc.displayMode.isSuitableForWindow) {
                if (isVerticalDisplayedPriority) {
                    displayedHeight = dpDisplayedHeight;
                    displayedWidth = dpDisplayedHeight * practicalWidth / practicalHeight;

                    displayedMarginLeft = (dpDisplayedWidth - displayedWidth) / 2;
                } else {
                    displayedWidth = dpDisplayedWidth;
                    displayedHeight = dpDisplayedWidth * practicalHeight / practicalWidth;

                    displayedMarginTop = (dpDisplayedHeight - displayedHeight) / 2;
                }
            }

            ifr.style.width = displayedWidth + 'px';
            ifr.style.height = displayedHeight + 'px';
            if (displayedMarginTop > 0) {
                ifr.style.marginTop = displayedMarginTop + 'px';
            }
            if (displayedMarginLeft > 0) {
                ifr.style.marginLeft = displayedMarginLeft + 'px';
            }

            pc.db.reset(ifr);

            setTimeout(function () {
                Utils.pmToIfr({
                    action: 'resize',
                    width: ifr.style.width.replace('px', ''),
                    height: ifr.style.height.replace('px', '')
                });
            }, 30);
        } else if (this.current.isJpg) {

            // 画板展示的宽和高
            var dpDisplayedWidth = window.innerWidth;
            var dpDisplayedHeight = window.innerHeight;

            // 文档实际的宽和高
            var practicalWidth = d.width;
            var practicalHeight = d.height;

            // 垂直方向优先
            var isVerticalDisplayedPriority = (dpDisplayedWidth / dpDisplayedHeight) > (practicalWidth / practicalHeight);

            var pc = this;
            pc.ifr.style.display = 'none';
            pc.wb.style.display = 'none';

            var img = pc.img;

            img.style.display = 'block';
            img.style.marginLeft = '';
            img.style.marginTop = '';

            // 默认部署宽高与实际宽高一致
            var displayedWidth = practicalWidth;
            var displayedHeight = practicalHeight;

            if (pc.displayMode.isSuitableForWidth) {
                displayedWidth = dpDisplayedWidth;
                displayedHeight = dpDisplayedWidth * practicalHeight / practicalWidth;

                if (pc.displayMode.isVerticalCenter && displayedHeight < dpDisplayedHeight) {
                    img.style.marginTop = ((dpDisplayedHeight - displayedHeight) / 2) + 'px';
                }
            } else if (pc.displayMode.isSuitableForWindow) {
                if (isVerticalDisplayedPriority) {
                    displayedHeight = dpDisplayedHeight;
                    displayedWidth = dpDisplayedHeight * practicalWidth / practicalHeight;

                    img.style.marginLeft = ((dpDisplayedWidth - displayedWidth) / 2) + 'px';
                } else {
                    displayedWidth = dpDisplayedWidth;
                    displayedHeight = dpDisplayedWidth * practicalHeight / practicalWidth;

                    img.style.marginTop = ((dpDisplayedHeight - displayedHeight) / 2) + 'px';
                }
            }

            img.style.width = displayedWidth + 'px';
            img.style.height = displayedHeight + 'px';

            this.db.reset(img);
        } else if (this.current.isWhiteBorad) {
            // 画板展示的宽和高
            var dpDisplayedWidth = window.innerWidth;
            var dpDisplayedHeight = window.innerHeight;

            // 文档实际的宽和高
            var practicalWidth = d.width;
            var practicalHeight = d.height;

            // 垂直方向优先
            var isVerticalDisplayedPriority = (dpDisplayedWidth / dpDisplayedHeight) > (practicalWidth / practicalHeight);

            var pc = this;
            pc.ifr.style.display = 'none';
            pc.img.style.display = 'none';

            var wb = pc.wb;
            wb.style.display = 'block';
            wb.style.marginLeft = '';
            wb.style.marginTop = '';

            // 默认部署宽高与实际宽高一致
            var displayedWidth = practicalWidth;
            var displayedHeight = practicalHeight;
            if (pc.displayMode.isSuitableForWidth) {
                displayedWidth = dpDisplayedWidth;
                displayedHeight = dpDisplayedWidth * practicalHeight / practicalWidth;

                if (pc.displayMode.isVerticalCenter && displayedHeight < dpDisplayedHeight) {
                    wb.style.marginTop = ((dpDisplayedHeight - displayedHeight) / 2) + 'px';
                }
            } else if (pc.displayMode.isSuitableForWindow) {
                if (isVerticalDisplayedPriority) {
                    displayedHeight = dpDisplayedHeight;
                    displayedWidth = dpDisplayedHeight * practicalWidth / practicalHeight;

                    wb.style.marginLeft = ((dpDisplayedWidth - displayedWidth) / 2) + 'px';
                } else {
                    displayedWidth = dpDisplayedWidth;
                    displayedHeight = dpDisplayedWidth * practicalHeight / practicalWidth;

                    wb.style.marginTop = ((dpDisplayedHeight - displayedHeight) / 2) + 'px';
                }
            }

            wb.style.width = displayedWidth + 'px';
            wb.style.height = displayedHeight + 'px';

            wb.width = displayedWidth * 2;
            wb.height = displayedHeight * 2;

            pc.wbContext.globalAlpha = 1;
            pc.wbContext.fillStyle = "#FFF";
            pc.wbContext.fillRect(0, 0, wb.width , wb.height);

            pc.db.reset(wb);
        } else if (this.isDefaultImage) {
            this.showDefaultPageChange();
        }

        dp.db.resetDrawCurrentPage();
    };

    //翻页完成后的回调
    var lastPageDoc = "";
    PC.prototype.showAnimationPage = function (v) {
        //console.log('当前翻的页码是-->'+v.currentSlideIndex);
        this.ifr.style.visibility = '';
        var w=this.ifr.style.width;
        var h = this.ifr.style.height;
        if(this.current.isAnimationSlowMode){
            //console.log("非极速动画翻页");
            if(typeof window.dpAnimateLoadComplete === 'function'){
                //console.log("222dp IOS 文档加载完成回调");
                window.dpAnimateLoadComplete(parseInt(w.toString().replace("px","")),parseInt(h.toString().replace("px","")));
            }
            if( window.android && typeof window.android.dpAnimateLoadComplete === 'function'){
                //console.log("222dp ANDROID 文档加载完成回调");
                window.android.dpAnimateLoadComplete(parseInt(w.toString().replace("px","")),parseInt(h.toString().replace("px","")));
            }
        }else{
            if(lastPageDoc === this.current.docId ||this.current.pageNum !=v.currentSlideIndex){
                return;
            }
            lastPageDoc = this.current.docId;
           // console.log("极速动画翻页");
            if(typeof window.dpAnimateLoadComplete === 'function'){//提供给ios回调
                //console.log("111dp IOS 文档加载完成回调");
                window.dpAnimateLoadComplete(parseInt(w.toString().replace("px","")),parseInt(h.toString().replace("px","")));
            }
            if( window.android && typeof window.android.dpAnimateLoadComplete === 'function'){//提供给android的回调
                //console.log("111dp ANDROID 文档加载完成回调");
                window.android.dpAnimateLoadComplete(parseInt(w.toString().replace("px","")),parseInt(h.toString().replace("px","")));
            }
        }
    };
    /**
     * 显示白板
     * */
    PC.prototype.showWhiteBorad = function (d) {
        // 画板展示的宽和高
        var dpDisplayedWidth = window.innerWidth;
        var dpDisplayedHeight = window.innerHeight;

        // 文档实际的宽和高
        var practicalWidth = d.width;
        var practicalHeight = d.height;

        // 垂直方向优先
        var isVerticalDisplayedPriority = (dpDisplayedWidth / dpDisplayedHeight) > (practicalWidth / practicalHeight);

        var pc = this;
        pc.ifr.style.display = 'none';
        pc.img.style.display = 'none';

        var wb = pc.wb;
        wb.style.display = 'block';
        wb.style.marginLeft = '';
        wb.style.marginTop = '';

        // 默认部署宽高与实际宽高一致
        var displayedWidth = practicalWidth;
        var displayedHeight = practicalHeight;
        if (pc.displayMode.isSuitableForWidth) {
            displayedWidth = dpDisplayedWidth;
            displayedHeight = dpDisplayedWidth * practicalHeight / practicalWidth;

            if (pc.displayMode.isVerticalCenter && displayedHeight < dpDisplayedHeight) {
                wb.style.marginTop = ((dpDisplayedHeight - displayedHeight) / 2) + 'px';
            }
        } else if (pc.displayMode.isSuitableForWindow) {
            if (isVerticalDisplayedPriority) {
                displayedHeight = dpDisplayedHeight;
                displayedWidth = dpDisplayedHeight * practicalWidth / practicalHeight;

                wb.style.marginLeft = ((dpDisplayedWidth - displayedWidth) / 2) + 'px';
            } else {
                displayedWidth = dpDisplayedWidth;
                displayedHeight = dpDisplayedWidth * practicalHeight / practicalWidth;

                wb.style.marginTop = ((dpDisplayedHeight - displayedHeight) / 2) + 'px';
            }
        }

        wb.style.width = displayedWidth + 'px';
        wb.style.height = displayedHeight + 'px';

        wb.width = displayedWidth * 2;
        wb.height = displayedHeight * 2;

        pc.wbContext.globalAlpha = 1;
        pc.wbContext.fillStyle = "#FFF";
        pc.wbContext.fillRect(0, 0, wb.width, wb.height);

        pc.db.reset(wb);
    };


    PC.prototype.showJPG = function (d) {
        // 画板展示的宽和高
        var dpDisplayedWidth = window.innerWidth;
        var dpDisplayedHeight = window.innerHeight;

        if (d.width <= 0 || d.height <= 0 || (typeof d.width == 'undefined') || (typeof d.height == 'undefined')) {
            (function (pageChange, t) {
                var img = new Image;
                img.src = pageChange.url;
                img.onload = function () {
                    var imgRo = this.width / this.height;
                    var w = this.width;
                    var h = this.height;
                    if (this.width > dpDisplayedWidth) {
                        w = dpDisplayedWidth;
                        h = w / imgRo;
                    }
                    pageChange.width = w;
                    pageChange.height = h;

                    if (pageChange.key == t.current.key) {
                        t.showJPG(pageChange);
                    }
                };
            })(d, this);
            return;
        }

        // 文档实际的宽和高
        var practicalWidth = d.width;
        var practicalHeight = d.height;

        // 垂直方向优先
        var isVerticalDisplayedPriority = (dpDisplayedWidth / dpDisplayedHeight) > (practicalWidth / practicalHeight);

        var pc = this;
        pc.ifr.style.display = 'none';
        pc.wb.style.display = 'none';

        var img = pc.img;
        img.style.display = 'block';



        // img.style.visibility = 'hidden';

        // https://blog.csdn.net/xiaozaq/article/details/50536671

        img.style.marginLeft = '';
        img.style.marginTop = '';

        // 默认部署宽高与实际宽高一致
        var displayedWidth = practicalWidth;
        var displayedHeight = practicalHeight;

        if (pc.displayMode.isSuitableForWidth) {
            displayedWidth = dpDisplayedWidth;
            displayedHeight = dpDisplayedWidth * practicalHeight / practicalWidth;

            if (pc.displayMode.isVerticalCenter && displayedHeight < dpDisplayedHeight) {
                img.style.marginTop = ((dpDisplayedHeight - displayedHeight) / 2) + 'px';
            }
        } else if (pc.displayMode.isSuitableForWindow) {
            if (isVerticalDisplayedPriority) {
                displayedHeight = dpDisplayedHeight;
                displayedWidth = dpDisplayedHeight * practicalWidth / practicalHeight;

                img.style.marginLeft = ((dpDisplayedWidth - displayedWidth) / 2) + 'px';
            } else {
                displayedWidth = dpDisplayedWidth;
                displayedHeight = dpDisplayedWidth * practicalHeight / practicalWidth;
                img.style.marginTop = ((dpDisplayedHeight - displayedHeight) / 2) + 'px';
            }
        }
        if(this.showImageType === "complete"){//当图片加载完成后显示的 图片显示模式，默认是不需要加载完成就显示默认值是normal
            img.style.opacity = "0";
        }
        img.onload = function () {
            //console.log('图片加载完成');
            img.style.opacity = "1";
            if(typeof window.dpImageLoadComplete === 'function'){
                window.dpImageLoadComplete(displayedWidth,displayedHeight);
            }
            if(window.client && typeof  window.client.dpLoadComplete === 'function'){
                window.client.dpLoadComplete();
            }
            if( window.android && typeof window.android.dpImageLoadComplete === 'function'){
                window.android.dpImageLoadComplete(displayedWidth,displayedHeight);//android回调方法
            }
            pc.db.resetDrawCurrentPage();

        };
        img.style.width = displayedWidth + 'px';
        img.style.height = displayedHeight + 'px';
        img.src = pc.current.completeURI;

        this.db.reset(img);
    };


    PC.prototype.showAnimation = function (d) {
        // 画板展示的宽和高
        var dpDisplayedWidth = window.innerWidth;
        var dpDisplayedHeight = window.innerHeight;

        // 文档实际的宽和高
        var practicalWidth = d.width;
        var practicalHeight = d.height;

        // 垂直方向优先
        var isVerticalDisplayedPriority = (dpDisplayedWidth / dpDisplayedHeight) > (practicalWidth / practicalHeight);

        var pc = this;
        pc.img.style.display = 'none';
        pc.wb.style.display = 'none';

        var ifr = pc.ifr;
        ifr.style.display = 'block';
        if (d.isAnimationFastestMode) {
            ifr.style.visibility = 'hidden';
        }

        ifr.style.marginTop = '';
        ifr.style.marginLeft = '';

        // 默认部署宽高与实际宽高一致
        var displayedWidth = practicalWidth;
        var displayedHeight = practicalHeight;
        var displayedMarginTop = 0;
        var displayedMarginLeft = 0;

        if (pc.displayMode.isSuitableForWidth) {
            displayedWidth = dpDisplayedWidth;
            displayedHeight = dpDisplayedWidth * practicalHeight / practicalWidth;

            if (pc.displayMode.isVerticalCenter && displayedHeight < dpDisplayedHeight) {
                displayedMarginTop = ((dpDisplayedHeight - displayedHeight) / 2) + 'px';
            }
        } else if (pc.displayMode.isSuitableForWindow) {
            if (isVerticalDisplayedPriority) {
                displayedHeight = dpDisplayedHeight;
                displayedWidth = dpDisplayedHeight * practicalWidth / practicalHeight;
                displayedMarginLeft = (dpDisplayedWidth - displayedWidth) / 2;
            } else {
                displayedWidth = dpDisplayedWidth;
                displayedHeight = dpDisplayedWidth * practicalHeight / practicalWidth;
                displayedMarginTop = (dpDisplayedHeight - displayedHeight) / 2;
            }
        }

        ifr.style.width = displayedWidth + 'px';
        ifr.style.height = displayedHeight + 'px';
        if (displayedMarginTop > 0) {
            ifr.style.marginTop = displayedMarginTop + 'px';
        }
        if (displayedMarginLeft > 0) {
            ifr.style.marginLeft = displayedMarginLeft + 'px';
        }

        pc.db.reset(ifr);

        var u = pc.current.completeURI;

        var us = u.split('?');
        var ifs = ifr.src.split('?');
        //极速动画
        if (u && d.mode == 2 && ifs[0] === us[0]) {
            Utils.pmToIfr({
                action: 'page_change',
                pagenum: d.pageNum
            });
            this.current.isReadyTriggerAnimation = true;//解决从图片切换至当前动画页时切换下个动画无效。
            ifr.style.visibility = '';
        } else if (u && d.mode == 1 && u == ifr.src) {
                Utils.pmToIfr({
                    action: 'animation_change',
                    step: 0
                });
            this.current.isReadyTriggerAnimation = true;//解决从图片切换至当前动画页时切换下个动画无效。
        } else {
            ifr.setAttribute('src', u);
        }
    };
    //设置文档样式
    PC.prototype.setDocCss = function (d) {
        var style = document.createElement('style');
        style.type = 'text/css';
        var text = '#dp{'+d+'}';
        style.innerHTML = text;
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(style);

    };

    PC.prototype.pageChange = function (d) {
        this.current = d;
        this.isLoaded = false;
        if (d.isWhiteBorad) {
            this.showWhiteBorad(d);
        } else if (d.isJpg) {
            this.showJPG(d);
        } else if (d.isAnimation) {
            this.showAnimation(d);
        }

        this.db.resetDrawCurrentPage();
    };

    PC.prototype.clear = function () {
        this.ifr.style.display = 'none';
        this.img.style.display = 'none';
        this.wb.style.display = 'none';
    };

    // 实例化画板对象
    window.PC = PC;

})(window, document, undefined);
