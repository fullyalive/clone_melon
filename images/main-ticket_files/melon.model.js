/**
 * Model
 */
define(function(Model) {

	var Model =
	function() {
		this.NO_DATA = -1;
		// Request Timeout
		this._requestLimit = 100;
		// Request Delay
		//this._requestDelay = 50;
		this._requestDelay = 100;
		//전체 timeout
		//this._totTimeout = 7000;
		this._totTimeout = 30000;
		// 내부 데이터 저장소
		this._storage =[];
		// 내부 데이터 저장소 expiry storage
		this._stoExpiry = [];
		// cache expiary
		//this._cacheExpiry = 10 * 60 * 1000;//10 min
		this._cacheExpiry = 10000;//10초 테스트
		// Deliver 저장소
		this._deliver = [];
		// 현재 전달자 저장용 변수
		this._currentDeliver = null;

		/**
		 * 전달자 데이터 전달
		 *
		 * @param pKey - 데이터 키
		 * @param pChached - 캐싱여부 - Default true
		 */
		this.bindDeliver = function(pKey, pChached) {
			try {
				var _this = this, _observer,
					_deliver = _this.getDeliver(_this._currentDeliver);

				_deliver.timeout = _this._totTimeout;
				_deliver.timeElapsed = 0;

				var _tmpData = _this.getData(pKey, pChached);
				var _isExistData = (null !==  _tmpData) && (true === pChached);

				if (_isExistData) {
					_deliver(_tmpData);
					_deliver = null;
					clearInterval(_observer);
				}
				else {
					_observer = setInterval(function() {

						_deliver.timeElapsed += _this._requestDelay;

						var _tmpData = _this.getData(pKey, pChached);

						if (_deliver.timeElapsed > _deliver.timeout) {
							clearInterval(_observer);
							console.debug('Request timeout :: ', pKey, _deliver);
						}

						if (null === _tmpData) {
							return false;
						}
						else {
							_deliver(_tmpData);
							_deliver = null;
							clearInterval(_observer);
						}
					}, _this._requestDelay);
				}

				return _isExistData;
			}
			catch(e) {
				clearInterval(_observer);
			}
		};

		/**
		 * 전달자 설정
		 *
		 * @param pCallback - 콜백 함수
		 */
		this.deliver = function(pCallback) {
			var _tmpKey = Date.now();

			if ('function' === typeof pCallback) {
				this._currentDeliver = _tmpKey;
				this.setDeliver(_tmpKey, pCallback);
			}
			else {
				alert ('function 타입만 설정 가능 합니다.');
			}

			return this;
		};

		/**
		 * 데이터 저장
		 *
		 * @param pKey - 데이터 키
		 * @param pData - 저장 데이터
		 */
		this.setData = function(pKey, pData, pChached) {

			var _curTimestamp = (new Date()).getTime();

			if (undefined === this._storage[pKey]) {
				this._storage[pKey] = [];
				this._stoExpiry[pKey] = [];
			}

			if(pChached === true){
				this._storage[pKey].unshift(pData);
				this._stoExpiry[pKey].unshift(_curTimestamp);
			}else {
				this._storage[pKey].push(pData);
				this._stoExpiry[pKey].push(_curTimestamp);
			}
		}

		/**
		 * 저장 데이터 가져오기
		 *
		 * @param pKey - 데이터 키
		 * @param pChached - 데이터 캐시 여부
		 */
		this.getData = function(pKey, pChached) {

			var _tmpData = null;
			var _stoTimestamp = null;
			var _curTimestamp = (new Date()).getTime();

			if (undefined !== this._storage[pKey] && 0 < this._storage[pKey].length) {

				if (pChached) {
					_tmpData = this._storage[pKey][0];
					_stoTimestamp = this._stoExpiry[pKey][0];

					if(_curTimestamp - _stoTimestamp > this._cacheExpiry){
						//expired
						_tmpData = null;

						//delete stored data
						this._storage[pKey].splice(0,1);
						this._stoExpiry[pKey].splice(0,1);
					}
				}
				else {
					_tmpData = this._storage[pKey].splice(0, 1)[0];
					_stoTimestamp = this._stoExpiry[pKey].splice(0, 1)[0];
				}
			}

			return _tmpData;
		};

		/**
		 * 저장 데이터 삭제
		 */
		this.removeData = function(pKey) {
			if (undefined !== this._storage[pKey]) {
				//this._storage[pKey] = null;
			}
		};

		/**
		 * 데이터 추가
		 *
		 * @param pKey - 데이터 키
		 * @param pData - 저장 데이터
		 */
		this.addData = function(pKey, pData) {
			var _curTimestamp = (new Date()).getTime();
			this._storage[pKey].push(pData);
			this._stoExpiry[pKey].push(_curTimestamp);
		}

		/**
		 * 전달자 저장
		 *
		 * @param pKey - 전달자 키
		 * @param pCallback - 콜백함수
		 */
		this.setDeliver = function(pKey, pCallback) {
			this._deliver[pKey] = pCallback;
		};

		/**
		 * 전달자 리턴
		 *
		 * @param pKey - 전달자 키
		 */
		this.getDeliver = function(pKey) {
			return this._deliver[pKey];
		};

		/**
		 * 전달자 삭제
		 *
		 * @param pKey - 전달자 키
		 */
		this.removeDeliver = function(pKey) {
			return this._deliver[pKey] = null;
		};

	}

	return (Model);
});