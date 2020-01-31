/**
 * websocket快速封装，
 * 低依赖，使用简单
 * Spring_WebSocket v1.1.0
 * date 2020-01-30 
 * by springbless
 */

'use strict';
;!function(win){
	win = win || window;
	/**
     * [Spring_WebSocket description]
     * @param {[type]} values [description]
     */
    const Spring_WebSocket = function(values){
        this.args = values;
        if(typeof this.args !== "object"){
            this.log("参数不正确");
            return;
        }
        let that = this;
        let iziToastUrl = {
                css: `plugin/iziToast/css/iziToast.min.css`,
                js: `plugin/iziToast/js/iziToast.min.js`
            };
        let tipOption = {
        	showTip: true,
        	maxSize: 10,
        	customTip: {
		        title: 'OK',
		        message: 'Successfully inserted record!',
		        position: 'topRight',
		        transitionIn: 'bounceInLeft',
		        timeout: 10,
		        onOpen: function(){
		            that.log('callback abriu! success');
		        },
		        onClose: function(){
		            that.log("callback fechou! success");
		        }
		    }
	    };
	    let iziToastDom = {
	    	_link: function(href){
	    		let dom = document.createElement('link');
	    		dom.rel = "stylesheet";
	    		dom.type = "text/css";
	    		dom.href = href;
	    		return dom;
	    	},
	    	_script: function(src){
	    		let dom = document.createElement('script');
	    		dom.type = "text/javascript";
	    		dom.src = src;
	    		return dom;
	    	}
	    };
	    //处理iziToast插件路径
	    if(!this.args.iziToastUrl){
	    	this.args.iziToastUrl = iziToastUrl;
	    }
    	document.head.appendChild(iziToastDom._link(this.args.iziToastUrl.css));
    	document.head.appendChild(iziToastDom._script(this.args.iziToastUrl.js));

	    //处理iziToast弹窗参数 
	    if(this.args.tip){
	    	this.forEach(this.args.tip, function(value, prop, collection){
	    		//this.log(value, prop, collection);
	    		tipOption[prop] = value;
	    	}, this);
	    	//this.log(this.args);
	    }
	    this.args.tip = this.tipOption = tipOption;
        this.init();
    };
    window.Spring_WebSocket = Spring_WebSocket;

    /**
     * iziToast 提示消息
     * @param  {[type]} data 
     * @param  {[type]} data [json格式的数据 ， 如： {title: '标题', message: '消息', image: 'url'}, image可选]
     * @return {[type]} Spring_WebSocket  [返回当前实例]
     */
    Spring_WebSocket.prototype.showTip = function(showType, data){
    	if(!data)return;
    	if(this.tipOption.showTip){
    		showType = showType || 'info';
    		let option = {};
    		this.forEach(this.tipOption.customTip, function(value, prop, collection){
    			option[prop] = value;
    		}, this);
    		// 设置数据
    		this.forEach(data, function(value, prop, collection){
    			value = value || "";
    			option[prop] = value.length > this.tipOption.maxSize ? value.substr(0,this.tipOption.maxSize) + "..." : value + this.createNbsp(this.tipOption.maxSize - value.length);
    		}, this);
    		switch(showType){
    			case 'info':
    				iziToast.info(option);
    				break;
    			case 'success':
    				iziToast.success(option);
    				break;
    			case 'warning':
    				iziToast.warning(option);
    				break;
    			case 'error':
    				iziToast.error(option);
    				break;
    		}
    	}
    	return this;
    };

    /**
     * log日志
     * @param  {[type]} msg [日志消息]
     * @return {[type]} Spring_WebSocket  [返回当前实例]
     */
    Spring_WebSocket.prototype.log = function(...msg) {
        if(typeof this.args !== "object" || (this.args && this.args.log)){
            window.console.log(msg);
        }
        return this;
    };

    /**
     * debug日志
     * @param  {[type]} msg [日志消息]
     * @return {[type]} Spring_WebSocket  [返回当前实例]
     */
    Spring_WebSocket.prototype.debug = function(...msg) {
        if(typeof this.args !== "object" || (this.args && this.args.log)){
            window.console.debug(msg);
        }
        return this;
    };

    /**
     * 初始化函数
     * @return {[type]} Spring_WebSocket  [返回当前实例]
     */
    Spring_WebSocket.prototype.init = function(){
        if(typeof(WebSocket) == "undefined") {
            this.log("您的浏览器不支持WebSocket");
        }else{
            this.log("您的浏览器支持WebSocket");
            //this.listeners()
            //实例化websocket
            this.flush();
        }
        return this;
    };

    /**
     * 刷新资源
     * @return {[type]} Spring_WebSocket  [返回当前实例]
     */
    Spring_WebSocket.prototype.flush = function(){
        let that = this;
        this.close();
        this.socket = new WebSocket(this.args.url);
        // 双向绑定
        this.socket.Spring_WebSocket = this;
        // 打开事件 //获得消息事件 //关闭事件 //发生了错误事件
        this.listeners(this.socket, "open", this.args.open)
        .listeners(this.socket, "message", this.args.message)
        .listeners(this.socket, "close", this.args.close)
        .listeners(this.socket, "error", this.args.error)
            .listeners(window, 'beforeunload',function () {
                that.close();
            });
        return this;
    };

    /**
     * 消息发送
     * @param  {[type]} msg [消息]
     * @return {[type]} Spring_WebSocket  [返回当前实例]
     */
    Spring_WebSocket.prototype.send = function(msg){
        if(typeof WebSocket === "undefined"){
            this.log("您的浏览器不支持WebSocket");
        }else{
            if(this.socket){
                //发送消息前置通知
                this.args && this.args.beforeSend && this.args.beforeSend.call(this, msg);
                this.socket.send(msg);
                //发送消息后置通知
                this.args && this.args.afterSend && this.args.afterSend.call(this, msg);
            }
        }
        return this;
    };

    /**
     * 关闭websocket
     * @return {[type]} Spring_WebSocket  [返回当前实例]
     */
    Spring_WebSocket.prototype.close = function(){
        if(this.socket){
            this.socket.close();
        }
        return this;
    };

    /**
     * 生成指定个数的空白字符
     * @param  {[type]} size [字符个数]
     * @return {[type]}      [返回字符]
     */
    Spring_WebSocket.prototype.createNbsp = function(size = 0){
    	let nbsp = "";
    	size = size * 3;
    	while(size >= 0){
    		size--;
    		nbsp += "&nbsp;";
    	}
    	this.log("生成字符个数：", nbsp.length);
    	return nbsp;
    }

    /**
     * 事件监听
     * @param  {[type]}   element  [目标元素]
     * @param  {[type]}   type     [监听动作]
     * @param  {Function} callback [回调函数]
     * @return {[type]}   Spring_WebSocket  [返回当前实例]
     */
    Spring_WebSocket.prototype.listeners = function(element, type, callback){
        //this.log(element.addEventListener);
        if(element.addEventListener){
            element.addEventListener(type, callback, false);
        }else if(element.attachEvent){
            element.attachEvent('on' + type, callback);
        }else {
            element['on' + type] = callback;
        };
        return this;
    };

	/**
	 * 一个简单的forEach()实现，用于数组、对象和节点
	 * @private
	 * @param {Array|Object|NodeList} collection    要迭代的项的集合
	 * @param {Function} callback                   每个迭代的回调函数
	 * @param {Array|Object|NodeList} scope         对象/节点列表/数组，forEach正在遍历(又名“this”)
	 * @return {[type]}                             Spring_WebSocket  [返回当前实例]
	 */
    Spring_WebSocket.prototype.forEach = function (collection, callback, scope) {
    	scope = scope || window;
		if(Object.prototype.toString.call(collection) === '[object Object]') {
			for (let prop in collection) {
				if(Object.prototype.hasOwnProperty.call(collection, prop)) {
					callback.call(scope, collection[prop], prop, collection);
				}
			}
		} else {
			if(collection){
				for (let i = 0, len = collection.length; i < len; i++) {
					callback.call(scope, collection[i], i, collection);
				}
			}
		}
		return this;
	};
}(window);