/**
 * 아티스트 데이터 호출
 */
define(['Model'], function(Model) {
	
	var ArtistModel = function(){
		var _this = this;
		
		/**
		 * 메인 포유 리스트
		 */
		_this._isForUArtist = function() {
			ActionHandler.apis['artist.isForUArtist'].execute({
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('isForUArtist', d.data);
					}
				}
			});
		},
		
		/**
		 * 아티스트 기본 정보 조회
		 */
		_this._get = function(pData) {
			ActionHandler.apis['artist.get'].bindData({
				data: pData,
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('get', d.data);
					}
				}
			});
		},
		
		/**
		 * 아티스트 기본정보 친밀도 포함 조회
		 */
		_this._getWithIntimacy = function(pData) {
			ActionHandler.apis['artist.getWithIntimacy'].bindData({
				data: pData,
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('getWithIntimacy', d.data);
					}
				}
			});
		},
		
		/**
		 * 아티스트 상세 정보 조회
		 */
		_this._getDetail = function(pData) {
			ActionHandler.apis['artist.detail'].execute({
				data: pData,
				callback: function(d) {
					if (undefined !== d.data) {
						_this.setData('getDetail', d.data);
					}
					else {
						_this.setData('getDetail', _this.NO_DATA);
					}
				}
			});
		},
		
		/**
		 * 아티스트 관련사진 조회
		 */
		_this._getlistPhoto = function(pData) {
			ActionHandler.apis['artist.listPhoto'].execute({
				data: pData,
				callback: function(d) {
					if (undefined !== d.data) {
						_this.setData('listPhoto', $.extend({params:pData}, d.data));
					}
					else {
						_this.setData('listPhoto', _this.NO_DATA);
					}
				}
			});
		},
		
		/**
		 * 아티스트 관련영상 조회
		 */
		_this._getlistVideo = function(pData) {
			ActionHandler.apis['artist.listVideo'].execute({
				data: pData,
				callback: function(d) {
					if (undefined !== d.data) {
						_this.setData('listVideo', $.extend({params:pData}, d.data));
					}
					else {
						_this.setData('listVideo', _this.NO_DATA);
					}
				}
			});
		},
		
		/**
		 * 관련 아티스트 정보 노출
		 */
		_this._getRelArtist = function(pData) {
			ActionHandler.apis['artist.getRelArtist'].execute({
				data: pData,
				callback: function(d) {
					if (undefined !== d.data) {
						_this.setData('getRelArtist', d.data);
					}
					else {
						_this.setData('getRelArtist', _this.NO_DATA);
					}
				}
			});
		},
		
		/**
		 * 관련 공연 정보 노출
		 */
		_this._getlistPerformance = function(pData) {
			ActionHandler.apis['artist.listPerformance'].execute({
				data: pData,
				callback: function(d) {
					if (undefined !== d.data) {
						_this.setData('listPerformance', d.data);
					}
					else {
						_this.setData('listPerformance', _this.NO_DATA);
					}
				}
			});
		}
		
		this.isForUArtist = function() {
			if (false === _this.bindDeliver('isForUArtist')) {
				_this._isForUArtist();
			}
		};
		
		this.get = function(pData) {
			if (false === _this.bindDeliver('get')) {
				_this._get(pData);
			}
		};
		
		this.getWithIntimacy = function(pData) {
			if (false === _this.bindDeliver('getWithIntimacy')) {
				_this._getWithIntimacy(pData);
			}
		};
		
		this.getDetail = function(pData) {
			if (false === _this.bindDeliver('getDetail')) {
				_this._getDetail(pData);
			}
		};
		
		this.listPhoto = function(pData) {
			if (false === _this.bindDeliver('listPhoto')) {
				_this._getlistPhoto(pData);
			}
		}
		
		this.listVideo = function(pData) {
			if (false === _this.bindDeliver('listVideo')) {
				_this._getlistVideo(pData);
			}
		}
		
		this.getRelArtist = function(pData) {
			if (false === _this.bindDeliver('getRelArtist')) {
				_this._getRelArtist(pData);
			}
		};
		
		this.listPerformance = function(pData) {
			if (false === _this.bindDeliver('listPerformance')) {
				_this._getlistPerformance(pData);
			}
		};
	};
	
	// Extends Model
	ArtistModel.prototype = new Model;
	ArtistModel.prototype.constructor = ArtistModel;
	
	return (ArtistModel);
});