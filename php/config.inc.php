<?php
$_envid=3;
include 'debug.php';

if($_envid == 3){
    Loader::$config['base_url'] = "http://match.by.com/";
    Loader::$config['adjax_url'] ="http://match.by.com/byweekreport/adjax.php";
    Loader::$config['dbconf']['main'] = array('host'=>'localhost','port'=>'3388', 'user'=>'byweekuser', 'passwd'=>'passwdbyweekuser', 'dbname'=>'byweekreport');
}else if($_envid == 2){
    Loader::$config['base_url'] = "http://xidiandaily.jios.org:3603/byweekreport/";
    Loader::$config['adjax_url'] ="http://xidiandaily.jios.org:3603/byweekreport/adjax.php";
    Loader::$config['dbconf']['main'] = array('host'=>'localhost','port'=>'3306', 'user'=>'byweekuser', 'passwd'=>'passwdbyweekuser', 'dbname'=>'byweekreport');
}else{
    Loader::$config['base_url'] = "http://bytool.com/byweekreport/";
    Loader::$config['adjax_url'] ="http://bytool.com/byweekreport/adjax.php";
    Loader::$config['dbconf']['main'] = array('host'=>'127.0.0.1','port'=>'3306', 'user'=>'root', 'passwd'=>'root', 'dbname'=>'byweekreport');
}

