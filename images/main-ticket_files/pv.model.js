/**
 * Created by jhcho on 2016-06-08.
 */
define([], function() {

    var _this = this;
    var baseUrl = '/pv/mobile/logging.json?';
    var mk = 'memberkey',
        tc = 'tab_code',
        prodid = 'prodid',
        aid = 'artistid',
        rc = 'region',
        plid = 'placeId',
        eid = 'eventid',
        ft = 'filter',
        f1 = 'filter1',
        f2 = 'filter2';

    //available parameter list
    var paramMap = [mk, tc, prodid, aid, rc, plid, eid, ft, f1, f2];

    var memuMap = [
        {menu:'home',           menuId:1600000001, pc:0, desc: '모바일 홈'}

        ,{menu:'foru.start',    menuId:1600000004, pc: 0, desc: '포유시작하기'} //로그인 안한경우
        ,{menu:'foru.recmd',    menuId:1600000008, pc: 1, p1: mk, desc: '포유맞춤공연'}
        //,{menu:'foru.planner',  menuId:1600000008, pc: 1, p1: mk, desc: '포유플래너'}
        ,{menu:'foru.setting',  menuId:1600000010, pc: 1, p1: mk, desc: '포유취향설정'}

        ,{menu: 'search.main',  menuId:1600000012, pc: 0, desc: '최근검색어'}
        ,{menu: 'search.perflist', menuId:1600000013, pc: 0, desc: '최근본공연'}
        ,{menu: 'search.perf',  menuId:1600000016, pc: 0, desc: '공연검색'}
        ,{menu: 'search.artist', menuId:1600000017, pc: 0, desc: '아티스트검색'}
        ,{menu: 'search.place', menuId:1600000018, pc: 0, desc: '공연장검색'}

        ,{menu: 'myticket.home',    menuId:1600000020, pc: 1, p1:mk, desc: '마이티켓홈'}
        ,{menu: 'myticket.rsrv6',   menuId:1600000022, pc: 1, p1:mk, desc: '예매확인6개월'}
        ,{menu: 'myticket.rsrv12',  menuId:1600000152, pc: 1, p1:mk, desc: '예매확인12개월'}
        ,{menu: 'myticket.rsrv24',  menuId:1600000153, pc: 1, p1:mk, desc: '예매확인24개월'}
        ,{menu: 'myticket.cancel6', menuId:1600000023, pc: 1, p1:mk, desc: '예매취소6개월'}
        ,{menu: 'myticket.cancel12',menuId:1600000154, pc: 1, p1:mk, desc: '예매취소12개월'}
        ,{menu: 'myticket.cancel24',menuId:1600000155, pc: 1, p1:mk, desc: '예매취소24개월'}
        ,{menu: 'myticket.cupn',    menuId:1600000027, pc: 1, p1:mk, desc: '할인쿠폰.미사용'}
        ,{menu: 'myticket.cupn.used',menuId:1600000028, pc: 1, p1:mk, desc: '할인쿠폰_사용완료'}
        ,{menu: 'myticket.address', menuId:1600000144, pc: 1, p1:mk, desc: '배송지관리'}
        ,{menu: 'myticket.adv.ticket',menuId:1600000030, pc: 1, p1:mk, desc: '공연예매권'}

        ,{menu: 'genretheme', menuId:0, pc: 0, desc: '장르/테마 대표코드'}
        ,{menu: 'genre.bal', menuId:1600000083, pc: 0, desc: '발라드/재즈'}
        ,{menu: 'genre.rock', menuId:1600000084, pc: 0, desc: '락/포크'}
        ,{menu: 'genre.dance', menuId:1600000085, pc: 0, desc: '댄스/힙합'}
        ,{menu: 'genre.indi', menuId:1600000086, pc: 0, desc: '인디'}
        ,{menu: 'genre.pop', menuId:1600000087, pc: 0, desc: '팝/J팝'}
        ,{menu: 'genre.tro', menuId:1600000088, pc: 0, desc: '트로트'}
        ,{menu: 'genre.oth', menuId:1600000089, pc: 0, desc: 'Others'}
        ,{menu: 'theme.visit', menuId:1600000091, pc: 0, desc: '내한'}
        ,{menu: 'theme.small', menuId:1600000092, pc: 0, desc: '홍대/소극장'}
        ,{menu: 'theme.idol', menuId:1600000093, pc: 0, desc: '아이돌'}
        ,{menu: 'theme.respect', menuId:1600000094, pc: 0, desc: '효'}
        ,{menu: 'theme.festival', menuId:1600000095, pc: 0, desc: '페스티벌/콜라보'}

        ,{menu: 'region', menuId:1600000145, pc: 1, p1: rc, desc: '지역설정'}
        ,{menu: 'region.perf', menuId:1600000146, pc: 1, p1: rc, desc: '장소지역-공연'}
        ,{menu: 'region.pl', menuId:1600000147, pc: 1, p1: rc, desc: '장소지역-공연장'}

        ,{menu: 'event.detail', menuId:1600000119, pc: 1, p1: eid, desc: '이벤트상세'}//우선 같은 mid로 + eid
        ,{menu: 'event.list',   menuId:1600000148, pc: 0, desc: '이벤트리스트-진행중'}
        ,{menu: 'event.join', menuId:1600000149, pc: 1, p1: mk, desc: '참여이벤트'}

        ,{menu: 'ticketopen', menuId:1600000120, pc: 0, desc: '티켓오픈소식 메인'}

        ,{menu: 'info.howto', menuId:1600000122, pc: 0, desc: '이용안내-예매방법'}
        ,{menu: 'info.cancel', menuId:1600000123, pc: 0, desc: '이용안내-취소/환불'}
        ,{menu: 'info.delivery', menuId:1600000124, pc: 0, desc: '이용안내-발권/배송'}

        ,{menu: 'customer.list', menuId:1600000137, pc: 1, p1: mk, desc: '1:1문의리스트'}
        ,{menu: 'customer.q', menuId:1600000136, pc: 1, p1: mk, desc: '1:1문의하기'}

        ,{menu: 'ranking.daily', menuId:1600000113, pc: 0, desc: '랭킹-일간'}
        ,{menu: 'ranking.weekly', menuId:1600000114, pc: 0, desc: '랭킹-주간'}

        //,{menu: 'setting', menuId:1600000153, pc: 0, desc: '설정'}

        ,{menu:'prod.detail',   menuId:1600000034, pc: 1, p1: prodid, desc: '상품상세'}
        ,{menu:'prod.desc',   menuId:1600000040, pc: 1, p1: prodid, desc: '작품설명'}
        ,{menu:'prod.brd.exp',   menuId:1600000042, pc: 1, p1: prodid, desc: '기대평'}
        ,{menu:'prod.brd.qna',   menuId:1600000052, pc: 1, p1: prodid, desc: 'QnA'}
        ,{menu:'prod.place',   menuId:1600000054, pc: 1, p1: prodid, desc: '공연장정보'}
        ,{menu:'prod.info',   menuId:1600000055, pc: 1, p1: prodid, desc: '유의사항'}

        ,{menu:'place.detail',   menuId:1600000054, pc: 1, p1: plid, desc: '공연장정보'}

        ,{menu:'artist.perf',   menuId:1600000150, pc: 1, p1: aid, desc: '아티스트-예정공연'}
        ,{menu:'artist.old.perf',   menuId:1600000151, pc: 1, p1: aid, desc: '아티스트-지난공연'}
        ,{menu:'artist.photo',   menuId:1600000067, pc: 1, p1: aid, desc: '아티스트-포토'}
        ,{menu:'artist.movie',   menuId:1600000068, pc: 1, p1: aid, desc: '아티스트-영상'}
        ,{menu:'artist.detail',   menuId:1600000069, pc: 1, p1: aid, desc: '아티스트-상세정보'}

        ,{menu: 'GENRE_CON_ALL', menuId:1600000173, pc: 0, desc: '콘서트-모든서브장르'} // pc는 파라미터의 개수인듯? ㅇㅈ?
        ,{menu: 'GENRE_CON_IDOL', menuId:1600000074, pc: 0, desc: '콘서트-아이돌'}
        ,{menu: 'GENRE_CON_FAN', menuId:1600000075, pc: 0, desc: '콘서트-팬클럽/팬미팅'}
        ,{menu: 'GENRE_CON_BAL', menuId:1600000076, pc: 0, desc: '콘서트-발라드/R앤B'}
        ,{menu: 'GENRE_CON_HIP_EDM', menuId:1600000077, pc: 0, desc: '콘서트-힙합/EDM'}
        ,{menu: 'GENRE_CON_FESTIVAL', menuId:1600000078, pc: 0, desc: '콘서트-페스티벌'}
        ,{menu: 'GENRE_CON_IND_ROC', menuId:1600000079, pc: 0, desc: '콘서트-인디/록'}
        ,{menu: 'GENRE_CON_VISIT_KOR', menuId:1600000080, pc: 0, desc: '콘서트-내한'}
        ,{menu: 'GENRE_CON_ETC', menuId:1600000081, pc: 0, desc: '콘서트-그외장르'}
        ,{menu: 'GENRE_ART_ALL', menuId:1600000082, pc: 0, desc: '아트-모든서브장르'}
        ,{menu: 'GENRE_ART_MCAL', menuId:1600000083, pc: 0, desc: '아트-뮤지컬'}
        ,{menu: 'GENRE_ART_ACT', menuId:1600000084, pc: 0, desc: '아트-연극'}
        ,{menu: 'GENRE_ART_CLASS', menuId:1600000085, pc: 0, desc: '아트-클래식'}
        ,{menu: 'GENRE_ART_EXH', menuId:1600000086, pc: 0, desc: '아트-전시'}

    ];


    var findMenu = function(name){
        //var obj = memuMap.find(function(elem, idx){ //android 4.x에서 지원 안함.
        //    return elem.menu === name;
        //});
        //
        //return obj;

        var obj = null;
        $.each(memuMap, function(idx, elem){
            if(name === elem.menu){
                obj = elem;
                return false;//break;
            }
        });

        return obj;
    };

    var sendPvLog = function(pData){
        ActionHandler.apis['mobile.logging'].execute({
            data: pData,
            callback: function(d){

            }
        });
    };

    var _sendPv = function(menuId, p1, p2, p3) {
        if(menuId === undefined || menuId == null){
            return;
        }
        var param = {menuId: menuId};
        param = p1 ? $.extend(param, {p1:p1}) : param;
        param = p2 ? $.extend(param, {p1:p2}) : param;
        param = p3 ? $.extend(param, {p1:p3}) : param;
        sendPvLog(param);
    };

    var _sendPvEx = function(menuName, pObj){
        if(!menuName){
            return;
        }
        var m = findMenu(menuName);
        if(!truthy(m)){
            return;
        }
        var p = [];

        if(m.pc == 0){
            _sendPv(m.menuId);
        }else{
            if(!existy(pObj)){
                //do nothing
                return;
            }

            for(name in pObj){
                if($.inArray(name, paramMap)>-1){
                    p.push(pObj[name]);
                }
            }

            switch(p.length){
                case 0:
                    _sendPv(m.menuId);
                    break;
                case 1:
                    _sendPv(m.menuId,p[0]);
                    break;
                case 2:
                    _sendPv(m.menuId,p[0],p[1]);
                    break;
                case 3:
                    _sendPv(m.menuId,p[0],p[1],p[2]);
                    break;
            }
        }
    };

    var _sendPvGT = function(menuName, gtCode){

        if('genretheme' !== menuName){
            return;
        }

        var menu = '';
        switch(gtCode){
            case 'GENRE_BAL_JAZ':
                menu = 'genre.bal';
                break;
            case 'GENRE_ROC_FOLK':
                menu = 'genre.rock';
                break;
            case 'GENRE_DAN_HIP':
                menu = 'genre.dance';
                break;
            case 'GENRE_IND':
                menu = 'genre.indi';
                break;
            case 'GENRE_POP_JPOP':
                menu = 'genre.pop';
                break;
            case 'GENRE_TROT':
                menu = 'genre.tro';
                break;
            case 'GENRE_ETC':
                menu = 'genre.oth';
                break;
            case 'THEME_VISIT_KOR':
                menu = 'theme.visit';
                break;
            case 'THEME_HONG_THEATER':
                menu = 'theme.small';
                break;
            case 'THEME_IDOL':
                menu = 'theme.idol';
                break;
            case 'THEME_PARENT':
                menu = 'theme.respect';
                break;
            case 'THEME_FES_COL':
                menu = 'theme.festival';
                break;
            default:
                return;
        }

        var m = findMenu(menu);
        if(!truthy(m)){
            return;
        }

        _sendPvEx(m.menu);
    };

    var _sendPvRegion = function(rgCode){

        if(rgCode == null || rgCode === undefined){
            return;
        }
        var region_array = ['PR0001', 'PR0002', 'PR0003', 'PR0004', 'PR0005'];//서울, 경기/인천, 충청/강원, 경상도, 전라/제주
        if($.inArray(rgCode, region_array) < 0){
            return;
        }

        var m = findMenu('region');
        if(!truthy(m)){
            return;
        }
        _sendPvEx(m.menu, {region: rgCode});
    };

    var _sendPvRegionPerf = function(rgCode){

        if(rgCode == null || rgCode === undefined){
            return;
        }
        var region_array = ['PR0001', 'PR0002', 'PR0003', 'PR0004', 'PR0005'];//서울, 경기/인천, 충청/강원, 경상도, 전라/제주
        if($.inArray(rgCode, region_array) < 0){
            return;
        }

        var m = findMenu('region.perf');
        if(!truthy(m)){
            return;
        }
        //_sendPvEx(m.menu, {region: rgCode});
        _sendPv(m.menuId);
    };

    var _sendPvRegionVenue = function(rgCode){

        if(rgCode == null || rgCode === undefined){
            return;
        }
        var region_array = ['PR0001', 'PR0002', 'PR0003', 'PR0004', 'PR0005'];//서울, 경기/인천, 충청/강원, 경상도, 전라/제주
        if($.inArray(rgCode, region_array) < 0){
            return;
        }

        var m = findMenu('region.pl');
        if(!truthy(m)){
            return;
        }
        //_sendPvEx(m.menu, {region: rgCode});
        _sendPv(m.menuId);
    };

    return {

        //임시
        sendPv : function(menuId, p1, p2, p3){
            _sendPv(menuId, p1, p2, p3);
        },

        /**
         * pObj = {paramName: paramValue}
         * @param menuName
         * @param pObj
         */
        sendPvEx : function(menuName, pObj){
            _sendPvEx(menuName, pObj);
        },

        /**
         * Genre Theme page전용
         * @param menuName
         * @param gtCode
         */
        sendPvGT : function(menuName, gtCode){
            _sendPvGT(menuName, gtCode);
        },

        /**
         * 지역선택 - 공연
         * @param type
         * @param rgCode
         */
        sendPvRegion : function(type, rgCode){
            _sendPvRegion(rgCode);
            if(type === 'perf') {
                _sendPvRegionPerf(rgCode);
            }else if( type === 'venue'){
                _sendPvRegionVenue(rgCode);
            }
        }
    };
});

function existy(val){
    return val!= null;
}
function truthy(val){
    return (val !== false) && existy(val);
}