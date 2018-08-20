/**
 * Created by Jaeheon on 2016-05-08.
 */
define(['util/jsonUtils',
        'util/stringUtils'],
function(JsonUtils,
         StringUtils) {

    var _this = this;
    var sellTypeCode = 'ST0001';
    var textPrefix = '티켓오픈 남은시간 ';
    var shortTextPrefix = '선예매 '; //선예매 경우에만 쓰임
    var isSimpleBtn = false;// short button

var _setSellTypeCode = function(typeCode){
    sellTypeCode = typeCode;
}
var _setIsSimpleBtn = function(isSimple){
    isSimpleBtn = isSimple;
}
    //yyyyMMddHHmmss
var _parseDt = function(str){
        var _dt = new Date();
        if(str.length === 14) {
            _dt.setFullYear(parseInt(str.substring(0, 4)),parseInt(str.substring(4, 6))-1,parseInt(str.substring(6, 8)));
            _dt.setHours(parseInt(str.substring(8, 10)),parseInt(str.substring(10, 12)),parseInt(str.substring(12, 14)));
        }else if(str.length === 12){
            _dt.setFullYear(parseInt(str.substring(0, 4)),parseInt(str.substring(4, 6))-1,parseInt(str.substring(6, 8)));
            _dt.setHours(parseInt(str.substring(8, 10)),parseInt(str.substring(10, 12)));
        }else if(str.length === 10){
            _dt.setFullYear(parseInt(str.substring(0, 4)),parseInt(str.substring(4, 6))-1,parseInt(str.substring(6, 8)));
            _dt.setHours(parseInt(str.substring(8, 10)));
        }else if(str.length === 8){
            _dt.setFullYear(parseInt(str.substring(0, 4)),parseInt(str.substring(4, 6))-1,parseInt(str.substring(6, 8)));
        }else {
            return Date.parse(str);
        }
        return _dt;
};

var _diff = function(tgtDt, dt){
    //console.log(tgtDt);
    //console.log(dt);
    var diff = Math.abs(tgtDt - dt);
    var hh = Math.floor(diff / 1000 / 60 / 60 );
    diff -= hh * 1000 * 60 * 60;
    var mm = Math.floor(diff / 1000 / 60);
    diff -= mm * 1000 * 60;
    var ss = Math.floor(diff / 1000);

    //if (hh > 0) {
    //    return '티켓오픈 남은시간 ' + _fmt(hh) + '시간 ' + _fmt(mm) + '분 ' + _fmt(ss) + '초';
    //} else {
    //    return '티켓오픈 남은시간 ' + _fmt(mm) + '분 ' + _fmt(ss) + '초';
    //}

    if(isSimpleBtn){
        if (hh > 0) {
            return shortTextPrefix + _fmt(hh) + '시간 ' + _fmt(mm) + '분 ' + _fmt(ss) + '초';
        } else {
            return shortTextPrefix + _fmt(mm) + '분 ' + _fmt(ss) + '초';
        }
    }else {
        if (hh > 0) {
            return textPrefix + _fmt(hh) + '시간 ' + _fmt(mm) + '분 ' + _fmt(ss) + '초';
        } else {
            return textPrefix + _fmt(mm) + '분 ' + _fmt(ss) + '초';
        }
    }
};

var _fmt = function(num){
    if(num < 10){
        return '0'+num;
    }
    return ''+num;
};

var _getServerTime = function(btnDom, ticketOpenDate){
    //cross domain issue로 html을 다운로드 할때 서버 시간을 가져온다.

    var gStart = new Date().getTime();
    var dfd = $.Deferred();
    var _url = 'http://m.ticket.melon.com/index.html?t='+new Date().getTime();
    var promise = $.ajax({
        url: _url,
        type: 'GET',
        contentType: 'text/plain',
    });

    promise.complete(function () {
        var _dpCriteria = 60 * 60 * 1000; //1시간
        var _h = promise.getResponseHeader('Date');
        //var dtStr = 'Thu, 05 May 2016 15:20:57 GMT'+'+0900';
        //var dtStr = 'Thu, 05 May 2016 15:20:57 GMT';
        var dtStr = _h;
        //console.log('server:'+_h);

        var pDt = Date.parse(dtStr);
        //console.log(pDt);
        var _tgtDt = _parseDt(ticketOpenDate);
        //console.log(_tgtDt);
        //var title = _diff(_tgtDt.getTime(), pDt);
        var _start = new Date().getTime();
        var _elapsed = 0, _prev = _start;
        var _accum_err = 0;
        var _bInit = true;
        var timer = setInterval(function(){

            if(_tgtDt.getTime() - pDt < 1000){
                clearInterval(timer);
                if(sellTypeCode === 'ST0001') {
                    btnDom.html('예매하기');//set title QQQ '선예매하기'
                }else if(sellTypeCode === 'ST0002') {
                    btnDom.html('선예매하기');
                }else{
                    btnDom.html('예매하기');
                }
                dfd.resolve();
                return;
            }

            //initial calibration
            if(_bInit){
                pDt += (new Date().getTime() - gStart);
                _bInit = false;
            }
            //criteria 안에서만 버튼 title을 업데이트~!!
            if(_tgtDt.getTime() - pDt <= _dpCriteria){
                btnDom.html(_diff(_tgtDt, pDt));//count down
            }

            //pDt += 1000;
            _elapsed = new Date().getTime() - _prev;
            pDt += _elapsed;
            _prev = new Date().getTime();
        },  1000);
    });

    return dfd.promise();
}

return {

    init: function(btnDom, ticketOpenDate, sellTypeCode){
        //console.log('timer init');
        if(sellTypeCode === undefined){
            _setSellTypeCode('ST0001');
        }else{
            _setSellTypeCode(sellTypeCode);
        }

        //return promise
        return _getServerTime(btnDom, ticketOpenDate);
    },

    setTextPrefix: function(prefix, shortPrefix){

        if(prefix !== undefined) {
            textPrefix = prefix;
        }
        if(shortPrefix !== undefined) {
            shortTextPrefix = shortPrefix;
        }
    },

    setIsSimpleBtn: function(isSimple){
        isSimpleBtn = isSimple;
    }
}
});