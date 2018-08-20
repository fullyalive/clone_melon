/**
 * 댓글 관리
 */
define(['model/comment.model',
        'model/performance.model',
        'action/album.action',
        'util/stringUtils',
        'util/jsonUtils',
        'util/imageUtils',
		'model/pv.model'],
function(CommentModel,
		 PerformanceModel,
		 AlbumAction,
		 StringUtils,
		 JsonUtils,
		 ImageUtils,
		PvModel) {

	var commentModel = new CommentModel();
	var performanceModel = new PerformanceModel();

	/** 사용자 이미지 HOST */
	var USER_IMAGE_HOST = 'cmtimg.melon.co.kr';

	/** 댓글 POC TYPE mobile Web */
	var CMT_POC_TYPE_MOBILE_WEB = 'm.web';
	/** 댓글 POC TYPE mobile App */
	var CMT_POC_TYPE_MOBILE_APP = 'm.app';

	/** 댓글타입 - 기대평 */
	var CMT_TYPE_EVALUE = 'E';
	/** 댓글타입 - 리뷰 */
	var CMT_TYPE_REVIEW = 'R';
	/** 댓글타입 - QNA */
	var CMT_TYPE_QNA = 'Q';
	/** 댓글타입 - EVENT */
	var CMT_TYPE_EVENT = 'EV';
	/** 댓글타입 - WISH */
	var CMT_TYPE_WISH = 'WC';
	/** 댓글모드 - 등록 */
	var CMT_MODE_W = 'W';
	/** 댓글모드 - 수정 */
	var CMT_MODE_U = 'U';

	/** 채널코드 - 기대평 */
	var CMT_CHNL_EVALUE = 916;
	/** 채널코드 - 공연후기 */
	var CMT_CHNL_REVIEW = 917;
	/** 채널코드 - Q & A */
	var CMT_CHNL_QNA = 918;
	/** 채널코드 - 멜론티켓 이벤트 */
	var CMT_CHNL_EVENT = 919;
	/** 채널코드 - 위시콘서트 */
	var CMT_CHNL_WISH = 920;

	/** 파라메터 저장소 키 - 댓글쓰기 */
	var DATA_KEY_WRITE = "comment.write";
	/** 파라메터 저장소 키 - 댓글수정 */
	var DATA_KEY_MODIFY = "comment.modify";
	/** 파라메터 저장소 키 - 댓글상세 */
	var DATA_KEY_DETAIL = "comment.detail";
	/** 파라메터 저장소 키 - 신고하기 */
	var DATA_KEY_REPORT = "comment.report";
	/** 파라메터 저장소 키 - 뷰어 */
	var DATA_KEY_VIEWER = "comment.viewer";

	// 리스트 영역 대상 지정
	var _targetListDom = null;
	// 등록 팝업 이벤트 대상 지정
	var _targetWriteDom = null;
	// 댓글 리스트 수 표시 대상 지정
	var _targetCountDom = null;
	// 댓글 데이터 없음 영역
	var _targetNodataDom = null;
	// 리뷰 평점 표시영역
	var _targetStarPointDom = null;
	// 리뷰 상세보기 영역 대상 지정
	var _targetCommentDetailDom = null;
	// 덧글 리스트 영역
	var _targetReplyListDom = null;
	// 덧글 등록 버튼
	var _targetReplyWriteDom = null;
	// 상품후기콘텐츠 영역
	var _targetReviewContsDom = null;

	//덧글 노데이터
	var _targetNodataDom_reply = null;

	// 코멘트 작성모드 설정
	var _commentMode = '';

	var C_EVENT_TYPE_CMT_IMG_ATTACH = "click.event.cmt.img.attach";
	var C_EVENT_TYPE_CMT_IMG_INPUT_CHANGE = "change.event.cmt.img.change";

	var MAX_LENG = 1000;
	var MAX_QNA_LENG = 500;
	/**
	 * 첨부파일 Dom 구성
	 *
	 * @param pData
	 * @returns {Array}
	 */
	var _drawAttach = function(pData) {

		var _ds = [];

		// 첨부파일 존재시 출력
		if (JsonUtils.isNotEmpty(pData.cmtInfo.atachSumry)) {

			$.each(pData.cmtInfo.atachSumry, function(i, o){
				var _dsSub = [];

				if ('image' === o.atachType) {
					_dsSub.push('<div class="photo">');
					_dsSub.push('<a href="#action" class="img"><img src="'+o.atachPropty.thumbUrl+'" alt=""></a>');
					_dsSub.push('</div>');
				}
				else if ('music_song' === o.atachType) {
					_dsSub.push('<div class="music">');
					_dsSub.push('<a href="#action" class="img"><img src="'+o.atachPropty.albumImagePath+'" alt="">');
					if(o.atachPropty.adultFlag == true){
						_dsSub.push('<span class="ico_comm ico_age_ban">19금</span>');
					}
					_dsSub.push('<span class="ico_comm ico_mvplay"></span></a>');
					_dsSub.push('<a href="#action" onclick="javascript:return false;" class="ct">');
					_dsSub.push('<span class="t">'+o.atachPropty.songName+'</span>');
					_dsSub.push('<span class="x">'+o.atachPropty.artistName+'</span>');
					_dsSub.push('</a>');
					_dsSub.push('</div>');
				}
				else if ('music_album' === o.atachType) {
					_dsSub.push('<div class="album">');
					_dsSub.push('<a href="#action" class="img"><img src="'+o.atachPropty.albumImagePath+'" alt=""></a>');
					_dsSub.push('<a href="#action" onclick="javascript:return false;" class="ct">');
					_dsSub.push('<span class="t">'+o.atachPropty.albumName+'</span>');
					_dsSub.push('<span class="t">'+o.atachPropty.artistName+'</span>');
					_dsSub.push('<span class="d">'+o.atachPropty.dsplyIssueDate+'</span>');
					_dsSub.push('</a>');
					_dsSub.push('</div>');
				}
				else if ('music_artist' === o.atachType) {
					_dsSub.push('<div class="artist">');
					_dsSub.push('<a href="#action" class="img"><img src="'+o.atachPropty.artistImagePath+'" alt=""></a>');
					_dsSub.push('<a href="#action" onclick="javascript:return false;" class="ct">');
					_dsSub.push('<span class="t">'+o.atachPropty.artistName+'</span>');
					_dsSub.push('<span class="x">'+o.atachPropty.artistType+'<br>'+o.atachPropty.gnr+'</span>');
					_dsSub.push('</a>');
					_dsSub.push('</div>');
				}
				else if ('video' === o.atachType) {
					_dsSub.push('<div class="mov">');
					_dsSub.push('<a href="#action" class="img"><img src="'+o.atachPropty.videoImageDsplyPath+'" alt="">');
					if(o.atachPropty.videoAdultFlag == true){
						_dsSub.push('<span class="ico_comm ico_age_ban">19금</span>');
					}
					_dsSub.push('<span class="ico_comm ico_mvplay"></span></a>');
					_dsSub.push('<a href="#action" onclick="javascript:return false;" class="ct">');
					_dsSub.push('<span class="t">'+o.atachPropty.videoTitle+'</span>');
					_dsSub.push('<span class="n">'+o.atachPropty.artistName+'</span>');
					_dsSub.push('<span class="x"><span class="d">'+o.atachPropty.dsplyVideoIssueDate+' <span class="view">');
					_dsSub.push('<span class="ico_comm ico_eye"></span>'+o.atachPropty.videoViewCnt+'</span></span></span>');
					_dsSub.push('</a>');
					_dsSub.push('</div>');
				}
				else if ('link_video' === o.atachType) {
					_dsSub.push('<div class="mov">');
//					if(mstApp.isApp()){
//						_dsSub.push('<a href="#action" class="img"><img src="'+o.atachPropty.thumbUrl+'" alt="">');
//					}else{
//						_dsSub.push('<a href="javascript:mstApp.openWebView(\''+o.atachValue+'\',\'댓글 첨부영상 보기\');" class="img"><img src="'+o.atachPropty.thumbUrl+'" alt="">');
//					}
					_dsSub.push('<a href="javascript:mstApp.goLink(\''+o.atachValue+'\',\'true\',\'댓글 첨부영상 보기\');" class="img"><img src="'+o.atachPropty.thumbUrl+'" alt="">');
					
					_dsSub.push('<span class="ico_comm ico_mvplay"></span></a>');
					_dsSub.push('<a href="#action" onclick="javascript:return false;" class="ct">');
					_dsSub.push('<span class="t">'+o.atachPropty.videoTitle+'</span>');
					_dsSub.push('<span class="n"></span>');
					_dsSub.push('<span class="x"></span>');
					_dsSub.push('</a>');
					_dsSub.push('</div>');
				}

				_dsSub = $(_dsSub.join(''));

				// 첨부파일 액션 바인딩
				_bindAttachAction(o, _dsSub.find('a.img'));

				_ds.push(_dsSub);
			});
		}

		return _ds;
	},

	_getMaxLength = function(type, pTarget){
		var _maxLeng = 1000;
		if (CMT_TYPE_REVIEW === type) {
			_maxLeng = MAX_LENG;
		}
		// 기대평 클래스 추가
		else if (CMT_TYPE_EVALUE === type) {
			_maxLeng = MAX_LENG;
		}
		// QNA 클래스 추가
		else if (CMT_TYPE_QNA === type){
			_maxLeng = MAX_QNA_LENG;
		}

		$('#maxleng').text(_maxLeng);

		return _maxLeng;
	},

	/**
	 * 코멘트 내용 출력
	 */
	_drawComment = function(pData) {

		var _ds = [];

		// QNA 일 경우 코멘트 출력
		if(CMT_TYPE_QNA === pData.type) {
            var _pbMemberList =  ActionHandler._getData('bpMemberList');
            var nickName ="";
			var cls ="";
            $.each(_pbMemberList, function(i, o) {
                if(pData.memberInfo.memberKey === o.MEMBERKEY && o.SETDATE > new Date().yyyymmddhhmiss()){
                    nickName = "공연기획사";
                    cls = "name admin";
                    return false;
                }else{
                    nickName = pData.memberInfo.memberNickname;
                    cls = "name";
				}
            });

//			_ds.push('<li data-cmtSeq="'+pData.cmtSeq+'">');
//			_ds.push('<div class="q">');
//			_ds.push('<div class="tit">');
//			_ds.push('<span class="ico">Q</span><span class="name">');
//			_ds.push(pData.memberInfo.memberNickname);
//			_ds.push('</span><span class="day">');
//			_ds.push(pData.cmtInfo.dsplyDate);
//			_ds.push('</span><span class="btn">');
//			_ds.push('</span>');
//			_ds.push('</div>'); // .q
//			_ds.push('<p class="txt">'+pData.cmtInfo.cmtCont.replace(/\n/g, '<br/>')+'</p>');
//			_ds.push('</div>'); // .tit

//			if (pData.cmtInfo.validAdcmtCnt > 0) {
//				_ds.push('<div class="btn_list_qna">');
//				_ds.push('<button type="button" class="" data-seq="'+pData.cmtSeq+'" data-act="0"><span>답변보기</span> <i></i></button>');
//				_ds.push('</div>');
//
//				//덧글이 들어가는 위치
//				_ds.push('<div class="a" style="display: none;" id="adcmt">');
//				_ds.push('</div>');
//			}
//			_ds.push('</li>');
//
//			_ds = $(_ds.join(''));
			
			
			_ds.push('<li>');
			_ds.push('	<div class="q">');
			_ds.push('		<div class="tit">');
			_ds.push('			<span class="ico">Q</span>');
			_ds.push('			<span class="'+cls+'">'+nickName+'</span>');
			_ds.push('			<span class="day">'+pData.cmtInfo.dsplyDate+'</span>');
			_ds.push('			<span class="btn"></span>');
			_ds.push('			<p class="txt">'+pData.cmtInfo.cmtCont.replace(/\n/g, '<br/>')+'</p>');
			_ds.push('		</div>'); // tit
			_ds.push('	</div>');		// q
			_ds.push('<div class="opt"></div>');
			_ds.push('</li>');
			
			_ds = $(_ds.join(''));
			
			// 수정 가능한 경우만 버튼 노출
			if (pData.cmtInfo.memberCmtFlag) {

				var _btnModify = $('<a href="#action">수정</a>'),
					_btnRemove = $('<a href="#action">삭제</a>');

				_ds.find('span.btn').append(_btnModify);
				_ds.find('span.btn').append(_btnRemove);
				
				// 수정버튼 이벤트 바인딩
				_bindBtnPopupModify({
					chnlSeq: pData.chnlSeq,
					cmtInfo: pData.cmtInfo,
					cmtSeq: pData.cmtSeq,
					contsRefValue: pData.contsRefValue,
					nonRecmFlag: true,
					type: pData.type
				}, _btnModify);
				
				// 삭제버튼 이벤트 바인딩
				_bindBtnRemove(pData, _btnRemove);
				
			}
			
			else{
				var _btnReport = $('<a href="#action">신고</a>');

				_ds.find('span.btn').append(_btnReport);
				// 신고 이벤트 바인딩
				_bindBtnPopupReport(pData, _btnReport);
			}
			
			// 추천 비추천 버튼 추가
			var _btnLike = $('<button class="btn_like on">'+pData.cmtInfo.recmCnt+'</button>');
			var _btnDonLike = $('<button class="btn_don_like">'+pData.cmtInfo.nonRecmCnt+'</button>');

			_ds.find('div.opt').append(_btnLike);
			_ds.find('div.opt').append(_btnDonLike);

			// 추천/비추천 버튼 이벤트 바인딩
			_bindBtnRecommend($.extend({nonRecmFlag:false}, pData), _ds.find('.btn_like'));
			_bindBtnRecommend($.extend({nonRecmFlag:true}, pData), _ds.find('.btn_don_like'));
			
			if (undefined === pData.isReply || true !== pData.isReply) {

				var _btnReply = $('<a href="#action" class="btn_reply" data-cnt-reply="'+pData.cmtInfo.validAdcmtCnt+'">답글 '+pData.cmtInfo.validAdcmtCnt+'</a>');
				_ds.find('div.opt').append(_btnReply);
				
			}
			
			_bindBtnQnaPopupRecommend(pData, _ds.find('.btn_reply'));

			//펼치기에 답글 가져오기
			_ds.find('button[data-seq='+pData.cmtSeq+']').on('click',function(e){
				var _this = $(this);
				var _seq = _this.attr('data-seq');

				if(!_this.hasClass("show_a")){
					_this.addClass("show_a");
					_this.find('span').text("답변접기");

					//덧글 가져오기 및 표시하기
					if(_this.attr('data-act') === '0') {
						var _param = {
							podId: POC_ID,
							cmtPocType: _getPocType(),
							chnlSeq: pData.chnlSeq,
							contsRefValue: pData.contsRefValue,
							cmtSeq: pData.cmtSeq,
							adcmtListFlag: true
						};
						commentModel.deliver(function (d) {
							var _da = [];
							_da.push('<div class="tit">');
							_da.push('<span class="who">[멜론티켓]</span><span class="name">'+d.result.adcmtList[0].memberInfo.memberNickname+'</span><span class="day">'+d.result.adcmtList[0].adcmtInfo.dsplyDate+'</span>');
							_da.push('</div>');
							_da.push('<p class="txt">'+d.result.adcmtList[0].adcmtInfo.cmtCont.replace(/\n/g, '<br/>')+'</p>');

							_ds.find('#adcmt').append($(_da.join('')));

							_this.attr('data-act', '1');
						}).informCmt(_param);
					}
					_ds.find('.a').show();
				}else{
					_this.removeClass("show_a");
					_this.find('span').text("답변보기");
					_ds.find('.a').hide();
				}
			});
		}
		else {

			_ds.push('<li data-cmtSeq="'+pData.cmtSeq+'">');
			_ds.push('<div class="thumb">');

			if (StringUtils.isNotEmpty(pData.memberInfo.mypageImg)) {
//				_ds.push('<img src="'+ pData.memberInfo.mypageImg +'" />');
				_ds.push('<span class="img" style="background-image: url('+ pData.memberInfo.mypageImg +');"></span>');
			}

			_ds.push('</div>');
			_ds.push('<div class="cont m_txt_open">');
			_ds.push('<div class="status">');

			if (pData.cmtInfo.bestFlag) {
				_ds.push('<span class="ico_bgall">BEST</span>');
			}

			_ds.push('<span id="badgeIdx_'+pData.memberInfo.memberKey+'" class="ico_outline" style="display:none;">예매자</span> ');
			_ds.push('<span class="name">'+pData.memberInfo.memberNickname+'</span> ');
			_ds.push('<span class="date">'+pData.cmtInfo.dsplyDate+'</span> ');
			_ds.push('<span class="btn"></span>');
			_ds.push('</div>');
			if (StringUtils.isNotEmpty(pData.cmtInfo.cmtCont)) {
				_ds.push('<div class="txt">'+unescape(pData.cmtInfo.cmtCont.replace(/\n/g, '<br/>'))+'</div>');
				_ds.push('<div class="txt_all_btn">');
				_ds.push('<button onclick="$(this).parent().parent().toggleClass(\'m_txt_open\');$(this).blur();">전체글 열기/닫기</button>');
				_ds.push('</div>');
			}

			_ds.push('<div class="opt">');
			_ds.push('</div>');
			_ds.push('</div>');
			_ds.push('</li>');

			_ds = $(_ds.join(''));

			// 첨부파일 Dom 구성
			var _attach = _drawAttach(pData);
			if (0 < _attach.length) {
				_ds.find('.opt').before(_attach);
			}

			// 리뷰 일 경우 리뷰 평점 노출 (첨부파일 영역에 노출됨)
			if (CMT_TYPE_REVIEW === pData.type) {
				var _dsSub = [];

				_dsSub.push('<div class="performance">');
				_dsSub.push('<a href="#action" class="ct">');
				_dsSub.push('<span class="t">평점</span>');
                if(pData.isReply){
                    var _rate = parseInt($('#revIdx_'+pData.cmtInfo.cmtSeq).attr('data-rate'));
                   	var _width= _rate * 20 +'%';
                    _dsSub.push('<span class="star"><span id="revIdx_'+pData.cmtInfo.cmtSeq+'" style="width:'+_width+'">');
                }else{
					_dsSub.push('<span class="star"><span id="revIdx_'+pData.cmtInfo.cmtSeq+'" style="width:0%">');
				}
				_dsSub.push('</span></span></a></div>');

				_dsSub = $(_dsSub.join(''));
				_dsSub.on('click', function(e){ e.preventDefault();});

				_ds.find('.opt').before(_dsSub);
			}

			// 답글 등록이 아닌경우만 버튼 추가함.
			//if (undefined === pData.isReply || true !== pData.isReply) {

				// 수정, 삭제, 신고하기 버튼 이벤트 바인딩
				if (pData.cmtInfo.memberCmtFlag) {
					var _btnModify = $('<a href="#action">수정</a>'),
						_btnRemove = $('<a href="#action">삭제</a>');

					_ds.find('span.btn').append(_btnModify);
					_ds.find('span.btn').append(_btnRemove);

					// 수정버튼 이벤트 바인딩
					_bindBtnPopupModify({
						chnlSeq: pData.chnlSeq,
						cmtInfo: pData.cmtInfo,
						cmtSeq: pData.cmtSeq,
						contsRefValue: pData.contsRefValue,
						nonRecmFlag: true,
						type: pData.type
					}, _btnModify);

					// 삭제버튼 이벤트 바인딩
					_bindBtnRemove(pData, _btnRemove);
				}
				else {
					var _btnReport = $('<a href="#action">신고</a>');

					_ds.find('span.btn').append(_btnReport);

					// 신고버튼 이벤트 바인딩
					_bindBtnPopupReport(pData, _btnReport);
				}

				// 추천 비추천 버튼 추가
				var _btnLike = $('<button class="btn_like on">'+pData.cmtInfo.recmCnt+'</button>'),
					_btnDonLike = $('<button class="btn_don_like">'+pData.cmtInfo.nonRecmCnt+'</button>');

				_ds.find('div.opt').append(_btnLike);
				_ds.find('div.opt').append(_btnDonLike);

				// 추천/비추천 버튼 이벤트 바인딩
				_bindBtnRecommend($.extend({nonRecmFlag:false}, pData),
						_ds.find('.btn_like'));
				_bindBtnRecommend($.extend({nonRecmFlag:true}, pData),
						_ds.find('.btn_don_like'));

				if (undefined === pData.isReply || true !== pData.isReply) {
					// 답글 버튼 추가
					var _btnReply = $('<a href="#action" class="btn_reply" data-cnt-reply="'+pData.cmtInfo.validAdcmtCnt+'">답글 '+pData.cmtInfo.validAdcmtCnt+'</a>');

					_ds.find('div.opt').append(_btnReply);
				}

				// 답글 팝업 이벤트 바인딩
				_bindBtnPopupRecommend(pData, _ds.find('.btn_reply'));
			//}
		}

		return _ds;
	},

	/**
	 * 리뷰에서 사용할 별점박스 Dom 구성
	 *
	 * @param pMode - 모드구분 (CMT_MODE_W: 등록, CMT_MODE_U: 수정)
	 */
	_drawStarBox = function(pMode) {
		var _ds = [], _tp, _data;

		if (CMT_MODE_W === pMode) {
			_tp = DATA_KEY_WRITE;
		}
		else if (CMT_MODE_U === pMode) {
			_tp = DATA_KEY_MODIFY;
		}

		_data = $.extend({}, ActionHandler._getData(_tp));

		_ds.push('<div class="box_star">');
		_ds.push('<div><strong class="tit">공연 평점</strong>');
		_ds.push('<span class="btn_star">');
		_ds.push('<button class="">평점 1.0 선택</button>');
		_ds.push('<button class="">평점 2.0 선택</button>');
		_ds.push('<button class="">평점 3.0 선택</button>');
		_ds.push('<button class="">평점 4.0 선택</button>');
		_ds.push('<button>평점 5.0 선택</button>');
		_ds.push('</span>');
		_ds.push('<span class="txt"><strong>0.0</strong> / 5.0</span></div>');
		_ds.push('</div>');

		_ds = $(_ds.join(''));

		if(undefined !== $('#revIdx_'+_data.cmtSeq).attr('data-rate')){
			var _rate = parseInt($('#revIdx_'+_data.cmtSeq).attr('data-rate'));
			_ds.find('.txt strong').text(_rate+'.0');
		}

		_ds.each(function(i){
			var _o = $(this), _btns = _o.find('button'), _txt = _o.find('.txt strong');
			var _cnt = 0;
			_btns.each(function(bi){
				var _bi = $(this);

				_bi.on('click', function(e){
					this.blur();

					_btns.removeClass('on');

					for (var j = 0; j < _btns.index(_bi) + 1; j++ ) {
						_btns.eq(j).addClass('on');
					}

					_txt.text((_btns.filter('.on').length*1.0).toFixed(1));
					
					// 음악 추가후 평점 클릭시 데이터 업데이트
					_data = ActionHandler._getData(_tp);

					_data.rate = _btns.filter('.on').length;

					ActionHandler._setData(_tp, _data);
				});

				//저장된 값 표시
				if(_cnt < _rate){
					_bi.addClass('on');
				}
				_cnt++;
			});

			// 기본 별점
			ActionHandler._setData(_tp, $.extend(_data, {rate: _btns.filter('.on').length}));

		});

		$('.box_txtarea').before(_ds);
	},

	/**
	 * 덧글 리스트 Dom 구성
	 */
	_drawReplyList = function(pData) {
		var _pbMemberList =  ActionHandler._getData('bpMemberList');
		
		var _ds = [], _data = $.extend({}, ActionHandler._getData(DATA_KEY_DETAIL));;
		if(CMT_TYPE_QNA === pData.type) {
			
			_ds.push('<li>');
			_ds.push('	<div class="tit">');
			
			var nickName = "";
			var cls = "";
			if(_pbMemberList.length === 0){
				if(pData.replyMemInfo.memberNickname === "멜론티켓"){
					nickName = "멜론티켓";
					cls = "name admin";
				}else{
					nickName = pData.replyMemInfo.memberNickname;
					cls = "name";
				}
			}else{
				$.each(_pbMemberList, function(i, o) {
					if(pData.replyMemInfo.memberKey === o.MEMBERKEY && o.SETDATE > new Date().yyyymmddhhmiss()){
						nickName = "공연기획사";
						cls = "name admin";
						return false;
					}else if(pData.replyMemInfo.memberNickname === "멜론티켓"){
						nickName = "멜론티켓";
						cls = "name admin";
						return false;
					}else{
						nickName = pData.replyMemInfo.memberNickname;
						cls = "name";
					}
				});
			}
			
			_ds.push('		<span class="'+cls+'">'+nickName+'</span>');
//			_ds.push('		<span class="name">'+pData.replyMemInfo.memberNickname+'</span>');
			_ds.push('		<span class="day">'+pData.adcmtInfo.dsplyDate+'</span>');
			_ds.push('		<span class="btn"></span>');
			_ds.push('	</div>');
			_ds.push('	<div class="txt">'+unescape(pData.adcmtInfo.cmtCont.replace(/\n/g, '<br/>'))+'</div>');
			_ds.push('</li>');

		}else{
			
			_ds.push('<li>');
			_ds.push('<div class="tit"><span class="name">');
			_ds.push(pData.replyMemInfo.memberNickname);
			_ds.push('</span><span class="day">');
			_ds.push(pData.adcmtInfo.dsplyDate);
			_ds.push('</span><span class="btn">');
			_ds.push('</span></div>');
			//_ds.push('<div class="txt">'+pData.adcmtInfo.cmtCont+'</div>');
			_ds.push('<div class="txt">'+unescape(pData.adcmtInfo.cmtCont.replace(/\n/g, '<br/>'))+'</div>');
			_ds.push('</li>');
			
		}

		_ds = $(_ds.join(''));

		if (pData.adcmtInfo.memberCmtFlag) {
			//본인의 글
			var _btnRemove = $('<a href="#action">삭제</a>');

			_ds.find('span.btn').append(_btnRemove);

			// 삭제버튼 이벤트 바인딩
			_bindBtnRemoveReply(
					$.extend(_data, {
						parntCmtSeq: _data.cmtSeq,
						cmtSeq: pData.adcmtInfo.cmtSeq
					}), _btnRemove);

		}else{
			//타인의 글
			var _btnReport = $('<a href="#action">신고</a>');

			_ds.find('span.btn').append(_btnReport);
			// 신고버튼 이벤트 바인딩
			_bindBtnPopupReportReply(
					$.extend(_data, {
						parntCmtSeq: _data.cmtSeq,
						cmtSeq: pData.adcmtInfo.cmtSeq
					}), _btnReport);
		}

		return _ds;
	},

	/**
	 * 댓글 카운트 Dom 구성
	 *
	 * @param pCount - 댓글 카운트
	 */
	_drawCommentCount = function(pCount) {
		if(null !== _targetCountDom) {
			if(0 < pCount) {
				_targetCountDom.html(pCount);
			} else {
				_targetCountDom.hide();
			}
		}
	},

	/**
	 * Nodata 영역 Dom 구성
	 */
	_drawNodataArea = function(pCount) {
		if(null !== _targetNodataDom) {
			if(1 > pCount) {
				_targetNodataDom.slideDown(200);
			} else {
				_targetNodataDom.remove();
			}
		}
	},

	/**
	 * 덧글 Nodata 영역 Dom 구성
	 */
	_drawNodataArea_reply = function(pCount) {
		if(null !== _targetNodataDom_reply) {
			if(1 > pCount) {
				_targetNodataDom_reply.slideDown(200);
			} else {
				// _targetNodataDom_reply.remove();
				_targetNodataDom_reply.css("display","none");
			}
		}
	},

	/**
	 * 평점 영역 Dom 구성
	 */
	_drawStarPointArea = function(pData) {

		// 공연 평점 설정
		if (undefined !== pData.rate && null !== pData.rate) {
			_targetStarPointDom.find('.ico_star span').css({width: pData.rate*20});
			_targetStarPointDom.find('.n').html(pData.rate.toFixed(1));
		}
		else {
			_targetStarPointDom.find('.ico_star span').css({width: 0});
			_targetStarPointDom.find('.n').html('0.0');
		}
	},

	/**
	 * 뱃지 카운트 표기
	 *
	 * @param pCount
	 */
	_drawBadgeCount = function(pType, pCount) {
		// 탭 리뷰 수 뱃지 표기
		var _cntDom;

		if(CMT_TYPE_REVIEW === pType) {
			//리뷰
			_cntDom = $('span[id^=cnt_review]');
		}
		else if (CMT_TYPE_EVALUE === pType) {
			//기대평
			_cntDom = $('span[id^=cnt_evalue]');
		}
		else if (CMT_TYPE_QNA === pType) {
			// Q&A
			_cntDom = $('span[id^=cnt_qna]');
		}

		if(undefined !== _cntDom) {
			var _cnt = pCount;
			if( 0 < _cnt ) {
				if( _cnt > 999 ) {
					_cnt = '999+';
				}
			} else {
				//없는 경우 일단 0으로 노출
				//_cntDom.hide();
				_cnt = 0;
			}
			_cntDom.html( _cnt );
		}
	},

	/**
	 * 댓글목록 Dom 구성
	 *
	 * @param pData
	 */
	_drawCommentList = function(pData) {

		var _ds = [], _data = pData.result,
			_cmtList = _data.cmtList,
			_topList = _data.topList;

		// 뱃지 카운트 표기
		_drawBadgeCount(pData.params.type, _data.pageInfo.totalCnt);

		// 글없음 영역 표시
		_drawNodataArea(_data.pageInfo.totalCnt);

//		if (1 > _data.pageInfo.totalCnt) {
//			return false;
//		}

		// 댓글 카운트 설정
		_drawCommentCount(_data.pageInfo.totalCnt);

		// 리뷰 타입 추가처리
		if (CMT_TYPE_REVIEW  === pData.params.type) {

			// 예매자 뱃지 노출처리
			_printReverveInfos(_cmtList, _data.pageInfo.contsRefValue);

			// 평점 조회
			_printReviewInfos(pData.params);

			// 댓글별 평점 조회
			_printReviewRate(_cmtList, pData.params);
		}

		// 마지막 페이지 여부 설정
		if (!_targetListDom.data('isEnd') && (_targetListDom.data('totalCnt') == (_targetListDom.children().length + _cmtList.length))) {
			_targetListDom.data('isEnd', true);
		}

		// 최초 페이지 로딩일 경우
		if (1 === pData.params.pageNo) {
			if(undefined !== _topList && _topList.length > 0 ){
				$.each(_topList, function(i, o) {

					// Top 공지사항 추가
					if (o.cmtInfo.ancmFlag) {
						var _topDs = [];

						if (CMT_TYPE_QNA === pData.params.type){
							_topDs.push('<li data-cmtSeq="'+o.cmtInfo.cmtSeq+'" class="notice">');
						}else{
							_topDs.push('<li data-cmtSeq="'+o.cmtInfo.cmtSeq+'">');
						}

//						_topDs.push('<div class="thumb"><img src="http://cdnticket.melon.co.kr/resource/image/mobile/thumb/review_thumb_notice.png" alt=""></div>');
						_topDs.push('<div class="thumb"><span class="img" style="background-image: url(http://cdnticket.melon.co.kr/resource/image/mobile/thumb/review_thumb_notice.png);"></span></div>');
						_topDs.push('<div class="cont">');
						_topDs.push('<div class="status">');
						//_topDs.push('<span class="ico_outline">공지</span> <span class="name">'+ o.memberInfo.memberNickname +'</span>&nbsp;');
						_topDs.push('<span class="ico_outline">공지</span> <span class="name">'+ '멜론티켓' +'</span>&nbsp;');
						_topDs.push('<span class="date">'+ o.cmtInfo.dsplyDate+'</span></div>');
						if (StringUtils.isNotEmpty(o.cmtInfo.cmtCont)) {
							_topDs.push('<div class="txt">'+unescape(o.cmtInfo.cmtCont.replace(/\n/g, '<br/>'))+'</div>');
							_topDs.push('<div class="txt_all_btn">');
							_topDs.push('<button onclick="$(this).parent().parent().toggleClass(\'m_txt_open\');$(this).blur();">전체글 열기/닫기</button>');
							_topDs.push('</div>');
						}
						_topDs.push('</div></li>');

						_ds.push(_topDs.join(''));
					}
					// Top 베스트 댓글 추가
					else if (o.cmtInfo.bestFlag) {
						var _param = $.extend({
							chnlSeq: _data.pageInfo.chnlSeq,
							contsRefValue: _data.pageInfo.contsRefValue,
							memberNickname: escape(o.memberInfo.memberNickname),
							cmtSeq: o.cmtInfo.cmtSeq,
							type: pData.params.type,
						}, o);

						_ds.push(_drawComment(_param));
					}
				});
			}			

			// 댓글 콘텐츠 가져오기
			$.each(_cmtList, function(i, o) {

				var _param = $.extend({
					chnlSeq: _data.pageInfo.chnlSeq,
					contsRefValue: _data.pageInfo.contsRefValue,
					memberNickname: escape(_cmtList[i].memberInfo.memberNickname),
					cmtSeq: _cmtList[i].cmtInfo.cmtSeq,
					type: pData.params.type,
				}, _cmtList[i]);

				_ds.push(_drawComment(_param));
			});

			_targetListDom.html(_ds);

			// 전체 리스트 크기 설정
			_targetListDom.data('totalCnt', _data.pageInfo.totalCnt);
			_targetListDom.trigger('completeCommentLoad', [_data]);

			// 하단 스크롤 근접시 더보기
			ActionHandler.more({
				target: window,
				callback: function() {

					var _opt = _targetListDom.data('option');

					if (undefined !== _targetListDom && !_targetListDom.data('isEnd')){

						if (JsonUtils.isNotEmpty(_opt)) {
							// 더보기 리스트 추가
							_opt.pageNo ++;
							_printComment(_opt);
						}
					}

					if ('N' !== _targetListDom.parents('#wrap').data('active') && _targetListDom.data('isEnd')) {
//						ActionHandler.toast('더이상 댓글이 없습니다.');
					}
				}
			});
		}
		// 이후 페이지 추가
		else {

			// 댓글 콘텐츠 가져오기
			$.each(_cmtList, function(i, o) {

				var _param = $.extend({
					chnlSeq: _data.pageInfo.chnlSeq,
					contsRefValue: _data.pageInfo.contsRefValue,
					memberNickname: escape(_cmtList[i].memberInfo.memberNickname),
					cmtSeq: _cmtList[i].cmtInfo.cmtSeq,
					type: pData.params.type,
				}, _cmtList[i]);

				_ds.push(_drawComment(_param));
			});

			_targetListDom.append(_ds);
		}

		// 더보기 버튼 토글
		_targetListDom.find('.cont').each(function(i, o) {
			var _o = $(o);

			if (55 <= _o.find('.txt').height()) { //max height 60px로 되어 있음
				_o.removeClass('m_txt_open');
			}
			else {
				_o.parent().find('.txt_all_btn').remove();
			}
		});

		// 더보기용 현재페이지 세팅
		_targetListDom.data('option', pData.params);
	},

	/**
	 * 팝업 타이틀 Dom 구성
	 */
	_drawPopupTitle = function(pType) {

		var _tl = [];
		// 타이틀 설정
		if (CMT_TYPE_EVALUE === pType) {
			_tl.push('기대평');
		}
		else if (CMT_TYPE_REVIEW === pType) {
			_tl.push('리뷰');
		}
		else if (CMT_TYPE_QNA === pType) {
			_tl.push('문의하기');
		}
		else if (CMT_TYPE_EVENT === pType) {
			_tl.push('이벤트 댓글');
		}

		// 문의하기 제외 접미사 추가
		if (CMT_TYPE_QNA !== pType) {
			if (CMT_MODE_W === _commentMode) {
				_tl.push('등록');
			}
			else if (CMT_MODE_U === _commentMode) {
				_tl.push('수정');
			}
		}

		$('#commentTitle').text(_tl.join(' '));
	}


	/**
	 * 댓글목록 출력
	 *
	 * @param pData - 댓글 데이터
	 */
	_printComment = function(pData) {

		// API 호출용 파라메터 조합
		var _params = {
			pocId: POC_ID,
			cmtPocType: _getPocType(),
			sortType:0,
			srchType:0,
			pageNo:1,
			pageSize:10
		};

		_params = $.extend(_params, pData);

		commentModel
			.deliver(_drawCommentList)
			.listComment(_params);
	},

	/**
	 * 리뷰 평점 정보 조회
	 *
	 * @param pData - 댓글 데이터
	 */
	_printReviewInfos = function(pData) {
		performanceModel
			.deliver(function(d){
				//평점 영역
				_drawStarPointArea(d);

				//후기콘텐츠 노출
				_printReviewConts($.extend({prodId:pData.contsRefValue},d));
			})
			.listReviewInfos({
				chnlSeq: pData.chnlSeq,
				prodId: pData.contsRefValue
			});
	},

	/**
	 * 예매자 뱃지 추가
	 *
	 * @param pList - 사용자 리스트 정보
	 * @param pContsRefValue - 콘텐츠 아이디
	 */
	_printReverveInfos = function(pList, pContsRefValue) {
		var _paramMember = [];
		$.each(pList, function(i, o) {
			_paramMember.push(o.memberInfo.memberKey);
		});

		commentModel
			.deliver(function(d) {
				var _tgtDom = $('#veiw_tab_wrap').find('.list_review');

				$.each(d.memberKey, function(ia, oa) {
					_tgtDom.find('span[id^=badgeIdx_'+oa+']').show();
//					_tgtDom.find('span[name^=badgeIdx_'+oa+']').show();
				});
			})
			.getReservationInfos(
					{
						prodId: pContsRefValue,
						memberKey: _paramMember.join(',')
					});
	},

	/**
	 * 댓글별 평점 보기 처리
	 *
	 * @param pList - 댓글 리스트
	 * @param pData - 파라메터
	 */
	_printReviewRate = function(pList, pData) {
		
		// 댓글리스트 없을시에 평점조회 안함.
		if (1 > pList) {return false;}
		
		var _paramSeq = [];
		$.each(pList, function(i, o) {
			_paramSeq.push(o.cmtInfo.cmtSeq);
		});

		commentModel
			.deliver(function(d) {
				var _tgtDom = $('#veiw_tab_wrap').find('.list_review');

				$.each(d, function(i, o) {
					_tgtDom.find('#revIdx_'+ o.cmtSeq).css({
						width: o.rate * 20 + '%'
					});
					_tgtDom.find('#revIdx_'+ o.cmtSeq).attr('data-rate', o.rate);
				});
			})
			.listReviewRate({
				chnlSeq: pData.chnlSeq,
				contsRefValue: pData.contsRefValue,
				cmtSeqList: _paramSeq.join(',')
			});
	},

	/**
	 * 후기 콘텐츠 노출 처리
	 * @param pData
	 */
	_printReviewConts = function(pData){

		if(undefined === pData.list || pData.list.length === 0){
			//do nothing
		}else{
			var _ds = [];
			_ds.push('<div class="btn"><a id="btnGoSetList" href="">공연 셋리스트 듣기<span class="ico_comm ico_mvplay"></span></a></div>');
			_ds.push('<div class="box_slide">');
			_ds.push('<div class="inner">');
			_ds.push('<ul>');
			$.each(pData.list, function(i, o){
				_ds.push('<li><img src="http://'+ActionHandler.HOST_CDN+ o.imgUrl +'" alt="'+o.imgDescr+'" /></li>');
			});
			_ds.push('</ul>');
			_ds.push('</div>');
			_ds.push('<div class="paging"><strong>2</strong> / <em>20</em></div>');
			if(pData.list.length > 1){
				_ds.push('<button class="btn_prev"><span class="btn_comm btn_photo_prev"></span></button>');
				_ds.push('<button class="btn_next"><span class="btn_comm btn_photo_next"></span></button>');
			}
			_ds.push('</div>');

			_ds = $(_ds.join(""));


			performanceModel
			.deliver(function(d){
				var _songData = JSON.parse(d.songJson).data;
				var _albumData = JSON.parse(d.albumJson).data;

				if(undefined === _songData || _songData.list.length < 1){
					_ds.find('#btnGoSetList').hide();
				}else{
					var _ab = new ActionBuilder();
					_ab.setActionType(ActionHandler.ACTION_TYPE_POPUP);
					_ab.setTarget('/performance/pop_relation_music.html');
					_ab.setKey('perform.pop_realation_music');
					_ab.setJson({
						typeCode: 'song',
						prodId: d.prodId,
						title: d.title,
						data: {
							song: _songData.list,
							album: _albumData.list
						}
					});
					_ab.bind($('#btnGoSetList'));
				}
			})
			.getPerformanceDetail({
				prodId: pData.prodId
				});

			_targetReviewContsDom.append(_ds);


			var pagingSet = function pagingSet (param,content,allNumber,onNumber,prevBtn,nextBtn) {
				var pcnt = 0;
				var content = $(param+">"+content);
				var allNumber = $(param+">"+allNumber);
				var onNumber = $(param+">"+onNumber);
				var btnPrev = $(param+">"+prevBtn);
				var btnNext = $(param+">"+nextBtn);
				$(allNumber).text($(content).size());
				$(onNumber).text($(content).index()+1);
				$(content).hide().eq(pcnt).show();
				$(btnPrev).click(
					function(){
						pcnt = pcnt - 1;
						if (pcnt < 0) pcnt = $(content).size() -1;
						$(content).hide().eq(pcnt).show();
						$(onNumber).text(pcnt+1);
					}
				);
				$(btnNext).click(
					function(){
						pcnt = pcnt + 1;
						if (pcnt > $(content).size()-1) pcnt = 0;
						$(content).hide().eq(pcnt).show();
						$(onNumber).text(pcnt+1);
					}
				);
			}
			pagingSet(".box_slide",".inner ul li",".paging em",".paging strong"," .btn_prev"," .btn_next");
		}
	}

	/**
	 * 등록팝업 이벤트 바인딩
	 *
	 * @param pData - 댓글 데이터
	 * @param pTarget - 바인딩 타켓
	 */
	_bindBtnPopupWrite = function(pData, pTarget) {
		var _ab = new ActionBuilder();
		_ab.setActionType(ActionHandler.ACTION_TYPE_POPUP);
		_ab.setTarget('/comment/write.html');
		_ab.setKey(DATA_KEY_WRITE);
		_ab.setCheckLogin('Y');
		_ab.setJson(pData);
		_ab.bind(pTarget);
	},

	/**
	 * 수정팝업 이벤트 바인딩
	 *
	 * @param pData - 댓글 데이터
	 * @param pTarget - 바인딩 타켓
	 */
	_bindBtnPopupModify = function(pData, pTarget) {
		var _ab = new ActionBuilder();
		_ab.setActionType(ActionHandler.ACTION_TYPE_POPUP);
		_ab.setTarget('/comment/modify.html');
		_ab.setKey(DATA_KEY_MODIFY);
		_ab.setJson($.extend(pData, {type: pData.type}));
		_ab.bind(pTarget);
	},

	/**
	 * 신고하기팝업 버튼 이벤트 바인딩
	 *
	 * @param pData - 댓글 데이터
	 * @param pTarget - 바인딩 타켓
	 */
	_bindBtnPopupReport = function(pData, pTarget) {
		var _ab = new ActionBuilder();
		_ab.setActionType(ActionHandler.ACTION_TYPE_POPUP);
		_ab.setTarget('/comment/pop_report.html');
		_ab.setKey(DATA_KEY_REPORT);
		_ab.setCheckLogin('Y');
		_ab.setVisiblePre('Y');
		_ab.setScrollable('N');
		_ab.setJson(pData);
		_ab.bind(pTarget);
	},

	/**
	 * 덧글보기팝업 버튼 이벤트 바인딩
	 *
	 * @param pData - 댓글 데이터
	 * @param pTarget - 바인딩 타켓
	 */
	_bindBtnPopupRecommend = function(pData, pTarget) {
		var _ab = new ActionBuilder();
		_ab.setActionType(ActionHandler.ACTION_TYPE_POPUP);
		_ab.setTarget('/comment/pop_reply.html');
		_ab.setKey(DATA_KEY_DETAIL);
		_ab.setCheckLogin('Y');
		_ab.setJson(pData);
		_ab.bind(pTarget);
	},
	
	/**
	 * Q&A 덧글보기팝업 버튼 이벤트 바인딩
	 *
	 * @param pData - 댓글 데이터
	 * @param pTarget - 바인딩 타켓
	 */
	_bindBtnQnaPopupRecommend = function(pData, pTarget) {
		var _ab = new ActionBuilder();
		_ab.setActionType(ActionHandler.ACTION_TYPE_POPUP);
		_ab.setTarget('/comment/pop_qna_reply.html');
		_ab.setKey(DATA_KEY_DETAIL);
		_ab.setCheckLogin('Y');
		_ab.setJson(pData);
		_ab.bind(pTarget);
	},

	/**
	 * 댓글 등록 버튼 이벤트 바인딩
	 *
	 * @param pData
	 * @param pTarget
	 */
	_bindBtnWrite = function(pData, pTarget) {
		pTarget.on('click', function(e) {

			e.preventDefault();

			// 파라메터 저장소에서 저장된 파라메터값 가져온다.
			var _textArea = $('#textReply'), _data;

			if(_textArea.val() === null || $.trim(_textArea.val()) === ''){
				ActionHandler.toast('내용을 입력해 주세요.');
				return;
			}

			if(_textArea.val() !== null && $.trim(_textArea.val()).length < 3){
				ActionHandler.toast('3자이상 입력하세요');
				return;
			}

			_setAttachParam({
				atachType: 'text',
				atachValue: $.trim(_textArea.val())
			});

			_data = ActionHandler._getData(DATA_KEY_WRITE);
			_data.cmtInfo = null;
			_data.memberInfo = null;
			_data.pocId = POC_ID;
			_data.cmtPocType = _getPocType();

			//별점은 1점 이상 가능.
			if(CMT_TYPE_REVIEW === _data.type && undefined !== _data.rate && _data.rate < 1){
				ActionHandler.toast('평점을 입력해 주세요.');
				return;
			}

			commentModel
				.deliver(function(d) {
					if ("0" === d.STATUS) {

						// 리뷰 일 경우 별점등록 추가처리
						if (CMT_TYPE_REVIEW === _data.type) {

							commentModel
								.addReviewRate({
									chnlSeq: _data.chnlSeq,
									contsRefValue: _data.contsRefValue,
									cmtSeq: d.result.cmtSeq,
									rate: _data.rate
								});
						}
						// QNA일 경우 관리테이블에 글 순번등록 추가처리
						else if (CMT_TYPE_QNA === _data.type) {

							commentModel
								.addCmt({
									chnlSeq: _data.chnlSeq,
									contsRefValue: _data.contsRefValue,
									cmtSeq: d.result.cmtSeq
								});
						}

						ActionHandler.toast('등록 되었습니다.', function(){

							// 리스트 갱신 후 팝업 닫기
							_printComment({
								chnlSeq: _data.chnlSeq,
								contsRefValue: _data.contsRefValue,
								type: _data.type
							});

							ActionHandler._closeActivePopup();
							ActionHandler._setData(DATA_KEY_WRITE, null);
						});
					}
				})
				.insertCmt(_data);

		});
	},

	/**
	 * 댓글 수정하기 버튼 이벤트 바인딩
	 *
	 * @param pData
	 * @param pTarget
	 */
	_bindBtnModify = function(pData, pTarget) {
		pTarget.on('click', function(e) {

			e.preventDefault();

			// 파라메터 저장소에서 저장된 파라메터값 가져온다.
			var _textArea = $('#textReply'), _data;

			//길이 체크
			if ('' === $.trim(_textArea.val())){
				ActionHandler.toast("내용을 입력해 주세요.");
				return false;
			}else if (3 > $.trim(_textArea.val()).length) {
				ActionHandler.toast("3자 이상의 글을 작성해 주세요.");
				return false;
			}

			// 텍스트 첨부 설정
			_setAttachParam({
				atachType: 'text',
				atachValue: $.trim(_textArea.val())
			});

			_data = ActionHandler._getData(DATA_KEY_MODIFY);
			_data.cmtInfo = null;
			_data.memberInfo = null;
			_data.pocId = POC_ID;
			_data.cmtPocType = _getPocType();
			//_data.rate =

			var _atachList = [];

			$.each(_data.atachList, function(i, o) {
				var _params = {}
				_params.atachType = o.atachType;
				_params.atachValue = o.atachValue;

				if ('link_video' === o.atachType) {
					_params.atachThumbUrl = o.atachThumbUrl;
					_params.atachVideoTitle = o.atachVideoTitle;
					_params.atachVideoWidth = o.atachVideoWidth;
					_params.atachVideoHeight = o.atachVideoHeight;
				}

				_atachList.push(_params);
			});

			_data.atachList = _atachList;

			_setAttachParam({
				atachType: 'text',
				atachValue: $.trim(_textArea.val())
			});

			commentModel
				.deliver(function(d) {
					if ("0" === d.STATUS) {
						// 리뷰 일 경우 별점등록 추가처리
						if (CMT_TYPE_REVIEW === _data.type) {

							commentModel
								.modReviewRate({
									chnlSeq: _data.chnlSeq,
									contsRefValue: _data.contsRefValue,
									cmtSeq: _data.cmtSeq,
									rate: _data.rate
								});
						}

						ActionHandler.toast('수정 되었습니다.', function(){
							_printComment(_data);
							ActionHandler._closeActivePopup();
						});

						ActionHandler._setData(DATA_KEY_MODIFY, null);
					}
				})
				.updateCmt(_data);

		});
	},

	/**
	 * 삭제하기 버튼 이벤트 바인딩
	 *
	 * @param pData - 댓글 데이터
	 * @param pTarget - 바인딩 타켓
	 */
	_bindBtnRemove = function(pData, pTarget) {

		pTarget.on('click', function(e) {

			e.preventDefault();

			ActionHandler.confirm({
				message: '삭제하시겠습니까?다른 회원님들께서 작성하신 댓글도 함께 삭제됩니다.',
				callback: function(d) {
					if (d) {

						commentModel
							.deliver(function(d) {
								if ("0" === d.STATUS ){
									ActionHandler.toast('삭제 되었습니다.', function(){

									// 리스트 갱신 후 팝업 닫기
									_printComment({
										chnlSeq:pData.chnlSeq,
										contsRefValue: pData.contsRefValue,
										type:pData.type
									});

									ActionHandler._closeActivePopup();

										//pTarget.parents('li').fadeOut(100, function(){
										//pTarget.parents('li').remove();
										//});
									});
								}
							})

							.deleteCmt(pData);
					}
				}
			});
		});
	},

	/**
	 * 신고하기 버튼 이벤트 바인딩
	 *
	 * @param pData - 댓글 데이터
	 * @param pTarget - 바인딩 타켓
	 */
	_bindBtnReport = function(pData, pTarget) {

		var _tgtDom = $('#popupReport');

		pTarget.on('click', function(e) {
			this.blur();

			commentModel
				.deliver(function(d) {
					if ("0" === d.STATUS) {
						ActionHandler.toast('신고되었습니다.')
					}

					ActionHandler._closeActivePopup();
				})
				.insertReprt($.extend(pData, {
					reprtResonType: _tgtDom.find('input:checked').val()
				}));
		});
	},

	/**
	 * 추천/비추천 버튼 이벤트 바인딩
	 *
	 * @param pData - 댓글 데이터
	 * @param pTarget - 바인딩 타켓
	 */
	_bindBtnRecommend = function(pData, pTarget) {
		pTarget.on('click', function(e) {
			this.blur();

			if( !ActionHandler._confirmLogin() ) {
				return false;
			}

			if(pData.memberInfo.memberKey === getMemberKey()){
				ActionHandler.toast('본인이 작성한 글은 추천 또는 비추천할 수 없습니다.')
				return;
			}

			commentModel
				.deliver(function(d) {
					if ("0" === d.STATUS ){
						if (pData.nonRecmFlag) {
							ActionHandler.toast('비추천 되었습니다.')
						}
						else if ("0" === d.STATUS && !pData.nonRecmFlag) {
							ActionHandler.toast('추천 되었습니다.')
						}

						pTarget.text(Number(pTarget.text()) + 1);
					}
				})
				.insertRecm(pData);
		});
	},

	/**
	 * 답글 등록 버튼 이벤트 바인딩
	 *
	 * @param pData
	 * @param pTarget
	 */
	_bindBtnWriteReply = function(pData, pTarget) {
		var _tgtForm = $('textarea[name=cmtCont]');

		//덧글 글자수에 따른 팝업
		_tgtForm.on('keyup keydown', function(){
			if (200 < _tgtForm.val().length){
				_tgtForm.val(_tgtForm.val().substring(0, 200));
				ActionHandler.toast("최대 200자까지만 입력이 가능합니다.");
				return false;
			}
		});

		pTarget.on('click', function(e) {
			this.blur();

			if ('' === $.trim(_tgtForm.val())){
				ActionHandler.toast("내용을 입력해 주세요.");
				return false;
			}else if (3 > $.trim(_tgtForm.val()).length) {
				ActionHandler.toast("3자 이상의 글을 작성해 주세요.");
				return false;
			}else if( 200 >= _tgtForm.val().length ){

				commentModel
					.deliver(function(d) {
						_tgtForm.val('');

						if ('0' === d.STATUS) {

							ActionHandler.toast("등록되었습니다.", function(){
								//전체 삭제하지 말고 답글 카운트만 조정
								//_targetNodataDom.remove();
								var _memInfo = {replyMemInfo: d.result.memberInfo};
								var _ds = _drawReplyList($.extend(d.result, {
											parntCmtSeq: pData.cmtSeq,
											cmtSeq: d.result.adcmtInfo.cmtSeq,
											type: pData.type
										}, _memInfo));

								if (0 < _targetReplyListDom.children().length) {
									_targetReplyListDom.children(':first').before(_ds);
								}
								else {
									_targetReplyListDom.html(_ds);
									 $("#replyNodataArea").css("display","none");
								}
								
								// #replyNodataArea

								// 바닥 리스트 갱신
								//_printComment(pData);
								// 바닥 글의 덧글 카운트 조절
								_updateAdcmtCount(d.result.adcmtInfo.parntCmtSeq, true);

								//QQQ전체그리기..(팝업 닫은 후?)
							});
						}else if('605' === d.STATUS){
							//삭체된 글에 덧글 시도
							setTimeout(function(){
								ActionHandler._closeActivePopup();
							},1000);
						}
					})
					.insertAdcmt($.extend({
						parntCmtSeq: pData.cmtSeq,
						cmtCont: _tgtForm.val(),
						cmtPocType: _getPocType()
					}, pData));
			}
		});
	},

	_updateAdcmtCount = function(parntCmtSeq, bAdd){
		var tmpDom = _targetListDom.find('li[data-cmtSeq='+parntCmtSeq+']').find('.btn_reply');
		var cnt = parseInt(tmpDom.attr('data-cnt-reply')) + (bAdd? 1 : -1);
		tmpDom.attr('data-cnt-reply', cnt);
		tmpDom.text('답글 '+cnt);
	},

	_updateAllCmtCollBtn = function(){
		// 더보기 버튼 토글
		_targetListDom.find('.cont').each(function(i, o) {
			var _o = $(o);

			if (55 <= _o.find('.txt').height()) { //max height 60px로 되어 있음
				_o.removeClass('m_txt_open');
			}
			else {
				_o.parent().find('.txt_all_btn').remove();
			}
		});
	},

	/**
	 * 답글 삭제 버튼 이벤트 바인딩
	 *
	 * @param pData
	 * @param pTarget
	 */
	_bindBtnRemoveReply = function(pData, pTarget) {
		pTarget.on('click', function(e) {
			e.preventDefault();

			ActionHandler.confirm({
				message: '삭제하시겠습니까?',
				callback: function(d) {
					if (d) {
						commentModel
							.deliver(function(d) {
								if ("0" === d.STATUS ){
									ActionHandler.toast('삭제 되었습니다.', function(){
										pTarget.parents('li').fadeOut(100, function(){
											pTarget.parents('li').remove();
											if(0 === _targetReplyListDom.find("li").size()){
												$("#replyNodataArea").css("display","block");
											}
										});

										_updateAdcmtCount(d.result.parntCmtSeq, false);
									});
								}
							})
							.deleteAdcmt(pData);
					}
				}
			});
		});
	},

	_bindBtnPopupReportReply = function(pData, pTarget) {
		var _ab = new ActionBuilder();
		_ab.setActionType(ActionHandler.ACTION_TYPE_POPUP);
		_ab.setTarget('/comment/pop_report.html');
		_ab.setKey(DATA_KEY_REPORT);
		_ab.setCheckLogin('Y');
		_ab.setVisiblePre('Y');
		_ab.setScrollable('N');
		_ab.setJson(pData);
		_ab.bind(pTarget);
	},

	/**
	 * 첨부파일 액션 바인딩
	 */
	_bindAttachAction = function(pValue, pTarget) {

		var _ab = new ActionBuilder();

		// 한곡 재생
		if ('music_song' === pValue.atachType) {

			pTarget.on('click', function(e) {
				e.preventDefault();
				ActionHandler.confirm({
					message: '음악 재생을 위해 멜론 뮤직 앱으로 이동 하시겠습니까?',
					callback: function(d) {
						if (d) {
							AlbumAction.playSong(pValue.atachPropty.songId);
						}
					}
				});
			});
		}
		// 앨범 리스트 재생
		else if ('music_album' === pValue.atachType) {

			pTarget.on('click', function(e) {
				e.preventDefault();

				ActionHandler.confirm({
					message: '음악 재생을 위해 멜론 뮤직 앱으로 이동 하시겠습니까?',
					callback: function(d) {
						if (d) {
							AlbumAction.playAlbum( {
								albumId: pValue.atachPropty.albumId
							});
						}
					}
				});
			});
		}
		// 아티스트 페이지 이동
		else if ('music_artist' === pValue.atachType) {
			_ab.setActionType(ActionHandler.ACTION_TYPE_LINK);
			_ab.setTarget('artist.index');
			_ab.setJson({
				artistId: pValue.atachValue
			});
			_ab.bind(pTarget);
		}
		// 동영상 재생
		else if ('video' === pValue.atachType) {
			_ab.setActionType(ActionHandler.ACTION_TYPE_POPUP);
			_ab.setTarget('/common/pop_melon_viewer.html');
			_ab.setKey('common.melon.viewer');
			_ab.setJson({
				title: pValue.atachPropty.videoTitle,
				contsId: pValue.atachPropty.videoId,
				imageUrl: pValue.atachPropty.videoImagePath
			});
			_ab.bind(pTarget);
		}
		// 링크동영상 재생
		else if ('link_video' === pValue.atachType) {

			// 새창으로 열기 -> 앞에서 처리
//			pTarget.attr({
//				href: pValue.atachPropty.videoUrl,
//				target: '_blank'
//			});
		}
		// 사용자 이미지 보기
		else if ('image' === pValue.atachType) {
			_ab.setActionType(ActionHandler.ACTION_TYPE_POPUP);
			_ab.setTarget('/comment/pop_viewer.html');
			_ab.setKey(DATA_KEY_VIEWER);
			_ab.setJson({
				imageUrl: pValue.atachPropty.originalUrl
			});
			_ab.bind(pTarget);
		}
	},

	/**
	 * 이미지 첨부 버튼 이벤트 핸들링
	 */

	_bindBtnImageAttach = function(pData) {
		var _tgtDom = $('#attachGroup');
		var _btn = _tgtDom.find('.btn_opt2');

		_tgtDom.find('.btn_opt2').on('click', function(e) {
			this.blur();
				_tgtDom.find('input[type=file]').trigger('click');
		});

		_tgtDom.find('#uploadFile').on('change', function(e) {
			e.preventDefault();

			var _file = $(this), _cmtSeq = pData.chnlSeq, _isAllowd = false,
				_allowFiles = ["png", "jpg", "jpeg", "gif"];


			if (StringUtils.isEmpty(_file.val()) || _file.val().lastIndexOf(".") < 1) {
                ActionHandler.alert({
                	message: '올바르지 않은 파일 입니다.'
                });
                return false;
            }

            var fileExt = _file.val().substr(_file.val().lastIndexOf(".") + 1);

            for(var i in _allowFiles) {

            	if (fileExt.toLowerCase() === _allowFiles[i].toLowerCase()) {
					_isAllowd = true;
					break;
				}
            }

            if (!_isAllowd) {
            	ActionHandler.alert({
                	message: '올바르지 않은 파일 입니다.'
                });
            	return false;
            }

            // 파일 업로드
            var _filePath = _getUploadFilePath(getMemberKey());
            var _fileName = _getUploadFileName(_file.val());

            commentModel
            	.deliver(function(pData) {

            		//var _inTgtDom = $(".d_cmtpgn_atach_image_input"), _ds = [];
            		var _ds = [];

            		//if(!_addSubElem){
//	            		_ds.push('<iframe name="d_cmtpgn_atach_image_frame" style="display:none"></iframe>');
//	            		_ds.push('<input type="hidden" id="auth" name="auth" value="' + pData.authKey + '" />');
//	            		_ds.push('<input type="hidden" id="filePath" name="filePath" value="' + _filePath + '" />');
//	            		_ds.push('<input type="hidden" id="fileName" name="fileName" value="' + _fileName + '" />');
//	            		_ds.push('<input type="hidden" id="overWrite" name="overWrite" value="N" />');

            		_tgtDom.find('#auth').val(pData.authKey);
            		_tgtDom.find('#filePath').val(_filePath);
            		_tgtDom.find('#fileName').val(_fileName);
            		//}
                    //_tgtDom.attr("id", "uploadFile").attr("name", "uploadFile");
            		//_inTgtDom.closest("form").append(_ds.join('')).submit();
            		//_addSubElem = true;

            		_tgtDom.find('#imageUploadForm').submit();

            	})
            	.authUpload({
            		VOD: _fileName
            	});

		});

		// Iframe 콜백
        window._imageAtachUploadHandler = function(pData) {

        	if(undefined !== pData.STATUS && (0 === pData.STATUS || '0' === pData.STATUS)){
//        	if(undefined !== pData.STATUS && '0' === pData.STATUS){
				_attachMedia({
					type: 'image',
					data: {thumbUrl: 'http://'+ USER_IMAGE_HOST + pData.file},
					isToast: false});
        	}else{
        		//실패 메세지
        		setTimeout(function(){
        			ActionHandler.alert({
                    	message: '정상적으로 업로드를 할 수 없습니다.<br/>다시 시도해 주세요.'
                    });
        		},500);
        	}
        }
	},

	/**
	 * 업로드 파일명 생성
	 */
	_getUploadFileName = function(sourceFileName) {
        var now = new Date();
        var h = now.getHours(),
            hh = h < 10 ? "0" + h : h,
            m = now.getMinutes(),
            mm = m < 10 ? "0" + m : m,
            s = now.getSeconds(),
            ss = s < 10 ? "0" + s : s,
            ms = now.getMilliseconds(),
            mss = ms < 10 ? "000" + ms : (ms < 100 ? "00" + ms : (ms < 1000 ? "0" + ms : ms));
        var fileNameFormat = "hhmmss_ms";
        var targetFileName = fileNameFormat.replace(/hh/g, hh).replace(/mm/g, mm).replace(/ss/g, ss).replace(/ms/g, mss) + "." + sourceFileName.substr(sourceFileName.lastIndexOf(".") + 1);

        return targetFileName;
	}

	/**
	 * 업로드 파일경로 생성
	 *
	 * @param memberKey
	 * @returns {String}
	 */
	_getUploadFilePath = function (memberKey) {
        var now = new Date();
        var yyyy = now.getFullYear(),
            M = now.getMonth() + 1,
            MM = M < 10 ? "0" + M : M,
            d = now.getDate(),
            dd = d < 10 ? "0" + d : d;
        var datePathFormat = "yyyyMMdd";
        var datePath = datePathFormat.replace(/yyyy/g, yyyy).replace(/MM/g, MM).replace(/dd/g, dd);

        var memberPath = "";
        if (memberKey.length > 5) {
            memberPath = memberKey.substring(memberKey.length - 5);
        } else {
            if (memberKey.length > 4) {
                memberPath = "0" + memberKey.substring(memberKey.length - 4);
            } else {
                if (memberKey.length > 3) {
                    memberPath = "00" + memberKey.substring(memberKey.length - 3);
                } else {
                    if (memberKey.length > 2) {
                        memberPath = "000" + memberKey.substring(memberKey.length - 2);
                    } else {
                        if (memberKey.length > 1) {
                            memberPath = "0000" + memberKey.substring(memberKey.length - 1);
                        } else {
                            memberPath = "00000";
                        }
                    }
                }
            }
        }
        var memberPrePath = memberPath.substring(0, 3),
            memberPostPath = memberPath.substring(3, 5);
        var targetFilePath = "/" + datePath + "/" + memberPrePath + "/" + memberPostPath;
        return targetFilePath;
	},

	/**
	 * POC 타입 리턴
	 *
	 * @returns
	 */
	_getPocType = function() {
		return mstApp.isApp() ? CMT_POC_TYPE_MOBILE_APP : CMT_POC_TYPE_MOBILE_WEB;
	},

	/**
	 * 첨부파일 파라메터 설정
	 *
	 * atachType	String
	 *	- text/image/music_song/music_album/music_artist/video/link_video/link_genrl"
	 *	atachDsplyOrder	Number	전시 순서
	 *	atachValue	String
	 *	- text : 테스트 내용
	 *	- image : 원본이미지 URL (originalURL)
	 *	- music_song : SONG ID
	 *	- music_album : ALBUM ID
	 *	- music_artist : ARTIST ID
	 *	- video : 영상ID
	 *	- link_video : 영상URL (videoUrl)
	 *	- link_genrl : 링크URL (linkUrl)"
	 *
	 */
	_setAttachParam = function(pValue) {

		var _d, _tp, _txtCount = 0, _othCount = 0;

		if (CMT_MODE_W === _commentMode) {
			_tp = DATA_KEY_WRITE;
		}
		else if (CMT_MODE_U === _commentMode) {
			_tp = DATA_KEY_MODIFY;
		}

		_d = $.extend({}, ActionHandler._getData(_tp));

		if (undefined === _d.atachList) {
			_d.atachList = [];
		}

		$.each(_d.atachList, function(i, o) {
			// 텍스트 1건, 그외 1개의 첨부파일만 허용
			if (undefined !== o) {
				if('text' === o.atachType) {
					_txtCount ++;
				}
				else {
					_othCount ++;
				}
			}
		});

		if ('text' === pValue.atachType) {

			// 텍스트 등록 건수 체크
			//if (1 < _txtCount) {
			if (0 < _txtCount) {
				$.each(_d.atachList, function(i, o) {
					// 텍스트 1건, 그외 1개의 첨부파일만 허용
					if (undefined !== o && 'text' === o.atachType) {
						_d.atachList.splice(i, 1);
					}
				});
			}
			pValue.atachDsplyOrder = 1;//무조건 text는 1
			_d.atachList.push(pValue);
		}
		else {
			//if (1 < _othCount) {
			if (0 < _othCount) { //무조건 지우고 추가 -> 아래서 한개만 추가 하도록 한다 QQQ
				$.each(_d.atachList, function(i, o) {
					// 텍스트 1건, 그외 1개의 첨부파일만 허용
					if (undefined !== o && 'text' !== o.atachType) {
						_d.atachList.splice(i, 1);
					}
				});
			}
			pValue.atachDsplyOrder = 2;//무조건 2
			_d.atachList.push(pValue);
		}

		ActionHandler._setData(_tp, _d);
	},

	/**
	 * 첨부파일 파라메터 초기화
	 *
	 * @param
	 */
	_resetAttachParam = function() {
		var _d, _tp;

		if (CMT_MODE_W === _commentMode) {
			_tp = DATA_KEY_WRITE;
		}
		else if (CMT_MODE_U === _commentMode) {
			_tp = DATA_KEY_MODIFY;
		}

		_d = $.extend({}, ActionHandler._getData(_tp));

		if (JsonUtils.isNotEmpty(_d.atachList)) {
			$.each(_d.atachList, function(i, o) {
				_d.atachList.splice(i, 1);
			});
		}

		ActionHandler._setData(_tp, _d);
	},

	/**
	 * 미디어 검색
	 *
	 * @param pOption
	 * @returns
	 */
	_searchMedia = function(pOption) {

		var _ky = $('#srchWord').val(),
			_ty = $('.list_search_tab li.on').data('search-type'),
			_st = $('input[name="sortType"]:checked').val();

		this.getTargetDom = function(pType) {

			var _tgtDom;

			if ('song' === pType) {
				_tgtDom = $('.list_search_music');
			}
			else if ('album' === pType) {
				_tgtDom = $('.list_search_album');
			}
			else if ('artist' === pType) {
				_tgtDom = $('.list_search_artist');
			}
			else if ('video' === pType) {
				_tgtDom = $('.list_search_movie');
			}

			return _tgtDom;
		}

		// 값이 존재하지 않을경우 동영상으로 설정 (임시)
		if (undefined ===  _ty) {
			_ty = 'video';
		}


		// API 호출용 파라메터 조합
		var _param = $.extend({
				pocId: POC_ID,
				cmtPocType: _getPocType(),
				srchWord: _ky,
				musicType: _ty,
				sortType: _st,
				pageNo: 1,
				pageSize: 10
			}, undefined === pOption ? {} : pOption);

		//키워드 있는 경우.
		if(_ky === undefined || _ky.length === 0){
			return;
		}
		commentModel
			.deliver(function(d) {

				if ("0" !==  d.STATUS) { return false;}

				//첫페이지에서 데이터 모두 지움
				if(d.result.totalCnt === 0 || d.result.pageInfo.pageNo === 1){
					var _td = getTargetDom(_ty);
					_td.empty();
					//if (0 === d.result.musicList.length) {
					if(d.result.pageInfo.totalCnt === 0){
						$('.box_no_resultant').show();
						$('#nodata').html('검색 결과가 없습니다.');
						return false;
					}
					else {
						$('.box_no_resultant').hide();
					}
				}

				var _ds = [], _tgtDom;
				$.each(d.result.musicList, function(i, o) {

					var _dsSub = [];

					if ('song' === _ty) {
						_dsSub.push('<li>');
						_dsSub.push('<div class="thumb"><img src="'+o.albumImageDsplyPath+'" alt="'+o.songName+'" />');
						if(o.adultFlag!==undefined && o.adultFlag == true){
							_dsSub.push('<span class="ico_comm ico_age_ban">19금</span>');
						}
						_dsSub.push('</div>');
						_dsSub.push('<div class="txt">');
						_dsSub.push('<div class="t">'+unescape(o.songName)+'</div>');
						_dsSub.push('<div class="n">'+unescape(o.artistName)+'</div>');
						_dsSub.push('</div>');
						_dsSub.push('<div class="btn"><button>첨부</button></div>');
						_dsSub.push('</li>');
					}
					else if ('album' === _ty) {
						_dsSub.push('<li>');
						_dsSub.push('<div class="thumb"><img src="'+o.albumImageDsplyPath+'" alt="'+o.albumName+'" /></div>');
						_dsSub.push('<div class="txt">');
						_dsSub.push('<div class="t">'+o.albumName+'</div>');
						_dsSub.push('<div class="n">'+o.artistName+'</div>');
						_dsSub.push('<div class="d">'+o.dsplyIssueDate+'</div>');
						_dsSub.push('</div>');
						_dsSub.push('<div class="btn"><button>첨부</button></div>');
						_dsSub.push('</li>');
					}
					else if ('artist' === _ty) {
						var _etcInfos = [];
						if (StringUtils.isNotEmpty(o.nationalityName)) {
							_etcInfos.push(o.nationalityName);
						}
						if (StringUtils.isNotEmpty(o.sex)) {
							_etcInfos.push(o.sex);
						}
						if (StringUtils.isNotEmpty(o.actTypeName)) {
							_etcInfos.push(o.actTypeName);
						}

						_dsSub.push('<li>');
						if (StringUtils.isEmpty(o.artistImageDsplyPath)) {
							_dsSub.push('<div class="thumb"></div>');
						}
						else {
							_dsSub.push('<div class="thumb"><img src="'+o.artistImageDsplyPath+'" alt="'+o.artistName+'" /></div>');
						}

						_dsSub.push('<div class="txt">');
						_dsSub.push('<div class="t">'+o.artistName+'</div>');
						_dsSub.push('<div class="m">'+_etcInfos.join(' / ')+'<br />'+o.gnr+'</div>');
						_dsSub.push('</div>');
						_dsSub.push('<div class="btn"><button>첨부</button></div>');
						_dsSub.push('</li>');
					}
					else if ('video' === _ty) {

						_dsSub.push('<li>');
						_dsSub.push('<div class="thumb">');
                        _dsSub.push('<img src="'+o.videoImageDsplyPath+'" alt="'+o.videoTitle+'" />');
                        if (o.videoAdultFlag) {
                        	_dsSub.push('<span class="ico_comm ico_age_ban">19금</span>');
                        }
                        _dsSub.push('<span class="ico_comm ico_mvplay_big">동영상</span>');
                        _dsSub.push('<span class="time">'+o.dsplyPlayTime+'</span>');
                        _dsSub.push('</div>');
                        _dsSub.push('<div class="txt">');
                        _dsSub.push('<div class="t">'+o.videoTitle+'</div>');
                        _dsSub.push('<div class="n">'+o.artistName+'</div>');
                        _dsSub.push('<div class="d">'+o.dsplyVideoIssueDate+'<span class="view"><span class="ico_comm ico_eye"></span>'+o.videoViewCnt+'</span></div>');
                        _dsSub.push('</div>');
                        _dsSub.push('<div class="btn"><button>첨부</button></div>');
                        _dsSub.push('</li>');
					}

					_dsSub = $(_dsSub.join(''));

					_dsSub.find('button')
						.on('click', function(){
							this.blur();
						})
						.data(o);

					_ds.push(_dsSub);
				});

				_tgtDom = getTargetDom(_ty);

				// 마지막 페이지 여부 설정
				if (!_tgtDom.data('isEnd') && (_tgtDom.data('totalCnt') == (_tgtDom.children().length + d.result.musicList.length))) {
					_tgtDom.data('isEnd', true);
				}

				// 최초 페이지 로딩일 경우
				if (1 === _param.pageNo) {

					_tgtDom.html(_ds).show();

					// 전체 리스트 크기 설정
					_tgtDom.data('totalCnt', d.result.pageInfo.totalCnt);
					// pgsize 추가
					_tgtDom.data('pgSize', d.result.pageInfo.pageSize);

					// 마지막 여부 체크 해제
					_tgtDom.data('isEnd', false);
					
					//more function 에서 ActionHandler.IS_POP=true 인 경우 return 함, 미디어 검색결과 더보기 가능하도록 IS_POP=false 로 세팅 
					ActionHandler.IS_POP = false ;

					// 하단 스크롤 근접시 더보기
					ActionHandler.more({
						target: '.layer_content',
						callback: function() {
							var _tgtDom, _opt = $('.layer_content').data('option');

							_tgtDom = getTargetDom(_opt.musicType);

							if (!_tgtDom.data('isEnd')){
								// 더보기 리스트 추가
								_opt.pageNo ++;
								_searchMedia(_opt);
							}

							if ('N' !== _tgtDom.parents('#wrap').data('active') && _tgtDom.data('isEnd')) {
								ActionHandler.toast('마지막 데이터 입니다.');
							}
						}
					});
				}
				// 이후 페이지 추가
				else {
					_tgtDom.append(_ds);
				}

				$('.layer_content').data('option', _param);

				// 첨부버튼 이벤트핸들링
				$('.list_search').find('.btn button').on('click', function(){

					var _t = $('.list_content'), _da = $(this).data();

					_attachMedia({
						type: _ty,
						data: _da,
						isToast: true});
				});

			})
			.listMusic(_param);
	},

	/**
	 * 콘텐츠 첨부
	 *
	 * pValue.type - 첨부유형
	 * pValue.data - 데이터
	 * pValue.isToast - 첨부후 토스트 여부
	 */
	_attachMedia = function(pValue) {

		var _t = $('.list_content'), _im = '', _cl = '', _at = '', _id = '', _ll = [], _ul = [];

		_da = pValue.data;

		if ('link_video' === pValue.type) {
			_ul.push('<li class="mov">');
			_ul.push('<span class="img"><img src="'+_da.thumbUrl+'" alt="'+_da.videoTitle+'"><span class="ico_comm ico_mvplay"></span></span>');
			_ul.push('<span class="ct">');
			_ul.push('<span class="t">'+_da.videoTitle+'</span>');
			_ul.push('</span>');
			_ul.push('<button class="btn_comm btn_n_close">삭제</button>');
			_ul.push('</li>');

			// 파라메터 설정
			_setAttachParam({
				atachType: 'link_video',
				atachValue: _da.videoUrl,
				atachThumbUrl: _da.thumbUrl,
				atachVideoTitle: _da.videoTitle,
				atachVideoWidth: _da.videoWidth,
				atachVideoHeight: _da.videoHeight,
			});
		}
		else {

			if ('song' === pValue.type || 'music_song' === pValue.type) {
				_ll.push('<span class="ct">');
				_ll.push('<span class="t">'+_da.songName+'</span>');
				_ll.push('<span class="x">'+_da.artistName+'</span>');
				_ll.push('</span>');

				_cl = 'music';
				_at = 'music_song';

				_id = _da.songId;
				_im = _da.albumImagePath;
			}
			else if ('album' === pValue.type || 'music_album' === pValue.type) {
				_ll.push('<span class="ct">');
				_ll.push('<span class="t">'+_da.albumName+'</span>');
				_ll.push('<span class="n">'+_da.artistName+'</span>');
				_ll.push('<span class="d">'+_da.dsplyIssueDate+'</span>');
				_ll.push('</span>');

				_cl = 'album';
				_at = 'music_album';

				_id = _da.albumId;
				_im = _da.albumImagePath;
			}
			else if ('artist' === pValue.type || 'music_artist' === pValue.type) {
				var _ds = [];
				if ('' !== _da.nationalityName) {
					_ds.push(_da.nationalityName);
				}
				if ('' !== _da.sex) {
					_ds.push(_da.sex);
				}
				if ('' !== _da.actTypeName) {
					_ds.push(_da.actTypeName);
				}

				_ll.push('<span class="ct">');
				_ll.push('<span class="t">'+_da.artistName+'</span>');
				_ll.push('<span class="x">'+_ds.join('/')+'<br/>'+_da.gnr+'</span>');
				_ll.push('</span>');

				_cl = 'artist';
				_at = 'music_artist';

				_id = _da.artistId;
				_im = _da.artistImagePath;
			}
			else if ('video' === pValue.type) {
				_ll.push('<span class="ct">');
				_ll.push('<span class="t">'+_da.videoTitle+'</span>');
				_ll.push('<span class="n">'+_da.artistName+'</span>');
				_ll.push('<span class="d">'+_da.dsplyVideoIssueDate+'<span class="view"><span class="ico_comm ico_eye"></span>'+_da.videoViewCnt+'</span></span>');
				_ll.push('</span>');

				_cl = 'mov';
				_at = 'video';

				_id = _da.videoId;
				_im = _da.videoImagePath;
			}
			else if ('image' === pValue.type) {
				_cl = 'photo';
				_at = 'image';

				_id = _da.thumbUrl;
				_im = _da.thumbUrl;
			}

			_ul.push('<li class="'+_cl+'">');
//			_ul.push('<span class="img"><img src="'+_im+'" alt="">');
			_ul.push('<span class="img">');
			if(_im !== ""){
				_ul.push('<img src="'+_im+'" alt="">');
			}

			// 이미지 첨부가 아닐 경우 플레이 아이콘 추가
			if ('image' !== pValue.type) {
				_ul.push('<span class="ico_comm ico_mvplay"></span>');
				if('video' === pValue.type && pValue.data.videoAdultFlag == true){
					_ul.push('<span class="ico_comm ico_age_ban">19금</span>');
				}else if(('song' === pValue.type||'music_song' === pValue.type) && pValue.data.adultFlag == true){
					_ul.push('<span class="ico_comm ico_age_ban">19금</span>');
				}
			}
			_ul.push('</span>');
			_ul.push(_ll.join(''));
			_ul.push('<button class="btn_comm btn_n_close">삭제</button>');
			_ul.push('</li>');

			// 파라메터 설정
			_setAttachParam({
				atachType: _at,
				atachValue: _id,
			});
		}

		_ul = $(_ul.join(''));
		_ul.addClass(_cl);
		_ul.find('button.btn_n_close').on('click', function(){

			ActionHandler.confirm({
				message: '삭제하시겠습니까?',
				callback: function(d) {
					if(d){
						_t.children().remove();

						// 첨부파일 파라메터 초기화
						_resetAttachParam();
					}
				}
			});

		});

		_t.html(_ul);

		if (true === pValue.isToast) {
			ActionHandler.toast("첨부되었습니다.", function(){
				ActionHandler._closeActivePopup();
			});
		}
	},

	/**
	 * 댓글 초기화
	 */
	_init = function(pData) {

		// 리스트 출력용 Dom
		if (StringUtils.isNotEmpty(pData.targetListSelector)) {
			_targetListDom = $(pData.targetListSelector);
		}

		// 댓글쓰기 바인딩 Dom
		if (StringUtils.isNotEmpty(pData.targetWriteSelector)) {
			_targetWriteDom = $(pData.targetWriteSelector);

			// 댓글팝업 이벤트 바인딩
			_bindBtnPopupWrite(pData, _targetWriteDom);
		}

		// 댓글 카운트 표시 Dom
		if (StringUtils.isNotEmpty(pData.targetCountSelector)) {
			_targetCountDom = $(pData.targetCountSelector);
		}

		// 댓글 데이터 없음 영역 Dom
		if (StringUtils.isNotEmpty(pData.targetNodataSelector)) {
			_targetNodataDom = $(pData.targetNodataSelector);
		}

		// 리뷰 평점 표시영역 Dom
		if (StringUtils.isNotEmpty(pData.targetStarPointSelector)) {
			_targetStarPointDom = $(pData.targetStarPointSelector);
		}

		//상품후기 콘텐츠 dom
		if (StringUtils.isNotEmpty(pData.targetReviewContsSelector)){
			_targetReviewContsDom = $(pData.targetReviewContsSelector);
		}

		_printComment(pData);
	},

	/**
	 * 기대평 초기화
	 */
	_initEvelue = function(pData) {
		_init($.extend({
			chnlSeq: CMT_CHNL_EVALUE,
			contsRefValue: ActionHandler._getData().prodId,
			type: CMT_TYPE_EVALUE
		}, pData));

		//Pv
		PvModel.sendPvEx('prod.brd.exp',{prodid:ActionHandler._getData().prodId});
	},

	/**
	 * 리뷰 초기화
	 */
	_initReview = function(pData) {
		_init($.extend({
			chnlSeq: CMT_CHNL_REVIEW,
			contsRefValue: ActionHandler._getData().prodId,
			type: CMT_TYPE_REVIEW
		}, pData));
	},

	/**
	 * Qna 초기화
	 */
	_initQna = function(pData) {
		_init($.extend({
			chnlSeq: CMT_CHNL_QNA,
			contsRefValue: ActionHandler._getData().prodId,
			type: CMT_TYPE_QNA
		}, pData));

		//Pv
		PvModel.sendPvEx('prod.brd.qna',{prodid:ActionHandler._getData().prodId});
	},

	/**
	 * 이벤트 댓글 초기화
	 */
	_initEvent = function(pData) {
		_init($.extend({
			chnlSeq: CMT_CHNL_EVENT,
			contsRefValue: ActionHandler._getData('event.detail').eventId,
			type: CMT_TYPE_EVENT
		}, pData));
	},

	/**
	 * 프로모션 댓글 초기화
	 */
	_initPromotion = function(pData) {
		_init($.extend({
			chnlSeq: CMT_CHNL_EVENT,
			contsRefValue: ActionHandler._getData('promotion.index').eventId,
			type: CMT_TYPE_EVENT
		}, pData));
	},

	/**
	 * 신고하기 팝업 초기화
	 *
	 * @param pData
	 */
	_initPopupReport = function() {
		var _tgtDom = $('#popupReport'),
			_data = ActionHandler._getData(DATA_KEY_REPORT);

		// 닉네임 설정
		_tgtDom.find('#memberNicknameArea').text(_data.memberNickname);

		// 항목 선택시 Blur
		_tgtDom.find('input').on('click', function(e) {
			this.blur();
		});
		
		_tgtDom.find('.close').on('click', function(e) {
			$('html').removeClass('layer_html_control');//바닥화면 스크롤 방지 제거
			$('body').removeClass('layer_html_control');
		});
		
		// 확인버튼 이벤트 핸들링
		_bindBtnReport(_data, _tgtDom.find('#btnReportOk'));
	},

	/**
	 * 답글등록 팝업 초기화 -> popup html에서 직접 호출
	 *
	 * @param pData
	 */
	_initPopupReply = function(pData) {
		var _data = ActionHandler._getData(DATA_KEY_DETAIL);

		// 댓글 상세영역 Dom
		if (StringUtils.isNotEmpty(pData.targetCommentDetailSelector)) {
			_targetCommentDetailDom = $(pData.targetCommentDetailSelector);
		}

		// 덧글 리스트영역 Dom
		if (StringUtils.isNotEmpty(pData.targetReplyListSelector)) {
			_targetReplyListDom = $(pData.targetReplyListSelector);
		}

		// 댓글 데이터 없음 영역 Dom
		if (StringUtils.isNotEmpty(pData.targetNodataSelector)) {
			_targetNodataDom_reply = $(pData.targetNodataSelector);
		}

		// 답글 등록 버튼 Dom
		if (StringUtils.isNotEmpty(pData.targetReplyWriteSelector)) {
			_targetReplyWriteDom = $(pData.targetReplyWriteSelector);

			// 답글 등록 버튼 이벤트 바인딩
			_bindBtnWriteReply(_data, _targetReplyWriteDom);
		}

		ActionHandler.IS_POP = true;

		// 상세정보 호출
		commentModel
			.deliver(function(pData) {
				var _param = $.extend({
					chnlSeq: _data.chnlSeq,
					contsRefValue: _data.contsRefValue,
					memberNickname: escape(_data.memberNickname),
					cmtSeq: _data.cmtSeq,
					type: _data.type,
					isReply: true
				}, pData.result);
				
				// 댓글 상세영역 표시
				_targetCommentDetailDom.html(_drawComment(_param));

				// 글없음 영역 표시
				_drawNodataArea_reply(pData.result.adcmtList);

				// 덧글 리스트 출력
				var _ds = [];

				$.each(pData.result.adcmtList, function(i, o) {
					var _memInfo = {replyMemInfo: pData.result.adcmtList[i].memberInfo};
					_ds.push(_drawReplyList($.extend(o, _data,_memInfo)));
				});

				_targetReplyListDom.html(_ds);

			})
			.informCmt($.extend(_data, {adcmtListFlag: true}));
	},

	/**
	 * 댓글쓰기 팝업 초기화
	 *
	 * @param pData
	 */
	_initPopupWrite = function(pData) {
		var _textArea = $('#textReply'),
			_data = $.extend({}, ActionHandler._getData(DATA_KEY_WRITE));

		var _maxlength = _getMaxLength(_data.type);
		ActionHandler.IS_POP = true;

		_textArea.on('keyup keydown paste', function(){
			setTimeout(function () {	// paste Event 
				if (_maxlength < _textArea.val().length) {//1000 or 500
					ActionHandler.toast(_maxlength+'자까지 입력 가능합니다.');
					//id:0026820
					//2016-03-09 1000자이상 계속 입력되어서 수정.
					_textArea.val(_textArea.val().substring(0, _maxlength));
					return false;
				}
				$('.date em').text(_textArea.val().length);
			  }, 100);
			
//			if (_maxlength < _textArea.val().length) {//1000 or 500
//				ActionHandler.toast(_maxlength+'자까지 입력 가능합니다.');
//				//id:0026820
//				//2016-03-09 1000자이상 계속 입력되어서 수정.
//				_textArea.val(_textArea.val().substring(0, _maxlength));
//				return false;
//			}
//			$('.date em').text(_textArea.val().length);
		});

		ActionHandler.addEvent(document);

		// 작성모드 수정으로 설정
		_commentMode = CMT_MODE_W;

		// 리뷰일 경우 별점 추가처리
		if (CMT_TYPE_REVIEW === _data.type) {
			_drawStarBox(CMT_MODE_W);
		}
		// 기대평 클래스 추가
		else if (CMT_TYPE_EVALUE === _data.type) {
			$('.wrap_write').addClass('single02');
		}
		// QNA 클래스 추가
		else if (CMT_TYPE_QNA === _data.type){
			$('.wrap_write').addClass('single01');
			//	Q&A 등록화면은 파일첨부 비노출로인해 padding-bottom:112px 제거
			$('[data-id^=mtkpopup]:last').attr('style','');
		}

		// 파일첨부 QNA 제외 노출
		if (CMT_TYPE_QNA !== _data.type) {
			// 이미지 파일첨부 이벤트 바인딩
			_bindBtnImageAttach(_data);

			$('[id^=attachGroup]').show();
		}

		// 타이틀 설정
		_drawPopupTitle(_data.type);

		// 등록버튼 이벤트 바인딩
		_bindBtnWrite(_data, $('#btnCommentWrite'));

		//가상키보드 보이기
		$('#textReply').focus();
		
		$(window).bind('touchmove', function(e) {
			$('#textReply').blur();
        });
//		$(window).bind('touchstart', function(e) {
//			if (e.target.tagName != 'TEXTAREA') {
//				$('#textReply').blur();
//			}
//        });

	},

	/**
	 * 수정팝업 초기화
	 *
	 * @param pData
	 */
	_initPopupModify = function(pData) {

		var _data = $.extend({}, ActionHandler._getData(DATA_KEY_MODIFY));

		// 작성모드 수정으로 설정
		_commentMode = CMT_MODE_U;

		// 리뷰일 경우 별점 추가처리
		if (CMT_TYPE_REVIEW === _data.type) {
			_drawStarBox(CMT_MODE_U);
		}
		// 기대평 클래스 추가
		else if (CMT_TYPE_EVALUE === _data.type) {
			$('.wrap_write').addClass('single02');
		}
		// QNA 클래스 추가
		else if (CMT_TYPE_QNA === _data.type){
			$('.wrap_write').addClass('single01');
		}

		// 파일첨부 QNA 제외 노출
		if (CMT_TYPE_QNA !== _data.type) {
			// 이미지 파일첨부 이벤트 바인딩
			_bindBtnImageAttach(_data);

			$('[id^=attachGroup]').show();
		}

		ActionHandler.IS_POP = true;

		// 타이틀 설정
		_drawPopupTitle(_data.type);

		// 수정버튼 이벤트 바인딩
		_bindBtnModify(_data, $('#btnCommentModify'));

		//가상키보드 보이기
		$('#textReply').focus();

		// 상세정보 호출
		commentModel
			.deliver(function(pData) {
				var _maxlength = _getMaxLength(_data.type);
				var _textArea = $('#textReply'),
					_cntInfo = pData.result.cmtInfo,
					_attachList = pData.result.atachList;

				_textArea.val(_cntInfo.cmtCont);
				_textArea.on('keyup keydown', function(){
					if (_maxlength < _textArea.val().length) {
						ActionHandler.toast(_maxlength+'자까지 입력 가능합니다.');
						_textArea.val(_textArea.val().substring(0, _maxlength));
						return false;
					}

					$('.date em').text(_textArea.val().length);
				});

				if (JsonUtils.isNotEmpty(_cntInfo)) {
					$.each(_attachList, function(i, o) {

						// 텍스트를 제외한 첨부파일 출력
						if ('text' !== o.atachType) {
							_attachMedia({
								type: o.atachType,
								data: o.atachPropty,
								isToast: false});
						}
					});
				}

			})
			.informCmt($.extend(_data, {adcmtListFlag: true}));
	},

	/**
	 * Youtube 팝업 초기화
	 */
	_initPopupOembed = function() {
//		$('#srchWord').on('blur', function(){

//			commentModel
//				.deliver(function(d) {
//					var _b = $('#btnOk');
//
//					if ("0" === d.STATUS) {
//						_b.addClass('on');
//						_b.data(d.result);
//						_b.attr('disabled', false);
//					}
//					else {
//						_b.removeClass('on');
//						_b.attr('disabled', true);
//					}
//				})
//				.informOembed({
//					pocId: POC_ID,
//					cmtPocType: _getPocType(),
//					youtubeUrl: $(this).val()
//				});
//		});

		$('#btnOk').on('click', function(){
			//this.blur();

			var _o = $(this), _da = $('#srchWord').val();
			var _ex = /youtube\.com/ig;
			var _ex2 = /youtu\.be/ig;

			if('' === _da){
				setTimeout(function(){
					ActionHandler.alert({
	                	message: 'http:// 를 포함한 링크주소를 입력하세요'
	                })
				}
				, 500);
			}
			else if(! _ex.test(_da) && !_ex2.test(_da) ){
				setTimeout(function(){
					ActionHandler.alert({
	                	message: '링크 첨부는 유튜브 영상 링크만 가능합니다.'
	                })
				}
				, 500);
			}else{

				commentModel
				.deliver(function(d) {
					var _b = $('#btnOk');
					var _data = d.result;
					if ("0" === d.STATUS) {
//						_b.addClass('on');
//						_b.data(d.result);
//						_b.attr('disabled', false);

						_attachMedia({
							type: 'link_video',
							data: _data,
							isToast: true});
					}
					else {
//						_b.removeClass('on');
//						_b.attr('disabled', true);
					}
				})
				.informOembed({
					pocId: POC_ID,
					cmtPocType: _getPocType(),
					youtubeUrl: _da
				});
			}
		});
	},

	/**
	 * 콘텐츠 검색 팝업 초기화
	 */
	_initPopupSearch = function() {
		// 검색버튼 핸들링
		$('.btn_search').on('click', function() {
			if($('#srchWord').val().trim() === ''){
				ActionHandler.toast('검색어를 입력해 주세요.');
				return;
			}
			_searchMedia({pageNo: 1});
		});

		// 탭선택 핸들링
		$('.list_search_tab li').on('click', function(){
			var _o = $(this), _tgtDom = _o.data('target');

			_o.parents('ul').find('li').removeClass('on');
			_o.addClass('on');

			$('.list_search').hide();
			$('.'+_tgtDom).show();

			_searchMedia({pageNo: 1});
		});

		// 정렬 방법 선택
		$('input[name="sortType"]').on('click', function() {
			_searchMedia();
		});

		// 입력텍스트 삭제
		$('.btn_search_delete').on('click', function(e){
			$('#srchWord').val('').focus();
		});

		// 입력박스 엔터처리
		$('#srchWord').on('keydown', function(e) {
			if (13 === e.keyCode) {
				if($('#srchWord').val().trim() === ''){
					ActionHandler.toast('검색어를 입력해 주세요.');
					return;
				}
				_searchMedia({pageNo: 1});
			}
		});

		$('#srchWord').val('').focus();
	},

	/**
	 * 사용자 이미지 보기 초기화
	 */
	_initPopupViewer = function() {
		var _tgtDom = $('#imageArea'),
			_data = ActionHandler._getData(DATA_KEY_VIEWER);

		_tgtDom.attr({
			src: _data.imageUrl
		});
	},

	//QQQ 전체 다시 그리기
	_invalidate = function(data){
		var _data = data;
		_printComment({
			chnlSeq: _data.chnlSeq,
			contsRefValue: _data.contsRefValue,
			type: _data.type
		});

		ActionHandler._closeActivePopup();
		ActionHandler._setData(DATA_KEY_WRITE, null);
	}



	return {
			init: function() {
				_init();
			},

			initEvelue: function(pData) {
				_initEvelue(pData);
			},

			initReview: function(pData) {
				_initReview(pData);
			},

			initQna: function(pData) {
				_initQna(pData);
			},

			initEvent: function(pData) {
				_initEvent(pData);
			},

			initPromotion: function(pData) {
				_initPromotion(pData);
			},

			initPopupReport: function() {
				_initPopupReport();
			},

			initPopupReply: function(pData) {
				_initPopupReply(pData);
			},

			initPopupWrite: function(pData) {
				_initPopupWrite(pData);
			},

			initPopupModify: function(pData) {
				_initPopupModify(pData);
			},

			initPopupOembed: function() {
				_initPopupOembed();
			},

			initPopupSearch: function() {
				_initPopupSearch();
			},

			initPopupViewer: function() {
				_initPopupViewer();
			}
	};
});