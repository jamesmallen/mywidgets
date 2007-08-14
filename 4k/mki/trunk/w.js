function mk(O,p,m) {
	var r=new O();
	p=p?p:{};
	if (m)
		apply(r,p);
	else
		for (var i in p)
			r[i]=p[i];
	return r;
}

function mkapp(o,r,p,m) {
	return r.appendChild(mk(o,p,m));
}

function opi(i,o,w,h) {
	var t,c,r=false,f=wdf+'/opi',f1=f+'.png',f2=f+'o.png';
	typeof(w)=='undefined'?w=i.srcWidth:w;
	typeof(h)=='undefined'?h=i.srcHeight:h;
	opi._cv?t=opi._cv:opi._cv=t=mk(Canvas);
	c=t.getContext('2d');
	if (w!=opi._w||h!=opi._h||i.src!=opi._src) {
		t.width=w;t.height=h;
		c.clearRect(0,0,w,h);
		c.drawImage(i,0,0,w,h);
		opi._I=null;
		t.saveImageToFile(f+'.png','png');
		opi._I=mk(Image,{src:f1});
		opi._w=w;opi._h=h;opi._src=i.src;
		r=true;
	}
	if (o!=opi._o||r) {
		c.clearRect(0,0,w,h);
		c.drawImage(opi._I,0,0,w,h);
		c.globalCompositeOperation='destination-in';
		c.fillStyle='rgba(0,0,0,'+o+')';
		c.fillRect(0,0,w,h);
		c.globalCompositeOperation='source-over';
		opi._O=null;
		t.saveImageToFile(f2,'png');
		opi._O=mk(Image,{src:f2});
		opi._o=o;
	}
	return opi._O;
}

function apply(a,b) {
	for(var i in b)
		typeof(b[i])=='object'?apply(a[i],b[i]):a[i]=b[i];
}

function updp(t) {
	var q,z;
	for (q in p) {
		if (q=='o') continue;
		z=p[q];
		z.i=z.a*Math.cos(z.b*t+z.c)+z.d;
	}
}


function anmupd() {
	var t=animator.milliseconds-this.startTime;
	updp(t);
	paint();
	return true;
}

function updprf() {
	var i,j;
	if (preferences.reset && preferences.reset.value=="1") {
		for (i in preferences) {
			if (/^konfabulator/.test(i)) continue;
			j=preferences[i];
			j.value=j.defaultValue;
		}
		preferences.reset.value=0;
		savePreferences();
	}
	sz=parseInt(preferences.sz.value,10);
	//p.o.a=parseInt(preferences.o.value,10)/100;
	//p.o.d=p.o.a*1.2;
	p.o.i=parseInt(preferences.cn.value,10)/100;
	subj=preferences.subj.value;
	subj==''?subj=wdf+'/sample':subj;
	subjtmr.interval=parseInt(preferences.subjDur.value,10);
}

function refresh() {
	updprf();
	rsz();
	bg.src=null;
	$.clearRect(-1,-1,2,2);
	ball($);
	var bgSrc=wdf+'/ball.png';
	cv.saveImageToFile(bgSrc,'png');
	$.clearRect(-1,-1,2,2);
	bg.src=bgSrc;
	anm&&anm.kill?anm.kill():anm;
	rotatesubj();
	anm=new CustomAnimation(100,anmupd);
	animator.start(anm);
	updp(0);
}

function rsz() {
	var atts={width:sz,height:sz};
	while (wn.firstChild)
		wn.removeChild(wn.firstChild);
	cv=mkapp(Canvas,wn,atts);
	bg=mkapp(Image,wn,atts);
	bg.onMultiClick=manualrotate;
	apply(wn,atts);
	apply(bg,atts);
	$=cv.getContext('2d');
	$.scale(sz/2,sz/-2);
	$.translate(1,-1);
}

function paint() {
	var t,w,h,lw,lh;
	
	t=subjimg;
	if (!t||t.srcWidth==0||t.srcHeight==0) 
		return;
	else if (t.srcWidth<t.srcHeight) {
		w=2;h=2*t.srcHeight/t.srcWidth;lw=sz;lh=sz*h/w;
	} else {
		h=2;w=2*t.srcWidth/t.srcHeight;lh=sz;lw=sz*w/h;
	}
	
	$.save();
	
	$.globalCompositeOperation='destination-out';
	$.fillStyle='rgba(0,0,0,'+p.c.i+')';
	$.fillRect(-1,-1,2,2);
	$.globalCompositeOperation='source-over';
	
	// mask
	$.arc(0,0,.83,0,2*pi,true);
	$.clip();
	/*
	var maskGrad,old=$.globalCompositeOperation;
	$.globalCompositeOperation='destination-in';
	maskGrad=radgrad($,0,0,.3,0.82);
	addops(maskGrad,255,0,255,0,1,1,0);
	$.fillStyle=maskGrad;
	$.fill();
	$.globalCompositeOperation=old;
	*/
	t=opi(subjimg,p.o.i,lw,lh);
	$.translate(p.tX.i,p.ty.i);
	$.scale(p.sX.i,p.sY.i);
	$.drawImage(t,-w/2,h/2,w,-h);
	
	$.restore();
}


function radgrad($,x,y,r0,r1) {
	return $.createRadialGradient(x,y,r0,x,y,r1);
}


function addops(grad,r,g,b) {
	for (var i=4;i<arguments.length;i+=2)
		grad.addColorStop(arguments[i],'rgba('+r+','+g+','+b+','+arguments[i+1]+')');
}


function ball($) {
	var grad;
	// shadow
	$.save();
	$.scale(2.64,1);
	grad=radgrad($,0,-.762,.016,.225);
	addops(grad,0,0,0,0,.4,.3,.28,.7,.07,1,0);
	$.fillStyle=grad;
	$.fillRect(-.25,-1,.5,.5);
	$.restore();
	
	// crystal
	$.save();
	//$.beginPath();
	$.arc(0,0,.83,0,2*pi,true);
	$.clip();
	$.fillStyle='rgba(255,255,255,.33)';
	$.fillRect(-1,-1,2,2);
	grad=radgrad($,0,.128,0,.9462);
	addops(grad,0,0,0,0,0,.75,.205,0.9,.4,1,.59);
	$.fillStyle=grad;
	$.fillRect(-1,-1,2,2);
	$.restore();
	
	// reflection
	$.save();
	$.scale(1.9,1);
	$.arc(0,.544,.256,0,2*pi,true);
	grad=$.createLinearGradient(0,.8,0,.288);
	addops(grad,255,255,255,0,.32,1,.08);
	$.fillStyle=grad;
	$.fill();
	$.restore();
}

function rotatesubj() {
	var i,glob,imgs=[];
	if (filesystem.isDirectory(subj)) {
		glob=filesystem.getDirectoryContents(subj,true);
		for (i=0;i<glob.length;i++)
			/\.(png|jpe?g)$/i.test(glob[i])?imgs.push(subj+'/'+glob[i]):imgs;
		if (imgs.length) {
			i=random(0,imgs.length);
			i==rotatesubj._i?i=(i+1)%imgs.length:i;
			rotatesubj._i=i;
			subjimg=mk(Image,{src:imgs[i]});
		} else
			subjimg=mk(Image);
	} else if (!subjimg||subjimg.src!=subj)
			subjimg=mk(Image,{src:subj});
}


function firstrun() {
	var c,$,i,j,k,path=wdf+'/sample',atts={width:256,height:256};
	
	// dock icon
	c=mk(Canvas,{width:75,height:70});
	$=c.getContext('2d');
	$.scale(37.5,-37.5);
	$.translate(1,-.95);
	ball($);
	c.saveImageToFile(wdf+'/dock.png','png');
	j=XMLDOM.parse(filesystem.readFile('d.xml'));
	i=j.getElementById('i');
	i.setAttribute('src',wdf+'/dock.png');
	widget.setDockItem(j);
	
	// samples
	filesystem.createDirectory(path);
	// gears
	c=mk(Canvas,atts);
	$=c.getContext('2d');
	$.scale(128,-128);
	$.translate(.8,-.85);
	$.rotate(.3);
	gear($,.35,.42,11,.6,.1);
	$.globalCompositeOperation='source-over';
	j=$.createRadialGradient(0,0,0,0,0,.45);
	j.addColorStop(0,'rgba(0,0,0,0)');
	j.addColorStop(0.3,'rgba(16,16,16,0)');
	j.addColorStop(0.34,'rgba(16,16,16,.8');
	j.addColorStop(0.341,'#c9e');
	j.addColorStop(1,'#a7b');
	$.fillStyle=j;
	$.fill();
	$.lineWidth=0.01;
	$.lineJoin='round';
	$.strokeStyle='rgba(16,16,16,.4)';
	$.stroke();
	$.translate(.37,-.55);
	$.rotate(-.3);
	gear($,.24,.3,7,.6,.2);
	/*
	j=$.createRadialGradient(0,0,0,0,0,.4);
	j.addColorStop(0,'rgba(0,0,0,0)');
	j.addColorStop(0.2,'rgba(16,16,16,0)');
	j.addColorStop(0.24,'rgba(16,16,16,.8');
	j.addColorStop(0.241,'#c9c');
	j.addColorStop(1,'#979');
	$.fillStyle=j;
	*/
	$.fill();
	$.stroke();
	c.saveImageToFile(path+'/gears.png','png');
	
	
	// waves1
	c=mk(Canvas,atts);
	$=c.getContext('2d');
	j=$.createLinearGradient(0,0,0,256);
	j.addColorStop(0,'rgba(255,255,255,0)');
	j.addColorStop(.25,'rgba(230,150,230,.3)');
	j.addColorStop(.5,'rgba(70,40,230,.1)');
	j.addColorStop(.75,'rgba(230,150,230,.3)');
	j.addColorStop(1,'rgba(255,255,255,0)');
	$.fillStyle=j;
	$.fillRect(0,0,256,256);
	$.lineJoin='round';
	$.lineWidth=3;
	$.strokeStyle='rgba(9,9,9,.2)';
	for (i=0;i<32;i++) {
		wave($,-i*8,i*12,8,8,32+i);
		$.stroke();
	}
	c.saveImageToFile(path+'/waves.png','png');
	
	
	for (i=0;i<2;i++) {
		// fog
		c=mk(Canvas,{width:64,height:64});
		$=c.getContext('2d');
		j=plasma(64,.1,1,32,true);
		k=plasma(64,10,191,32);
		k=chops(k,64,'+');
		rastarr($,64,k,k,k,j);
		c.saveImageToFile(path+'/fog'+i+'.png','png');
	}
	
	
}

function chops(a,b,op) {
	var i,sz=a.length,t=[];
	b=arrize(b,sz);
	for (i=0;i<sz;i++)
		//if (op=='+') {
			t[i]=a[i]+b[i];
		/*} else if (op=='-') {
			t[i]=a[i]-b[i];
		} else if (op=='*') {
			t[i]=a[i]*b[i];
		} else if (op=='/') {
			t[i]=a[i]/b[i];
		}*/
	return t;
}

function plasma(sz,r,s,q,f) {
	var p,x,y,i,j,inc,adj,cmp,szi,t={},ret=[];
	s=s?s:255;
	r=r?r:s/20;
	q=q?q:sz;
	szi=sz+1;
	
	// print(q);
	
	t[0]=Math.random()*s;
	for (p=Math.log(sz)/Math.log(2),inc=sz;p>=0;p--,inc/=2) {
		cmp=2*inc;
		for (x=0;x<szi;x+=inc)
			for (y=0;y<szi;y+=inc) {
				i=y*(szi)+x;
				if (x%cmp==0&&y%cmp==0)
					//log('skipping '+x+','+y);
					continue;
				else {
					if (inc>=q)
						t[i]=Math.random()*s;
					else {
						adj=r*(Math.random()-.5);
						j=szi*inc;
						if (x%cmp==0)
							t[i]=(t[i-j]+t[i+j])/2+adj;
						else if (y%cmp==0)
							t[i]=(t[i-inc]+t[i+inc])/2+adj;
						else
							t[i]=(t[i-j-inc]+t[i+j-inc]+t[i-j+inc]+t[i+j+inc])/4+adj;
					}
				}
			}
		//pdump(t);
		
	}
	
	for (y=0;y<sz;y++)
		for (x=0;x<sz;x++)
			ret.push(Math.min(s,Math.max(0,!f?Math.floor(t[y*szi+x]):t[y*szi+x])));
	
	return ret;
}

function arrize(a,sz) {
	if (a instanceof Array)
		return a;
	else {
		var i,t=[];
		for (i=0;i<sz;i++)
			t.push(a);
		return t;
	}
}

function rastarr($,sz,r,g,b,a) {
	var i,j,v,op=false;
	a=a?a:1;
	r=arrize(r,sz*sz);g=arrize(g,sz*sz);b=arrize(b,sz*sz);a=arrize(a,sz*sz);
	for (y=0;y<sz;y++)
		for (x=0;x<sz;x++) {
			i=y*sz+x;
			$.fillStyle='rgba('+r[i]+','+g[i]+','+b[i]+','+a[i]+')';
			$.fillRect(x,y,1,1);
		}
}


function gear($,r1,r2,t,rr,s) {
	var i,a=0,d=2*pi/t,sd,ad,ad1,ad2;
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

function wave($,x,y,n,m,l) {
	var i;
	$.beginPath();
	$.moveTo(x,y);
	for (i=0;i<n;i++) {
		$.quadraticCurveTo(x+l/4,y-m,x+l/2,y);
		x+=l/2;
		$.quadraticCurveTo(x+l/4,y+m,x+l/2,y);
		x+=l/2;
	}
}

function manualrotate() {
	rotatesubj();
	subjtmr.reset();
}


var anm,sz,$,wn,cv,bg,subj,subjimg,subjtmr,wdf=system.widgetDataFolder,p,pi=Math.PI;
p={
	tX:{a:.4,b:.0003,c:2,d:0},
	ty:{a:.4,b:.0003,c:1,d:0},
	sX:{a:.4,b:.0002,c:2,d:1.6},
	sY:{a:.4,b:.0002,c:1,d:1.6},
	// o:{a:.08,b:.0001,c:1.5,d:.09},
	o:{i:.09},
	c:{a:.05,b:.0002,c:0,d:.06}
};
subjtmr=new Timer();
subjtmr.onTimerFired=rotatesubj;

firstrun();

updprf();
wn=mk(Window,{width:sz,height:sz});
widget.onPreferencesChanged=refresh;

subjtmr.ticking=true;
refresh();
