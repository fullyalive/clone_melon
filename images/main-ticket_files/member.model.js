/**
 * 회원 데이터 호출
 */
define(['Model'],
function( Model) {

	var MemberModel = function(){

		var _this = this;
		
		/**
		 * 프로필 이미지 조회
		 */
		_this._getProfile = function() {
//			ActionHandler.apis["member.getProfile"].execute({
			ActionHandler.apis["member.getProfileImg"].execute({ //get profile image
				data: {memberKey: getMemberKey(), size: '194'},
				callback : function(d) {
					if (undefined !== d) {
						if (null !== d.data && undefined !== d.data) {
							_this.setData('getProfile', d.data);
						}
						else {
							_this.setData('getProfile', _this.NO_DATA);
						}
					}else{
						_this.setData('getProfile', _this.NO_DATA);
					}
				}
			});
		},
		
		/**
		 * 설정정보 조회
		 */
		_this._getConfig = function() {
			ActionHandler.apis["member.config"].execute({
				callback : function(d) {

					if (undefined !== d) {
						if (undefined !== d.data) {
							_this.setData('getConfig', d.data);
						}
						else {
							_this.setData('getConfig', _this.NO_DATA);
						}
					}
					else {
						_this.setData('getConfig', _this.NO_DATA);
					}
				}
			});
		},

		
		/**
		 * 알림받기 플래그 토글
		 */
		_this._setPushFlg = function(pData) {
			ActionHandler.apis["member.setPushFlg"].execute({
				data: pData,
				callback : function(d) {
					if (undefined !== d) {
						if (null !== d.data) {
							_this.setData('setPushFlg', d.data);
						}
						else {
							_this.setData('setPushFlg', _this.NO_DATA);
						}
					}
				}
			});
		},
		
		/**
		 * 푸시 설정 상태 등록
		 */
		_this._addPushConfig = function(pData) {
			ActionHandler.apis["member.addPushConfig"].execute({
				data: pData,
				callback : function(d) {
					if (undefined !== d) {
						if (null !== d.data) {
							_this.setData('addPushConfig', d);
						}
						else {
							_this.setData('addPushConfig', _this.NO_DATA);
						}
					}
				}
			});
		},
		
		/**
		 * 푸시 설정 리스트 조회
		 */
		_this._listPushConfig = function() {
			ActionHandler.apis["member.listPushConfig"].execute({
				callback : function(d) {
					if (undefined !== d) {
						if (null !== d.data) {
							_this.setData('listPushConfig', d.data);
						}
						else {
							_this.setData('listPushConfig', _this.NO_DATA);
						}
					}
				}
			});
		},
		
		/**
		 * 위치정보 이용 플래그 변경
		 */
		_this._setGeosvcAgree = function(pData) {
			ActionHandler.apis["member.setGeosvcAgree"].execute({
				data : pData,
				callback : function(d) {
					if (undefined !== d) {
						_this.setData('setGeosvcAgree', $.extend(d, {param:pData}) );
					}
				}
			});
		},

		
		/**
		 * 기본 배송지 조회
		 */
		_this._getMemberBaseDestnt = function(params) {
			ActionHandler.apis["member.destnt.getBase"].execute({
				data: $.extend({memberKey: getMemberKey()},params),
				callback : function(d) {
					//if (undefined !== d) {
					//	if (null !== d.data && undefined !== d.data) {
					//		//_this.setData('getMemberBaseDestnt', d.data);
					//		_this.setData('getMemberBaseDestnt', d);
					//	}
					//	else {
					//		_this.setData('getMemberBaseDestnt', _this.NO_DATA);
					//	}
					//}else{
					//	_this.setData('getMemberBaseDestnt', _this.NO_DATA);
					//}
					_this.setData('getMemberBaseDestnt', d);
				}
			});
		},
		
		/**
		 * 배송지 추가
		 */
		_this._addMemberDestnt = function(pData) {
			ActionHandler.apis["member.destnt.add"].execute({
				data: pData,
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('addMemberDestnt', d);
					}
				}
			});
		},
		
		/**
		 * 배송지 업데이트
		 */
		_this._updateMemberDestnt = function(pData) {
			ActionHandler.apis["member.destnt.update"].execute({
				data: pData,
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('updateMemberDestnt', d);
					}
				}
			});
		},
		
		_this._identity = function( pData ){
			ActionHandler.apis['member.identity'].execute({
				data : pData,
				callback: function(d) {
					if (undefined !== d ) {
						_this.setData('identity', d);
					}
				}
			});
		},
		
		/**
		 * 배송지 주소검색
		 */
		_this._searchAddress = function(pData) {
			ActionHandler.apis['event.searchAddress'].execute({
				data: pData,
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('searchAddress', d.data);
					}
				}
			});
		}

		this.getProfile = function() {
			if (false === _this.bindDeliver('getProfile')) {
				_this._getProfile();
			}
		};

		this.getConfig = function() {
			if (false === _this.bindDeliver('getConfig')) {
				_this._getConfig();
			}
		};

		this.setPushFlg = function(pData) {
			if (false === _this.bindDeliver('setPushFlg')) {
				_this._setPushFlg(pData);
			}
		};

		this.addPushConfig = function(pData) {
			if (false === _this.bindDeliver('addPushConfig')) {
				_this._addPushConfig(pData);
			}
		};

		this.listPushConfig = function(pData) {
			if (false === _this.bindDeliver('listPushConfig')) {
				_this._listPushConfig();
			}
		};

		this.setGeosvcAgree = function(pData) {
			if (false === _this.bindDeliver('setGeosvcAgree')) {
				_this._setGeosvcAgree(pData);
			}
		};
		
		this.getMemberBaseDestnt = function(params) {
			if (false === _this.bindDeliver('getMemberBaseDestnt')) {
				_this._getMemberBaseDestnt(params	);
			}
		};
		
		this.addMemberDestnt = function(pData) {
			if (false === _this.bindDeliver('addMemberDestnt')) {
				_this._addMemberDestnt(pData);
			}
		};
		
		this.updateMemberDestnt = function(pData) {
			if (false === _this.bindDeliver('updateMemberDestnt')) {
				_this._updateMemberDestnt(pData);
			}
		};
		
		this.identity = function(pData){
			if(false === _this.bindDeliver('identity')){
				_this._identity(pData);
			}
		};
		
		this.searchAddress = function(pData) {
			if (false === _this.bindDeliver('searchAddress')) {
				_this._searchAddress(pData);
			}
		}
		

	};

	// Extends Model
	MemberModel.prototype = new Model;
	MemberModel.prototype.constructor = MemberModel;

	return (MemberModel);
});