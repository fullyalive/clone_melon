/**
 * 이벤트 핸들러
 */
var ActionHandler = {
	IS_POP: false,
	// API 호출 바인딩용 배열
	apis: [],
	// 윈도우 스크롤 포지션
	_positionY: 0,
	// 토스트 진행중 여부
	_floatToast: false,
	// 파라메터 데이터 저장소
	_queryStack: [],
	// html 템플릿 캐시 저장소
	_templateStorage: [],
	// 하단 더보기 적용영역 비율
	_bottomRate: .05,
	// 더보기 호출여부
	_moreCalled: false,
	// 링크 이벤트로 진입인지 여부 플래그 - 직접진입, 백버튼처리를 위한 해시변경 이벤트 핸들링 분기용
	_isIntoEventLink: false,
	// 상수모음. 초기화 시 ActoinHandler 객체에 직접 바인딩
	_statics: {
		CONTEXT_ROOT: "",
		/** API HOST - 댓글 */
		HOST_CMT_API: "cmt.melon.com",
		/** API HOST - 티켓 */
		HOST_TKT_API: "tktapi.melon.com",
		/** API HOST - 티켓 */
		HOST_PROXY_API: "m.ticket.melon.com/tktapi",
		/** POC API HOST - 티켓 */
		HOST_TKT_POC_API: "m.ticket.melon.com/tktapi_poc",
		/** API HOST - 멜론 공통 회원 */
		HOST_MEMBER: "member.melon.com",
		/** API HOST - wecandeo */
		HOST_MEDIA_API: "api.wecandeo.com",
		/** CDN HOST - 티켓 POC */
		HOST_CDN: "cdnticket.melon.co.kr",
		/** CDN HOST - 메타 */
		HOST_CDN_IMG : "cdnimg.melon.co.kr",
		/** Melon URL HOST - 멜론 API URL */
		HOST_MELON_API: "m.melon.com",
		/** Melon 이미지업로드 HOST   */
		HOST_UPLOAD_API: "cmtimgup.melon.com",
		/** 통합회원 로그인 경로 */
		MEMBER_LOGIN_PATH: "/muid/family/ticket/login/mobile/login_inform.htm",
		/** 리소스 경로 */
		RESOURCE_HTML_PATH: "/public/content/html",
		/** 미디어 조회 API 접근 키 */
		//API_KEY_MEDIA: "b6fad44bfec07c4ce4abaa6b580d90a5",
		API_KEY_MEDIA: "c69cf1c7acaa87df1b583a8123a2cc39",
		ACTION_TYPE_LINK: "link",
		ACTION_TYPE_POPUP: "popup",
		ACTION_TYPE_OUTLINK: "outlink",
		ACTION_TYPE_TAB: "tab",
		ACTION_TYPE_TAB_LOAD: "tab.load",
		ACTION_TYPE_TAB_DATA: "tab.data",
		ACTION_TYPE_HISTORYBACK: "historyback",
		ACTION_TYPE_MENU: "menu",
		ACTION_TYPE_PUSH: "push",
		ACTION_TYPE_FAVORITE: "favorite",
		ACTION_TYPE_FORU_ARTIST: "foru.artist",
		ACTION_TYPE_SLIDER: "slider",
		ACTION_TYPE_ALERT: "alert",
		API_TYPE_POC: "poc",
		API_TYPE_API: "api",
		API_TYPE_CMT: "cmt",
		API_TYPE_CST: "cst",
		API_TYPE_MED: "med",
		API_TYPE_MEB: "meb",
		API_TYPE_MEL: "mel",
		API_TYPE_IMG: "img",
		API_TYPE_LOG: "log",
		API_TYPE_PV: "pv",
		API_SPECS: [
		    {type:"poc",
			list:[	/* 티켓 POC API 리스트 - 포맷 = 키[전송방식,버전] */
		            "performance.detail[get,1]",
                	"performance.detailpreview[get,1]",
		            "performance.list[get,1]",
		            "performance.isFavorite[get,1]",
		            "performance.removeFavorite[post,1]",
		            "performance.toggleFavorite[post,1]",
		            "performance.getConcertListByClassCode[get,1]",
		            "performance.getSubGenreThemeList[get,1]",
		            "performance.listBridge[get,1]",
		            "performance.listPlan[get,1]",
		            "performance.listReviewInfos[get,1]",
		            "performance.listPlannerByStatus[get,1]",
		            "performance.listCancelFee[get,1]",
		            "performance.addReviewRate[post,1]",
		            "performance.modReviewRate[post,1]",
		            "performance.listReviewRate[get,1]",
					"performance.list.by.coupon[get,1]",
					"performance.prodByEventInfo[get,1]",
					"performance.mediaMV[get,1]",
		            "place.detail[get,1]",
		            "place.getPossiblePerf[get,1]",
		            "plan.detail[get,1]",
		            "plan.list[get,1]",
		            "artist.get[get,1]",
		            "artist.getWithIntimacy[get,1]",
		            "artist.detail[get,1]",
		            "artist.listVideo[get,1]",
		            "artist.listPhoto[get,1]",
		            "artist.listPerformance[get,1]",
		            "artist.getRelArtist[get,1]",
		            "artist.isForUArtist[get,1]",
		            "region.prodList[get,1]",
		            "region.placeList[get,1]",
		            "region.geologging[get,1]",
		            "song.detail[get,1]",
		            "song.list[get,1]",
		            "album.detail[get,1]",
		            "forU.themeList[get,1]",
		            "forU.regionList[get,1]",
		            "forU.recommendArtist[get,1]",
		            "forU.addRecmdSetting[get,1]",
		            "forU.addInterestProd[get,1]",
		            "forU.getRecommendProduct[get,1]",
		            "forU.isExistPreference[get,1]",
		            "forU.modifyViewDate[get,1]",
		            "forU.userPreference[get,1]",
		            "forU.modifyRecommendSetting[get,1]",
		            "forU.plannerUserSchedule[get,1]",
		            "forU.plannerArtistList[get,1]",
		            "forU.plannerArtistSchedule[get,1]",
		            "forU.modifyLastAccessDate[get,1]",
		            "forU.relationMusic[get,1]",
		            "forU.suggestArtist[get,1]",
		            "forU.toggleRecmdArtist[get,1]",
		            "forU.toggleAlram[get,1]",
		            "ticketOpen.list[get,1]",
		            "ticketOpen.detail[get,1]",
		            "search.artist[get,1]",
		            "search[get,1]",
		            "search.performance[get,1]",
		            "search.place[get,1]",
		            "event.detail[get,1]",
		            "event.addviewcnt[get,1]",
		            "event.listForMain[get,1]",
		            "event.listParticipant[get,1]",
		            "event.apply[post,1]",
		            "event.applyInfo[post,1]",
		            "event.isParticipant[post,1]",
		            "event.listWinner[get,1]",
		            "event.searchAddress[get,1]",
		            "offer.listMainBanner[get,1]",
                	"offer.listGenre[get,1]",
		            "offer.listEventBanner[get,1]",
		            "offer.listGenreConcertBanner[get,1]",
		            "offer.listGenreArtBanner[get,1]",
		            "offer.listThemeBanner[get,1]",
		            "offer.getArtistBanner[get,1]",
		            "offer.getPerformanceBanner[get,1]",
		            "offer.getPerformanceEvalueBanner[get,1]",
		            "offer.getPerformanceReviewBanner[get,1]",
		            "push.getTotalCnt[get,1]",
		            "push.list[get,1]",
		            "push.updatePushCheck[post,1]",
		            "ranking.listForMain[get,1]",
		            "ranking.listDaily[get,1]",
		            "ranking.listWeekly[get,1]",
		            "ranking.listAvailDays[get,1]",
					"ranking.listHist[get,1]",
					"ranking.midnightListFromHourly[get,1]",
		            "notice.list[get,1]",
		            "notice.viewCntUpdate[get,1]",
		            "system.getInfo[get,1]",
		            "system.getAlert[get,1]",
					"system.serviceInfo[get,1]",
		            "wish.list[get,1]",
		        	"wish.displayCamp[get,1]",
		        	"wish.detail[get,1]",
		        	"wish.checkJoinWish[get,1]",
		        	"wish.listMyWish[get,1]",
		        	"wish.addWishUsr[get,1]",
		        	"wish.getWishQuestionAns[get,1]",
		        	"wish.getWishQuestion[get,1]",
		        	"wish.addQuestionAnswer[get,1]",
		        	"wish.addWish[get,1]",
		        	"wish.checkExistWish[get,1]",
		        	"wish.checkAddWishCondition[get,1]",
		        	"wish.modifyWishUsrSns[get,1]",
		        	"wish.listWishDispByHome[get,1]",
		        	"wish.countByLastAccessSurvey[get,1]",
		        	"wish.listSurvey[get,1]",
		        	"wish.listSurveyQuestion[get,1]",
		        	"wish.addSurveyQuestionAnswer[get,1]",
		            "saleCupn.listSaleCupn[get,1]",
		            "saleCupn.listSaleCupnByProd[get,1]",
		            "saleCupn.listUsedSaleCupn[get,1]",
		            "saleCupn.downLoad[post,1]",
		            "saleCupn.registCupn[post,1]",
		            "member.config[get,1]",
		            "member.getProfile[get,1]",
		            "member.listPushConfig[get,1]",
		            "member.addPushConfig[post,1]",
		            "member.setPushFlg[post,1]",
		            "member.setGeosvcAgree[post,1]",
		            "member.getGeosvcAgree[get,1]",
		            "member.getProfileImg[get,1]",
		            "member.getForuAgmt[get,1]",
		            "member.setForuAgmt[get,1]",
					"member.realInfo[get,1]",
					"member.destnt.getBase[get,1]",
					"member.destnt.add[post,1]",
					"member.destnt.update[post,1]",
					"member.searchAddress[get,1]",
					"member.identity[get,1]",
		            "qna.addCmt[post,1]",
		            "sns.outpostlogging[get,1]",
		            "promotion.index[get,1]",
		            "promotion.apply[get,1]"
		            ]},
            {type:"api",
            list:[	/* 티켓 BO API 리스트 */
                  	"prersrv.usercond[get,1]",
                  	"prersrv.authitem[get,1]",
                  	"prersrv.auth[post,1]",
                  	"product.schedule.list[get,1]",
                  	"product.tickettype.list[get,1]",
                  	"product.prodKey[get,1]",
		            "reservation.listMyTicketToday[get,1]",
		            "reservation.member.list[get,1]",
                  	"reservation.barcode[get,1]",
                  	"advtk.list[get,1]",
                  	]},
          	{type:"cmt",
            list:[	/* 댓글 API 리스트 */
                  	"api.api_insertCmt[post]",
                  	"api.api_insertReprt[post]",
                  	"api.api_insertRecm[post]",
                  	"api.api_insertAdcmt[post]",
 		            "api.api_informCmt[get]",
 		            "api.api_informOembed[get]",
 		            "api.api_listCmt[get]",
 		            "api.api_listMusicKeyword[get]",
 		            "api.api_listMusic[get]",
 		            "api.api_updateCmt[post]",
 		            "api.api_deleteCmt[post]",
 		            "api.api_deleteAdcmt[post]",
 		            ]},
            {type:"cst",
            list:[	/* 고객센터 API 리스트 */
                  	"proxy[post]"
 		            ]},
            {type:"meb",
            list:[	/* 멜론 공통회원 API 리스트 */
                     "ticket.mobile.realname_isAuthCk[get]"
    		        ]},
            {type:"med",
 		    list:[	/* 영상 정보 조회 API 리스트 */
                     "info.v1.video.detail[get]"
    		        ]},
	        {type:"mel",
 		    list:[	/* 멜론 API 리스트 */
                     "mobile2.sns_informNShortenUrl[get]"
    		        ]},
	        {type:"img",
 		    list:[	/* 멜론 이미지 업로드 */
                     "auth.authhs_jsonp[get]"
    		        ]},
			{type:"log",
				list:["netfunnel.netfunnelLog[get,1]",
					"prod.buyBtnClickLog[get,1]"]
			},
			{type:"pv",
				list:["mobile.logging[get,1]"]
			}
            ]
	},
	/**
	 * 저장된 파라메터 데이터 리턴
	 *
	 * @param pKey - 데이터 키
	 * @returns
	 */
	_getData: function(pKey) {

		var _this = this, _h = location.hash.split("#")[1],
			_k = _h.split("?")[0], _q;

		if (0 === _this._queryStack.length) {
			return false;
		}

		for(var i in _this._queryStack) {
			if (undefined !== pKey) {

				if (pKey === _this._queryStack[i].key) {
					_q = _this._queryStack[i].data;
					break;
				}
			}
			else {
				if (_k === _this._queryStack[i].key) {
					_q = _this._queryStack[i].data;
					break;
				}
			}
		}

		//_this._queryStack = [];
		return _this._decode(_q);
	},
	/**
	 * 지정된 키로 파라메터 데이터 저장
	 *
	 * @param pKey - 저장 키
	 * @param pData - 데이터
	 */
	_setData: function(pKey, pData) {
		var _this = this;

		for(var i in _this._queryStack) {
			if (pKey === _this._queryStack[i].key) {
				_this._queryStack.splice(i, 1);
				break;
			}
		}

		if (null != pData) {
			_this._queryStack.push({key: pKey, data: pData});
		}
	},
	/**
	 * 지정된 키에 저장된 데이터 추가
	 *
	 * @param pKey - 저장 키
	 * @param pData - 데이터
	 */
	_appendData: function(pKey, pData) {
		var _this = this, _q;

		for(var i in _this._queryStack) {
			if (pKey === _this._queryStack[i].key) {
				_q = $.extend(_this._queryStack[i].data, pData);
				_this._queryStack[i].data = _q;
				break;
			}
		}

		if (undefined === _q) {
			_this._setData(pKey, pData);
		}
	},

	/**
	 * 지정된 키에 해당하는 템플릿 리턴
	 *
	 * @param pOption.key - 템플릿 키 (저장경로)
	 * @param pOption.callback - 콜백
	 */
	_getTemplate: function(pOption) {

		var _this = this;

		if (undefined === _this._templateStorage[pOption.key]) {
			$.ajax({
				url: _this.RESOURCE_HTML_PATH + pOption.key,
				dataType: 'html',
				timeout: 7000,
				success: function(d){
					// 저장소 등록
					_this._templateStorage[pOption.key] = d;

					// 콜백
					if ('function' === typeof pOption.callback) {
						pOption.callback(d);
					}
				}
//				,
//				error: function(jq,status,message){
//					console.log('_getTemplate error called:')
//					if(jq.readyState == 0){
//						//ActionHandler.alert({message:"해당 페이지의 접속이 지연되고 있습니다. 네트워크 연결 상태를 확인하거나, 잠시 후 다시 이용해주세요."});
//						mstApp.showNetworkAlert();
//					}
//				}
			});
		}
		else {
			// 콜백
			if ('function' === typeof pOption.callback) {
				pOption.callback(_this._templateStorage[pOption.key]);
			}
		}
	},
	/**
	 * 객체 길이 리턴 (스트링 문자열 제외)
	 *
	 * @param pData - 길이 체크할 JSON 객체
	 * @returns {Number}
	 */
	_length: function(pData) {
		var _k, _c = 0;
		if ('string' === typeof pData) {

		}
		else {
			for(_k in pData) {
				if(pData.hasOwnProperty(_k) || 'string' === typeof pData[_k]) {
					_c++;
				}
			}
		}
		return _c;
	},
	/**
	 * JSON 객체 문자열 인코딩
	 *
	 * @param pData - 인코딩 대상 JSON 객체
	 * @returns
	 */
	_encode: function(pData) {
		var _t = ('string' === typeof pData ), _r;
		try {
			if (Array !== pData.constructor) {
				_r = (_t ? pData : $.extend({}, pData));
			} else {
				_r = pData;
			}
		} catch (exception){
			_r = pData;
		}

		if (_t) {
			return escape(_r);
		}
		else {
			for (var i in _r) {
				try {
					if (ActionHandler._length(_r[i])) {
						_r[i] = ActionHandler._encode(_r[i]);
					}
					else {
						if (undefined != _r[i]) {
							if (Array === _r[i].constructor) continue;
							_r[i] = escape(_r[i]);
						}
					}
				}
				catch(e){}
			}
		}
		return _r;
	},
	/**
	 * JSON 객체 문자열 디코딩
	 *
	 * @param pData - 디코딩 대상 JSON 객체
	 * @returns
	 */
	_decode: function(pData) {
		var _t = ('string' === typeof pData), _r;

		try {
			if (Array !== pData.constructor) {
				_r = (_t ? pData : $.extend({}, pData));
			}else {
				_r = pData;
			}
		} catch (exception){
			_r = pData;
		}

		if (_t) {
			return unescape(_r);
		}
		else {
			for (var i in _r) {
				try {
					if (ActionHandler._length(_r[i])) {
						_r[i] = ActionHandler._decode(_r[i]);
					}
					else {
						if (undefined != _r[i]) {
							if (Array === _r[i].constructor) continue;
							_r[i] = unescape(_r[i]);
						}
					}
				}
				catch(e){}
			}
		}
		return _r;
	},
	/**
	 * 멜론 로그인페이지 이동
	 */
	_moveLogin: function() {
		var _this = this;
		var _returnUrl = "http://m.ticket.melon.com/public/readingGate.html"+document.location.hash;
		//melon 4.0
		if(mstApp.isMelon()){
			mstApp.moveMelonLogin();
		}else {
			if (!mstApp.isApp())
//				document.location.href = 'https://' + _this.HOST_MEMBER + _this.MEMBER_LOGIN_PATH + '?cpId=' + POC_ID + '&returnPage=' + escape(document.location.href);
				document.location.href = 'https://' + _this.HOST_MEMBER + _this.MEMBER_LOGIN_PATH + '?cpId=' + POC_ID + '&returnPage=' + escape(_returnUrl);
			else {

				var _o = $('<a href="#action" data-action-type="popup" data-key="popup.login" data-target="/app/login_form.html" class="link_view"></a>');
				_o.data('json', {
//					returnUrl: document.location.href
					returnUrl: _returnUrl
				});
				_this._handleEventPopup(_o);

				_o.trigger("click");
			}
		}
	},

	/**
	 * 멜론 로그인페이지 이동
	 */
	_moveLoginAft: function(moveUrl) {
		var _this = this;

		//melon 4.0
		if(mstApp.isMelon()){
			mstApp.moveMelonLogin();
		}else {
			if (!mstApp.isApp()) {
				document.location.href = 'https://' + _this.HOST_MEMBER + _this.MEMBER_LOGIN_PATH + '?cpId=' + POC_ID + '&returnPage=' + escape(moveUrl);
			}
			else {

				var _o = $('<a href="#action" data-action-type="popup" data-key="popup.login" data-target="/app/login_form.html" class="link_view"></a>');
				_o.data('json', {
					returnUrl: moveUrl
				});
				_this._handleEventPopup(_o);

				_o.trigger("click");
			}
		}
	},
	/**
	 * 활성화 팝업 닫기
	 */
	_closeActivePopup: function() {
		$('[data-id^=mtkpopup]').each(function(i, o){
			if ('Y' === $(o).data('active')) {
				$(o).find('[data-action-type="close"]').click();
			}
		});
	},
	/**
	 * 링크 이벤트 핸들링
	 *
	 */
	_handleEventLink: function(_o){
		var _this = this;

		//_o.unbind('click').on('click', function(e){
		_o.on('click', function(e){
			e.preventDefault();

			_this._isIntoEventLink = true;

			var __o = $(this), _data = __o.data();

			// 동일페이지 이동시 메뉴 닫기
			if (-1 < document.location.hash.search(_data.target)) {
				if ($('#fullMenu').hasClass('wrap_full_menu_open')) {
					$('#fullMenu').find('button:first').trigger('click');
				}
			}

			if ('Y' === _data.checkLogin) {
				if( !_this._confirmLogin() ) {
					return;
				}
			}else if('Y' === _data.checkLoginAfter){
				if( !_this._confirmLoginAft('/public/index.html#'+_data.linkAfter)){
					return;
				}
			}
			// 이동 전 fix 클래스 제거
			$('body').removeClass('fix fix_menu');

			if ('Y' === _data.checkToken) {
				if(isToken()){
					content.load(_data.target);
				}
			}else{
				content.load(_data.target);
			}
			
			if (undefined !== _data.jsonString || undefined !== _data.json) {
				var _setValue = _data.jsonString;

				if (undefined !== _data.json) {
					_setValue = $.extend(_setValue, _data.json);
				}

				if (undefined !== _data.refVal) {
					_setValue = $.extend(_setValue, _data.refVal);
				}

				_this._setData(_data.target, _setValue);
			}

			var _state = _this._getData(_data.target);

			// 쿼리스트링 설정 스케줄링
			setTimeout(function() {
				var _paramString = '', _params = [], _url = '';

				_url = document.location.href;

				if (undefined !== _state) {
					for (i in _state) {
						if(i!='tabIndex')
						_params.push(i + '=' + _state[i]);
					}

					_url += '?' + _params.join('&');
				}

				// 해시 상태 변경 스케줄링
				setTimeout(function() {
					window.history.replaceState({
						target: _data.target,
						data: _this._getData(_data.target)},
						'',
						unescape(_url));
				}, 10);
			}, 10);
		});
	},

	/**
	 * 탭 페이지 로드 이벤트 핸들링
	 *
	 */
	_handleEventTabLoad: function(_o){
		var _this = this;

		_o.unbind('click').on('click', function(e){
			e.preventDefault();

			var __o = $(this), _data = __o.data();

			if ('Y' === _data.checkLogin) {
				if ( !_this._confirmLogin() ) {
					return;
				}
			}

			var _pre = _data.precall;

			// 선처리
			if ('function' === typeof _pre) {
				if (!_pre()) {
					return;
				}
			}

			// 키와 쿼리가 있는경우 데이터 저장 후 전달
			if (undefined !== _data.key && (undefined !== _data.jsonString || undefined !== _data.json)) {
				var _setValue = _data.jsonString;

				if (undefined !== _data.json) {
					_setValue = $.extend(_setValue, _data.json);
				}

				_this._setData(_data.key, _setValue);
			}

			if( _data.replaceId != undefined && _data.target != undefined) {

				_this._getTemplate({
					key: _data.target,
					callback: function(d) {
						$(d).find('#' + _data.replaceId).replaceAll($('#' + _data.replaceId));
						ActionHandler.addEvent($('#' + _data.replaceId));

						__o.trigger('callback', [__o]);
					}
				});
			}
		});
	},

	/**
	 * 탭 데이터 로드 이벤트 핸들링
	 *
	 */
	_handleEventTabData: function(_o){
		var _this = this;

		_o.unbind('click').on('click', function(e){
			e.preventDefault();

			var __o = $(this), _data = __o.data(), _rx = new RegExp(/(.*)\[(.*)\]/), _fs = _rx.exec(_data.target);

			_this.apis[_fs[1]].execute({
				data: $.extend(_this._getData(), {field:_fs[2]}),
				callback: function(pData){
					$('#' + _data.replaceId).html(pData.data[_fs[2]]);

					if('Y' === _data.addZoom){
						var _ds = [];
						_ds.push('<div class="btn_new_win"><a href="#" class="btn">확대보기</a></div>');
						_ds = $(_ds.join(''));
						$('#' + _data.replaceId).prepend(_ds);
						_ds.unbind('click.zoom').on('click.zoom', function(e){
							e.preventDefault();
							console.log('add zoom');
							//$(this).attr('href',location.hash);
							var _type = _fs[2] === 'discountInfo' ? 'disc' : (_fs[2] === 'perfDescr' ? 'detail': ''); //disc or detail만 우선~~!!
							var _param = ActionHandler._getData();
							var gatelandingType = _param != null ? _param.gatelandingType : "";

							var _url = '/public/content/html/common/pop_zoom.html#'+_type+'?prodId='+_param.prodId;
							if(gatelandingType != null && gatelandingType != ""){
                                _url += "&gatelandingType="+ gatelandingType;
							}

							//melon 4.0
							if(mstApp.isMelon()){
								mstApp.openWebView('http://m.ticket.melon.com' + _url, __o.text());
							}else {
								if (mstApp.isApp()) {
									mstApp.openWebView('http://m.ticket.melon.com' + _url, __o.text());
								} else {
									window.open(_url);
								}
							}
						});
					}

					__o.trigger('callback', [__o]);
				}
			})
		});
	},
	/**
	 * 레이어팝업 이벤트 핸들링
	 *
	 */
	_handleEventPopup: function(_o){
		var _this = this;

		_o.unbind('click').on('click', function(e){
			e.preventDefault();

			var __o = $(this), _data = __o.data();

			// 싱글팝업 인 경우 재클릭 시 닫기
			if ('Y' === _data.single && 0 < $('[data-id="'+ _data.target +'"]').length) {
				$('[data-id="' + _data.target +'"]').remove();
				return false;
			}

			if ('Y' === _data.checkLogin && !_this._confirmLogin()) {
				return false;
			}
			
			// checkToken = 'Y'일 경우 로그인 후 토큰만료 체크
			if ('Y' === _data.checkToken) {
				isToken();
			}

			//footer영역 팝업용
			if (undefined !== _data.callback && _data.callback.length > 0){
				var _callback = _data.callback;
				setTimeout(function(){
					eval(_callback+'()');
				},200);
				//return false;
			}

			// 팝업 오픈 전 full_menu_open 클래스 제거
			$('body').removeClass('full_menu_open');

			// 키와 쿼리가 있는경우 데이터 저장 후 전달
			if (undefined !== _data.key && (undefined !== _data.jsonString || undefined !== _data.json) ) {
				var _setValue = _data.jsonString;

				if (undefined !== _data.json) {
					_setValue = $.extend(_setValue, _data.json);
				}

				_this._setData(_data.key, _setValue);
			}

			// 팝업 템플릿 가져오기
			_this._getTemplate({
				key: _data.target,
				callback: function (d) {

					var _b = $(d), _i;

					if ('Y' === _data.single) {
						_i = _data.target;
					}
					else {
						_i = 'mtkpopup_' + Date.now();
					}

			  		_b.data('active', 'Y').attr('data-id', _i);

			  		_b.find('[data-action-type=close]').on('click', function(e){
						  e.preventDefault();

						  $('[data-id="' + _i + '"]').remove();

						  // 이전 팝업들 보임처리
						  if (1 > $('[data-id^=mtkpopup]').length) {
							  $('#wrap').data('active', 'Y').show();
							  //QQQ 마지막 팝업 없어지면
							  $('html').removeClass('layer_html_control');//바닥화면 스크롤 방지 제거
							  $('body').removeClass('layer_html_control');
						  }
						  else {
//							  if(1 === $('[data-id^=mtkpopup]').length && location.hash.indexOf('event.index') > 0){ // 이벤트 case 추가
//								  $('html').removeClass('layer_html_control');
//								  $('body').removeClass('layer_html_control');
//							  }
							  $('[data-id^=mtkpopup]:last').data('active', 'Y').show();
						  }


						  if($('[data-id^=mtkpopup]:last').data('visiblepop') === 'Y'){
							  $('#wrap').show();
			  			  }

						  _this.IS_POP = false;
						  window.scrollTo(0, ActionHandler._positionY);

						  //close action이 있는 경우
						  var _closeData = $(this).data('json-string');
						  if(undefined !== _closeData){
							  if(_closeData.action === 'back'){
								  window.history.back();
							  }
							  else if(_closeData.action === 'refreshMain'){
								  //home의 top banner가 지워지는 현상 수정을 위해
								  $('#wrap_big_banner').show();
								  if(typeof mobileIndexBanner == 'function') { //방어코드 추가
									  mobileIndexBanner();
								  }
							  }else if(_closeData.action === 'scrollRefresh'){
								  if(myScroll !== undefined && myScroll != null) {
									  myScroll.refresh();
								  }
							  }else if(_closeData.action === 'scrollExecution'){
								  if($('html').hasClass('layer_html_control')){
									  $('html').removeClass('layer_html_control');
									  $('body').removeClass('layer_html_control');
								  }
							  }
						  }

						  if(document.location.href.match(/performance\.index/)!=null){
							  //상품상세의 팝업인 경우 아래것 수행

							  if(detailTabScroll !== undefined && detailTabScroll !== null){
								  var scrollTop = $(window).scrollTop();
								  var coverHeight = $('.cover_page .body').outerHeight() - 56;
								  if (scrollTop >= coverHeight ) {
									  $('#detailTab').addClass('fixed');
								  }else{
									  $('#detailTab').removeClass('fixed');
								  }
								  detailTabScroll.refresh();
							  }
						  }
					});

		  			ActionHandler._positionY = window.scrollY;

					// 최종팝업 삭제
					if ('Y' === _data.removePre) {
						$('[data-id^=mtkpopup]:last').remove();
					}

					// 최종팝업 숨기지 않을경우
					if ('Y' === _data.visiblePre) {

						var _popupStack = [];

						$('[data-id^=mtkpopup],#wrap').each(function(i, o) {
							_popupStack.push(o);
						});

						if (0 < _popupStack.length) {
							$(_popupStack[_popupStack.length -1]).show();
						}

						if(1===_popupStack.length){
							//wrap만 들어간 경우
							_b.data('visiblepop', 'Y'); //회차의 경우 #wrap 만 들어가고 첫번째 popup임
						}
					}
					// 이전 팝업들 숨김처리
					else {
						$('[data-id^=mtkpopup],#wrap').data('active', 'N').hide();
					}

					_b.appendTo('body');

					// 스크롤 불가능시 팝업 고정
					if ('N' === _data.scrollable) {
						//QQQ
						$('html').addClass('layer_html_control');
						$('body').addClass('layer_html_control');
						window.scrollTo(0,0);
					}else if('Y' === _data.scrollable){
						$('html').removeClass('layer_html_control');
						$('body').removeClass('layer_html_control');
					}

					// 사이드 메뉴 펼져진 경우 닫기
					if ($('#fullMenu').hasClass('wrap_full_menu_open')) {
						$('#fullMenu').removeClass('wrap_full_menu_open');
					}

				  	ActionHandler.addEvent(_b);

				  	// Data bind
			  		var _ds = _b.find('[data-field]').toArray();

			  		if (0 < _ds.length) {
			  			for (var i in _ds) {
			  				ActionHandler._matchFields(_ds[i] , _this._getData(_data.key));
			  			}
			  		}
				}
			});
		});
	},

	/**
	 * 아웃링크 이벤트 핸들링
	 *
	 */
	_handleEventOutLink: function(_o){
		var _this = this;

		_o.on('click', function(e){
			e.preventDefault();

			var __o = $(this), _data = __o.data();
			console.log('outlink : ' + JSON.stringify(_data));
			var _url = _data.json.url, _inAppNav = false;
			if(_url.indexOf('ticket.melon.com') > -1){
				_inAppNav = true;
			}

			//if(mstApp.isApp() && !_inAppNav) {
			//	mstApp.openWeb(_url);
			//}else{
			//	location.href = _url;
			//}

			if(_inAppNav){
				location.href = _url;
			}else{
				//melon 4.0
				if(mstApp.isMelon()){
					mstApp.openWeb(_url);
				}else {
					if (mstApp.isApp()) {
						mstApp.openWeb(_url);
					} else {
						window.open(_url);
					}
				}
			}
		});
	},
	/**
	 * 탭 이벤트 핸들링
	 *
	 */
	_handleEventTab: function(_o){
		var _this = this, _data = _o.data();

		_o.unbind('click').on('click', function(e){
			e.preventDefault();

			$('[data-group='+_data.group+']').each(function(i){
				$($(this).data('target')).hide();
			});

			$(_data.target).show();
		});

		if (true === _data.selected) {
			$(_data.target).show();
			_o.click();
		}
		else {
			$(_data.target).hide();
		}
	},
	/**
	 * 뒤로가기 이벤트 핸들링
	 *
	 */
	_handleEventHistoryBack: function(_o) {

		_o.unbind('click').on('click', function(e) {
			e.preventDefault();
//			window.history.back();
			if ( document.referrer && document.referrer.indexOf("m.ticket.melon.com") != -1 ) { 
				history.back();
			}else { 
				location.href = "http://m.ticket.melon.com";
			}
		});
	},
	/**
	 * 메뉴 이벤트 핸들링
	 */
	_handleEventMenu: function(_o) {
		var _this = this;

		_o.unbind('click').on('click', function(e) {

			e.preventDefault();

			// 메뉴 미존재 시 호출
			if ( 0 === $('#fullMenu').length) {

				_this._getTemplate({
					key: '/menu/index.html',
					callback: function(d) {
						var _tgtDom = $(d);

						// 로그인 사용자 헤더표시
						if (_this._checkLogin()) {
							//_tgtDom.find('.wrap_login_off').remove();
							_tgtDom.find('.wrap_login_off').hide();

							_tgtDom.find(".wrap_login_menu").css("display","block");
							_tgtDom.find(".wrap_full_menu").css("top","128px");
						}
						// 비로그인 사용자 헤더표시
						else {
							//_tgtDom.find('.wrap_login_on').remove();
							_tgtDom.find('.wrap_login_on').hide();
							_tgtDom.find('.btn_login').on('click', function(e) {
								e.preventDefault();
								_this._moveLogin();
								setCookie("cbo","0", 0, "/", ".melon.com");
							});
						}

						_tgtDom.appendTo('body');
						_tgtDom.find('.wrap_login_on .name').text(getMemberNickName());

						var wrapTarget = $("#wrap");
						var menuHeight = $("#fullMenu").height();
						var fixedBottomHeight = $("#fixed_bottom").height();

						$("body").toggleClass("full_menu_open");
						$("#fullMenu").toggleClass("wrap_full_menu_open");
						$(".btn_menu, .btn_menu2, #fullMenu .btn_page_close").unbind('click').on('click', function(e){
							e.preventDefault();

							$("body").toggleClass("full_menu_open");
							$("#fullMenu").toggleClass("wrap_full_menu_open");

							if (_this._checkLogin()) {
								_tgtDom.find('.wrap_login_off').hide();
								_tgtDom.find('.wrap_login_on').show();
								_tgtDom.find(".wrap_login_menu").css("display","block");
								//_tgtDom.find(".wrap_full_menu").css("top","128px");
							}
							// 비로그인 사용자 헤더표시
							else {
								_tgtDom.find('.wrap_login_on').hide();
								_tgtDom.find('.wrap_login_off').show();
								_tgtDom.find('.btn_login').unbind('click').on('click', function(e) {
									e.preventDefault();
									_this._moveLogin();
								});
							}
						});

						// 메뉴 선택 핸들링 이슈로 click 옵션 추가
						myScrollMnu = new IScroll('#fullMenu .wrap_full_menu', {disablePointer: true, mouseWheel: true, click: true});

						$('#btnLogout').on('click', function(e){
							e.preventDefault();
							
							var isLogout = false; // logout -> setting  event change
							if(isLogout){
								if(mstApp.isApp()) {
									mstApp.unregDevice(getMemberId(), getMemberKey());
									mstApp.kakaoLoginDelResult();
									mstApp.autoLoginAccountDel(getMemberId(), getMemberToken(), '');
								}
								if(location.href.indexOf('ticket.index') > 0
										|| location.href.indexOf('pushnotice.index') > 0){
									//logout('03', location.href.substring(0, location.href.indexOf('#')));
									tktLogout('03', location.href.substring(0, location.href.indexOf('#')), 'menu');
								}else{
									//logout('03', location.href);
									tktLogout('03', location.href, 'menu');
									//setting.index인 경우 login area를 refresh 해 줘야 한다.
									if(location.href.indexOf('setting.index') > -1){
										redrawLogin();
									}
								}
								//dispLoginHeader();
							}else{
								content.load('setting.index');
							}
						});

						//melon 4.0
						if(mstApp.isMelon()){
							$('#btnLogout').hide();
						}

						_this.addEvent(_tgtDom);
					}
				});
			}
			else if(0 < $('#fullMenu').length) {
				$('#fullMenu').addClass('wrap_full_menu_open');
			}

			// iScroll 이슈로 refresh
			setTimeout(function() {
				myScrollMnu.refresh();
			}, 200);
			
			$('.wrap_login_on .name').text(getMemberNickName());
		});
	},
	/**
	 * 가고싶어요 이벤트 핸들링 (기본 로그인 체크함)
	 */
	_handleEventFavorite: function(_o){
		var _this = this;

		_o.unbind('click').on('click', function(e){
			$(this).blur();
			if (!_this._confirmLogin()) {
				return false;
			}

			var _opt = {};
			//_opt.data = _o.data('json-string');
			_opt.data = JSON.parse(_o.attr('data-json-string'));
			var stateFlg = _opt.data.stateFlg;//json-string에 상품 stateFlg추가

			if(undefined !== stateFlg && null !== stateFlg
					//&& (stateFlg == STATE_FLG_05 || stateFlg == STATE_FLG_06)){
				&&  stateFlg == STATE_FLG_06){ //판매중지의 경우는 가능하게 수정 20160502
				//toggel request는 보내지 말고, toast만 보여준다.

				var _do = $('<div></div>'), _dc = _do.clone(), _cf = $('<span></span>'), _cs = _cf.clone();
				_do.addClass('layr_alert_heart');
				_cf.addClass('first');
				_cs.addClass('last');

				_dc.addClass('layr_comment_on');
				//_cf.text('판매가 종료되어 추가할 수 없습니다.');
				_cs.text('판매가 종료되어 추가할 수 없습니다.');

				//_cf.appendTo(_dc);
				_cs.appendTo(_dc);
				_dc.appendTo(_do);

				_this.toast(_do);

				return;
			}
			_opt.callback = function (d) {
				if (0 === d.result) {
					var _do = $('<div></div>'), _dc = _do.clone(), _cf = $('<span></span>'), _cs = _cf.clone();
					_do.addClass('layr_alert_heart');
					_cf.addClass('first');
					_cs.addClass('last');

					if (_o.hasClass('on')) {
						_dc.addClass('layr_comment_off');
						_cf.text('공연플래너 담기 취소');
						_cs.text('공연플래너에서 삭제되었습니다.');

						_o.removeClass('on').addClass('off');
						_o.text('공연플래너 담기');

					}
					else {

						//state flg값 확인
						if(undefined !== stateFlg && null !== stateFlg
								&& stateFlg == STATE_FLG_06){
							//담기 불가 메세지
							_dc.addClass('layr_comment_on');
							_cf.text('판매가 종료되어 추가할 수 없습니다.');

						}else{

							_dc.addClass('layr_comment_on');
							_cf.text('공연플래너 담기 완료!');
							_cs.text('For U에서 공연플래너를 확인하세요.');

							_o.removeClass('off').addClass('on');
							_o.text('공연플래너');
						}
					}

					_cf.appendTo(_dc);
					_cs.appendTo(_dc);
					_dc.appendTo(_do);

					_this.toast(_do);
				}
			};

			_this.apis["performance.toggleFavorite"].execute(_opt);
		});
	},

	/**
	 * Push Notice 알림 유무
	 */
	_handleEventPush: function(_o) {

		var _this = this;

		// 푸시 존재여부 확인
		_this.apis['push.getTotalCnt'].execute({
			callback: function(d) {

				var _tgtDom = $('#pushCount');
				if (undefined !== d.data && 0 < d.data.totalCnt) {
					_tgtDom.fadeIn(200, function() {
						_tgtDom.text(d.data.totalCnt);
					});
				}else{
					_tgtDom.hide();
					_tgtDom.text('');
				}

				// 이벤트 핸들링
//				_o.unload('click').on('click', function(e) {
				_o.unbind('click').on('click', function(e) {
					e.preventDefault();

					if (!_this._confirmLogin()) {
						return false;
					}

					content.load('pushnotice.index');
				});
			}
		});
	},

	//QQQ alert type 추가
	_handleEventAlert: function(_o){
		var _data = _o.data();
		_o.unbind('click').on('click', function(e){
			if(_data.json!==undefined&&_data.json.message!==undefined){
				ActionHandler.alert(_data.json);
			}
		});
	},

	/**
	 * forU 아티스트 이벤트 핸들링 (기본 로그인 체크함)
	 */
	_handleEventForUArtist: function(_o) {
		var _this = this, _data = _o.data();

		_o.unbind('click').on('click', function(e) {

			if (!_this._confirmLogin()) {
				return false;
			}

			var _opt = {};

			if (undefined !== _data.jsonString || undefined !== _data.json) {
				var _setValue = _data.jsonString;

				if (undefined !== _data.json) {
					_setValue = $.extend(_setValue, _data.json);
				}

				_opt.data = _setValue;
			}

			var _ch,  _t = this.type;
			/*if( _t === 'submit' ) {
				// 인물상세 상단 ForU 아티스트 추가 버튼
				_ch = _o.hasClass('off');
			}
			if ( _t === 'checkbox' ) {
				_ch = this.checked;
			}*/

			_opt.callback = function (d) {
				if (0 === d.result) {
					var _ds = [];
					_ds.push('<div class="layr_alert_foru">');
					_ds.push('<div class="layr_comment_on">');
					if ( d.data === 'Y' ) {
						_ds.push('<span class="first">나의 취향에 추가되었습니다.</span>');
						_ds.push('<span class="last">For U에서 확인하세요.</span>');

						if( _t === 'submit' ) {
							_o.removeClass('off').addClass('on');
							_o.html('foru 아티스트 해제');
						}

						if ( _t === 'checkbox' ) {
							_o.checked = true;
						}
					} else {
						_ds.push('<span class="first">나의 취향 아티스트에서</span>');
						_ds.push('<span class="first">삭제되었습니다.</span>');

						if( _t === 'submit' ) {
							_o.removeClass('on').addClass('off');
							_o.html('ForU 아티스트 추가');
						}

						if ( _t === 'checkbox' ) {
							_o.checked = false;
						}
					}

					_ds.push('</div>');
					_ds.push('</div>');

					_this.toast($(_ds.join('')));
				}
			};

			_this.apis["forU.toggleRecmdArtist"].execute(_opt);

		});
	},

	/**
	 * 토스트 출력
	 *
	 * @param pBox - 토스트 출력할 Dom 객체 또는 String
	 * @param pCallback - 토스트 출력 후 실행할 콜백
	 */
	toast: function(pBox, pCallback) {
		var _this = this;
		if (null != pBox && !_this._floatToast) {

			if ('string' === typeof pBox) {
				var _dl = [];

				_dl.push('<div class="tst_msg">');
				_dl.push('<div class="tst_alert"><div>'+pBox+'</div></div>');
				_dl.push('</div>');

				pBox = $(_dl.join(''));
			}

			pBox.css({'display':'none','z-index':999999999});
			pBox.appendTo('body');

			pBox.fadeIn(200, function(e){
				_this._floatToast = true;

				setTimeout(function() {
					pBox.fadeOut(300, function(){
						pBox.remove();

						if ('function' === typeof pCallback) {
							pCallback();
						}

						_this._floatToast = false;
					});
				}, 1500);
			});
		}
	},

	/**
	 * 레이어 컨펌박스
	 *
	 * @param pOption.message - 안내 메시지
	 * @param pOption.callback - 버튼 핸들링 콜백
	 */
	confirm: function(pOption) {
		var _this = this;

		_this._getTemplate({
			key: '/common/pop_confirm.html',
			callback: function(d) {
				var _b = $(d);

				// 메시지 등록
				_b.find('#confirmContent').html(pOption.message);

				// 취소버튼 핸들링
				_b.find('#btnCancel').on('click', function() {
					pOption.callback(false);
					_b.remove();
				});

				// 확인버튼 핸들링
				_b.find('#btnOk').on('click', function() {
					if ('function' === typeof pOption.callback) {
						pOption.callback(true);
					}
					_b.remove();
				});

				//버튼 label 변경
				if(pOption.labelOK != undefined){
					_b.find('#btnOk').text(pOption.labelOK);
				}
				if(pOption.labelCancel != undefined){
					_b.find('#btnCancel').text(pOption.labelCancel);
				}

				_b.appendTo('body');
			}
		})
	},
	/**
	 * 레이어 얼럿박스
	 *
	 * @param pOption.message - 안내 메시지
	 * @param pOption.callback - 버튼 핸들링 콜백
	 */
	alert: function(pOption) {
		var _this = this;

		_this._getTemplate({
			key: '/common/pop_alert.html',
			callback: function(d) {
				var _b = $(d);

				// 메시지 등록
				_b.find('#confirmContent').html(pOption.message);

				// 확인버튼 핸들링
				_b.find('#btnOk').on('click', function() {
					if ('function' === typeof pOption.callback) {
						pOption.callback(true);
					}

					_b.remove();
				});

				//버튼 label 변경
				if(pOption.label != undefined){
					_b.find('#btnOk').text(pOption.label);
				}

				_b.appendTo('body');
			}
		});
	},

	/**
	 * 더보기 이벤트 핸들링
	 *
	 * @param pOption.target - more 대상 객체
	 * @param pOption.callback - more 이벤트 발생 시 실행할 콜백
	 */
	more: function(pOption) {

		var _this = this, _tgtObj, _isWindow = false;

		if(_this.IS_POP){
			return;
		}

		// 윈도우 스크롤 / Dom 스크롤 구분
		if ('[object Window]' === pOption.target.toString()) {
			_tgtObj = $(window);
			_isWindow = true;
		}
		else {
			_tgtObj = $(pOption.target);
			 _isWindow = false;
		}

		// 바인딩 시 호출플래그 초기화
		_this._moreCalled = false;

		// 스크롤 시 더보기 핸들링
		_tgtObj.unbind('scroll').on('scroll', function(e) {

			var _isMoreArea = false, _cal, _docHeigh;

			if (_isWindow) {
				_docHeight = $(document).height();
				_cal = _docHeight - (window.innerHeight + window.scrollY);
			}
			else {
				_docHeight = $(this).height();
				_cal = (e.target.scrollHeight - _docHeight) - e.target.scrollTop;
			}

			if ((_docHeight*_this._bottomRate) > _cal) {
				_isMoreArea = true;
			}
			else {
				_isMoreArea = false;
			}

			if (!_isMoreArea && _this._moreCalled) {
				_this._moreCalled = false;
			}

			if (_isMoreArea && !_this._moreCalled) {
				_tgtObj.trigger('more');
			}
		});

		_tgtObj.unbind('more').on('more', function() {
			if ('function' === typeof pOption.callback) {
				 pOption.callback();
				_this._moreCalled = true;
			}
		});
	},
	/**
	 * 로그인 체크
	 */
	_checkLogin: function() {
		//var _keys = ["MAC", "MHC", "MUAC", "MUNIK", "MLCP", "MUS"];
        //
		//for (var i = 0; i < _keys.length; i++){
		//	if (!(new RegExp(_keys[i] + "=.+\s?")).test(document.cookie)) {
		//		return false;
		//	}
		//}
        //
		//return true;
		return isMelonLogin();
	},
	/**
	 * 로그인 확인
	 */
	_confirmLogin: function(returnPage) {
		var _this = this;

		if (_this._checkLogin()) {
			return true;
		}

		if (null == returnPage || "" === returnPage) {
			returnPage = escape(document.location.href);
		}
//		else {
//			returnPage = document.location.pathname + '#' + returnPage;
//		}

		//melon 4.0
		if(mstApp.isMelon()){
			//popup skip
			ActionHandler._moveLogin();
		}else {
			_this.confirm({
				message: '로그인이 필요합니다.<br/>로그인페이지로 이동하시겠습니까?',
				callback: function (d) {
					if (d) {
						ActionHandler._moveLogin();
					}
					else {
						return false;
					}
				}
			});
		}
//
//		if (confirm("로그인이 필요합니다. 로그인페이지로 이동하시겠습니까?")) {
//			_this._moveLogin();
//		}
//		else {
//			return false;
//		}
	},

	/**
	 * 로그인 확인
	 */
	_confirmLoginAft: function(returnPage) {
		var _this = this;

		if (_this._checkLogin()) {
			return true;
		}

		if (null == returnPage || "" === returnPage) {
			returnPage = escape(document.location.href);
		}

		//melon 4.0
		if(mstApp.isMelon()){
			//popup skip
			ActionHandler._moveLoginAft(returnPage);
		}else {
			_this.confirm({
				message: '로그인이 필요합니다.<br/>로그인페이지로 이동하시겠습니까?',
				callback: function (d) {
					if (d) {
						ActionHandler._moveLoginAft(returnPage);
					}
					else {
						return false;
					}
				}
			});
		}
	},
	/**
	 * 속성에 따른 이벤트 추가
	 */
	addEvent: function(t) {
		var _this = this;

		$('[data-action-type]', (t ? t: document)).each(function(i){

			var _o = $(this), _type = _o.data('action-type');

			switch (_type) {
			case ActionHandler.ACTION_TYPE_LINK :
				_this._handleEventLink(_o);
				break;

			case ActionHandler.ACTION_TYPE_TAB_LOAD :
				_this._handleEventTabLoad(_o);
				break;

			case ActionHandler.ACTION_TYPE_TAB_DATA :
				_this._handleEventTabData(_o);
				break;

			case ActionHandler.ACTION_TYPE_POPUP :
				_this._handleEventPopup(_o);
				break;

			case ActionHandler.ACTION_TYPE_TAB :
				_this._handleEventTab(_o);
				break;

			case ActionHandler.ACTION_TYPE_HISTORYBACK:
				_this._handleEventHistoryBack(_o);
				break;

			case ActionHandler.ACTION_TYPE_MENU:
				_this._handleEventMenu(_o);
				break;

			case ActionHandler.ACTION_TYPE_FAVORITE:
				_this._handleEventFavorite(_o);
				break;

			case ActionHandler.ACTION_TYPE_FORU_ARTIST:
				_this._handleEventForUArtist(_o);
				break;

			case ActionHandler.ACTION_TYPE_PUSH:
				_this._handleEventPush(_o);
				break;

			case ActionHandler.ACTION_TYPE_ALERT:
				_this._handleEventAlert(_o);
				break;

			case ActionHandler.ACTION_TYPE_OUTLINK:
				_this._handleEventOutLink(_o);
				break;
			default:
				//console.log('Not Supported Type! %s', _type);
			;
			}

		});
	},

	_matchFields: function(pElem, pData) {

		var  _o = $(pElem), _v = _o.data('field'), _a = _v.split('!'), _t = _a[0], _f = _a[1];

		switch (_t) {
		case 'img':
		{
			var _ea ='';
			if (undefined !== _o.attr('width') && undefined !== _o.attr('height')) {
				_ea = '/melon/resize/' + _o.attr('width') + 'x' + _o.attr('height');
			}

			if (undefined !== pData && undefined !== pData[_f]) {
				_o.attr('src', 'http://'+ (/\/cm?\//.test(pData[_f]) ? ActionHandler.HOST_CDN_IMG : ActionHandler.HOST_CDN) + pData[_f] + _ea);
			}

			if (undefined === _o.attr('onerror')) {
				_o.on('error', _o.attr('onerror'));
			}
		}
			break;

		case 'text' :
		{
			if (undefined !== pData && undefined !== pData[_f]) {
				_o.text(unescape(pData[_f]));
			}
		}
			break;

		case 'html' :
			if (undefined !== pData && undefined !== pData[_f]) {
				var _convert = pData[_f];
				if (undefined !== _convert) {
					_convert = _convert.replace(/\r/g, '<br/>');
				}

				_o.html(_convert);
			}
			break;

		case 'json.list' :

			if(undefined !== pData && undefined !== pData[_f] && '' !== pData[_f]) {
				_o.attr('data-json-string', pData[_f]);

				var _ls = _o.data('json-string'), _lt = _o.children();

				if (0 < _ls.data.listCount) {
					for (var i in _ls.data.list) {
						var _tm = _lt.clone();
						_ds = $('[data-field]', _tm).toArray();

						for (var j in _ds) {
							ActionHandler._matchFields(_ds[j], _ls.data.list[i]);
						}

						_tm.appendTo(_o);
					}
					// 템플릿 삭제
					_lt.remove();
				}
				else {

				}
			}

			break;

		case 'attr' :
			var _rx = new RegExp(/(.*)\[(.*)\]/), _fs = _rx.exec(_f);

			if (1 > _fs.length) {return false;}

			if ('json-string' === _fs[1]) {
				var _at = _fs[2].split(','), _qs = {};
				for (var j in _at) {
					var _f = _at[j];

					if (undefined !== pData && undefined !== pData[_f]) {
						_qs[_f] = pData[_f];
					}
				}

				_o.attr('data-json-string', JSON.stringify(_qs));
			}
			else {

			}

			break;

		case 'css.background':
			{
				//var _hn = '';
				//// 백그라운드 이미지
				//if (undefined !== pData) {
				//	if (undefined !== pData[_f] && null !== pData[_f] && '' !== pData[_f] && null !== pData[_f].match(/^\//)) {
				//		if (-1 < pData[_f].indexOf('/cm')) {
				//			_hn = ActionHandler.HOST_CDN_IMG;
				//		}
				//		else {
				//			_hn = ActionHandler.HOST_CDN;
				//		}
                //
				//		var _res = _o.attr('data-res') != undefined ? _o.attr('data-res').split('x') : [0,0];
				//		var _bgImg = new Image(_res[0],_res[1]);
				//		_bgImg.src = 'http://' + _hn + pData[_f] + '/melon/resize/'+_o.attr('data-res')+'/strip/true';
				//		//_bgImg.src = 'http://' + _hn + pData[_f];
				//		_bgImg.onload = function(){
				//			_o.css('background-image', 'url('+_bgImg.src+')');
				//		};
				//		_bgImg.onerror = function(){
				//			// 이미지 로딩 실패 처리
				//			//var _tmpImg = new Image();
				//			//_tmpImg.src = 'http://' + _hn + pData[_f];
				//			//_tmpImg.onerror = function() {
				//				// 이미지 로딩 실패시 NoImage 처리
				//				if (undefined !== _o.attr('onerror')) {
				//					_o.css('background-image', 'url("http://cdnticket.melon.co.kr' + _o.attr('onerror') + '")');
				//				}
				//			//};
				//		};
                //
				//		//_o.css('background-image', 'url("http://' + _hn + pData[_f] + '")');
				//	}
				//	else {
				//		_o.css('background-image', 'url("http://cdnticket.melon.co.kr'+ _o.attr('onerror') +'")');
				//	}
				//}
				var _hn = '';
				// 백그라운드 이미지
				if (undefined !== pData) {
					if (undefined !== pData[_f] && null !== pData[_f] && '' !== pData[_f] && null !== pData[_f].match(/^\//)) {
						if (-1 < pData[_f].indexOf('/cm')) {
							_hn = ActionHandler.HOST_CDN_IMG;
						}
						else {
							_hn = ActionHandler.HOST_CDN;
						}

						_o.css('background-image', 'url("http://' + _hn + pData[_f] + '")');

						// 이미지 로딩 실패 처리
						var _tmpImg = new Image();
						_tmpImg.src = 'http://' + _hn + pData[_f];
						_tmpImg.onerror = function() {
							// 이미지 로딩 실패시 NoImage 처리
							if (undefined !== _o.attr('onerror')) {
								_o.css('background-image', 'url("http://cdnticket.melon.co.kr' + _o.attr('onerror') + '")');
							}
						};
					}
					else {
						_o.css('background-image', 'url("http://cdnticket.melon.co.kr'+ _o.attr('onerror') +'")');
					}
				}
			}
			break;

		default:

			break;
		}

		_o.attr('data-field', null);
	},
	/**
	 * API Call, SPA 페이지 로드 후 스크립트에서 실행
	 *
	 * pOption.data - Api 파라메터
	 * pOption.callback - 콜백 함수
	 *
	 */
	_executeAction: function(pOption) {
		document.domain = 'melon.com';

		var _this = this, _ap = ActionHandler.apis[_this.name], _pd, _ul, _opt;

		if (null == _ap) {
			alert('Undefined Action.');
			return false;
		}

		switch (_ap.type) {
		case ActionHandler.API_TYPE_POC:
			{
				if(_this.name !== 'member.realInfo'){
					_ul = 'http://'+ ActionHandler.HOST_TKT_API +'/'+ActionHandler.API_TYPE_POC+'/'+ _this.name.replace(/\./g, '/') +'.json';
				}else{
					_ul = 'https://'+ ActionHandler.HOST_TKT_POC_API +'/'+ _this.name.replace(/\./g, '/') +'.json';
				}
			}
			break;

		case ActionHandler.API_TYPE_API:
			{
				_ul = 'http://'+ ActionHandler.HOST_TKT_API +'/'+ActionHandler.API_TYPE_API+'/'+ _this.name.replace(/\./g, '/') +'.json';
			}
			break;

		case ActionHandler.API_TYPE_CMT:
			{
				_ul = 'http://'+ ActionHandler.HOST_CMT_API +'/cmt/'+ _this.name.replace(/\./g, '/') +'.json';
			}
			break;

		case ActionHandler.API_TYPE_CST:
			{
//				_ul = 'https://'+ ActionHandler.HOST_TKT_API +'/'+ _this.name.replace(/\./g, '/');
				_ul = 'https://'+ ActionHandler.HOST_PROXY_API +'/'+ _this.name.replace(/\./g, '/');
				
			}
			break;

		case ActionHandler.API_TYPE_MED:
			{
				_ul = 'http://'+ ActionHandler.HOST_MEDIA_API +'/'+ _this.name.replace(/\./g, '/') +'.json';

				// 기본키값 세팅
				_pd = $.extend((undefined !== pOption.data) ? pOption.data : {}, {key: ActionHandler.API_KEY_MEDIA});
			}
			break;

		case ActionHandler.API_TYPE_MEB:
			{
				_ul = 'https://'+ ActionHandler.HOST_MEMBER +'/muid/family/'+ _this.name.replace(/\./g, '/') +'.json';
			}
			break;

		case ActionHandler.API_TYPE_MEL:
			{
				_ul = 'http://'+ ActionHandler.HOST_MELON_API +'/cds/support/'+ _this.name.replace(/\./g, '/') +'.json';
			}
			break;

		case ActionHandler.API_TYPE_IMG:
			{
				_ul = 'http://'+ ActionHandler.HOST_UPLOAD_API +'/'+ _this.name.replace(/\./g, '/') +'.php';
			}
			break;
		case ActionHandler.API_TYPE_LOG:
			{
				_ul = 'http://'+ ActionHandler.HOST_TKT_API +'/log/'+ _this.name.replace(/\./g, '/') +'.json';
			}
				break;
		case ActionHandler.API_TYPE_PV:
			{
				_ul = '/'+ActionHandler.API_TYPE_PV + '/' + _this.name.replace(/\./g, '/') +'.json';
			}
				break;
		}

		_pd = $.extend((undefined !== pOption.data) ? pOption.data: ActionHandler._getData(), (_this.version ? {v: _this.version}: {}));

		// Call Option - 미디어 API 지원 안함.
		_opt = {
				url: _ul,
				dataType: ('get' === _ap.method &&
						(_ap.type !== ActionHandler.API_TYPE_MED &&
						_ap.type !== ActionHandler.API_TYPE_POC &&
						_ap.type !== ActionHandler.API_TYPE_API &&
						_ap.type !== ActionHandler.API_TYPE_PV &&
						_ap.type !== ActionHandler.API_TYPE_LOG)) ? 'jsonp': 'json',
				type: 'get' === _ap.method ? 'get': 'post',
				data: _pd,
				timeout: 5000,
				crossDomain: true,
				xhrFields: {withCredentials: true}, // 쿠키 전송을 위해 활성화
				success: function(d){
					if ((_ap.type === ActionHandler.API_TYPE_POC && 0 === d.result) ||
						(_ap.type === ActionHandler.API_TYPE_API && '0000' === d.code) ||
						(_ap.type === ActionHandler.API_TYPE_CMT && "0" === d.STATUS)) {

//						$('#wrap').show();
					}
					else {

						if (_ap.type === ActionHandler.API_TYPE_POC) {
							// 1 이외의 오류 코드만 노출한다.
							if (1 !== d.result) {
								// ActionHandler.toast(d.message);
							}

							// 상품관련 오류시 홈으로 이동
							if (1000 === d.result) {
								/*
								ActionHandler.toast(d.message, function() {
									content.load('home.index');
								});
								*/
							}
						}
						else if (_ap.type === ActionHandler.API_TYPE_API) {
							ActionHandler.toast(d.message);
						}
						else if (_ap.type === ActionHandler.API_TYPE_CMT) {
							ActionHandler.toast(d.ERRORMESSAGE);
						}
					}

					if ('function' === typeof pOption.callback) {
						pOption.callback(d);
					}
				},
				failure: function(d) {
					alert('error');
				}
			};

		try {
			// 댓글등록의 경우 터널사용.
			if (_ap.type == ActionHandler.API_TYPE_CMT && 'post' === _ap.method) {

				var isNewFrame = false;
			    var iframeObj = $("#d_cmtpgn_tunnel_frame");
			    if (iframeObj.length === 0) {
			        iframeObj = $('<iframe id="d_cmtpgn_tunnel_frame" name="d_cmtpgn_tunnel_frame" src="javascript:false;" style="width:0; height:0; border:0;display:none;"></iframe>');
			        iframeObj.appendTo($("body"));
			        isNewFrame = true;
			    }

		        if (isNewFrame === true) {
		            iframeObj.bind("load", function() {
		                iframeObj[0].contentWindow.sendBack(_opt);
		            });
		            iframeObj.attr("src", "http://cmt.melon.com/cmt/plugin/template/melonweb_cmtpgn_tunnel.html");

		        } else {
		            iframeObj[0].contentWindow.sendBack(_opt);
		        }
			}
			else {
				$.ajax(_opt);
				//error handling
//				var error = function(jq,status,message){
//					console.log('ajax error called:')
//					if(jq.readyState == 0){
//						ActionHandler.alert({message:"해당 페이지의 접속이 지연되고 있습니다. 네트워크 연결 상태를 확인하거나, 잠시 후 다시 이용해주세요."});
//					}
//				};
//				$.ajax($.extend(_opt,{error: error}));

			}

		} catch (e) {console.log(e);alert(e)}
	},
	/**
	 * 대상 엘레멘트에 데이터 매핑
	 *
	 * pOption.data - Api 파라메터
	 * pOption.target - 매핑 대상 엘레멘트
	 * pOption.callback - 콜백 함수
	 */
	_bindData: function(pOption) {

		var _this = this, _ds = $('[data-field]', ((undefined !== pOption.target) ? pOption.target: document)).toArray();

		var _opt = {data: pOption.data, callback: function(pData){
			var _d = pData.data;
				if ( _d != null && _d.constructor === Array ) {
					_d = pData.data[0];
				}
				for (var i in _ds) {
					ActionHandler._matchFields(_ds[i], _d);
				}
				// 콜백함수 추가 실행
				if ('function' === typeof pOption.callback) {
					pOption.callback(pData);
				}
			}
		};

		_this.execute(_opt);
	},
	/**
	 * ActionHandler 초기화
	 */
	init: function(){
		var _this = this, _rx = new RegExp(/(.*)\[(.*)\]/);

		_this = $.extend(_this, _this._statics);

		for (var i in _this._statics.API_SPECS) {
			var _as = _this._statics.API_SPECS[i];

			for (var j in _as.list) {
				var _sa = _rx.exec(_as.list[j]), _sk = _sa[1], _sf = _sa[2].split(',');

				_this.apis[_sk] = {};
				_this.apis[_sk].name = _sk;
				_this.apis[_sk].type = _as.type;
				_this.apis[_sk].method = _sf[0];
				_this.apis[_sk].version = _sf[1];
				_this.apis[_sk].execute = _this._executeAction;
				_this.apis[_sk].bindData = _this._bindData;
			}
		}

		_this._statics = null;

		window.onhashchange = function(e) {

			// 스크롤 고정 해제
			//QQQ
			$('html').removeClass('layer_html_control');
			$('body').removeClass('layer_html_control full_menu_open');

			// 스크롤 이벤트 해제
			$(window).unbind('scroll');
		};

		var popped = ('state' in window.history), initialURL = location.href

		// Back, Forward 버튼 핸들링
		window.onpopstate = function(e) {
			var initialPop = !popped && location.href == initialURL;
			popped = true;
			if ( initialPop ) return;

			if (null === location.hash.match(/home.index|index$/) ) {

				// 데이터 세팅이 되지 않은 경우
				if (undefined === e.state) {
					return false;
				}

				// 링크 이벤트로 진입 여부 확인
				if (_this._isIntoEventLink) {
					return _this._isIntoEventLink = false;
				}

				var _target, _data;

				// 이동 타겟 설정
				try {
					_target = e.state.target;
				}
				// SPA 이동경로가 아닌경우
				catch(e) {
					_target = document.location.hash.split('#');

					if (1 < _target.length){
						_target = _target[1];
						_target = _target.split('?');

						if (1 < _target.length) {
							_target = _target[0];
						}
					}
				}

				// 데이터 설정
				try {
					_data = e.state.data;
				}
				// SPA 이동경로가 아닌경우
				catch(e) {
					//var _tmpHash = document.location.hash.split('?'),
					//	_tmpData = {},
					//	_tmpQuery = (undefined !== _tmpHash[1]) ? _tmpHash[1].split('&') : null,
					//	_tmpPair;
                    //
					//if (null !== _tmpQuery) {
					//	$.each(_tmpQuery, function(i, o) {
					//		_tmpPair = o.split('=');
					//		_tmpData[_tmpPair[0]] = _tmpPair[1];
					//	});
					//}
                    //
					//_data = _tmpData;

					_data = getParams();
				}

				ActionHandler._setData(_target, _data);

				var hashConfiged = false;
				for ( var key in map_config) {
					if (_target === map_config[key]["alias"]) {
						hashConfiged = true;
						break;
					}
				}
				if (hashConfiged) {
					// 이동 전 fix 클래스 제거
					$('body').removeClass('fix fix_menu');

					content._procHashData(_target);
				}

				var _paramString = '', _params = [];

				setTimeout(function() {

					var _url = document.location.origin +
							   document.location.pathname +
							   '#' +
							   document.location.hash.split('#')[1];

					window.history.replaceState({
						target: _target,
						data: _data},
						'', _url);
				}, 10);

			}else{

			}
		}
	}
};

/**
 * ActionBuilder
 */
var ActionBuilder = function() {
		this._attrs = {};
		this._json = {};

		this.setActionType = function(pActionType) {
			this._attrs["data-action-type"] = pActionType;
		};
		this.setTarget = function(pTarget) {
			this._attrs["data-target"] = pTarget;
		};
		this.setReplaceId = function(pActionType) {
			this._attrs["data-replace-id"] = pActionType;
		};
		this.setKey = function(pKey) {
			this._attrs["data-key"] = pKey;
		};
		this.setJsonString = function(pJsonString) {
			this._attrs["data-json-string"] = ActionHandler._encode(pJsonString);
		};
		this.setCheckLogin = function(pIsCheck) {
			this._attrs["data-check-login"] = pIsCheck;
		};
		this.setCallback = function(pCallback) {
			this.callback = pCallback;
		};
		this.setRemovePre = function(pRemovePre) {
			this._attrs["data-remove-pre"] = pRemovePre;
		};
		this.setVisiblePre = function(pVisiblePre) {
			this._attrs["data-visible-pre"] = pVisiblePre;
		};
		this.setScrollable = function(pScrollable) {
			this._attrs["data-scrollable"] = pScrollable;
		};
		this.setLink = function(pLink) {
			this._attrs["data-link"] = pLink;
		};
		this.setJson = function(pData) {
			this._json = pData;
		};
		this.setCss = function(pCss) {
			var _cs = [];
			for (var i in pCss) {
				_cs.push(i + ':' + pCss[i]);
			}
			this._attrs["style"] = _cs.join(';');
		};
		this.setSingle = function(pSingle) {
			this._attrs["data-single"] = pSingle;
		};
		this.setCheckToken = function(pIsCheck) {
			this._attrs["data-check-token"] = pIsCheck;
		};
		this.toString = function() {
			var _this = this, _aa = [];
			$.each(_this._attrs, function(i, o) {

				if ('data-json-string' === i) {
					_aa.push(i + '=' + JSON.stringify(o));
				}
				else {
					_aa.push(i + '="' + o +'"');
				}
			});
			if (0 < _aa.length) {
				return _aa.join(' ');
			}
		};
		this.parse = function() {

		};
		this.bind = function(pElement, pCallback) {
			if (undefined === pElement) {
				return false;
			}

			var _this = this;
			$.each(_this._attrs, function(i, o) {

				if ('data-json-string' === i) {
					pElement.attr(i, JSON.stringify(o));
				}
				else if ('data-link' === i) {
					pElement.attr({'href': o, 'target': '_blank'});
				}
				else {
					pElement.attr(i, o);
				}
			});
			if (undefined !== _this.callback && 'function' === typeof _this.callback) {
				pElement.unbind('callback').on('callback', _this.callback);
			}

			if (undefined !== this._json) {
				$(pElement).data('json', this._json);
			}

			if ('function' === typeof pCallback) {
				pCallback();
			}

			ActionHandler.addEvent(pElement.parent());
		};
};
ActionHandler.init();
