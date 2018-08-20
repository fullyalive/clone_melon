/**
 * 상품 상세 화면 구성 Action
 */
define(['model/performance.model',
        'model/coupon.model',
        'model/artist.model',
        'model/place.model',
        'model/offer.model',
        'model/foru.model',
        'action/album.action',
        'action/offer.action',
        'action/performance.action',
        'action/comment.action',
        'action/reserve.action',
        'util/stringUtils',
        'util/jsonUtils',
        'util/imageUtils',
		'model/pv.model'],
function(PerformanceModel,
		CouponModel,
		ArtistModel,
		PlaceModel,
		OfferModel,
		ForuModel,
		AlbumAction,
		OfferAction,
		PerformanceAction,
		CommentAction,
		ReserveAction,
		StringUtils,
		JsonUtils,
		ImageUtils,
		PvModel) {

	var performanceModel = new PerformanceModel();
	var artistModel = new ArtistModel();
	var couponModel = new CouponModel();
	var placeModel = new PlaceModel();
	var offerModel = new OfferModel();
	var foruModel = new ForuModel();

	/** 인증 타입 - 실명인증 */
	var AUTH_TYPE_REAL = 'charge';//본인인증
	/** 인증 타입 - 성인인증 */
	var AUTH_TYPE_ADULT = 'juvenileProtection';

	var HOST_CDN = "cdnticket.melon.co.kr";

	var detailData = null;
	var dfd_detail = null;
	var dfd_setlist = null;
	var _gateValidateChk =  null;
	var cupnClickCnt = 0; // 제휴 쿠폰 발급 버튼 클릭횟수

	/**
	 * 패키지 정보 Dom 구성
	 *
	 * @param pData - 상품 데이터
	 */
	var _drawPackageInfo = function(pData) {

		if (JsonUtils.isEmpty(pData)) {
			return false;
		}

		var _ds = [], _tgtDom = $('#box_package_performance');

		$.each(pData.packageList, function(i, o) {

			var _dsSub = [], _pl = [], _ab, _img;

			if (StringUtils.isNotEmpty(o.placeName)) {
				_pl.push(o.placeName);
			}

			if (StringUtils.isNotEmpty(o.availPlaceInfo)) {
				_pl.push(o.availPlaceInfo);
			}

			_img = ImageUtils.getPosterImage(o.posterImg);
			_img.setAlt(o.title);

			_dsSub.push('<li>');
			_dsSub.push('<a href="#action">');
			_dsSub.push('<span class="img">'+ _img.toString() +'</span>');
			_dsSub.push('<span class="txt">');
			_dsSub.push('<strong class="tit">'+o.title+'</strong>');
			_dsSub.push('<em class="data">'+o.periodInfo+'</em>');
			_dsSub.push('<em class="area">'+_pl.join(' ')+'</em>');
			_dsSub.push('</span>');
			_dsSub.push('</a>');
			_dsSub.push('<li>');

			_dsSub = $(_dsSub.join(''));

			_ab = new ActionBuilder();
			_ab.setActionType(ActionHandler.ACTION_TYPE_LINK);
			_ab.setTarget('performance.index');
			_ab.setJson({
				prodId: o.prodId
			});
			_ab.bind(_dsSub.find('a'));

			_ds.push(_dsSub);
		});

		_tgtDom.find('#list_concert_thumb').html(_ds);
		_tgtDom.show();
	},

	/**
	 * 기본가 영역 Dom 구성
	 *
	 * @param pData - 상품데이터
	 */
	_drawBasePrice = function(pData) {

		var _ds = [], _tgtDom = $('#list_seat'), _saleBtn = $('#salePriceBtn'), _intrBtn = $('#interestBtn'), _ab;

		if (StringUtils.isNotEmpty(pData.basePrice)) {
			_ds.push('<div class="list_seat"></div>');
			_ds = $(_ds.join(''));
			_ds.html(pData.basePrice);

			_tgtDom.replaceWith(_ds);
		}
		else {
			var _seatJson = JSON.parse(pData.seatGradeJson).data;

			$.each(_seatJson.list, function(i, o) {
				_ds.push('<li>');
				_ds.push('<span class="seat_color" style="background-color:'+ o.gradeColorVal +';"></span>');
				_ds.push('<span class="seat_name">'+ o.seatGradeName +'</span>');
				_ds.push('<span class="price">'+ StringUtils.numberFormat(o.basePrice) +'원</span>');
				_ds.push('</li>');
			});

			_tgtDom.html(_ds.join(''));
		}

		// 예매가능 스케줄이 있는경우
		if(pData.isTicketing == 'Y'){
			$.each(pData.gradelist, function(i, o) {
				$.each(o.priceList, function(ia, oa) {

					if(oa.priceNo != '10067'){	// 상용기준 기본가 권종코드 10067
						$('.sale_price_btn').show();
					}
				});
			});
		}

		_ab = new ActionBuilder();
		_ab.setActionType(ActionHandler.ACTION_TYPE_POPUP);
		_ab.setTarget('/performance/pop_sale_info.html');
		_ab.setKey('grade.list');
		_ab.setVisiblePre('Y');
		_ab.setSingle('Y')
		_ab.setJson({
			gradelist: pData.gradelist
		});
		_ab.bind(_saleBtn);

		_ab = new ActionBuilder();
		_ab.setActionType(ActionHandler.ACTION_TYPE_POPUP);
		_ab.setTarget('/performance/pop_interest_info.html');
		_ab.setKey('dcCard.list');
		_ab.setVisiblePre('Y');
		_ab.setSingle('Y');
		_ab.setJson({
			dcCardList: pData.dcCardList
		});
		_ab.bind(_intrBtn);

	},

	/**
	 * 출연진 영역 Dom 구성
	 *
	 * @param pData - 상품 데이터
	 */
	_drawArtist = function(pData){

		var _this = this, _tgtDom = $('#box_artist_area'),
			_artData = JSON.parse(pData.actorJson).data, _ds = [];

		if (1 > _artData.list.length) {
			return false;
		}

		$.each(_artData.list, function(i, o) {
			if (2 < i) {
				return false;
			}

			var _dsSub = [], _im = '', _an = '', _ab, _img;

			if(StringUtils.isNotEmpty(o.roleName)) {
				_an = '<span>'+ o.roleName+'</span>';
			}

			_img = ImageUtils.getManImage(o.artistImgPath);
			_img.setAlt(o.artistNameWebList);

			_dsSub.push('<li>');
			_dsSub.push('<label>');
			_dsSub.push('<span class="check">');
			_dsSub.push('<span class="img">');
			_dsSub.push(_img.toString());
			_dsSub.push('</span>');
			_dsSub.push('<input type="checkbox" class="radius toggleArtist" onclick="this.blur();">');
			_dsSub.push('</span>');
			_dsSub.push('</label>');
			_dsSub.push('<a href="#action" class="txt">');
			_dsSub.push('<strong class="singer">'+ o.artistNameWebList +'</strong>');
			_dsSub.push('<span class="part">');
			_dsSub.push(_an);
			_dsSub.push('</span>');
			_dsSub.push('</a>');
			_dsSub.push('</li>');

			_dsSub = $(_dsSub.join(''));

			_ab = new ActionBuilder();
			_ab.setActionType(ActionHandler.ACTION_TYPE_LINK);
			_ab.setTarget('artist.index');
			_ab.setJson({artistId: o.artistId});
			_ab.bind(_dsSub.find('a'));
			_ab.bind(_dsSub.find('.img'));

			_ab = new ActionBuilder();
			_ab.setActionType('foru.artist');
			_ab.setJson({artistId: o.artistId});
			_ab.bind(_dsSub.find('.toggleArtist'));

			_ds.push(_dsSub);
		});

		_tgtDom.find('.list_artist').html(_ds);

		ActionHandler.addEvent(_tgtDom);

		if(isMelonLogin()) {
			artistModel
				.deliver(_checkForuArtist)
				.isForUArtist();
		}

		// 출연진 3개 이하 시 더보기 표시안함.
		if (4 > _artData.list.length) {
			_tgtDom.find('.list_artist').next().remove();
		}
		// 출연진 더보기 데이터 바인딩
		else {
			var _tgtMore = _tgtDom.find('#moreArtist'), _ab;

			_ab = new ActionBuilder();
			_ab.setActionType(ActionHandler.ACTION_TYPE_POPUP);
			_ab.setTarget('/common/pop_artist.html');
			_ab.setScrollable('N');
			_ab.setKey('popup.artist');
			_ab.setJson(_artData.list);
			_ab.bind(_tgtMore);
		}
	},

	/**
	 * 포토&영상 영역 Dom 구성
	 *
	 * @param pData
	 */
	_drawMedia = function(pData) {

		var _this = this, _tgtDom = $('#box_photo_movie'), _mediaData = JSON.parse(pData.mediaJson).data;

		if (1 > _mediaData.list.length) {
			return false;
		}

		var _ds = [];

		$.each(_mediaData.list, function(i, o) {

			if (i < 4) {
				// 최대 4건까지 출력
				var _dsSub = [], _ab, _img;

				_img = ImageUtils.getMediaImage(o.imageUrl);
				_img.setAlt(o.title);

				if (MEDIA_TYPE_VIDEO === o.mediaType) {
					_dsSub.push('<li class="movie">');
					_dsSub.push('<a class="croping"  href="#action" >');
					_dsSub.push(_img.toString());
					_dsSub.push('<span class="time"></span>');
					_dsSub.push('<span class="play_btn">재생</span>');
					_dsSub.push('</a>');
					_dsSub.push('</li>');
				}
				else if (MEDIA_TYPE_SONG === o.mediaType) {
					_dsSub.push('<li class="photo">');
					_dsSub.push('<a class="croping" href="#action" >');
					_dsSub.push(_img.toString());
					_dsSub.push('</a>');
					_dsSub.push('</li>');
				}

				_dsSub = $(_dsSub.join(''));

				_ab = new ActionBuilder();
				_ab.setActionType(ActionHandler.ACTION_TYPE_POPUP);
				_ab.setTarget('/common/pop_viewer.html');
				_ab.setKey('common.viewer');
				_ab.setJson({
					type: 'M',
					page: i + 1,
					title: pData.title,
					data: _mediaData.list
				});
				_ab.bind(_dsSub.find('a'));

				_ds.push(_dsSub);
			}
		});

		_tgtDom.find('#movie_ul').html(_ds);

		// 포토&영상 더보기 표시여부
		if (5 > _mediaData.list.length) {
			$('#btnPopupMedia').remove();
		}
		// 더보기 팝업 핸들링
		else {
			var _ab = new ActionBuilder();
			_ab.setActionType(ActionHandler.ACTION_TYPE_POPUP);
			_ab.setTarget('/performance/pop_media.html');
			_ab.setKey('popup.media');
			_ab.setJson({
						title: pData.title,
						data: _mediaData.list
					});
			_ab.bind($('#btnPopupMedia'));
		}

		// 포토 / 영상 이미지 crop
		ImageUtils.movieCroping('movie_ul');
	},

	/**
	 * 셋리스트 영역 Dom 구성
	 *
	 * @param pData
	 */
	_drawSetlist = function(pData) {
		var _this = this, _tgtDom = $('#box_music_area'),
			_songData = JSON.parse(pData.songJson).data,
			_albumData = JSON.parse(pData.albumJson).data,
			_cnt = 1, _cnt_s = 1;

		if (1 > _songData.list.length) {

			//셋리스트가 없으면 탭 삭제 후 앨범 하이라이트
			$('#setlist').hide();
			$('#album').addClass('on');
			$('#album').find('a[href=#action]').trigger('click');
			$('#rel_music_setlist').hide();
			return false;
		}

		var _ds = [];

		$.each(_songData.list, function(i, o){
			// 화면에 최대 3개까지 노출
			if( _cnt_s < 4 ) {

				var _dsSub = [];

				_dsSub.push('<li>');
				_dsSub.push('<a href="#action">');
				_dsSub.push('<span class="rank">');
				_dsSub.push('<strong class="ranking">'+ (_cnt++) +'</strong><span class="ir2">위</span>');
				_dsSub.push('</span>');
				_dsSub.push('<span class="txt">');
				_dsSub.push('<em class="tit_con"><span class="tit_icon">TITLE</span>'+o.songNameWebList+'</em>');
				_dsSub.push('<strong class="tit_sub">'+o.artistNameBasket+'</strong>');
				_dsSub.push('</span>');
				_dsSub.push('</a>');
				_dsSub.push('</li>');

				_dsSub = $(_dsSub.join(''));

				// 재생 이벤트 바인딩
				_dsSub.find('a').on('click', function(e) {
					e.preventDefault();

					AlbumAction.playSong(o.songId);
				});

				_ds.push(_dsSub);
				_cnt_s++;
			}
		});

		_tgtDom.find('.list_music').html(_ds);

		if( _songData.listCount < 4 ) {
			// 3개 이하는 더보기 노출 안함
			$('#rel_music_setlist').hide();
		}
		else {
			var _ab = new ActionBuilder();
			_ab.setActionType(ActionHandler.ACTION_TYPE_POPUP);
			_ab.setTarget('/performance/pop_relation_music.html');
			_ab.setKey('perform.pop_realation_music');
			_ab.setJson({
				typeCode: 'song',
				prodId: pData.prodId,
				title: pData.title,
				data: {
					song: _songData.list,
					album: _albumData.list
				}
			});
			_ab.bind($('#rel_music_setlist'));
		}

		if(_songData.listCount === 0 ) {
			// 셋리스트 항목이 없으면 탭숨김
			$('#setlist').hide();
			$('.view_music_box').hide();
			$('#album').attr('class', 'on');
		}

		if (dfd_setlist != null) {
			dfd_setlist.resolve(_songData != null && _songData.listCount > 0);
		}
	},

	/**
	 * albumJson 만으로는 아티스트를 뿌릴 수 없어서 변경
	 */
	_drawRelAlbum2 = function(pData){

		var orgData = $('#box_music_area').data('orgData');
		var _this = this, _tgtDom = $('#box_music_area'),
		_albumData = pData;
		_albumDataOrg = JSON.parse(orgData.albumJson).data;
		_songData = JSON.parse(orgData.songJson).data;

		if (1 > _albumData.list.length) {
			//셋리스트가 없으면 탭 삭제 후 앨범 하이라이트
			$('#album').hide();
			$('#rel_music_album').hide();
			return false;
		}

		var _ds = [], _ab;
		$.each(_albumData.list, function(i, o){

			var _dsSub = [];
			// 화면에 최대 2개까지만 노출
			if( i < 2 ) {

				_dsSub.push('<li>');
				_dsSub.push('<a href="#action">');
				_dsSub.push('<span class="album">');
				_dsSub.push('<img src="http://'+ ActionHandler.HOST_CDN_IMG + o.albumImgPath+'/melon/resize/234X234" alt="'+o.albumRepNm +'" />');
				_dsSub.push('<span class="theme">'+o.typeCodeDesc +'</span>');
				_dsSub.push('<button class="play_btn">재생</button>');
				_dsSub.push('</span>');
				_dsSub.push('<span class="txt">');
				_dsSub.push('<em class="tit_name">'+o.albumRepNm+'</em>');
				_dsSub.push('<strong class="singer">'+o.repArtistNameBasket+'</strong>');
				_dsSub.push('</span>');
				_dsSub.push('</a>');
				_dsSub.push('</li>');

				_dsSub = $(_dsSub.join(''));

				// 클릭 이벤트 핸들링
				_dsSub.find('a').on('click', function(e){
					e.preventDefault();

					var _o = $(this).data('json');

					// 앨범 리스트 재생
					//AlbumAction.playAlbumMove( _o.albumId, _o.albumTitle);
					AlbumAction.playAlbum( {albumId:_o.albumId});
				});

				_ab = new ActionBuilder();
				_ab.setJson({
					albumId:o.albumId,
					albumTitle:o.albumRepNm
				});
				_ab.bind(_dsSub.find('a'));

				_ds.push(_dsSub);
			}
		});

		_tgtDom.find('.list_album').html(_ds);

		if( _albumDataOrg.listCount < 3 ) {
			// 2개 이하는 더보기 노출 안함
			$('#rel_music_album').hide();
		} else {
			var _ab = new ActionBuilder();
			_ab.setActionType(ActionHandler.ACTION_TYPE_POPUP);
			_ab.setTarget('/performance/pop_relation_music.html');
			_ab.setKey('perform.pop_realation_music');
			_ab.setJson({
				typeCode: 'album',
				prodId: orgData.prodId,
				title: orgData.title,
				data: {
					song: _songData.list,
					album: _albumDataOrg.list
				}
			});
			_ab.bind($('#rel_music_album'));
		}
		if(_albumData.listCount === 0 ) {
			// 관련앨범 항목이 없으면 탭숨김
			$('#album').hide();
			$('.view_album_box').hide();
			$('#setlist').attr('class', 'on');
		}
	},
	/**
	 * 관련앨범 영역 Dom 구성
	 *
	 * @param pData
	 */
	_drawRelAlbum = function(pData) {

		var _this = this, _tgtDom = $('#box_music_area'),
			_songData = JSON.parse(pData.songJson).data,
			_albumData = JSON.parse(pData.albumJson).data;

		if (1 > _albumData.list.length) {
			return false;
		}

		var _ds = [], _ab;
		$.each(_albumData.list, function(i, o){

			var _dsSub = [];
			// 화면에 최대 2개까지만 노출
			if( i < 2 ) {

				//QQQ 아티스트 이름 표시 필요
				_dsSub.push('<li>');
				_dsSub.push('<a href="#action">');
				_dsSub.push('<span class="album">');
				_dsSub.push('<img src="http://'+ ActionHandler.HOST_CDN_IMG + o.albumImgPath+'/melon/resize/234X234" alt="'+o.albumTypeNm +'" />');
				_dsSub.push('<span class="theme">'+o.albumTypeNm +'</span>');
				_dsSub.push('<button class="play_btn">재생</button>');
				_dsSub.push('</span>');
				_dsSub.push('<span class="txt">');
				_dsSub.push('<em class="tit_name">'+o.albumRepNm+'</em>');
				_dsSub.push('<strong class="singer">'+o.planCnpy+'</strong>');
				_dsSub.push('</span>');
				_dsSub.push('</a>');
				_dsSub.push('</li>');

				_dsSub = $(_dsSub.join(''));

				// 클릭 이벤트 핸들링
				_dsSub.find('a').on('click', function(e){
					e.preventDefault();

					var _o = $(this).data('json');

					// 앨범 리스트 재생
					//AlbumAction.playAlbumMove( _o.albumId, _o.albumTitle);
					AlbumAction.playAlbum( _o.albumId);
				});

				_ab = new ActionBuilder();
				_ab.setJson({
					albumId:o.albumId,
					albumTitle: o.albumRepNm
				});
				_ab.bind(_dsSub.find('a'));

				_ds.push(_dsSub);
			}
		});

		_tgtDom.find('.list_album').html(_ds);

		if( _albumData.listCount < 3 ) {
			// 2개 이하는 더보기 노출 안함
			$('#rel_music_album').hide();
		} else {
			var _ab = new ActionBuilder();
			_ab.setActionType(ActionHandler.ACTION_TYPE_POPUP);
			_ab.setTarget('/performance/pop_relation_music.html');
			_ab.setKey('perform.pop_realation_music');
			_ab.setJson({
				typeCode: 'album',
				prodId: pData.prodId,
				title: pData.title,
				data: {
					song: _songData.list,
					album: _albumData.list
				}
			});
			_ab.bind($('#rel_music_album'));
		}
		if(_albumData.listCount === 0 ) {
			// 관련앨범 항목이 없으면 탭숨김
			$('#album').hide();
			$('.view_album_box').hide();
			$('#setlist').attr('class', 'on');
		}

	},

	/**
	 * 관련공연 영역 Dom 구성
	 *
	 * @param pData
	 */
	_drawRelPerf = function(pData) {
		var _tgtDom = $('#box_performance'), _perfData = JSON.parse(pData.perfRelatJson).data;

		if (1 > JsonUtils.length(_perfData.list)) {
			return false;
		}

		var _ds = [];
		$.each(_perfData.list, function(i, o) {

			var _dsSub = [], _rn = '', _tit = '', _link = '', _ab, _img;

			if(StringUtils.isNotEmpty(o.regionName)) {
				_rn = o.regionName;
			}

			if(StringUtils.isNotEmpty(o.title)) {
				_tit = o.title;
			}

			_img = ImageUtils.getPosterImageBig(o.posterImg);
			_img.setAlt(o.regionName);

			_dsSub.push('<li>');
			_dsSub.push('<a href="#action">');
			_dsSub.push('<span class="croping cropimg">');
			_dsSub.push(_img.toString());
			_dsSub.push('</span>');
			_dsSub.push('<strong class="tit">'+_tit+'</strong>');
			_dsSub.push('<span class="area">'+_rn+'</span>');
			_dsSub.push('</a>');
			_dsSub.push('</li>');

			_dsSub = $(_dsSub.join(''));

			_ab = new ActionBuilder();
			_ab.setActionType(ActionHandler.ACTION_TYPE_LINK);
			_ab.setTarget('performance.index');
			_ab.setJson({prodId: o.prodId});
			_ab.bind(_dsSub.find('a'));

			_ds.push(_dsSub);
		});

		_tgtDom.find('#list_banner').html(_ds);

		// 관련 공연 스크롤
		var docWidth = 152;
		var sTarget = $('#list_banner li');
		var sTargetLength = $(sTarget).length;
		$(sTarget).parent().width(docWidth*sTargetLength);
		myScroll = new IScroll('#box_banner', {
			disablePointer: true,
			scrollX: true,
			snap: false,
			snapSpeed: 400,
			keyBindings: true,
			eventPassthrough: true, //추가 속성
			preventDefault: false //추가 속성
		});

		// 포토 / 영상 이미지 crop
		ImageUtils.relatePerformanceCroping('list_banner');
	},

	/**
	 * 쿠폰 다운로드 버튼 Dom 구성
	 *
	 * @param pData - 상품 데이터
	 */
	_drawCouponDownload = function(pData) {

		if (JsonUtils.isEmpty(pData)) {
			return false;
		}

		var _ds = [], _ab;

		_ds.push('<li id="couponInfo" style="display:none;">');
//		_ds.push('<p class="tit">할인쿠폰</p>');
//		_ds.push('<p class="txt">사용 가능한 쿠폰 <strong class="cnt">'+ActionHandler._length(pData)+'개</strong>');
		_ds.push('<p class="tit">할인혜택</p>');
		_ds.push('<p class="txt">할인쿠폰<button class="coupon">다운받기</button></p>');
		_ds.push('</li>');

		_ds = $(_ds.join(''));

		_ab = new ActionBuilder();
		_ab.setActionType(ActionHandler.ACTION_TYPE_POPUP);
		_ab.setTarget('/performance/pop_coupon.html');
		_ab.setKey('coupon.list');
		_ab.setJson(pData);
		_ab.bind(_ds.find('button'));

		$('#couponArea').replaceWith(_ds);
		$('#couponInfo').slideDown(200);
	},

	/**
	 * 데이터 유무판단하여 영역 표시 체크
	 *
	 * @param pData - 상품 데이터
	 */
	_checkDataArea = function(pData) {
		var _this = this, _tgtDom = $('#veiw_tab_wrap');

		// 공연시간 정보 없을 경우 해당영역 삭제
		if (StringUtils.isEmpty(pData.perfTimeInfo) || '' === pData.perfTimeInfo) {
			_tgtDom.find('.box_concert_time').remove();
		}
		else {
			_tgtDom.find('.box_concert_time').show();
		}

		// 좌석 정보 없을 경우 해당영역 삭제
		if (StringUtils.isEmpty(pData.seatGradeJson) || 1 > JSON.parse(pData.seatGradeJson).data.listCount) {
			_tgtDom.find('.box_bace_price').remove();
		}
		else {
			_tgtDom.find('.box_bace_price').show();
		}

		// 가격 정보가 존재할 경우 해당영역 우선 표시 (replace)
		_drawBasePrice(pData);

		// 출연진 정보 없을 경우 해당영역 삭제
		if (StringUtils.isEmpty(pData.actorJson) || 1 > JSON.parse(pData.actorJson).data.listCount) {
			_tgtDom.find('.box_artist_area').remove();
		}
		else {
			_drawArtist(pData);
			_tgtDom.find('.box_artist_area').show();
		}

		// 예매공지 정보 없을 경우 해당영역 삭제
		if (StringUtils.isEmpty(pData.announceInfo) || '' === pData.announceInfo) {
			_tgtDom.find('.box_ticke_notice').remove();
		}
		else {

			_tgtDom.find('.box_ticke_notice').show();

			// 높이값 체크후 더보기 버튼 삭제
			var totHeight = 0;
			var moreViewHeight = 105;//5줄, 줄 잘림 방지
			_tgtDom.find('#noticeMore').find('p').each(function(){
				totHeight += $(this).height();
				if(totHeight > moreViewHeight){
					return false;
				}
			});
			if (moreViewHeight > totHeight) { // 상위 elem의 line-height: 20px
				_tgtDom.find('.view_more').remove();
			}
			else {
				_tgtDom.find('.box_ticke_notice').removeClass('m_txt_open');

				_tgtDom.find('.view_more').on("click",function(){
					if(_tgtDom.find('.box_ticke_notice').hasClass('m_txt_open')){
						$(this).find("span").text("닫기");
					}else{
						$(this).find("span").text("더보기");
					}
				})
			}
		}

		// 포토/영상 정보 없을 경우 해당영역 삭제
		if (StringUtils.isEmpty(pData.mediaJson) || 1 > JSON.parse(pData.mediaJson).data.listCount) {
			_tgtDom.find('.box_photo_movie').remove();
		}
		else {
			_drawMedia(pData);
			_tgtDom.find('.box_photo_movie').show();
		}

		// 기획사 정보 없을 경우 해당영역 삭제
		if (StringUtils.isEmpty(pData.partnerInfo) || '' === pData.partnerInfo) {
			_tgtDom.find('.box_agency').remove();
		}
		else {
			_tgtDom.find('.box_agency').show();
		}

		// 관련음악 정보 없을 경우 해당영역 삭제
		if ((StringUtils.isEmpty(pData.songJson) || 1 > JSON.parse(pData.songJson).data.listCount) &&
				(StringUtils.isEmpty(pData.albumJson) || 1 > JSON.parse(pData.albumJson).data.listCount)) {
			_tgtDom.find('.box_music_area').remove();
		}
		else {
			_drawSetlist(pData);

			//아티스트 이름을 뿌리는 것이 필요하여 변경
			$('#box_music_area').data('orgData', pData);
			var alData ={"prodId": pData.prodId, "typeCode" : "album"};
			foruModel
			.deliver(_drawRelAlbum2)
			.relationMusic(alData);
			//_drawRelAlbum(pData);
			_tgtDom.find('.box_music_area').show();

			// 관련음악 탭 이벤트 핸들링
			_tgtDom.find('.list_music_tab_menu li').on('click', function(e){
				_tgtDom.find('.list_music_tab_menu li').removeClass('on');

				var _o = $(this);

				_o.addClass('on');
			});
		}

		// 관련공연 정보 없을 경우 해당영역 삭제
		if (StringUtils.isEmpty(pData.perfRelatJson) || 1 > JSON.parse(pData.perfRelatJson).data.listCount) {
			_tgtDom.find('.box_performance').remove();
		}
		else {
			_tgtDom.find('.box_performance').show();
			_drawRelPerf(pData);
		}
	},

	/**
	 * 탭 초기화
	 *
	 * @param pData - 상품 데이터
	 */
	_initTabMenu = function(pData) {
		var _tgtDom = $('.wrap_detail_tab'), _listDom = $('.list_detail');

		_tgtDom.find('li').unbind('click').on('click', function(e){
			var _thisCls = $(this), _bannerArea = $('#variableBannerArea');
			var _reviewBanner = $('#reviewBannerArea'), _evalueBanner = $('#evalueBannerArea');

			if(_thisCls.hasClass('no4')){
				_evalueBanner.css('display', '');
				_reviewBanner.css('display', 'none');
			}else if(_thisCls.hasClass('no5')){
				_evalueBanner.css('display', 'none');
				_reviewBanner.css('display', '');
			}else if(_thisCls.hasClass('no3')){
				e.preventDefault();
				PvModel.sendPvEx('prod.desc', {prodid:pData.prodId});
				_evalueBanner.css('display', 'none');
				_reviewBanner.css('display', 'none');
			}else if(_thisCls.hasClass('no7')){
				e.preventDefault();
				PvModel.sendPvEx('prod.place', {prodid:pData.prodId});
				_evalueBanner.css('display', 'none');
				_reviewBanner.css('display', 'none');
			}else if(_thisCls.hasClass('no8')){
				e.preventDefault();
				PvModel.sendPvEx('prod.info', {prodid:pData.prodId});
				_evalueBanner.css('display', 'none');
				_reviewBanner.css('display', 'none');
			}else{
				_evalueBanner.css('display', 'none');
				_reviewBanner.css('display', 'none');
			}
		});

		// 할인 정보 탭메뉴 삭제
		if (StringUtils.isEmpty(pData.discountInfo)) {
			_tgtDom.find('li.no2').remove();
		}

		// 작품설명 정보 탭메뉴 삭제
		if (StringUtils.isEmpty(pData.perfDescr)) {
			_tgtDom.find('li.no3').remove();
		}
		//Pv
//		_tgtDom.find('li.no3 ').unbind('click').on('click', function(e){
//			e.preventDefault();
//			PvModel.sendPvEx('prod.desc', {prodid:pData.prodId});
//		});

		// 유의사항 정보 탭메뉴 삭제
		if (StringUtils.isEmpty(pData.csInfo)) {
			_tgtDom.find('li.no8').remove();
		}
		//Pv
//		_tgtDom.find('li.no8 ').unbind('click').on('click', function(e){
//			e.preventDefault();
//			PvModel.sendPvEx('prod.info', {prodid:pData.prodId});
//		});

		// 기대평 & 관람후기 & QnA 노출 제외처리
		var prodId = prodId = getParams().prodId;

		// li.no4 기대평, li.no5 관람후기, li.no6 Q&A
		if(pData.previewDpYn === 'N') {
			_tgtDom.find('li.no4').remove();
		}
		if(pData.qnaDpYn === 'N') {
			_tgtDom.find('li.no6').remove();
		}
		if(pData.reviewDpYn === 'N') {
			_tgtDom.find('li.no5').remove();
		}

		// 공연장 정보 탭메뉴 삭제
		if (StringUtils.isEmpty(pData.placeId) || pData.placeName === '-' || pData.placeName === '추후공지') {
			_tgtDom.find('li.no7').remove();
			if(pData.placeName !== '추후공지'){
				$('#placeInfo').remove();
			}else{
				$("#placeInfo .txt").text("추후공지");
			}
		}else{
			var _ab = new ActionBuilder();
			_ab.setActionType(ActionHandler.ACTION_TYPE_LINK);
			_ab.setTarget('place.index');
			_ab.setJson({
				placeId: pData.placeId
			});
			_ab.bind($('#actionTabPlace'));
		}
		//Pv
//		_tgtDom.find('li.no7 ').unbind('click').on('click', function(e){
//			e.preventDefault();
//			PvModel.sendPvEx('prod.place', {prodid:pData.prodId});
//		});

		// 패키지 상품일 경우 상세정보, 작품설명, 유의사항 탭만 적용
		if (PROD_TYPE_CODE_PKG === pData.prodTypeCode) {
			_tgtDom.find('li.no2,li.no4,li.no5,li.no6,li.no7').remove();
		}

		// 관람시간 존재하지 않을경우 표시영역 삭제
		if (StringUtils.isEmpty(pData.runningTime)) {
			$('#runningTime').remove();
		}

		// 요약정보 없을경우 표시영역 삭제
		if (StringUtils.isEmpty(pData.summary)) {
			$('#txtSummary').remove();
		}else{
			//내용있을경우 표시함
			$('#txtSummary').html('<span>'+pData.summary+'</span>');
		}

		//파트너 어드민 미리보기 적용
		if(_gateValidateChk === "Y"){
            _tgtDom.find('li.no4,li.no5,li.no6').remove();

			//할인정보 data-target 값 변경
            _tgtDom.find("li.no2 a").data("target","performance.detailpreview[discountInfo]");

            //작품설명 data-target 값 변경
            _tgtDom.find("li.no3 a").data("target","performance.detailpreview[perfDescr]");
		}

		// 공연장 선택 시 공연장 상세로 이동
//		var _ab = new ActionBuilder();
//		_ab.setActionType(ActionHandler.ACTION_TYPE_LINK);
//		_ab.setTarget('place.index');
//		_ab.setJson({
//			placeId: pData.placeId
//		});
//		_ab.bind($('#actionTabPlace'));

		// 탭 선택 공통바인딩.
		_listDom.find('li a').each(function(i, o) {

			var _o = $(o), _ab = new ActionBuilder();

			_ab.setCallback(function(e){
				var __o = $(e.target);

				_listDom.find('li').removeClass('on');
				_listDom.find('li.'+__o.parent().attr('class')).addClass('on');

				// 할인정보, 작품설명 탭 클릭 시 콘텐츠 표시영역 간격조정 클래스 추가
				if (__o.parent().hasClass('no2') || __o.parent().hasClass('no3')) {
					$('#veiw_tab_wrap').addClass('img_content');
				}
			});

			// 공연장 탭 정보 추가바인딩
			if (StringUtils.isNotEmpty(pData.placeId) && _o.parent().hasClass('no7')) {
				_ab.setActionType('tab.load');
				_ab.setTarget('/performance/sub_place.html');
				_ab.setReplaceId('veiw_tab_wrap');
				_ab.setKey('place.index');
				_ab.setJson({
					placeId: pData.placeId,
					hallId: pData.hallId
				});
			}

			_ab.bind($(o));
		});

		// 중단 탭 메뉴 스크롤 이벤트 바인딩
		//tabScroll = new IScroll('#detailTab', {
		detailTabScroll = new IScroll('#detailTab', {
		//myScroll = new IScroll('#detailTab', {
			disablePointer: true,
			scrollX:true,
	        scrollY:true,
	        mouseWheel:true,
	        eventPassthrough:true, //추가 속성
	        preventDefault:false, //추가 속성
	    });
	},

	/**
	 * 뱃지 노출 구분
	 * @param pData - 상품 데이터
	 */
	_drawBadge = function(pData) {
		var _tgtDom = $('#ico_content');

		// 뱃지노출여부
		if (ICON_CODE_NONE !== pData.iconCode) {
			_tgtDom.html('<span class="ico1"><span>'+pData.iconName+'</span></span>');
		}
		// 패키지 상품일 경우
		else if (PROD_TYPE_CODE_PKG === pData.prodTypeCode) {
			_tgtDom.html('<span class="ico1"><span>패키지</span></span>');
		}
		
		// [CAPTCHA]  인증예매 상품일 경우  아이콘 추가
		try {
			if ((pData.authRsrvYn != undefined) && (pData.authRsrvYn == 'Y') && ($(_tgtDom).children('.ico5').length == 0))
				_tgtDom.append('<span class="ico5">인증예매</span>');
		}catch (e) { }
	},
	

	/**
	 * 성인인증 버튼 노출
	 *
	 * @param pData - 상품 데이터
	 */
	_drawAdultConfirm = function(pData) {
		// 성인페이지 일 경우 추가처리
		var _tgtDom = $('#adulte_check');

		if (GRADE_CODE_19 === pData.gradeCode && checkAdultValue === 'N') {
				var _btn = $('<button></button>').addClass('acc').text('성인인증받기'),
				_p = $('<p></p>').addClass('txt').text('성인인증이 필요한 공연입니다.');


			// 성인증 페이지로 이동.
			_btn.on('click', function() {
				this.blur();
				if(isMelonLogin()) {
					if (checkAdultValue === 'N') {//성인인증 안받은 경우만
						if(authErrCode === 'ERL087'){
							ActionHandler.alert({message:'19세 이상 관람 가능한 공연으로 미성년자의 예매가 불가합니다.'});
							return;
						}
						//ReserveAction.moveCheckAuthAdult();
						ReserveAction.moveCheckAuthAdult({contId: pData.prodId, type: 'performance'});
					} else {
						ActionHandler.toast('성인 인증이 이미 완료 되었습니다.');
					}
				}else{
					// 로그인 여부 확인
					if (!ActionHandler._confirmLogin()) {
						return false;
					}
				}
			});

			_btn.appendTo(_p);
			_tgtDom.html(_p);
		}
		else {
			_tgtDom.remove();
		}
	},

	/**
	 * 공연플래너 여부 확인
	 *
	 * @param pData - 상품데이터
	 */
	_checkIsFavorite = function(pData) {
		//if (isMelonLogin() && STATE_FLG_05 !== pData['stateFlg'] ) {
			var _tgtDom = $('#btnFavorite');

			if ("Y" === pData.interestFlg) {
				_tgtDom.removeClass('off').addClass('on');
				_tgtDom.text('공연플래너');
			}
			else if ("N" === pData.interestFlg) {
				_tgtDom.removeClass('on').addClass('off');
				_tgtDom.text('공연플래너 담기');
			}
		//}
	},

	/**
	 * 포유 아티스트 등록여부 체크
	 *
	 * @param pData - ForU 아티스트 선택 정보
	 */
	_checkForuArtist = function(pData) {

		var _tgtDom = $('#list_artist');

		$.each(_tgtDom.find('li'), function(i, o) {

			var _o = $(o), _data = _o.find('input').data();

			$.each(pData, function(ia, oa) {
				// forU 아티스트 등록여부
				if( oa.recmdVal == _data.json.artistId ) {
					_o.find('input').attr('checked', 'checked');
					return false;
				}
			});
		});
	},

	/**
	 * 상단 띠 베너 Dom 구성
	 *
	 * @param pData
	 */
	_drawPerformanceBanner = function(pData) {

		if (JsonUtils.isEmpty(pData)) {
			return false;
		}

		var _tgtDom = $('#bannerArea'), _ds = [], _ab, _img;

		_img = ImageUtils.getMediaImage(pData.imgUrl);
		_img.setAlt(pData.bannerTitle);

		_ds.push('<div class="wrap_banner">');
		if (StringUtils.isNotEmpty(pData.imgBgColor)) {
			_ds.push('<a href="#action" style="background-color: '+pData.imgBgColor+';">');
		}else{
			_ds.push('<a href="#action">');
		}
		_ds.push(_img.toString());
		_ds.push('</div>');

		_ds = $(_ds.join(''));

		// 랜딩페이지 바인딩
		_ab = OfferAction.getActionByLandingType(pData.landingRefType, pData.landingRefValue);
		_ab.bind(_ds.find('a'));

		// 백그라운드 설정
		//if (StringUtils.isNotEmpty(pData.imgBgColor)) {
		//	_ds.css({
		//		'background-color': pData.imgBgColor
		//	});
		//}

		_tgtDom.html(_ds);

	},

	/**
	 * 기대평 띠 베너 영역
	 *
	 * @param pData
	 */
	_drawPerformanceEvalueBanner = function(pData) {

		if (JsonUtils.isEmpty(pData)) {
			return false;
		}

		var _tgtDom = $('#evalueBannerArea'), _ds = [], _ab, _img;

		_img = ImageUtils.getMediaImage(pData.imgUrl);
		_img.setAlt(pData.bannerTitle);

		_ds.push('<div class="wrap_banner_comment">');
		if (StringUtils.isNotEmpty(pData.imgBgColor)) {
//			_ds.push('<a href="#action" style="background-color: '+pData.imgBgColor+';">');
			_ds.push('<a href="javascript:;" style="background-color: '+pData.imgBgColor+';">');
		}else{
			_ds.push('<a href="javascript:;">');
		}
		_ds.push(_img.toString());
		_ds.push('</div>');

		_ds = $(_ds.join(''));

		// 랜딩페이지 바인딩
		if(pData.landingType != 'N'){
			_ab = OfferAction.getActionByLandingType(pData.landingRefType, pData.landingRefValue);
			_ab.bind(_ds.find('a'));
		}

		_tgtDom.html(_ds);
	},

	/**
	 * 관람후기 띠 베너 영역
	 *
	 * @param pData
	 */
	_drawPerformanceReviewBanner = function(pData) {

		if (JsonUtils.isEmpty(pData)) {
			return false;
		}

		var _tgtDom = $('#reviewBannerArea'), _ds = [], _ab, _img;

		_img = ImageUtils.getMediaImage(pData.imgUrl);
		_img.setAlt(pData.bannerTitle);

		_ds.push('<div class="wrap_banner_comment">');
		if (StringUtils.isNotEmpty(pData.imgBgColor)) {
//			_ds.push('<a href="#action" style="background-color: '+pData.imgBgColor+';">');
			_ds.push('<a href="javascript:;" style="background-color: '+pData.imgBgColor+';">');
		}else{
			_ds.push('<a href="javascript:;">');
		}
		_ds.push(_img.toString());
		_ds.push('</div>');

		_ds = $(_ds.join(''));

		// 랜딩페이지 바인딩
		if(pData.landingType != 'N'){
			_ab = OfferAction.getActionByLandingType(pData.landingRefType, pData.landingRefValue);
			_ab.bind(_ds.find('a'));
		}

		_tgtDom.html(_ds);
	},

	/**
	 * 공유하기 버튼 이벤트 바인딩
	 */
	_bindShareBtn = function(pData) {

		var _tgtDom = $('#btnShare'), _ab, _img,
			_tmpPlace = [], _tmpContents = [], prodId, pageType;

		//파트너어드민 미리보기
        if(_gateValidateChk === "Y"){
            //공유하기 버튼 삭제
            _tgtDom.remove();
			//공연플래너 담기 버튼 삭제
             $("#btnFavorite").remove();
			 $(".link_check").css("padding-bottom","37px");
		} else {
            _ab = new ActionBuilder();
            _ab.setActionType(ActionHandler.ACTION_TYPE_POPUP);
            _ab.setTarget('/common/pop_sns.html');
            _ab.setScrollable('N');
            _ab.setVisiblePre('Y');
            _ab.setKey('popup.sns');

            if (StringUtils.isNotEmpty(pData.periodInfo)) {
                _tmpContents.push(pData.periodInfo);
            }

            if (StringUtils.isNotEmpty(pData.placeName)) {
                _tmpPlace.push(pData.placeName);
            }

            if (StringUtils.isNotEmpty(pData.availPlaceInfo)) {
                _tmpPlace.push(pData.availPlaceInfo);
            }

            _tmpContents.push(_tmpPlace.join(' '));

            if (location.hash.indexOf('bridge') > 0) {
                prodId = getParams().brgId;
                pageType = 'bridge';
                _img = ImageUtils.getPosterImage(pData.imgUrl);
            } else {
                prodId = getParams().prodId;
                pageType = 'ticket';
                _img = ImageUtils.getPosterImage(pData.posterImg);
            }

            //2018-02-13  설명에서 title중복 제외 by Erick.K
            _ab.setJson({
                title: pData.title,
                contents: _tmpContents.join(' / '),
                image: _img.getSrc(),
                value: prodId,
                pageType: pageType
            });

            _ab.bind(_tgtDom);
        }
	},

	/**
	 * 공유하기 버튼 이벤트 바인딩
	 */
	_bindLinkBtn = function(pData) {

		var _tgtDom = $('#btnLink'), _ab, _tmpContents = [];

		_ab = new ActionBuilder();
		_ab.setActionType(ActionHandler.ACTION_TYPE_POPUP);
		_ab.setTarget('/common/pop_link.html');
		_ab.setScrollable('N');
		_ab.setVisiblePre('Y');
		_ab.setKey('popup.link');

		_ab.setJson({
			title: pData.title,
			contents: pData.title + '\n' + _tmpContents.join(' / '),
//			image: _img.getSrc(),
			value: pData.prodId,
			pageType: 'ticket',
			linkUrl:({
				hpLink:pData.perfMainUrl,
				fbLink:pData.facebookUrl,
				isLink:pData.instaUrl,
				twLink:pData.twitterUrl,
				ytLink:pData.youtobeUrl,
				blLink:pData.blogUrl,
				cfLink:pData.cafeUrl
			})
		});

		_ab.bind(_tgtDom);

		// link 없을시 버튼 삭제
		var linkSize = 0;
		$.each( pData, function(i, o) {
			if(i.indexOf('Url') > -1 && i != 'imgUrl'){
				if(o != ""){
					linkSize ++;
				}
			}
		});
		if(linkSize < 1){
			_tgtDom.remove();
		}
	},

	/**
	 * '인증예매 안내' 버튼 이벤트 바인딩 	[CAPTCHA]
	 */
	_bindCertificationBtn = function(pData){
		if( pData.authRsrvYn == 'Y' ){
			//  페이지 진입시  인증예매(캡챠) 팝업 활성화 처리 [CAPTCHA]   
			performanceModel
				.deliver(_drawPopupCertification)
				.getAlert();
			
			$('#btnCertification').show();
			var _tgtDom = $('#btnCertification'), _ab;
			_ab = new ActionBuilder();
			_ab.setActionType(ActionHandler.ACTION_TYPE_POPUP);
			_ab.setTarget('/common/pop_certification.html');
			_ab.setScrollable('N');
			_ab.setVisiblePre('Y');
			_ab.setKey('popup.certification');
			_ab.bind(_tgtDom);
		}else{
			$('#btnCertification').hide();
		}
	},
	
	_bindBridgeList = function(pData) {
		var _listBtn = $("#listBtn");

		 var _ab = new ActionBuilder();
		_ab.setActionType(ActionHandler.ACTION_TYPE_POPUP);
		_ab.setTarget('/common/pop_bridgeList.html');
		_ab.setVisiblePre('Y');
		_ab.setScrollable('N');
		_ab.setKey('bridge.list');
		_ab.setJson(pData);
		_ab.bind(_listBtn);
	},

	_drawBridgeMedia = function(pData) {
		var _ds = [], _dsSub = [], _ab,_mediaData = JSON.parse(pData.mediaJson).data.list;
		var _imgurl = 'http://' + HOST_CDN + pData.imgFilePath + pData.imgFileName;

		if(_mediaData != ""){
			_ds.push('<a href="#action">');
			_ds.push('<img src="'+ _imgurl +'" alt="">');
			_ds.push('<span class="play_btn ir">play</span>');
			_ds.push('</a>');

			_ds = $(_ds.join(''));

			_ab = new ActionBuilder();
			_ab.setActionType(ActionHandler.ACTION_TYPE_POPUP);
			_ab.setTarget('/common/pop_viewer.html');
			_ab.setKey('common.viewer');
			_ab.setJson({
				type: 'M',
				page: 1,
				title: pData.title,
				data: _mediaData
			});
			_ab.bind(_ds);

			$("#bridgeMedia").html(_ds);
			$("#bridgeMedia").show();
		}
	},

	/**
	 * 상품 상세정보 Dom 구성
	 *
	 * @param pData
	 * @returns
	 */
	_drawDetail = function(pData) {
//		var _authType;
//		if (GRADE_CODE_19 === pData.gradeCode){
//			_authType = 'juvenileProtection';
//		}else{
//			_authType = 'charge';
//		}
//		ReserveAction.checkAuth(_authType);
//		ReserveAction.initReserveAuth(pData);//0414 삭제

		var _this = this;

		_checkDataArea(pData);    //데이터 유무판단하여 영역 표시 체크

		_initTabMenu(pData);      //탭 초기화

		_drawBadge(pData);        //뱃지 노출 구분

		_drawAdultConfirm(pData);    //성인인증 버튼 노출

		_bindShareBtn(pData);        //공유하기 버튼 이벤트 바인딩

		_bindCertificationBtn(pData);			// 인증예매 [CAPTCHA]
		
		$('#imgPoster').fadeIn(200);

		//Pv
		PvModel.sendPvEx('prod.detail', {prodid:pData.prodId});
	},

	/**
	 * 브릿지 리스트 Dom 구성
	 * @param pData
	 */
	_drawBridgeList = function(pData) {



		var _dsBtn = [], _ab;
		var _bNum = pData.list.length;

		_dsBtn.push('<div class="box_full_btn bridge_btn">');
		_dsBtn.push('	<a href="#action" class="btn_btm_full" id="listBtn">관련공연 <span class="bridge_num">'+_bNum+'</span></a>');
		_dsBtn.push('</div>');

		_dsBtn.push('<div class="btn_area">');
	    _dsBtn.push('	<a href="#" class="share" id="btnShare">공유하기</a>');
	    _dsBtn.push('  <a href="#" class="link" id="btnLink">관련링크</a>');
	    _dsBtn.push('</div>');

		_dsBtn = $(_dsBtn.join(''));
		addButton(_dsBtn);

		// sns 공유팝업 바인딩
		_bindShareBtn(pData);

		// 관련링크 팝업 바인딩
		_bindLinkBtn(pData);

		if (!JsonUtils.isEmpty(pData.list)) {
            // 공연 리스트
            _bindBridgeList(pData);

        }
		
		// 지식쇼핑 Cookie Set
		_setCookieCoop();

		_drawBridgeMedia(pData);

		$("#brgCon").html(pData.brgMobileInfo);
//		$("#brgCon").replaceWith(pData.brgMobileInfo);		//	bridge content Area Movie add

//		var _ds = [];
//		$.each(pData.list, function(i, o){
//
//			var _dsSub = [], _pl = [], _ab;
//
//			if (StringUtils.isNotEmpty(o.placeName)) {
//				_pl.push(o.placeName);
//			}
//			if (StringUtils.isNotEmpty(o.availPlaceInfo)) {
//				_pl.push(o.availPlaceInfo);
//			}
//			if (0 < _pl.length) {
//				_pl = '<span class="place">'+_pl.join(' ')+'</span>';
//			}
//
//			_dsSub.push('<div class="box_bridge_area">');
//			_dsSub.push('<a href="#action" class="link_view">');
//			_dsSub.push('<p class="bridge_subject">'+o.title+'</p>');
//			_dsSub.push('<span class="txt">');
//			_dsSub.push('<span class="tit">');
//			_dsSub.push('<span class="area">'+o.regionName+'</span> - ' + o.periodInfo);
//			_dsSub.push('</span>');
//			_dsSub.push(_pl);
//			_dsSub.push('</span>');
//			_dsSub.push('<span class="btn_view">상세보기</span>');
//			_dsSub.push('</a>');
//			_dsSub.push('</div>');
//
//			_dsSub = $(_dsSub.join(''));
//
//			_ab = new ActionBuilder();
//			_ab.setActionType(ActionHandler.ACTION_TYPE_LINK);
//			_ab.setTarget('performance.index');
//			_ab.setJson({prodId: o.prodId});
//			_ab.bind(_dsSub.find('a'));
//
//			_ds.push(_dsSub);
//		});
//
//		$('#wrap_bridge_concert').html(_ds);

		includeDoThisStuffOnScroll();

		ActionHandler.addEvent(document);
	},

	/**
	 * 기획전 리스트 Dom 구성
	 * @param pData
	 */
	_drawPlanList = function(pData) {

		if (JsonUtils.isEmpty(pData.list)) {
			return false;
		}

		var _ds = [];
		$.each(pData.list, function(i, o){

			var _dsSub = [], _pl = [], _ab, _img;

			if (StringUtils.isNotEmpty(o.placeName)) {
				_pl.push(o.placeName);
			}
			if (StringUtils.isNotEmpty(o.availPlaceInfo)) {
				_pl.push(o.availPlaceInfo);
			}
			if (0 < _pl.length) {
				_pl = '<em class="area">'+_pl.join(' ')+'</em>';
			}

			_img = ImageUtils.getPosterImage(o.posterImg);
			_img.setAlt(o.title);

			_dsSub.push('<li>');
			_dsSub.push('<a href="#action">');
			_dsSub.push('<span class="img">'+_img.toString()+'</span>');
			_dsSub.push('<span class="txt">');
			_dsSub.push('<strong class="tit">'+o.title+'</strong>');
			_dsSub.push('<em class="data">'+o.periodInfo+'</em>');
			_dsSub.push(_pl);
//				_dsSub.push('<em class="sale">40% 할인</em>');
			_dsSub.push('</span>');
			_dsSub.push('</a>');
			_dsSub.push('</li>');

			_dsSub = $(_dsSub.join(''));

			_ab = new ActionBuilder();
			_ab.setActionType(ActionHandler.ACTION_TYPE_LINK);
			_ab.setTarget('performance.index');
			_ab.setJson({
				prodId: o.prodId
			});
			_ab.bind(_dsSub.find('a'));

			_ds.push(_dsSub);
		});

		$('#list_sale_thumb').html(_ds);

		ActionHandler.addEvent(document);
	},

	/**
	 * 공연상세 초기로딩
	 *
	 * @param pData - 공연상세 데이터
	 */
	_drawPerformance = function(pData) {
//		_mobRfShop(pData);		// 모비온 스크립트
        _gateValidateChk = pData.gateValidateChk != null ? pData.gateValidateChk : "N";

		// 기획사 답변 관리를 위한 data set(bpMember List)
		ActionHandler._setData('bpMemberList', pData.bpMemberList);
		/* netfunnel title 설정용*/
		nf_title = pData.title;

		//data를 local 변수에 저장
		detailData = pData;

		var _afterAuthJob = function() {
			var _drwOne = function(pData) {
				var _this = this, _pkgDom = $('#forPackage'), _dtlDom = $('#forDetail'),
					_boxDom = $('#box_package_performance');

				// 패키지 상품의 상세정보 구성
				if (PROD_TYPE_CODE_PKG === pData.prodTypeCode) {
					_drawPackageInfo(pData);

					// 상단 상품상세 정보영역 삭제
					_dtlDom.remove();
					_pkgDom.fadeIn(200);
				}
				// 일반 상품 상세정보 구성
				else {
					// 상단 패키지 구매설명, 패키지 구성공연 영역 삭제
					_pkgDom.remove();
					_boxDom.remove();
					_dtlDom.fadeIn(200);
				}

				_drawDetail(pData);   //상세 정보 제어 부분
				_initFixMenuScroll();

				//종료된 상품의 경우 할인가격 표시 안함. (취소/완료/불가)
				if ("SS0600" === pData.stateFlg || "SS0400" === pData.stateFlg || "SS0700" === pData.stateFlg) {
					$('.sale_price_btn').hide();
				}

				return pData;
			}

			//작업 선후 관계
			_drwOne.compose(_logLatestView).compose(ReserveAction.init)(pData);

			// 예약 액션 호출
			// 공연 타입별 버튼 상태를 그린다.
			//ReserveAction.init(pData);

			// 최근 본공연 로그 쿠키등록
			//_logLatestView(pData);

			//foru viewdate update (있던 없던, home에서 직접 오는 경우 고려)
			foruModel.modifyViewDate({prodId: pData.prodId});
		}

		if(isMelonLogin()) {
			if (pData.gradeCode === GRADE_CODE_19) {
				ReserveAction.checkAuth(AUTH_TYPE_ADULT, _afterAuthJob);
			} else {
				ReserveAction.checkAuth(AUTH_TYPE_REAL, _afterAuthJob);
			}
		}else{
			eval('_afterAuthJob()');
		}

		//refresh
		if(pData.stateFlg === STATE_FLG_02) {

			if(_gateValidateChk === "Y"){
                $(document).find('a[href=#btnRefresh]').hide();
			}else{
                $(document).find('a[href=#btnRefresh]').unbind('click').on('click', function (e) {
                    var _pData = pData;
                    e.preventDefault();
                    //ReserveAction.refresh(_pData);

                    getLoadingPage(true);
                    setTimeout(function() {
                        var _url = 'http://tktapi.melon.com/poc/performance/detail.json';
                        $.ajax(_url, {data:{v:1,prodId:_pData.prodId}})
                            .done(function(_data){
                                ReserveAction.refresh(_data.data);
                            })
                            .fail(function(jqXHR, textStatus){

                            })
                            .always(function(){
                                getLoadingPage(false);
                            });

                        //performanceModel
                        //	.deliver(function (_data) {
                        //		//console.log('refresh button');
                        //
                        //		ReserveAction.refresh(_data);
                        //		getLoadingPage(false);
                        //	}).bindPerformanceDetail();
                    }, 500);
                });
			}

		}else{
			$(document).find('a[href=#btnRefresh]').hide();
		}

		if(dfd_detail != null) {
			dfd_detail.resolve();
		}
	},

	/**
	 * 탭 - 기대평 초기화
	 */
	_initTabEvalue = function() {
		CommentAction.initEvelue({
			targetListSelector: '#commentListArea',
			targetWriteSelector: '#commentWriteArea',
			targetNodataSelector: '#commentNodataArea'
		});
	},

	/**
	 * 탭 - 리뷰 공연후기 이미지 Dom 구성
	 *
	 * @deprecated - 기획 변경으로 사용하지 않음. 20160224
	 */
	_drawReviewImage = function(pData) {

		var _tgtDom = $('#veiw_tab_wrap');

		// 공연 평점 설정
		if (StringUtils.isNotEmpty(pData.rate)) {
			_tgtDom.find('.ico_star span').css({width: pData.rate*20});
			_tgtDom.find('.n').html(pData.rate.toFixed(1));
		}
		else {
			_tgtDom.find('.ico_star span').css({width: 0});
			_tgtDom.find('.n').html('0.0');
		}

		// 공연후기 이미지 표시
		if (0 < JsonUtils.length(pData.list)) {

			var _ds = [], _di = [];
			$.each(pData.list, function(i, o) {
				_di.push('<li><a href="#"><img src="http://'+ActionHandler.HOST_CDN+o.imgUrl+'" alt="'+o.imgDescr+'" /></a></li>');
			});

			_ds.push('<div class="btn"><a href="#">공연 셋리스트 듣기<span class="ico_comm ico_mvplay"></span></a></div>');
			_ds.push('<div class="box_slide">');
			_ds.push('<div class="inner"><ul>');
			_ds.push(_di.join(''));
			_ds.push('</ul></div>');
			_ds.push('<div class="paging"><strong>2</strong> / <em>20</em></div>');
			_ds.push('<button class="btn_prev"><span class="btn_comm btn_photo_prev"></span></button>');
			_ds.push('<button class="btn_next"><span class="btn_comm btn_photo_next"></span></button>');
			_ds.push('</div>');

			_tgtDom.find('.wrap_photozone').html(_ds.join(''));
		}

		function pagingSet (param,content,allNumber,onNumber,prevBtn,nextBtn) {
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

		// 로딩완료 이벤트 핸들링
		_tgtDom.find('.list_review:first').on('completeCommentLoad', function(e, d) {
			$('ul.list_detail li.no5 span.num').text(d.pageInfo.totalCnt);
		});
	},

	/**
	 * 탭 - 리뷰 초기화
	 */
	_initTabReview = function() {
		CommentAction.initReview({
			targetListSelector: '#commentListArea',
			targetWriteSelector: '#commentWriteArea',
			targetNodataSelector: '#commentNodataArea',
			targetStarPointSelector: '#starPointArea',
			targetReviewContsSelector: '#reviewContsArea'
		});
	},

	/**
	 * 탭 - QNA 초기화
	 */
	_initTabQna = function() {
		CommentAction.initQna({
			targetListSelector: '#commentListArea',
			targetWriteSelector: '#commentWriteArea',
			targetNodataSelector: '#commentNodataArea',
		});
	},

	/**
	 * 탭 - 공연장 Dom 구성
	 *
	 * @param pData
	 */
	_drawTabPlace = function(pData) {
		var _d = ActionHandler._getData('place.index');		//	hall ID get
		var _tgtDom = $('#veiw_tab_wrap');
		var _hallInfo = null;
		var tPdata = pData;		// pData 임시저장
		
		if( JsonUtils.isNotEmpty(pData.placeHallVoList)) {
			$.each(pData.placeHallVoList, function(i, a) {
				if(_d.hallId == a.hallId){
					_hallInfo = a;
				}
			});
		}
		if(_hallInfo != null){
			$(".box_concert_area").find(".tit_detail").append(" "+_hallInfo.name);
	
			if((_hallInfo.locLati != null && _hallInfo.locLati != undefined) || (_hallInfo.locLogi != null && _hallInfo.locLogi != undefined)){
				_hallInfo.name = pData.name+' '+_hallInfo.name;
				_hallInfo.addr = pData.addr;
				pData = _hallInfo;	// 홀정보 있을시 홀정보로 업데이트
			}else{
				pData.name = pData.name+' '+_hallInfo.name;
			}
		}

		if(pData.locLati != null || pData.locLogi != null ){
			$(".box_concert_map").show();
			// 마커 위치
			var marker = {
			    position: new daum.maps.LatLng(pData.locLati, pData.locLogi)
			};

			// 이미지 지도를 생성합니다
			var staticMap = new daum.maps.StaticMap(document.getElementById('map_api'), {
				center: new daum.maps.LatLng(pData.locLati, pData.locLogi), // 이미지 지도의 중심좌표
		        level: 3, // 이미지 지도의 확대 레벨
		        marker: marker // 이미지 지도에 표시할 마커
			});

			// 지도 로딩 후 자동완성되는 링크 팝업핸들링으로 교체
			daum.maps.load(function() {
				_tgtDom.find('#map_api').find('a').unload('click').on('click', function(e) {
					e.preventDefault();

					_tgtDom.find('#btnPopupPlace').trigger('click');
				});
			});

			// 지도팝업 바인딩
			_tgtDom.find('#btnPopupPlace').attr({
				'data-key': 'place.popup',
				'data-json-string': JSON.stringify(pData)
			});
		}else{
			$(".box_concert_map").hide();
		}

		// 지도 노출후 pData 원복
		pData = tPdata;
		
		

		// 공연홀 정보 // 비노출처리 공연장 홀 분리 작업
//		_tgtDom.find('.box_concerthall_info').show();
//		_tgtDom.find('.hall_info_box').html('');
//		$.each(pData.placeHallVoList, function(_i, _v) {
//			var _ds = [], _name = '', _cnt = '';
//
//			// 홀명
//			if( StringUtils.isNotEmpty( _v.name ) ) {
//				_name = _v.name;
//			}
//			else {
//				_name = pData.name;
//			}
//
//			// 좌석 수
//			if( StringUtils.isNotEmpty(  _v.seatCnt ) ) {
//				_cnt = StringUtils.numberFormat( _v.seatCnt );
//			}
//			_ds.push('<li>· ' + _name + (_cnt == 0 ? '' : ' : <strong>' + _cnt + '석</strong></li>'));
//
//			_tgtDom.find('.hall_info_box').append( _ds.join('') );
//		});

		//번호 & 홈페이지
		if( StringUtils.isNotEmpty( pData.tn ) ) {
			_tgtDom.find('#place_tn').attr('href', 'tel:' + pData.tn);
			_tgtDom.find('#place_tn').html('<span>' + pData.tn + '</span>');
		} else {
			_tgtDom.find('#tn_section').hide();
		}

		if( StringUtils.isNotEmpty( pData.homepage )) {
			//_tgtDom.find('#place_homepage').attr('href', pData.homepage);
			_tgtDom.find('#place_homepage').html('<span class="ellipsis">' + pData.homepage + '</span>');

			if(mstApp.isApp()){
				_tgtDom.find('#place_homepage').unbind('click.placehome').on('click.placehome', function(e){
					e.preventDefault();
					$(this).blur();
					mstApp.openWeb(pData.homepage);
				});
			}else{
				_tgtDom.find('#place_homepage').attr('href', pData.homepage);
			}

		} else {
			_tgtDom.find('#homepage_section').hide();
		}

		// 공연장 내부 지도
		if( StringUtils.isNotEmpty( pData.mapImg ) ) {
			var _img = ImageUtils.getPlaceImageBig(pData.mapImg);
			_img.setAlt(pData.name);

			_tgtDom.find('#parking_map').replaceWith(_img.toString());
		} else {
			_tgtDom.find('#mapImg_section').hide();
		}

		// 찾아가는 길
		var _route = [], DEFAULT_TEXT = '';
		console.log("pData.routeMetro : "+pData.routeMetro);
		console.log("StringUtils.isNotEmpty( pData.routeMetro ) : "+StringUtils.isNotEmpty( pData.routeMetro ));

		if( StringUtils.isNotEmpty( pData.routeMetro ) &&  pData.routeMetro.replace(/(<([^>]+)>)/ig,"").trim()  !== DEFAULT_TEXT ) {
			_tgtDom.find('#routeMetro').html( pData.routeMetro );
			_route.push( pData.routeMetro );
		} else {
			_tgtDom.find('#routeMetro').parent().hide();
		}


		if( StringUtils.isNotEmpty( pData.routeBus ) &&  pData.routeBus.replace(/(<([^>]+)>)/ig,"").trim()  !== DEFAULT_TEXT ) {
			_tgtDom.find('#routeBus').html( pData.routeBus );
			_route.push( pData.routeBus );
		} else {
			_tgtDom.find('#routeBus').parent().hide();
		}

		if( _route.length < 1 ) {
			_tgtDom.find('#traffic_section').hide();
		}

		//주차안내
		if( StringUtils.isNotEmpty( pData.parkingInfo ) && pData.parkingInfo.replace(/(<([^>]+)>)/ig,"").trim()  !== DEFAULT_TEXT ) {
			_tgtDom.find('#parkingInfo').html( pData.parkingInfo );
		} else {
			_tgtDom.find('#parkingInfo_section').hide();
		}

		// 부대시설
		if( StringUtils.isNotEmpty( pData.facilityInfo ) && pData.facilityInfo.replace(/(<([^>]+)>)/ig,"").trim()  !== DEFAULT_TEXT ) {
			_tgtDom.find('#facilityInfo').html( pData.facilityInfo );
		} else {
			_tgtDom.find('#facilityInfo_section').hide();
		}


		// 공연장 이미지
		var _listPi = pData.placeImgVoList;

		if(0 < JsonUtils.length(_listPi)) {
			_tgtDom.find('#place_img_cnt').html(JsonUtils.length(_listPi));

			var _ds = [];
			$.each( _listPi, function(_i, _v) {
				var _dsSub = [], _ab, _img;

				if( _i == 0 ){
					_dsSub.push('<li class="first">');
				} else {
					_dsSub.push('<li>');
				}

				_img = ImageUtils.getPlaceImageBig(_v.imageUrl);
				_img.setAlt();

				_dsSub.push('<a href="#action">');
				_dsSub.push('<span class="croping cropimg">');
				_dsSub.push(_img.toString());
				_dsSub.push('</span>');
				_dsSub.push('</a></li>');

				_dsSub = $(_dsSub.join(''));

				_ab = new ActionBuilder();
				_ab.setActionType('popup');
				_ab.setTarget('/common/pop_viewer.html');
				_ab.setKey('common.viewer');
				_ab.setJson({
					type: 'I',
					page: _i + 1,
					title: '공연장 이미지',
					data: pData.placeImgVoList
				});
				_ab.bind(_dsSub.find('a'));

				_ds.push(_dsSub);


			});

			_tgtDom.find('.list_thumb').append(_ds);

			// 이미지 스크롤
			var width = $('.list_thumb').children().width() * ($('.list_thumb').children().length+1);
			$('.list_thumb').css('width', width);

			// 공연장 이미지 배너
			var docWidth = 152;
		    var sTarget = $('.box_concert_img .box_thumb .list_thumb li');
		    var sTargetLength = $(sTarget).length;
		    $(sTarget).parent().width(docWidth*sTargetLength);
		    myScroll = new IScroll('.box_thumb', {
		    	disablePointer: true,
		        scrollX: true,
		        snap: false,
		        snapSpeed: 400,
		        keyBindings: true,
		        eventPassthrough: true, //추가 속성
		        preventDefault: false //추가 속성
		    });

		    // 공연장 이미지 crop
			ImageUtils.placeCroping('list_thumb');

		} else {
			// 공연장 이미지 없음
			_tgtDom.find('.box_cont.box_concert_img').hide();
		}

	},

	/**
	 * 탭 - 공연장 초기화
	 */
	_initTabPlace = function() {

		var _d = ActionHandler._getData('place.index');

		placeModel
			.deliver(_drawTabPlace)
			.getPlaceDetail({
				data: _d,
				target: $('#veiw_tab_wrap')
			});
	},

	/**
	 * 탭 - 유의사항 초기화 Dom 구성
	 */
	_drawTabNote = function(pData) {
		var _tgtDom = $('#veiw_tab_wrap');

		// 패키지 문구 노출
		if (PROD_TYPE_CODE_PKG === pData.prodTypeCode) {
			_tgtDom.find('#noticeForPackage').show();
			_tgtDom.find('#noticeForProd').remove();
		}
		// 티켓상품 문구 노출
		else {
			_tgtDom.find('#noticeForProd').show();
			_tgtDom.find('#noticeForPackage').remove();
		}

		// 판매자
		if (StringUtils.isNotEmpty(pData.announcePartnerInfo)) {
			_tgtDom.find('#announcePartnerInfo').text(pData.announcePartnerInfo);
		}

		// 고객센터
		if (StringUtils.isNotEmpty(pData.csInfo)) {
			_tgtDom.find('#csInfo').text(pData.csInfo).attr('href', 'tel:1899-0042');
		}

		// 유효기간 / 이용조건
		if (StringUtils.isNotEmpty(pData.periodInfo)) {
			_tgtDom.find('#validPeriodInfo').text(pData.periodInfo + ' (예매한 공연 회차에 한해 이용 가능)');
		}

		// 이용가능장소
		if (StringUtils.isNotEmpty(pData.placeName)) {

			var _vp = pData.placeName;

			if (pData.availPlaceInfo) {
				_vp += pData.availPlaceInfo;
			}

			_tgtDom.find('#validPlaceInfo').text(_vp);
		}
	},

	/**
	 * 탭 - 유의사항 취소수수료 Dom 구성
	 */
	_drawTabNoteCancelFee = function(pData) {

		var _tgtDom = $('#refundCondInfo'), _ds = [], _dsSub = [];

		if (JsonUtils.isEmpty(pData)) {
			return false;
		}

		$.each(pData, function(i, o) {
			var _s = o.split('||');

//			_dsSub = [];
			_dsSub.push('<tr>');
			_dsSub.push('<td>'+ _s[0] +'</td>');
			_dsSub.push('<td>'+ _s[1] +'</td>');
			_dsSub.push('</tr>');
		});

		_ds.push('<table class="table_cancel" style="width:100%;">');
		_ds.push('<caption class="ir2">취소일에 따른 취소수수료 안내</caption>');
		_ds.push('<colgroup><col style="width:45%;"><col style="width:55%;"></colgroup>');
		_ds.push('<thead><tr><th scope="col">취소일</th><th scope="col">취소수수료</th></tr></colgroup>');
		_ds.push('<tbody>');
		_ds.push(_dsSub.join(''));
		_ds.push('</tbody></table>');

		_tgtDom.replaceWith(_ds.join(''));
	},

	/**
	 * 탭 - 유의사항 초기화
	 */
	_initTabNote = function() {
            performanceModel
                .deliver(_drawTabNote)
                .getPerformanceDetail();

            performanceModel
                .deliver(_drawTabNoteCancelFee)
                .listCancelFee();
	},

	/**
	 * 탭 - 탭메뉴 고정 스크립트
	 */
	_initFixMenuScroll = function() {
		var _tgtBody = $('body');

//		window.onscroll = function(){
//			var scrollTop = $(window).scrollTop();
//			var coverHeight = _tgtBody.find('.cover_page .body').outerHeight() - 96;
//			var coverContHeight = _tgtBody.find('.fixed_body .fixed_cont').outerHeight() + coverHeight;
//
//			if (scrollTop >= coverHeight ) {
//				_tgtBody.addClass('fix');
//			}
//			else {
//				_tgtBody.removeClass('fix');
//			}
//			if (scrollTop >= coverContHeight ) {
//				_tgtBody.addClass('fix_menu');
//
//				var _tgtDom = $('#topDetailTab');
//
//				if (_tgtDom.data('bindScroll')) {
//					return false;
//				}
//
//				// 상단 탭 메뉴 스크롤 이벤트 바인딩
//				myScroll = new IScroll('#topDetailTab', {
//			        scrollX:true,
//			        scrollY:true,
//			        mouseWheel:true,
//			        eventPassthrough:true, //추가 속성
//			        preventDefault:false, //추가 속성
//			    });
//				_tgtDom.data('bindScroll', true);
//			}
//			else {
//				_tgtBody.removeClass('fix_menu');
//			}
//
//			if (100 < window.scrollY) {
//	            //$('#fixed_bottom').find('a[href=#btnTop],a[href=#btnPrev]').show();
//	            $('#fixed_bottom').find('a[href=#btnTop]').show();
//	        }
//	        else {
//	            $('#fixed_bottom').find('a[href=#btnTop],a[href=#btnPrev]').hide();
//	        }
//
//		};

		//var mTopSetting = _tgtBody.find('.cover_page').height() + 96;
		//var mHeaderSetting = _tgtBody.find('#header').height();
		//if (mTopSetting >= mHeaderSetting){
		//	//var _rateHeight = _tgtBody.width() * (440/ 720).toFixed(2); //최종 440으로 변경 20160401
		//	////_tgtBody.find('.fixed_body').css('margin-top', _rateHeight);
		//	//_tgtBody.find('.cover_bg:last').css('height', _rateHeight);
		//	////_tgtBody.find('.wrap_header_content').css('height', _rateHeight);
        //
		//	//20160425 수정
		//	_tgtBody.find('.cover_bg:last').css('height', 220);
		//}else{
		//	_tgtBody.find('.fixed_body').css('margin-top', mHeaderSetting);
		//}

		window.onscroll = doThisStuffOnScroll;
		function doThisStuffOnScroll() {
			var scrollTop = $(window).scrollTop();
			var coverHeight = $('.cover_page .body').outerHeight() - 56;
			var coverContHeight = $('.fixed_body .fixed_cont').outerHeight() + coverHeight;
			if (scrollTop >= coverHeight ) {
				$('body').addClass('fix');
			}
			else {
				$('body').removeClass('fix');
			}
			//console.log(scrollTop, coverContHeight);
			if (scrollTop >= coverContHeight ) {
				$('body').addClass('fix_menu');
				/* 20160217 : 시작 디테일 텝이 실제 2개가 구종되는 소스일 경우 다음 소스를 해당 위치에 삽입 */
				//setTimeout(function(){detailTab('#topDetailTab');},300);
				/* 20160217 : 끝*/


				$('#detailTab').addClass('fixed');

			}
			else {
				$('body').removeClass('fix_menu');
				$('#detailTab').removeClass('fixed');
			}
		}

		setTimeout(doThisStuffOnScroll,200);
		var mTopSetting = $('.cover_page').height() + 56;
		var mHeaderSetting = $('#header').height();
		if (mTopSetting >= mHeaderSetting){
			$('.fixed_body').css('margin-top',mTopSetting)
			//20160425 수정
			_tgtBody.find('.cover_bg:last').css('height', 220);
		}else{
			$('.fixed_body').css('margin-top',mHeaderSetting)
			_tgtBody.find('.fixed_body').css('margin-top', mHeaderSetting);
		}
	},

	/**
	 * 팝업 - 할인정보 Dom 구성
	 *
	 * @param pData
	 */
	_drawPopupSaleInfo = function(pData) {
		var _tgtObj = $('.sale_price_btn'), _offset = _tgtObj.offset(), _height = _tgtObj.height();

	    $('.layer_dc_price').css({
	    	'top': _offset.top + (_height*2 - 7),
	    });

		if (0 < JsonUtils.length(pData.gradelist)) {

			var _ds = [];

			$.each(pData.gradelist, function(i, o) {

				_ds.push('<div class="tit_s">'+o.gradeName+'</div>');

				if (StringUtils.isNotEmpty(o.priceList)) {
					var _dsSub = [];

					$.each(o.priceList, function(ia, oa) {
						_dsSub.push('<li><span class="txt"><span>'+oa.priceName+'</span></span>');
						_dsSub.push('<span class="price"><span>'+StringUtils.numberFormat(oa.price)+'원</span></span></li>');
					});

					_ds.push('<ul class="list_dc_price">');
					_ds.push(_dsSub.join(''));
					_ds.push('</ul>');
				}
			});

			$('#listSaleInfo').html(_ds.join(''));
		}

	    _tgtObj.blur();
	},

	_drawPopupDcCardInfo = function(pData) {

		var _tgtObj = $('#interestBtn'), _offset = _tgtObj.offset(), _height = _tgtObj.height();

		$('.layer_chargeSale').css({
	    	'top': _offset.top + (_height*2 - 7),
	    });
		var _ds = [];

		if (0 < JsonUtils.length(pData.dcCardList)) {
			var _dsSub = [];

			$.each(pData.dcCardList, function(i, o) {

				_dsSub.push('<dt>'+o.DISPLAYNAME+'</dt>');
				_dsSub.push('<dd><p>'+o.DCCONTENT+'<br>('+o.DCSTARTDT+'~'+o.DCENDDT+')</p></dd>');
			});

			_ds.push('<dl class="card_list">');
			_ds.push(_dsSub.join(''));
			_ds.push('</dl>');

			$('#listDcInfo').html(_ds.join(''));
		}

		_tgtObj.blur();
//		$('.layer_chargeSale').show();

	},

	/**
	 * 팝업 - 할인정보 초기화
	 */
	_initPopupSaleInfo = function(pData) {
		var _d = ActionHandler._getData('grade.list');

		if($("[class^=layer]").size() > 1){
			$("[class^=layer]:first").remove();
		}

		_drawPopupSaleInfo(_d);
//		performanceModel
//			.deliver(_drawPopupSaleInfo)
//			.listTicketType({
//				prodId: ActionHandler._getData().prodId,
//	    		pocCode: POC_TYPE_CODE_MOBILE
//			});
	},

	_initPopupInterestInfo = function(pData) {

		var _d = ActionHandler._getData('dcCard.list');

		if($("[class^=layer]").size() > 1){
			$("[class^=layer]:first").remove();
		}

		_drawPopupDcCardInfo(_d);
	},

	/**
	 * 팝업 - 쿠폰 다운로드 초기화
	 */
	_initPopupCouponDownload = function() {
		var _d = ActionHandler._getData('coupon.list');

		if (JsonUtils.isEmpty(_d)) {
			return false;
		}

		var _ds = [];

		$.each(_d, function(i, o) {

			var _dsSub = [], _op = [];
			// HACK : 20160526 할인금액기 '0'원 일 경우 노출되지않게
			if (StringUtils.isNotEmpty(o.maxOrderPrice) && o.maxOrderPrice != '0원 까지 할인 가능') {
				_op.push('<li>'+o.maxOrderPrice+'</li>');
			}

			_dsSub.push('<li>');
			_dsSub.push('<div class="wrap_coupon">');
			_dsSub.push('<div class="flag">할인쿠폰</div>');
			_dsSub.push('<div class="name">'+o.cupnName+'</div>');
			_dsSub.push('<div class="dc"><span class="inner">'+o.cupnDiscPrice+'</span><span class="coupon coupon1">사용<br />완료</span></div>');
			_dsSub.push('<div class="day">'+o.cupnPeriodDate+'</div>');
			_dsSub.push('<ul class="list_dot">');
			_dsSub.push(_op.join(''));
			_dsSub.push('</ul>');
			_dsSub.push('<div class="link"><a href="#btnDownload">쿠폰 다운받기</a></div>');
			_dsSub.push('</div>');
			_dsSub.push('</li>');

			_dsSub = $(_dsSub.join(''));

			_dsSub.find('a').data({
				cupnId: o.cupnId,
				prodId: o.prodId,
				useStartDate: o.useStartDate,
				useEndDate: o.useEndDate
			});

			// 쿠폰 다운로드 이벤트 바인딩
			_dsSub.find('a').on('click', function(e) {
				e.preventDefault();

				// 로그인 여부 확인
				if (!ActionHandler._confirmLogin()) {
					return false;
				}

				var _o = $(this), _da = _o.data();

				couponModel
					.deliver(function(d) {
						if(StringUtils.isNotEmpty(d.message)) {
							ActionHandler.toast(d.message);
						}
					})
					.download(_da);
			});

			_ds.push(_dsSub);
		});

		$('#list_advace_coupon').html(_ds);
	},

	/**
	 * 팝업 - 관련음악 Dom 구성
	 *
	 * @param pData - 관련음악 데이터
	 */
	_drawPopupRelationMusic = function(pData) {
		var _td = false, _ds = [], _tgtDom = $('#box_music_cont');

		$.each( pData.list, function( _i, _v ){
			var _info = _v.displayInfo;


			if( _td === true &&  _info !== null && _info !== '') {
				_td = false;
				_ds.push('</ol>');
				_ds.push('</div>');
			}

			if( _td === false && _info !== null && _info !== '' ){
				_td = true;
				_ds.push('<div class="view_music_box">');
				_ds.push('<p class="theme">' + _v.displayInfo + '</p>');
				_ds.push('<ol class="list_music">');
			}

			if( _i === 0 && ( _info === null || _info === '' )) {
				_td = true;
				_ds.push('<div class="view_music_box">');
				_ds.push('<ol class="list_music">');
			}

			if( _td === true  ) {
				_ds.push('<li>');
				_ds.push('<a href="#action" data-song-id="'+_v.songId+'">');
				_ds.push('<span class="rank">');
				_ds.push('<strong class="ranking">' + ( _i + 1 ) + '</strong><span class="ir2">위</span>');
				_ds.push('</span>');
				_ds.push('<span class="txt">'); // albumNameWebList
				_ds.push('<em class="tit_con"><span class="tit_icon">TITLE</span>' + _v.songNameWebList + '</em>');
				_ds.push('<strong class="tit_sub">' + _v.artistNameBasket + '</strong>');
				_ds.push('</span>');
				_ds.push('</a>');
				_ds.push('</li>');
			}

			if( _i  === ( pData.length + 1) ) {
				_ds.push('</ol>');
				_ds.push('</div>');
			}
		});

		// 곡 재생 이벤트 바인딩
		_ds = $(_ds.join(''));
		_ds.find('a').each(function(i, o) {
			var _o = $(o), _songId = _o.data('songId');

			_o.on('click', function(e) {
				e.preventDefault();

				AlbumAction.playSong(_songId);
			});
		});

		//전체듣기 이벤트 바인딩
		$('.app_all_play').on('click', function(e){
			e.preventDefault();
			var _songIds = [];
			_ds.find('a').each(function(i, o) {
				var _o = $(o);
				_songIds.push(_o.data('songId'));
			});
			AlbumAction.playSongs(_songIds);
		});

		_tgtDom.find('.box_music').html(_ds);
		_tgtDom.find('.view_album_box').hide();
		_tgtDom.find('.box_music').show();
	},

	/**
	 * 팝업 - 관련앨범 Dom 구성
	 *
	 * @param pData - 관련앨범 데이터
	 */
	_drawPopupRelationAlbum = function(pData) {

		var _td = false, _ds = [], _ab, _tgtDom = $('#box_music_cont');

		$.each( pData.list, function( _i, _v ){
			var _dsSub = [], _img;

			_img = ImageUtils.getAlbumImage(_v.albumImgPath);
			_img.setAlt(_v.albumRepNm);

			_dsSub.push('<li>');
			_dsSub.push('<a href="#action">');
			_dsSub.push('<span class="album">');
			_dsSub.push(_img.toString());
			_dsSub.push('<span class="theme">' + _v.typeCodeDesc  + '</span>');
			_dsSub.push('<span class="play_btn">재생</span>');
			_dsSub.push('</span>');
			_dsSub.push('<span class="txt">');
			_dsSub.push('<em class="tit_name">' + _v.albumRepNm + '</em>');
			_dsSub.push('<strong class="singer">' + _v.repArtistNameBasket + '</strong>');
			_dsSub.push('</span></a></li>');

			_dsSub = $(_dsSub.join(''));

			// 클릭 이벤트 핸들링
			_dsSub.find('a').on('click', function(e){
				e.preventDefault();

				var _o = $(this).data('json');

				// 앨범 리스트 재생
				//AlbumAction.playAlbumMove( _o.albumId, _o.albumITitle );
				AlbumAction.playAlbum( {albumId:_o.albumId });
			});

			_ab = new ActionBuilder();
			_ab.setJson({
				albumId: _v.albumId,
				albumITitle: _v.albumRepNm
			});
			_ab.bind(_dsSub.find('a'));

			_ds.push(_dsSub);
		});

		_tgtDom.find('.list_album').html(_ds);
		_tgtDom.find('.box_music').hide();
		_tgtDom.find('.view_album_box').show();
	},

	/**
	 * 팝업 - 관련음악 초기화
	 *
	 * @param pData
	 */
	_initPopupRelationMusic = function() {
		var _tgtDom = $('#box_music_cont'),
			_o = ActionHandler._getData('perform.pop_realation_music');

		// 관련음악 탭 내용 없는 경우 disabled
		if( undefined !== _o ) {
			var _album = _o.data.album, _song = _o.data.song;

			if( 1 > JsonUtils.length(_album) ) {
				$('#radio-rel-album').attr('disabled', true);
			}
			if( 1 > JsonUtils.length(_song) ) {
				$('#radio-set-list').attr('disabled', true);
			}
		}

		if(JsonUtils.isNotEmpty(_o)) {

			var _ds = [];
			_ds.push( _o.title );
			_ds.push('<span class="icon">더보기</span></a>');

			_tgtDom.find('#pop_title').html(_ds.join(''));

			// 탭 json-string
			_tgtDom.find('#radio-set-list').data({"prodId": _o.prodId, "typeCode" : "song"});
			_tgtDom.find('#radio-rel-album').data({"prodId": _o.prodId, "typeCode" : "album"});

			foruModel
				.deliver(_o.typeCode === 'song' ? _drawPopupRelationMusic : _drawPopupRelationAlbum)
				//.relationMusic(_o);
				.relationMusic({prodId: _o.prodId, typeCode: _o.typeCode});

			// 탭 활성화
			if (_o.typeCode === 'song') {
				_tgtDom.find('#radio-set-list').attr('checked', true);
				_tgtDom.find('#all_play_popup').show();
			}
			else {
				_tgtDom.find('#radio-rel-album').attr('checked', true);
				_tgtDom.find('#all_play_popup').hide();
			}
		}

		// 관련 음악 탭 클릭
		_tgtDom.find('input[name=radio-choice-h-2]').on('click', function(e) {
			var _p = $(this).data();

			// 전체 듣기
			if( _p.typeCode === 'song' ) {
				_tgtDom.find('#all_play_popup').show();
			} else {
				_tgtDom.find('#all_play_popup').hide();
			}

			foruModel
				.deliver(_p.typeCode === 'song' ? _drawPopupRelationMusic : _drawPopupRelationAlbum)
				.relationMusic(_p);

		});
	},

	/**
	 * 포토&영상 더보기 팝업 초기화
	 */
	_initPopupMedia = function() {
		var _tgtDom = $('#popMedia'), _d = ActionHandler._getData('popup.media'), _ds = [];

	    $.each(_d.data, function(i, o) {

	    	var _dsSub = [], _ab, _img;

	    	_img = ImageUtils.getMediaImage(o.imageUrl);
	    	_img.setClass('img_thm');
			_img.setAlt(o.title);

		    if (MEDIA_TYPE_VIDEO === o.mediaType) {
		    	_dsSub.push('<li class="movie">');
		    	_dsSub.push('<a href="#action">');
		        _dsSub.push('<span class="ico_comm ico_movie"></span>');
		        //_dsSub.push('<span class="e_thm">')
		        _dsSub.push(_img.toString());
//		        _dsSub.push('</span></a></li>');
		        _dsSub.push('</a></li>');
		    }
		    else if (MEDIA_TYPE_SONG === o.mediaType) {
		    	_dsSub.push('<li class="photo">');
		    	_dsSub.push('<a href="#action">');
		    	//_dsSub.push('<span class="e_thm">')
		        _dsSub.push(_img.toString());
		    	//_dsSub.push('</span></a></li>');
		    	_dsSub.push('</a></li>');
		    }

		    _dsSub = $(_dsSub.join(''));

		    _ab = new ActionBuilder();
	        _ab.setActionType('popup');
	        _ab.setTarget('/common/pop_viewer.html');
	        _ab.setKey('common.viewer');
	        _ab.setJson({
	            type: 'M',
	            page: i + 1,
	            title: _d.title,
	            data: _d.data
	        });
		    _ab.bind(_dsSub.find('a'));

		    _ds.push(_dsSub);
	    });

	    _tgtDom.find('#listPhotoViewer').html(_ds);
	    _tgtDom.find('#labelCnt').text(_d.data.length);

	    var photoListViewSet = function(){
	        var photoTarget = $('#listPhotoViewer li a');
	        var photoTargetW = photoTarget.width();
	        var photoTargetH = photoTarget.height();
	        photoTarget.height(photoTargetW);
	        var photoTargetImg = $('#listPhotoViewer .img_thm');
	        $(photoTargetImg).each(function(i) {
	            var w = $(photoTargetImg[i]).width();
	            var h = $(photoTargetImg[i]).height();
	            if ( w >= h ) {
	                $(photoTargetImg[i]).height(photoTargetW);
	            }else{
	                $(photoTargetImg[i]).width(photoTargetW);
	            }
	        });
	    }();

	    $(window).resize(function(){
	        photoListViewSet();
	    });
	},

	/**
	 * 쿠키 저장 ( 검색 > 최근 본 공연 노출 )
	 *
	 * @param pData
	 * @returns
	 */
	_logLatestView = function(pData) {

		if (JsonUtils.isEmpty(pData)) {
			return null;
		}

		// 공연쿠키 리턴
		this.getPerfCookie = function() {
			var _pw = getCookie( 'search.perf' ), _wa = _pw.split(',');
			var _i = $.inArray('', _wa);

			if ( _i > -1 ) {
				_wa.splice( _i, 1);
			}

			if( _wa.length > 5 ) {
				_wa.splice( 0, 1);
			}

			return _wa;
		}

		// 공연쿠키 저장
		this.setPerfCookie = function(pId) {
			var _wa = getPerfCookie();

			_wa.push(pId);

			setCookie( 'search.perf', _wa, 365, "/", ".melon.com");
		}

		var _idx = $.inArray( pData.prodId.toString() , getPerfCookie());

		if( _idx < 0 ) {
			setPerfCookie( pData.prodId );
		}

		return pData;
	},

	_initPerformance = function() {
		//넷퍼넬 설정임. 값 고치지 말것.
		setCookie("NetFunnel_ID", "WP15", 0, "/", ".melon.com");

		performanceModel
			.deliver(_drawPerformance)
			.bindPerformanceDetail();

	},

	_showReview = function() {
		var _stDt = null;
		var now = new Date().getTime();
		var _dtStart = 0;
		try {
			if (detailData != null) {
				_stDt = StringUtils.parseStartDt(detailData.periodInfo);
				_dtStart = _stDt.getTime();
			}else{
				performanceModel
					.deliver(function(pData){
						_stDt = StringUtils.parseStartDt(pData.periodInfo);
						_dtStart = _stDt.getTime();
					})
					.bindPerformanceDetail();
			}
		}catch(e){
			_dtStart = new Date().getTime();
		}
		return _dtStart <= now;
	},

	_initCoopPopup = function(prodId) {
//		var coop = getParams().coop;
//		var prodId = getParams().prodId;
		var coop = getCookie('coop');
		var coop_funnel = getCookie('coop_funnel');
		var tkt_fk = getCookie('tkt_fk');
		var cupnPopDp = getCookie('coop.pop.id');
		var cbo = getCookie('cbo');

		if(StringUtils.isNotEmpty(coop) && StringUtils.isNotEmpty(coop_funnel) && StringUtils.isNotEmpty(tkt_fk) && StringUtils.isEmpty(cupnPopDp) && StringUtils.isNotEmpty(cbo)){
			$.ajax({
				url : 'http://tktapi.melon.com/poc/saleCupn/cupnBanner.json',
				type : 'get',
				xhrFields : {withCredentials : true},
				data : {v : 1, prodId : prodId, coop : coop},
				dataType : 'json',
				success : function(d) {
					if(d.result == 0){
						if(d.data.BANNEROPENYN == "Y"){
							var _cupnIds = new Array();
							var _couponCnt = d.data.BANNERLIST.length;
                            var _couponEle = '';
                            var _commentList = '';
                            $.each(d.data.BANNERLIST, function(i, o) {
                                if(0 === i) {
                                    if(StringUtils.isNotEmpty(o.COMMENT1)) {
                                        _commentList+= '<P>'+o.COMMENT1+'</P>';
                                    }
                                    if(StringUtils.isNotEmpty(o.COMMENT2)) {
                                        _commentList+= '<P>'+o.COMMENT2+'</P>';
                                    }
                                    if(StringUtils.isNotEmpty(o.COMMENT3)) {
                                        _commentList+= '<P>'+o.COMMENT3+'</P>';
                                    }
                                }

                                var _minPriceTxt = null!=o.MINPRICE ? o.MINPRICE+'원 이상 결제 시':'';
                                var _maxDiscCntTxt = 0<o.MAXDISCCNT ? '최대 '+o.MAXDISCCNT+'매 까지':'';
                                var _commaTxt = 0<_minPriceTxt.length&&0<_maxDiscCntTxt.length?', ':'';

                                _couponEle+= '<a href="javascript:;" class="box_discount_coupon" id="cupnDownBtn'+o.CUPN_ID+'">';
                                _couponEle+= '<div class="flag">할인쿠폰</div>';
                                _couponEle+= '<div class="box_dc_num">'+o.DISC_AMOUNT+'</div>';
                                _couponEle+= 0<_minPriceTxt.length || 0<_maxDiscCntTxt.length ? '<div class="box_dc_text">('+_minPriceTxt+_commaTxt+_maxDiscCntTxt+')</div>':'';
                                _couponEle+= '</a>';
                                _cupnIds[i] = o.CUPN_ID;
                            });

							ActionHandler._getTemplate({
								key: '/common/pop_coop.html',
								callback: function(d) {
									var _b = $(d);

									// 닫기버튼 셋팅
									_b.find('.close').on('click', function() {
										if(_b.find('input[type=checkbox]').is(":checked")){
											setCookie( 'coop.pop.id', _cupnIds, 1, "/", ".melon.com");
										}

										setCookie("cbo","", -1, "/", ".melon.com");
										_b.remove();

										$('html').removeClass('layer_html_control');//바닥화면 스크롤 방지 제거
										$('body').removeClass('layer_html_control');
									});

									// 쿠폰 엘리먼트 셋팅
                                    _b.find("div[id=commArea]").before(_couponEle);

									// 배너 하단 텍스트 셋팅
									_b.find("div[id=commArea]").append(_commentList);

                                    $.each(_cupnIds, function(i, o) {
                                        // 쿠폰다운로드 버튼 셋팅
                                        _b.find('a[id=cupnDownBtn'+o+']').on('click', function(){
                                            _coopCupnIssued(prodId,o,false);
                                        });
                                    });

                                    // 한번에 받기 셋팅
                                    if (2 < _couponCnt) {
                                        _b.find("div[id=commArea]").after('<a href="#" class="coupon_download" id="cupnAllDown">쿠폰 한번에 다운받기</a>');
                                        _b.find('a[id=cupnAllDown]').on('click', function(){
                                            _coopCupnIssued(prodId,_cupnIds,true);
                                        });
                                    }

									_b.appendTo('body');

									$('html').addClass('layer_html_control');
									$('body').addClass('layer_html_control');
									window.scrollTo(0,0)

									setCookie("cbo","", -1, "/", ".melon.com");
								}
							});
						}
					}
				},
				error : function(e) {
				}
			});
		}
	},

	_coopCupnIssued = function(prodId, cupnId, isAll) {
        if(0 < cupnClickCnt) {
            ActionHandler.alert({
                message:'이전 요청이 처리 중입니다.'
            });
            return;
        }
		if(isMelonLogin()) { // 로그인 확인
            var _reqUrl = "http://tktapi.melon.com/poc/saleCupn/coopCupnIssued.json";
            if(isAll) _reqUrl = "http://tktapi.melon.com/poc/saleCupn/receiveCoopCupnByAll.json";
			$.ajax({
				url : _reqUrl,
				type : 'get',
				xhrFields : {withCredentials : true},
				data : {v : 1, prodId : prodId, cupnId : cupnId},
				dataType : 'json',
				success : function(d) {
                    cupnClickCnt = 0;
					ActionHandler.alert({
						callback: function(){
							$(".layer_comm .close").click();
							$('html').removeClass('layer_html_control');//바닥화면 스크롤 방지 제거
							$('body').removeClass('layer_html_control');
						},
						message:d.message
					});
				},
				error : function() {
                    cupnClickCnt = 0;
                    ActionHandler.alert({
                        message:'서비스가 지연되고 있습니다. 잠시 후 다시 시도해주시기 바랍니다.'
                    });
				}
			});
		}else{
			if (!ActionHandler._confirmLogin()) {
				return false;
			}
		}
	},

	_setCookieCoop = function() {
		var coop = getParams().coop;
		var coop_funnel = getParams().coop_funnel;
		var prodId = getParams().prodId;

		if(document.referrer.indexOf('m.ticket.melon.com') < 0){
			setCookie("coop","", -1, "/", ".melon.com");	// 제휴사 코드
			setCookie("coop_funnel","", -1, "/", ".melon.com");	// 인입 경로코드
			setFkCookie("tkt_fk","", -1, "/", ".melon.com");	// 만료 여부판단
			setCookie("cbo","", -1, "/", ".melon.com");	//	팝업노출 여부판단
		}

		if(undefined !== coop && coop !== null && undefined !== coop_funnel && coop_funnel !== null){
			setCookie("coop",coop, 0, "/", ".melon.com");
			setCookie("coop_funnel",coop_funnel, 0, "/", ".melon.com");
			setFkCookie("tkt_fk","0", 3, "/", ".melon.com");
			setCookie("cbo","0", 0, "/", ".melon.com");
		}
		_initCoopPopup(prodId);
	},

	_initSurveyPop = function(_id){

		//hard coding
		//2017 박효신 설문조사 ID 제한 100010, 100133, 상용 - 200356
		//2018.01.22 몬스타X 설문조사 : dev-100191, test - 100080, QA - 100189, 릴리즈 - 200344, 상용 - 201418
		if(_id === '100191' ||_id === '100080' || _id === '100189'|| _id === '200344' || _id === '201418') {

			var showSurveyPop = function(){
				ActionHandler._getTemplate({
					key: '/performance/pop_survey.html',
					callback: function(d) {
						var _b = $(d);

						// 닫기버튼 셋팅
						_b.find('.close').on('click', function() {
							_b.remove();

							$('html').removeClass('layer_html_control');//바닥화면 스크롤 방지 제거
							$('body').removeClass('layer_html_control');
						});

						_b.find("#surveyId").val(_id+"02");
						_b.find("#prodId").val(_id);

						_b.appendTo('body');

						$('html').addClass('layer_html_control');
						$('body').addClass('layer_html_control');
						window.scrollTo(0,0)
					}
				});
			}

			//서베이 링크 바인딩 여기 추가.
			$('#surveyBtn').unbind().bind('click', function(){
				if(isMelonLogin()){
					showSurveyPop();
				}else{
					if (!ActionHandler._confirmLogin()) {
						return false;
					}
				}
			});

			if (getParams().surveyId !== undefined && getParams().surveyId !== '') {
				//call show survey popup
				showSurveyPop();
			}
		}
	},

	_initTabstatus = function(pData){
		var sTarget = $("#detailTab li");

		if(pData.data.length < 1){
			return false;
		}

		$.each(pData.data, function(i, o) {
			var eType = o.EVENTTYPECODE;
			if(eType == 'R'){
				sTarget.find("#revFlg").show();
			}else if(eType == 'G'){
				sTarget.find("#eveFlg").show();
			}
		});
	},

	_initPopupBridge = function() {
		var _tgtDom = $('#bridgeList'), _data = ActionHandler._getData('bridge.list');

		var _ds = [];
		$.each( _data.list, function(i, o) {
			var _dsSub = [], _pl = [], _ab;

			if (StringUtils.isNotEmpty(o.placeName)) {
				_pl.push(o.placeName);
			}
			if (StringUtils.isNotEmpty(o.availPlaceInfo)) {
				_pl.push(o.availPlaceInfo);
			}
			if (0 < _pl.length) {
				_pl = '<span class="place">'+_pl.join(' ')+'</span>';
			}

			_dsSub.push('<li>');
			_dsSub.push('<a href="#">');
			_dsSub.push('<h4>'+o.title+'</h4>');
			_dsSub.push('<div>');
			_dsSub.push('<span>'+o.periodInfo+'</span>');
			_dsSub.push(_pl);
			_dsSub.push('</div>');
			_dsSub.push('</a>');
			_dsSub.push('</li>');

			_dsSub = $(_dsSub.join(''));

			_ab = new ActionBuilder();
			_ab.setActionType(ActionHandler.ACTION_TYPE_LINK);
			_ab.setTarget('performance.index');
			_ab.setJson({prodId: o.prodId});
			_ab.bind(_dsSub.find('a'));

			_ds.push(_dsSub);

		});
		$('#bridgeList').html(_ds);

		includeDoThisStuffOnScroll();

		ActionHandler.addEvent(document);
	},

	_initPopupLink = function() {
		var _tgtDom = $('#popupLink'), _data = ActionHandler._getData('popup.link');

		$.each( _data.linkUrl, function(i, o) {
			if(o == ""){
				$("#"+i).remove();
			}
		});

		_tgtDom.find('a').on('click', function(e) {

			var _ab;
			var _id = $(this).parent().attr("id");
			var _url;

			$.each( _data.linkUrl, function(i, o) {
				if(i == _id){
					_url = o;
				}
			});
			if($(this).parent().attr("data-action-type") == undefined){
				_ab = OfferAction.getActionByLandingType("U", _url);
				_ab.bind($("#"+_id));
			}
		});

	},

	_mobRfShop = function(pData){
		var sh = new EN();

		sh.setData("sc", "ef86b4d09e1113d0e7659a710c1947d8");
		sh.setData("userid", "melonticket");
		sh.setData("pcode", pData.prodId);	//상품번호
		sh.setData("pnm", encodeURIComponent(encodeURIComponent(pData.title)));
		sh.setData("img", encodeURIComponent("http://cdnticket.melon.co.kr"+pData.posterImg));   //전체URL
		sh.setData("price","0");
		sh.setData("cate1",pData.perfTypeCode);
		sh.setSSL(true);
		sh.sendRfShop();

	},
	
	/**
	 * 인증예매[CAPTCHA]  팝업 (초기진입시 활성화 처리)
	 */
	_drawPopupCertification = function(){
		ActionHandler._getTemplate({
			key: '/common/pop_certification.html',
			callback: function(d) {
				var _b = $(d);
				$('html, body').addClass('layer_html_control');
				window.scrollTo(0,0);
				_b.appendTo('body');
				
				_b.find('.close').on('click', function() {
					_b.hide();
					$('html, body').removeClass('layer_html_control');
				});
			}
		});
	}
	
	return {
			checkIsfavorite: function( prodId ) {
				performanceModel
					.deliver(_checkIsFavorite)
					.getIsFavorite( {prodId : prodId} );
			},
			checkCouponDownload: function( prodId ) {
				couponModel
					.deliver(_drawCouponDownload)
					.listCouponByProd( {prodId : prodId, channel: 'M'} );
			},
			checkExistBanner: function() {
				offerModel
					.deliver(_drawPerformanceBanner)
					.getPerformanceBanner();
			},

			setCookieCoop: function(){
				_setCookieCoop();
			},

			// 상세 페이지 진입 초기화
			init: function() {
				var menuId = 1600000040;

				//dfd_detail = new $.Deferred();
				//dfd_setlist = new $.Deferred();
				dfd_detail = $.Deferred();
				dfd_setlist = $.Deferred();

				ReserveAction.reset();

				_initPerformance();        //상품 상세 데이터 가져오기
				this.checkExistBanner();    //상단 띠 베너 Dom 구성

				var _id = ActionHandler._getData('performance.index').prodId;   //prodid 값 가져오기

                this.checkCouponDownload( _id );     //쿠폰 다운로드 버튼 Dom 구성

				if (isMelonLogin()) {
					this.checkIsfavorite( _id );
				}

				// 최초 진입 시 기대평/리뷰/Q&A 카운트 조회를 위해 호출
				_initTabEvalue();
				_initTabReview();
				_initTabQna();

				//check 리뷰 표시 여부(한번 더)
				dfd_detail.done(function(){
					if(!_showReview()){
						$('#detailTab').find('li.no5').hide();
					}

					performanceModel
						.deliver(_initTabstatus)
						.prodByEventInfo();

					offerModel
						.deliver(_drawPerformanceReviewBanner)
						.getPerformanceReviewBanner();

					offerModel
						.deliver(_drawPerformanceEvalueBanner)
						.getPerformanceEvalueBanner();

					//survey popup setting
					_initSurveyPop(_id);
				}).always(function(){
					dfd_detail = null;
				});

				ActionHandler.addEvent(document);

				//setlist 확인
				//get query parameters
				dfd_setlist.done(function(show) {
					var _data = getParams();
					if (_data && _data.typeCode !== undefined) {
						//open set list or album list popup
						if (show === true) {
							setTimeout(function() {
								$('#rel_music_setlist').trigger('click');
							}, 500);
						}
					}
				}).always(function(){
					dfd_setlist = null;
				});

				this.setCookieCoop();

				this.initCoopPopup(_id);

				fbq('track', 'ViewContent');		//	Facebook Script
			},

			// 브릿지 페이지 진입 초기화
			initBridge: function() {
				performanceModel
					.deliver(_drawBridgeList)
					.listBridge();
			},

			// 기획전 페이지 진입 초기화
			initPlan: function() {
				performanceModel
					.deliver(_drawPlanList)
					.listPlan();

				includeDoThisStuffOnScroll();
			},

			// 상세 탭 로딩 초기화
			initTabDetail: function() {
				_initPerformance();
			},

			// 기대평 탭 로딩 초기화
			initTabEvalue: function() {
				_initTabEvalue();
			},

			// 리뷰 탭 로딩 초기화
			initTabReview: function() {
				_initTabReview();
			},

			// QNA 탭 로딩 초기화
			initTabQna: function() {
				_initTabQna();
			},

			// 공연장 탭 로딩 초기화
			initTabPlace: function() {
				_initTabPlace();
			},

			// 유의사항 탭 로딩 초기화
			initTabNote: function() {
				_initTabNote();
			},

			// 할인정보 팝업 초기화
			initPopupSaleInfo: function() {
				_initPopupSaleInfo();
			},

			// 무이자 할인정보 팝업 초기화
			initPopupInterestInfo: function() {
				_initPopupInterestInfo();
			},

			// 쿠폰다운로드 팝업 초기화
			initPopupCouponDownload: function() {
				_initPopupCouponDownload();
			},

			// 관련음악 팝업 초기화
			initPopupRelationMusic: function() {
				_initPopupRelationMusic();
			},

			// 포토&영상 팝업 초기화
			initPopupMedia: function() {
				_initPopupMedia();
			},

			initCoopPopup: function(_id) {
				// _initCoopPopup(_id);
			},

			initPopupBridge: function() {
				_initPopupBridge();
			},

			initPopupLink: function() {
				_initPopupLink();
			}
	};

});


Function.prototype.compose  = function(argFunction) {
//	var invokingFunction = this;
//	return function() {
//		return  invokingFunction.call(this,argFunction.apply(this,arguments));
//	}
	var invokingFunction = this;
	return function() {
		return  argFunction.call(this,invokingFunction.apply(this,arguments));
	}
}