/**
 * String Utils
 */
define([], function() {
	var entityMap = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': '&quot;',
		"'": '&#39;',
		"/": '&#x2F;'
	};

	var StringUtils = {

		/**
		 * 스트링 문자열 일자표기 데이트형으로 변환 
		 * 
		 * @param pDateString - 스트링 Date (Format:'yyyyMMddhhmmss', 'yyyyMMddhhmm')
		 * @returns Date - Date 타입
		 */
		convertStringToDate: function(pDateString) {
			var _this = this, _date = null, _regexp;
			
			if (_this.isEmpty(pDateString)) {
				return null;
			}
			
			// 자릿수 채우기
			if (12 < pDateString.length && 14 > pDateString.length) {
				do {
					pDateString += '0';
				} while (14 > pDateString.length);
			}
			
			if(14 === pDateString.length) {
				_regexp = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
			}
			else if (12 === pDateString.length) {
				_regexp = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})/;
			}
				
			var _tmpArr = pDateString.match(_regexp);

			if (6 > _tmpArr.length) {
				return null;
			}

			
			_date = new Date();
			_date.setFullYear(_tmpArr[1]);
			_date.setDate(_tmpArr[3]);
			_date.setHours(_tmpArr[4]);
			_date.setMinutes(_tmpArr[5]);
			
			var _monthIndex = Number(_tmpArr[2])-1;
			_date.setMonth(_monthIndex);
			
			// 초단위 추가설정
			if (7 === _tmpArr.length) {
				_date.setSeconds(_tmpArr[6]);
			}
			
			return _date;
		},
		
		/**
		 * 해당 날짜의 요일 구하기
		 * 
		 * @param pDateString		스트링 Date
		 */
		getWeekByDate : function (pDateString) {
			pDateString = pDateString.replace(/[^0-9]/gi,'');
			if(pDateString.length < 8 ){
				return '';
			}

			var _year  		= pDateString.substr(0,4);
			var _mon 		= pDateString.substr(4,2);
			var _day   		= pDateString.substr(6,2);
			var _weekstr 	= ['일','월','화','수','목','금','토'];
			var _date		= new Date(_year, _mon-1, _day);
			var _wn	= '';

			_wn = _weekstr[_date.getDay()];
		 	
			return	_wn;
		},
		
		/**
		 * 스트링 문자열 일자표기 경과 시간 표기로 변환
		 * 
		 * @param pDateString - 스트링 Date (Format:'yyyyMMddhhmmss')
		 * @returns String - 변환된 경과시간 표기  
		 * 
		 * 1시간 미만 : N분 전
		 * 24시간 미만 : N시간 전 
		 * 1일 ~ 7일 : N일 전 
		 * 7일 이상 : YY년 MM월 DD일 
		 * 
		 */
		convertDateReadable: function(pDataString) {
			var _this = this, _convDate, _currDate, _result = [];
			_convDate = _this.convertStringToDate(pDataString);

			if (undefined !== _convDate) {
				var _currDate = new Date(), _subDate = _currDate - _convDate;
				
				// 1시간 미만
				if (_subDate < 1000*60*60) {
					_result.push(Math.floor(_subDate / 1000 / 60) +'분 전');
				}
				
				// 24시간 미만
				else if (_subDate < 1000*60*60*60) {
					_result.push(Math.floor(_subDate / 1000 / 60 / 60) +'시간 전');
				}
				
				// 1 ~ 7일 미만
				else if (_subDate > 1000*60*60*60 && _subDate < 1000*60*60*60*7) {
					_result.push(Math.floor(_subDate / 1000 / 60 / 60 / 24) +'일 전 ');
				}
				
				// 7일 이상
				else {
					_result.push(_convDate.getFullYear().toString().replace(/^\d{2}/, '') + '년');
					_result.push(_convDate.getMonth() + 1 + '월');
					_result.push(_convDate.getDate() + '일');
				}
			}

			return _result.join(' ');
		},
		
		/**
		 * 현재일이 해당 일자에 포함되어 있는지 확인 
		 * 
		 * @param pStartDate - 시작일
		 * @param pEndDate - 종료일
		 */
		validBetweenDate: function(pStartDate, pEndDate) {
			var _this = this, _isValid = false, _now = new Date();
			
			return (_this.convertStringToDate(pStartDate) <= _now) && (_this.convertStringToDate(pEndDate) >= _now);
		},
		
		/**
		 * 통화 금액 콤마구분
		 */
		numberFormat: function(pString) {
			pString = '' + pString;
			return pString.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
		},
		
		/**
		 * 이메일 포맷 여부 확인
		 */
		isEmail: function (pString) { 
			return /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/.test(pString);
		},
		
		/**
		 * 문자열 빈값 체크
		 * 
		 *  @param pString - 체크할 문자
		 *  @returns Boolean - 공백 여부
		 */ 
		isEmpty: function(pString) {
			
			if (undefined === pString || null === pString) {
				return true;
			}
			else {
				if ('' === $.trim(pString)) {
					return true;
				}
				else {
					return false;
				}
			}
		},
		
		/**
		 * 문자열 빈값 체크
		 * 
		 *	@param pString - 체크할 문자
		 *  @returns Boolean - 공백 여부
		 */
		isNotEmpty: function(pString) {
			return !this.isEmpty(pString);
		},

		//yyyy.mm.dd - yyyy.mm.dd or yyyy-mm-dd ~ yyyy-mm-dd
		parseStartDt: function(pString) {
			if(pString == null || pString == undefined){
				return null;
			}
			var _stStr = pString.replace(/[\.\-\s~]/g,'');
			_stStr = _stStr.substring(0,8);

			var _dtStart = new Date();
			try {
				_dtStart.setFullYear(parseInt(_stStr.substring(0, 4)), parseInt(_stStr.substring(4, 6)) - 1, parseInt(_stStr.substring(6, 8)));
			}catch(e){
				//_dtStart = new Date();
			}
			return _dtStart;
		},

		

		escapeHtml: function (string) {
			return String(string).replace(/[&<>"'\/]/g, function (s) {
				return entityMap[s];
			});
		},

		xsscheck: function (strTemp, level) {
			if ( level == undefined || level == 0 ) {
				strTemp = strTemp.replace(/\<|\>|\"|\'|\%|\;|\(|\)|\&|\+|\-/g,"");
			}
			else if (level != undefined && level == 1 ) {
				strTemp = strTemp.replace(/\</g, "&lt;");
				strTemp = strTemp.replace(/\>/g, "&gt;");
			}
			return strTemp;
		},
		
		isValidNumber:  function(mPhoneNo){
			
			var regExp = /^[0-9]+$/;
			var tRegExp = /^(01[016789]{1}|02|0[3-7]{1}[0-9]{1})-?[0-9]{3,4}-?[0-9]{4}$/;
			var tPhoneNo ="";
			
			for (var i = 0; i < mPhoneNo.length; i++) { 
				if (!mPhoneNo[i].val()) {
					ActionHandler.alert({
						message: '연락처를 입력해 주세요.',
						callback: function() {
							return $("#phoneNo"+(i+1)).focus();
							return false;
						}
					});
					return false;
				}
				
				if (!regExp.test(mPhoneNo[i].val())) {
					ActionHandler.alert({
						message: '<유효한 연락처>를 숫자로만 입력해주세요.',
						callback: function() {
							return $("#phoneNo"+(i+1)).focus();
							return false;
						}
					});
					return false;
				}
				
				tPhoneNo = tPhoneNo + ((i > 0 )?"-":"")+mPhoneNo[i].val();
				
			} // for
			
		    if (!tRegExp.test( tPhoneNo)) {
		    	ActionHandler.alert({
					message: '<유효한 연락처>를 숫자로만 입력해주세요.'
				});
		    	return false;
		    }
		    
		     return tPhoneNo.replace(/\-/gi, "");
		},
		
		printTelNumber: function(tNum) {
			var noReg = /^[-]|[^0-9-]/gi;
			
			if(noReg.test(tNum)){
				var temp = tNum.replace(/-/gi, "");
				tNum = temp.substring(0,3)+"-"+temp.substring(3,6)+"-"+temp.substring(6)
			};
			
			var tTelNum = tNum.replace(/^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})-?([0-9]{3,4})-?([0-9]{4})$/, "$1-$2-$3"); 
			
			return tTelNum;
		}
		
	};
	return (StringUtils);
});
