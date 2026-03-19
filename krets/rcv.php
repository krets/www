<?php
$m=htmlentities(urldecode($_REQUEST['m']),ENT_QUOTES);
$s=$_REQUEST['s'];
include('mark2_config.php');
$x = $cols;
$y = $rows;
$tmp = $tmpImageFile.md5($_SERVER['REMOTE_ADDR'].time());
$gd = imagecreatetruecolor($x,$y);

$i=0;
while($i<strlen($s)){
	$rgb=hsv2rgb(decodeVal(substr($s,$i,1)));
	$co=imagecolorallocate($gd,$rgb[0],$rgb[1],$rgb[2]);
	$row = intval($i/$x);
	imagesetpixel($gd,$i%$x,$row,$co);
	$i++;
}
imagepng($gd,$tmp) or die("SHIT");
$imgbytes = filesize($tmp);
if($imgbytes<10){
	die("$imgbytes is < 10");
}
if($i<1){
	die("no pixels received.\n");
}
$db = dbConnect();
if(!$db){
	die("Sadness - no db connection.\n");
}
$imagedata=addslashes(file_get_contents($tmp));
$ip=$_SERVER['REMOTE_ADDR'];
$sql="INSERT INTO images (note,ip,image) VALUES('$m','$ip','$imagedata');";
mysql_query($sql) or die(mysql_error()."\n");
unlink($tmp);
echo "OK";

?>

