<?php
$action=$_REQUEST['action'];
$cookie=$_COOKIE;

if(empty($action))
{
    showMessage("非法操作！");
}

