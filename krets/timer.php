<?php
if(isset($_REQUEST['s'])){
	$seconds=$_REQUEST['s'];
}else{
	$seconds=30;
}
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN"
"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
<head>
<title>Countdown</title>
<script src="/js/prototype.js" type="text/javascript"></script>
<script src="/js/scriptaculous.js" type="text/javascript"></script>
<script type="text/javascript">
var start = <?php echo $seconds;?>

Event.observe(window, 'load',
  function() {display(start);setFont();}
);
window.onresize = function() {setFont();};
function setFont(){
  var x = window.innerWidth/5
  var y = x.toString()+'pt'
  $('countdown').setStyle({fontSize : y});
}
	
  function toMinutesAndSeconds( x ) {
    var a = Math.floor(x/60)
    var b = x%60
    if(a.toString().length<2){
       a='0'+a
    }  
    if(b.toString().length<2){
       b='0'+b
    }
    return a+':'+b 
   
    return Math.floor(x/60) + ":" + sprintf("%s",x%60);
  }

function display(seconds) {
	$('countdown').innerHTML = toMinutesAndSeconds(--seconds)
	if(seconds > 0) {
		window.setTimeout(function(){display(seconds)}, 1000);
	}
	
	if(seconds < 11) {
	//	document.getElementById("notifier").innerHTML = "Just 10 seconds to go.";
	}
	
	if (seconds == 2) {
	new Effect.Highlight($('wrap'), 
        {
           startcolor: "#ffffff",
           endcolor: "#ff0000",
           restorecolor: "#ff0000",
           duration: 3
       })
	
	}

	if (seconds == 0) {
		//$("notifier").innerHTML = "Time is up.";
	}
}
</script>
<style type='text/css'>
#countdown {
 font-size: 200pt;
 width: 80%;
 margin: auto;
}
body {
 margin:0;
 padding:0;
 height: 100%;
}
wrap {
 height: 100%;
}

</style>
</head>
<body>
<div id='wrap'>
<div id="countdown"></div>
<div id="notifier"></div>

</div>
</body>
</html>
