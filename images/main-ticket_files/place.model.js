/**
 * 공연장 데이터 호출
 */
define(['Model'], function(Model) {
	
	var PlaceModel = function(){
		
		var _this = this;
		
		/**
		 * 공연장 상세정보 가져오기
		 * 
		 * @param pOption - 파라메터
		 */
		_this._getPlaceDetail = function(pOption) {
			ActionHandler.apis['place.detail'].bindData({
				data: pOption.data,
				target: pOption.target,
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('getPlaceDetail', d.data);
					}
				}
			});
		},
		
		/**
		 * 예매 가능한 공연리스트 정보 가져오기
		 */
		_this._getPossiblePerf = function() {
			ActionHandler.apis['place.getPossiblePerf'].bindData({
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('getPossiblePerf', d.data);
					}
				}
			});
		}
		
		this.getPlaceDetail = function(pOption) {
			if (false === _this.bindDeliver('getPlaceDetail')) {
				_this._getPlaceDetail(pOption);
			}
		}
		
		this.getPossiblePerf = function() {
			if (false === _this.bindDeliver('getPossiblePerf')) {
				_this._getPossiblePerf();
			}
		}
	};
	
	// Extends Model
	PlaceModel.prototype = new Model;
	PlaceModel.prototype.constructor = PlaceModel;
	
	return (PlaceModel);
});