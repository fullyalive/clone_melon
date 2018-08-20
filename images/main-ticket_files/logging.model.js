/**
 * Created by jhcho on 2016-05-11.
 */
define([], function() {
    var _netfunnelLogging = function(msg){
        //ActionHandler.apis['netfunnel/netfunnelLog'].execute({
        //    data: {msg: msg},
        //    callback: function(d){
        //    }
        //});
        var url = "http://tktapi.melon.com/log/netfunnel/netfunnelLog.json";
        var opts = {data: {v:1,msg:msg}
                ,type: 'GET'};
        var prms = $.ajax(url, opts);
        return prms;
    };

    var _buyLog = function(prodId){
      //ActionHandler.apis['prod.buyBtnClickLog'].execute({
      //    data:{pocId: POC_ID, prodId: prodId, memberKey: getMemberKey()},
      //    callback: function(d){
      //
      //    }
      //});
      //20161031 아래 url을 호출하는 것으로 대체
        var url = 'http://m.ticket.melon.com/public/buyBtnClick.html?pocID='+getPocId()+'&prodId='+prodId+'&memberKey='+getMemberKey();
        var pms = $.ajax({
            url:url,
            method:'GET'});
        pms.always(function(){
            //확인완료
            //console.log('button click logging. sent..');
        });
    };

    return {
        netfunnel : function(msg){
            return _netfunnelLogging(msg);
        },
        buylog : function(prodId){
            _buyLog(prodId);
            return;
        }
    }
});