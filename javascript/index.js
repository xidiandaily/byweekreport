function logic_timestamp_2_date(tstamp){
    // create a new javascript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds
    var date = new Date(tstamp);

    // year
    var year=date.getFullYear();
    // month
    var m=1+date.getMonth();
    var month="0"+m;
    // day
    var day="0"+date.getDate();

    // will display time in 10:30:23 format
    var formattedTime = year+ '/'+month.substr(month.length-2)+'/'+day.substr(day.length-2);

    return formattedTime;
}

function btn_click_show_calc(id,reportstr){
    var reportid=0;
    $('.header_class_reportstr_item').filter(function(index){
        if($('span',$(this)).text()=='"'+reportstr+'"'){
            reportid=$(this).attr('id');
        }
    });

    logic_btn_reload_page_filterid_calcid(reportid,id);
}

function btn_click_setting_calc(id){
    console.log(id);
    //$.cookie("calcid",id);
    //window.location.reload();
}

function init_calc_item(item){
    var _temp = _.template($("#id_template_calc_item").html());
    var _html = _temp({arr:JSON.parse(item['info']),data:item['data']});
    var $jq_html=$.parseHTML(_html);
    $("#id_calc_body").append($jq_html);
}

function init_calc(){
    $.ajax({
        type:"POST",
        url:g_jsconfig.adjax_url,
        dataType:"json",
        data:{"action":"getcalcdata"},
    }).done(function(resp){
        if(_.size(resp)>0){
            $("#id_calc_body").html("");
        }
        for(var x in resp){
            init_calc_item(resp[x]);
        }
        $("#id_calc_body .mc_calc_popover_class").popover({html:true,container:'body'});
        $("#id_calc_body .mc_calc_sparkline-line").sparkline();
    });
}

function btn_click_addjob(){
    console.log("btn_click_addjob");
    if($.cookie('teamname')==null || $.cookie('teamname')=='' || $.cookie('teamname')=='ALL'){
        alert("请在右上角选择小组名称,再点击添加按钮");
        return;
    }
    if($("#id-table-addjob").is(":visible")){
        $("#id-table-addjob").hide();
        $("#id-btn-addjob").text("增加");
    } else{
        $("#id-table-addjob").show();
        $("#id-btn-addjob").text("取消");
    }
}

function btn_click_addlastweekjob(){
    console.log("btn_click_addlastweekjob");
    if($.cookie('teamname')==null || $.cookie('teamname')=='' || $.cookie('teamname')=='ALL'){
        alert("请在右上角选择小组名称,再点击添加按钮");
        return;
    }
    if($("#id-table-addlastjob").is(":visible")){
        $("#id-table-addlastjob").hide();
        $("#id-btn-addlastjob").text("增加");
    } else{
        $("#id-table-addlastjob").show();
        $("#id-btn-addlastjob").text("取消");
    }
}

function btn_click_submit_addjob(){
    console.log("btn_click_submit_addjob");
    var data=new Object();
    var req=new Object();
    req.job=$("#id-table-addjob input[name='job']").val();
    req.classmate=$("#id-table-addjob input[name='classmate']").val();
    req.info=$("#id-table-addjob input[name='info']").val();
    req.teamname=$("#id-select-teamname").val();
    req.plantime=new Array();

    $("#id-table-addjob input:checked").each(function(){
        console.log($(this).attr("name"));
        req.plantime.push($(this).attr("name"));
    });
    console.log(req);

    data.action="submit_addjob";
    data.req=req;

    $.ajax({
        type:"POST",
        url:g_jsconfig.adjax_url,
        dataType:"json",
        data:data,
    }).done(function(resp){
        if(resp.ret=='true'){
            init_joblist();
            $("#id-table-addjob [name='job']").val("【】");
            $("#id-table-addjob [name='info']").val("");
            $("#id-table-addjob :checkbox").prop( "checked", false);
        }
    });
}

function btn_click_submit_deljob(id){
    console.log("btn_click_submit_deljob");
    var data=new Object();
    data.action="submit_deljob";
    data.req=id;

    $.ajax({
        type:"POST",
        url:g_jsconfig.adjax_url,
        dataType:"json",
        data:data,
    }).done(function(resp){
        if(resp.ret=='true'){
            init_joblist();
        }
    });
}

function btn_click_submit_addlastjob(){
    console.log("btn_click_submit_addlastjob");
    var data=new Object();
    var req=new Object();
    req.job=$("#id-table-addlastjob input[name='job']").val();
    req.classmate=$("#id-table-addlastjob input[name='classmate']").val();
    req.process=$("#id-table-addlastjob input[name='process']").val();
    req.teamname=$("#id-select-teamname").val();
    req.plantime=new Array();

    $("#id-table-addlastjob input:checked").each(function(){
        console.log($(this).attr("name"));
        req.plantime.push($(this).attr("name"));
    });
    console.log(req);

    data.action="submit_addlastjob";
    data.req=req;

    $.ajax({
        type:"POST",
        url:g_jsconfig.adjax_url,
        dataType:"json",
        data:data,
    }).done(function(resp){
        if(resp.ret=='true'){
            init_joblist();
            $("#id-table-addlastjob [name='job']").val("【】");
            $("#id-table-addlastjob [name='process']").val("90");
            $("#id-table-addlastjob :checkbox").prop( "checked", false);
        }
    });
}

function btn_click_submit_dellastjob(id){
    console.log("btn_click_submit_dellastjob");
    var data=new Object();
    data.action="submit_dellastjob";
    data.req=id;

    $.ajax({
        type:"POST",
        url:g_jsconfig.adjax_url,
        dataType:"json",
        data:data,
    }).done(function(resp){
        if(resp.ret=='true'){
            init_joblist();
        }
    });
}

function checkBrowser(){
    c=navigator.userAgent.search("Chrome");
    f=navigator.userAgent.search("Firefox");
    m8=navigator.userAgent.search("MSIE 8.0");
    m9=navigator.userAgent.search("MSIE 9.0");
    if (c>-1){
        brwsr = "Chrome";
    }
    else if(f>-1){
        brwsr = "Firefox";
    }else if (m9>-1){
        brwsr ="MSIE 9.0";
    }else if (m8>-1){
        brwsr ="MSIE 8.0";
    }
    return brwsr;
}

function convert_css_to_style_for_firefox()
{
    var body_arr=Array("font-family","font-size","line-height","color");
    $("body").each(function(){
        for(var i in body_arr){
            var atr=body_arr[i];
            $(this).css(atr,$(this).css(atr));
        }
    });


    var table_arr=Array("color","word-break","border-spacing","border-collapse","width","margin-bottom");
    $("table").each(function(){
        for(var i in table_arr){
            var atr=table_arr[i];
            $(this).css(atr,$(this).css(atr));
        }
    });

    var tr_arr=Array("background-color");
    $("tr").each(function(){
        for(var i in tr_arr){
            var atr=tr_arr[i];
            $(this).css(atr,$(this).css(atr));
        }
    });

    var td_arr=Array("border","padding","line-height","vertical-align","-moz-box-sizing","color","word-break","font-size","margin-bottom");
    $("td").each(function(){
        for(var i in td_arr){
            var atr=td_arr[i];
            if(atr=="border"){
                $(this).css("border","1px solid rgb(221, 221, 221)");
            }else if(atr=="line-height"){
                $(this).css("line-height","1.4285");
            }else{
                $(this).css(atr,$(this).css(atr));
            }
            console.log(atr+":"+$(this).css(atr));
        }
    })

    $(".text-center").css("text-align","center");
    $(".text-info").css("color","rgb(49, 112, 143)");
}

function btn_show_hide_button(){
    $(".btn").hide();
    $(".by_hide").hide();
    $("colgroup").hide();
    $("table").addClass("table-condensed");
    $(".container").css("width","1170px");
    if(checkBrowser()=="Firefox"){
        convert_css_to_style_for_firefox();
        alert("你是FireFox");
    }
    alert("所有按钮已经隐藏，请手动复制!");
}

function btn_download_csv(){
    var data=new Object();
    data.action="download_csv";
    data.req=new Object();
    data.req.teamname=$("#id-select-teamname").val();
    data.req.weekcount=$("#id-select-weekcount").val();

    var newurl=g_jsconfig.adjax_url+"?action="+data.action+"&req[teamname]="+data.req.teamname+"&req[weekcount]="+data.req.weekcount;
    window.open(newurl,'_blank');

    //$.ajax({
    //    type:"POST",
    //    url:g_jsconfig.adjax_url,
    //    dataType:"json",
    //    data:data,
    //}).done(function(resp){
    //    console.log(resp);
    //    if(resp.ret=='false'){
    //        alert("导出失败!");
    //    }
    //});
}

function init_joblist(){
    var data=new Object();
    data.action="get_joblist";
    data.req=new Object();
    data.req.teamname=$("#id-select-teamname").val();
    data.req.weekcount=$("#id-select-weekcount").val();
    $.ajax({
        type:"POST",
        url:g_jsconfig.adjax_url,
        dataType:"json",
        data:data,
    }).done(function(resp){
        if(resp.ret=='true'){
            $(".template_generate").detach();
            var temp= _.template($("#id-table-job-template").html());
            console.log(resp);
            for (x in resp['resp']['week']){
                console.log(x);
                var rest=temp({item:resp['resp']['week'][x]});
                $("#id-table-addjob").before($.parseHTML(rest));
            }

            var temp= _.template($("#id-table-lastjob-template").html());
            for (x in resp['resp']['lastweek']){
                console.log(x);
                var rest=temp({item:resp['resp']['lastweek'][x]});
                $("#id-table-addlastjob").before($.parseHTML(rest));
            }


            var temp2= _.template($("#id-weekreport-title-template").html());
            var rest2;
            if($.cookie("teamname")=="ALL"){
                rest2=temp2({item:"业务一组二组"});
            }else{
                rest2=temp2({item:$.cookie("teamname")});
            }
            $("#id-weekreport-title").append($.parseHTML(rest2));

            var temp3= _.template($("#id-weekreport-lasttitle-template").html());
            if($.cookie("teamname")=="ALL"){
                rest2=temp3({item:"业务一组二组"});
            }else{
                rest2=temp3({item:$.cookie("teamname")});
            }
            $("#id-weekreport-lasttitle").append($.parseHTML(rest2));
        }
    });
}

function init_classmate(){
    $.ajax({
        type:"POST",
        url:g_jsconfig.adjax_url,
        dataType:"json",
        data:{"action":"get_classmate_list","req":{"teamname":"ALL"}},
    }).done(function(resp){
        console.log(resp);
    });
}

function init_teamname(){
    if($.cookie('teamname')==null || $.cookie('teamname')==''){
        $.cookie('teamname',"ALL",{expires:14,path:'/'});
    }
    $("#id-select-teamname").val($.cookie('teamname'));
    $("#id-select-weekcount").val("1");
    $("#id-select-teamname").change(function(){
        if($("#id-table-addjob").is(":visible")){
            alert("编辑模式下不能切换项目!");
            $("#id-select-teamname").val($.cookie('teamname'));
            return;
        }
        $.cookie('teamname',$("#id-select-teamname").val(),{expires:14,path:'/'});
        init_joblist();
    });

    $("#id-select-weekcount").change(function(){
        init_joblist();
    });
}

$(function(){
    init_teamname();
    init_classmate();
    init_joblist();
});

