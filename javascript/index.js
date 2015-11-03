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
    req.project=$("#id-table-addjob input[name='project']").val();
    req.classmate=$("#id-table-addjob input[name='classmate']").val();
    req.info=$("#id-table-addjob input[name='info']").val();
    req.date=new Array();

    $("#id-table-addjob input:checked").each(function(){
        console.log($(this).attr("name"));
        req.date.push($(this).attr("name"));
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
            init_curweek_job();
        }
    });
}

function init_curweek_job(){
    $.ajax({
        type:"POST",
        url:g_jsconfig.adjax_url,
        dataType:"json",
        data:{"action":"get_curweek_job"},
    }).done(function(resp){
        var temp= _.template($("#id_project_item_template").html());
        $("#id_project_item").html("");
        for (x in resp['projectlist']){
            var rest=temp({item:resp['projectlist'][x]});
            $("#id_project_item").append($.parseHTML(rest));
        }
        init_project_item_click();
    });
}

$(function(){
    //btn_click_addjob();
    //init_calc();
});

