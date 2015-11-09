<?php

include 'php/Loader.php';
include 'php/config.inc.php';
include 'php/class.DBPDO.php';
include 'php/class.MySQL.php';
include 'php/to_csv_gcal.php';

$action=$_REQUEST['action'];
$req=$_REQUEST['req'];

$cookie=$_COOKIE;

if($action=='submit_addjob'){
    $DB=new MySQL(Loader::$config['dbconf']['main']['dbname'],
        Loader::$config['dbconf']['main']['user'],
        Loader::$config['dbconf']['main']['passwd'],
        Loader::$config['dbconf']['main']['host'],
        Loader::$config['dbconf']['main']['port']);

    $val=array('job'=>$req['job'],'classmate'=>$req['classmate'],'info'=>$req['info'],'teamname'=>$req['teamname'],'plantime'=>json_encode($req['plantime']));
    $datatypes=array('str','str','str','str','str');
    $ret=$DB->insert("curweekjob",$val,'',$datatypes);
    if(!$ret){
        echo json_encode(array('ret'=>'false','更新失败!'));
        die();
    }
    echo json_encode(array('ret'=>'true','更新成功!'));
}else if($action=='submit_deljob'){
    $DB=new MySQL(Loader::$config['dbconf']['main']['dbname'],
        Loader::$config['dbconf']['main']['user'],
        Loader::$config['dbconf']['main']['passwd'],
        Loader::$config['dbconf']['main']['host'],
        Loader::$config['dbconf']['main']['port']);
    $sql="update curweekjob set enable=0 where id=".$req;
    $ret=$DB->executeSQL($sql);
    if(!$ret){
        echo json_encode(array('ret'=>'false','更新失败!'));
        die();
    }
    echo json_encode(array('ret'=>'true','更新成功!'));
}else if($action=='submit_addlastjob'){
    $DB=new MySQL(Loader::$config['dbconf']['main']['dbname'],
        Loader::$config['dbconf']['main']['user'],
        Loader::$config['dbconf']['main']['passwd'],
        Loader::$config['dbconf']['main']['host'],
        Loader::$config['dbconf']['main']['port']);

    $val=array('job'=>$req['job'],'classmate'=>$req['classmate'],'process'=>$req['process'],'teamname'=>$req['teamname'],'plantime'=>json_encode($req['plantime']));
    $datatypes=array('str','str','int','str','str');
    $ret=$DB->insert("lastweekjob",$val,'',$datatypes);
    if(!$ret){
        echo json_encode(array('ret'=>'false','更新失败!'));
        die();
    }
    echo json_encode(array('ret'=>'true','更新成功!'));
}else if($action=='submit_dellastjob'){
    $DB=new MySQL(Loader::$config['dbconf']['main']['dbname'],
        Loader::$config['dbconf']['main']['user'],
        Loader::$config['dbconf']['main']['passwd'],
        Loader::$config['dbconf']['main']['host'],
        Loader::$config['dbconf']['main']['port']);
    $sql="update lastweekjob set enable=0 where id=".$req;
    $ret=$DB->executeSQL($sql);
    if(!$ret){
        echo json_encode(array('ret'=>'false','更新失败!'));
        die();
    }
    echo json_encode(array('ret'=>'true','更新成功!'));
}else if($action=='get_teamname_list'){
    $DB=new MySQL(Loader::$config['dbconf']['main']['dbname'],
        Loader::$config['dbconf']['main']['user'],
        Loader::$config['dbconf']['main']['passwd'],
        Loader::$config['dbconf']['main']['host'],
        Loader::$config['dbconf']['main']['port']);

    $sql="select DISTINCT teamname from curweekjob;";
    $ret=$DB->executeSQL($sql);
    if(!$ret){
        echo json_encode(array('ret'=>'false','获取失败!'));
        die();
    }
    echo json_encode(array('ret'=>'true','resp'=>$ret));
}else if($action=='get_classmate_list'){
    $DB=new MySQL(Loader::$config['dbconf']['main']['dbname'],
        Loader::$config['dbconf']['main']['user'],
        Loader::$config['dbconf']['main']['passwd'],
        Loader::$config['dbconf']['main']['host'],
        Loader::$config['dbconf']['main']['port']);

    $teamname=$req['teamname'];
    if(empty($teamname) || $teamname=='ALL'){
        $sql="select DISTINCT classmate from curweekjob;";
    }else{
        $sql="select DISTINCT classmate from curweekjob where teamname='$teamname';";
    }
    $ret=$DB->executeSQL($sql);
    if(!$ret){
        echo json_encode(array('ret'=>'false','获取失败!'));
        die();
    }
    echo json_encode(array('ret'=>'true','resp'=>$ret));
}else if($action=='get_joblist'){
    $DB=new MySQL(Loader::$config['dbconf']['main']['dbname'],
        Loader::$config['dbconf']['main']['user'],
        Loader::$config['dbconf']['main']['passwd'],
        Loader::$config['dbconf']['main']['host'],
        Loader::$config['dbconf']['main']['port']);

    $teamname=$req['teamname'];   //项目组名称(默认是全部）
    $weekcount=$req['weekcount']; //最近几周(默认是一周）
    if(empty($weekcount)){
        $weekcount=1;
    }

    $begin_time=strtotime("-$weekcount Sunday");
    $end_time=$begin_time+$weekcount*7*86400;
    
    $begin_time=strftime("%Y-%m-%d %H:%M:%S",$begin_time);
    $end_time=strftime("%Y-%m-%d %H:%M:%S",$end_time);

    if(empty($teamname) || $teamname=='ALL'){
        $sql="select * from curweekjob where enable!=0 and timestamp >= '$begin_time' and timestamp <='$end_time';";
    }else{
        $sql="select * from curweekjob where enable!=0 and teamname='$teamname' and timestamp >= '$begin_time' and timestamp<='$end_time';";
    }

    $week=$DB->executeSQL($sql);
    if(!$week){
        echo json_encode(array('ret'=>'false','获取工作计划失败!'.$DB->lastError));
        die();
    }


    if(empty($teamname) || $teamname=='ALL'){
        $sql="select * from lastweekjob where enable!=0 and timestamp >= '$begin_time' and timestamp<='$end_time';";
    }else{
        $sql="select * from lastweekjob where enable!=0 and teamname='$teamname' and timestamp >= '$begin_time' and timestamp<='$end_time';";
    }

    $DB2=new MySQL(Loader::$config['dbconf']['main']['dbname'],
        Loader::$config['dbconf']['main']['user'],
        Loader::$config['dbconf']['main']['passwd'],
        Loader::$config['dbconf']['main']['host'],
        Loader::$config['dbconf']['main']['port']);
    $lastweek=$DB2->executeSQL($sql);
    if(!$lastweek){
        echo json_encode(array('ret'=>'false','获取工作总结失败!'.$DB2->lastError));
        die();
    }
    echo json_encode(array('ret'=>'true','resp'=>array("week"=>$week,"lastweek"=>$lastweek)));
}else if($action=='download_csv'){
    $DB=new MySQL(Loader::$config['dbconf']['main']['dbname'],
        Loader::$config['dbconf']['main']['user'],
        Loader::$config['dbconf']['main']['passwd'],
        Loader::$config['dbconf']['main']['host'],
        Loader::$config['dbconf']['main']['port']);

    $teamname=$req['teamname'];   //项目组名称(默认是全部）
    $weekcount=$req['weekcount']; //最近几周(默认是一周）
    if(empty($weekcount)){
        $weekcount=1;
    }

    $begin_time=strtotime("-$weekcount Sunday");
    $end_time=$begin_time+$weekcount*7*86400;

    $begin_time=strftime("%Y-%m-%d %H:%M:%S",$begin_time);
    $end_time=strftime("%Y-%m-%d %H:%M:%S",$end_time);

    if(empty($teamname) || $teamname=='ALL'){
        $sql="select * from curweekjob where enable!=0 and timestamp >= '$begin_time' and timestamp <='$end_time';";
    }else{
        $sql="select * from curweekjob where enable!=0 and teamname='$teamname' and timestamp >= '$begin_time' and timestamp<='$end_time';";
    }

    $week=$DB->executeSQL($sql);
    if(!$week){
        echo json_encode(array('ret'=>'false','转换工作计划失败!'.$DB->lastError));
        die();
    }
    CCal2CSV::DownLoadCSV($week);
    //$ret=CCal2CSV::DownLoadCSV($week);
    //if(!$ret){
    //    echo json_encode(array('ret'=>'false','获取失败!'));
    //    die();
    //}
    //echo json_encode(array('ret'=>'true','获取成功!'));
}else{
    echo json_encode(array('ret'=>'false','无效操作!!'));
}

