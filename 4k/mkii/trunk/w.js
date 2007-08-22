function pdump(o) {
	print('PDUMP');
	for (var i in o) {
		print(i + ':' + o[i]);
	}
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
	var i, j;
	with (this) {
		fcs = {};
		fcs[0] = new qface('r', '+z');
		fcs[0].tx(mattrans(-1.5, -1.5, 1.5));
		fcs[1] = new qface('g', '-y');
		fcs[1].tx(matcomp(mattrans(-1.5, -1.5, 1.5), matrot('x', -90*deg)));
		fcs[2] = new qface('o', '-z');
		fcs[2].tx(matcomp(mattrans(-1.5, -1.5, 1.5), matrot('x', 180*deg)));
		fcs[3] = new qface('b', '+y');
		fcs[3].tx(matcomp(mattrans(-1.5, -1.5, 1.5), matrot('x', 90*deg)));
		fcs[4] = new qface('y', '+x');
		fcs[4].tx(matcomp(mattrans(-1.5, -1.5, 1.5), matrot('y', 90*deg)));
		fcs[5] = new qface('w', '-x');
		fcs[5].tx(matcomp(mattrans(-1.5, -1.5, 1.5), matrot('y', 270*deg)));
		
		for (i = 0; i < 6; i++) {
			fcs[i].tx(matscale(.6, .6, .6));
			for (j = 0; j < 9; j++) {
				ds[0].mkbrd(0, 0, 0, 0);
			}
		}
		
	}
}

qcube.adj = {
	// ordered pairs of (face,side) in top,right,bottom,left order
	0: [3,2, 4,3, 1,0, 5,1], // front
	1: [0,2, 4,2, 2,0, 5,2], // bottom
	2: [1,2, 4,1, 3,0, 5,3], // back
	3: [2,2, 4,0, 0,0, 5,0], // top
	4: [3,1, 2,1, 1,1, 0,1], // right
	5: [3,3, 0,3, 1,3, 2,3]  //left
};

qcube.axes = {
	0: '+z',
	1: '+y',
	2: '-z',
	3: '-y',
	4: '+x',
	5: '-x'
};

qcube.prototype = {
	fcs: 0,
	
	getfacelets: function(facei) {
		var i, j, k, f, t=[];
		for (i = 0; i < 9; i++) {
			t.push(this.fcs[facei].facelets[i]);
		}
		for (i = 0; i < 4; i++) {
			f = this.fcs[ qcube.adj[facei][i*2] ];
			k = qcube.adj[facei][i*2 + 1];
			for (j = 0; j < 3; j++) {
				t.push(f.facelets[(k*2 + j) % 8]);
			}
		}
		return t;
	},
	
	restick: function() {
		var i, j;
		for (i = 0; i < 6; i++) {
			for (j = 0; j < 9; j++) {
				ds[0].stick(i*9 + j, i*9 + j);
			}
		}
	},
	
	// methods
	rotate: function(facei, ccw, hide, anmccw) {
		var i, j, t, f, a=[], b={};
		if (ccw) {
			for (i = 0; i < 3; i++) {
				this.rotate(facei, 0, 1, i == 0);
			}
		} else {
			f = this.fcs[facei];
			// rotate these faces
			for (i = 0; i < 8; i++) {
				a[(i + 2) % 8] = f.facelets[i];
			}
			for (i = 0; i < 8; i++) {
				f.facelets[i] = a[i];
			}
			a[8] = f.facelets[8];
			
			// rotate neighbor faces
			for (i = 0; i < 4; i++) {
				f = this.fcs[ qcube.adj[facei][i*2] ];
				t = qcube.adj[facei][i*2 + 1];
				for (j = 0; j < 3; j++) {
					b[i*3+j] = f.facelets[(t*2 + j) % 8];
					a.push(b[i*3+j]);
				}
			}
			for (i = 0; i < 4; i++) {
				t = (i + 1) % 4;
				f = this.fcs[ qcube.adj[facei][t*2] ];
				t = qcube.adj[facei][t*2 + 1];
				for (j = 0; j < 3; j++) {
					f.facelets[(t*2 + j) % 8] = b[i*3+j];
				}
			}
			
		}
		
		if ((!hide && !ccw) || anmccw) {
			this.anm = new CustomAnimation(20, qcube.rotanm);
			this.anm.target = (anmccw ? -90 : 90)*deg;
			this.anm.theta = 0;
			this.anm.axis = qcube.axes[facei];
			this.anm.faces = a;
			animator.start(this.anm);
		}
		
	},
	
	
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

qcube.rotanm = function() {
	var i, mat, t = animator.milliseconds - this.startTime, pct = t / 600, dst, dt;
	
	dst = (pct < 1) ? animator.ease(0, this.target, pct, animator.kEaseInOut) : this.target;
	
	dt = dst - this.theta;
	
	mat = matrot(this.axis.substr(1), (/^-/.test(this.axis) ? -1 : 1) * dt);
	this.theta += dt;
	
	for (i = 0; i < this.faces.length; i++) {
		ds[0].txface(this.faces[i].f, mat);
	}
	
	ds[0].render();
	
	return pct <= 1;
};





function qface(color) {
	var i,p;
	color = color ? color : 'w';
	with (this) {
		// adj = {};
		facelets = {};
		for (i = 0; i < 9; i++) {
			p = qface.placement[i];
			// facelets[i] = {c: color, f: ds[0].mkface({dynamic: 1, color: qface.colorhex[color]}, p[0], p[1], 0, p[0]+1, p[1], 0, p[0]+1, p[1]+1, 0, p[0], p[1]+1, 0)};
			facelets[i] = {c: color, f: ds[0].mkface({dynamic: 1, color: 'rgb(' + qface.rgb[color].r + ',' + qface.rgb[color].g + ',' + qface.rgb[color].b + ')'}, p[0], p[1], 0, p[0]+1, p[1], 0, p[0]+1, p[1]+1, 0, p[0], p[1]+1, 0)};
		}
	}
}

qface.prototype = {
	// adj: 0,
	facelets: 0,
	
	tx: function(mat) {
		var i;
		for (i = 0; i < 9; i++) {
			ds[0].txface(this.facelets[i].f, mat);
		}
	}
};


qface.rgb = {
	r: {r: 255, g: 0, b: 0},
	o: {r: 255, g: 127, b: 63},
	y: {r: 255, g: 255, b: 0},
	w: {r: 255, g: 255, b: 255},
	g: {r: 0, g: 255, b: 0},
	b: {r:0, g: 0, b: 255}
};

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
		brds = [];
		brdst = [];
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
	brds:0,
	brdst:0,
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
	
	mkbrd: function(x, y, z, opts) {
		var i, b, o={img: 0};
		apply(o, opts);
		if (o.img && !o.width && !o.height) {
			o.width = o.img.srcWidth;
			o.height = o.img.srcHeight;
		}
		
		b = {o: o, p: this.mkpt(x, y, z, 1)};
		this.brds.push(b);
		this.brdst.push(b);
		return this.brds.length - 1;
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
	
	txface: function(f, mat) {
		var t;
		f = this.fcs[f];
		for (i = 0; i < f.p.length; i++) {
			t = matapp(mat, this.pts[f.p[i]]);
			this.pts[f.p[i]] = {x:t[0], y:t[1], z:t[2]};
		}
	},
	
	txpt: function(p, mat) {
		var t;
		t = matapp(mat, this.pts[p]);
		this.pts[p] = {x:t[0], y:t[1], z:t[2]};
	},
	
	precalc: function() {
		var i, j, a, b, z=function(a, b) { return a.z - b.z };
		
		with (this) {
			// transform points
			ptst = [];
			for (i = 0; i < pts.length; i++) {
				t = matapp(mat, pts[i]);
				ptst.push({x:t[0], y:t[1], z:t[2]});
			}
			
			// calc z-order
			// faces
			for (i = 0; i < fcst.length; i++) {
				a = fcst[i].p;
				fcst[i].z = 0;
				for (j = 0; j < a.length; j++) {
					fcst[i].z += ptst[a[j]].z;
				}
				fcst[i].z /= a.length;
			}
			// order faces
			fcst.sort(z);
			
			// billboards
			for (i = 0; i < brdst.length; i++) {
				brdst[i].z = ptst[brdst[i].p];
			}
			brdst.sort(z);
		}
		

	},
	
	// calcs the midpt of a face
	midpt: function(f) {
		var i, j, p, m={x:0,y:0,z:0};
		with (this) {
			p = fcs[f].p;
			for (var i in m) {
				for (j = 0; j < p.length; j++) {
					m[i] += pts[p[j]][i];
				}
				m[i] /= p.length;
			}
		}
		return m;
	},
	
	// sticks a billboard in the middle of a face
	stick: function(b, f) {
		with (this) {
			pts[brds[b].p] = midpt(f);
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
			
			for (i = 0; i < brdst.length; i++) {
				f = brdst[i];
				if (f.o.img) {
					p = ptst[f.p];
					$.drawImage(p.x - f.o.width / 2, p.y - f.o.height / 2, f.o.width, f.o.height);
				}
			}
		}
	},
	
	// finds the billboard closest to the coordinates
	getclosestbrd: function(x, y, z, cutoff) {
		var i, d, b, bd, p, dx, dy, dz;
		cutoff ? cutoff : cutoff = 1e308;
		bd = cutoff;
		with (this) {
			for (i = 0; i < brds.length; i++) {
				p = ptst[brds[i].p];
				dx = x - p.x;
				dy = y - p.y;
				dz = z - p.z;
				d = Math.sqrt(dx*dx + dy*dy + dz*dz);
				if (d <= bd) {
					b = i;
					bd = d;
				}
			}
		}
		return b;
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
function rot_mousedown() {
	var t={};
	with (rotr) {
		if (a && a.kill) {
			a.kill();
		}
		f = 1;
		x = system.event.x;
		y = system.event.y;
	}
	
	t.x = (system.event.x - 128) / 64;
	t.y = (system.event.y - 128) / 64;
	
	t.b = ds[0].getclosestbrd(t.x, t.y, 1.1);
	
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
		ds[0].mat = matcomp(ds[0].mat, matrot('y', dx*deg), matrot('x', -dy*deg));
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
*/


function rot_mousedown() {
	var i, j, a, b, c, dx, dy, m={x:0,y:0};
	if (system.event.shiftKey || system.event.altKey) {
		rote = 1;
		with (rotr) {
			if (a && a.kill) {
				a.kill();
			}
			f = 1;
			x = system.event.x;
			y = system.event.y;
		}
	} else {
		rote = 0;
		with (rotf) {
			d = 1;
			t = 0;
			f = -1;
			// log((system.event.x - 128) / 64, (system.event.y - 128) / 64);
			c = ds[0].getclosestbrd((system.event.x - 128) / 64, (system.event.y - 128) / 64, 1);
			// f = Math.floor(c / 9);
			for (i = 0; i < 6; i++) {
				for (j = 0; j < 9; j++) {
					if (cube.fcs[i].facelets[j].f == c) {
						f = i;
					}
				}
			}
			fcs = cube.getfacelets(f);
			
			i = f * 9 + 8; // get the center facelet
			// log(c, i, f);
			
			a = ds[0].fcs[i].p;
			for (j = 0; j < 4; j++) {
				m.x += ds[0].ptst[a[j]].x / 4;
				m.y += ds[0].ptst[a[j]].y / 4;
			}
			xi = m.x;
			yi = m.y;
			dx = (system.event.x - 128) / 64 - xi;
			dy = (system.event.y - 128) / 64 - yi;
			tf = tc = ti = Math.atan2(dy, dx);
		}
	}
}

function rot_mousedrag() {
	var dx, dy, t;
	if (rote) {
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
	} else {
		with (rotf) {
			if (d) {
				dx = (system.event.x - 128) / 64 - xi;
				dy = (system.event.y - 128) / 64 - yi;
				
				tf = Math.atan2(dy, dx);
				
				rot_rndr();
			}
		}
	}
}


function rot_rndr() {
	var i, mat;
	if (rote) {
		with (rotr) {
			ds[0].mat = matcomp(ds[0].mat, matrot('y', dx*deg), matrot('x', -dy*deg));
		}
	} else {
		with (rotf) {
			mat = matrot(qcube.axes[f].substr(1), (/^-/.test(qcube.axes[f]) ? -1 : 1) * (tf - tc));
			tc = tf;
			for (i = 0; i < fcs.length; i++) {
				ds[0].txface(fcs[i].f, mat);
			}
		}
	}
	ds[0].render();
}


function rot_mouseup() {
	var i, td, rots;
	if (rote) {
		with (rotr) {
			f = 0;
			td = Math.max(Math.abs(dx), Math.abs(dy));
			if (animator.milliseconds - t < 100 && td > 1) {
				a = new CustomAnimation(20, rotr_anm, ready);
				a.dx = dx > 0 ? Math.min(dx, 16) : Math.max(dx, -16);
				a.dy = dy > 0 ? Math.min(dy, 16) : Math.max(dy, -16);
				a.dur = Math.max(Math.abs(a.dx), Math.abs(a.dy)) * 35;
				animator.start(a);
			} else {
				ready();
			}
		}
	} else {
		with (rotf) {
			d = 0;
			
			if (ti != tf) {
				rots = Math.floor((((tf - ti + 405*deg) % (360*deg)) ) / (90*deg));
				
				for (i = 0; i < rots; i++) {
					cube.rotate(f, 0, 1);
				}
				
				tc = tf;
				tf = ti + rots * 90*deg;
				a = new CustomAnimation(20, rotf_anm, ready);
				a.theta = 0;
				a.target = tf - tc;
				if (a.target > 180*deg) {
					a.target -= 360*deg;
				}
				a.dur = 250;
				a.axis = qcube.axes[f];
				a.fcs = fcs;
				animator.start(a);
			} else {
				ready();
			}
		}
	}
}


function rotf_anm() {
	var i, mat, t = animator.milliseconds - this.startTime, pct = t / 500, dst, dt;
	
	dst = (pct < 1) ? animator.ease(0, this.target, pct, animator.kEaseOut) : this.target;
	
	dt = dst - this.theta;
	
	mat = matrot(this.axis.substr(1), (/^-/.test(this.axis) ? -1 : 1) * dt);
	this.theta += dt;
	
	for (i = 0; i < this.fcs.length; i++) {
		ds[0].txface(this.fcs[i].f, mat);
	}
	
	ds[0].render();
	
	return pct <= 1;
}


function rotr_anm() {
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



function ready() {
	cube.restick();
	ds[0].render();
}


var i, wn, $, wdf = system.widgetDataFolder, cvs = [], ds = [], rote, rotf = {d:0, f:0, fcs:0, ti:0, tc:0, tf:0, xi:0, yi:0}, rotr = { a:0, f:0, t:0, x:0, y:0, dx:0, dy:0 };

wn=mk(Window,{width:256,height:256});
cv3d=mkapp(Canvas,wn,{width:256,height:256,onMouseDown:rot_mousedown,onMouseDrag:rot_mousedrag,onMouseUp:rot_mouseup,});


for (i = 0; i < 2; i++) {
	cvs[i]=mkapp(Canvas,wn,{width:256,height:256});
	$ = cvs[i].getContext('2d');
	with ($) {
		// scale(128, -128);
		// translate(1, -1);
		translate(128, 128);
		scale(64, 64);
		//translate(1, 1);
		//scale(.5, .5);
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
ds[0].mat = matcomp(matrot('y', -30*deg), matrot('x', -15*deg));


ready();

