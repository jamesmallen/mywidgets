Math.mean = function() {
	var i, r;
	for (i = 0; i < arguments.length; i++) {
		r += arguments[i];
	}
	return r / arguments.length;
}

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



function qcube() {
	var i;
	with (this) {
		fcs = {};
		fcs[0] = new qface('r', '+z');
		fcs[0].tx(mattrans(-1.5, -1.5, 1.5));
		fcs[1] = new qface('g', '-y');
		fcs[1].tx(matcomp(mattrans(-1.5, -1.5, 1.5), matrot('x', 90*deg)));
		fcs[2] = new qface('o', '-z');
		fcs[2].tx(matcomp(mattrans(-1.5, -1.5, 1.5), matrot('x', 180*deg)));
		fcs[3] = new qface('b', '+y');
		fcs[3].tx(matcomp(mattrans(-1.5, -1.5, 1.5), matrot('x', 270*deg)));
		fcs[4] = new qface('y', '+x');
		fcs[4].tx(matcomp(mattrans(-1.5, -1.5, 1.5), matrot('y', 90*deg)));
		fcs[5] = new qface('w', '-x');
		fcs[5].tx(matcomp(mattrans(-1.5, -1.5, 1.5), matrot('y', 270*deg)));
		
		fcs[0].setadj(fcs[3], 5, fcs[4], 7, fcs[1], 1, fcs[5], 3);
		fcs[1].setadj(fcs[0], 5, fcs[4], 5, fcs[2], 1, fcs[5], 5);
		fcs[2].setadj(fcs[1], 5, fcs[4], 3, fcs[3], 1, fcs[5], 7);
		fcs[3].setadj(fcs[2], 5, fcs[4], 1, fcs[0], 1, fcs[5], 1);
		fcs[4].setadj(fcs[3], 3, fcs[2], 3, fcs[1], 3, fcs[0], 3);
		fcs[5].setadj(fcs[3], 7, fcs[0], 7, fcs[1], 7, fcs[2], 7);
		
		
		for (i = 0; i < 6; i++) {
			fcs[i].tx(matscale(.6, .6, .6));
		}
		
	}
}

qcube.prototype = {
	fcs: 0,
	
	toString: function() {
		var i, f, x, y, s=[], r='';
		for (i = 0; i < 36; i++) {
			s[i]='   ';
		}
		for (i = 0; i < 6; i++) {
			f = this.fcs[i].facelets;
			x = (i == 5 ? 0 : (i == 4 ? 2 : 1));
			y = (i == 3 ? 0 : (i == 1 ? 6 : (i == 2 ? 9 : 3)));
			s[y*3 + x] = f[0].c + f[1].c + f[2].c;
			s[y*3 + 3 + x] = f[7].c + f[8].c + f[3].c;
			s[y*3 + 6 + x] = f[6].c + f[5].c + f[4].c;
		}
		
		for (i = 0; i < 12; i++) {
			r += s[i*3] + s[i*3 + 1] + s[i*3 + 2] + '\n';
		}
		return r;
	}
};



function qface(color, axis) {
	var i,p;
	color = color ? color : 'w';
	with (this) {
		adj = {};
		facelets = {};
		for (i = 0; i < 9; i++) {
			p = qface.placement[i];
			// facelets[i] = {c: color, f: ds[0].mkface({dynamic: 1, color: qface.colorhex[color]}, p[0], p[1], 0, p[0]+1, p[1], 0, p[0]+1, p[1]+1, 0, p[0], p[1]+1, 0)};
			facelets[i] = {c: color, f: ds[0].mkface({dynamic: 1, color: 'rgba(' + qface.rgb[color].r + ',' + qface.rgb[color].g + ',' + qface.rgb[color].b + ',' + i / 8 + ')'}, p[0], p[1], 0, p[0]+1, p[1], 0, p[0]+1, p[1]+1, 0, p[0], p[1]+1, 0)};
		}
		ax = axis;
	}
}

qface.prototype = {
	adj: 0,
	facelets: 0,
	ax: 0,
	
	// methods
	rotate: function(ccw, hide) {
		var i, j, t, a={}, adjfacelets=[];
		if (ccw) {
			for (i = 0; i < 3; i++) {
				this.rotate(0, 1);
			}
		} else {
			t = this.adj[3].q.swap(this.adj[3].l);
			t2 = this.adj[0];
			for (i = 0; i < 4; i++) {
				t = adjfacelets.push(this.adj[i].q.swap(this.adj[3].l, t));
				a[(i + 3) % 4] = this.adj[i];
			}
			this.adj = a;
		}
		if (!hide) {
			this.anm = new CustomAnimation(20, qface.rotanm);
			this.anm.target = (ccw?-90:90)*deg;
			this.anm.theta = 0;
			this.anm.axis = this.ax;
			this.anm.faces = [];
			for (i = 0; i < 9; i++) {
				this.anm.faces.push(this.facelets[i].f);
			}
			for (i = 0; i < 4; i++) {
				// t = this.adj[i].q.swap(this.adj[i].l);
				t = adjfacelets[i];
				for (j = 0; j < 3; j++) {
					this.anm.faces.push(t[j].f);
				}
			}
			animator.start(this.anm);
		}
	},
	
	tx: function(mat) {
		var i;
		for (i = 0; i < 9; i++) {
			ds[0].txface(this.facelets[i].f, mat);
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
		return t;
	},
	setadj: function() {
		var i;
		for (i = 0; i < 4; i++) {
			this.adj[i] = {q: arguments[i*2], l: arguments[i*2 + 1]};
		}
	}
};

qface.rotanm = function() {
	var i, mat, t = animator.milliseconds - this.startTime, pct = t / 6000, dst, dt;
	
	dst = (pct < 1) ? animator.ease(0, this.target, pct, animator.kEaseInOut) : this.target;
	
	dt = dst - this.theta;
	
	mat = matrot(this.axis.substr(1), (/^-/.test(this.axis) ? -1 : 1) * dt);
	this.theta += dt;
	
	for (i = 0; i < this.faces.length; i++) {
		ds[0].txface(this.faces[i], mat);
	}
	
	ds[0].render();
	
	return pct <= 1;
}


qface.rgb = {
	r: {r: 255, g: 0, b: 0},
	o: {r: 255, g: 127, b: 63},
	y: {r: 255, g: 255, b: 0},
	w: {r: 255, g: 255, b: 255},
	g: {r: 0, g: 255, b: 255},
	b: {r:0, g: 0, b: 255}
}

qface.colorhex = {
	r: '#e33',
	o: '#e83',
	y: '#dd2',
	w: '#eee',
	g: '#3e3',
	b: '#33e'
};

qface.placement = {
	0: [0,0],
	1: [1,0],
	2: [2,0],
	3: [2,1],
	4: [2,2],
	5: [1,2],
	6: [0,2],
	7: [0,1],
	8: [1,1]
};


deg=Math.PI/180;




function ddd(ctx) {
	with (this) {
		$ = ctx;
		pts = [];
		fcs = [];
		fcst = [];
		mtrls = ['#000'];
		mat = matident();
	}
}
ddd.prototype = {
	$:0,
	pts:0,
	ptst:0,
	fcs:0,
	fcst:0,
	mtrls:0,
	mat:0,
	
	// methods
	mkpt: function(x, y, z, d) {
		var i;
		if (!d) {
			for (i = 0; i < this.pts.length; i++) {
				if (this.pts[i].x == x && this.pts[i].y == y && this.pts[i].z == z) {
					return i;
				}
			}
		}
		// didn't find the point in pts already
		this.pts.push({x:x, y:y, z:z});
		return this.pts.length - 1;
	},
	
	mkmtrl: function(color) {
		for (i = 0; i < this.mtrls.length; i++) {
			if (this.mtrls[i] == color) {
				return i;
			}
		}
		this.mtrls.push(color);
		return this.mtrls.length - 1;
	},
	
	mkface: function(opts) {
		var i, a, t=[], d, f;
		opts = opts ? opts : {};
		m = this.mkmtrl(opts.color ? opts.color : '#000');
		d = opts.dynamic ? 1 : 0;
		
		for (i = 1; i < arguments.length; i+=3) {
			t.push(this.mkpt(arguments[i], arguments[i + 1], arguments[i + 2], d));
		}
		f = {p: t, m: m, z: 0, d: d};
		this.fcs.push(f);
		this.fcst.push(f);
		return this.fcs.length - 1;
	},
	
	txface: function(f, mat) {
		var t;
		f = this.fcs[f];
		for (i = 0; i < f.p.length; i++) {
			t = matapp(mat, this.pts[f.p[i]]);
			this.pts[f.p[i]] = {x:t[0], y:t[1], z:t[2]};
		}
	},
	
	precalc: function() {
		var i, j, a, b;
		
		with (this) {
			// transform points
			ptst = [];
			for (i = 0; i < pts.length; i++) {
				t = matapp(mat, pts[i]);
				ptst.push({x:t[0], y:t[1], z:t[2]});
			}
			
			// calc z-order
			for (i = 0; i < fcst.length; i++) {
				a = fcst[i].p;
				fcst[i].z = 0;
				for (j = 0; j < a.length; j++) {
					fcst[i].z += this.ptst[a[j]].z;
				}
				fcst[i].z /= a.length;
			}
			
			// order faces
			fcst.sort(function(a, b) { return a.z - b.z; });
		}
		

	},
	
	render: function() {
		var i, j, f, p;
		
		with (this) {
			$.clearRect(-2,-2,4,4);
			/*
			$.fillStyle = '#f0f';
			$.fillRect(-1,-1,2,2);
			*/
			precalc();
			
			for (i = 0; i < fcst.length; i++) {
				// print('face ' + i);
				f = fcst[i].p;
				p = ptst[f[0]];
				$.beginPath();
				$.moveTo(p.x, p.y);
				// print('\t'+p.x+', '+p.y);
				for (j = 1; j < f.length; j++) {
					p = ptst[f[j]];
					$.lineTo(p.x, p.y);
					// print('\t'+p.x+', '+p.y);
				}
				$.closePath();
				$.fillStyle = mtrls[fcst[i].m];
				$.fill();
				$.stroke();
			}
		}
	}

};


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
		b = matcp(t);
		a = arguments[m];
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

/*
function anmupd() {
	var t = animator.milliseconds - this.startTime;
	ds[0].mat = matcomp(matscale(.6,.6,.6), matrot('x', this.x), matrot('y', 1.3 + t/45*deg));
	
	ds[0].render();
	
	return true;
}


anm = new CustomAnimation(40, anmupd);
anm.x = 15*deg;
animator.start(anm);
*/

function rot_mousedown() {
	with (rotr) {
		if (a && a.kill) {
			a.kill();
		}
		f = 1;
		x = system.event.x;
		y = system.event.y;
	}
}

function rot_mousedrag() {
	with (rotr) {
		if (f) {
			dx = system.event.x - x;
			dy = system.event.y - y;
			x = system.event.x;
			y = system.event.y;
			t = animator.milliseconds;
			rot_rndr();
		}
	}
}

function rot_rndr() {
	with (rotr) {
		ds[0].mat = matcomp(ds[0].mat, matrot('y', dx*deg), matrot('x', dy*deg));
		ds[0].render();
	}
}

function rot_anm() {
	var pct = (animator.milliseconds - this.startTime) / this.dur, m = animator.ease(.8, 0, pct, animator.kEaseOut);
	
	with (rotr) {
		if (f || pct > 1) {
			return false;
		} else {
			dx = m * this.dx;
			dy = m * this.dy;
			rot_rndr();
			return true;
		}
	}
}

function rot_mouseup() {
	var td;
	with (rotr) {
		f = 0;
		td = Math.max(Math.abs(dx), Math.abs(dy));
		if (animator.milliseconds - t < 100 && td > 1) {
			a = new CustomAnimation(20, rot_anm);
			a.dx = dx > 0 ? Math.min(dx, 16) : Math.max(dx, -16);
			a.dy = dy > 0 ? Math.min(dy, 16) : Math.max(dy, -16);
			a.dur = Math.max(Math.abs(a.dx), Math.abs(a.dy)) * 35;
			animator.start(a);
		}
	}
}


var i,wn,$,wdf=system.widgetDataFolder,cvs=[],ds=[],rotr={a:0,f:0,t:0,x:0,y:0,dx:0,dy:0};

wn=mk(Window,{width:256,height:256});
cv3d=mkapp(Canvas,wn,{width:256,height:256,onMouseDown:rot_mousedown,onMouseDrag:rot_mousedrag,onMouseUp:rot_mouseup,});


for (i = 0; i < 2; i++) {
	cvs[i]=mkapp(Canvas,wn,{width:256,height:256});
	$ = cvs[i].getContext('2d');
	with ($) {
		scale(128, -128);
		translate(1, -1);
		scale(.5, .5);
		lineWidth=.02;
		lineJoin='round';
		globalAlpha=.85;
	}
	ds[i]=new ddd($);
}

with (cvs[0]) {
	onMouseDown = rot_mousedown;
	onMouseDrag = rot_mousedrag;
	onMouseUp = rot_mouseup;
}

// makecube(ds[0]);

cube = new qcube();

// initial, pretty rotation
ds[0].mat = matcomp(matrot('y', -30*deg), matrot('x', 15*deg));
ds[0].render();


