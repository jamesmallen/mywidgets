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

function opImage(i,o,w,h) {
	var t,c,r=false,f=system.widgetDataFolder+'/opimage',f1=f+'.png',f2=f+'o.png';
	typeof(w)=='undefined'?w=i.srcWidth:w;
	typeof(h)=='undefined'?h=i.srcHeight:h;
	opImage._cv?t=opImage._cv:opImage._cv=t=make(Canvas);
	c=t.getContext('2d');
	if (w!=opImage._w||h!=opImage._h||i.src!=opImage._src) {
		t.width=w;t.height=h;
		c.clearRect(0,0,w,h);
		c.drawImage(i,0,0,w,h);
		opImage._I=null;
		log('saving '+f1);
		t.saveImageToFile(f+'.png','png');
		opImage._I=make(Image,{src:f1});
		opImage._w=w;opImage._h=h;opImage._src=i.src;
		r=true;
	}
	if (o!=opImage._o||r) {
		c.clearRect(0,0,w,h);
		c.drawImage(opImage._I,0,0,w,h);
		c.globalCompositeOperation='destination-in';
		c.fillStyle='rgba(0,0,0,'+o+')';
		c.fillRect(0,0,w,h);
		c.globalCompositeOperation='source-over';
		opImage._O=null;
		t.saveImageToFile(f2,'png');
		opImage._O=make(Image,{src:f2});
	}
	return opImage._O;
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


function updP(t) {
	var q,z;
	for (q in p) {
		z=p[q];
		z.i=z.a*Math.cos(z.b*t+z.c)+z.d;
	}
}


function anmUpd() {
	var t=animator.milliseconds-this.startTime;
	updP(t);
	paint();
	return true;
}

function updPrf() {
	sz=parseInt(preferences.size.value,10);
	p.o.a=parseInt(preferences.o.value,10)/100;
	p.o.d=p.o.a*1.2;
	subjImg=make(Image,{src:preferences.subj.value});
}

function refresh() {
	updPrf();
	rsz();
	bg.src=null;
	$.clearRect(-2,-2,3,3);
	rndrBall();
	var bgSrc=system.widgetDataFolder + '/ball.png';
	cv.saveImageToFile(bgSrc,'png');
	$.clearRect(-1,-1,2,2);
	bg.src=bgSrc;
	if (anm&&anm.kill) {
		anm.kill();
	}
	anm=new CustomAnimation(100,anmUpd);
	animator.start(anm);
	updP(0);
}

function rsz() {
	var atts={width:sz,height:sz};
	while (wn.firstChild) {
		wn.removeChild(wn.firstChild);
	}
	cv=makeApp(Canvas,wn,atts);
	bg=makeApp(Image,wn,atts);
	apply(wn,atts);
	apply(bg,atts);
	$=cv.getContext('2d');
	$.scale(sz/2,sz/-2);
	$.translate(1,-1);
}

function gearTest() {
	$.save();
	$.fillStyle='#f0f';
	$.globalCompositeOperation='source-over';
	gear(.55,.6,17,.5,.2);
	$.lineWidth=0.02;
	$.lineJoin='round';
	$.stroke();
	// $.fillRect(0,0,0,0);
	$.restore();
}


function gear(r1,r2,t,rr,s) {
	var i,a=0,d=2*Math.PI/t,sd,ad,ad1,ad2;
	typeof(rr)=='undefined'?rr=.5:rr;
	typeof(s)=='undefined'?s=.5:s;
	sd=s*d/2;
	ad=d-s*d;
	ad1=rr*ad;
	ad2=ad-ad1;
	
	$.beginPath();
	$.moveTo(r1,a);
	for (i=0;i<t;i++) {
		a-=sd;
		$.arc(0,0,r2,a,a-ad2,true);
		a-=ad2+sd;
		$.arc(0,0,r1,a,a-ad1,true);
		a-=ad1;
	}
}

function paint() {
	var t,w,h,lw,lh;
	
	$.save();
	
	$.globalCompositeOperation='destination-out';
	$.fillStyle='rgba(0,0,0,'+p.c.i+')';
	$.fillRect(-1,-1,2,2);
	$.globalCompositeOperation='source-over';
	
	t=subjImg;
	if (t.srcWidth<t.srcHeight) {
		w=2;h=2*t.srcHeight/t.srcWidth;lw=sz;lh=sz*h/w;
	} else {
		h=2;w=2*t.srcWidth/t.srcHeight;lh=sz;lw=sz*w/h;
	}
	
	mask();
	t=opImage(subjImg,p.o.i,lw,lh);
	$.translate(p.tX.i,p.ty.i);
	$.scale(p.sX.i,p.sY.i);
	$.drawImage(t,-w/2,h/2,w,-h);
	
	$.restore();
}

function mask() {
	$.arc(0,0,.83,0,2*Math.PI,true);
	$.clip();
	/*
	var maskGrad,old=$.globalCompositeOperation;
	$.globalCompositeOperation='destination-in';
	maskGrad=radGrad(0,0,.3,0.82);
	addOpacityStops(maskGrad,255,0,255,0,1,1,0);
	$.fillStyle=maskGrad;
	$.fill();
	$.globalCompositeOperation=old;
	*/
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




var anm,sz,$,wn,cv,bg;
var p={
	tX:{a:.4,b:.0003,c:2,d:0},
	ty:{a:.4,b:.0003,c:1,d:0},
	sX:{a:.4,b:.0002,c:2,d:1.6},
	sY:{a:.4,b:.0002,c:1,d:1.6},
	o:{a:.08,b:.0001,c:1.5,d:.09},
	c:{a:.05,b:.0002,c:0,d:.06}
};

updPrf();
wn=make(Window,{width:sz,height:sz});
widget.onPreferencesChanged=refresh;
refresh();
