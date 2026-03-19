<html>
 <head>
<style type='text/css'>
body{
 background: #555;
 text-align: center;
}
#backgroundText {margin:0;padding:0;overflow:hidden; font-family:monospace;line-height:100%; position:absolute; top:0; left:0; z-index: -1;}
#buffer, 
#canvas {
 margin: auto;
 border: solid 1px #ccc;
}

#buffer {
 display: none;
}

</style>
<script src="/js/mootools.js" type="text/javascript"></script>
<script src="/js/excanvas.compiled.js" type="text/javascript"></script>
<!--script type="text/javascript" src="/js/MersenneTwister19937.js"></script-->
<script type="application/x-javascript">
window.addEvent('domready', function(e){init(e);}); 


function init() {
	var myRad = 5;
	var myPad = 1;
	var mySize = (myRad+myPad)*2
	var cols = 66;
	var rows = 64;
	$('canvas').width=cols*mySize;
	$('canvas').height=rows*mySize;
	$('buffer').width=cols*mySize;
	$('buffer').height=rows*mySize;

	var ctx = $('canvas').getContext("2d");
	
	var y = 0;
	for(i=0;i<(cols*rows);i=i+1){
		continue;
		var deg =(i/(cols*rows))*360%360 ;
		var yOffset = parseInt(i/cols)*mySize+myRad+myPad;
		ctx.beginPath();
		ctx.strokeStyle = "rgb("+(hsv2rgb(deg,1,1)).join(",")+")";
		ctx.arc(0+myRad+myPad+(i%cols)*mySize, yOffset,random(i,myRad/2,myRad*2),0,Math.PI*2,false);
		ctx.stroke();
	}
	$('canvas').addEvent('mousemove',function(e){
		var posX = e.client.x; 
		var posY = e.client.y;
		mousePaint(posX,posY);
	});
	$('canvas').addEvent('dblclick',function(e){
		var w = $('canvas').width;
		var h = $('canvas').height;
		src=$('canvas').getContext('2d');
		src.clearRect(0,0,w,h);
	});
}
var myDeg=0;
var context = 0;
function mousePaint(x,y){
	context += 1;
	if(context % 3 != 0){
		return;
	}
	if(context % 3 == 0){
		aggitate(x,y,2);
	}
	var ctx = $('canvas').getContext("2d");
	var xOffset = $('canvas').offsetLeft+(Random.next()*30-15);
	var yOffset = $('canvas').offsetTop+(Random.next()*30-15);
	xOffset = $('canvas').offsetLeft
	yOffset = $('canvas').offsetTop

	ctx.beginPath();
	ctx.strokeStyle = "rgb("+(hsv2rgb(myDeg++%360,1,1)).join(",")+")";
	var a = random(1,0,12);
	for (b = a;b>0;b-=1){
		ctx.arc(x-xOffset,y-yOffset,b,0,Math.PI*2,false);
		ctx.stroke();
	}
}
function hsv2rgb(Hdeg,S,V) {
	H = Hdeg/360;   //convert from degrees to 0 to 1
	if (S==0){	      //HSV values = From 0 to 1
		R = V*255;      //RGB results = From 0 to 255
		G = V*255;
		B = V*255;
	}
	else {
		var_h = H*6;
		var_i = Math.floor( var_h ); //Or ... var_i = floor( var_h )
		var_1 = V*(1-S);
		var_2 = V*(1-S*(var_h-var_i));
		var_3 = V*(1-S*(1-(var_h-var_i)));

		if (var_i==0) {var_r=V ; var_g=var_3; var_b=var_1}
		else if (var_i==1) {var_r=var_2; var_g=V; var_b=var_1}
		else if (var_i==2) {var_r=var_1; var_g=V; var_b=var_3}
		else if (var_i==3) {var_r=var_1; var_g=var_2; var_b=V}
		else if (var_i==4) {var_r=var_3; var_g=var_1; var_b=V}
		else {var_r=V; var_g=var_1; var_b=var_2}

		R = Math.round(var_r*255); //RGB results = From 0 to 255
		G = Math.round(var_g*255);
		B = Math.round(var_b*255);
	}
	return new Array(R,G,B);
}
function rgb2hex(v) {
	rh = parseInt(v[0]).toString(16); if(rh.length < 2) rh = "0"+rh;
	gh = parseInt(v[1]).toString(16); if(gh.length < 2) gh = "0"+gh;
	bh = parseInt(v[2]).toString(16); if(bh.length < 2) bh = "0"+bh;
	return "#"+rh+gh+bh;
}

function random(s,lower,upper){
	if(typeof lower == 'undefined'){
		lower=0;
	}
	if(typeof upper == 'undefined'){
		upper=1;
		if(lower>upper){
			lower=0;
		}
	}
	//init_genrand(s)
	//var num=genrand_real1();
	var num=Math.random();
	var range = upper - lower;
	num *= range;
	num += lower;
	return num
}

function random_old(startseed,lower,upper){
	var bigPrime = 134775813;
//	bigPrime = 393050634124102232869567034555427371542904833;
	bigPrime = 200560490131;
	if(typeof lower == 'undefined'){
		lower=0;
	}
	if(typeof upper == 'undefined'){
		upper=1;
		if(lower>upper){
			lower=0;
		}
	}
	if(typeof startseed == 'undefined'){
		startseed = 123456
	}
	var maxi = Math.pow(2,32);
	var seed = (bigPrime * (startseed + 1)) % maxi;
	var num = seed/maxi;
	var range = upper - lower;
	num *= range*10;
	num %= range
//	num *= range
	num += lower;
	return num;
}
var Random = 
{
 seed : 12345,
 //Returns a random number between 0 and 1
 next : function(lower,upper)
 {
  var maxi = Math.pow(2,32);
  this.seed = (134775813 * (this.seed + 1))
     % maxi;
  var num = (this.seed) / maxi;
  if(typeof lower!='undefined')
  {
   var range = upper - lower;
   num *= range;
   num += lower;
  }
  return num;
 }
}

function aggitate(x,y,zoom){
	x=x-$('canvas').offsetLeft;
	y=y-$('canvas').offsetTop;
	var w = $('canvas').width;
	var h = $('canvas').height;
	
	var dx = 0;
	var dy = 0;
	dx=zoom/2*((w-x)/w)+(zoom/4);
	dy=zoom/2*((h-y)/h)+(zoom/4);

	buf=$('buffer').getContext('2d');
	buf.clearRect(0,0,w,h);
	buf.drawImage($('canvas'),0,0,w,h);
	src=$('canvas').getContext('2d');
	src.drawImage($('buffer'),0,0,w,h,dx,dy,w-zoom,h-zoom)
}
	

  </script>
 </head>
 <body>
   <div id='backgroundText'>
<?php
$w=300;
$h=200;
$chars=array("\\","/");
$l='huh';
$forward=True;
for($y=0;$y<$h;$y++){
  if($y==0){
    $l=array();
    for($x=0;$x<$w;$x++){
      shuffle($chars);
      $l[]=$chars[0];
    }
  }elseif($y%rand(0,$h)==0){
    $forward=($forward?False:True);
    $l2=array();
    foreach($l as $c){
      $l2[]=strtr($c,"/\\","\\/");
    }
    $l=$l2;
  }elseif($forward){
    $foo=array_shift($l);
    $l[]=$foo;
  }else{
    $foo=array_pop($l);
    array_unshift($l,$foo);
  }
  echo join("",$l)."\n";
}
?>
   </div>
   <canvas id="canvas" width="800" height="200"></canvas>
	<br/>
   <canvas id="buffer" width="800" height="200"></canvas>
 </body>
</html>

