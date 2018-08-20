/**
 * 화면편성 데이터 호출
 */
define(['Model',
        'util/jsonUtils'], 
function(Model,
		JsonUtils) {
	
	var OfferModel = function(){
		
		var _this = this;
		
		/**
		 * 상품상세 노출용 배너 조회
		 */
		_this._getPerformanceBanner = function() {
			ActionHandler.apis['offer.getPerformanceBanner'].execute({
				callback: function(d) {
					if (JsonUtils.isEmpty(d) || JsonUtils.isEmpty(d.data)) {
						_this.setData('getPerformanceBanner', _this.NO_DATA);
					}
					else {
						_this.setData('getPerformanceBanner', d.data);
					}
				}
			});
		},
		
		_this._getPerformanceEvalueBanner = function() {
			ActionHandler.apis['offer.getPerformanceEvalueBanner'].execute({
				callback: function(d) {
					if (JsonUtils.isEmpty(d) || JsonUtils.isEmpty(d.data)) {
						_this.setData('getPerformanceEvalueBanner', _this.NO_DATA);
					}
					else {
						_this.setData('getPerformanceEvalueBanner', d.data);
					}
				}
			});
		},
		
		_this._getPerformanceReviewBanner = function() {
			ActionHandler.apis['offer.getPerformanceReviewBanner'].execute({
				callback: function(d) {
					if (JsonUtils.isEmpty(d) || JsonUtils.isEmpty(d.data)) {
						_this.setData('getPerformanceReviewBanner', _this.NO_DATA);
					}
					else {
						_this.setData('getPerformanceReviewBanner', d.data);
					}
				}
			});
		},
		
		/** 
		 * 장르 > 콘서트 이벤트 배너 리스트 조회
		 */
		_this._listGenreConcertBanner = function() {
			ActionHandler.apis['offer.listGenreConcertBanner'].execute({
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('listGenreConcertBanner', d.data);
					}
				}
			});
		},
		
		
		/** 
		 * 장르 > 아트 이벤트 배너 리스트 조회
		 */
		_this._listGenreArtBanner = function() {
			ActionHandler.apis['offer.listGenreArtBanner'].execute({
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('listGenreArtBanner', d.data);
					}
				}
			});
		},
		
		/** 
		 * 테마 이벤트 배너 리스트 조회
		 */
		_this._listThemeBanner = function() {
			ActionHandler.apis['offer.listThemeBanner'].execute({
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('listThemeBanner', d.data);
					}
				}
			});
		},
		
		/**
		 * 이벤트 상단배너 리스트 조회
		 */
		_this._listEventBanner = function() {
			ActionHandler.apis['offer.listEventBanner'].execute({
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('listEventBanner', d.data);
					}
				}
			});
		},
		
		/**
		 * 아티스트 상단배너 조회
		 */
		_this._getArtistBanner = function() {
			ActionHandler.apis['offer.getArtistBanner'].execute({
				callback: function(d) {
					if (JsonUtils.isEmpty(d) || JsonUtils.isEmpty(d.data)) {
						_this.setData('getArtistBanner', _this.NO_DATA);
					}
					else {
						_this.setData('getArtistBanner', d.data);
					}
				}
			});
		},
		
		
		this.getPerformanceBanner = function() {
			if (false === _this.bindDeliver('getPerformanceBanner')) {
				_this._getPerformanceBanner();
			}
		};
		
		this.getPerformanceEvalueBanner = function() {
			if (false === _this.bindDeliver('getPerformanceEvalueBanner')) {
				_this._getPerformanceEvalueBanner();
			}
		};
		
		this.getPerformanceReviewBanner = function() {
			if (false === _this.bindDeliver('getPerformanceReviewBanner')) {
				_this._getPerformanceReviewBanner();
			}
		};
		
		this.listGenreConcertBanner = function() {
			if (false === _this.bindDeliver('listGenreConcertBanner')) {
				_this._listGenreConcertBanner();
			}
		};
		
		this.listGenreArtBanner = function() {
			if (false === _this.bindDeliver('listGenreArtBanner')) {
				_this._listGenreArtBanner();
			}
		};
		
		this.listThemeBanner = function() {
			if (false === _this.bindDeliver('listThemeBanner')) {
				_this._listThemeBanner();
			}
		};
		
		this.listEventBanner = function() {
			if (false === _this.bindDeliver('listEventBanner')) {
				_this._listEventBanner();
			}
		};
		
		this.getArtistBanner = function() {
			if (false === _this.bindDeliver('getArtistBanner')) {
				_this._getArtistBanner();
			}
		};
	};
	
	// Extends Model
	OfferModel.prototype = new Model;
	OfferModel.prototype.constructor = OfferModel;
	
	return (OfferModel);
});