<?php
include('mark2_config.php');
$db = dbConnect();
if(!$db){
	die("Sadness - no db connection.\n");
}
$res = mysql_query("SELECT id,note FROM images ORDER BY timestamp DESC LIMIT $gallery_limit",$db);
while($en=mysql_fetch_assoc($res)){
	echo "<img src='img.php?id={$en['id']}&.png' title='{$en['note']}' />\n";
}
?>
