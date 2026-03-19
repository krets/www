<?php
$pw = 20;
$rows = 18;
$cols = 38;
$width= $pw * $cols;
$height = $pw * $rows;

$dbUser='kretsbi_mark2';
$dbPass='superduper';
$dbDb='kretsbi_mark2';

$gallery_limit=180;
$tmpImageFile='/home/kretsbi/temp/imgtmp';
function dbConnect(){
	global $dbUser;
	global $dbPass;
	global $dbDb;
	$db = mysql_connect('localhost',$dbUser,$dbPass);
	mysql_select_db($dbDb,$db);
	return $db;
}

function hsv2rgb($Hdeg,$S=.9,$V=.8) {
	$H = $Hdeg/360;	//convert from degrees to 0 to 1
	if ($S==0){		//HSV values = From 0 to 1
		$R = $V*255;	//RGB results = From 0 to 255
		$G = $V*255;
		$B = $V*255;
	}
	else {
		$var_h = $H*6;
		$var_i = floor( $var_h ); //Or ... var_i = floor( var_h )
		$var_1 = $V*(1-$S);
		$var_2 = $V*(1-$S*($var_h-$var_i));
		$var_3 = $V*(1-$S*(1-($var_h-$var_i)));

		if ($var_i==0) {$var_r=$V ; $var_g=$var_3; $var_b=$var_1;}
		else if ($var_i==1) {$var_r=$var_2; $var_g=$V; $var_b=$var_1;}
		else if ($var_i==2) {$var_r=$var_1; $var_g=$V; $var_b=$var_3;}
		else if ($var_i==3) {$var_r=$var_1; $var_g=$var_2; $var_b=$V;}
		else if ($var_i==4) {$var_r=$var_3; $var_g=$var_1; $var_b=$V;}
		else {$var_r=$V; $var_g=$var_1; $var_b=$var_2;}

		$R = round($var_r*255); //RGB results = From 0 to 255
		$G = round($var_g*255);
		$B = round($var_b*255);
	}
	return Array($R,$G,$B);
}
function rgb2hex($v) {
        $rh = dechex(intval($v[0])); if(strlen($rh)< 2) $rh = "0".$rh;
        $gh = dechex(intval($v[1])); if(strlen($gh)< 2) $gh = "0".$gh;
        $bh = dechex(intval($v[2])); if(strlen($bh)< 2) $bh = "0".$bh;
        return "#".$rh.$gh.$bh;
}

function decodeVal($str){
	$sE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	$max = 360;
	for($i=0;$i<strlen($sE);$i++){
		if($str==substr($sE,$i,1)){	
			return ($i/strlen($sE))*360;
		}
	}
	return "$str not found in $sE";
}


function getMood(){
	$moods = array(
'accomplished','adored','adventurous','aggravated','amorous','amused','angry','angsty','animated','annoyed','anxious','apathetic','argumentative','aroused','artistic','ashamed','awake','betrayed','bitchy','blah','blank','blessed','blissful','blustery','bored','bouncy','breezy','bullied','bummed','busy','calm','cantankerous','catalyzed','cheerful','chill','chipper','cold','complacent','confident','confused','contemplative','content','cooky/wacky','cranky','crappy','crazy','creative','crunk','crushed','cultured','curious','cynical','depressed','determined','devious','dirty','disappointed','discontent','disgusted','distractable','distraught','distressed','ditzy','dorky','drained','drunk','eccentric','ecstatic','electric','embarrassed','energetic','enlightened','enraged','enthralled','envious','evil','exanimate','excited','exhausted','exotic','fabulous','fascinated','fermented','flirty','focused','forgotten','frisky','froggy','frustrated','full','gallant','geeky','giddy','giggly','gloomy','good','grateful','groggy','grumpy','guilty','handsome','happy','high','hopeful','horny','hot','hungover','hungry','hyper','imaginative','impatient','impervious','implacable','impressed','indescribable','indifferent','indignant','infuriated','inquisitive','inspired','insubordinate','intense','intimidated','irate','irritated','jealous','jedi','jolly','jubilant','knighted','lazy','lethargic','listless','lonely','loved','luminous','mad','melancholy','mellow','mischievous','miserable','moody','morose','naughty','nauseated','neglected','nerdy','nervous','ninja','nostalgic','numb','obsequious','okay','optimistic','overstimulated','peaceful','peeved','pensive','pessimistic','pirate','pissed off','pissy','played','pleased','pretty','productive','pugnacious','pure','quiet','quixotic','rebellious','recumbent','refreshed','rejected','rejuvenated','relaxed','relieved','restless','rockin','romantic','rushed','sad','sassy','satisfied','savage','scared','selective','shocked','sick','silly','sleepy','smart','smitten','sneaky','sneezy','sore','stalked','stoked','stressed','strong','surprised','sweaty','sympathetic','talkative','tested','thankful','thirsty','thoughtful','tired','touched','triumphant','uncomfortable','understimulated','used','validated','vehement','vexed','vibrant','virginal','vital','voluminous','wanted','warm','weird','working','worried'
);
	shuffle($moods);
	return $moods[0];
}
