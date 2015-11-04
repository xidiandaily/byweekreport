<?php
class CCal2CSV{

    public static $config = null;

    public static $instance = null;

    public static function DownLoadCSV($week)
    {
        $week_time=Array();

        $mon_am_begin=strtotime("last Monday 9 hours 30 minutes");
        $mon_am_end=strtotime("last Monday 12 hours 30 minutes");
        $mon_pm_begin=strtotime("last Monday 14 hours");
        $mon_pm_end=strtotime("last Monday 18 hours 30 minutes");

        $time_stone=Array("c11",'c12',"c21",'c22',"c31",'c32',"c41",'c42',"c51",'c52');
        $i=0;
        foreach($time_stone as $key => $item){
            if($i%2==0){
                $week_time[$item]=Array("begin"=>$mon_am_begin+(intval($i/2))*86400,
                    "end"=>$mon_am_end+(intval($i/2))*86400);
            }else{
                $week_time[$item]=Array("begin"=>$mon_pm_begin+(intval($i/2))*86400,
                    "end"=>$mon_pm_end+(intval($i/2))*86400);
            }
            $i++;
        }

        $calc_list =array(array('Subject','Start Date','Start Time','End Date','End Time','Description'));
        foreach($week as $key=>$item){
            $title='['.$item['classmate'].']'.$item['job'];
            $desc=$item['job'].".".$item['classmate'].".".$item["teamname"];
            foreach(json_decode($item['plantime']) as $ykey=>$yitem){
                $start_date=strftime("%m/%d/%G",$week_time[$yitem]['begin']);
                $start_time=strftime("%l:%M %p",$week_time[$yitem]['begin']);
                $end_date=strftime("%m/%d/%G",$week_time[$yitem]['end']);
                $end_time=strftime("%l:%M %p",$week_time[$yitem]['end']);
                $calc_list[]=Array($title,$start_date,$start_time,$end_date,$end_time,$desc);
            }
        }

        $filename='test.calendar.csv';
        $path='tmp/'.$filename;

        $fp = fopen($path,'w');
        if(!$fp){
            return false;
        }

        foreach($calc_list as $fields){
            fputcsv($fp,$fields);
        }

        fclose($fp);

        $refile= strftime("calcendar.%G%m%d.csv",$mon_am_begin);
        $file = $path;
        header("Content-Description: File Transfer"); 
        header("Content-Type: application/octet-stream"); 
        header("Content-Disposition: attachment; filename=\"$refile\""); 

        readfile ($file); 
        return true;
    }
}

