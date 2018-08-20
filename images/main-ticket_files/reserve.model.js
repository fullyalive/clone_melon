/**
 * 예매관련 데이터 호출
 */
define(['Model'], function(Model) {

	var ReserveModel = function(){

		var _this = this;

		/**
		 * 사용자 인증정보 가져오기
		 *
		 * @param pData - 파라메터
		 */
		_this._checkMemberInfo = function(pData, pKey) {
			ActionHandler.apis['ticket.mobile.realname_isAuthCk'].bindData({
				data: pData,
				callback: function(d) {
					if (undefined !== d) {
						_this.setData(pKey, d);
					}
					else {
						_this.setData(pKey, _this.NO_DATA);
					}
				}
			});
		}

		/**
		 * 본인인증 여부 가져오기
		 */
		this.checkAuth = function() {

			if (false === _this.bindDeliver('checkAuth')) {
				_this._checkMemberInfo({
					memberKey: getMemberKey(),
					viewType: 'charge',
					cpId: POC_ID
				}, 'checkAuth');
			}
		}

		/**
		 * 성인인증 여부 가져오기
		 */
		this.checkAdult = function() {

			if (false === _this.bindDeliver('checkAdult')) {
				_this._checkMemberInfo({
					memberKey: getMemberKey(),
					viewType: 'juvenileProtection',
					cpId: POC_ID
				}, 'checkAdult');
			}
		}

	};

	// Extends Model
	ReserveModel.prototype = new Model;
	ReserveModel.prototype.constructor = ReserveModel;

	return (ReserveModel);
});