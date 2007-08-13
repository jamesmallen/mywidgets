function make(O, p, m) {
	p = p ? p : {};
	var r = new O();
	if (m){
		apply(r,p);
	} else {
		for (var i in p) {
			r[i] = p[i];
		}
	}
	return r;
}

function makeApp(o, r, p, m) {
	return r.appendChild(make(o, p, m));
}

function opImage(i,o) {
	var t,c,w=i.srcWidth,h=i.srcHeight,f=system.widgetDataFolder+'/opimage.png';
	if (i==opImage._i&&o==opImage._o) {
		return opImage._I;
	} else {
		opImage._i=i;
		opImage._o=o;
		opImage._I=null;
	}
	
	t=make(Canvas,{width:w,height:h});
	c=t.getContext('2d');
	c.drawImage(i,0,0);
	c.globalCompositeOperation='destination-in';
	c.fillStyle='rgba(0,0,0,'+o+')';
	c.fillRect(0,0,w,h);
	t.saveImageToFile(f,'png');
	opImage._I=make(Image,{src:f});
	return opImage._I;
}

function apply(a, b) {
	for(var i in b) {
		if (typeof(b[i]) == 'object') {
			apply(a[i], b[i]);
		} else {
			a[i]=b[i];
		}
	}
}

function pdump(o) {
  print("PDUMP of " + o);
  for (var i in o) {
    if (typeof(o[i]) != "function") {
      print("  [" + i + "]: " + o[i]);
		}
	}
}

function anmUpd() {
	log('anmUpd');
	var t=animator.milliseconds-this.startTime;
	gHBlur=blurMax/2*(1+Math.cos(t/10000));
	gVBlur=blurMax/2*(1+Math.cos(t/10000+Math.PI));
	paint(gHBlur,gVBlur);
	return true;
}

function focusUpd() {
	log('focusUpd');
	var pct,h,v,t=animator.milliseconds-this.startTime;
	if (t>focusLength) {
		return false;
	} else {
		pct=Math.sin(t/focusLength*Math.PI);
		h=(1-pct)*gHBlur;
		v=(1-pct)*gVBlur;
		paint(h,v);
		return true;
	}
}

function updSz() {
	sz=parseInt(preferences.size.value,10);
	blurMax=parseFloat(preferences.blurMax.value);
	focusLength=parseFloat(preferences.focusLength.value);
	subjImg=make(Image,{src:preferences.subj.value});
}

function startFocus() {
	if (!focusing) {
		log('startFocus-focusing');
		focusing=true;
		if (anm&&anm.kill) {
			anm.kill();
		}
		anm=new CustomAnimation(250,focusUpd,endFocus);
		animator.start(anm);
	}
}

function endFocus() {
	log('endFocus');
	focusing=false;
	if (anm&&anm.kill) {
		anm.kill();
	}
	anm=new CustomAnimation(1000,anmUpd);
	animator.start(anm);
}

function refresh() {
	updSz();
	rsz();
	bg.src=null;
	rndrBall();
	var bgSrc=system.widgetDataFolder + '/ball.png';
	cv.saveImageToFile(bgSrc,'png');
	$.clearRect(-1,-1,2,2);
	bg.src=bgSrc;
	endFocus();
}

function rsz() {
	var atts={width:sz,height:sz};
	apply(cv,atts);
	apply(wn,atts);
	apply(bg,atts);
	$=cv.getContext('2d');
	$.scale(sz/2,sz/-2);
	$.translate(1,-1);
}

function paint(hBlur,vBlur) {
	$.clearRect(-1,-1,2,2);
	$.save();
	subj(hBlur,vBlur);
	mask();
	$.restore();
}

function mask() {
	$.arc(0,0,.83,0,2*Math.PI,true);
	var maskGrad,old=$.globalCompositeOperation;
	$.globalCompositeOperation='destination-in';
	maskGrad=radGrad(0,0,.3,0.82);
	addOpacityStops(maskGrad,255,0,255,0,1,1,0);
	$.fillStyle=maskGrad;
	$.fill();
	$.globalCompositeOperation=old;
}

function subj(hBlur,vBlur) {
	var i,j,t,x,y,w,h,inc,o;
	blur=Math.min(0.9999,Math.max(0,hBlur,vBlur));
	
	inc=Math.min(0.5,Math.max(0.03/blur,0.1));
	o=inc/4;
	t=subjImg;
	if (t.srcWidth<t.srcHeight) {
		w=2;h=2*t.srcHeight/t.srcWidth;
	} else {
		h=2;w=2*t.srcWidth/t.srcHeight;
	}
	
	t=opImage(subjImg,o);
	$.drawImage(t,-w/2,h/2,w,-h);
	for (i=inc;i<1;i+=inc) {
		$.save();
		$.translate(-i*hBlur,i*vBlur);
		$.drawImage(t,-w/2,h/2,w,-h);
		$.translate(2*i*hBlur,0);
		$.drawImage(t,-w/2,h/2,w,-h);
		$.translate(0,-2*i*vBlur);
		$.drawImage(t,-w/2,h/2,w,-h);
		$.translate(-2*i*hBlur,0);
		$.drawImage(t,-w/2,h/2,w,-h);
		$.restore();
	}
}


function radGrad(x,y,r0,r1) {
	return $.createRadialGradient(x,y,r0,x,y,r1);
}


function addOpacityStops(grad,r,g,b) {
	for (var i=4;i<arguments.length;i+=2) {
		grad.addColorStop(arguments[i],'rgba('+r+','+g+','+b+','+arguments[i+1]+')');
	}
}


function rndrBall() {
	var shadGrad,ballGrad,reflGrad;
	// shadow
	$.save();
	$.scale(2.64,1);
	shadGrad=radGrad(0,-.762,.016,.225);
	addOpacityStops(shadGrad,0,0,0,0,.4,.3,.28,.7,.07,1,0);
	$.fillStyle=shadGrad;
	$.fillRect(-.25,-1,.5,.5);
	$.restore();
	
	// crystal
	$.save();
	$.beginPath();
	$.arc(0,0,.83,0,2*Math.PI,true);
	$.clip();
	$.fillStyle='rgba(255,255,255,.33)';
	$.fillRect(-1,-1,2,2);
	ballGrad=radGrad(0,.128,0,.9462);
	addOpacityStops(ballGrad,0,0,0,0,0,.75,.205,0.9,.4,1,.59)
	$.fillStyle=ballGrad;
	$.fillRect(-1,-1,2,2);
	$.restore();
	
	// reflection
	$.save();
	$.scale(1.9,1);
	$.arc(0,.544,.256,0,2*Math.PI,true);
	reflGrad=$.createLinearGradient(0,.8,0,.288);
	addOpacityStops(reflGrad,255,255,255,0,.32,1,.08);
	$.fillStyle=reflGrad;
	$.fill();
	$.restore();
}




var anm,sz,$,wn,cv,bg,blurMax,focusing=false,focusLength,gHBlur,gVBlur;
updSz();
wn=make(Window,{width:sz,height:sz});
bg=makeApp(Image,wn,{width:sz,height:sz,onMouseEnter:startFocus,});
cv=makeApp(Canvas,wn,{width:sz,height:sz});
widget.onPreferencesChanged=refresh;
refresh();
