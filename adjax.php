<?php
$action=$_REQUEST['action'];
$cookie=$_COOKIE;

if(empty($action)){
    showMessage("非法操作！");
}else if($action=='submit_addjob'){

}

