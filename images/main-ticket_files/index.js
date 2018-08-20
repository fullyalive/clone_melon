
// require 초기설정
require.config({
    baseUrl: 'js',
    paths: {
    		// jQuery
	        jQuery: 'jquery-1.11.3',
	        // 모델 구현체
	        Model: 'model/melon.model',
//	        mstApp: 'common/app'
    }
    ,
    //urlArgs: "t=" + (new Date()).getTime()
//	urlArgs: "t=" + '201611110000'
//	urlArgs: "t=" + '201707131400'
//    urlArgs: "t=" + '201804031530' //2018-04-03 모바일 댓글 : TopList체크 추가로 버전
    urlArgs: "t=" + '201807172500'	//TODO 배포할 날자로 변경
});
 


var isMobile = {
	Android: function() {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function() {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function() {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function() {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function() {
		return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
	},
	any: function() {
		return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
	}
};

var map_redirect = [{'req': 'home.index', 'redirect': 'http://ticket.melon.com/main/index.htm', 'param': ''}
	,{'req': 'ticketopen.index','redirect': 'http://ticket.melon.com/csoon/index.htm', 'param': ''}
	,{'req': 'performance.index', 'redirect': 'http://ticket.melon.com/performance/index.htm?prodId=_prodId_', 'param': 'prodId'}//_prodId_ 와 같이 작성한다.
	,{'req': 'event.index', 'redirect': 'http://ticket.melon.com/event/index.htm', 'param': ''}
	,{'req': 'plan.index', 'redirect': 'http://ticket.melon.com/plan/index.htm?planId=_planId_', 'param': 'planId'}
	,{'req': 'ticketopen.detail', 'redirect': 'http://ticket.melon.com/csoon/detail.htm?csoonId=_csoonId_', 'param': 'csoonId'}];

// Default 페이지 이동
$(document).ready(function(){

	//pc web agent
	if(!isMobile.Android() && !isMobile.iOS()) {
		var req_hash = location.hash;
		var redirect = '';

		if(req_hash === ''){
			//if(location.href === 'http://m.ticket.melon.com/'){
				location.href = 'http://ticket.melon.com/';
				return;
			//}
		}else {
			$.each(map_redirect, function (_i, _o) {
				if (req_hash.indexOf(_o.req) > -1) {
					redirect = _o.redirect;
					var p = _o.param;
					if (p !== '') {
						var params = getParams();
						if (params && params.hasOwnProperty(p)) {
							redirect = redirect.replace('_'+p+'_', params[p]);
						}
					}
					return false;
				}
			});
		}

		if (redirect !== '') {
			location.href = redirect;
			return;
		}
	}

	//mobile initialization
	content._init("config/config.js");

	//setTimeout(function() {
		//console.log('index.js loaded');
		// Hash 정보 확인

		var _hash = location.hash.split("#"), _hashConfiged = false, _target = '', _params = null;

		if (1 < _hash.length) {
			_target = _hash[1];
			_target = _target.split('?');

			if (1 < _target.length) {
				_params = _target[1];
				_target = _target[0];
			}
			else {
				_target = _target[0];
			}
		}

		for (var key in map_config) {
			if (_target == map_config[key]["alias"]) {
				_hashConfiged = true;

				if (null !== _params) {
					var _params = _params.split('&'), _jsonParam = {};

					for (var i in _params) {
						var _pair = _params[i].split('=');

						_jsonParam[_pair[0]] = _pair[1];
					}

					ActionHandler._setData(_target, _jsonParam);

					if (null === content.loadedPage) {
						// 이동 전 fix 클래스 제거
						$('body').removeClass('fix fix_menu');

						content._procHashData(_target);
					}
				}
				break;
			}
		}

		//QQQ
		bWait = false;
		//console.log('triggering');
		//console.log('hashconfiged:'+_hashConfiged+" _target:" +_target);

		if (!_hashConfiged || _target === 'index') {
		//if (!_hashConfiged) {
			content.load('home.index');
		}
	//},10);

});
