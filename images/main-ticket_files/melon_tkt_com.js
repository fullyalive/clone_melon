/** 티켓 모바일 공통 함수 */
/** 멜론 티켓 공통코드 시작 */
/** POC 구분코드 */
var POC_ID = "";

var POC_ID_ARY = ["AS47","IS47","AX25","IX25"];

/** 안드로이드 버전 */
var ANDROID_VERSION = "0";

/** 일반예매 */
var SALE_TYPE_CODE_ST1 = 'ST0001';
/** 선예매 */
var SALE_TYPE_CODE_ST2 = 'ST0002';
/** 추첨식 */
var SALE_TYPE_CODE_ST3 = 'ST0003';

/** 공연상태 - 판매준비 */
var STATE_FLG_01 = 'SS0100';
/** 공연상태 - 판매가능 */
var STATE_FLG_02 = 'SS0200';
/** 공연상태 - 매진 */
var STATE_FLG_03 = 'SS0300';
/** 공연상태 - 공연취소 */
var STATE_FLG_04 = 'SS0400';
/** 공연상태 - 판매중지 */
var STATE_FLG_05 = 'SS0500';
/** 공연상태 - 공연완료 */
var STATE_FLG_06 = 'SS0600';

/** 상품구분 - 일반상품 */
var PROD_TYPE_CODE_TKT = 'PT0001';
/** 상품구분 - 상시상품 */
var PROD_TYPE_CODE_TKA = 'PT0002';
/** 상품구분 - 패키지상품 */
var PROD_TYPE_CODE_PKG = 'PT0003';

/** 공연 유형 - 콘서트 */
var PERF_TYPE_CODE_CON = 'GN0001';
/** 공연 유형 - 뮤지컬 */
var PERF_TYPE_CODE_MUC = 'GN0002';
/** 공연 유형 - 클래식 */
var PERF_TYPE_CODE_CLS = 'GN0003';
/** 공연 유형 - 연극 */
var PERF_TYPE_CODE_PLY = 'GN0004';
/** 공연 유형 - 스포츠 */
var PERF_TYPE_CODE_SPO = 'GN0005';
/** 공연 유형 - 전시 */
var PERF_TYPE_CODE_DSP = 'GN0006';
/** 공연 유형 - 기타 */
var PERF_TYPE_CODE_ETC = 'GN0009';

/** 뱃지구분 - 없음 */
var ICON_CODE_NONE = 'SI0001';
/** 뱃지구분 - 단독판매 */
var ICON_CODE_ONLY = 'SI0002';
/** 뱃지구분 - 좌석우위 */
var ICON_CODE_SEAT = 'SI0003';

/** 등급구분 - 19세이상 */
var GRADE_CODE_19 = 'GR0023';

/** 미디어 타입 코드 - 비디오 */
var MEDIA_TYPE_VIDEO = 'MG0003';
/** 미디어 타입 코드 - 음악 */
var MEDIA_TYPE_SONG = 'MG0004';
/** 멜론 티켓 공통코드 종료 */

/** 이벤트 유형코드 - 응모형 */
var EVENT_TYPE_CODE_L = 'L';	// ET0001
/** 이벤트 유형코드 - 리뷰형 */
var EVENT_TYPE_CODE_R = 'R';	// ET0002
/** 이벤트 유형코드 - 기대평형 */
var EVENT_TYPE_CODE_G = 'G';	// ET0003
/** 이벤트 유형코드 - 공지형 */
var EVENT_TYPE_CODE_N = 'N';	// ET0004
/** 이벤트 유형코드 - 상시할인혜택관리 */
var EVENT_TYPE_CODE_S = 'S';	// ET0005
/** 이벤트 유형코드 - 프로모션형 */
var EVENT_TYPE_CODE_P = 'P';	// ET0006
/** 이벤트 유형코드 - 컨텐츠선택설문형 */
var EVENT_TYPE_CODE_V = 'ET0007';

/** POC 코드 */
var POC_TYPE_CODE_MOBILE = 'SC0003'

/* netfunnel 관련 변수 정의*/
var nf_action_id = "reservation";      // netfunnel action id
var nf_title = ''; // netfunnel perf title
var nf_step  = 1;        // ticketing step: step01 - step02 - step03

var nf_action_id_cs = "customer";      // netfunnel action id 1:1문의 block

var nf_action_id_m = 'Mreservation';
var nf_action_id_Mmypayment = 'Mmypayment';
var nf_action_id_Mpayment = 'Mpayment';
var nf_action_id_mypayment = 'mypayment';
var nf_action_id_payment = 'payment';

/* forU 설정 default값, DB에서 retrieving 실패시 사용.*/
var enableForU = 'Y';
var enableForU_backup = 'Y'; //service info api에서 온 값을 저장한다.

// 실명인증 스텝 진행 후 설정할 실명인증 여부값
var checkAuthValue = 'N';
// 성인인증 스텝 진행 수 설정할 성인인증 여부값
var checkAdultValue = 'N';
// 인증 URL -> 인증체크 실패시 리턴되어 옴
var authCheckUrl = '';
var viewType = '';
var authErrCode  = '';
function resetAuth(){
	checkAuthValue = 'N';
	checkAdultValue = 'N';
	authCheckUrl = '';
	viewType = '';
	authErrCode  = '';
}
var detailTabScroll = null;

/**
 * 최초 서비스인포 가져오기
 */
$(function(){
	var _curr_href = location.href;
	//SPA 상에서만 작동하도록 한다.
	if(_curr_href.indexOf('/public/index.html') > -1){
		$.ajax("http://tktapi.melon.com/poc/system/serviceInfo.json?v=1").done(function (d) {
			if (d.result == 0) {
				enableForU_backup = d.fu;
			} else {
				enableForU_backup = 'Y'; //default Y
			}
		});

		enableForU_backup = enableForU_backup === undefined ? 'Y' : enableForU_backup;
	}
});
/**
 * 푸터영역 출력
 */
var drawFooter = function() {
	POC_ID = getPocId();
	var _url1 = "http://info.melon.com/terms/web/terms1_1.html?cpId="+POC_ID;	// 멜론 이용약관
	var _url2 = "http://info.melon.com/terms/web/terms3.html?cpId="+POC_ID;	// 개인정보취급방침
	var _url3 = "http://info.melon.com/terms/web/terms5_1.html?cpId="+POC_ID;	// 청소년보호정책
	var _url4 = "http://www.ftc.go.kr/info/bizinfo/communicationView.jsp?apv_perm_no=2011322016230202008&area1=&area2=&currpage=2&searchKey=01&searchVal=%EB%A1%9C%EC%97%94&stdate=&endate="; // 사업자정보확인
				
	var _ds = [], _tgtDom = $('#drawFooter');
	_ds.push('<div id="footer" style="display:none;">');
	_ds.push('<div class="link">');
	_ds.push('<a href="#" tUrl="'+ _url1 +'" target="_blank" >멜론이용약관</a>');
	_ds.push('<a href="#action" data-action-type="popup" data-target="/common/pop_ticket_policy.html">멜론티켓이용약관</a>');
	_ds.push('<a href="#action" data-action-type="popup" data-target="/common/pop_financial_policy.html">전자금융거래약관</a>');
	_ds.push('<a href="#" tUrl="'+ _url2 +'" target="_blank">개인정보처리방침</a>');
	_ds.push('<a href="#" tUrl="'+ _url3 +'" target="_blank">청소년보호정책</a>');
	_ds.push('<a href="#action" data-action-type="link" data-target="customer.index">고객센터</a>');
//	_ds.push('<a href="#action" data-action-type="link" data-target="customer.qna">고객센터</a>');
	_ds.push('</div>');
	_ds.push('<div class="footer_info">');
	_ds.push('	<strong>(주)카카오엠</strong><span class="bar">|</span>');
	_ds.push('	<address>서울강남구 테헤란로 103길 17 정석빌딩</address>');
	_ds.push('	<br>대표이사 이제욱<span class="bar">|</span>사업자등록번호 : 138-81-05876<br />통신판매업 신고번호 : 제2011-서울강남-02008호 <a href="#" id="corpInfo">사업자정보확인</a><br />문의전화(평일/주말 09:00-18:00) : 1899-0042 (유료)<br />호스팅제공자 : (주) 카카오엠');
	_ds.push('</div>');
	_ds.push('<p class="footer_service"><a href="#action" data-action-type="popup" data-target="/common/pop_guarantee.html">하나은행 구매안전서비스</a></p>');
	_ds.push('<div class="copyright">Kakao M Corp. All rights reserved.</div>');
//	_ds.push('<div class="copyright">&copy; Kakao M Corp. All rights reserved.</div>');
//	_ds.push('<div class="footer_info"><address>서울강남구 테헤란로 103길 17 정석빌딩</address><span class="bar">|</span>대표이사 이제욱<br />사업자등록번호 : 138-81-05876<br />통신판매업 신고번호 : 제2011-서울강남-02008로 사업자정보확인<br />문의전화 : 1899-0042 (평일/주말 09:00-18:00)</div>');
//	_ds.push('<p class="footer_service"><a href="#action" data-action-type="popup" data-target="/common/pop_guarantee.html" >하나은행 구매안전서비스</a></p>');
//	_ds.push('<div class="copyright">ⓒ Kakao M Corp. All rights reserved.</div>');
	_ds.push('</div>');
	_ds.push('<div id="fixed_bottom">');
	_ds.push('<div class="box_fix_btn btn_fix_refresh">');
	_ds.push('<a href="#btnRefresh" class="btn_fix" style="display:none;"><span class="ico">새로고침</span></a>');
	_ds.push('</div>');
	_ds.push('<div class="box_fix_btn btn_fix_top">');
	_ds.push('<a href="#btnTop" class="btn_fix" style="display:none;"><span class="ico">위로</span></a>');
	_ds.push('</div>');

	_ds.push('<div id="buttonArea"></div>');

	//앱인 경우에만 하단의 GNB 노출
	if(mstApp.isApp())
	{
	    //회사정보 + GNB 노출
	    if(arguments.length == 0 && 'Y' !== _tgtDom.attr('data-non-footer'))
	    {
	    	var _home = 'ico_fmenu ico_fmenu1', _forU = 'ico_fmenu ico_fmenu2', _search = 'ico_fmenu ico_fmenu3', _ticket = 'ico_fmenu ico_fmenu4';

	    	if( location.hash.match(/home.index/) ) {
	    		_home += ' on';
	    	}
	    	if( location.hash.match(/foru./) ) {
	    		_forU += ' on';
	    	}
			if( location.hash.match(/search.index/) ) {
				_search += ' on';
			}
	    	if( location.hash.match(/ticket.index/) ) {
	    		_ticket += ' on';
	    	}

	    	//
	    	 _ds.push('<ul class="footer_menu">');
	    	 _ds.push('<li><a href="/public/index.html#home.index" class="' + _home + '">홈</a></li>');
			 _ds.push('<li><a href="/public/index.html#foru.perform.index" class="' + _forU + '" id="gnbForuBtn">For U</a></li>');
	         _ds.push('<li><a href="/public/index.html#search.index" class="' + _search + '">검색</a></li>');
	         //_ds.push('<li><a href="/public/index.html#ticket.index" class="' + _ticket + '">마이티켓</a></li>');
	         _ds.push('<li><a href="#homeTicket" class="' + _ticket + '">마이티켓</a></li>');
	         _ds.push('</ul>');
	    	//
	    	/*
        	_ds.push('<ul class="footer_menu">');
        	_ds.push('<li><a href="#action" data-action-type="link" data-target="home.index" class="' + _home + '">홈</a></li>');
        	_ds.push('<li><a href="#action" data-action-type="link"data-target="foru.perform.index" class="' + _forU + '">For U</a></li>'); // onclick="checkFlow(event, this);"
        	_ds.push('<li><a href="#action" data-action-type="link" data-target="search.index" class="' + _search + '">공연검색</a></li>');
        	_ds.push('<li><a href="#action" data-action-type="link" data-target="ticket.index" data-check-login= "Y" class="' + _ticket + '">마이티켓</a></li>');
        	_ds.push('</ul>');
	    	 */
	    }
	    //회사정보만 노출
	    else if(arguments.length == 1 && arguments[0] == 'hide_gnb')
	    {
	        console.log("hide gnb");
	    }
	}
	else
	{
	    $("#wrap").css("padding-bottom","0px");
	}
	_ds.push('</div>');

	// 로그인 여부 체크하여 등급쿠키 작성
	if (isMelonLogin() && "" === getCookie("MTK_GRD")) {

	}

	//console.log('poc:' + getPocId());

	// Poc코드 존재하지 않을경우 세팅
	//POC_ID = getCookie("POC_ID");
	POC_ID = getPocId();
	setCookie("TKT_POC_ID", POC_ID, 10, "/", ".melon.com");

	if($.inArray(POC_ID, POC_ID_ARY) < 0 || "" === POC_ID || "undefined" === typeof POC_ID){
		ActionHandler.apis['system.getInfo'].execute({
			callback: function(d) {

				POC_ID = d.data.pocId;
				setCookie("TKT_POC_ID", POC_ID, 10, "/", ".melon.com");

				// 안드로이드 모바일 웹일 경우 버전정보 설정
				if ('AX25' === d.data.pocId) {
					ANDROID_VERSION = d.data.osVersion;
				}
			}
		});
	}

	var _tgtFooter = _tgtDom.parents('#wrap');

	_ds = $(_ds.join(''));

	// 이전버튼 핸들링
	//_ds.find('a[href=#btnPrev]').on('click', function(e) {
	//	e.preventDefault();
    //
	//	window.history.back();
	//});

	//var aLink = _ds.find('a[target=_blank]');
//	_ds.on('click', 'a[target=_blank]', function(e) {
//		var _this = $(this);
//		var _url = _this.attr('href');
//		window.open(_this.attr('href').replace('http','https'));
//	});


	// 탑 이동버튼 핸들링
	_ds.find('a[href=#btnTop]').on('click', function(e) {
		e.preventDefault();

		window.scrollTo(0, 0);
	});

	// 탑 이동버튼 핸들링
	var _hash = window.location.hash;
	if(_hash.indexOf("performance.index") > -1) {
		//_ds.find('a[href=#btnRefresh]').show();
		_ds.find('a[href=#btnRefresh]').css('display','block'); //-> show()로 하면 display:inline이 되는 현상이 있음.
		//_ds.find('a[href=#btnRefresh]').on('click', function (e) {
		//	e.preventDefault();
        //
		//	console.log('refresh button');
		//});
	}else{
		_ds.find('a[href=#btnRefresh]').hide();
	}

	//마이티켓 핸들링
	_ds.find('a[href=#homeTicket]').on('click', function(e) {
		e.preventDefault();

		if(isMelonLogin()){
			document.location.href = "/public/index.html#ticket.index";
		}else{

			//melon 4.0
			if(mstApp.isMelon()) {
				//popup skip
				ActionHandler._moveLoginAft("/public/index.html#ticket.index");
			}else{
				ActionHandler.confirm({
					message: '로그인이 필요합니다.<br/>로그인페이지로 이동하시겠습니까?',
					callback: function (d) {
						if (d) {
							ActionHandler._moveLoginAft("/public/index.html#ticket.index");
						}
						else {
							return false;
						}
					}
				});
			}
		}
	});

//	$(window).unbind('scroll').on('scroll', function() {
//		// Top 버튼 노출 조건 적용
//		if (100 < window.scrollY) {
//
//			// 홈화면 이전버튼 제외
//			if (null === window.location.hash.match(/home.index/)) {
//				_ds.find('a[href=#btnPrev]').show();
//			}else{
//				_ds.find('a[href=#btnPrev]').hide();
//			}
//
//			_ds.find('a[href=#btnTop]').show();
//		}
//		else {
//			_ds.find('a[href=#btnTop],a[href=#btnPrev]').hide();
//		}
//	});

	_tgtFooter.append(_ds);
	_tgtDom.remove();

	setTimeout(function() {
		$('#footer').show();
	}, 1000);

	$('#footer').find('a[tUrl]').on('click', function(e){
		e.preventDefault();
		var _this = $(this);

		if(mstApp.isApp()){
			mstApp.openWebView(_this.attr('tUrl'), _this.text());
		}else {
			window.open(_this.attr('tUrl'), '_blank');
		}
	});

	$('#footer').find('#corpInfo').unbind('click').on('click', function(e){
		if(mstApp.isApp()){
			mstApp.openWeb(_url4);
		}else{
			window.open(_url4);
		}
	});
}

//var _callbackPolicy = function(){
//
//	var _html = "http://tktapi.melon.com/gate/simpleProxy.json?v=1&url=http://info.melon.com/terms/mobile/terms1_1.html?cpId="+POC_ID;
//	var _tag = "wrap_terms";
//	var _target = "box_agreement_txt";
//
//	$.ajax({
//      url: _html
//      , dataType : 'json'
//      , success: function(d) {
//    	  if(d.ERRCODE === 0){
//    		  var content = $(d.DATA).find('.'+_tag).html();
//    		  $('.'+_target).html(content);
//    	  }
//        }
//        ,error: function(xhr) {
//        	console.debug('err');
//        }
//	});
//}
//
//var _callbackPrivacy = function(){
//
//	var _html = 'http://tktapi.melon.com/gate/simpleProxy.json?v=1&url=http://info.melon.com/terms/mobile/terms3.html?cpId='+POC_ID;
//	var _tag = "wrap_terms";
//	var _target = "box_agreement_txt";
//
//	$.ajax({
//      url: _html
//      , dataType : 'json'
//      , success: function(d) {
//    	  if(d.ERRCODE === 0){
//    		  var content = $(d.DATA).find('.'+_tag).html();
//    		  $('.'+_target).html(content);
//    	  }
//        }
//        ,error: function(xhr) {
//        	console.debug('err');
//        }
//	});
//}
//
//var _callbackTeenager = function(){
//
//	var _html = 'http://tktapi.melon.com/gate/simpleProxy.json?v=1&url=http://info.melon.com/terms/mobile/terms5_1.html?cpId='+POC_ID;
//	var _tag = "wrap_terms";
//	var _target = "box_agreement_txt";
//
//	$.ajax({
//      url: _html
//      , dataType : 'json'
//      , success: function(d) {
//    	  if(d.ERRCODE === 0){
//    		  var content = $(d.DATA).find('.'+_tag).html();
//    		  $('.'+_target).html(content);
//    	  }
//        }
//        ,error: function(xhr) {
//        	console.debug('err');
//        }
//	});
//}

var goOutlink = function(url, title){
	mstApp.goLink(url, mstApp.isApp(), title);
}

/**
 * 활성화된 레이어 푸터영역에 버튼을 추가한다
 */
var addButton = function(pElement) {
	var _popupStack = [], _isAdded = false;

	$('[data-id^=mtkpopup],#wrap').each(function(i, o) {

		if ('Y' === $(o).data('active')) {
			$(o).find('#buttonArea').html(pElement);
			_isAdded = true;
			return false;
		}
	});

	// 활성화된 팝업이 없을경우 바닥페이지에 추가
	if (!_isAdded) {
		$('#buttonArea').html(pElement);
	}

	if(mstApp.isApp()){
		$('#wrap').css('padding-bottom', '111px');
	}else{
		$('#wrap').css('padding-bottom', '50px');
	}
//	$('#wrap').css('padding-bottom', '50px');
}

/**
 * 푸터영역 버튼 삭제
 */
var removeButton = function(pElement) {
	$('#buttonArea').children().remove();
}

/**
 *
 */
var getTempAction = function() {
	var _pa;

	if (0 < $('#hiddenAction').length) {
		$('#hiddenAction').remove();
	}

	_pa = $('<a id="hiddenAction" href="#hiddenAction"></a>');

	// 조건 분기용 핸들링 객체
	_pa.appendTo('body');

	return _pa;
}

var getLoadingPage = function(bShow){

	if(bShow === true ){
		if( $('body').find('#loading_layer').length === 0 ) {
			var _ds = [];
			//_ds.push('<div class="layer_comm loading" id="loading_layer">');
			//_ds.push('<div class="bg"></div>');
			//_ds.push('<div class="inner">');
			//_ds.push('<img src="http://cdnticket.melon.co.kr/resource/image/mobile/common/loading.gif" alt="로딩이미지">');
			//_ds.push('</div>');
			//_ds.push('</div>');
			_ds.push('<div class="layer_comm loading full_h" id="loading_layer">');
			_ds.push('<div class="bg"></div>');
			_ds.push('<div class="inner">');
			_ds.push('<span class="rotate"></span>');
			_ds.push('<span class="bounce"></span>');
			_ds.push('</div>');
			_ds.push('</div>');
			$('body').append($(_ds.join('')));
		}else{
			$('body').find('#loading_layer').css('display', '');
		}
	}else{
		$('#loading_layer').css('display', 'none');
	}
}
/*
var checkFlow = function(e, _o) {
	e.preventDefault();
	var __o = $(_o);
	var _ta = __o.data('target'), _ch = __o.data('check-login');

	if( ActionHandler._checkLogin() === true ) {
		var _opt = {};
		_opt.callback = function( d ) {
			if( d.result === 0 ) {
				var _isPrefer = d.data.ISEXISTPREFERENCE;
				if( _isPrefer === 'Y' ){
					// 로그인Y + 취향설정Y
					ActionHandler._setData('recmd_setting_yn', 'Y');
					var _addedFan = d.data.ADDEDFAN;
					if( _addedFan === 'Y' ) {
						var _al = d.data.ARTISTLIST;
						if( _al.length > 0 ) {
							// 멜론 팬맺기 추가Y
							ActionHandler._setData('added_artist', _al);
							content.load('foru.information.artist_suggestion');
							window.scrollTo(0,0);
						}
					}
				} else {
					// 로그인Y + 취향설정N
					ActionHandler._setData('recmd_setting_yn', 'N');
				}
				content.load(_ta);
				window.scrollTo(0,0);
			}
		}
		ActionHandler.apis['forU.isExistPreference'].execute(_opt);
	} else {
		// 로그인N
		content.load(_ta);
		window.scrollTo(0,0);
	}
}
*/
/**
 * 공백 체크
 */
var isNotNull = function( _s ) {
	if ( _s !== undefined && _s !== null && _s !== '') {
		return true;
	}
	return false;
}

var drawRightGnb = function() {
    var _ds = [];
    if(!mstApp.isApp())
    {
        _ds.push('<div class="wrap_login_menu">');
        _ds.push('<ul class="list_login_menu" >');
        /*
        _ds.push('<li><a href="#action" data-action-type="link" data-target="home.index" class="ico_logmenu ico_logmenu1">홈</a></li>');
        _ds.push('<li><a href="#action" data-action-type="link" data-target="foru.perform.index" class="ico_logmenu ico_logmenu2">For U</a></li>'); //onclick="checkFlow(event, this);" data-check-login="Y"
        _ds.push('<li><a href="#action" data-action-type="link" data-target="search.index" class="ico_logmenu ico_logmenu3">검색</a></li>');
        _ds.push('<li><a href="#action" data-action-type="link" data-target="ticket.index" data-check-login="Y" class="ico_logmenu ico_logmenu4">마이티켓</a></li>');
        */
        _ds.push('<li><a href="/public/index.html#home.index" class="ico_logmenu ico_logmenu1">홈</a></li>');
		_ds.push('<li><a href="/public/index.html#foru.perform.index" class="ico_logmenu ico_logmenu2" id="gnbForuBtn">For U</a></li>');
        _ds.push('<li><a href="/public/index.html#search.index" class="ico_logmenu ico_logmenu3">검색</a></li>');
        //_ds.push('<li><a href="/public/index.html#ticket.index" class="ico_logmenu ico_logmenu4">마이티켓</a></li>');
        _ds.push('<li><a href="#homeTicket" class="ico_logmenu ico_logmenu4">마이티켓</a></li>');
        _ds.push('</ul>');
        _ds.push('</div>');
    }
    else
    {
        $("#fullMenu .wrap_full_menu").css("top","56px");
    }

    $('#drawRightGnbScript').parents('#mobile_menu').append(_ds.join(''));
    $('#drawRightGnbScript').remove();

    //마이티켓 핸들링
    $('#mobile_menu').find('a[href=#homeTicket]').on('click', function(e) {
		e.preventDefault();

		if(isMelonLogin()){
			document.location.href = "/public/index.html#ticket.index";
		}else{

			//melon 4.0
			if(mstApp.isMelon()){
				//popup skip
				ActionHandler._moveLoginAft("/public/index.html#ticket.index");
			}else {
				ActionHandler.confirm({
					message: '로그인이 필요합니다.<br/>로그인페이지로 이동하시겠습니까?',
					callback: function (d) {
						if (d) {
							ActionHandler._moveLoginAft("/public/index.html#ticket.index");
						}
						else {
							return false;
						}
					}
				});
			}
		}
	});
}

var ImageUtils = {

		/**
		 *  포토 / 영상 이미지 CROP
		 *
		 * @param _id	셀렉터 아이디 ( ul .croping img )
		 */
        movieCroping : function( _id ){
        	var _this = this;
            var target = $('#' + _id );
            this.frame = target.find(".croping");
            this.targetImg = this.frame.find("img");
            this.wid = null;
            this.hei = null;

            $("img").load(function(){
            	_this.setting();
            });

            this.setting = function() {
            	var _this = this;

            	var targetImgWid,targetImgHei,targetImgSize;

            	_this.wid = _this.frame.width();
            	_this.hei = Math.floor(_this.wid*0.75);
            	_this.frame.css("height",_this.hei);
            	_this.targetImg.each(function(idx, itm){
	                targetImgWid = $(itm).width();
	                targetImgHei = $(itm).height();
	                targetImgSize = (targetImgWid >= targetImgHei)? "widthLong" : "heightLong";
	                if(targetImgSize == "widthLong"){
	                    var pWidth;
	                    $(itm).css({"height":"100%","width":"auto"})
	                    pWidth = Math.round(($(itm).width()*0.5) - (_this.wid*0.5));
	                    $(itm).css("margin-left" , "-" + pWidth + "px")
	                }else{
	                    var pHeight;
	                    $(itm).css({"width":"100%","height":"auto"})
	                    pHeight = Math.round(($(itm).height()*0.5) - (_this.hei*0.5));
	                    $(itm).css("margin-top" , "-" + pHeight + "px")
	                }
	            });
            }

            this.resize = function(){
            	var _this = this;
	        	$(window).on("resize",function(){
	        		_this.setting();

	            });
            };
        }
}

function selectSet(param){
    var targetTxt = $(param).children(".sel_out");
    var targetSelect = $(param).children(".sel_cate");
    $(param).each(function(i,param){
        var n = $(targetSelect[i]).children("option:selected").val();
        if (n > 0) {
            $(param).parent().addClass("box_sel_on");
        } else {
            $(param).parent().removeClass("box_sel_on");
        }
        $(targetTxt[i]).children(".txt").html($(targetSelect[i]).children("option:selected").text());
        $(targetSelect[i]).on("change", function () {
            $(targetTxt[i]).children(".txt").html($(targetSelect[i]).children("option:selected").text());
            var n = $(targetSelect[i]).children("option:selected").val();
            if (n > 0) {
                $(param).parent().addClass("box_sel_on");
            } else {
                $(param).parent().removeClass("box_sel_on");
            }
        });
    });
}

/**
 * 퍼블리싱 ( fixed body )
 *
 * @param	target		상단 탭이 실제 2개가 구종되는 경우에만 상단 탭 영역의 아이디값을 적어준다.
 * 						- performance/index.html #topDetailTab
 * 						- artist/index.html #topDetailTab
 * 						- region/index.html #topDetailTab
 */

var _prevScrollY = 0;
var _currScrollY = 0;
function includeDoThisStuffOnScroll( target ) {
	window.onscroll = doThisStuffOnScroll;
    function doThisStuffOnScroll() {
        var scrollTop = $(window).scrollTop();
        var coverHeight = $('.cover_page .body').outerHeight() - 56;
        var coverContHeight = $('.fixed_body .fixed_cont').outerHeight() + coverHeight;
        if (scrollTop >= coverHeight ) {
            $('body').addClass('fix');
        }
        else {
            $('body').removeClass('fix');
        }
        if (scrollTop >= coverContHeight ) {
            $('body').addClass('fix_menu');

            if( undefined !== target ) {
            	/* 20160217 : 시작 디테일 텝이 실제 2개가 구종되는 소스일 경우 다음 소스를 해당 위치에 삽입 */
            	setTimeout(function(){detailTab( target );},300);
            	/* 20160217 : 끝 */
            }
        }
        else {
            $('body').removeClass('fix_menu');
        }

        if (100 < window.scrollY) {
            //$('#fixed_bottom').find('a[href=#btnTop],a[href=#btnPrev]').show();
        	$('#fixed_bottom').find('a[href=#btnTop]').show();

            //// 홈화면 이전버튼 제외
			//if (null === window.location.hash.match(/home.index/)) {
			//	//$('#fixed_bottom').find('a[href=#btnPrev]').show();
			//}else{
			//	$('#fixed_bottom').find('a[href=#btnPrev]').hide();
			//}
        }
        else {
            //$('#fixed_bottom').find('a[href=#btnTop],a[href=#btnPrev]').hide();
			$('#fixed_bottom').find('a[href=#btnTop]').hide();
        }

        //검색창 키패드 올라온 경우 스크롤시
        var _input = $('#srchWord_after');
        if(undefined !== _input){
        	_input.blur();
        }
        //쿠폰 입려부분 스크롤시
        var _cpnInput = $('#textCupnCd');
        if(undefined !== _cpnInput){
//        	_cpnInput.blur();
        	_currScrollY = window.scrollY;
        	//스크롤시 키보드 내림. 민감도 조절 필요
        	if(Math.abs(_currScrollY - _prevScrollY) > 15 || window.scrollY > 150){
        		_cpnInput.blur();

        	}
        	_prevScrollY = _currScrollY;
        }

    }
    setTimeout(doThisStuffOnScroll,200);
    var mTopSetting;

    if (undefined !== target) {
    	mTopSetting = $(target).height();
    }
    else {
    	mTopSetting = $('.cover_page').height() + 56;
    }

    var mHeaderSetting = $('#header').height();
    if (mTopSetting >= mHeaderSetting){
        $('.fixed_body').css('margin-top',mTopSetting)
    }else{
        $('.fixed_body').css('margin-top',mHeaderSetting)
    }


    function detailTab(target){ // 상세쪽 탭 아이스크롤
    	myScroll = new IScroll(target, {
    		disablePointer: true, 
    		scrollX:true,
    		scrollY:true,
    		mouseWheel:true,
    		eventPassthrough:true, //추가 속성
    		preventDefault:false, //추가 속성
    	});
    }

    if( undefined !== target ) {
    	detailTab(target );
    }
}

function getPocId(){
	var _pocId;
	if(mstApp.isAndroid()){
		if(mstApp.isApp()){
			_pocId = 'AS47';
		}else {
			_pocId = 'AX25';
		}
	}
	else if(mstApp.isIOS()){
		if(mstApp.isApp()){
			_pocId = 'IS47';
		}else {
			_pocId = 'IX25';
		}
	}else{
		//임시
		_pocId = 'AX25';
	}
	return _pocId;
}

var gTargets = ['DECOPMAC','MAC', 'MHC', 'MLCP', 'MUAC', 'MUG', 'MUNIK', 'MUS', 'PCID', 'keyCookie'];

//app인 경우에는 단순히 쿠키값만 지워주도록 한다.
function tktLogout(locationType,returnPage,appLoc){
	setCookie("coop","", -1, "/", ".melon.com");	// 제휴사 코드
	setCookie("coop_funnel","", -1, "/", ".melon.com");	// 인입 경로코드
	setFkCookie("tkt_fk","", -1, "/", ".melon.com");	// 만료 여부판단 
//	setCookie("cbo","", -1, "/", ".melon.com");	//	팝업노출 여부판단
	setCookie("TKTAUTH","", -1, "/", ".melon.com"); // 배송지관련 cookie 삭제
//	if (location.href.indexOf('performance.index') > 0) {
//		history.replaceState(null, null,'http://m.ticket.melon.com/public/index.html#performance.index?prodId='+getParams().prodId);
//	}
	
	if(returnPage.indexOf('coop') > 0){	// coop 값이 있는 경우
		var Spt = location.href.substring(location.href.indexOf('coop')-1,location.href.indexOf('coop'));
		var dReturnPage = returnPage.replace(Spt+"coop="+getParams().coop,"");
		if(Spt == "?"){	// coop가 첫번째 parameter 일 경우
			if(location.href.indexOf("&") > 0){	// coop 이외에 다른 parameter 유무 확인, 다른 parameter도 있는 경우
				if(location.href.indexOf('coop') < location.href.indexOf("&")){ // coop 위치 확인
					returnPage = returnPage.replace("coop="+getParams().coop+"&",""); // coop 다음 parameter가 있는 경우 '?'를 남겨두고 coop뒤에 있는 '&' 삭제
				}else{
					returnPage = dReturnPage; // coop 다음 parameter가 없는 경우 '?' 삭제
				}
			}else{
				returnPage = dReturnPage; // parameter가 coop만 있는 경우 '?' 삭제
			}
		}else{	// coop가 첫번째 parameter가 아닐 경우 '&' 삭제
			returnPage = dReturnPage;
		}
	}
	
	
	if(mstApp.isApp()){
		removeTktMemCookie(appLoc);
		//if(removeTktMemCookie(appLoc)){
		//	return;
		//}
		//location.hash = 'etc.logout?returnHash='+returnPage+'&callerHash='+location.hash.substr(0,location.hash.indexOf('?'))+'&appLoc='+appLoc;
		var _hash = extractHashKey(returnPage);
		location.hash = 'etc.logout?returnHash='+_hash;
	}else{
		//web의 경우 아래 호출
		logout(locationType, returnPage);
	}
}

function extractHashKey(_url){
	var _hash = '';

	if(_url && _url.indexOf('#') > -1){
		_hash = _url.substr(_url.indexOf('#')+1);
	}else{
		_hash = 'home.index';
	}
	return _hash;
}

function removeTktMemCookie(appLoc){
	$.each(gTargets, function(_i, _v){
		removeCookie(_v);
	});

	var skipRedirect = false;
	if(appLoc === 'menu'){
		//close side menu and refresh
		if ($('#fullMenu').hasClass('wrap_full_menu_open')) {
			$('#fullMenu').removeClass('wrap_full_menu_open');
		}
		skipRedirect = true;
	}else if(appLoc === 'main'){
		//refresh

	}else{

	}

	return skipRedirect;
}

/*
setting.index 에서 로그인 영역을 다시 그린다.
 */
function redrawLogin(){

	var drawLogin = isMelonLogin();

	if(!drawLogin){
		var _sub = [];
		_sub.push('<li>');
		_sub.push('<div class="box_log logout">');
		_sub.push('<strong class="tit">로그인 해주세요!</strong>');
		_sub.push('<button class="btn_login">로그인</button>');
		_sub.push('<span class="txt_info">로그인 관리는 Melon&gt;설정&gt;로그인관리에서 하실 수 있습니다.</span>');
		_sub.push('</div>');
		_sub.push('</li>');

		_sub = $(_sub.join(''));

		_sub.find('button').on('click', function(e){
			//melon 4.0
			if(mstApp.isMelon()){
				mstApp.moveMelonLogin();
			}else {
				if (!ActionHandler._moveLogin()) {
					return false;
				}
			}
		});

		//melon 4.0
		if(mstApp.isMelon()){
			_sub.find('#btnStgLogout').hide();
		}
		$('.list_my_acc > li').remove();
		$('.list_my_acc').html(_sub);
	}else{
		var _ds = [];
		_ds.push('<li>');
		_ds.push('<div class="box_log login">');
		_ds.push('<strong class="tit">'+getMemberNickName()+'</strong>');
		_ds.push('<button class="btn_login" id="btnStgLogout">로그아웃</button>');
		_ds.push('<span class="txt_info">로그인 관리는 Melon&gt;설정&gt;로그인관리에서 하실 수 있습니다.</span>');
		_ds.push('</div>');
		_ds.push('</li>');

		_ds = $(_ds.join(''));

		_ds.find('#btnStgLogout').on('click', function(e){
			//logout시에 delete data
			if(mstApp.isApp()){
				mstApp.unregDevice(getMemberId(), getMemberKey());
				mstApp.kakaoLoginDelResult();
				mstApp.autoLoginAccountDel(getMemberId(), getMemberToken(), '');
			}
			//logout('03', location.href);
			tktLogout('03', location.href, 'main');

			//app 인 경우 login을 다시 그려줘야 한다.
			_drawLogin(true);
		});

		//melon 4.0
		if(mstApp.isMelon()){
			_ds.find('#btnStgLogout').hide();
		}
	}
}

function removeCookie(key){
	var d = new Date();
	d.setDate( d.getDate() -1);
	document.cookie=key+'=; path=/; expires='+ d.toGMTString()+'; domain=.melon.com;';
}

Date.prototype.yyyymmdd = function() {
	var yyyy = this.getFullYear().toString();
	var mm = pad((this.getMonth()+1).toString()); // getMonth() is zero-based
	var dd  = pad(this.getDate().toString());
	return yyyy + mm + dd; // padding
}

Date.prototype.yyyymmddhh = function() {
	var yyyy = this.getFullYear().toString();
	var mm = pad((this.getMonth()+1).toString()); // getMonth() is zero-based
	var dd  = pad(this.getDate().toString());
	var hh = pad(this.getHours().toString());
	return yyyy + mm + dd + hh;
}

Date.prototype.yyyymmddhhmiss = function() {
	var yyyy = this.getFullYear().toString();
	var mm = pad((this.getMonth()+1).toString()); // getMonth() is zero-based
	var dd  = pad(this.getDate().toString());
	var hh = pad(this.getHours().toString());
	var mi = pad(this.getMinutes().toString());
	var ss = pad(this.getSeconds().toString());
	return yyyy + mm + dd + hh + mi + ss;
}

function pad(n){
	return n<10 ? '0'+n : ''+n
}

function isToken(){
	var memberKey = getMUACHeaderCookie("memberKey");
    if (memberKey == "undefined" || memberKey == undefined || memberKey.length <= 0) return false;
    var returnUrl = "http://m.ticket.melon.com";
    var result = true;
    $.ajax({
		type		: 'GET',
		url           : 'http://tktapi.melon.com/poc/member/tokenCheck.json',
		cache	   : false,
		xhrFields: {withCredentials: true}, // 쿠키 전송을 위해 활성화
		async	   : false,
		dataType	: 'json',
		data : {
			memberId: getMemberId(),
			token: getMLCPHeaderCookie('token'),
			cookieToken: 'N',
			cpId: getPocId()
		},
		success: function(o) {
			if ("000000" !== o.resultCode) {
				ActionHandler.alert({
					message: '로그인 시간이 만료되었습니다. 다시 로그인 해주세요.',
					callback: function() {
						if(mstApp.isApp()) {
							mstApp.unregDevice(getMemberId(), getMemberKey());
							mstApp.kakaoLoginDelResult();
							mstApp.autoLoginAccountDel(getMemberId(), getMemberToken(), '');
						}
						logout('03', returnUrl);
					}
				});
				result = false;
			}else{
				result = true;
			}
		}
		, error        : function(e) {
		}
	});
	return result;
};

function appLogout(){
	gTargets.push('coop', 'coop_funnel', 'tkt_fk', 'TKTAUTH');
	
	$.each(gTargets, function(_i, _v){
		removeCookie(_v);
	});
}