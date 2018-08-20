/**
 * Created by jhcho on 2016-04-27.
 */
if(typeof NetFunnel == "object"){
    var _this = this;
    var zamPopHtml  = [];
    zamPopHtml.push('<div class="layer_comm h_auto">');
    zamPopHtml.push('<div class="bg"></div>');
    zamPopHtml.push('<div class="layer_pop">');
    zamPopHtml.push('<div class="tit"><span id="NetFunnel_Title"></span><button class="close" id="close_zam" onclick="javascript:NetFunnel.countdown_stop();return false;">닫기</button></div>');
    zamPopHtml.push('<div class="wrap_pop">');
    zamPopHtml.push('<div class="status">');
    zamPopHtml.push('<strong class="d_icon delay1" id="status_sdelay">다소 지연</strong><strong class="d_icon delay2" id="status_delay">지연</strong><strong class="d_icon delay3" id="status_normal">원활</strong><p>좌석 선택 진입 중</p>');
    zamPopHtml.push('</div>');
    zamPopHtml.push('<div class="txt_status">');
    zamPopHtml.push('내 대기 순서 <span><strong id="NetFunnel_Loading_Popup_Count"></strong>번째</span>');
    zamPopHtml.push('</div>');
    zamPopHtml.push('<div class="txt_status_s">');
    zamPopHtml.push('뒤에 <span id="NetFunnel_Loading_Popup_NextCnt"></span>명 <span class="bar">/</span> <span id="NetFunnel_Loading_Popup_TimeLeft"></span> 소요 예상');
    zamPopHtml.push('</div>');

//<!-- step 4개인경우 -->
    zamPopHtml.push('<ol class="step_list">');
    zamPopHtml.push('<li id="step1" class="step on"><span>회차선택</span></li>');//<!-- //on클래스 완료된 단계표시 -->');
    zamPopHtml.push('<li class="progress"><span></span></li>');//<!-- //접속대기자 수에 따른 %입력. 완료되어 다음 단계로 넘어갈 시 100% -->');<!-- <li class="progress on"><span></span></li>   완료된 단계 on클래스 -->
    zamPopHtml.push('<li id="step2" class="step gl"><span>좌석선택</span></li>');//<!-- //gl클래스 도달할 단계표시 -->');
    zamPopHtml.push('<li class="progress"><span></span></li>');
    zamPopHtml.push('<li id="step3" class="step"><span>가격선택</span></li>');
    zamPopHtml.push('<li class="progress"><span></span></li>');
    zamPopHtml.push('<li id="step4" class="step"><span>배송결제</span></li>');
    zamPopHtml.push('</ol>');
//<!-- //step 4개인경우 -->');
//    zamPopHtml.push('<!-- step 2개인경우 : step02 다중클래스 -->');
//    zamPopHtml.push('<ol class="step_list step02">');
//    zamPopHtml.push('<li class="step on"><span>회차선택</span></li><!-- //on클래스 완료된 단계표시 -->');
//    zamPopHtml.push('<li class="progress"><span></span></li><!-- //접속대기자 수에 따른 %입력. 완료되어 다음 단계로 넘어갈 시 100% -->');
//    zamPopHtml.push('<li class="step gl"><span>배송결제</span></li><!-- //gl클래스 도달할 단계표시 -->');
//    zamPopHtml.push('</ol>');
//<!-- //step 2개인경우 : step02 다중클래스 -->

    zamPopHtml.push('<ul class="noti_step_list">');
    zamPopHtml.push('<li>현재 접속량이 많아 대기 중입니다. 잠시만 기다려 주시면 다음 단계로 안전하게 자동 접속합니다.</li>');
    //zamPopHtml.push('<li>예매 완료까지 총 <strong id="nf_timeleft"></strong> 소요 예상됩니다.</li>');
    zamPopHtml.push('<li><strong>새로 고침 하시면 순번이 뒤로 밀리니 주의해주세요.</strong></li>');
    zamPopHtml.push('</ul>');
    zamPopHtml.push('</div>');
    zamPopHtml.push('</div>');
    zamPopHtml.push('</div>');

    zamPopHtml = zamPopHtml.join('');

    NetFunnel.SkinUtil.add('test',{
        prepareCallback:function() {

           // var NLPTC = $("#NetFunnel_Loading_Popup_Total_Count");
            //NLPTC.html("100명");
            var NF_TITLE = $("#NetFunnel_Title");
            NF_TITLE.html(nf_title);


        }, updateCallback:function(percent,nwait,totwait,timeleft){
                //var NLPTC = $("#NetFunnel_Loading_Popup_Total_Count");
                //NLPTC.html(totwait);
                //$('#nf_timeleft').html(timeleft);
            //$('#NetFunnel_Loading_Popup_TimeLeft').html(timeleft);

            //nwait = 25;
            nwait = 100; //무조건 지연으로 표시
            totwait = 100;
            _this.updateStatus(nwait, totwait);
            },
            htmlStr:zamPopHtml
    },'normal');

    var updateStatus = function(nwait, totwait){

        //대기상태 표시를 위해 재정의 한다. jhcho
       var _stat = _this.getWaitRange(nwait, totwait);
        //console.log('stat:' + _stat);
        switch(_stat){
            case 1:
            //원할
            $('#status_delay').hide();
            $('#status_sdelay').hide();
            $('#status_normal').show();
            break;
            case 2:
            //다소지연
            $('#status_delay').hide();
            $('#status_sdelay').show();
            $('#status_normal').hide();
            break;
            case 3:
            //지연
            $('#status_delay').show();
            $('#status_sdelay').hide();
            $('#status_normal').hide();
            break;
            default:
                //원할
            $('#status_delay').hide();
            $('#status_sdelay').hide();
            $('#status_normal').show();
        }
    };

    var getWaitRange = function(nwait, totwait){
        var _RANGE_1 = 30, _RANGE_2 = 70 ;

       if( totwait == 0 ){
           return 1;
       }
        //비율로 변경
        var _ratio = Math.round(nwait / totwait *100);
        //console.log("ratio:"+_ratio);
        if(_ratio <= _RANGE_1){
            return 1;
        }else if(_ratio < _RANGE_2){
            return 2;
        }else{
            return 3;
        }
    };
}