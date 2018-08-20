var initial_alias = "index";
var initial_path = "/public/";

var base_config = {
	"contentHTMLDir" : "content/html",
	"contentJSDir" : "content/js",
}

var _injection_map = [
      {"alias":"home.index","func":"go_home"},
      {"alias":"performance.index","func":"performance_detail"},
      {"alias":"performance.bridge","func":"go_stay"},
      //eddy비회원 추가 
      {"alias":"external.index","func":"go_stay"},
//      {"alias":"external.calendar","func":"go_stay"},
      //{"alias":"bridge.index","func":"go_stay"},
      {"alias":"plan.index","func":"go_stay"},
      {"alias":"performance.plan","func":"go_stay"},
      {"alias":"ticketopen.index","func":"go_stay"},
      {"alias":"ticketopen.detail","func":"go_stay"},
      {"alias":"setting.menu","func":"go_home"},
      {"alias":"setting.index","func":"go_stay"},
      {"alias":"setting.login","func":"go_home"},
      {"alias":"setting.alarm","func":"go_home"},
      {"alias":"setting.location_agree","func":"go_home"},
      {"alias":"setting.location_disagree","func":"go_home"},
      {"alias":"ranking.index","func":"go_stay"},
      {"alias":"ranking.weekly","func":"go_home"},
      {"alias":"event.index","func":"go_stay"},
      {"alias":"concert.index","func":"go_stay"},
      {"alias":"art.index","func":"go_stay"},
      {"alias":"theme.index","func":"go_stay"},
      {"alias":"concert.theme","func":"go_home"},
      {"alias":"region.index","func":"go_stay"},
      {"alias":"place.index","func":"go_stay"},
      {"alias":"place.reservation_list","func":"go_home"},
      {"alias":"pushnotice.index","func":"go_stay"},
      {"alias":"artist.index","func":"go_stay"},
      {"alias":"foru.step.step_artist","func":"go_home"},
      {"alias":"foru.step.step_region","func":"go_home"},
      {"alias":"foru.step.step_theme","func":"go_home"},
      {"alias":"foru.step.pop_search_artist","func":"go_home"},
      {"alias":"foru.perform.index","func":"go_stay"},
      {"alias":"foru.modify.modify_artist","func":"go_home"},
      {"alias":"foru.modify.modify_genre_theme","func":"go_home"},
      {"alias":"foru.modify.modify_region","func":"go_home"},
      {"alias":"foru.information.artist_suggestion","func":"go_home"},
      {"alias":"notification.index","func":"go_home"},
      {"alias":"ticket.index","func":"go_stay"},
      {"alias":"ticket.review","func":"go_home"},
      {"alias":"ticket.planner","func":"go_home"},
      {"alias":"ticket.seatcheck","func":"go_stay"},
      {"alias":"search.index","func":"go_stay"},
      {"alias":"wish.index","func":"go_stay"},
      {"alias":"wish.add","func":"go_home"},
      {"alias":"wish.detail","func":"go_stay"},
      {"alias":"customer.index","func":"go_stay"},
      {"alias":"customer.faq","func":"go_stay"},
      {"alias":"customer.notice","func":"go_stay"},
      {"alias":"customer.guide","func":"go_stay"},
      {"alias":"customer.qna","func":"go_stay"},
      {"alias":"comment.write","func":"go_home"},
      {"alias":"comment.modify","func":"go_home"},
      {"alias":"coupon.index","func":"go_stay"},
      {"alias":"app.login_form","func":"go_home"},
      {"alias":"app.index","func":"go_stay"},
      {"alias":"member.index","func":"go_stay"},
      {"alias":"action","func":"go_home"},
	  {"alias":"onestop.index","func":"go_stay"},
	  {"alias":"etc.move","func":"go_stay"},
	  {"alias":"etc.logout","func":"go_stay"},
	  //{"alias":"mobticket.index","func":"go_stay"},
];

var go_home = function(arg)
{
    content.load('home.index');
}

var go_stay = function(arg)
{
}

/**
 * 공연상세 후처리 메소드
 */
var performance_detail = function(arg)
{

    if(arg == 'undefined')
    {
        content.load('home.index');
        return;
    }
    else
    {
//    	ActionHandler._setData('performance.index', {prodId: arg});
//    	initPerformance('P');
    }
}

var map_config =
[	"index",
 	"sub",
 	"action",
 	// 메인 홈 페이지
 	"home.index",
 	// 공연
 	"performance.index",
 	"performance.bridge",
 	"performance.plan",
 	//eddy 비회원 추가 
 	"external.index",
// 	"external.calendar",
 	// 기획전
 	"plan.index",
 	// 브릿지
 	//"bridge.index",
 	// 티켓오픈
 	"ticketopen.index",
 	"ticketopen.detail",
 	// 설정
 	"setting.menu",
 	"setting.index",
 	"setting.login",
 	"setting.alarm",
 	"setting.location_agree",
 	"setting.location_disagree",
 	// 랭킹
 	"ranking.index",
 	"ranking.weekly",
 	// 이벤트
 	"event.index",
 	// 콘서트
 	"concert.index",
 	"art.index",
 	"theme.index",
 	"concert.theme",
 	// 지역
 	"region.index",
 	// 공연장
 	"place.index",
 	"place.reservation_list",

 	// 아티스트 메인
 	"artist.index",

 	// 포유
 	"foru.step.step_artist",
 	"foru.step.step_region",
 	"foru.step.step_theme",
 	"foru.step.pop_search_artist",
 	"foru.perform.index",
 	"foru.modify.modify_artist",
 	"foru.modify.modify_genre_theme",
 	"foru.modify.modify_region",
 	"foru.information.artist_suggestion",

 	// 노티피케이션
 	"pushnotice.index",
 	// 티켓
 	"ticket.index",
 	"ticket.review",
 	"ticket.planner",
 	"ticket.seatcheck",
 	// 검색
 	"search.index",
 	// wish
 	"wish.index",
 	"wish.add",
 	"wish.detail",
 	"wish.pre_ticketing",
 	// 고객센터
 	"customer.index",
 	"customer.faq",
 	"customer.notice",
 	"customer.guide",
 	"customer.qna",
 	// 댓글등록 - 기대평
 	"comment.write",
 	"comment.modify",
 	//쿠폰
 	"coupon.index",

 	//멤버배송지관리
 	"member.index",

 	//앱용 로그인
 	"app.login_form",
 	"app.index",

	//원스탑 테스트
	"onestop.index",

	//모바일 티켓
	//"mobticket.index",

	//기타
	"etc.move",
	"etc.logout"
];

var map_ele_config =
[
	{
		"alias":"header",
		"html":"header.html",
		"js":"header.js",
		"detach":false,
		"prepend":false,
		startHandler:"header_start"
	},
	{
		"alias":"footer.nav",
		"html":"footer.nav.html",
		"js":"footer.nav.js",
		"detach":false,
		"prepend":false,
		startHandler:"footer_start"
	},

 ];

var base_ele_config = {
	"contentHTMLDir" : "element/html",
	"contentJSDir" : "element/js",
}
map_config = function() {
	var _m = [];
	for(var i in map_config) {
		var _v = map_config[i];
		if('string' !== typeof _v) continue;
		_m.push({
			'alias' : _v,
			'html' : _v.replace(/\./g, '/') + '.html',
			'js' : _v.replace(/\./g, '/') + '.js'
		});
	}
	return _m;
}();
