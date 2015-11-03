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

function btn_click_submit_addjob(){
    console.log("btn_click_submit_addjob");
    var data=new Object();
    var req=new Object();
    req.job=$("#id-table-addjob input[name='job']").val();
    req.classmate=$("#id-table-addjob input[name='classmate']").val();
    req.info=$("#id-table-addjob input[name='info']").val();
    req.teamname='麻将小组';
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
            for (x in resp['resp']){
                var rest=temp({item:resp['resp'][x]});
                $("#id-table-addjob").before($.parseHTML(rest));
            }
        }
    });
}

function init_teamname(){
    $.ajax({
        type:"POST",
        url:g_jsconfig.adjax_url,
        dataType:"json",
        data:{"action":"get_teamname_list"}
    }).done(function(resp){
        console.log(resp);
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
    if($.cookie('teamname')=='ALL'){
        $("#id-weekreport-title").text("云计算Server业务一二组本周工作周报");
    }else{
        $("#id-weekreport-title").text("云计算Server"+$.cookie('teamname')+"本周工作周报");
    }

    $("#id-select-weekcount").val("1");
    $("#id-select-teamname").change(function(){
        if($("#id-table-addjob").is(":visible")){
            alert("编辑模式下不能切换项目!");
            $("#id-select-teamname").val($.cookie('teamname'));
            return;
        }
        $.cookie('teamname',$("#id-select-teamname").val(),{expires:14,path:'/'});
        if($.cookie('teamname')=='ALL'){
            $("#id-weekreport-title").text("云计算Server业务一二组本周工作周报");
        }else{
            $("#id-weekreport-title").text("云计算Server"+$.cookie('teamname')+"本周工作周报");
        }
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
    init_teamname();
});

