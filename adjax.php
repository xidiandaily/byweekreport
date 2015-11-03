<?php

include 'php/Loader.php';
include 'php/config.inc.php';
include 'php/class.DBPDO.php';
include 'php/class.MySQL.php';

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

    $teamname=$req['teamname'];
    if(empty($teamname) || $teamname=='ALL'){
        $sql="select * from curweekjob;";
    }else{
        $sql="select * from curweekjob where teamname='$teamname';";
    }
    $ret=$DB->executeSQL($sql);
    if(!$ret){
        echo json_encode(array('ret'=>'false','获取失败!'));
        die();
    }
    echo json_encode(array('ret'=>'true','resp'=>$ret));
}else{
    echo json_encode(array('ret'=>'false','无效操作!!'));
}

