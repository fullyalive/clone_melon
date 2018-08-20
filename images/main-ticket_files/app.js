
var showCnt = 0;
var mstApp = {
    debug : true,
    log: function (log) { if (this.debug) console.log('[debug]' + log); },
    isApp: function () { return navigator.userAgent.match(/mstApp/) != null; },
    //melong app webview여부
    //isMelon: function () {return false;},//return true;/**temp*/},
    isMelon: function () {
        //return true;/**temp*/
        return !this.isApp() && navigator.userAgent.match(/IS40|AS40/) != null;
    },
    version : '',
    getVersion : function() {
        var _ver = '';
        var _getOldVersion = function(){
            var _v = '';
            if(mstApp.isIOS()){
                _v = navigator.userAgent.split('mstApp/')[1].split(';')[0];
            }else{
//                _v = navigator.userAgent.substr(navigator.userAgent.indexOf('AS47')).split(';')[2];
                _v = navigator.userAgent.split('mstApp/')[1].split(';')[0];
            }
            return _v;
        }

        if(!this.isApp()) return "";
        if(_ver.length == 0) {
            //user agent값 변경 이후 수정됨 (1.1.0)
            try {
                if (this.isAndroid()) {
                    _ver = navigator.userAgent.substr(navigator.userAgent.indexOf('AS47')).split(';')[2];
                } else if (this.isIOS()) {
                    _ver = navigator.userAgent.substr(navigator.userAgent.indexOf('IS47')).split(';')[2];
                } else {
                    _ver = '1.0.0';
                }
            } catch (e) {
                //old app version agent parsing
                //this.version = navigator.userAgent.split('mstApp/')[1];
                _ver = _getOldVersion();
            }

            //double check
            if(_ver === undefined || _ver.length == 0){
                _ver = _getOldVersion();
            }
        }

        if(_ver != "" || _ver != undefined){
        	this.version=_ver.trim();	
        }
        
//        this.version=_ver.trim();

        return this.version;
    },
    protocal : 'mstapp://',
    separator : ['{?}', '{&}'],
    isAndroid : function() { return navigator.userAgent.toLowerCase().match(/ipad|iphone/) == null; },
    //isAndroid : function() { return navigator.userAgent.toLowerCase().match(/android/) != null; },
    isAndroidVer : function() { return this.isAndroidversion(navigator.userAgent) },
    isIOS : function() { return navigator.userAgent.toLowerCase().match(/ipad|iphone/) != null; },
    isIOSVer : function() { return this.isIOSversion() },
    command : {
        exists_app : 'exists_app',
        launch_app : 'launch_app',
        goStore : 'go_store',
        openWeb : 'open_web',
        openWebView : 'open_webview',
        simpleLoginAdd : 'simple_login_add',
        simpleLoginList : 'simple_login_list',
        simpleLoginDel : 'simple_login_del',
        regDevice : 'reg_device',
        unregDevice : 'unreg_device',
        setSubWebViewTitle : 'set_sub_web_view_title',
        gpsStatus : 'gps_status',
        moveGps : 'move_gps',
        saveData: 'save_data',
        loadData: 'load_data',
        showNetworkAlert: 'alert_network',
        openHome: 'open_home',
        kakaoLoginList: 'kakao_login_list',
        kakaoLoginButton: 'kakao_login_button',
        kakaoLoginDel: 'kakao_login_del',
        kakaoLoginDelResult: 'kakao_login_del_result',
        kakaoAgreeComplete: 'kakao_agree_complete',
        autoLoginAccountList: 'auto_login_account_list',
        autoLoginAccountAdd: 'auto_login_account_add',
        autoLoginAccountDel: 'auto_login_account_del',
        autoLoginCheckComplete: 'auto_login_check_complete',
        devicePcidInfo: 'device_pcid_info'        
    },

    executeCommand : function () {
        if(!this.isApp()) return;
        var callString = this.protocal + arguments[0];
        for (var i = 1; i < arguments.length; i++) {
            var flag = (i == 1) ? this.separator[0] : this.separator[1];
            callString += flag + arguments[i];
        }

        alert(callString);
    },

    /**
     * appId: app pacakage 경로
     */
    existsApp : function (appId, callback) {
        this.callback = callback;
        this.executeCommand(this.command.exists_app, appId);
    },

    launchApp : function (appId, callback) {
    	this.callback = callback;
        this.executeCommand(this.command.launch_app, appId);
    },
    goStore: function (appId, needsExitApp) {
        if(needsExitApp == undefined) needsExitApp = false;
        if(this.isAndroid()) {
            this.executeCommand(this.command.goStore, appId, needsExitApp);
        } else {
            this.executeCommand(this.command.goStore, appId);
        }
    },

    openWeb: function (url) {
        if(this.isMelon()){
            this.openMelonWebView(url, '');
        }else {
            //ticket app
            this.executeCommand(this.command.openWeb, url);
        }
    },

    openWebView: function (url, title) {

        if(this.isMelon()){
            //melon webview 호출
            this.openMelonWebView(url, title);
        }else {
            this.executeCommand(this.command.openWebView, url, title);
        }
    },

    openHome: function () {
    	this.executeCommand(this.command.openHome);
    },

    simpleLoginAdd : function(id, token) {
        this.executeCommand(this.command.simpleLoginAdd, id, token);
    },

    simpleLoginList : function(callback) {
        this.callback = callback;
        this.executeCommand(this.command.simpleLoginList);
    },

    simpleLoginDel : function(id) {
        this.executeCommand(this.command.simpleLoginDel, id);
    },
    
    kakaoLoginList : function(callback) {
        this.callback = callback;
        this.executeCommand(this.command.kakaoLoginList);
    },
    
    kakaoLoginButton: function (callback) {
    	this.callback = callback;
    	this.executeCommand(this.command.kakaoLoginButton);
    },
    
    kakaoLoginDel : function() {
        this.executeCommand(this.command.kakaoLoginDel);
    },

    kakaoLoginDelResult : function(callback) {
    	this.callback = callback;
    	this.executeCommand(this.command.kakaoLoginDel);
    },
    
    autoLoginAccountList : function(callback) {
        this.callback = callback;
        this.executeCommand(this.command.autoLoginAccountList);
    },
    
    autoLoginAccountAdd : function(id, token, autotype) {
        this.executeCommand(this.command.autoLoginAccountAdd, id, token, autotype);
    },
    
    autoLoginAccountDel : function(id, token, autotype) {
        this.executeCommand(this.command.autoLoginAccountDel, id, token, autotype);
    },
    
    autoLoginCheckComplete : function() {
        this.executeCommand(this.command.autoLoginCheckComplete);
    },
    
    devicePcidInfo : function(callback) {
    		this.callback = callback;
    		this.executeCommand(this.command.devicePcidInfo);
    },

    regDevice : function(id, key) {
        this.executeCommand(this.command.regDevice, id, key);
    },

    unregDevice : function(id, key) {
        this.saveData('memberKey', '');
        this.executeCommand(this.command.unregDevice, id, key);
    },

    setSubWebViewTitle : function(title) {
        this.executeCommand(this.command.setSubWebViewTitle, title);
    },

    gpsStatus : function(callback) {
    	this.callback = callback;
    	this.executeCommand(this.command.gpsStatus);
    },

    moveGps : function(){
    	this.executeCommand(this.command.moveGps);
    },

    saveData : function(key, val){
    	this.executeCommand(this.command.saveData, key, val);
    },

    loadData : function(key, callback){
    	this.callback = callback;
    	this.executeCommand(this.command.loadData, key);
    },

    goWeb : function(url) {
        if(this.isApp()) {
            this.openWeb(url);
        } else {
        	location.href = url;
        }
    },

    goLink : function(url, isNewWindow, title) {
        if(isNewWindow) {
            //melon 4.0
            if(this.isMelon() || this.isApp()) {
                if(url.indexOf('/') == 0) url = location.origin + url;
                this.openWebView(url, title);
            } else {
                window.open(url);
            }
        } else {
            location.href = url;
        }
    },

    isIOSversion : function(){
    	if(this.isIOS()){
    		var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
    	    return [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
    	}
    },

    isAndroidversion : function(ua){
    	if(this.isAndroid()){
    		ua = (ua || navigator.userAgent).toLowerCase();
    	    var match = ua.match(/android\s([0-9\.]*)/);
    	    return match ? match[1] : false;
    	}
    },

    showNetworkAlert : function(){
        if(showCnt !== 0){
            return;
        }

    	//if(mstApp.isIOS()){
    		ActionHandler.alert({popId:'netAlert'
                                ,message: "해당 페이지의 접속이 지연되고 있습니다. 네트워크 연결 상태를 확인하거나, 잠시 후 다시 이용해주세요."
                                ,callback: function(ok){
                                    showCnt --;
                                    showCnt = showCnt < 0? 0:showCnt;
                                }});
    	//}else{
    	//	this.executeCommand(this.command.showNetworkAlert);
    	//}
    },

    moveMelonLogin : function(){
        if(this.isIOS()){
            window.location.href = 'meloniphone://M4001/webReload=Y';
        }else if(this.isAndroid()){
            //window.location.href = 'melonapp://setting/melonlogin';
            window.melonapp.requestCommand('LoginNeed', '', '', '');
        }else {
            ActionHandler.alert({
                message:'iOS, Android 모바일만 지원합니다.',
                callback: function(){
                    content.load('home.index');
                }});
        }
    },

    openMelonWebView : function(_url, _title){
        if(this.isIOS()){
            window.location.href = 'meloniphone://webview?url='+encodeURIComponent(_url)+'&title='+encodeURIComponent(_title)+'&type=popup';
        }else if(this.isAndroid()){
            // window.location.href = 'melonapp://webview?url='+encodeURIComponent(_url)+'&type=activity&title='+encodeURIComponent(_title);
            window.location.href = 'melonapp://webview?url='+encodeURIComponent(_url)+'&type=PA&title='+encodeURIComponent(_title);
        }else{
            //out link?
            this.openWeb(_url);
        }
    },

    testCallback : function(){
    	//window.location.href = "http://m.ticket.melon.com/testAuth/redirectPost.html";
    	//document.location.href = "/public/index.html#performance.index?prodId=100045";

//    	ActionHandler._alert({message:'ttt'});


    	var _tf = [];
		_tf.push('<form id="_tmpFrm" action="/testAuth/redirectPost.html" method="get" style="display:none;" >');
		_tf.push('</form>');

		$('body').append(_tf.join(''));

		$('#_tmpFrm').submit();
    }
};