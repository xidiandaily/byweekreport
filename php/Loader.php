<?php
class Loader {

    public static $config = null;

    public static $instance = null;

    public static function Mysql($key)
    {
        if(!isset(self::$instance["DB"][$key])
            || !is_object(self::$instance["DB"][$key])) {
                if(!isset(self::$config['dbconf'][$key]))
                {
                    die(json_encode(array("status" => 0, "msg" => 'DB:寻找配置信息失败!')));
                }
                self::$instance["DB"][$key] = new Lib_Mysql(self::$config['dbconf'][$key]);	
            }
        return self::$instance["DB"][$key];
    }

    public static function Redis($key) {
        if(!isset(self::$instance["redis"][$key])
            || !is_object(self::$instance["redisconf"][$key])) {
                if(!isset(self::$config['redisconf'][$key]))
                {
                    die(json_encode(array('status' => 0, 'msg' => 'Redis:寻找配置信息失败!')));
                }
                self::$instance['redis'][$key] = new Lib_Redis(self::$config['redisconf'][$key]);	
            }
        return self::$instance["redis"][$key];
    }
}

