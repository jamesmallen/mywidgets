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
	var t,c,r=0,f=wdf+'/opi',f1=f+'.png',f2=f+'o.png';
	opi._cv?t=opi._cv:opi._cv=t=mk(Canvas);
	c=t.getContext('2d');
	if (w!=opi._w||h!=opi._h||i.src!=opi._src) {
		t.width=w;t.height=h;
		// c.clearRect(0,0,w,h);
		c.globalCompositeOperation='copy';
		c.drawImage(i,0,0,w,h);
		opi._I=mk(Image);
		toim(t,f1,opi._I);
		opi._w=w;opi._h=h;opi._src=i.src;
		r=1;
	}
	if (o!=opi._o||r) {
		//c.clearRect(0,0,w,h);
		c.globalCompositeOperation='copy';
		c.fillStyle='rgba(255,255,255,'+o+')';
		c.fillRect(0,0,w,h);
		c.globalCompositeOperation='source-in';
		c.drawImage(opi._I,0,0,w,h);
		opi._O=mk(Image);
		toim(t,f2,opi._O);
		opi._o=o;
	}
	return opi._O;
}

function apply(a,b) {
	for(var i in b)
		typeof(b[i])=='object'?apply(a[i],b[i]):a[i]=b[i];
}

function toim(c,f,i) {
	i=i?i:{};
	i.src=null;
	c.saveImageToFile(f,'png');
	i.src=f;
}


function QFace(color) {
	var i;
	color = color ? color : 'w';
	with (this) {
		adj = {};
		facelets = {};
		for (i = 0; i < 9; i++) {
			facelets[i] = color;
		}
	}
}

QFace.prototype = {
	adj: 0,
	facelets: 0,
	
	// methods
	rotate: function(ccw) {
		var i, t, a={};
		if (ccw) {
			for (i = 0; i < 3; i++) {
				this.rotate();
			}
		} else {
			t = this.adj[3].q.swap(this.adj[3].l);
			t2 = this.adj[0];
			for (i = 0; i < 4; i++) {
				t = this.adj[i].q.swap(t);
				a[i + 3 % 4] = this.adj[i];
			}
			this.adj = a;
		}
	},
	// internal method for swapping out a side
	swap: function(center, newvalues) {
		var i, j, t={};
		for (i = 0; i < 3; i++) {
			j = (center - 1 + i) % 8;
			t[i] = this.facelets[j];
			if (newvalues) {
				this.facelets[j] = newvalues[i];
			}
		}
	},
	setadj: function(side, qface, link) {
		this.adj[side] = {q: qface, l: link};
	}
}


deg=Math.PI/180;

ddd={
	pts:[],
	fcs:[],
	mtrls:['#000'],
	mat:matident()
}

ddd.mkpt = function(x, y, z) {
	var i;
	for (i = 0; i < ddd.pts.length; i++) {
		if (ddd.pts[i].x == x && ddd.pts[i].y == y && ddd.pts[i].z == z) {
			return i;
		}
	}
	// didn't find the point in pts already
	ddd.pts.push({x:x, y:y, z:z});
	return ddd.pts.length - 1;
};

ddd.mkmtrl = function(color) {
	for (i = 0; i < ddd.mtrls.length; i++) {
		if (ddd.mtrls[i] == color) {
			return i;
		}
	}
	ddd.mtrls.push(color);
	return ddd.mtrls.length - 1;
}

ddd.mkface = function(material) {
	var i, a, m=ddd.mkmtrl(material), t=[];
	for (i = 1; i < arguments.length; i+=3) {
		t.push(ddd.mkpt(arguments[i], arguments[i + 1], arguments[i + 2]));
	}
	ddd.fcs.push({
		p: t,
		m: m
	});
};


ddd.apply = function() {
	var i, a, b;
	ddd.ptst = [];
	for (i = 0; i < ddd.pts.length; i++) {
		t = matapp(ddd.mat, ddd.pts[i]);
		ddd.ptst.push({x:t[0], y:t[1], z:t[2]});
	}
}

ddd.render = function() {
	var i, j, f, p;
	$.clearRect(-1,-1,2,2);
	/*
	$.fillStyle = '#f0f';
	$.fillRect(-1,-1,2,2);
	*/
	ddd.apply();
	ddd.sort();
	for (i = 0; i < ddd.fcs.length; i++) {
		// print('face ' + i);
		f = ddd.fcs[i].p;
		p = ddd.ptst[f[0]];
		$.beginPath();
		$.moveTo(p.x, p.y);
		// print('\t'+p.x+', '+p.y);
		for (j = 1; j < f.length; j++) {
			p = ddd.ptst[f[j]];
			$.lineTo(p.x, p.y);
			// print('\t'+p.x+', '+p.y);
		}
		$.closePath();
		$.fillStyle = ddd.mtrls[ddd.fcs[i].m];
		$.fill();
		$.stroke();
	}
}

// returns the midpt of a given set of points
ddd.midpt = function(p, transformed) {
	var i, sum={x:0,y:0,z:0}, src=transformed?ddd.ptst:ddd.pts;
	for (i = 0; i < p.length; i++) {
		sum.x += src[p[i]].x;
		sum.y += src[p[i]].y;
		sum.z += src[p[i]].z;
	}
	sum.x /= p.length;
	sum.y /= p.length;
	sum.z /= p.length;
	return sum;
}

ddd.sort = function() {
	ddd.fcs.sort(function(a, b) { return ddd.midpt(a.p, true).z - ddd.midpt(b.p, true).z});
}

function makecube() {
	/*
	var i, t, n, m=[{z:0},{x:1,y:0,z:1},{x:0,y:1,z:1}];
	for (i = 0; i < m.length; i++) {
		t=matrot
		ddd.mkface(
			ddd.mkpt(-m[i].x, -m[i].y, -m[i].z)
		);
	}
	*/
	
	
	ddd.mkface('#00f',
		-1,-1,-1,
		-1, 1,-1,
		 1, 1,-1,
		 1,-1,-1
	);
	
	ddd.mkface('#f00',
		-1,-1, 1,
		-1, 1, 1,
		 1, 1, 1,
		 1,-1, 1
	);
	
	ddd.mkface('#0f0',
		-1,-1,-1,
		-1,-1, 1,
		-1, 1, 1,
		-1, 1,-1
	);

	ddd.mkface('#aa0',
		 1,-1,-1,
		 1,-1, 1,
		 1, 1, 1,
		 1, 1,-1
	);
	
	ddd.mkface('#a0a',
		-1,-1,-1,
		-1,-1, 1,
		 1,-1, 1,
		 1,-1,-1
	);
	
	ddd.mkface('#0aa',
		-1, 1,-1,
		-1, 1, 1,
		 1, 1, 1,
		 1, 1,-1
	);
	
	
	ddd.mkface('#00f',
		-.5,-.5,-.5,
		-.5, .5,-.5,
		 .5, .5,-.5,
		 .5,-.5,-.5
	);
	
	ddd.mkface('#f00',
		-.5,-.5, .5,
		-.5, .5, .5,
		 .5, .5, .5,
		 .5,-.5, .5
	);
	
	ddd.mkface('#0f0',
		-.5,-.5,-.5,
		-.5,-.5, .5,
		-.5, .5, .5,
		-.5, .5,-.5
	);

	ddd.mkface('#aa0',
		 .5,-.5,-.5,
		 .5,-.5, .5,
		 .5, .5, .5,
		 .5, .5,-.5
	);
	
	ddd.mkface('#a0a',
		-.5,-.5,-.5,
		-.5,-.5, .5,
		 .5,-.5, .5,
		 .5,-.5,-.5
	);
	
	ddd.mkface('#0aa',
		-.5, .5,-.5,
		-.5, .5, .5,
		 .5, .5, .5,
		 .5, .5,-.5
	);
	
}

function matrot(axis, t) {
	var c = Math.cos(t), s = Math.sin(t);
	if (axis == 'x') {
		return [
			1, 0,  0, 0,
			0, c, -s, 0,
			0, s,  c, 0,
			0, 0,  0, 1
		];
	} else if (axis == 'y') {
		return [
			c,  0, s, 0,
			0,  1, 0, 0,
			-s, 0, c, 0,
			0,  0, 0, 1
		];
	} else {
		return [
			c, -s, 0, 0,
			s,  c, 0, 0,
			0,  0, 1, 0,
			0,  0, 0, 1
		];
	}
}


function mattrans(x, y, z) {
	return [
		1, 0, 0, x,
		0, 1, 0, y,
		0, 0, 1, z,
		0, 0, 0, 1
	];
}

function matscale(x, y, z) {
	x=x?x:1;
	y=y?y:x;
	z=z?z:x;
	return [
		x, 0, 0, 0,
		0, y, 0, 0,
		0, 0, z, 0,
		0, 0, 0, 1
	];
}

function matident() {
	return matscale();
}

function matcomp() {
	var a, b, m, i, j, t;
	
	for (m = 1; m < arguments.length; m++) {
		t ? t : t = arguments[0];
		a = matcp(t);
		b = arguments[m];
		for (i = 0; i < 4; i++) {
			for (j = 0; j < 4; j++) {
				t[i*4 + j] = a[i*4]*b[j] + a[i*4+1]*b[4+j] + a[i*4+2]*b[8+j] + a[i*4+3]*b[12+j];
			}
		}
	}
	return t;
}

function matcp(a) {
	var i,t={};
	for (i = 0; i < 16; i++) {
		t[i] = a[i];
	}
	return t;
}

function matapp(a, v) {
	var i, j, t={};
	if (typeof(v.x) != 'undefined') {
		return matapp(a, [v.x, v.y, v.z, 1]);
	}
	for (i = 0; i < 4; i++) {
		t[i] = a[i*4]*v[0] + a[i*4+1]*v[1] + a[i*4+2]*v[2] + a[i*4+3]*v[3];
	}
	
	return t;
}


function test() {
	ddd.mat = matscale(.6, .6, .6);
	ddd.render();
}

function anmupd() {
	var t = animator.milliseconds - this.startTime;
	ddd.mat = matcomp(matscale(.6,.6,.6), matrot('x', this.x), matrot('y', 1.3 + t/10*deg));
	
	ddd.render()
	
	return true;
}

makecube();

anm = new CustomAnimation(50, anmupd);
anm.x = 15*deg;
animator.start(anm);

var wn,$,wdf=system.widgetDataFolder;

wn=mk(Window,{width:256,height:256});
cv=mkapp(Canvas,wn,{width:256,height:256});
$=cv.getContext('2d');
$.scale(128, -128);
$.translate(1, -1);
$.lineWidth=.02;
$.lineJoin='round';
$.globalAlpha=.7;
