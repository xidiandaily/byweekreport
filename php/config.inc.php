<?php
$_envid=3;
include 'debug.php';

if($_envid == 3){
    Loader::$config['base_url'] = "http://bytool.com/byweekreport/";
    Loader::$config['adjax_url'] ="http://bytool.com/byweekreport/adjax.php";
    Loader::$config['dbconf']['main'] = array(array('192.168.2.171:3388', 'muser', 'tseiFbt1ozfkgd6s', 'monitor_main'));
}else{
    Loader::$config['base_url'] = "http://bytool.com/byweekreport/";
    Loader::$config['adjax_url'] ="http://bytool.com/byweekreport/adjax.php";
    Loader::$config['dbconf']['main'] = array(array('192.168.200.144:3388', 'root', 'public', 'monitor_main'));
}

