(function(window){
    var doc = window.document,
    body = doc.body,
    extend = function(define, source) {
        for (var property in source) define[property] = source[property];
        return define;
    },
    on = function(element, type, handler) {
        element.addEventListener ? element.addEventListener(type, handler, false) : element.attachEvent("on" + type, handler);
    };
    //色板
    var configColor = '#000000 #000000 #003300 #006600 #009900 #00cc00 #00ff00 #330000 #333300 #336600 #339900 #33cc00 #33ff00 #660000 #663300 #666600 #669900 #66cc00 #66ff00 #333333 #000033 #003333 #006633 #009933 #00cc33 #00ff33 #330033 #333333 #336633 #339933 #33cc33 #33ff33 #660033 #663333 #666633 #669933 #66cc33 #66ff33 #666666 #000066 #003366 #006666 #009966 #00cc66 #00ff66 #330066 #333366 #336666 #339966 #33cc66 #33ff66 #660066 #663366 #666666 #669966 #66cc66 #66ff66 #999999 #000099 #003399 #006699 #009999 #00cc99 #00ff99 #330099 #333399 #336699 #339999 #33cc99 #33ff99 #660099 #663399 #666699 #669999 #66cc99 #66ff99 #cccccc #0000cc #0033cc #0066cc #0099cc #00cccc #00ffcc #3300cc #3333cc #3366cc #3399cc #33cccc #33ffcc #6600cc #6633cc #6666cc #6699cc #66cccc #66ffcc #ffffff #0000ff #0033ff #0066ff #0099ff #00ccff #00ffff #3300ff #3333ff #3366ff #3399ff #33ccff #33ffff #6600ff #6633ff #6666ff #6699ff #66ccff #66ffff #ff0000 #990000 #993300 #996600 #999900 #99cc00 #99ff00 #cc0000 #cc3300 #cc6600 #cc9900 #cccc00 #ccff00 #ff0000 #ff3300 #ff6600 #ff9900 #ffcc00 #ffff00 #00ff00 #990033 #993333 #996633 #999933 #99cc33 #99ff33 #cc0033 #cc3333 #cc6633 #cc9933 #cccc33 #ccff33 #ff0033 #ff3333 #ff6633 #ff9933 #ffcc33 #ffff33 #0000ff #990066 #993366 #996666 #999966 #99cc66 #99ff66 #cc0066 #cc3366 #cc6666 #cc9966 #cccc66 #ccff66 #ff0066 #ff3366 #ff6666 #ff9966 #ffcc66 #ffff66 #ffff00 #990099 #993399 #996699 #999999 #99cc99 #99ff99 #cc0099 #cc3399 #cc6699 #cc9999 #cccc99 #ccff99 #ff0099 #ff3399 #ff6699 #ff9999 #ffcc99 #ffff99 #00ffff #9900cc #9933cc #9966cc #9999cc #99cccc #99ffcc #cc00cc #cc33cc #cc66cc #cc99cc #cccccc #ccffcc #ff00cc #ff33cc #ff66cc #ff99cc #ffcccc #ffffcc #ff00ff #9900ff #9933ff #9966ff #9999ff #99ccff #99ffff #cc00ff #cc33ff #cc66ff #cc99ff #ccccff #ccffff #ff00ff #ff33ff #ff66ff #ff99ff #ffccff #ffffff';
    //默认参数
    var defaultConfig = {
        class: 'color-picker',
        callback: function(){}
    };
    /**
     * @Class ColorPicker
     * @param target
     * @param opts
     * @constructor
     */
    var ColorPicker = function(target, opts){
        this.target = target;
        this.class = opts.class;
        this.callback = opts.callback;

        this.cp = null;

        this.init();
    };
    ColorPicker.prototype = {
        /**
         * 初始化
         */
        init: function(){
            var self = this;
            self.creatMask();
            self.createColorPicker();
            self.bindEvent();
        },
        /**
         * 事件绑定
         */
        bindEvent: function(){
            var self = this;
            on(self.target, 'click', function(){
                var pos = self.getObjPos(this);
                self.styleChange(self.cp, {
                    'display': 'block',
                    'left': pos.x,
                    'top': pos.y
                });
                self.styleChange(self.mask, {
                    'display': 'block'
                });
            });
            on(self.cp.getElementsByTagName('ul')[0], 'click', function(ev){
                ev = ev || window.event;
                var oTarget = ev.target || ev.srcElement;
                oTarget.parentNode.tagName.toUpperCase() === "LI" && (oTarget = oTarget.parentNode);
                if(oTarget.tagName.toUpperCase() === "LI") {
                    var color = oTarget.getAttribute('data-color');
                    self.callback.call(self, color);
                }
                self.closeColorPicker();
            });
            on(self.mask, 'click', function(){
                self.closeColorPicker();
            });
        },
        getObjPos: function(el){
            var doc_w = body.clientWidth
            , doc_h = body.clientHeight
            , pane_top = el.offsetTop
            , pane_left = el.offsetLeft
            , obj_w = el.offsetWidth
            , obj_h = el.offsetHeight;

            var top = ((pane_top + obj_h) > doc_h) ? pane_top : pane_top + obj_h,
                left = (pane_left  > doc_w) ? pane_left-obj_w : pane_left;

            return {
                x: left,
                y: top
            }
        },
        closeColorPicker: function(){
            var self = this;
            self.styleChange(self.cp);
            self.styleChange(self.mask);
        },
        styleChange: function(el, css){
            var defCss = {
                'display': 'none',
                'left': 0,
                'top': 0,
                'zIndex': 0
            };
            css = extend(defCss, css);
            css.zIndex = css.display === "block" ? 1000 : 0;
            el.style.cssText += 'display:'+ css.display +';position: absolute;left:'+ css.left +'px;' + 'top:'+ css.top +'px;z-index:'+css.zIndex;
        },
        /**
         * 模板
         */
        html: function(lists){
          var html = '<ul>' +
                  '<% for(var i = 0; i < lists.length; i++){ %>'+
                    '<li data-color="<%= lists[i] %>" style="background-color: <%= lists[i] %>"></li>'+
                  '<% } %>'+
                  '</ul>';
            var res = NTpl.tpl(html, {
                'lists': lists
            });
            return res;
        },
        /**
         * 色板初始化
         */
        createColorPicker: function(){
            var self = this;
            if(self.cp){
                return;
            }
            self.cp = doc.createElement('div');
            self.cp.className = self.class;
            var color = configColor.split(' '),
                html = self.html(color);
            self.cp.innerHTML = html;
            body.appendChild(self.cp);
        },
        creatMask: function(){
            var self = this,
                doc_w=document.body.clientWidth,
                doc_h=document.body.clientHeight;
            self.mask = document.createElement('div');
            self.mask.style.cssText += 'width:'+doc_w + "px;height:"+doc_h+"px;";
            self.styleChange(self.mask);
            body.appendChild(self.mask);
        }
    };
    window.colorPicker = function(target, opts){
        opts = extend(defaultConfig, opts);
        new ColorPicker(target, opts);
    }
}(this));
