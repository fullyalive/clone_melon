/**
 * 포유 데이터 호출
 */
define(['Model'], function(Model) {

	var ForuModel = function(){

		var _this = this;

		/**
		 * 메인 포유 목록
		 */
		_this._isExistPreference = function() {
			ActionHandler.apis['forU.isExistPreference'].execute({
				callback: function(d) {
					if( undefined !== d ) {
						_this.setData('isExistPreference', d.data);
					}
				}
			});
		},

		/**
		 * 추천상품 가져오기
		 */
		_this._getRecommendProduct = function() {
			ActionHandler.apis['forU.getRecommendProduct'].execute({
				callback : function(d) {
					if( undefined !== d ) {
						_this.setData('recommendProduct', d.data);
					}
				}
			});
		},

		/**
		 * 관련공연 정보 가져오기
		 */
		_this._getRelationMusic = function(pData) {
			ActionHandler.apis['forU.relationMusic'].execute({
				data: pData,
				callback : function(d) {
					if( undefined !== d ) {
						_this.setData('relationMusic', $.extend({params: pData}, {list:d.data}));
					}
				}
			});
		},

		/**
		 * 취향분석을 통해 추천 상품 등록하기
		 *
		 * @param	pData	장르/테마, 지역, 아티스트 바스켓 정보
		 */
		_this._getAddInterestProd = function(pData) {
			ActionHandler.apis['forU.addInterestProd'].execute({
				data : pData,
				callback : function(d) {
					if( undefined !== d ) {
						_this.setData('addInterestProd', d );
					}
				}
			});
		},

		/**
		 * 추천상품이 없는경우 추천 아티스트 가져오기
		 */
		_this._getSuggestArtist = function() {
			ActionHandler.apis['forU.suggestArtist'].execute({
				callback : function(d) {
					if( undefined !== d ) {
						_this.setData('suggestArtist', d.data );
					}
				}
			});
		},

		/**
		 * 장르/테마 목록 가져오기
		 */
		_this._getThemeList = function() {
			ActionHandler.apis['forU.themeList'].execute({
				callback : function(d) {
					if( undefined !== d ) {
						_this.setData('themeList', d.data );
					}
				}
			});
		},

		/**
		 * 지역 목록 가져오기
		 */
		_this._getRegionList = function() {
			ActionHandler.apis['forU.regionList'].execute({
				callback : function(d) {
					if( undefined !== d ) {
						_this.setData('regionList', d.data );
					}
				}
			});
		},

		/**
		 * 추천 아티스트 목록 가져오기
		 */
		_this._getRecommendArtist = function(pData) {
			ActionHandler.apis['forU.recommendArtist'].execute({
				data : pData,
				callback : function(d) {
					if( undefined !== d ) {
						_this.setData('recommendArtist', d.data );
					}
				}
			});
		},

		/**
		 * 취향설정 등록하기
		 *
		 * @param	pData		사용자 취향설정 정보
		 */
		_this._getAddRecmdSetting = function( pData ) {
			ActionHandler.apis['forU.addRecmdSetting'].execute({
				data : pData,
				callback : function(d) {
					if( undefined !== d ) {
						_this.setData('addRecmdSetting', d.data );
					}
				}
			});
		},

		/**
		 * 추천상품 확인일자 수정/등록하기
		 *
		 * @param	pData		상품아이디
		 */
		_this._getModifyViewDate = function( pData ) {
			ActionHandler.apis['forU.modifyViewDate'].execute({
				data : pData,
				callback : function(d) {
					if( undefined !== d ) {
						_this.setData('modifyViewDate', d.data );
					}
				}
			});
		},

		/**
		 * 사용자 취향정보 가져오기
		 */
		_this._getUserPreference = function() {
			ActionHandler.apis['forU.userPreference'].execute({
				callback : function(d) {
					if( undefined !== d ) {
						_this.setData('userPreference', d.data );
					}
				}
			});
		},

		/**
		 * 사용자 취향정보 변경
		 *
		 * @param	pData	사용자 취향설정 정보
		 */
		_this._getModifyRecommendSetting = function( pData ) {
			ActionHandler.apis['forU.modifyRecommendSetting'].execute({
				data : pData,
				callback : function(d) {
					if( undefined !== d ) {
						_this.setData('modifyRecommendSetting', d );
					}
				}
			});
		},

		/**
		 * 사용자 일정 가져오기 ( 공연플래너 담은 상품과 추천레벨1, 2 상품 )
		 */
		_this._getPlannerUserSchedule = function() {
			ActionHandler.apis['forU.plannerUserSchedule'].execute({
				callback : function(d) {
					if( undefined !== d ) {
						_this.setData('plannerUserSchedule', d.data );
					}
				}
			});
		},

		/**
		 *  관심 아티스트 중 일정이 있는 아티스트 목록 가져오기
		 */
		_this._getPlannerArtistList = function() {
			ActionHandler.apis['forU.plannerArtistList'].execute({
				callback : function(d) {
					if( undefined !== d ) {
						_this.setData('plannerArtistList', d.data );
					}
				}
			});
		},

		/**
		 * 아티스트 일정 가져오기
		 *
		 * @param	pData	아티스트 아이디
		 */
		_this._getPlannerArtistSchedule = function( pData ) {
			ActionHandler.apis['forU.plannerArtistSchedule'].execute({
				data : pData,
				callback : function(d) {
					if( undefined !== d ) {
						_this.setData('plannerArtistSchedule', d.data );
					}
				}
			});
		},

		/**
		 * 마지막 접근일 수정
		 */
		_this._getModifyLastAccessDate = function() {
			ActionHandler.apis['forU.modifyLastAccessDate'].execute({
				callback : function(d) {
					if( undefined !== d ) {
						_this.setData('modifyLastAccessDate', d.data );
					}
				}
			});
		},

		/**
		 * 선호 아티스트 등록/삭제
		 *
		 * @param	pData	아티스트 아이디
		 */
		_this._getToggleRecmdArtist = function( pData ) {
			ActionHandler.apis['forU.toggleRecmdArtist'].execute({
				callback : function(d) {
					if( undefined !== d ) {
						_this.setData('toggleRecmdArtist', d.data );
					}
				}
			});
		},

		/**
		 * 아티스트 검색 - search.action.js 로 이동해야함
		 *
		 * @param	pData	검색어
		 */
		_this._getSearchArtist = function( pData ) {
			ActionHandler.apis['search.artist'].execute({
				data : pData,
				callback : function(d) {
					if( undefined !== d ) {
						_this.setData('searchArtist', $.extend({params: pData}, d.data) );
					}
				}
			});
		},

		/**
		 * 공연 플래너 1시간전 알림 등록/삭제
		 *
		 * @param	pData  상품아이디
		 *
		 */
		_this._getToggleAlram = function( pData ) {
			ActionHandler.apis['forU.toggleAlram'].execute({
				data : pData,
				callback : function(d) {
					if( undefined !== d ) {
						_this.setData('toggleAlram', d.data );
					}
				}
			});
		}

		_this._getForuAgmt = function(){
			ActionHandler.apis['member.getForuAgmt'].execute({
				callback : function(d) {
					if( undefined !== d ) {
						_this.setData('getForuAgmt', d.data );
					}
				}
			});
		}

		_this._setForuAgmt = function(){
			ActionHandler.apis['member.setForuAgmt'].execute({
				callback : function(d) {
					if( undefined !== d ) {
						_this.setData('agreeForU', d );
					}
				}
			});
		}


		this.isExistPreference = function() {
			if (false === _this.bindDeliver('isExistPreference')) {
				_this._isExistPreference();
			}
		};

		this.recommendProduct = function() {
			if (false === _this.bindDeliver('recommendProduct')) {
				_this._getRecommendProduct();
			}
		};

		this.relationMusic = function(pData) {
			if (false === _this.bindDeliver('relationMusic')) {
				_this._getRelationMusic(pData);
			}
		};

		this.addInterestProd = function(pData) {
			if( false === _this.bindDeliver('addInterestProd')) {
				_this._getAddInterestProd(pData);
			}
		};

		this.suggestArtist = function() {
			if( false === _this.bindDeliver('suggestArtist')) {
				_this._getSuggestArtist();
			}
		};

		this.themeList = function() {
			if( false === _this.bindDeliver('themeList')) {
				_this._getThemeList();
			}
		};

		this.regionList = function() {
			if( false === _this.bindDeliver('regionList')) {
				_this._getRegionList();
			}
		};

		this.recommendArtist = function(pData) {
			if( false === _this.bindDeliver('recommendArtist')) {
				_this._getRecommendArtist(pData);
			}
		};

		this.addRecmdSetting = function(pData) {
			if( false === _this.bindDeliver('addRecmdSetting')) {
				_this._getAddRecmdSetting(pData);
			}
		};

		this.modifyViewDate = function(pData) {
			_this._getModifyViewDate(pData);
		};

		this.userPreference = function() {
			if( false === _this.bindDeliver('userPreference')) {
				_this._getUserPreference();
			}
		};

		this.modifyRecommendSetting = function(pData) {
			if( false === _this.bindDeliver('modifyRecommendSetting')) {
				_this._getModifyRecommendSetting(pData);
			}
		};

		this.plannerUserSchedule = function() {
			if( false === _this.bindDeliver('plannerUserSchedule')) {
				_this._getPlannerUserSchedule();
			}
		};

		this.plannerArtistList = function() {
			if( false === _this.bindDeliver('plannerArtistList')) {
				_this._getPlannerArtistList();
			}
		};

		this.plannerArtistSchedule = function(pData) {
			if( false === _this.bindDeliver('plannerArtistSchedule')) {
				_this._getPlannerArtistSchedule(pData);
			}
		};

		this.modifyLastAccessDate = function() {
			if( false === _this.bindDeliver('modifyLastAccessDate')) {
				_this._getModifyLastAccessDate();
			}
		};

		this.toggleRecmdArtist = function(pData) {
			if( false === _this.bindDeliver('toggleRecmdArtist')) {
				_this._getToggleRecmdArtist(pData);
			}
		};

		this.searchArtist = function(pData) {
			if( false === _this.bindDeliver('searchArtist')) {
				_this._getSearchArtist(pData);
			}
		};

		this.toggleAlram = function(pData) {
			if( false === _this.bindDeliver('toggleAlram')) {
				_this._getToggleAlram(pData);
			}
		};

		this.agreeForU = function(){
			if( false === _this.bindDeliver('agreeForU')) {
				_this._setForuAgmt();
			}
		};

		this.getAgmtForu = function(){
			if( false === _this.bindDeliver('getForuAgmt')) {
				_this._getForuAgmt();
			}
		};

	};

	// Extends Model
	ForuModel.prototype = new Model;
	ForuModel.prototype.constructor = ForuModel;

	return (ForuModel);
});