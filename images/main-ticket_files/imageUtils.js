/**
 * Image Utils
 */
define(['util/ticketImage'], function(TicketImage) {

	/** CDN HOST - 티켓 POC */
	var HOST_CDN = "cdnticket.melon.co.kr";
	/** CDN HOST - 메타 */
	var HOST_CDN_IMG = "cdnimg.melon.co.kr";

	/** */
	var IMAGE_TYPE_POSTER_BIGEST = 10;
	var IMAGE_TYPE_POSTER_BIG = 11;
	var IMAGE_TYPE_POSTER = 12;
	var IMAGE_TYPE_POSTER_SMALL = 13;

	var IMAGE_TYPE_MAN_BIGEST = 20;
	var IMAGE_TYPE_MAN_BIG = 21;
	var IMAGE_TYPE_MAN = 22;
	var IMAGE_TYPE_MAN_SMALL = 23;
	var IMAGE_TYPE_MAN_SMALLEST = 24;

	var IMAGE_TYPE_MEDIA_BIG = 30;
	var IMAGE_TYPE_MEDIA = 31;

	var IMAGE_TYPE_PLACE_BIG = 40;
	var IMAGE_TYPE_PLACE = 41;

	var IMAGE_TYPE_ALBUM = 50;

	var IMAGE_TYPE_HOME_FORU = 100;

	var NO_IMAGE_URL_POSTER_BIGEST = 'http://cdnticket.melon.co.kr/resource/image/mobile/noImg/posternoImg_312x420.png';
	var NO_IMAGE_URL_POSTER_BIG = 'http://cdnticket.melon.co.kr/resource/image/mobile/noImg/posternoImg_272x384.png';
	var NO_IMAGE_URL_POSTER = 'http://cdnticket.melon.co.kr/resource/image/mobile/noImg/posternoImg_204x288.png';
	var NO_IMAGE_URL_POSTER_SMALL = 'http://cdnticket.melon.co.kr/resource/image/mobile/noImg/posternoImg_136x192.png';

	var NO_IMAGE_URL_MAN_BIGEST = 'http://cdnticket.melon.co.kr/resource/image/mobile/noImg/artistnoImg_224x224.png';
	var NO_IMAGE_URL_MAN_BIG = 'http://cdnticket.melon.co.kr/resource/image/mobile/noImg/artistnoImg_188x188.png';
	var NO_IMAGE_URL_MAN = 'http://cdnticket.melon.co.kr/resource/image/mobile/noImg/artistnoImg_172x172.png';
	var NO_IMAGE_URL_MAN_SMALL = 'http://cdnticket.melon.co.kr/resource/image/mobile/noImgartistnoImg_152x152.png';
	var NO_IMAGE_URL_MAN_TINY = 'http://cdnticket.melon.co.kr/resource/image/mobile/noImg/artistnoImg_132x132.png';

	var NO_IMAGE_URL_MEDIA_BIG = 'http://cdnticket.melon.co.kr/resource/image/mobile/noImg/photonoImg_312x234.png';
	var NO_IMAGE_URL_MEDIA = 'http://cdnticket.melon.co.kr/resource/image/mobile/noImg/photonoImg_272x204.png';

	var NO_IMAGE_URL_PLACE_BIG = 'http://cdnticket.melon.co.kr/resource/image/mobile/noImg/photonoImg_272x204.png';
	var NO_IMAGE_URL_PLACE = 'http://cdnticket.melon.co.kr/resource/image/mobile/noImg/photonoImg_180x135.png';

	var NO_IMAGE_URL_ALBUM = 'http://cdnticket.melon.co.kr/resource/image/mobile/noImg/photonoImg_96x96.png';

	//var NO_IMAGE_URL_HOME_FORU = 'http://cdnticket.melon.co.kr/resource/image/mobile/noImg/covernoImg_720x500.png';
	//var NO_IMAGE_URL_HOME_FORU = 'http://cdnticket.melon.co.kr/resource/image/mobile/noImg/photonoImg_504x350.png';
	var NO_IMAGE_URL_HOME_FORU = 'http://cdnticket.melon.co.kr/resource/image/mobile/noImg/photonoImg_504x308.png';

	/** 포토영상 크롭 비율 */
	var CROP_IMAGE_RATE_MOVIE = 0.75;

	/** 공연장 이미지 크롭 비율 */
	var CROP_IMAGE_RATE_PLACE = 0.75;

	/** 관련공연 크롭 비율 */
	var CROP_IMAGE_RATE_PERFORMANCE = 1.78;

	var _getPosterImageBig = function(pUrl) {
		return _getImage(IMAGE_TYPE_POSTER_BIG, pUrl);
	},

	_getPosterImageSmall = function(pUrl) {
		return _getImage(IMAGE_TYPE_POSTER_SMALL, pUrl);
	},

	_getPosterImage = function(pUrl) {
		return _getImage(IMAGE_TYPE_POSTER, pUrl);
	},

	_getManImage = function(pUrl) {
		return _getImage(IMAGE_TYPE_MAN, pUrl);
	},

	_getMediaImage = function(pUrl) {
		return _getImage(IMAGE_TYPE_MEDIA, pUrl);
	},

	_getPlaceImage = function(pUrl) {
		return _getImage(IMAGE_TYPE_PLACE, pUrl);
	},

	_getPlaceImageBig = function(pUrl) {
		return _getImage(IMAGE_TYPE_PLACE_BIG, pUrl);
	},

	_getAlbumImage = function(pUrl) {
		return _getImage(IMAGE_TYPE_ALBUM, pUrl);
	},

	_getHomeForuImage = function(pUrl) {
		return _getImage(IMAGE_TYPE_HOME_FORU, pUrl);
	},

	/**
	 * 오류 핸들러를 포함한 이미지 태그 스트링 리턴
	 *
	 * @param pType - 이미지 타입
	 * @param pUrl - 이미지 경로
	 * @returns TicketImage - 티켓 이미지 객체
	 */
	_getImage = function(pType, pUrl) {
		var _this = this, _img, _noImgUrl;

		_img = new TicketImage();

		// 이미지정보 없을경우 No Image 처리 후 리턴
		if (null === pUrl || undefined === pUrl) {
			_img.setSrc(_getNoImageUrl(pType));
			return _img;
		}
		else {
			// CDN HOST 선택
			_img.setSrc('http://'+ (/\/cm?\//.test(pUrl) ? HOST_CDN_IMG : HOST_CDN) + pUrl);
		}

		_noImgUrl = _getNoImageUrl(pType)

		_img.onError('this.src=\''+ _noImgUrl + '\'');

		return _img;
	},

	/**
	 * 이미지 타입별 No-Image 경로 리턴
	 */
	_getNoImageUrl = function(pType) {

		var _url;
		switch (pType) {
		case IMAGE_TYPE_POSTER_BIGEST:
			_url = NO_IMAGE_URL_POSTER_BIGEST;
			break;

		case IMAGE_TYPE_POSTER_BIG:
			_url = NO_IMAGE_URL_POSTER_BIG;
			break;

		case IMAGE_TYPE_POSTER:
			_url = NO_IMAGE_URL_POSTER;
			break;

		case IMAGE_TYPE_POSTER_SMALL:
			_url = NO_IMAGE_URL_POSTER_SMALL;
			break;

		case IMAGE_TYPE_MAN:
			_url = NO_IMAGE_URL_MAN;
			break;

		case IMAGE_TYPE_MEDIA:
			_url = NO_IMAGE_URL_MEDIA;
			break;

		case IMAGE_TYPE_PLACE:
			_url = NO_IMAGE_URL_PLACE;
			break;

		case IMAGE_TYPE_PLACE_BIG:
			_url = NO_IMAGE_URL_PLACE_BIG;
			break;

		case IMAGE_TYPE_ALBUM:
			_url = NO_IMAGE_URL_ALBUM;
			break;

		case IMAGE_TYPE_HOME_FORU:
			_url = NO_IMAGE_URL_HOME_FORU;
			break;
		default:
			break;
		}

		return _url;
	}


	/**
	 *  이미지 CROP
	 *
	 * @param pTargetId	셀렉터 아이디 ( ul .croping img )
	 * @param pRate 조정비율
	 */
    _imageCroping = function( pTargetId,  pRate) {

    	var _this = this, _imgCount = 0, _pRate = pRate;
        var target = $('#' + pTargetId ),
        	frame = target.find(".croping"),
        	targetImg = frame.find("img");

        targetImg.each(function(i, o) {

        	var _o = $(o);

        	_o.attr('data-rate', _pRate);

        	_o.load(function(){
            	if (targetImg.length === _imgCount + 1) {
            		redraw(_pRate);
            	}

            	_imgCount++;
            });
        });

        var wid = null, hei = null;

        var redraw = function(pRate) {
        	var _this = this;

        	var targetImgWid,targetImgHei,targetImgSize;

        	_this.wid = frame.width();
        	_this.hei = Math.floor(_this.wid*pRate);
        	frame.css("height",_this.hei);
        	targetImg.each(function(idx, itm){
        		var _tgtImg = $(itm), _rate = Number(_tgtImg.attr('data-rate'));

                targetImgWid = _tgtImg.width();
                targetImgHei = _tgtImg.height();
                targetImgSize = (targetImgWid >= targetImgHei)? "widthLong" : "heightLong";

                if(targetImgSize === "widthLong"){

                	if (targetImgHei > (targetImgWid*_rate)) {
                		_tgtImg.css({"width":"100%","height":"auto"})
                		pHeight = Math.round((_tgtImg.height()*0.5) - (_this.hei*0.5));
                		_tgtImg.css("margin-top" , "-" + pHeight + "px")
                	}
                	else {
                		_tgtImg.css({"height":"100%","width":"auto"})
                		pWidth = Math.round((_tgtImg.width()*0.5) - (_this.wid*0.5));
                		_tgtImg.css("margin-left" , "-" + pWidth + "px")
                	}
                }else{
                	var pHeight;
                	if (targetImgHei < (targetImgWid*_rate)) {
                		_tgtImg.css({"height":"100%","width":"auto"})
                        pWidth = Math.round((_tgtImg.width()*0.5) - (_this.wid*0.5));
                		_tgtImg.css("margin-left" , "-" + pWidth + "px")
                	}
                	else {
                		_tgtImg.css({"width":"100%","height":"auto"})
                		pHeight = Math.round((_tgtImg.height()*0.5) - (_this.hei*0.5));
                		_tgtImg.css("margin-top" , "-" + pHeight + "px")
                	}
                }
            });
        }

        var resize = function(){
        	var _this = this;
        	$(window).on("resize",function(){
        		redraw();

            });
        };
    }

	return {
		getPlaceImageBig: function(pUrl) {
			return _getPlaceImageBig(pUrl);
		},
		getPlaceImage: function(pUrl) {
			return _getPlaceImage(pUrl);
		},
		getMediaImage: function(pUrl) {
			return _getMediaImage(pUrl);
		},
		getManImage: function(pUrl) {
			return _getManImage(pUrl);
		},
		getPosterImage: function(pUrl) {
			return _getPosterImage(pUrl);
		},
		getPosterImageSmall: function(pUrl) {
			return _getPosterImageSmall(pUrl);
		},
		getPosterImageBig: function(pUrl) {
			return _getPosterImageBig(pUrl);
		},
		getAlbumImage: function(pUrl) {
			return _getAlbumImage(pUrl);
		},
		movieCroping: function(pTarget) {
			return _imageCroping(pTarget, CROP_IMAGE_RATE_MOVIE);
		},
		relatePerformanceCroping: function(pTarget) {
			return _imageCroping(pTarget, CROP_IMAGE_RATE_PERFORMANCE);
		},
		placeCroping: function(pTarget){
			return _imageCroping(pTarget, CROP_IMAGE_RATE_PLACE);
		},
		getHomeForuImage: function(pUrl){
			return _getHomeForuImage(pUrl);
		}
	};
});
