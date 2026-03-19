<?php
$id=$_REQUEST['id'];
if(preg_match("/[^0-9]/",$id)){
	die("STFU!");
}
include('mark2_config.php');
$x = $cols;
$y = $rows;
$db = dbConnect();
if(!$db){
	die("Sadness - no db connection.\n");
}
$res = mysql_query("SELECT image FROM images WHERE id=$id",$db);

header('Content-Type: image/png');
if($res){
	echo mysql_result($res,0);
}else{
	$gd = imagecreatetruecolor($x,$y);
	imagepng($gd);
}
?>
