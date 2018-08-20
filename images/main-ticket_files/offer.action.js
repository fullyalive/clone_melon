/**
 * 노출 구성
 */
define([], 
function() {
	
	/** 랜딩 타입 - 티켓 상품 */
	var LANDING_REF_TYPE_TICKET    = "TD";
	/** 랜딩 타입 - 브릿지 상품 */
	var LANDING_REF_TYPE_BRIDGE    = "BR";
	/** 랜딩 타입 - 기획전 상품 */
	var LANDING_REF_TYPE_PLANNED   = "PR";
	/** 랜딩 타입 - 이벤트 상품 */
	var LANDING_REF_TYPE_EVENT     = "EV";
	/** 랜딩 타입 - 동영상 */
	var LANDING_REF_TYPE_VIDEO     = "MV";
	/** 랜딩 타입 - 아티스트 */
	var LANDING_REF_TYPE_ARTIST    = "AR";
	/** 랜딩 타입 - 앨범 */
	var LANDING_REF_TYPE_ALBUM     = "AL";
	/** 랜딩 타입 - 곡 */
	var LANDING_REF_TYPE_SONG      = "TR";
	/** 랜딩 타입 - 사용자 입력(URL, etc) */
	var LANDING_REF_TYPE_USER      = "U";
	/** 랜딩 타입 - 이벤트 (설문형) */
	var LANDING_REF_TYPE_SURVEY = "SR"; 
	
	
	/**
	 * 랜딩 타입 코드로 Action을 리턴한다.
	 * 
	 * @param pType - 랜딩타입 코드
	 * @param pValue - 랜딩타입 값
	 */
	var _getActionByLandingType = function(pType, pValue) {
		var _rsltAb = new ActionBuilder();
		
		switch (pType) {
		// 티켓
		case LANDING_REF_TYPE_TICKET:
		{
			_rsltAb.setActionType(ActionHandler.ACTION_TYPE_LINK);
			_rsltAb.setTarget('performance.index');
			_rsltAb.setJson({
				prodId: pValue
			});
			}
			break;
			
		// 브릿지
		case LANDING_REF_TYPE_BRIDGE:
		{
			_rsltAb.setActionType(ActionHandler.ACTION_TYPE_LINK);
			_rsltAb.setTarget('performance.bridge');
			_rsltAb.setJson({
				brgId: pValue
			});
			}
			break;
			
		// 기획전
		case LANDING_REF_TYPE_PLANNED:
		{
			_rsltAb.setActionType(ActionHandler.ACTION_TYPE_LINK);
//			_rsltAb.setTarget('performance.plan');
			_rsltAb.setTarget('plan.index');
			_rsltAb.setJson({
//				brgId: pValue
				planId: pValue
			});
			}
			break;
			
		// 이벤트
		case LANDING_REF_TYPE_EVENT:
		{
//			_rsltAb.setActionType(ActionHandler.ACTION_TYPE_LINK);
//			_rsltAb.setTarget('event.index');
			_rsltAb.setActionType(ActionHandler.ACTION_TYPE_POPUP);
			_rsltAb.setTarget('/event/pop_detail.html');
			_rsltAb.setKey('event.detail');
			_rsltAb.setJson({
				eventId: pValue,
				isShowDetail: 'Y'
			});
			}
			break;
			
		// 아티스트
		case LANDING_REF_TYPE_ARTIST:
			_rsltAb.setActionType(ActionHandler.ACTION_TYPE_LINK);
			_rsltAb.setTarget('artist.index');
			_rsltAb.setJson({
				artistId: pValue
			});
			break;
			
		// 동영상 20160215_ 동영상 사용안함.
		case LANDING_REF_TYPE_VIDEO:
			
			break;
			
		// 앨범
		case LANDING_REF_TYPE_ALBUM:
			
			break;
			
		// 곡
		case LANDING_REF_TYPE_SONG:
			
			break;
			
		// 새창이동
		case LANDING_REF_TYPE_USER:
			_rsltAb.setActionType(ActionHandler.ACTION_TYPE_OUTLINK);
			_rsltAb.setLink(pValue);
			_rsltAb.setJson({
				url: pValue
			});
			break;
			
		default:
			break;
		
		case LANDING_REF_TYPE_SURVEY:
		{
			_rsltAb.setActionType(ActionHandler.ACTION_TYPE_POPUP);
			_rsltAb.setTarget('/event/pop_survey.html');
			_rsltAb.setKey('event.detail');
			_rsltAb.setJson({
				eventId: pValue,
				isShowDetail: 'Y'
			});
		}
		break;
		
		}
		
		return _rsltAb;
	}
	
	
	return {
			getActionByLandingType: function(pType, pValue) {
				return _getActionByLandingType(pType, pValue);
			},
			
			init: function() {
				//this.printNoticeTicker();
			}
	};
	
});