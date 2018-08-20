/**
 * 상품상세화면 데이터 호출
 */
define(['Model'], function(Model) {

	var PerformanceModel = function(){

		var _this = this;

		/**
		 * 상품상세정보 가져오기
		 *
		 * @param pOption - 파라메터
		 */
		_this._getPerformanceDetail = function(pData) {
            // console.log(getCookie("partnerAdminGate"));
            // console.log(getCookie("partnerAdminGateLandType"));
            // console.log(getCookie("partnerAdminGateProdId"));
            // console.log(getCookie("partnerAdminGateType"));

			var partnerpData = pData;
            var partnerBranch = "performance.detail";  //기존 로직
            var partnerAdminGate = getCookie("partnerAdminGate");
            var partnerAdminGateLandType = getCookie("partnerAdminGateLandType");
            var partnerAdminGateProdId = getCookie("partnerAdminGateProdId");
            var partnerAdminGateType = getCookie("partnerAdminGateType");

            if(partnerAdminGate != "" && partnerAdminGateLandType != ""
                && partnerAdminGateProdId != "" && partnerAdminGateType != "" ) {
                partnerBranch = "performance.detailpreview";
                partnerpData = $.extend(pData,{
                    "prodId" : ActionHandler._getData('performance.index').prodId,
                    "gatelandingType" : ActionHandler._getData('performance.index').gatelandingType
                });
            }

			ActionHandler.apis[partnerBranch].execute({
				data: partnerpData,
				callback: function(d) {
					if (undefined !== d.data) {
						_this.setData('getPerformanceDetail', d.data);
					}
					else {
						// 상품 상세에서 호출 될 경우 이전페이지로 이동.
						if (null !== location.hash.match(/performance.index/)) {
							ActionHandler.toast(d.message,
								function() {
									window.history.back();
							});
						}
					}
				}
			});

		}

		/**
		 * 상품상세정보 바인드
		 *
		 * @param pOption - 파라메터
		 */
		_this._bindPerformanceDetail = function(pData) {
            // console.log(getCookie("partnerAdminGate"));
            // console.log(getCookie("partnerAdminGateLandType"));
            // console.log(getCookie("partnerAdminGateProdId"));
            // console.log(getCookie("partnerAdminGateType"));

			var partnerpData = pData;
            var partnerBranch = "performance.detail";  //기존 로직
            var partnerAdminGate = getCookie("partnerAdminGate");
            var partnerAdminGateLandType = getCookie("partnerAdminGateLandType");
            var partnerAdminGateProdId = getCookie("partnerAdminGateProdId");
            var partnerAdminGateType = getCookie("partnerAdminGateType");

            if(partnerAdminGate != "" && partnerAdminGateLandType != ""
                && partnerAdminGateProdId != "" && partnerAdminGateType != "" ) {
                partnerBranch = "performance.detailpreview";
                partnerpData = $.extend(pData,{
                    "prodId" : ActionHandler._getData('performance.index').prodId,
                    "gatelandingType" : ActionHandler._getData('performance.index').gatelandingType
                });
            }

            ActionHandler.apis[partnerBranch].bindData({
				data: partnerpData,
				callback: function(d) {
					if (0 === d.result && undefined !== d.data) {
						_this.setData('bindPerformanceDetail', d.data);
					}
					else {
						// 상품 상세에서 호출 될 경우 이전페이지로 이동.
						if (null !== location.hash.match(/performance.index/)) {
							ActionHandler.toast(d.message,
									function() {
								//window.history.back();
									content.load('home.index'); //해당 상품이 없을 경우 홈으로 이동 (무한루프 방지)
							});
						}
					}
				}
			});
		}

		/**
		 * 공연플래너 등록여부
		 */
		_this._getIsFavorite = function(pData) {
			ActionHandler.apis['performance.isFavorite'].execute({
				data : pData,
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('getIsFavorite', d.data);
					}
				}
			});
		}

		/**
		 * 공연후기 이미지 조회
		 */
		_this._listReviewInfos = function(pData) {
			ActionHandler.apis['performance.listReviewInfos'].execute({
				data: pData,
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('listReviewInfos', d.data);
					}
				}
			});
		}

		/**
		 * 할인정보 조회
		 */
		_this._listTicketType = function(pData) {
			ActionHandler.apis['product.tickettype.list'].execute({
				data: pData,
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('listTicketType', d.data);
					}
				}
			});
		}

		/**
		 * 예매가능 기간 조회
		 */
		_this._listProductSchedule = function(pData) {
			ActionHandler.apis['product.schedule.list'].execute({
				data: $.extend(pData,{timestamp:new Date().yyyymmddhhmiss()}),
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('listProductSchedule', d.data);
					}
				}
			});
		},

		/**
		 * 선예매 인증결과 조회
		 */
		_this._checkPreReserve = function(pData) {
			ActionHandler.apis['prersrv.usercond'].execute({
				data: pData,
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('checkPreReserve', d.data);
					}
				}
			});
		},

		/**
		 * 선예매 사전인증 요청
		 */
		_this._authPreReserve = function(pData) {
			ActionHandler.apis['prersrv.auth'].execute({
				data: pData,
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('authPreReserve', d.data);
					}
				}
			});
		},

		/**
		 * 선예매 사전인증 정보 요청
		 */
		_this._getPreReserveInfo = function(pData) {
			ActionHandler.apis['prersrv.authitem'].execute({
				data: pData,
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('getPreReserveInfo', d.data);
					}
				}
			});
		},

		/**
		 * 장르/테마 리스트 요청
		 */
		_this._getConcertListByClassCode = function(pData) {
			ActionHandler.apis['performance.getConcertListByClassCode'].execute({
				data: pData,
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('getConcertListByClassCode',
								$.extend(d.data,
										{'param':{'pg':pData.pg,'pgSize':pData.pgSize},
											'TOTALPAGECOUNT': d.TOTALPAGECOUNT}));
					}
				}
			});
		},
		
		
		/**
		 * 서브 장르/테마 리스트 요청
		 */
		_this._getSubGenreThemeList = function(pData) {
			ActionHandler.apis['performance.getSubGenreThemeList'].execute({
				data: pData,
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('getSubGenreThemeList',d.data);
					}
				}
			});
		},
		
		/**
		 * 장르/테마 리스트 요청
		 */
		_this._getConcertListByCupnId = function(pData) {
			ActionHandler.apis['performance.list.by.coupon'].execute({
				data: pData,
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('getConcertListByCupnId',
								$.extend(d.data,
										{'param':{'pg':pData.pg,'pgSize':pData.pgSize,'cupnId':pData.cupnId},
									'TOTALPAGECOUNT': d.TOTALPAGECOUNT}));
					}
				}
			});
		},

		/**
		 * 브릿지 리스트 요청
		 */
		_this._listBridge = function() {
			ActionHandler.apis['performance.listBridge'].bindData({
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('listBridge', d.data);
					}
				}
			});
		},

		/**
		 * 기획전 리스트 요청
		 */
		_this._listPlan = function() {
			ActionHandler.apis['performance.listPlan'].bindData({
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('listPlan', d.data);
					}
				}
			});
		},

		/**
		 * 유의사항 취소수수료율 조회
		 */
		_this._listCancelFee = function() {
			ActionHandler.apis['performance.listCancelFee'].bindData({
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('listCancelFee', d.data);
					}
				}
			});
		},

		/**
		 * 공연 리스트 조회
		 *
		 * @param	pData	상품 아이디 바스켓
		 */
		_this._list = function( pData ) {
			ActionHandler.apis['performance.list'].execute({
				data : pData,
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('list', d.data);
					}
				}
			});
		},

		_this._listByCupnId = function( pData ){
			ActionHandler.apis['performance.list.by.coupon'].execute({
				data : pData,
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('listByCupnId', d);
					}
				}
			});
		},
		
		_this._prodByEventInfo = function( pData ){
			ActionHandler.apis['performance.prodByEventInfo'].execute({
				data : pData,
				callback: function(d) {
					if (undefined !== d ) {
						_this.setData('prodByEventInfo', d);
					}
				}
			});
		}


		this.getPerformanceDetail = function(pData) {
			if (false === _this.bindDeliver('getPerformanceDetail')) {
				_this._getPerformanceDetail(pData);
			}
		}

		this.bindPerformanceDetail = function(pData) {
			if (false === _this.bindDeliver('bindPerformanceDetail')) {
				_this._bindPerformanceDetail(pData);
			}
		}

		this.getIsFavorite = function(pData) {
			if (false === _this.bindDeliver('getIsFavorite')) {
				_this._getIsFavorite(pData);
			}
		}

		this.listReviewInfos = function(pData) {
			if (false === _this.bindDeliver('listReviewInfos')) {
				_this._listReviewInfos(pData);
			}
		}

		this.listTicketType = function(pData) {
			if (false === _this.bindDeliver('listTicketType')) {
				_this._listTicketType(pData);
			}
		}

		this.listProductSchedule = function(pData) {
			if (false === _this.bindDeliver('listProductSchedule')) {
				_this._listProductSchedule(pData);
			}
		}

		this.checkPreReserve = function(pData) {
			if (false === _this.bindDeliver('checkPreReserve')) {
				_this._checkPreReserve(pData);
			}
		}

		this.authPreReserve = function(pData) {
			if (false === _this.bindDeliver('authPreReserve')) {
				_this._authPreReserve(pData);
			}
		}

		this.getPreReserveInfo = function(pData) {
			if (false === _this.bindDeliver('getPreReserveInfo')) {
				_this._getPreReserveInfo(pData);
			}
		}

		this.getConcertListByClassCode = function(pData) {
			if (false === _this.bindDeliver('getConcertListByClassCode')) {
				_this._getConcertListByClassCode(pData);
			}
		}
		
		this.getSubGenreThemeList = function(pData) {
			if (false === _this.bindDeliver('getSubGenreThemeList')) {
				_this._getSubGenreThemeList(pData);
			}
		}

		this.getConcertListByCupnId = function(pData) {
			if (false === _this.bindDeliver('getConcertListByCupnId')) {
				_this._getConcertListByCupnId(pData);
			}
		}

		this.listBridge = function() {
			if (false === _this.bindDeliver('listBridge')) {
				_this._listBridge();
			}
		}

		this.listPlan = function() {
			if (false === _this.bindDeliver('listPlan')) {
				_this._listPlan();
			}
		}

		this.listCancelFee = function() {
			if (false === _this.bindDeliver('listCancelFee')) {
				_this._listCancelFee();
			}
		}

		this.list = function(pData) {
			if(false === _this.bindDeliver('list')) {
				_this._list(pData);
			}
		}

		this.listByCupnId = function(pData){
			if(false === _this.bindDeliver('listByCupnId')){
				_this._listByCupnId(pData);
			}
		}
		
		this.prodByEventInfo = function(pData){
			if(false === _this.bindDeliver('prodByEventInfo')){
				_this._prodByEventInfo(pData);
			}
		}

        this.getAlertData = function(_callback){
			ActionHandler.apis['system.getAlert'].execute({
				callback: function(d){
					if(undefined !== d){
						_this.setData('getAlert', d.data);
					}else{
						_this.setData('getAlert',_this.NO_DATA);
					}
				}
			});
		}
        
		/**
		 * alert 데이터 리턴
		 */
		this.getAlert = function(){
			//_this.bindDeliver("getAlert", _this._cache);
			var _key  = this._currentDeliver;
			if(false === _this.bindDeliver("getAlert", _this._cache)){
				_this.getAlertData();
			}
		};
	};

	// Extends Model
	PerformanceModel.prototype = new Model;
	PerformanceModel.prototype.constructor = PerformanceModel;

	return (PerformanceModel);
});