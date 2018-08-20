/**
 * 앨범 데이터 호출
 */
define(['Model'], function(Model) {
	
	var AlbumModel = function(){
		
		var _this = this;
		
		/**
		 * 앨범정보 조회
		 */
		_this._getDetail = function(pData) {
			ActionHandler.apis['album.detail'].execute({
				data: pData,
				callback: function(d) {
					if (undefined !== d) {
						if (undefined !== d.data) {
							_this.setData('getDetail', d.data);
						}
						else {
							_this.setData('getDetail', _this.NO_DATA);
						}
					}
				}
			});
		},
		
		/**
		 * 곡 리스트 조회
		 */
		_this._listSong = function(pData) {
			ActionHandler.apis['song.list'].execute({
				data: pData,
				callback: function(d) {
					if (undefined !== d) {
						if (undefined !== d.data) {
							_this.setData('listSong', d.data);
						}
						else {
							_this.setData('listSong', _this.NO_DATA);
						}
					}
				}
			});
		}
		
		
		this.getDetail = function(pData) {
			if (false === _this.bindDeliver('getDetail')) {
				_this._getDetail(pData);
			}
		};
		
		this.listSong = function(pData) {
			if (false === _this.bindDeliver('listSong')) {
				_this._listSong(pData);
			}
		};
	};
	
	// Extends Model
	AlbumModel.prototype = new Model;
	AlbumModel.prototype.constructor = AlbumModel;
	
	return (AlbumModel);
});