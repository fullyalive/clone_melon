/**
 * 예약 액션 관리
 */
define(['model/performance.model',
        'model/reserve.model',
        'model/member.model',
		'action/timer.action',
        'util/jsonUtils',
        'util/stringUtils',
		'model/logging.model',
		'action/prersrv.action'],
function(PerformanceModel,
		ReserveModel,
		MemberModel,
		TimerAction,
		JsonUtils,
		StringUtils,
		Logger,
		PreRsrvAction) {

	/** 인증 타입 - 실명인증 */
	var AUTH_TYPE_REAL = 'charge';//본인인증
	/** 인증 타입 - 성인인증 */
	var AUTH_TYPE_ADULT = 'juvenileProtection';

	var performanceModel = new PerformanceModel();
	var reserveModel = new ReserveModel();
	var memberModel = new MemberModel();

	// 스텝 진행용 실명인증여부 플래그
	var isCheckAuth = false;
	// 스텝 진행용 성인인증여부 플래그
	var isCheckAdult = false;
	// 스텝 진행용 성인여부 플래그
	var isAdult = false;

	//// 실명인증 스텝 진행 후 설정할 실명인증 여부값
	//var checkAuthValue = 'N';
	//// 성인인증 스텝 진행 수 설정할 성인인증 여부값
	//var checkAdultValue = 'N';

	//var authCheckUrl = '';

	//
	var prodInfo = {};

	var ReserveAction = null;

	var isPreReserveAble = false;//QQQ 임시로 추가

	var AUTH_RSRV_YN = 'N';		// 인증예매[CAPTCHA] 여부값

	/**
	 * 공연 예매 선택용 카렌다 생성
	 *
	 * @param pOption
	 * @returns
	 */
	var _calendar = function(pOption) {
		this._current = null;
		this._year = null;
		this._month = null;
		this._days = pOption.activeDays;
		this._get_day_max = function(year, month){

		    var i = 29, cday;
		    while(i<32){
		        cday = new Date(year,month,i);
		        if (cday.getFullYear()!=year || cday.getMonth()!=month) break;
		            i++;
		    }
		    return i-1;
		};
		this.draw = function() {

			var today = new Date(), year = this._year, month = this._month, day = today.getDate();
		    var week_start = new Date(year,month-1,1).getDay();
		    var day_max = this._get_day_max(year,month-1);
		    var i = 0, j = 0;

		    var _ds = [], _cs = [], _bs = '', _this = this;

		    _ds.push('<tr>');
		    while (j < day_max){
		    	_cs = [];
		        if (i < week_start) {
		            _ds.push('<td>&nbsp;</td>');
		        } else {
		            if (i%7==0){
		                _cs.push("sun");
		                _ds.push('<tr>');
		            }
		            else if (i%7==6){
		                _cs.push("sat");
		            }
		            else{
		                _cs.push('');
		            }

		            if((new Date()).getFullYear() + "" + ((new Date()).getMonth() + 1) == year +"" + month){
		                if (day == (j+1)){
		                    font_weight = " Bold";
		                }else{
		                    font_weight = "";
		                }
		            }else{
		                font_weight = "";
		            }

		            var _d = ('' + year + ((2 > month.toString().length ? '0' : '') + month) + (2 > (j+1).toString().length ? '0' : '')) + (j+1);

		            if (-1 < this._days.indexOf(_d)) {
		            	_bs = '<button data-current="'+_d+'">'+ (j+1) +'</button>';
		            }
		            else {
		            	_bs = '<button data-current="'+_d+'" disabled="disabled">'+ (j+1) +'</button>';
		            }

		            if (this._current === Number(_d)) {
		            	_cs.push('default');
		            }

		            _ds.push('<td class="'+_cs.join(' ')+'">'+_bs+'</td>');

		            if (i%7==6){
		            	_ds.push('</tr>');
		            }
		            j ++;
		        }
		    i ++;
		    }
		    while (i%7!==0){
		        _ds.push('<td>&nbsp;</td>');
		        i ++;
		    }

		    $('#year_month').text(year + '.' + month);

		    $('#cal_wrapper').append(_ds.join(''));
		    $('#cal_wrapper button').each(function(i, o) {
		    	var _o = $(this), _cr = _o.data('current'), __this = _this;

		    	_o.on('click', function() {
		    		$(this).blur();
		    		__this._current = _cr;

		    		$('#cal_wrapper td').removeClass('default');
		    		if (!_o.parent().hasClass('default')) {
		    			_o.parent().addClass('default');
		    		}

		    		// callback
		    		if ('function' === typeof pOption.selected) {
		    			pOption.selected(_cr);
		    		}
		    	});
		    });
		};

		// 예매 가능일이 존재하지 않을경우 기본 달력 표시
		var _this = this, _ym = [], _now;
		if (undefined === this._days || 1 > this._days.length) {
			_now = new Date();
			this._year = _now.getFullYear();
			this._month = _now.getMonth() + 1;
		}
		else {
			_ym = this._days[0].match(/([0-9]{4})([0-9]{2})([0-9]{2})/);

			this._year = Number(_ym[1]);
			this._month = Number(_ym[2]);
		}

		//이전 다음달 이벤트 달기
	    $('.btn_calendar_left').on('click',function(e){
	    	e.preventDefault();

	        $('#cal_wrapper').empty();
	        if(_this._month === 1){
	        	_this._month = 12;
	        	_this._year = _this._year -1;
	        }else{
	        	_this._month = _this._month -1;
	        }

	        _this.draw();
	    });

	    $('.btn_calendar_right').on('click',function(e){
	    	e.preventDefault();

	        $('#cal_wrapper').empty();
	        if(_this._month === 12){
	        	_this._month = 1;
	        	_this._year = _this._year +1;
	        }else{
	        	_this._month = _this._month +1;
	        }

	        _this.draw();
	    });
	},

	/**
	 * 예매하기 리스트 HTML 출력
	 *
	 * @param pParam.date - 공연일자
	 * @param pParam.tmie - 공연시간
	 * @param pParam.seatList - 좌석정보
	 * @param pParam.prodId - 티켓상품 ID
	 * @param pParam.pocCode - 채널코드
	 * @param pParam.scheduleNo - 스케줄번호
	 * @param pParam.prodTypeCode - 상품타입코드
	 * @param pParam.seatCntDisplayYn - 좌석수 노출여부
	 * @param pParam.perfTypeCode - 공연유형코드
	 * @param pParam.gradeCode - 관람등급코드
	 * @param pParam.cancelCloseDt - 취소마감일자
	 */
	_drawReserveList = function(pParam) {

		var _ds = [], _tl = [], _dt = '', _tm = '', _dc = [], _sc = 0, _wn = '', _dd = [], _mc = 0, _tc = 0;

		//	TICKET-4133	// QA테스트용 상품번호 100143
		if(pParam.prodId === '200834' || pParam.prodId === '200860' || pParam.prodId === '100143'){
			_tl.push('입장시간 ');

		//TICKET-4681 - 마블 체험 10시 오픈  하드코딩 200867:마블익스피리언스 부산,QA - 100226
		}else if(pParam.prodId === '200867'|| pParam.prodId === '100226'){
			_tl.push('체험 10시 오픈  ');
		}

		if(pParam.prodId === '100189'){	// QA 테스트용
			switch (pParam.scheduleNo) {
			case '100002':
				_tl.push('부산 ');
				break;
			case '100003':
				_tl.push('광주 ');
				break;
			case '100004':
				_tl.push('청주 ');
				break;
			case '100005':
				_tl.push('서울 ');
				break;
			case '100006':
				_tl.push('서울 ');
				break;
			default:
				break;
			}
		}

		if(pParam.prodId === '201050' || pParam.prodId === '201051' || pParam.prodId === '201052' || pParam.prodId === '201053' || pParam.prodId === '201054' || pParam.prodId === '201055' || pParam.prodId === '201065' || pParam.prodId === '201066'){	// 상용
			switch (pParam.scheduleNo) {
			case '100001':
				_tl.push('부산 ');
				break;
			case '100002':
				_tl.push('광주 ');
				break;
			case '100003':
				_tl.push('청주 ');
				break;
			case '100004':
				_tl.push('서울 ');
				break;
			case '100005':
				_tl.push('서울 ');
				break;
			default:
				break;
			}
		}

		if (PERF_TYPE_CODE_MUC !== pParam.perfTypeCode) {
			if (StringUtils.isNotEmpty(pParam.date)) {
				_dt = pParam.date.match(/([0-9]{4})([0-9]{2})([0-9]{2})/);

				var _mon = ( 10 > parseInt(_dt[2]) ) ? _dt[2].replace('0', '') : _dt[2];
				var _day = ( 10 > parseInt(_dt[3]) ) ? _dt[3].replace('0', '') : _dt[3];

				// _dd.push(_dt[1] + '년 ' + _mon + '월 ' + _day + '일');
				_dd.push(_dt[1] + '.' + _mon + '.' + _day);

				// 요일
				_wn = StringUtils.getWeekByDate(pParam.date);

				if( StringUtils.isNotEmpty(_wn) ) {
					_dd.push('(' + _wn + ') ');
				}

				_tl.push(_dd.join(''));
			}
		}

		//TICKET-4681 - 마블 체험 10시 오픈  하드코딩 200867:마블익스피리언스 부산,QA - 100226
		if(pParam.prodId === '200867'|| pParam.prodId === '100226'){
			_tl.push('');
		}else{
			if (StringUtils.isNotEmpty(pParam.time)) {
				_tm = pParam.time.match(/([0-9]{2})([0-9]{2})/);
				_tl.push(_tm[1] + '시 ' + _tm[2] + '분');
			}
		}

		// 좌석 비노출 상태에도 선예매는 노출되어야함.
		if(pParam.sellTypeCode === SALE_TYPE_CODE_ST2){
			_tl.push('<span class="fan">선예매</span>');
		}

		if (JsonUtils.isNotEmpty(pParam.seatList)) {

			// 등급 / 잔여좌석
			if ('Y' === pParam.seatCntDisplayYn) {
				$.each(pParam.seatList, function(ia, oa) {
					_dc.push('<span class="in">');
					_dc.push('<span>'+oa.seatGradeName+'</span>\r');
					//if(oa.seatCount!==undefined && oa.seatCount==='0'){
					if(oa.realSeatCntlk!==undefined && oa.realSeatCntlk==='0'){		// joyh 2016.08.10 수정
						_dc.push('<strong>매진</strong>\r');
					}else{
						//_dc.push('<strong>'+ StringUtils.numberFormat( oa.seatCount ) +'석</strong>\r');
						_dc.push('<strong>'+ StringUtils.numberFormat( oa.realSeatCntlk ) +'석</strong>\r');	// joyh 2016.08.10 수정
					}
					if (pParam.seatList.length > ia + 1) {
						_dc.push('<span class="line">|</span>\r');
					}
					_dc.push('</span>\r');

					var locSC = 0;
					var totSC = 0;
					try{
						//locSC = parseInt(oa.seatCount)
						locSC = parseInt(oa.realSeatCntlk)		// joyh 2016.08.10 수정
						totSC = parseInt(oa.totalCount)
					}catch(err){
						locSC = 0;
						totSC = 0;
					}
					_sc += locSC;
					_tc += totSC;
				});

				// 태그구분 :: 총 좌석수 50개 미만 - 매진임박, 총 좌석 0 - 매진
				// 총 좌석수 50개 미만 && 남은 좌석수가 10% 미만일경우 - 매진임박

				 _mc = Math.min(Math.round(_tc / 10 ), 50);


				if (null !== _sc && 1 > _sc ) {
					_tl.push('<span class="sold_out sold_color">매진</span>');
				}
//				else if (50 >= _sc && 0 < _sc ) {
				else if (_mc >= _sc && 0 < _sc ) {
					_tl.push('<span class="sold_out">매진임박</span>');
				}
			}
		}

		_ds.push('<li>');
		_ds.push('<button>');
		_ds.push('<strong class="tit">');
		_ds.push(_tl.join(''));
		_ds.push('</strong>');
		_ds.push('<span class="seat">');
		_ds.push(_dc.join(''));
		_ds.push('</span>');
		_ds.push('</button>');
		_ds.push('</li>');

		_ds = $(_ds.join(''));

		_ds.find('button').on('click', function(e){
			$(this).blur();

			var _isSa = false, _isAd = false;
			console.info('실명인증여부 :: ', getMUACHeaderCookie('realNameYn') + ', 성인인증여부 :: ' + getMUACHeaderCookie('adultAuthentication'));

			if(mstApp.isMelon() && mstApp.isIOS()){
				if(getMUACHeaderCookie('realNameYn') == 'Y'){
					checkAuthValue = 'Y';
				}
			}

			// 1순위 체크 - 로그인 체크
			if (!ActionHandler._confirmLogin()) {
				return false;
			};

			if(pParam.seatPoc === '0'){
				ActionHandler.alert({
					message:'선택하신 회차는 판매가 마감되었습니다.'
				});
				return false;
			}

			//QQQ
			var deferred = $.Deferred();
			if(pParam.sellTypeCode === SALE_TYPE_CODE_ST1) {
				//일반예매 - 정상케이스
				deferred.resolve();

			}else if(pParam.sellTypeCode === SALE_TYPE_CODE_ST2){
				//스케쥴에서 선예매 선택

				performanceModel
					.deliver(function(d){
						//QQQ
						//스케쥴에 선예매가 나오는 경우.
						//선예매 스케쥴 클릭시 이곳으로.
						if(d.authTypeCode === 'BG0007'){
							//유료회원 선예매 케이스.
							if(d.authYn === 'Y'){
								isPreReserveAble = true;
							}else{
								isPreReserveAble = false;
							}

							//선예매의 경우 인증여부 확인 ->
							if(!isPreReserveAble){
								//ActionHandler.toast('선예매 대상이 아닙니다.');
								ActionHandler.alert({
									message:'선예매 대상이 아닙니다. 선택하신 회차는 현재 선예매기간으로, 멜론 유료 상품을 이용 중인 고객만 예매가 가능합니다.',
									callback: function(){
										deferred.reject();
									}
								});
								return;
							}else{
								deferred.resolve();
							}
						}else if(d.authTypeCode === 'BG0005'){
							//유료회원 선예매 케이스.
							if(d.authYn === 'Y'){
								isPreReserveAble = true;
							}else{
								isPreReserveAble = false;
							}

							if (!isPreReserveAble) {
								ActionHandler.alert({
									message: '선예매 대상이 아닙니다.<br>선택하신 회차는 현재 공연예매권 선예매기간으로 공연예매권을 보유한 고객만 예매가능합니다.',
									callback: function () {
										deferred.reject();
									}
								});

								return;
							} else {
								deferred.resolve();
							}

						}else if(d.authTypeCode === 'BG0001'){
							//"BG0001": "팬클럽"
							if(d.authYn === 'Y'){
								isPreReserveAble = true;
							}else{
								isPreReserveAble = false;
							}

							if (!isPreReserveAble) {
								if(d.prodId === '100153' || d.prodId === '200426' || d.prodId === '200526'){
									ActionHandler.alert({
										message: '[CARAT 1기] 인증을 완료한 고객만 구매 가능합니다. 인증을 먼저 완료하여주세요.',
										callback: function () {
											deferred.reject();
										}
									});
								}else{
									ActionHandler.alert({
										message: '선예매 대상이 아닙니다.<br>선택하신 회차는 현재 선예매기간으로, 인증된 고객만 예매가 가능합니다.',
										callback: function () {
											deferred.reject();
										}
									});
								}
								return;
							} else {
								deferred.resolve();
							}
						}else if(d.authTypeCode === 'BG0002'){
							//"BG0002": "기구매자"
							if(d.authYn === 'Y'){
								isPreReserveAble = true;
							}else{
								isPreReserveAble = false;
							}

							if (!isPreReserveAble) {
								ActionHandler.alert({
									message: '선예매 대상이 아닙니다.<br>선택하신 회차는 현재 선예매기간으로, 인증된 고객만 예매가 가능합니다.',
									callback: function () {
										deferred.reject();
									}
								});

								return;
							} else {
								deferred.resolve();
							}
						}else if(d.authTypeCode === 'BG0003'){
							//"BG0003": "친밀도"
							if(d.authYn === 'Y'){
								isPreReserveAble = true;
							}else{
								isPreReserveAble = false;
							}

							if (!isPreReserveAble) {
								ActionHandler.alert({
									message: '선예매 대상이 아닙니다.<br>선택하신 회차는 현재 선예매기간으로, 인증된 고객만 예매가 가능합니다.',
									callback: function () {
										deferred.reject();
									}
								});

								return;
							} else {
								deferred.resolve();
							}
						}else{
							//QQQ 다른 선예매 타입은 어떻게?
							//"BG0001": "팬클럽"
							//"BG0002": "기구매자"
							//"BG0003": "친밀도"
							//"BG0004": "멤버십"
							//"BG0005": "예매권"
							//"BG0006": "일반"
							//"BG0007": "선예매 멜론유료회원 유형"

							//임시코드.
							if (!isPreReserveAble) {
								ActionHandler.alert({
									message: '선예매 대상이 아닙니다.<br>선택하신 회차는 현재 선예매기간으로, 인증된 고객만 예매가 가능합니다.',
									callback: function () {
										deferred.reject();
									}
								});

								return;
							} else {
								deferred.resolve();
							}
						}
					})
					.checkPreReserve({
						prodId: pParam.prodId,
						pocCode: pParam.pocCode,
						sellTypeCode: SALE_TYPE_CODE_ST2,
						sellCondNo: pParam.sellCondNo
						//auth Type code는 안넘겨도 된다. api에서 다시 확인.
						//,
						//autheTypeCode: 'BG0001'
					});
			}

			// 2순위 체크 후 콜백 프로세스(인증)
			var _checkValidAuth = function() {
				//인증 skip   QQQ 임시코드
				//checkAuthValue = 'Y';
				//checkAdultValue = 'Y';

				var _process = function(pParam) {
					if (GRADE_CODE_19 === pParam.gradeCode) {
						// 성인 인증여부 체크
						if ('Y' !== checkAdultValue) {
							//reserveModel
							//.deliver(function(pData) {
							//	if(pData.resultCode !== '000000'){
							//		checkAuthValue = 'N';
							//		checkAdultValue = 'N';
							//
							//		if(pData.reqUrl != null || pData.reqUrl == ''){
							//			ActionHandler.alert({
							//				message: pData.message
							//			});
							//		}else{
							//			authCheckUrl = pData.reqUrl;
							//_moveCheckAuthWParam({
							//	pType: AUTH_TYPE_ADULT,
							//	fromContId: pParam.prodId,
							//	fromType: 'performance'
							//});
							//}
							//	}else{
							//		checkAuthValue = 'Y';
							//		checkAdultValue = 'Y';
							//	}
							//})
							//._checkAdult();

							if(authErrCode == 'ERL087'){
								//19금 이용 가능 회원이 아닙니다.
								ActionHandler.alert({
									message: '19세 이상 관람 가능한 공연으로 미성년자의 예매가 불가합니다.'
								})
								return;
							}
							ActionHandler.alert({
								message: '19세 이상 관람 가능한 공연으로 예매서비스 이용 시 성인인증이 필요합니다.',
								callback: function () {
									_moveCheckAuthWParam({
										pType: AUTH_TYPE_ADULT,
										fromContId: pParam.prodId,
										fromType: 'performance'
									});
								}
							});

							return false;
						}
						else {
							//if (19 > getMemberAge() && GRADE_CODE_19 === pParam.gradeCode) {
							if (19 > getMemberAge()) {
								//나이 확인이 가능한지?? QQQ
								ActionHandler.alert({
									message: '19세 이상 관람 가능한 공연으로 미성년자의 예매가 불가합니다.'
								})

								return false;
							}
						}
					} else {
						// 본인 인증 체크
						if ('Y' !== checkAuthValue) {
							// 본인확인 알림
							ActionHandler.alert({
								message: '전자상거래 등에서의 소비자보호에 관한 법률 제6조(거래기록의 보존 등)에 의해 예매서비스 이용 시 본인확인이 필요합니다.',
								callback: function () {
									//_moveCheckAuth(AUTH_TYPE_REAL);
									_moveCheckAuthWParam({
										pType: AUTH_TYPE_REAL,
										fromContId: pParam.prodId,
										fromType: 'performance'
									});
								}
							});

							return false;
						}
					}

					// 원스탑 진입
					_moveOneStop(pParam);
				}

				deferred.promise().done(function() {
					//실행부
					_authcheck_app(pParam, _process);
				}).fail(function(){
					//do nothing.
				});
			}

			// 2순위 체크 - 관람일 임박 체크
			if ((new Date()).getTime() > StringUtils.convertStringToDate(pParam.cancelCloseDt).getTime()) {
				ActionHandler.confirm({
					message: '선택하신 회차는 관람일이 임박하여 결제 후 취소, 변경, 환불이 불가합니다.예매를 진행하시겠습니까?',
					callback: function(isOk) {
						if (isOk) {
							_checkValidAuth();
						}
					}
				});
			}
			else {
				_checkValidAuth();
			}
		});

		return _ds;
	},

	/**
	 * 카렌다 Dom 구성
	 */
	_drawCalendar = function(pData) {

		var _d = ActionHandler._getData('performance.reserve');

		if (1 > JsonUtils.length(pData.perfDaylist)) {
			ActionHandler.toast('선택 가능한 예매일자가 없습니다.');
		}

		// 설정가능한 최초 년월일 설정
		var _ds = [], _ym;

		$.each(pData.perfDaylist, function(i, o) {
			_ds.push(o.perfDay);
		});

		var cal = new _calendar({
			activeDays: _ds,
			selected: function(pDate) {

				// 좌석정보 노출
				performanceModel
					.deliver(_drawSeatList)
					.listProductSchedule({
						prodId: _d.prodId,
						pocCode: _d.pocCode,
						perfTypeCode: _d.perfTypeCode,
						sellTypeCode: _d.sellTypeCode,
						perfDay: pDate
					});

				//logging?
				Logger.buylog(_d.prodId);
			}
		});

		cal.draw();
	},

	/**
	 * 리스트형 좌석선택 Dom 구성
	 */
	_drawSeatList = function(pData) {

		var _d = ActionHandler._getData('performance.reserve');

		if (undefined !== pData.perfDaylist) {

			var _url = 'http://m.ticket.melon.com/index.html?t='+new Date().getTime();
		    var promise = $.ajax({
		        url: _url,
		        type: 'GET',
		        contentType: 'text/plain',
		    });

		    promise.complete(function () {
		    	var _h = promise.getResponseHeader('Date');
		        var dtStr = _h;
		        var pDt = Date.parse(dtStr);

		        $.each(pData.perfDaylist.reverse(), function(i, o) {
					var dayList = pData.perfDaylist[i];
					if(dayList){
						$.each(o.perfTimelist.reverse(), function(ia, oa) {
							var pf = dayList.perfTimelist[ia];
							if(pf){
								var sDt = (new Date(pf.rsrvStartDt.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/,'$1/$2/$3 $4:$5:$6'))).getTime();
			                    var eDt = (new Date(pf.rsrvEndDt.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/,'$1/$2/$3 $4:$5:$6'))).getTime();

			                    if(sDt<=pDt && pDt <=eDt) {
			                    }else {
			                        dayList.perfTimelist.splice(ia, 1);
			                    }
							}
						});
						if(dayList.perfTimelist.length == 0) {
							pData.perfDaylist.splice(i, 1);
		                }
					}
				});

		        // Draw Start
		        var _ds = [];

				$.each(pData.perfDaylist.reverse(), function(i, o) {

					// 시간대 정보가 있을경우
					if (0 < JsonUtils.length(o.perfTimelist)) {
						$.each(o.perfTimelist.reverse(), function(ia, oa) {

							//아래 값이 없는 경우 undefined로 넘어 가는 것 방지
							if(undefined == oa.sellCondNo){
								oa.sellCondNo = null;
							}
							if(undefined == oa.sellTypeCode){
								oa.sellTypeCode = null;
							}

							_ds.push(_drawReserveList({
								date: o.perfDay,
								time: oa.perfTime,
								seatList: oa.seatGradelist,
								prodId: _d.prodId,
								pocCode: _d.pocCode,
								scheduleNo: oa.scheduleNo,
								prodTypeCode: _d.prodTypeCode,
								seatCntDisplayYn: o.seatCntDisplayYn,
								perfTypeCode: _d.perfTypeCode,
								gradeCode: _d.gradeCode,
								cancelCloseDt: oa.cancelCloseDt,
								//sellCondNo: o.sellCondNo,
								sellCondNo: oa.sellCondNo,
								//sellTypeCode: oa.sellTypeCode
								sellTypeCode: oa.sellTypeCode,
								seatPoc: oa.seatPoc
							}));
						});
					}
					else {
						_ds.push(_drawReserveList({
							date: o.perfDay,
							prodId: _d.prodId,
							pocCode: _d.pocCode,
							scheduleNo: o.scheduleNo,
							prodTypeCode: _d.prodTypeCode,
							seatCntDisplayYn: o.seatCntDisplayYn,
							perfTypeCode: _d.perfTypeCode,
							gradeCode: _d.gradeCode
						}));
					}
				});

				$('.date_time').html(_ds);
		    });	// complete
		}
	},

	/**
	 * 선예매 인증팝업 질의 항목 Dom 구성
	 */
	_drawAuthItems = function() {
		var _tgtDom = $('#layer_content'), _ds = [],
			_d = ActionHandler._getData('performance.auth');

		// 타이틀 설정
		if (StringUtils.isNotEmpty(_d.displayTitle)) {
			$('#authTitle').html(_d.displayTitle);
			$("#btnAuthPreReserve").show();	// 타이틀은 무조건 변경이기 때문에 타이틀 변경 후 버튼 show
		}

		// 코멘트 설정
		if (StringUtils.isNotEmpty(_d.displayComment)) {
			_tgtDom.find('#authContent').html(_d.displayComment);
		}
		else {
			_tgtDom.find('#authContent').html('');
		}

		// 검증항목 리스트 구성
		$.each(_d.autheItemlist, function(i, o) {
			_ds.push('<p><label for="i_certify1">'+o['autheItem_' + (i + 1)]+'</label>');
			_ds.push('<input type="text" id="i_certify'+i+'" /></p>');
		});

		_tgtDom.find('#i_certify_input').html(_ds.join(''));

		// 인증하기 버튼 핸들링
		_tgtDom.find('#btnAuthPreReserve').on('click', function(e) {

			var _isValid = true, _answers = {}, _tmpVal = '';

			// 누락항목 체크
			$.each(_tgtDom.find('#i_certify_input p'), function(ia, oa) {

				_tmpVal = $(oa).find('input').val();

				if (StringUtils.isEmpty(_tmpVal)) {
					_isValid = false;
					return false;
				}
				else {
					_answers['autheValue_'+(ia + 1)] = _tmpVal;
				}
			});

			if (!_isValid) {
				ActionHandler.alert({
					message: '인증정보를 모두 입력해주세요.'
				});
				return false;
			}

			// 인증 전송
			performanceModel
				.deliver(function(pData) {

					//delete stored cache//20160624
					PreRsrvAction.reset(_d.prodId);

					if ('Y' === pData.authYn) {
						ActionHandler.alert({
							message: '인증이 완료되었습니다.',
							callback: function() {
								ActionHandler._closeActivePopup();
							}
						});
					}
					else {

						ActionHandler.alert({
							message: pData.message,
							callback: function() {
								_tgtDom.find('#i_certify_input input').val('');
							}
						});
					}

					// 선예매 인증정보 갱신
					isPreReserveAble = ('Y' === pData.authYn);

					// 바닥 페이지 선예매 인증 버튼 이벤트 교체
					if (isPreReserveAble) {
						$('#buttonArea').find('a:first').unbind('click').on('click', function(e){
							e.preventDefault();

							ActionHandler.toast('이미 인증 완료되었습니다.');
						});
					}
				})
				.authPreReserve($.extend({
					prodId: _d.prodId,
					pocCode: _d.pocCode,
					sellTypeCode: _d.sellTypeCode,
					sellCondNo: _d.sellCondNo,
					autheTypeCode: 'BG0001'
				}, _answers));
		});
	},

	/**
	 * 버튼 조합용 예매 구분 정보 체크
	 *
	 * @param pData - 예매정보 데이터
	 * @returns
	 */
	_getSaleTypeInfo = function(pData) {
		var _this = this, _nw = new Date(),
			_dataSaleReserve = null, 	// 예매상품 정보 저장
			_dataSalePreReserve = null, // 선예매상품 정보 저장
			_dataSaleDraw = null,		// 추천상품 정보 저장
			_reserveDate = null,
			_noticeDate = null,
			_isPreTicketing = false,
			_isPreTicketingAuth = false,
			_isTicketing = false;
		//버튼타입 저장
		var _btnType = 0;

		$.each(pData.saleTypeCodeList, function(i, o) {
			// 일반예매
			if (SALE_TYPE_CODE_ST1 === o.saleTypeCode) {
				_isTicketing = _isTicketing|| StringUtils.validBetweenDate(o.reserveStartDt, o.reserveEndDt);
				_dataSaleReserve = o;

				_reserveDate = StringUtils.convertStringToDate(o.reserveStartDt);
			}

			// 선예매
			if (SALE_TYPE_CODE_ST2 === o.saleTypeCode) {
				// 선예매 인증 정보 있을경우
				if ((null !== o.autheReserveStartDt && undefined !== o.autheReserveStartDt) &&
						(null !== o.autheReserveEndDt && undefined !== o.autheReserveEndDt)) {

					_isPreTicketingAuth = _isPreTicketingAuth || StringUtils.validBetweenDate(o.autheReserveStartDt, o.autheReserveEndDt);
				}

				_isPreTicketing = _isPreTicketing || StringUtils.validBetweenDate(o.reserveStartDt, o.reserveEndDt);

				// 선예매 인증 가능일자 이고, 선예매 가능일자가 아닌경우 선예매 시작일자 예고일 적용
				if (_isPreTicketingAuth && !_isPreTicketing) {
					_noticeDate = StringUtils.convertStringToDate(o.reserveStartDt);
				}

				if(o != null && o.reserveEndDt >= new Date().yyyymmddhhmiss()){
					if(_dataSalePreReserve != null){
						if(_dataSalePreReserve.reserveStartDt > o.reserveStartDt && new Date().yyyymmddhhmiss() <= o.reserveEndDt){
							_dataSalePreReserve = o;
						}
					}else{
						_dataSalePreReserve = o;
					}
				}

//				_dataSalePreReserve = o;
			}

			// 추첨식
			if (SALE_TYPE_CODE_ST3 === o.saleTypeCode) {
				_dataSaleDraw = o;
				return false;
			}
		});

		// 선예매 가능 중 예매시작된 경우 선예매 비활성화
		if (_isPreTicketing && null !== _reserveDate) {
			if ((new Date()).getTime() > _reserveDate.getTime()) {
				_isPreTicketing = false;
			}
		}

		return {
			isPreTicketing: _isPreTicketing,
			isPreTicketingAuth: _isPreTicketingAuth,
			isTicketing: _isTicketing,
			noticeDate: _noticeDate,
			dataSaleReserve: _dataSaleReserve,
			dataSalePreReserve: _dataSalePreReserve,
			dataSaleDraw: _dataSaleDraw,
			btnType: _btnType
		};
	},

	/**
	 * 판매 유형별 예매 선택 구분 액션 리턴
	 *
	 * @param pData - 상품정보
	 * @returns {ActionBuilder}
	 */
	_getActionBySaleType = function(pData) {
		var _ab = new ActionBuilder();
		_ab.setActionType(ActionHandler.ACTION_TYPE_POPUP);
		_ab.setVisiblePre('Y');
		_ab.setScrollable('N');
		_ab.setKey('performance.reserve');

		// 카렌다형 (뮤지컬)
		if (PERF_TYPE_CODE_MUC === pData.perfTypeCode|| PERF_TYPE_CODE_PLY === pData.perfTypeCode
			|| PERF_TYPE_CODE_DSP === pData.perfTypeCode || PERF_TYPE_CODE_ETC === pData.perfTypeCode) {
			_ab.setTarget('/common/pop_resv_calendar.html');
		}
		// 리스트형 (클래식, 콘서트)
		else if (PERF_TYPE_CODE_CLS === pData.perfTypeCode || PERF_TYPE_CODE_CON === pData.perfTypeCode
			|| PERF_TYPE_CODE_SPO === pData.perfTypeCode){
			_ab.setTarget('/common/pop_resv_list.html');
		}

		return _ab;
	},

	/**
	 * 원스탑 파라메터 세팅
	 */
	_checkOneStop = function(pParam) {

		// 원스탑 진입
		var _pm = [];
		var _scheduleNo = '', _sellTypeCode = '', _sellCondNo = '', _prodTypeCode = '';
		// POC 코드 모바일로 설정
		_pm.push('pocCode=' + POC_TYPE_CODE_MOBILE);

		if (StringUtils.isNotEmpty(pParam.prodId)) {
			_pm.push('prodId=' + pParam.prodId);
		}
		if (StringUtils.isNotEmpty(pParam.scheduleNo)) {
			_pm.push('scheduleNo=' + pParam.scheduleNo);

			_scheduleNo = pParam.scheduleNo;
		}
		if (StringUtils.isNotEmpty(pParam.prodTypeCode)) {
			_pm.push('prodTypeCode=' + pParam.prodTypeCode);
			_prodTypeCode = pParam.prodTypeCode;
		}
		if (StringUtils.isNotEmpty(pParam.sellTypeCode)) {
			_pm.push('sellTypeCode=' + pParam.sellTypeCode);
			_sellTypeCode = pParam.sellTypeCode;
		}
		if (StringUtils.isNotEmpty(pParam.sellCondNo)) {
			_pm.push('sellCondNo=' + pParam.sellCondNo);
			_sellCondNo = pParam.sellCondNo;
		}

// 좌석선택 페이지로 이동
			ActionHandler.apis['product.prodKey'].execute({
				data : {prodId: pParam.prodId},
				callback : function(d) {
					if( undefined !== d && undefined != d.key) {
						var _tf = [];
						_tf.push('<form id="onestopFrm" action="https://m.ticket.melon.com/reservation/onestop.htm" method="post" style="display:none;" >');
//						_tf.push('<form id="onestopFrm" action="http://m.ticket.melon.com/reservation/onestop.htm" method="post" style="display:none;" >'); // joyh 2016.08.10
						_tf.push('<input type="text" name="pocCode" value="'+POC_TYPE_CODE_MOBILE+'" />');
						_tf.push('<input type="text" name="prodId" value="'+pParam.prodId+'" />');
						_tf.push('<input type="text" name="scheduleNo" value="'+ _scheduleNo+'" />');
						_tf.push('<input type="text" name="prodTypeCode" value="'+_prodTypeCode+'" />');
						_tf.push('<input type="text" name="sellTypeCode" value="'+_sellTypeCode+'" />');
						_tf.push('<input type="text" name="sellCondNo" value="'+_sellCondNo+'" />');
						_tf.push('<input type="text" name="chk" value="'+d.key+'" />');
						_tf.push('<input type="text" name="tYn" value="'+(d.trafficCtrlYn==undefined?'':d.trafficCtrlYn)+'" />');//parameter로 전달 요청 20160504
						_tf.push('<input type="text" name="netfunnel_key" value="" />');//netfunnel key를 parameter로 전달 20160930
						_tf.push('<input type="text" name="authRsrvYn" value="'+AUTH_RSRV_YN+'" />');
						_tf.push('</form>');
						
						$('body').append(_tf.join(''));

						//test logging
						//var msg = 'merong...';
						//Logger.netfunnel(msg).done(function(){console.log('done');});

						if(d.trafficCtrlYn !== undefined && d.trafficCtrlYn === 'Y') {
							//넷퍼넬
							//넷퍼넬 설정임. 값 고치지 말것.
							setCookie("NetFunnel_ID", "WP15", 0, "/", ".melon.com");

							//TEMP ASF경우만 변경. dev:, QA:100139 
/*//							if(pParam.prodId === '200162' || pParam.prodId === '200158' || pParam.prodId === '100081' || pParam.prodId === '100025'){//prod rel qa dev
							if(pParam.prodId === '100226' || pParam.prodId === '202007' ){//prod rel qa dev
								nf_action_id = nf_action_id_m;
							}
							
							else if( pParam.prodId === '100172' ){
								nf_action_id = 'commercetest';
							}
							
							else {
								nf_action_id = nf_action_id;
							}
							*/
							
							if(d.nflActId != undefined && d.nflActId !=null && d.nflActId!=""){
								nf_action_id = d.nflActId
							}

							NetFunnel_Action({action_id: nf_action_id}, {
								success: function (ev, ret) {
									setCookie('ARY_CM', '', 10, '/', 'melon.com');			// [CAPTCHA]

									_sendNetFunnelLog("reservationZAM_SUCCESS", ret);

									$('#onestopFrm > input[name=netfunnel_key]').val(":key=" + ret.data.key + "&");//netfunnel key를 parameter로 전달 20160930
									$('#onestopFrm').submit();
								},
								block: function (ev, ret){
									ActionHandler.alert({
										message: '판매가 마감 되었습니다.'
									});
									return false;
								},
								error: function (ev, ret){

									_sendNetFunnelLog("reservationZAM_ERROR", ret);

									//logging
//									var msg = "error:" + ""+ ", code=" + ret.code + ", msg=" + ret.data.msg;
//									Logger.netfunnel(msg).done(function(){
//										//console.log('netfunnel logging - error: '+ msg);
//									});
									ActionHandler.alert({
										message: '다시 시도 부탁 드립니다.'
									});
									return false;
								}
							});
						}else{
							setCookie('ARY_CM', '', 10, '/', 'melon.com');			// [CAPTCHA]
							$('#onestopFrm').submit();
						}

					}else{

					}
				}
			});

	},

	_sendNetFunnelLog = function(fnCode, ret){
		var msg = '';
	    var flg = 0;
	    try{
	        if(ret.code != 200 || ret.rtype != 5002 || ret.data.key.length < 50) {
	            msg = "["+ fnCode +"_N] ret:" + JSON.stringify(ret);
	            flg = 1;
	        }
	    }
	    catch(e) {
	        msg = "["+ fnCode +"E] ret:" + JSON.stringify(ret);
	        flg = 1;
	    }
	    try {
	        if(flg == 1) {
	            $.ajax({
	                type : "GET",
	                url  : "http://m.ticket.melon.com/log/netfunnel/netfunnelLog.json?msg="+ msg +"&v=1",
	                async : true,
	                success : function(d){
	                    }
	            });
	        }
	    }catch(e){
	    }
	},

	/**
	 * 원스탑 이동
	 */
	_moveOneStop = function(pParam) {

		// 원스탑 진입 전 메시지 확인
		performanceModel
			.deliver(function(pData) {

				if (StringUtils.isNotEmpty(pData.rsrvInfo)) {

					ActionHandler.confirm({
						message: pData.rsrvInfo,
						callback: function(pResult) {
							if (pResult) {
								_checkOneStop(pParam);
							}
							else {
								return false;
							}
						}
					});
				}
				else {
					_checkOneStop(pParam);
				}
			})
			.getPerformanceDetail({
				prodId: pParam.prodId
			});
	},

	/**
	 * 선예매 인증 버튼 이벤트 바인딩 (페이지 로딩시 호출)
	 *
	 * @param pParam - 선예매 데이터
	 * @param pTgtDom - 이벤트 바인딩 대상 객체
	 */
	_bindBtnPreReserveAuth = function(pParam, pTgtDom) {

		var _saleInfo = _getSaleTypeInfo(pParam), _pa = getTempAction();

		// 선예매 인증정보 로딩
		var authCallback = function(pData){
			//store
			if(pData.authYn && pData.authYn === 'Y'){
				PreRsrvAction.storeAuthItem(pParam.prodId, pData);
			}

			if (JsonUtils.isEmpty(pData)) {
				ActionHandler.toast('선예매 인증정보가 존재하지 않습니다.');
			}

			// 로그인 체크
			if (!isMelonLogin()) {
				pTgtDom.unbind('click').on('click', function(e){
					e.preventDefault();

					if (!ActionHandler._confirmLogin()) {
						return false;
					};
				});
			}
			else {

				if(pData.autheTypeCode === 'BG0007'){
					pTgtDom.unbind('click').on('click', function(e){
						e.preventDefault();

						performanceModel
						.deliver(function(d){
							if(d.authYn === 'Y'){
								ActionHandler.alert({message:'선예매 대상입니다.'});
							}else{
								ActionHandler.alert({message:'선예매 대상이 아닙니다.멜론 유료회원만 선예매가 가능합니다.'});
							}
						}).checkPreReserve({
							prodId: pData.prodId,
							pocCode: pData.pocCode,
							sellTypeCode: pData.sellTypeCode,
							sellCondNo: pData.sellCondNo,
							autheTypeCode: pData.autheTypeCode
						});
					});
				}else if('Y' === pData.authYn){

				// 선예매 인증 팝업 바인딩
//				if ('Y' === pData.authYn) {
					pTgtDom.unbind('click').on('click', function(e){
						e.preventDefault();

						ActionHandler.toast('이미 인증 완료되었습니다.');
					});
				}
				else {
					pTgtDom.unbind('click').on('click', function(e){
						e.preventDefault();

						var _process = function(pData) {
							if ('Y' !== checkAuthValue) {
								ActionHandler.alert({
									message: '전자상거래 등에서의 소비자보호에 관한 법률 제6조(거래기록의 보존 등)에 의해 예매서비스 이용 시 본인확인이 필요합니다.',
									callback: function () {
										_moveCheckAuthWParam({
											pType: AUTH_TYPE_REAL,
											fromContId: pData.prodId,
											fromType: 'performance'
										});
									}
								});
								return;
							}else{
								memberModel
								.deliver(
									function(tData) {
										if(tData.resultCode !== '000000'){	// 통신 실패 resultCode '-1'
											ActionHandler.alert({message:'잠시후 다시 시도해 주십시오.'});
										}else{	// 통신 성공 resultCode '000000'
											if(tData.memberId !== '-1'){	// 동일 Ci 인증정보가 있을 경우
//												pTgtDom.unbind('click').on('click', function(e){
//													e.preventDefault();

													ActionHandler.alert({message:'고객님이 소유하신 다른 아이디 '+tData.memberId+'으로 이미 사전인증을 완료하셨습니다. 본인명의의 아이디 1개만 선예매 인증이 가능합니다.'});
//												});
											}else{	// 동일 Ci 인증정보가 없을 경우
												var _ab = new ActionBuilder();
												_ab.setActionType(ActionHandler.ACTION_TYPE_POPUP);
												_ab.setTarget('/common/pop_resv_auth.html');
												_ab.setScrollable('false');
												_ab.setKey('performance.auth');
												_ab.setJson(pData);
												_ab.setCheckToken('Y');
												_ab.bind(pTgtDom);

												_ab.bind(_pa, function() {
													ActionHandler.addEvent(document);
													_pa.click();
												});
											}
										}
									}
								)
								.identity({
									prodId: pParam.prodId,
									pocCode: pParam.pocCode,
									sellTypeCode: SALE_TYPE_CODE_ST2,
									sellCondNo: _saleInfo.dataSalePreReserve.sellCondNo,
									autheTypeCode: 'BG0001',
									memberKey: getMemberKey()
								})
							}
						}

						_authcheck_app(pData, _process);
					});

				}
			}

			// 버튼 Text 변경
			//$('#buttonArea').find('a:first span').text(pData.displayTitle); //->순서보장이 안됨.(cookie의 경우)
			pTgtDom.find('span').text(pData.displayTitle);
		}

		var authItemCookie = PreRsrvAction.getAuthItem(pParam.prodId);
		if(existy(authItemCookie)){
			authCallback(authItemCookie);
		}else{
			performanceModel
				.deliver(authCallback)
				.getPreReserveInfo({
					prodId: pParam.prodId,
					pocCode: pParam.pocCode,
					sellTypeCode: SALE_TYPE_CODE_ST2,
					sellCondNo: _saleInfo.dataSalePreReserve.sellCondNo,
					autheTypeCode: 'BG0001'
				});
		}

		if (JsonUtils.isEmpty(_saleInfo.dataSalePreReserve)) {
			ActionHandler.toast('선예매 인증을 할 수 없습니다.');
			return false;
		}
	},

	/**
	 * 선예매 버튼 이벤트 바인딩
	 *
	 * @param pParam - 선예매 데이터
	 * @param pTgtDom - 이벤트 바인딩 대상 객체
	 */
	_bindBtnPreReserve = function(pParam, pTgtDom) {

		pTgtDom.unbind('click').on('click', function(e){

			e.preventDefault();

			// 선예매 가능
//			if (isPreReserveAble) {
				var _ab = _getActionBySaleType(pParam);
				_ab.setJson($.extend(pParam, {sellTypeCode: SALE_TYPE_CODE_ST2, prodTypeCode: pParam.prodTypeCode}));
				_ab.bind(pTgtDom);
				pTgtDom.trigger('click');
//			}
//			else {
//				ActionHandler.toast('선예매 대상이 아닙니다.');
//			}
		});
	},

	/**
	 * 일반예매 버튼 이벤트 바인딩
	 *
	 * @param pParam - 일반예매 데이터
	 * @param pTgtDom - 이벤트 바인딩 대상 객체
	 */
	_bindBtnReserve = function(pParam, pTgtDom) {
		var _ab = _getActionBySaleType(pParam);
		_ab.setJson($.extend(pParam, {sellTypeCode: SALE_TYPE_CODE_ST1, prodTypeCode: pParam.prodTypeCode}));
		_ab.bind(pTgtDom);
	},

	/**
	 * 선예매 가능여부 체크
	 *
	 * @param pParam - 선예매 데이터
	 * @param pCallback - 데이터 세팅 후 콜백
	 */
	_checkSalePreReserve = function(pParam, pCallback) {

		var _saleInfo = _getSaleTypeInfo(pParam);

		if (JsonUtils.isEmpty(_saleInfo.dataSalePreReserve)) {
			ActionHandler.toast('선예매를 할 수 없습니다.');
			return false;
		}

		//performanceModel
		//	.deliver(
		//		function(pData) {
		//			// 선예매 가능 체크용 플래그설정
		//			if (JsonUtils.isNotEmpty(pData) && 'Y' === pData.authYn) {
		//				isPreReserveAble = true;
		//			}
		//			else {
		//				isPreReserveAble = false;
		//			}
        //
		//			pCallback();
		//		}
		//	)
		//	.checkPreReserve({
		//		prodId: pParam.prodId,
		//		pocCode: pParam.pocCode,
		//		sellTypeCode: SALE_TYPE_CODE_ST2,
		//		sellCondNo: _saleInfo.dataSalePreReserve.sellCondNo,
		//		autheTypeCode: 'BG0001'
		//	})

		var postUserCond = function(pData){

			//store
			if(pData.authYn && pData.authYn === 'Y') {
				PreRsrvAction.storeUserCond(pParam.prodId, pData);
			}

			// 선예매 가능 체크용 플래그설정
			if (JsonUtils.isNotEmpty(pData) && 'Y' === pData.authYn) {
				isPreReserveAble = true;
			}
			else {
				isPreReserveAble = false;
			}

			pCallback();
		}

		var condCookie = PreRsrvAction.getUserCond(pParam.prodId);
		if(existy(condCookie)){
			postUserCond(condCookie);
		}else{
			performanceModel
				.deliver(postUserCond)
				.checkPreReserve({
							prodId: pParam.prodId,
							pocCode: pParam.pocCode,
							sellTypeCode: SALE_TYPE_CODE_ST2,
							sellCondNo: _saleInfo.dataSalePreReserve.sellCondNo,
							autheTypeCode: 'BG0001'
						});
		}

	},

	/**
	 * 본인인증 체크
	 */
	_checkAuth = function() {

		if (!isMelonLogin()) {
			return false;
		}

		// 본인인증 체크
		reserveModel
			.deliver(function(pData) {

				if (JsonUtils.isEmpty(pData)) {
					return false;
				}

				//checkAuthValue = pData.isIdentification;
				checkAuthValue = pData.resultCode === '000000' ? 'Y' : 'N';
				isCheckAuth = true;

				//리턴된 url저장
				if(checkAuthValue === 'N'){
					authCheckUrl = pData.reqUrl;
					authErrCode = pData.errorCode;
					viewType = pData.viewType;
				}
			})
			.checkAuth();
	},

	_checkAuthWcallback = function(pData) {

		if (!isMelonLogin()) {
			return false;
		}

		// 본인인증 체크
		ActionHandler.apis['ticket.mobile.realname_isAuthCk'].execute({
			data : {
				memberKey: getMemberKey(),
				viewType: pData.type,
				cpId: POC_ID
			},
			callback : function(pResult){

				if(pData.type === AUTH_TYPE_REAL){
					//본인
					if('000000' == pResult.resultCode){
						checkAuthValue = 'Y';
						authErrCode = '';
						viewType = '';
					}else{
						checkAuthValue = 'N';
						authCheckUrl = pResult.reqUrl;
						authErrCode = pResult.errorCode;
						viewType = pResult.viewType;
					}
				}else{
					//성인
					if('000000' == pResult.resultCode){
						checkAdultValue = 'Y';
						checkAuthValue = 'Y';
						authErrCode = '';
						viewType = '';
					}else{
						checkAdultValue = 'N';
						checkAuthValue = 'N';
						authCheckUrl = pResult.reqUrl;
						authErrCode = pResult.errorCode;
						viewType = pResult.viewType;
					}
				}

				if(typeof pData.callback ===  'function'){
					pData.callback.call(pResult);
				}
			}
		});
	},

	/**
	 * 성인인증 체크
	 */
	_checkAdult = function() {

		if (!isMelonLogin()) {
			return false;
		}

		// 성인인증 체크
		reserveModel
			.deliver(function(pData) {

				if (JsonUtils.isEmpty(pData)) {
					return false;
				}

				//checkAdultValue = pData.isJuvenileProtection;
				checkAdultValue = pData.resultCode === '000000' ? 'Y' : 'N';
				checkAuthValue = checkAdultValue;
				isCheckAdult = true;

				if('N' === checkAdultValue){
					authCheckUrl = pData.reqUrl;
					authErrCode = pData.errorCode;
					viewType = pData.viewType;
				}

				if(checkAuthValue === 'N'){
					_checkAuth();
				}

			})
			.checkAdult();
	},

	/**
	 * 인증 페이지 이동
	 */
	_moveCheckAuth = function(pType) {
		var _tf = [];
		var _viewType = (viewType == ''|| viewType == null)?pType:viewType;
		//_tf.push('<form id="tmpForm" action="https://member.melon.com/muid/family/ticket/common/mobile/realnameauthentication_inform.htm" method="post" style="display:none;" >');
		_tf.push('<form id="tmpForm" action="'+authCheckUrl+'" method="post" style="display:none;" >');
		_tf.push('<input type="text" name="memberKey" value="'+getMemberKey()+'" />');
		_tf.push('<input type="text" name="viewType" value="'+_viewType+'" />');
		//_tf.push('<input type="text" name="returnUrl" value="'+document.location.href+'" />');
		_tf.push('<input type="text" name="returnUrl" value="'+'http://m.ticket.melon.com'+'" />');
		_tf.push('<input type="text" name="cpId" value="'+POC_ID+'" />');
		_tf.push('</form>');

		$('body').append(_tf.join(''));

		// 웹뷰에서 작동안함
		$('#tmpForm').submit();
	},

	/**
	 * 인증 페이지 이동
	 */
	_moveCheckAuthWParam = function(pData) {

		if(authCheckUrl == null || authCheckUrl === ''){
			if(authErrCode == null || authErrCode === ''){
				authErrCode = "MTK000";
			}
			ActionHandler.alert({
//				message: '이미 인증을 완료 하였습니다.'
//				message: '올바른 회원정보가 아닙니다.',
//				message: '[ '+authErrCode+' ] '+authErrMsg,
				message: '[ '+authErrCode+' ] '+"잠시 후 다시 시도해주세요.",
				callback: function () {
					_checkAuth();
				}
			});
			return;
		}


		var _viewType = (viewType == ''|| viewType == null)?pData.pType:viewType;
		if(pData.pType === 'changeName'){ //setting에서 온 경우는 이것 사용 0418 추가 사항
			_viewType = pData.pType;
		}

		// melon
		if(mstApp.isMelon()){
			if(mstApp.isIOS()){
				POC_ID = 'IS40';
			}else{
				POC_ID = 'AS40';
			}
		}

		//melon 4.0
		if(mstApp.isApp() || mstApp.isMelon()){

			var _title = '';
			if(pData.pType == AUTH_TYPE_REAL){
				_title = "본인확인";
			}else if(pData.pType == AUTH_TYPE_ADULT){
				_title = "성인인증";
			}else if(pData.pType == 'changeName'){
				_title = "본인확인";
			}else{
				_title = "본인확인";
			}
			//webview popup 으로 실행
			var _closeUrl = 'http://m.ticket.melon.com/public/close.html';
			console.log(authCheckUrl+'?cpId='+POC_ID+'&memberKey='+getMemberKey()+'&viewType='+_viewType+'&returnUrl='+_closeUrl);
			mstApp.openWebView(authCheckUrl+'?cpId='+POC_ID+'&memberKey='+getMemberKey()+'&viewType='+_viewType+'&returnUrl='+_closeUrl, _title);

		}else{
			var _tf = [];

			//_tf.push('<form id="tmpForm" action="https://member.melon.com/muid/family/ticket/common/mobile/realnameauthentication_inform.htm" method="post" style="display:none;" >');
			_tf.push('<form id="tmpForm" action="'+authCheckUrl+'" method="post" style="display:none;" >');
			_tf.push('<input type="text" name="memberKey" value="'+getMemberKey()+'" />');
			//_tf.push('<input type="text" name="viewType" value="'+pData.pType+'" />');
			_tf.push('<input type="text" name="viewType" value="'+_viewType+'" />');
			_tf.push('<input type="text" name="returnUrl" value="'+'http://tktapi.melon.com/gate/member.json'+'" />');
			_tf.push('<input type="text" name="cpId" value="'+POC_ID+'" />');
			if(pData.fromType !== undefined){
				_tf.push('<input type="text" name="type" value="'+pData.fromType+'" />');
				_tf.push('<input type="text" name="contId" value="'+pData.fromContId+'" />');
			}
			_tf.push('</form>');

			$('body').append(_tf.join(''));

			// 웹뷰에서 작동안함
			$('#tmpForm').submit();
		}
	},

	/**
	 * 상품상태별 노출 버튼설정
	 */
	_initReserveButton = function(pData) {
		var _dl = [], _ab, _st = pData.saleTypeJson, _tp;

		if (undefined === _st) {
			return false;
		}
		else {
			_st = JSON.parse(_st);
		}

		// 모바일 좌석 데이터 선택
		$.each(_st.data.list, function(i, o) {
			if (POC_TYPE_CODE_MOBILE === o.pocCode) {
				// 좌석선택 페이지에서 사용할 파라메터 추가
				_tp = $.extend({perfTypeCode: pData.perfTypeCode, prodTypeCode: pData.prodTypeCode}, o);
				return false;
			}
		});

		if (undefined === _tp) {
			return false;
		}
		/*
			파트너어드민 미리보기 함수 호출
		 */
        var gateValidateChk = pData.gateValidateChk != null ? pData.gateValidateChk : "N";

        if( gateValidateChk === "Y" ){

            _tp = $.extend({gradeCode: pData.gradeCode}, _tp);

            _dl.push('<div class="box_full_alert">');
            _dl.push('<span class="ico_comm ico_bt_alert"></span>페이지 미리보기</div>');
            _dl.push('</div>');
            _dl = $(_dl.join(''));

            // 일반예매 이벤트 바인딩
            _bindBtnReserve(_tp, _dl.find('a'));

            // 글로벌 하단 버튼추가 함수
            addButton(_dl);

            return false;
        }

		/*
		 *  우선순위
		 *
		 *  1. 티켓상품 판매상태,
		 *  2. 판매타입 (선예매인증 - 선예매 - 일반예매)
		 *
		 */

		// 판매가능이 아닌경우 라벨처리 (예외 - 판매가능 이지만 모바일에서 판매하지 않을경우.)
		if (STATE_FLG_02 !== pData.stateFlg ||
				(STATE_FLG_02 === pData.stateFlg && 'N' === pData.isSaleMobile)) {

			var _msg = '', _st;

			switch (pData.stateFlg) {
			case STATE_FLG_01: // 판매준비
				_msg = '판매 예정인 상품입니다.';
				break;
			case STATE_FLG_02: // 판매중 예외
				_msg = '모바일에서 판매하지 않는 상품입니다.';
				break;
			case STATE_FLG_03: // 매진
				_msg = '매진된 상품입니다.';
				break;
			case STATE_FLG_04: // 공연취소
				_msg = '취소된 공연입니다.';
				break;
			case STATE_FLG_05: // 판매중지
				_msg = '판매 예정인 상품입니다.';
				break;
			case STATE_FLG_06: // 공연완료
				_msg = '판매가 종료된 상품입니다.';
				break;

			default:
				break;
			}

			_dl.push('<div class="box_full_alert">');
			_dl.push('<span class="ico_comm ico_bt_alert">');
			_dl.push('</span>'+_msg+'</div>');

			_dl = $(_dl.join(''));
		}
		else {

			// 예매 스텝중 19등급 분기를 위해 파라메터 추가 설정
			_tp = $.extend({gradeCode: pData.gradeCode}, _tp);

			// 일반상품은 선예매인증, 선예매 체크
			if (PROD_TYPE_CODE_TKT === pData.prodTypeCode) {
// 			if (PROD_TYPE_CODE_TKT === pData.prodTypeCode || PROD_TYPE_CODE_TKA === pData.prodTypeCode || PROD_TYPE_CODE_PKG === pData.prodTypeCode) {

				var _check = _getSaleTypeInfo(_tp);

				// 선예매인증 - 선예매예고
				if (_check.isPreTicketingAuth && !_check.isPreTicketing && !_check.isTicketing) {

					var _dateString = [];

					_dateString.push((_check.noticeDate.getMonth() + 1) + '/' + _check.noticeDate.getDate());
					_dateString.push((_check.noticeDate.getHours()) + ':' + ((10 > _check.noticeDate.getMinutes() ? '0' : '') + _check.noticeDate.getMinutes()));

					_dl.push('<div class="box_full_btn">');
					_dl.push('<a href="#" class="btn_btm_left"><span class="inner">&nbsp;</span></a>');
					_dl.push('<a href="#" class="btn_btm_right col"><span class="inner">'+_dateString.join(' ')+' 선예매</span></a>');
					_dl.push('</div>');
					_dl = $(_dl.join(''));

					// 선예매 대상자 여부 확인
					_checkSalePreReserve(_tp, function() {
						// 선예매 인증 이벤트 바인딩
						_bindBtnPreReserveAuth(_tp, _dl.find('a:first'));

						// 선예매 오픈예정 이벤트 바인딩
						_dl.find('a:last').unbind('click').on('click', function(e) {
							e.preventDefault();

							ActionHandler.toast(_dateString.join(' ')+' 선예매 오픈');
						});
						//QQQ 선예매버튼 카운트다운
						var timer = TimerAction.init( _dl.find('a.btn_btm_right span'), _check.dataSalePreReserve.reserveStartDt, 'ST0002');//선예매
						TimerAction.setTextPrefix('선예매오픈 ', '선예매 ');
						TimerAction.setIsSimpleBtn(true);
						$.when(timer).done(function(){
							// 선예매 이벤트 바인딩
							var _tgt = _dl.find('a:last');
							_tgt.removeClass('col');
							_bindBtnPreReserve(_tp, _tgt);
						});
					});
				}

				// 선예매인증 - 선예매
				else if (_check.isPreTicketingAuth && _check.isPreTicketing && !_check.isTicketing) {
					_dl.push('<div class="box_full_btn">');
					_dl.push('<a href="#" class="btn_btm_left"><span class="inner">&nbsp;</span></a>');
					_dl.push('<a href="#" class="btn_btm_right"><span class="inner">선예매하기</span></a>');
					_dl.push('</div>');
					_dl = $(_dl.join(''));

					// 선예매 대상자 여부 확인
					_checkSalePreReserve(_tp,
							function() {
								// 선예매 인증 이벤트 바인딩
								_bindBtnPreReserveAuth(_tp, _dl.find('a:first'));

								// 선예매 이벤트 바인딩
								_bindBtnPreReserve(_tp, _dl.find('a:last'));
							});
				}

				// 선예매인증 - 예매
				else if (_check.isPreTicketingAuth && !_check.isPreTicketing && _check.isTicketing) {
					_dl.push('<div class="box_full_btn">');
					_dl.push('<a href="#" class="btn_btm_left"><span class="inner">&nbsp;</span></a>');
					_dl.push('<a href="#" class="btn_btm_right"><span class="inner">예매하기</span></a>');
					_dl.push('</div>');
					_dl = $(_dl.join(''));

					// 선예매 대상자 여부 확인
					_checkSalePreReserve(_tp,
							function() {
								// 선예매 인증 이벤트 바인딩
								_bindBtnPreReserveAuth(_tp, _dl.find('a:first'));

								// 선예매 이벤트 바인딩
								_bindBtnPreReserve(_tp, _dl.find('a:last'));
							});

					// 일반예매 이벤트 바인딩
					//_bindBtnReserve(_tp, _dl.find('a:last'));
				}

				// 선예매
				else if (_check.isPreTicketing && !_check.isPreTicketingAuth && !_check.isTicketing) {
					_dl.push('<div class="box_full_btn">');
					_dl.push('<a href="#" class="btn_btm_full"><span class="inner">선예매하기</span></a>');
					_dl.push('</div>');
					_dl = $(_dl.join(''));

					// 선예매 대상자 여부 확인
					_checkSalePreReserve(_tp,
							function() {
								// 선예매 이벤트 바인딩
								_bindBtnPreReserve(_tp, _dl.find('a:first'));
							});

				}

				// 선예매 - 예매
				else if (_check.isPreTicketing && !_check.isPreTicketingAuth && _check.isTicketing) {
					_dl.push('<div class="box_full_btn">');
					_dl.push('<a href="#" class="btn_btm_left"><span class="inner">선예매</span></a>');
					_dl.push('<a href="#" class="btn_btm_right"><span class="inner">예매하기</span></a>');
					_dl.push('</div>');
					_dl = $(_dl.join(''));

					// 선예매 대상자 여부 확인
					_checkSalePreReserve(_tp,
							function() {
								// 선예매 이벤트 바인딩
								_bindBtnPreReserve(_tp, _dl.find('a:first'));
							});

					// 일반예매 이벤트 바인딩
					_bindBtnReserve(_tp, _dl.find('a:last'));
				}

				// 예매 예고 / 예매 중지 설정
				else if (!_check.isPreTicketing && !_check.isPreTicketingAuth && !_check.isTicketing) {

					var hasPreTicketing = false;
					if(_check.dataSalePreReserve != undefined && _check.dataSalePreReserve.saleTypeCode === 'ST0002'
						&& StringUtils.convertStringToDate(_check.dataSalePreReserve.reserveStartDt).getTime() > new Date().getTime()){//선예매 스케쥴이 있는지 확인
						hasPreTicketing = true;
					}

					// 예매 시작일 세팅
					var _dateString = [],
						_reserveStartDt = StringUtils.convertStringToDate(_check.dataSaleReserve.reserveStartDt),
						_reserveEndDt = StringUtils.convertStringToDate(_check.dataSaleReserve.reserveEndDt);
					var startDt = _check.dataSaleReserve.reserveStartDt;

					if(hasPreTicketing){
						_reserveStartDt = StringUtils.convertStringToDate(_check.dataSalePreReserve.reserveStartDt);
						_reserveEndDt = StringUtils.convertStringToDate(_check.dataSalePreReserve.reserveEndDt);

						startDt = _check.dataSalePreReserve.reserveStartDt;
					}

					// 예매 예고 케이스
					// _reserveStartDt.getUTCFullYear() != '9999'
					if (_reserveStartDt.getTime() > new Date().getTime() && _reserveStartDt.getUTCFullYear() != '9999') {
						_dateString.push((_reserveStartDt.getMonth() + 1) + '월');
						_dateString.push(_reserveStartDt.getDate() + '일');
//						_dateString.push(_reserveStartDt.getHours() + ':' + (10 > _reserveStartDt.getMinutes() ? '0' : '') + _reserveStartDt.getMinutes());
						_dateString.push((10 > _reserveStartDt.getHours() ? '0' : '')+_reserveStartDt.getHours() + ':' + (10 > _reserveStartDt.getMinutes() ? '0' : '') + _reserveStartDt.getMinutes());
						_dateString.push(hasPreTicketing ? '선예매 오픈!':'티켓오픈!');

						_dl.push('<div class="box_full_btn">');
						_dl.push('<a href="#" class="btn_btm_full_off">'+_dateString.join(' ')+'</a>');
						_dl.push('</div>');

						_dl = $(_dl.join(''));

						//var timer = TimerAction.init(_dl.find('a'), _check.dataSaleReserve.reserveStartDt);
						var timer = TimerAction.init(_dl.find('a'), startDt, hasPreTicketing ? 'ST0002':'ST0001');
						TimerAction.setTextPrefix(hasPreTicketing?'선예매오픈 남은시간 ':'티켓오픈 남은시간 ');
						TimerAction.setIsSimpleBtn(false);
						//console.log('elapsed:'+ (new Date().getTime() - start) + 'msec');
						$.when(timer).done(function(){
							//console.log('done');
							//activate button - style
							_dl.find('a').removeClass('btn_btm_full_off').addClass('btn_btm_full');
							// 일반예매 이벤트 바인딩
							_bindBtnReserve(_tp, _dl.find('a'));
							//_dl.find('a').click();
						}).fail(function(){
							//do nothing
						});
					}
					// 예매종료 케이스
					else if (_reserveEndDt.getTime() < new Date().getTime() || _reserveStartDt.getUTCFullYear() == '9999') {
						_dateString.push('판매가 종료된 상품입니다.');

						_dl.push('<div class="box_full_alert">');
						_dl.push('<span class="ico_comm ico_bt_alert"></span>'+_dateString.join(' ')+'</div>');

						_dl = $(_dl.join(''));
					}

					_dl.find('a').unbind('click').on('click', function(e) {
						e.preventDefault();

						ActionHandler.toast(_dateString.join(' '));
					});
				}

				// 일반 예매버튼 추가
				else {
					_dl.push('<div class="box_full_btn">');
					_dl.push('<a href="#action" class="btn_btm_full">예매하기</a>');
					_dl.push('</div>');
					_dl = $(_dl.join(''));

					// 일반예매 이벤트 바인딩
					_bindBtnReserve(_tp, _dl.find('a'));
				}
			}
			// 상시상품 카운트 다운 적용
			else {

				var _check = _getSaleTypeInfo(_tp);

				if (!_check.isPreTicketing && !_check.isPreTicketingAuth && !_check.isTicketing) {

					var hasPreTicketing = false;
					if(_check.dataSalePreReserve != undefined && _check.dataSalePreReserve.saleTypeCode === 'ST0002'
						&& StringUtils.convertStringToDate(_check.dataSalePreReserve.reserveStartDt).getTime() > new Date().getTime()){//선예매 스케쥴이 있는지 확인
						hasPreTicketing = true;
					}

					// 예매 시작일 세팅
					var _dateString = [],
						_reserveStartDt = StringUtils.convertStringToDate(_check.dataSaleReserve.reserveStartDt),
						_reserveEndDt = StringUtils.convertStringToDate(_check.dataSaleReserve.reserveEndDt);
					var startDt = _check.dataSaleReserve.reserveStartDt;

					if(hasPreTicketing){
						_reserveStartDt = StringUtils.convertStringToDate(_check.dataSalePreReserve.reserveStartDt);
						_reserveEndDt = StringUtils.convertStringToDate(_check.dataSalePreReserve.reserveEndDt);

						startDt = _check.dataSalePreReserve.reserveStartDt;
					}

					// 예매 예고 케이스
					if (_reserveStartDt.getTime() > new Date().getTime() && _reserveStartDt.getUTCFullYear() != '9999') {
						_dateString.push((_reserveStartDt.getMonth() + 1) + '월');
						_dateString.push(_reserveStartDt.getDate() + '일');
//						_dateString.push(_reserveStartDt.getHours() + ':' + (10 > _reserveStartDt.getMinutes() ? '0' : '') + _reserveStartDt.getMinutes());
						_dateString.push((10 > _reserveStartDt.getHours() ? '0' : '')+_reserveStartDt.getHours() + ':' + (10 > _reserveStartDt.getMinutes() ? '0' : '') + _reserveStartDt.getMinutes());
						_dateString.push(hasPreTicketing ? '선예매 오픈!':'티켓오픈!');

						_dl.push('<div class="box_full_btn">');
						_dl.push('<a href="#" class="btn_btm_full_off">'+_dateString.join(' ')+'</a>');
						_dl.push('</div>');

						_dl = $(_dl.join(''));

						//var timer = TimerAction.init(_dl.find('a'), _check.dataSaleReserve.reserveStartDt);
						var timer = TimerAction.init(_dl.find('a'), startDt, hasPreTicketing ? 'ST0002':'ST0001');
						TimerAction.setTextPrefix(hasPreTicketing?'선예매오픈 남은시간 ':'티켓오픈 남은시간 ');
						TimerAction.setIsSimpleBtn(false);
						//console.log('elapsed:'+ (new Date().getTime() - start) + 'msec');
						$.when(timer).done(function(){
							//console.log('done');
							//activate button - style
							_dl.find('a').removeClass('btn_btm_full_off').addClass('btn_btm_full');
							// 일반예매 이벤트 바인딩
//							_bindBtnReserve(_tp, _dl.find('a'));

							_dl.push('<div class="box_full_btn">');
							_dl.push('<a href="#action" class="btn_btm_full">예매하기</a>');
							_dl.push('</div>');

//							_dl = $(_dl.join(''));

							_dl.find('a').unbind('click').on('click', function(e) {
								e.preventDefault();

								//로그인 여부
								if(!isMelonLogin()){
									ActionHandler._confirmLogin();
									return;
								}

								//main process 정의
								var _process = function(pData) {
									if (GRADE_CODE_19 === pData.gradeCode) {
										// 성인 인증여부 체크
										if ('Y' !== checkAdultValue) {
											var _prodId = pData.prodId;
											if(authErrCode == 'ERL087'){
												//19금 이용 가능 회원이 아닙니다.
												ActionHandler.alert({
													message: '19세 이상 관람 가능한 공연으로 미성년자의 예매가 불가합니다.'
												})
												return;
											}

											ActionHandler.alert({
												message: '19세 이상 관람 가능한 공연으로 예매서비스 이용 시 성인인증이 필요합니다.',
												callback: function () {
													_moveCheckAuthWParam({
														pType: AUTH_TYPE_ADULT,
														fromContId: pData.prodId,
														fromType: 'performance'
													});
												}
											});
											return;
										}else{
											if (19 > getMemberAge()) {
												ActionHandler.alert({
													message: '19세 이상 관람 가능한 공연으로 미성년자의 예매가 불가합니다.'
												})

												return false;
											}
										}
									}else{
										if ('Y' !== checkAuthValue) {
											ActionHandler.alert({
												message: '전자상거래 등에서의 소비자보호에 관한 법률 제6조(거래기록의 보존 등)에 의해 예매서비스 이용 시 본인확인이 필요합니다.',
												callback: function () {
													_moveCheckAuthWParam({
														pType: AUTH_TYPE_REAL,
														fromContId: pData.prodId,
														fromType: 'performance'
													});
												}
											});

											return;
										}
									}

									//if (ActionHandler._confirmLogin()) {
										_moveOneStop(pData);
									//}
								}

								//실행부
								_authcheck_app(pData, _process);
							});




							//_dl.find('a').click();
						}).fail(function(){
							//do nothing
						});
					}
					// 예매종료 케이스
					else if (_reserveEndDt.getTime() < new Date().getTime() || _reserveStartDt.getUTCFullYear() == '9999') {
						_dateString.push('판매가 종료된 상품입니다.');

						_dl.push('<div class="box_full_alert">');
						_dl.push('<span class="ico_comm ico_bt_alert"></span>'+_dateString.join(' ')+'</div>');

						_dl = $(_dl.join(''));
					}

					_dl.find('a').unbind('click').on('click', function(e) {
						e.preventDefault();

						ActionHandler.toast(_dateString.join(' '));
					});
				}else{
					_dl.push('<div class="box_full_btn">');
					_dl.push('<a href="#action" class="btn_btm_full">예매하기</a>');
					_dl.push('</div>');

					_dl = $(_dl.join(''));

					_dl.find('a').unbind('click').on('click', function(e) {
						e.preventDefault();

						//인증 skip   QQQ 임시코드
						//checkAuthValue = 'Y';
						//checkAdultValue = 'Y';

						//로그인 여부
						if(!isMelonLogin()){
							ActionHandler._confirmLogin();
							return;
						}

						//main process 정의
						var _process = function(pData) {
							if (GRADE_CODE_19 === pData.gradeCode) {
								// 성인 인증여부 체크
								if ('Y' !== checkAdultValue) {
									var _prodId = pData.prodId;
									if(authErrCode == 'ERL087'){
										//19금 이용 가능 회원이 아닙니다.
										ActionHandler.alert({
											message: '19세 이상 관람 가능한 공연으로 미성년자의 예매가 불가합니다.'
										})
										return;
									}

									ActionHandler.alert({
										message: '19세 이상 관람 가능한 공연으로 예매서비스 이용 시 성인인증이 필요합니다.',
										callback: function () {
											_moveCheckAuthWParam({
												pType: AUTH_TYPE_ADULT,
												fromContId: pData.prodId,
												fromType: 'performance'
											});
										}
									});
									return;
								}else{
									if (19 > getMemberAge()) {
										ActionHandler.alert({
											message: '19세 이상 관람 가능한 공연으로 미성년자의 예매가 불가합니다.'
										})

										return false;
									}
								}
							}else{
								if ('Y' !== checkAuthValue) {
									ActionHandler.alert({
										message: '전자상거래 등에서의 소비자보호에 관한 법률 제6조(거래기록의 보존 등)에 의해 예매서비스 이용 시 본인확인이 필요합니다.',
										callback: function () {
											_moveCheckAuthWParam({
												pType: AUTH_TYPE_REAL,
												fromContId: pData.prodId,
												fromType: 'performance'
											});
										}
									});

									return;
								}
							}

							//if (ActionHandler._confirmLogin()) {
								_moveOneStop(pData);
							//}
						}

						//실행부
						_authcheck_app(pData, _process);
					});
				}

				// 상시, 패키지 상품은 원스탑 바로 이동
//				_dl.push('<div class="box_full_btn">');
//				_dl.push('<a href="#action" class="btn_btm_full">예매하기</a>');
//				_dl.push('</div>');
//
//				_dl = $(_dl.join(''));
//
//				_dl.find('a').unbind('click').on('click', function(e) {
//					e.preventDefault();
//
//					//인증 skip   QQQ 임시코드
//					//checkAuthValue = 'Y';
//					//checkAdultValue = 'Y';
//
//					//로그인 여부
//					if(!isMelonLogin()){
//						ActionHandler._confirmLogin();
//						return;
//					}
//
//					//main process 정의
//					var _process = function(pData) {
//						if (GRADE_CODE_19 === pData.gradeCode) {
//							// 성인 인증여부 체크
//							if ('Y' !== checkAdultValue) {
//								var _prodId = pData.prodId;
//								//reserveModel
//								//	.deliver(function (pData) {
//								//		if (pData.resultCode === '-1') {
//								//			ActionHandler.alert({
//								//				message: pData.message,
//								//				callback: function (d) {
//								//					authCheckUrl = pData.reqUrl;
//								//					//_moveCheckAuth(AUTH_TYPE_ADULT);
//								//					_moveCheckAuthWParam({
//								//						pType: AUTH_TYPE_ADULT,
//								//						fromContId: _prodId,
//								//						fromType: 'performance'
//								//					});
//								//				}
//								//			});
//								//		}
//								//		else if (pData.resultCode !== '000000') {
//								//			authCheckUrl = pData.reqUrl;
//								//			//_moveCheckAuth(AUTH_TYPE_ADULT);
//								//			_moveCheckAuthWParam({
//								//			pType: AUTH_TYPE_ADULT,
//								//			fromContId: _prodId,
//								//			fromType: 'performance'
//								//		});
//								//	}
//								//}).checkAdult();
//								if(authErrCode == 'ERL087'){
//									//19금 이용 가능 회원이 아닙니다.
//									ActionHandler.alert({
//										message: '19세 이상 관람 가능한 공연으로 미성년자의 예매가 불가합니다.'
//									})
//									return;
//								}
//
//								ActionHandler.alert({
//									message: '19세 이상 관람 가능한 공연으로 예매서비스 이용 시 성인인증이 필요합니다.',
//									callback: function () {
//										_moveCheckAuthWParam({
//											pType: AUTH_TYPE_ADULT,
//											fromContId: pData.prodId,
//											fromType: 'performance'
//										});
//									}
//								});
//								return;
//							}else{
//								if (19 > getMemberAge()) {
//									ActionHandler.alert({
//										message: '19세 이상 관람 가능한 공연으로 미성년자의 예매가 불가합니다.'
//									})
//
//									return false;
//								}
//							}
//						}else{
//							if ('Y' !== checkAuthValue) {
//								ActionHandler.alert({
//									message: '전자상거래 등에서의 소비자보호에 관한 법률 제6조(거래기록의 보존 등)에 의해 예매서비스 이용 시 본인확인이 필요합니다.',
//									callback: function () {
//										_moveCheckAuthWParam({
//											pType: AUTH_TYPE_REAL,
//											fromContId: pData.prodId,
//											fromType: 'performance'
//										});
//									}
//								});
//
//								return;
//							}
//						}
//
//						//if (ActionHandler._confirmLogin()) {
//							_moveOneStop(pData);
//						//}
//					}
//
//					//실행부
//					_authcheck_app(pData, _process);
//				});
			}
		}

		// 글로벌 하단 버튼추가 함수
		addButton(_dl);
	},

	_authcheck_app = function(pData, callback){
		//mobile app 인 경우 인증여부 재확인 필요, 정보만 업데이트
		if(mstApp.isApp()){
			if(GRADE_CODE_19 === pData.gradeCode){
				reserveModel
					.deliver(function(_pData) {
						if(_pData.resultCode !== '000000'){
							authCheckUrl = _pData.reqUrl;
							checkAdultValue = 'N';
							checkAuthValue = 'N';
							viewType = _pData.viewType;
							authErrCode = _pData.errorCode;
						}else{
							checkAdultValue = 'Y';
							checkAuthValue = 'Y';
							viewType = '';
							authErrCode = '';
						}

						if(typeof callback == 'function'){
							callback(pData);
						}
					}).checkAdult();
			}else{
				reserveModel
					.deliver(function(_pData) {
						if(_pData.resultCode !== '000000'){
							authCheckUrl = _pData.reqUrl;
							checkAuthValue = 'N';
							viewType = _pData.viewType;
							authErrCode = _pData.errorCode;
						}else{
							checkAuthValue = 'Y';
							viewType = '';
							authErrCode = '';
						}

						if(typeof callback == 'function'){
							callback(pData);
						}
					}).checkAuth();
			}
		}else{

			//브라우져
			callback(pData);
		}
	},

	/**
	 * 예매하기 카렌다형 팝업 초기화
	 */
	_initPopupCalendar = function() {
		var _d = ActionHandler._getData('performance.reserve');

		performanceModel
			.deliver(_drawCalendar)
			.listProductSchedule({
				prodId: _d.prodId,
				pocCode: _d.pocCode,
				perfTypeCode: _d.perfTypeCode,
				sellTypeCode: _d.sellTypeCode
			});

		//buy logging
		Logger.buylog(_d.prodId);
	},

	/**
	 * 예매하기 리스트형 팝업 초기화
	 */
	_initPopupList = function() {
		var _d = ActionHandler._getData('performance.reserve');

		performanceModel
			.deliver(_drawSeatList)
			.listProductSchedule({
				prodId: _d.prodId,
				pocCode: _d.pocCode,
				perfTypeCode: _d.perfTypeCode,
				sellTypeCode: _d.sellTypeCode
			});

		//buy logging
		Logger.buylog(_d.prodId);
	},

	/**
	 * 선예매 인증팝업 초기화
	 */
	_initPopupPreAuth = function() {
		_drawAuthItems();
	},

	/**
	 * 인증스텝 초기화
	 */
	_initReserveAuths = function(pData) {

		if (GRADE_CODE_19 === pData.gradeCode) {
			//성인인증 하나로 본인 인증까지 확인이 된다.(한번만 호출)

			// 성인인증 여부 체크
			_checkAdult();

		}else{

			// 실명인증 여부 체크
			_checkAuth();
		}
	},

	_reset = function(){
		checkAuthValue = 'N';
		checkAdultValue = 'N';
		authCheckUrl = '';
		viewType = '';

		isPreReserveAble = false;
	}


	return {
			// 본인인증 페이지로 이동
			moveCheckAuthReal: function(pData) {
				//_moveCheckAuth(AUTH_TYPE_REAL);
				if(pData.pType === undefined){
					_moveCheckAuthWParam($.extend({pType:AUTH_TYPE_REAL},pData));
				}else{
					_moveCheckAuthWParam(pData);
				}
			},

			// 성인인증 페이지로 이동
			moveCheckAuthAdult: function(pData) {
				//_moveCheckAuth(AUTH_TYPE_ADULT);
				_moveCheckAuthWParam($.extend({pType:AUTH_TYPE_ADULT},pData));
			},

			moveCheckAuth: function(pData) {
				_moveCheckAuthWParam(pData);
			},

			// 예매하기 초기화
			init: function(pData) {
				// [CAPTCHA] 
				try{ 
					AUTH_RSRV_YN = pData.authRsrvYn; 
					setCookie('ARY_CM', '', 10, '/', 'melon.com');			// [CAPTCHA]
				}catch(e){  };
				// 인증스텝 초기화
				//_initReserveAuths(pData);

				// 예매버튼 초기화
				_initReserveButton(pData);

				return pData;
			},

			// 예매하기 카렌다형 팝업 초기화
			initPopupCalendar: function() {
				_initPopupCalendar();
			},

			// 예매하기 리스트형 팝업 초기화
			initPopupList: function() {
				_initPopupList();
			},

			// 선예매 인증팝업 초기화
			initPopupPreAuth: function() {
				_initPopupPreAuth();
			}
			,
			//getCheckAudultValue: function() {
			//	return checkAdultValue;
			//}
			//,
			//getCheckAuthValue: function() {
			//	return checkAuthValue;
			//}
			//,
			reset: function() {
				_reset();
			}
			,
			refresh:function(pData) {
				$('.box_full_btn').remove();
				_initReserveButton(pData);
			}
			,
			setAuthCheckUrl : function(pUrl) {
				authCheckUrl = pUrl;
			},

			initReserveAuth : function(pData) {
				_initReserveAuths(pData);
			},

			checkAuth: function(type, callback){
				_checkAuthWcallback({'type':type, 'callback': callback});
			}
	};

});