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
		log('saving '+f2);
		t.saveImageToFile(f2,'png');
		opImage._O=make(Image,{src:f2});
		opImage._o=o;
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
		if (q=='o') continue;
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
	sz=parseInt(preferences.sz.value,10);
	//p.o.a=parseInt(preferences.o.value,10)/100;
	//p.o.d=p.o.a*1.2;
	p.o.i=parseInt(preferences.cn.value,10)/100;
	subj=preferences.subj.value;
	subj=='SAMPLE'?subj=system.widgetDataFolder+'/sample':subj;
	subjTmr.interval=parseInt(preferences.subjDur.value,10);
	// subjImg=make(Image,{src:preferences.subj.value});
}

function refresh() {
	updPrf();
	rsz();
	bg.src=null;
	$.clearRect(-2,-2,3,3);
	rndrBall();
	var bgSrc=system.widgetDataFolder+'/cache/ball.png';
	log('saving ball.png');
	cv.saveImageToFile(bgSrc,'png');
	$.clearRect(-1,-1,2,2);
	bg.src=bgSrc;
	if (anm&&anm.kill) {
		anm.kill();
	}
	rotateSubj();
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

function gear($,r1,r2,t,rr,s) {
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

function rotateSubj() {
	var i,glob,imgs=[];
	if (filesystem.isDirectory(subj)) {
		glob=filesystem.getDirectoryContents(subj,true);
		for (i=0;i<glob.length;i++) {
			if (/\.(png|jpe?g|gif)$/i.test(glob[i])) {
				imgs.push(subj+'/'+glob[i]);
			}
		}
		if (imgs.length) {
			i=random(0,imgs.length);
			if (i==rotateSubj._i) {
				i=(i+1)%imgs.length;
			}
			rotateSubj._i=i;
			subjImg=make(Image,{src:imgs[i]});
		} else {
			subjImg=make(Image);
		}
	} else {
		subjImg=make(Image);
	}
}


function firstRun() {
	filesystem.createDirectory(cache);
	makeSamples();
}

function makeSamples() {
	var c,$,path=system.widgetDataFolder+'/sample',atts={width:256,height:256};
	if (!filesystem.itemExists(path)) {
		filesystem.createDirectory(path);
	}
	log('making gear1');
	// gear1
	c=make(Canvas,atts);
	$=c.getContext('2d');
	$.scale(128,-128);
	$.translate(.9,-.8);
	gear($,.35,.42,11,.6,.1);
	$.globalCompositeOperation='source-over';
	$.fillStyle='#ccc';
	$.fill();
	$.lineWidth=0.02;
	$.lineJoin='round';
	$.strokeStyle='#111';
	$.stroke();
	// $.fillRect(0,0,0,0);
	c.saveImageToFile(path+'/gear1.png','png');
	
	
	log('making gear2');
	// gear1
	c=make(Canvas,atts);
	$=c.getContext('2d');
	$.scale(128,-128);
	$.translate(1.3,-1.2);
	gear($,.24,.31,7,.5,.05);
	$.globalCompositeOperation='source-over';
	$.fillStyle='#999';
	$.fill();
	$.lineWidth=0.021;
	$.lineJoin='round';
	$.strokeStyle='#111';
	$.stroke();
	// $.fillRect(0,0,0,0);
	c.saveImageToFile(path+'/gear2.png','png');
	
	
}



var anm,sz,$,wn,cv,bg,subj,subjTmr,cache=system.widgetDataFolder+'/cache',p;
p={
	tX:{a:.4,b:.0003,c:2,d:0},
	ty:{a:.4,b:.0003,c:1,d:0},
	sX:{a:.4,b:.0002,c:2,d:1.6},
	sY:{a:.4,b:.0002,c:1,d:1.6},
	// o:{a:.08,b:.0001,c:1.5,d:.09},
	o:{i:.09},
	c:{a:.05,b:.0002,c:0,d:.06}
};
subjTmr=new Timer();
subjTmr.onTimerFired=rotateSubj;

firstRun();

updPrf();
wn=make(Window,{width:sz,height:sz});
widget.onPreferencesChanged=refresh;

subjTmr.ticking=true;
refresh();
