/**
 * Image 생성객체
 */
define([], function() {
	
	var TicketImage = function() {
		var _this = this;
		this.data = {};
			// _this = [];
		
		
		this.setSrc = function(pSrc) {
			_this.data['src'] = pSrc;
		}
		
		this.setAlt = function(pAlt) {
			_this.data['alt'] = pAlt;
		}
		
		this.setStyle = function(pStyle) {
			_this.data['style'] = pStyle;
		}
		
		this.setWidth = function(pWidth) {
			_this.data['width'] = pWidth;
		}

		this.setHeight = function(pHeight) {
			_this.data['height'] = pHeight;
		}
		
		this.setClass = function(pClass) {
			_this.data['class'] = pClass;
		}
		
		this.onError = function(pCallback) {
			_this.data['onerror'] = pCallback;
		}
		
		this.getSrc = function() {
			return _this.data['src'];
		}
		
		this.toString = function() {
			var _imgTag = [];
			
			_imgTag.push('<img');
			
			for(var i in _this.data) {
					_imgTag.push(i +'="'+ _this.data[i] +'"');
			}
			
			_imgTag.push('/>');
			
			return _imgTag.join(' ');
		}
	}
	
	TicketImage.prototype.constructor = TicketImage;
	return TicketImage;
});