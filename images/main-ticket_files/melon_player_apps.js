//단일 곡  플레이
function __appSongPlay(isBought, menuId, songId, adultFlag)
{
	if (!chkPlay()) return;

	var songType = 1;
	var arrItemType	= new Array();
	var arrItemId = new Array();
	var arrAdultFlag = new Array();

	arrItemType[0] = songType;
	arrItemId[0] = songId;
	arrAdultFlag[0] = adultFlag;

	apps_play(isBought, menuId, arrItemType, arrItemId, arrAdultFlag);

	return;
}


//단일 곡  플레이 (mobile2 in 웹뷰 댓글 재생용)
function apps_song_play(isBought, menuId, songId, adultFlag)
{
	__appSongPlay(isBought, menuId, songId, adultFlag);
}


//서비스별 전곡 플레이
/*function __appSvcSongsPlay(menuId, url)
{
	if (!chkPlay()) return;

	var songType = 1;
	var arrItemType	= new Array();
	var arrItemId = new Array();
	var arrAdultFlag = new Array();

	$.ajax({
		type: "GET",
		url: url,
		async: false,
		cache: false,
		success: function(data) {
			for (var i=0; i<data.rowsList.length; i++)
			{
				arrItemType[i] = songType;
				arrItemId[i] = data.rowsList[i].SONGID;
				arrAdultFlag[i] = getBoolean(data.rowsList[i].ISADULT);
			}
		}
	});

	if (arrItemId.length <= 0)
	{
		alert("재생 가능한 곡이 없습니다.");
		return;
	}

	apps_play(false, menuId, arrItemType, arrItemId, arrAdultFlag);

	return;
}*/

/**
 * 서비스별 전곡 플레이
 *
 * @param menuId
 * @param arrSong		 곡 정보 리스트 ( songId, adultFlg )
 */
function __appSvcSongsPlay(menuId, arrSong)
{
	if (!chkPlay()) return;

	var songType = 1;
	var arrItemType	= new Array();
	var arrItemId = new Array();
	var arrAdultFlag = new Array();

	if( undefined !== arrSong && null !== arrSong ){
		$.each( arrSong, function( _i, _v ) {
			var _id = _v.songId;
			var _af = _v.adultFlg;

			if( _af === 0 ) {
				_af = false;
			} else {
				_af = true;
			}

			arrItemType[_i] = songType;
			arrItemId[_i] = _id;
			arrAdultFlag[_i] = _af;

		});
	}

	if (arrItemId.length <= 0)
	{
		alert("재생 가능한 곡이 없습니다.");
		return;
	}

	apps_play(false, menuId, arrItemType, arrItemId, arrAdultFlag);

	return;
}


//폼내 곡 플레이(현재 뮤직스토리에서만 사용)
function __appFormSongsPlay(boxNm, menuId)
{
	if (!chkPlay()) return;

	var songType = 1;
	var arrItemType	= new Array();
	var arrItemId = new Array();
	var arrAdultFlag = new Array();

	$('#' + boxNm).find('input[name=songid]').each(function(i){
		arrItemType[i] = songType;
		arrItemId[i] = this.value;
	});

	$('#' + boxNm).find('input[name=adultFlg]').each(function(i){
		arrAdultFlag[i] = getBoolean(this.value);
	});

	if (arrItemId.length <= 0)
	{
		alert("재생 가능한 곡이 없습니다.");
		return;
	}

	apps_play(false, menuId, arrItemType, arrItemId, arrAdultFlag);

	return;
}


//단일 MV 플레이
function __appMvPlay(isBought, menuId, mvId, adultFlag, songId)
{
	if (!chkPlay()) return;

	var mvType = 21;
	var arrItemType	= new Array();
	var arrItemId = new Array();
	var arrAdultFlag = new Array();

	arrItemType[0] = mvType;
	arrItemId[0] = mvId;
	arrAdultFlag[0] = adultFlag;

	apps_play(isBought, menuId, arrItemType, arrItemId, arrAdultFlag);

	return;
}

function app_album_move(albumId, albumTitle){
	var urlDest = '', urlParam = '', urlScheme = '', urlMarket = '';
	//안드로이드
	if (POC_ID == "AX25" || POC_ID == "AS47")
	{
		urlScheme = "melonapp://details/album/"+albumId;
		urlMarket = "market://details?id=com.iloen.melon";
		appAndroidLaunch(urlScheme, urlMarket, urlDest);

	}
	//아이폰
	else if (POC_ID == "IX25" || POC_ID == "IS47")
	{
		urlScheme = "meloniphone://S5002/command=albumDetail&param1="+albumId+"&param2="+encodeURI(albumTitle);
		urlMarket = "https://itunes.apple.com/kr/app/mellon-melon/id415597317?mt=8";
		appIphoneLaunch(urlScheme, urlMarket, urlDest, true);
	}
}
/**
 * 플레이한다.
 *
 * @param isBought 구매 목록 페이지인 경우 true, 그 외 페이지는 false
 * @param menuId 메뉴ID(관리자 페이지에서는 "ADMIN")
 * @param itemFlags
 * @param itemIds
 */
function apps_play(isBought, menuId, itemFlags, itemIds, adultFlags)
{
	var PARAM_DELIMITER = ",";
	var ADULT_FLG = "0"; //default:미성년자
	var IS_SUBMIT = true;

	var adultCnt = 0;
	var itemId = "";
	var itemType = itemFlags[0];

	//m.com개편에서는 19금 로직 제외 (스트리밍 주체 인 앱에서 담당)
	for (var i=0; i < itemIds.length; i++)
	{
		if (i != 0) itemIds[i] = PARAM_DELIMITER + itemIds[i];
		itemId = itemId + itemIds[i];
	}
	if (IS_SUBMIT)
	{
		//통계url접속 (callback 무시)
		// statsForST();

		//앱실행
		var urlParam = "";
		var urlScheme = "";
		var urlMarket = "";
		var urlDest = "";

		//안드로이드
		if (POC_ID == "AX25" || POC_ID == "AS47")
		{
			urlParam = "ctype=" + itemType + "&menuid=" + menuId + "&cid=" + itemId;

			urlScheme = "melonapp://play?" + urlParam;
			urlMarket = "market://details?id=com.iloen.melon";
			//appAndroidLaunch(urlScheme, urlMarket, urlDest, true);
			appAndroidLaunch(urlScheme, urlMarket, urlDest);

		}
		//아이폰
		else if (POC_ID == "IX25" || POC_ID == "IS47")
		{
			urlParam = "ctype=" + itemType + "&menuid=" + menuId + "&cid=" + itemId;
			urlScheme = "meloniphone://play?" + urlParam;
			//urlMarket = "itms://itunes.apple.com/kr/app/id415597317?mt=8";
			urlMarket = "https://itunes.apple.com/kr/app/mellon-melon/id415597317?mt=8";
			appIphoneLaunch(urlScheme, urlMarket, urlDest, true);
		}
	}
}

//common
function appLaunch(urlScheme, urlMarket, urlDest){
	if (urlScheme.match('melonapp') != null && 0 < urlScheme.match('melonapp').length) {
		mstApp.existsApp("com.iloen.melon", function(isExist){
			if(isExist === 'true'){
				console.log(urlScheme+" is exist");

				if(urlScheme.indexOf('ctype') > -1 || urlScheme.indexOf('album') > -1){//album추가
				//if(urlScheme.indexOf('ctype') > -1 ){
					mstApp.launchApp(urlScheme);
				}else{
					mstApp.launchApp("com.iloen.melon");
				}

			}else{
				console.log(urlScheme+" is not exist");
				//window.location.replace(urlMarket);
				mstApp.goStore("com.iloen.melon");
			}
		});
	}
	else if (urlScheme.match('aztalk') != null && 0 < urlScheme.match('aztalk').length) {
		mstApp.existsApp("com.iloen.aztalk", function(isExist){
			if(isExist === 'true'){
				console.log(urlScheme+" is exist");
				mstApp.launchApp("com.iloen.aztalk");
			}else{
				console.log(urlScheme+" is not exist");
				//window.location.replace(urlMarket);
				mstApp.goStore("com.iloen.aztalk");
			}
		});

	}
	else if (urlScheme.match('showwing') != null && 0 < urlScheme.match('showwing').length) {
		mstApp.existsApp("com.iloen.showwing", function(isExist){
			if(isExist === 'true'){
				console.log(urlScheme+" is exist");
				mstApp.launchApp("com.iloen.showwing");
			}else{
				console.log(urlScheme+" is not exist");
				//window.location.replace(urlMarket);
				mstApp.goStore("com.iloen.showwing");
			}
		});
	}
	else if (urlScheme.match('melonshopping') != null && 0 < urlScheme.match('melonshopping').length) {
		mstApp.existsApp("com.iloen.melonshopping", function(isExist){
			if(isExist === 'true'){
				console.log(urlScheme+" is exist");
				mstApp.launchApp("com.iloen.melonshopping");
			}else{
				console.log(urlScheme+" is not exist");
				//window.location.replace(urlMarket);
				mstApp.goStore("com.iloen.melonshopping");
			}
		});
	}else{
		//other apps

	}
}

//안드로이드 멜론앱 실행
function appAndroidLaunch(urlScheme, urlMarket, urlDest, mPlay)
{

	if (POC_ID == 'AS47') {

//		if(mPlay === true){
//			//org -> 음원 플레이 기능은 기존것 이용
//			chromeUrlScheme = urlScheme;
//			window.location = chromeUrlScheme;
//
//			var entryTime = +new Date;
//			setTimeout(function () {
//				//앱이 설치되지 않았을 때 동작.
//				if (+new Date - entryTime < 2000)
//				{
//					window.location.replace(urlMarket);
//					return;
//				}
//
//			}, 2500);
//			return;
//		}

		if(mPlay === undefined || mPlay == false){
			//앱인 경우, 뮤직 플레이가 아닌강요
			appLaunch(urlScheme, urlMarket, urlDest);
			return;
		}
	}

	var ua = navigator.userAgent.toLocaleLowerCase();
	var chromeUrlScheme = "";
	//페이스북 웹뷰
	if(ua.indexOf('fban') > -1 || ua.indexOf('fb4a') > -1 || ua.indexOf('fbav') > -1 || ua.indexOf('fb_iab') > -1)
	{
		chromeUrlScheme = urlScheme;
		window.location = chromeUrlScheme;

		var entryTime = +new Date;
		setTimeout(function () {
			//앱이 설치되지 않았을 때 동작.
			if (+new Date - entryTime < 2000)
			{
				window.location.replace(urlMarket);
				return;
			}

		}, 2500);
	}
	//크롬브라우져
	else if (ua.indexOf('chrome') > -1)
	{
		if(ua.indexOf('twitterandroid') > -1){
			window.location.href = urlScheme;
		}else{
			if (!document.webkitHidden && urlDest != "" && urlDest != undefined)
			{
				setTimeout(function() {
					window.location.replace(urlDest);
					return;
				}, 2500);
			}

			// 멜론앱
			if (urlScheme.match('melonapp') != null && 0 < urlScheme.match('melonapp').length) {
				urlScheme = urlScheme.replace("melonapp://", "");
				chromeUrlScheme = "intent://" + urlScheme + "#Intent;scheme=melonapp;package=com.iloen.melon;end";
			}
			// 아지톡
			else if (urlScheme.match('aztalk') != null && 0 < urlScheme.match('aztalk').length) {
				if( urlScheme.indexOf('aztalkapp://') > -1 ){
					urlScheme = urlScheme.replace("aztalkapp://", "");
				}
				if( urlScheme.indexOf('aztalk://') > -1 ){
					urlScheme = urlScheme.replace("aztalk://", "");
				}

				chromeUrlScheme = "intent://" + urlScheme + "#Intent;scheme=aztalkapp;package=com.iloen.aztalk;end";
			}
			// 쇼윙
			else if (urlScheme.match('showwing') != null && 0 < urlScheme.match('showwing').length) {
				urlScheme = urlScheme.replace("showwing://", "");
				chromeUrlScheme = "intent://" + urlScheme + "#Intent;scheme=showwing;package=com.iloen.showwing;end";
			}
			// 쇼핑
			else if (urlScheme.match('melonshopping') != null && 0 < urlScheme.match('melonshopping').length) {
				urlScheme = urlScheme.replace("melonshopping://", "");
				chromeUrlScheme = "intent://" + urlScheme + "#Intent;scheme=melonshopping;package=com.iloen.melonshopping;end";
			}

			window.location.href = chromeUrlScheme;
		}
	}
	//일반브라우져
	else
	{
		//entryTime을 iframe 추가 이후에 두게 되면, 앱 종료후에 다시 돌아와서 시간을 새로 받아서 마켓으로 갈수 있다.
		var iframe = document.createElement("iframe");
		iframe.style.visibility	= "hidden";
		iframe.src = urlScheme;
		var entryTime = +new Date;
		document.body.appendChild(iframe);

		setTimeout(function() {


			//앱이 설치되지 않았을 때 동작.
			if (+new Date - entryTime < 2000)
			{
				window.location.replace(urlMarket);
				return;
			}

			if (urlDest != "" || urlDest != undefined)
			{
				setTimeout(function() {
					window.location.replace(urlDest);
					return;
				}, 2500);
			}

		}, 2500);
	}
}

//아이폰 멜론앱 실행
function appIphoneLaunch(urlScheme, urlMarket, urlDest, _mPlay)
{

	//org -> 음원 플레이 기능은 기존것 이용 -> mPlay = true
	if (POC_ID == 'IS47'){

		if(_mPlay == undefined || _mPlay == false){
			//app only
			mstApp.existsApp(urlScheme, function(isExist){
				if(isExist === 'true'){
					mstApp.launchApp(urlScheme);
				}else{
					mstApp.goStore(urlMarket);
				}
			});
			return;
		}

	}

	var ua = navigator.userAgent.toLocaleLowerCase();

	//사파리 혹은 webkit
	if (ua.indexOf('safari') > -1 || ua.indexOf('is47') > -1)
	{
		//위에것 사용 안하고, 체크 -> 실행만 사용
		if(mstApp.isApp()){
			mstApp.existsApp(urlScheme, function(isExist){
				if(isExist === 'false'){
					mstApp.goStore(urlMarket);
					return;
				}
			});
		}
		window.location.href = urlScheme;

			if(ua.indexOf('is47') < 0){
				var entryTime = +new Date;
				setTimeout(function () {

					//앱이 설치되지 않았을 때 동작.
					if (+new Date - entryTime < 2000)
					{
						window.location.href = urlMarket;
						return;
					}

					if (urlDest != "" || urlDest != undefined)
					{
						setTimeout(function() {
							window.location.replace(urlDest);
							return;
						}, 500);
					}
				}, 500);
			}
	}
	//웹킷(트위터 등)
	else
	{
		//ios5 사파리 웹킷 대응
		if (ua.indexOf('iphone os 5') > -1 || ua.indexOf('iphone os 6') > -1 || ua.indexOf('iphone os 7') > -1 || ua.indexOf('iphone os 8') > -1 || ua.indexOf('iphone os 9') > -1)
		{
			if(ua.indexOf('fban') > -1 || ua.indexOf('fbios') > -1 || ua.indexOf('fbav') > -1 || ua.indexOf('fbbv') > -1)
			{
				var iframe = document.createElement("iframe");
				iframe.style.visibility	= "hidden";
				iframe.src = urlScheme;
				var entryTime = +new Date;
				document.body.appendChild(iframe);

				if( ua.indexOf('is47') < 0){

					setTimeout(function() {

						//앱이 설치되지 않았을 때 동작.
						if (+new Date - entryTime < 2000)
						{
							window.location.replace(urlMarket);
							return;
						}

						if (urlDest != "" || urlDest != undefined)
						{
							setTimeout(function() {
								window.location.replace(urlDest);
								return;
							}, 500);
						}
					}, 500);

				}
			}else{
				window.location.href=urlScheme;
				if( ua.indexOf('is47') < 0){

					var entryTime = +new Date;
					setTimeout(function () {

						//앱이 설치되지 않았을 때 동작.
						if (+new Date - entryTime < 2000)
						{
							window.location.href = urlMarket;
							return;
						}

						if (urlDest != "" || urlDest != undefined)
						{
							setTimeout(function() {
								window.location.replace(urlDest);
								return;
							}, 500);
						}
					}, 1500);
				}
			}

		}
		else
		{
			//entryTime을 iframe 추가 이후에 두게 되면, 앱 종료후에 다시 돌아와서 시간을 새로 받아서 마켓으로 갈수 있다.
			var iframe = document.createElement("iframe");
			iframe.style.visibility	= "hidden";
			iframe.src = urlScheme;
			var entryTime = +new Date;
			document.body.appendChild(iframe);

			if( ua.indexOf('is47') < 0){

				setTimeout(function() {

					//앱이 설치되지 않았을 때 동작.
					if (+new Date - entryTime < 2000)
					{
						window.location.replace(urlMarket);
						return;
					}

					if (urlDest != "" || urlDest != undefined)
					{
						setTimeout(function() {
							window.location.replace(urlDest);
							return;
						}, 500);
					}
				}, 500);

			}
		}
	}
}


//스트리밍 체크 (단말군별)
function chkPlay()
{
	//android
	if (POC_ID == "AX25")
	{
		//under ver2.1
		if (ANDROID_VERSION == "2.1")
		{
			alert("모바일 웹에서는 지원하지 않습니다.\n앱을 실행하셔서 이용하시기 바랍니다.");
			return false;
		}
	}
	//android app
	else if (POC_ID == "AS47") {}
	//iphone
	else if (POC_ID == "IX25") {}
	//iPhone app
	else if (POC_ID == "IS47") {}
	//blackberry
	else if (POC_ID == "YS20")
	{
		alert("이용 중인 기기에서는 지원하지 않습니다.");
		return false;
	}
	//bada
	else if (POC_ID == "BS20")
	{
		alert("모바일 웹에서는 지원하지 않습니다.\n앱을 실행하셔서 이용하시기 바랍니다.");
		return false;
	}
	//etc
	else
	{
		alert("이용 중인 기기에서는 지원하지 않습니다.");
		return false;
	}

	return true;
}

//ST 통계수집 용 url접속 (callback 무시)
function statsForST()
{
	$.ajax({
		type: "GET",
		url: "/cds/support/mobile2/stats_st.htm",
		async: false,
		cache: false,
		success: function(data) {}
	});
}

//단일 곡 다운로드
function __appSongDown()
{
	var menuId = $('input[name="menuid"]').val();
	var songId = $('input[name="songid"]').val();
	//blackberry
	if (POC_ID == "YS20")
	{
		alert("이용 중인 기기에서는 지원하지 않습니다.");
	}else{
		goBuyProduct('streamForm', songId, '3C0001', 'songid', '0', menuId);
	}
}

//앨범 다운로드
function __appAlbumDown()
{
	var menuId = $('input[name="menuid"]').val();
	var albumId = $('input[name="albumid"]').val();

	//blackberry
	if (POC_ID == "YS20")
	{
		alert("이용 중인 기기에서는 지원하지 않습니다.");
	}else{
		goBuyProduct('streamForm', albumId, '3B0001', 'albumid', '0', menuId);
	}
}

//called by app (앨범수록곡 받기 for Event)
function __appAlbumEventDown(albumId, isOnly)
{
	var menuId = $('input[name="menuid"]').val();
	var albumId = $('input[name="albumid"]').val();
	var isOnly = $('input[name="isOnly"]').val();
	var onlyFlg = (isOnly)?0:1;

	//blackberry
	if (POC_ID == "YS20")
	{
		alert("이용 중인 기기에서는 지원하지 않습니다.");
	}else{
		goBuyFromEvent('streamForm', albumId, '3B0001', 'albumid', '0', menuId, onlyFlg);
	}
}

//boolean값 호출 (컨텐츠 성인여부 판단 용, false가 아닌 'false'로 올 경우를 대비 boolean타입으로 강제교체)
function getBoolean(s)
{
	var b = false;
	if (typeof(s) == "boolean") b = s;
	else if (typeof(s) == "string")
	{
		if (s == "true") b = true;
		else if (s == "false") b = false;
		else return;
	}
	else return;

	return b;
}


//안드로이드 멜론앱 실행
function appMlcpAndroidLaunch(urlScheme)
{
	var ua = navigator.userAgent.toLocaleLowerCase();
	var chromeUrlScheme = "";

	//페이스북 웹뷰
	if(ua.indexOf('fban') > -1 || ua.indexOf('fb4a') > -1 || ua.indexOf('fbav') > -1 || ua.indexOf('fb_iab') > -1)
	{
		setTimeout(function () {
			chromeUrlScheme = urlScheme;
			window.location = chromeUrlScheme;
			var entryTime = +new Date;
			setTimeout(function () {
				//앱이 설치되지 않았을 때 동작.
				if (+new Date - entryTime < 2000)
				{
					return;
				}

			}, 1500);
		},1500);

	}
	else if (ua.indexOf('chrome') > -1)
	{
		if(ua.indexOf('twitterandroid') > -1){
			window.location.href = urlScheme;
		}else{
			urlScheme = urlScheme.replace("melonapp://", "");
			chromeUrlScheme = "intent://" + urlScheme + "#Intent;scheme=melonapp;package=com.iloen.melon;end";
			window.location.href = chromeUrlScheme;
		}
	}
	//일반브라우져
	else
	{
		//entryTime을 iframe 추가 이후에 두게 되면, 앱 종료후에 다시 돌아와서 시간을 새로 받아서 마켓으로 갈수 있다.
		var iframe = document.createElement("iframe");
		iframe.style.visibility	= "hidden";
		iframe.src = urlScheme;
		var entryTime = +new Date;
		document.body.appendChild(iframe);
		setTimeout(function() {
			//앱이 설치되지 않았을 때 동작.
			if (+new Date - entryTime < 2000)
			{
				return;
			}
		}, 1500);
	}
}

//아이폰 멜론앱 실행
function appMlcpIphoneLaunch(urlScheme)
{
	var ua = navigator.userAgent.toLocaleLowerCase();
	//사파리 혹은 webkit
	if (ua.indexOf('safari') > -1 || ua.indexOf('is47') > -1)
	{
		window.location.href = urlScheme;

		var entryTime = +new Date;
		setTimeout(function () {
			//앱이 설치되지 않았을 때 동작.
			if (+new Date - entryTime < 2000)
			{
				return;
			}

		}, 1500);
	}
	//웹킷(트위터 등)
	else
	{
		//ios5 사파리 웹킷 대응
		if (ua.indexOf('iphone os 5') > -1 || ua.indexOf('iphone os 6') > -1 || ua.indexOf('iphone os 7') > -1 || ua.indexOf('iphone os 8') > -1 || ua.indexOf('iphone os 9') > -1)
		{

			if(ua.indexOf('fban') > -1 || ua.indexOf('fbios') > -1 || ua.indexOf('fbav') > -1 || ua.indexOf('fbbv') > -1)
			{
				var iframe = document.createElement("iframe");
				iframe.style.visibility	= "hidden";
				iframe.src = urlScheme;
				var entryTime = +new Date;
				document.body.appendChild(iframe);

				setTimeout(function() {

					//앱이 설치되지 않았을 때 동작.
					if (+new Date - entryTime < 2000)
					{
						return;
					}

				}, 1500);
			}else{
				window.location.href = urlScheme;
				var entryTime = +new Date;
				setTimeout(function () {

					//앱이 설치되지 않았을 때 동작.
					if (+new Date - entryTime < 2000)
					{
						return;
					}

				}, 1500);
			}

		}
		else
		{
			//entryTime을 iframe 추가 이후에 두게 되면, 앱 종료후에 다시 돌아와서 시간을 새로 받아서 마켓으로 갈수 있다.

			var iframe = document.createElement("iframe");
			iframe.style.visibility	= "hidden";
			iframe.src = urlScheme;
			var entryTime = +new Date;
			document.body.appendChild(iframe);

			setTimeout(function() {

				//앱이 설치되지 않았을 때 동작.
				if (+new Date - entryTime < 2000)
				{
					return;
				}

			}, 1500);
		}
	}
}
//아이폰 아지톡앱 실행
function appAztalkIphoneLaunch(urlScheme)
{

	var ua = navigator.userAgent.toLocaleLowerCase();
	var urlMarket ="https://itunes.apple.com/us/app/mellon-ajitog/id897927737?l=ko&ls=1&mt=8";

	//사파리 혹은 webkit
	if (ua.indexOf('safari') > -1 || ua.indexOf('is47') > -1)
	{
		window.location.href = urlScheme;
		var entryTime = +new Date;
		setTimeout(function () {
			//앱이 설치되지 않았을 때 동작.
			if (+new Date - entryTime < 2000)
			{
				window.location.href = urlMarket;
				/*window.location.href = "http://aztalk.melon.com/aztalk/promotion/web/promotion_introduce.htm?pageDp=SER";*/
				return;
			}

		}, 1500);
	}
	//웹킷(트위터 등)
	else
	{
		//ios5 사파리 웹킷 대응
		if (ua.indexOf('iphone os 5') > -1 || ua.indexOf('iphone os 6') > -1 || ua.indexOf('iphone os 7') > -1 || ua.indexOf('iphone os 8') > -1 || ua.indexOf('iphone os 9') > -1)
		{
			window.location.href = urlScheme;
			var entryTime = +new Date;
			setTimeout(function () {

				//앱이 설치되지 않았을 때 동작.
				if (+new Date - entryTime < 2000)
				{
					window.location.href = urlMarket;
					/*window.location.href = "http://aztalk.melon.com/aztalk/promotion/web/promotion_introduce.htm?pageDp=SER";*/
					return;
				}

			}, 1500);
		}
		else
		{
			//entryTime을 iframe 추가 이후에 두게 되면, 앱 종료후에 다시 돌아와서 시간을 새로 받아서 마켓으로 갈수 있다.

			var iframe = document.createElement("iframe");
			iframe.style.visibility	= "hidden";
			iframe.src = urlScheme;
			var entryTime = +new Date;
			document.body.appendChild(iframe);

			setTimeout(function() {

				//앱이 설치되지 않았을 때 동작.
				if (+new Date - entryTime < 2000)
				{
					window.location.href = urlMarket;
					/*window.location.href = "http://aztalk.melon.com/aztalk/promotion/web/promotion_introduce.htm?pageDp=SER";*/
					return;
				}

			}, 1500);
		}
	}
}
//안드로이드 아지톡앱 실행
function appAztalkAndroidLaunch(urlScheme)
{
	var ua = navigator.userAgent.toLocaleLowerCase();
	var urlMarket = "market://details?id=com.iloen.aztalk";
	var chromeUrlScheme = "";

	//페이스북 웹뷰
	if(ua.indexOf('fban') > -1 || ua.indexOf('fb4a') > -1 || ua.indexOf('fbav') > -1 || ua.indexOf('fb_iab') > -1)
	{
		chromeUrlScheme = urlScheme;
		window.location = chromeUrlScheme;

		var entryTime = +new Date;
		setTimeout(function () {
			//앱이 설치되지 않았을 때 동작.
			if (+new Date - entryTime < 2000)
			{
				window.location.replace(urlMarket);
				return;
			}

		}, 1500);
	}
	//크롬브라우져
	else if (ua.indexOf('chrome') > -1)
	{
		if( urlScheme.indexOf('aztalkapp://') > -1 ){
			urlScheme = urlScheme.replace("aztalkapp://", "");
		}
		if( urlScheme.indexOf('aztalk://') > -1 ){
			urlScheme = urlScheme.replace("aztalk://", "");
		}

		chromeUrlScheme = "intent://" + urlScheme + "#Intent;scheme=aztalkapp;package=com.iloen.aztalk;end";
		window.location.href = chromeUrlScheme;
	}
	//일반브라우져
	else
	{
		//entryTime을 iframe 추가 이후에 두게 되면, 앱 종료후에 다시 돌아와서 시간을 새로 받아서 마켓으로 갈수 있다.
		var iframe = document.createElement("iframe");
		iframe.style.visibility	= "hidden";
		iframe.src = urlScheme;
		var entryTime = +new Date;
		document.body.appendChild(iframe);
		setTimeout(function() {
			//앱이 설치되지 않았을 때 동작.
			if (+new Date - entryTime < 2000)
			{
				window.location.href = "http://aztalk.melon.com/aztalk/promotion/web/promotion_introduce.htm?pageDp=SER";
				return;
			}
		}, 1500);
	}
}

//아지톡에서 사용 [아이폰 멜론앱 실행]
function appMlcpAztIphoneLaunch(urlScheme)
{
	var ua = navigator.userAgent.toLocaleLowerCase();
	var urlMarket = window.location.href="https://itunes.apple.com/us/app/mellon-ajitog/id897927737?l=ko&ls=1&mt=8";

	//사파리 혹은 webkit
	if (ua.indexOf('safari') > -1 || ua.indexOf('is47') > -1)
	{
		window.location.href = urlScheme;

		var entryTime = +new Date;
		setTimeout(function () {
			//앱이 설치되지 않았을 때 동작.
			if (+new Date - entryTime < 2000)
			{
				window.location.href = urlMarket;
				/*window.location.href = "http://aztalk.melon.com/aztalk/promotion/web/promotion_introduce.htm?pageDp=SER";*/
				return;
			}

		}, 1500);
	}
	//웹킷(트위터 등)
	else
	{
		//ios5 사파리 웹킷 대응
		if (ua.indexOf('iphone os 5') > -1 || ua.indexOf('iphone os 6') > -1 || ua.indexOf('iphone os 7') > -1 || ua.indexOf('iphone os 8') > -1 || ua.indexOf('iphone os 9') > -1)
		{
			window.location.href = urlScheme;

			var entryTime = +new Date;
			setTimeout(function () {

				//앱이 설치되지 않았을 때 동작.
				if (+new Date - entryTime < 2000)
				{
					window.location.href = urlMarket;
					/*window.location.href = "http://aztalk.melon.com/aztalk/promotion/web/promotion_introduce.htm?pageDp=SER";*/
					return;
				}

			}, 1500);
		}
		else
		{
			//entryTime을 iframe 추가 이후에 두게 되면, 앱 종료후에 다시 돌아와서 시간을 새로 받아서 마켓으로 갈수 있다.

			var iframe = document.createElement("iframe");
			iframe.style.visibility	= "hidden";
			iframe.src = urlScheme;
			var entryTime = +new Date;
			document.body.appendChild(iframe);

			setTimeout(function() {

				//앱이 설치되지 않았을 때 동작.
				if (+new Date - entryTime < 2000)
				{
					window.location.href = urlMarket;
					/*window.location.href = "http://aztalk.melon.com/aztalk/promotion/web/promotion_introduce.htm?pageDp=SER";*/
					return;
				}

			}, 1500);
		}
	}

}

/*
var SCHEME_FOR_TEST = 'intent://open#Intent;scheme=;end';
var ua = navigator.userAgent,
    isAndroid = /android/i.test(ua),
    isIOS = /iphone|ipad|ipod/i.test(ua),
    isSupportingIntent = (
        tui.util.browser.chrome &&
        +(tui.util.browser.version) > 24 &&
        !(/firefox|opr|fb_iab/i.test(ua))
    );

var loader = tui.util.defineModule('appLoader', {
    isPrepared: false,

    isNotSupportedFallbackURL: false,

    initialize: function() {
        if (isAndroid) {
            if (isSupportingIntent) {
                this._checkSupportingFallbackURL();
                this.load = this._launchAppViaIntent;
            } else {
                this.load = this._launchAppViaIframe;
            }
        } else if (isIOS) {
            //...
        } else {
            alert('run in mobile');
        }
    },

    setParams: function(params) {
        this.appURI = params.appURI;
        this.fallbackURL = params.fallbackURL;
    },

    _createHiddenIframe: function() {
        var iframe = document.createElement('IFRAME');

        iframe.style.display = 'none';
        return iframe;
    },

    _launchAppViaIframe: function() {
        var iframe = this._createHiddenIframe(),
            start = +new Date(),
            self = this;

        iframe.src = self.appURI;
        iframe.addEventListener('load', function onload() {
            iframe.removeEventListener('load', onload);
            document.body.removeChild(iframe);
        });
        document.body.appendChild(iframe);

        setTimeout(function() {
            var now = +new Date();
            if (now - start < 2000) {
                top.location.href = self.fallbackURL;
            }
        }, 500);
    },

    _checkSupportingFallbackURL: function() {
        var iframe = this._createHiddenIframe(),
            self = this;

        iframe.addEventListener('load', function onload() {
            if (iframe.src === SCHEME_FOR_TEST) {
                self.isNotSupportedFallbackURL = true;
            } else {
                iframe.removeEventListener('load', onload);
                document.body.removeChild(iframe);
                self.isPrepared = true;
            }
        });
        iframe.src = SCHEME_FOR_TEST;

        document.body.appendChild(iframe);
        setTimeout(function() {
            iframe.src = '';
        }, 100);
    },

    _launchAppViaIntent: function() {
        var popup,
            self = this;

        if (!this.isPrepared) {
            setTimeout(this.load.bind(this), 100);
            return;
        }

        if (!this.isNotSupportedFallbackURL) {
            window.location.href = self.appURI;
            return;
        }

        popup = window.open('');
        if (popup) {
            popup.addEventListener('unload', function onUnload() {
                setTimeout(function () {
                    if (popup.opener) {
                        popup.opener.location.href = self.fallbackURL;
                    }
                }, 10);
                popup.close();
                popup.removeEventListener('unload', onUnload);
            });
            popup.location.href = this.appURI.replace(/package=.*?;/, '');
        } else {
            alert('팝업 허용해주세요');
        }
    },

    load: function() {
        alert('load() is not implemented!');
    }
});
*/