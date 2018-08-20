
var _isAndroid = (/android/gi).test(navigator.appVersion),
	_isIDevice = (/iphone|ipad/gi).test(navigator.appVersion),
	_isPlaybook = (/playbook/gi).test(navigator.appVersion),
	_isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),
	_isIE       = (/MSIE/gi).test(navigator.appVersion),
	_isChrome   = (/Chrome/gi).test(navigator.appVersion),
	_isMobileWeb = (_isAndroid || _isIDevice || _isPlaybook || _isTouchPad);
 

 (function($) {

	$.fn._touchLongClickObject = null,
	$.fn._touchObject = null,
	$.fn._touchTimeObject = null,
	$.fn._touchTimeEventObject = null,
	$.fn._timeObj = null,

	$.fn._start = function(e){

		clearInterval($.fn._touchLongClickObject);
		var rtpress = false;

		if(_isAndroid || _isIDevice){

			var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];

			if(e.originalEvent.touches.length > 1){
				clearInterval($.fn._touchLongClickObject);
				rtpress = true;
			}

			if(e.originalEvent.changedTouches.length > 1){
				clearInterval($.fn._touchLongClickObject);
				rtpress = true;
			}

			e.currentTarget.component.prevX = touch.pageX;
			e.currentTarget.component.prevY =touch.pageY;

		}else{
			e.currentTarget.component.prevX = e.pageX;
			e.currentTarget.component.prevY = e.pageY;
		}

		if(!e.currentTarget.component.touchHandler){

			if(e.currentTarget.component.onPressStyle != null){
				e.currentTarget.className = e.currentTarget.className + " " + e.currentTarget.component.onPressStyle;
			}

			e.currentTarget.component.touchHandler = true;
			this.component.moveTimePrev = new Date();

			$.fn._touchTimeEventObject = e.currentTarget.component;

			if(e.currentTarget.component.longClick && !rtpress){
				var that = e.currentTarget.component;
				that.eventHandler(e);

				$.fn._touchLongClickObject  = setInterval(function(e){
					that.eventHandler(e);
				},that.longCallBackTime);
			}else{

				$.fn._touchTimeObject = setTimeout(function(e){
					$.fn._touchTimeEventObject.className =$.fn._touchTimeEventObject.defaultStyle;
					$.fn._touchTimeEventObject.touchHandler = false;
					clearInterval($.fn._touchLongClickObject);
				},e.currentTarget.component.moveTime);
			}
		}
	};

	$.fn._move = function(e){

		var X,Y;

		if(_isAndroid || _isIDevice){

			var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
			X = touch.pageX;
			Y =touch.pageY;

		}else{

			X = e.pageX;
			Y = e.pageY;

		}

		if(e.currentTarget.component.touchHandler){


			if(eval(X - e.currentTarget.component.prevX) > e.currentTarget.component.moveDistance ||
				eval(X - e.currentTarget.component.prevX) < -e.currentTarget.component.moveDistance ||
				eval(Y - e.currentTarget.component.prevY) > e.currentTarget.component.moveDistance ||
				eval(Y - e.currentTarget.component.prevY) < -e.currentTarget.component.moveDistance){     

				
				e.currentTarget.className = e.currentTarget.component.defaultStyle;
				e.currentTarget.component.touchHandler = false;

				if(e.currentTarget.component.longClick){
					clearInterval($.fn._touchLongClickObject);
				}
			}

			if(!e.currentTarget.component.longClick){
				if(((new Date()) - e.currentTarget.component.moveTimePrev) > e.currentTarget.component.moveTime){

					e.currentTarget.className = e.currentTarget.component.defaultStyle;
					e.currentTarget.component.touchHandler = false;

				}else{

					e.currentTarget.component.moveTimePrev = new Date();
				}
			}

		}
	};

	$.fn._end = function(e){

		if(e.currentTarget.component.touchHandler){
			
			if(e.currentTarget.component.onPressStyle != null){
				e.currentTarget.className = e.currentTarget.component.defaultStyle;
			}

			if(!e.currentTarget.component.longClick){
				if(e.currentTarget.component.eventHandler != null){
					e.currentTarget.component.eventHandler(e);
				}
			}else{
				clearInterval(e.currentTarget.component.longObj);
				clearInterval($.fn._touchLongClickObject);
			}

			$.fn._touchObject = e.currentTarget.component;
			setTimeout(function(){
				$.fn._touchObject.touchHandler = false;clearInterval($.fn._touchLongClickObject);
			},10);
		}
	};

	$.fn.touch = function(handler,classname) {

		$(this).each(function(){

			this.component = this;
			this.component.moveDistance = 18;
			this.component.moveTime = 300;
			this.component.moveTimePrev = null;
			this.component.eventHandler = handler;
			this.component.touchHandler = false;
			this.component.eventFlag = true;
			this.component.defaultStyle = this.className;
			this.component.onPressStyle = classname;
			this.component.longClick = false;
			this.component.longObj = null;
		});

		if(_isAndroid || _isIDevice){
			$(this).unbind('touchstart');
			$(this).unbind('touchmove');
			$(this).unbind('touchend');
			$(this).bind('touchstart', $.fn._start);
			$(this).bind('touchmove', $.fn._move);
			$(this).bind('touchend', $.fn._end);
		}else{
			$(this).unbind('mousedown');
			$(this).unbind('mousemove');
			$(this).unbind('mouseup');
			$(this).bind('mousedown', $.fn._start);
			$(this).bind('mousemove', $.fn._move);
			$(this).bind('mouseup', $.fn._end);
		}

		return this;
	};

	$.fn.longtouch = function(handler,classname,options) {

		$(this).each(function(){

			if(options != undefined){
				pollingTime = options["time"];
			}else{
				pollingTime = 100;
			}

			this.component = this;
			this.component.moveDistance = 6;
			this.component.moveTime = pollingTime;
			this.component.moveTimePrev = null;
			this.component.eventHandler = handler;
			this.component.touchHandler = false;
			this.component.eventFlag = true;
			this.component.defaultStyle = this.className;
			this.component.onPressStyle = classname;
			this.component.longClick = true;
			this.component.longObj = null;
			this.component.longCallBackTime = pollingTime;

		});

		if(_isAndroid || _isIDevice){
			$(this).unbind('touchstart');
			$(this).unbind('touchmove');
			$(this).unbind('touchend');
			$(this).bind('touchstart', $.fn._start);
			$(this).bind('touchmove', $.fn._move);
			$(this).bind('touchend', $.fn._end);
		}else{
			$(this).unbind('mousedown');
			$(this).unbind('mousemove');
			$(this).unbind('mouseup');
			$(this).bind('mousedown', $.fn._start);
			$(this).bind('mousemove', $.fn._move);
			$(this).bind('mouseup', $.fn._end);
		}

		return this;
	};

 })(jQuery);
