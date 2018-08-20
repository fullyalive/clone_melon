/**
 * Created by jhcho on 2016-06-23.
 */
define([],function(){

    var _key = 'TKTPRERSRV';
    var _expireMin = 5;
    var type_cond = "a";
    var type_auth = "b";

    var _storeInfo = function(type, prodId, obj){
        if(!existy(prodId) || !existy(obj)){
            return;
        }

        if(!existy(obj.memberKey) || obj.memberKey === '0' || obj.memberKey === 0){
            return;
        }

        var k = _genKey(type, prodId);
        var _d = prodId + ";" + JSON.stringify(obj);
        _setInfoCookie(k, _d, _expireMin);
    },

    _setInfoCookie = function(key, val, expireMin){
        var d = new Date();
        d.setMinutes(d.getMinutes() + expireMin);
        document.cookie = key + "=" + escape(val) + ";" + "path=/;domain=.melon.com;expires=" + d.toGMTString();
    },

    _deleteCookie  = function ( key ){

        var d = new Date();
        //어제 날짜를 쿠키 소멸 날짜로 설정한다.
        d.setDate( d.getDate() - 1 );
        document.cookie = key + "= " + ";" + "path=/;domain=.melon.com;expires=" + d.toGMTString();
    },

    _genKey = function(type,prodId){
        var k = [];
        k.push(_key);
        k.push('_');
        k.push(type);
        k.push('_');
        k.push(prodId);
        return k.join('');
    },

    _getInfo = function(type, prodId){
        var k = _genKey(type, prodId);
        var _val =  getCookie(k);
        if(_val){
            var apiVal = _val.split(';')[1];
            var obj = JSON.parse(apiVal);
            if(existy(obj) && existy(obj.memberKey)){
                if(getMemberKey() == obj.memberKey){
                    return obj;
                }
            }
            return null;
        }else{
            return null;
        }
    },

    _reset = function(prodId){

        var key_a = _genKey(type_cond, prodId);
        var key_b = _genKey(type_auth, prodId);

        _deleteCookie(key_a);
        _deleteCookie(key_b);
    }

    return {

        storeUserCond: function(prodId, res){
            _storeInfo(type_cond, prodId, res);
        },

        storeAuthItem: function(prodId, res){
            _storeInfo(type_auth, prodId, res);
        },


        /**
         * before calling of usercond
         * @param pData
         */
        getUserCond: function(prodId){
            return _getInfo(type_cond,prodId);
        },

        /**
         * before calling of authitem
         * @param pData
         */
        getAuthItem: function(prodId){
            return _getInfo(type_auth, prodId);
        },


        reset: function(prodId){
            _reset(prodId);
        }
    }
});