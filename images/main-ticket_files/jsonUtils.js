/**
 * JSON Utils
 */
define([], function() {
	
	var JsonUtils = {

		/**
		 * 객체 길이 리턴 (스트링 문자열 제외)
		 * 
		 * @param pData - 길이 체크할 JSON 객체
		 * @returns {Number}
		 */
		length: function(pData) {
			var _k, _c = 0;
			if ('string' === typeof pData) {
				
			}
			else {
				for(_k in pData) {
					if(pData.hasOwnProperty(_k) || 'string' === typeof pData[_k]) {
						_c++;
					}
				}
			}
			return _c;
		},
		
		/**
		 * 객체 빈값 체크
		 * 
		 *  @param pString - 체크할 객체
		 *  @returns Boolean - 공백 여부
		 */ 
		isEmpty: function(pObject) {
			var _this = this;
			
			if (undefined === pObject || null === pObject) {
				return true;
			}
			else {
				if (0 === _this.length(pObject)) {
					return true;
				}
				else {
					return false;
				}
			}
		},
		
		/**
		 * 객체 빈값 체크
		 * 
		 *	@param pString - 체크할 객체
		 *  @returns Boolean - 공백 여부
		 */
		isNotEmpty: function(pObject) {
			return !this.isEmpty(pObject);
		}
	};
	
	
	return (JsonUtils);
});
