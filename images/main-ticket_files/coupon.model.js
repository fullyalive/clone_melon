/**
 * 쿠폰 데이터 호출
 */
define(['Model'], function(Model) {
	
	var CouponModel = function(){
		
		var _this = this;
		
		/**
		 * 할인쿠폰 리스트 조회
		 */
		_this._listCouponByProd = function(pData) {
			ActionHandler.apis['saleCupn.listSaleCupnByProd'].execute({
				data: pData,
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('listCouponByProd', d.data);
					}
				}
			});
		},
		
		/**
		 * 할인쿠폰 다운로드
		 */
		_this._download = function(pData) {
			ActionHandler.apis['saleCupn.downLoad'].execute({
				data: pData,
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('download', d);
					}
				}
			});
		},
		
		/**
		 * 사용 가능한 쿠폰 리스트 조회
		 */
		_this._listSaleCupn = function(pData) {
			ActionHandler.apis['saleCupn.listSaleCupn'].execute({
				data: pData,
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('listSaleCupn', d.data);
					}
				}
			});
		},
		
		this.listCouponByProd = function(pData) {
			if (false === _this.bindDeliver('listCouponByProd')) {
				_this._listCouponByProd(pData);
			}
		};
		
		this.download = function(pData) {
			if (false === _this.bindDeliver('download')) {
				_this._download(pData);
			}
		};
		
		this.listSaleCupn = function() {
			if (false === _this.bindDeliver('listSaleCupn')) {
				_this._listSaleCupn();
			}
		};
	};
	
	// Extends Model
	CouponModel.prototype = new Model;
	CouponModel.prototype.constructor = CouponModel;
	
	return (CouponModel);
});
