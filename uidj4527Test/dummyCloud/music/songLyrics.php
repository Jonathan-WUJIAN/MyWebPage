﻿<?php
//$userid=$_GET["userid"];
define ( 'HTTP',   'http://' );
define ( 'PATH',   '/music/' );
/*
//		$myfile = fopen("Adele-Set Fire To The Rain.lrc", "r");
//		fread($myfile,filesize("Adele-Set Fire To The Rain.lrc"));
//		var_dump($myfile);
			$myfile = file_get_contents("Adele-Set Fire To The Rain.lrc");
//			echo $myfile;
//		$myfile = "my json data";
			$data = array('songlyrics'=>"$myfile");
//		$data = readfile("Adele-Set Fire To The Rain.lrc");
  		echo json_encode($data);
//    	fclose($myfile);
//}
//else
//{
//	$myfile = "wrong content"; 
//}
*/
//$lrc_url = "Adele-Someone Like You.lrc";
//echo "I am before";
$lrc_url = $_GET["lrc_url"];
//echo "I am in";
//echo $lrc_url;
//echo "I am after";
get_lrc($lrc_url);
/*function get_lrc($lrc_url){
	if($lrc_url){
		$content = file_get_contents($lrc_url);
//		echo $content;
		$array = explode("\n",$content);
		$lrc = array();
		foreach($array as $val){
			$val = preg_replace('/\r/','',$val);
			$temp = preg_match_all('/\[\d{2}\:\d{2}\.\d{2}\]/', $val, $matches);
			if(!empty($matches[0])){
				$data_plus = "";
				$time_array = array();
				
				foreach($matches[0] as $V){
					$data_plus .= $V;
					$V = str_replace("[","",$V);
					$V = str_replace("]","",$V);
					$date_array = explode(":",$V);
					
					$time_array[] = intval($date_array[0]*6000+$date_array[1]*100);
				}
				$data_plus = str_replace($$data_plus,"",$val);
				foreach($time_array as $V){
					$lrc[] = array($V,$data_plus);
				}
			}
		}
		echo json_encode($lrc);
	}
}
*/

function get_lrc($lrc_url){
//	 global $x;
//	 $x=0;
	$lyrics_content = "";
//	echo "I am in";
	if($lrc_url){
		$content = file_get_contents($lrc_url);
//		echo $content;
		$array = explode("\n",$content);
		$lrc = array();
		foreach($array as $val){
			$val = preg_replace('/\r/','',$val);
			$temp = preg_match_all('/\[\d{2}\:\d{2}\.\d{2}\]/', $val, $matches);
			if(!empty($matches[0])){
				$data_plus = "";
				$time_array = array();
				
				foreach($matches[0] as $V){
					$data_plus .= $V;
					$V = str_replace("[","",$V);
					$V = str_replace("]","",$V);
					$date_array = explode(":",$V);
					
					$time_array[] = intval($date_array[0]*6000+$date_array[1]*100);
				}
				$data_plus = str_replace($data_plus,"",$val);
//				foreach($time_array as $V){
//					$lrc[] = array($V,$data_plus);
//				 $x+=1;
//				 $lrc[] = array($x,$data_plus);
					$lyrics_content.=$data_plus;
					$lyrics_content.="\n";
				//	echo $data_plus;
//			}
			}
		}
//		echo $lyrics_content;
//		echo "I am here";
		$lrc[] = array($lyrics_content);
		echo json_encode($lrc);
	}
}
?>