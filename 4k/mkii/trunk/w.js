function mk(O,p,m) {
	var i,r=new O();
	p=p?p:{};
	if (m)
		apply(r,p);
	else
		for (i in p)
			r[i]=p[i];
	return r;
}

function mkapp(o,r,p,m) {
	return r.appendChild(mk(o,p,m));
}

function apply(a,b) {
	for(var i in b)
		typeof(b[i])=='object'?apply(a[i],b[i]):a[i]=b[i];
}

function toim(c,g,i) {
	i=i?i:{};
	i.src=null;
	c.saveImageToFile(g,'png');
	i.src=g;
}



function qube() {
	var i, j;
	with (this) {
		f = {};
		f[0] = new qface('r', '+z');
		f[0].tx(mt(-1.5, -1.5, 1.5));
		f[1] = new qface('g', '-y');
		f[1].tx(mc(mt(-1.5, -1.5, 1.5), mr('x', -90*deg)));
		f[2] = new qface('o', '-z');
		f[2].tx(mc(mt(-1.5, -1.5, 1.5), mr('x', 180*deg)));
		f[3] = new qface('b', '+y');
		f[3].tx(mc(mt(-1.5, -1.5, 1.5), mr('x', 90*deg)));
		f[4] = new qface('y', '+x');
		f[4].tx(mc(mt(-1.5, -1.5, 1.5), mr('y', 90*deg)));
		f[5] = new qface('w', '-x');
		f[5].tx(mc(mt(-1.5, -1.5, 1.5), mr('y', 270*deg)));
		
		for (i = 0; i < 6; i++) {
			f[i].tx(ms(.6, .6, .6));
			for (j = 0; j < 9; j++) {
				ds.mkbrd(0, 0, 0, 0);
			}
		}
		
	}
}

qube.adj = [
	// ordered pairs of (face,side) in top,right,bottom,left order
	[3,2, 4,3, 1,0, 5,1], // front
	[0,2, 4,2, 2,0, 5,2], // bottom
	[1,2, 4,1, 3,0, 5,3], // back
	[2,2, 4,0, 0,0, 5,0], // top
	[3,1, 2,1, 1,1, 0,1], // right
	[3,3, 0,3, 1,3, 2,3]  // left
];

qube.axes = [
	'+z', // front
	'+y', // bottom
	'-z', // back
	'-y', // top
	'+x', // right
	'-x'  // left
];

qube.prototype = {
	f: 0,
	
	getf: function(a) {
		var i, j, k, g, t=[];
		for (i = 0; i < 9; i++) {
			t.push(this.f[a].f[i]);
		}
		for (i = 0; i < 4; i++) {
			g = this.f[ qube.adj[a][i*2] ];
			k = qube.adj[a][i*2 + 1];
			for (j = 0; j < 3; j++) {
				t.push(g.f[(k*2 + j) % 8]);
			}
		}
		return t;
	},
	
	restick: function() {
		var i, j;
		for (i = 0; i < 6; i++) {
			for (j = 0; j < 9; j++) {
				ds.stick(i*9 + j, i*9 + j);
			}
		}
	},
	
	// methods
	rot: function(c, d) {
		var i, j, t, g, a=[], b={};
		if (d) {
			for (i = 0; i < 3; i++) {
				this.rot(c, 0);
			}
		} else {
			g = this.f[c];
			// rotate these faces
			for (i = 0; i < 8; i++) {
				a[(i + 2) % 8] = g.f[i];
			}
			for (i = 0; i < 8; i++) {
				g.f[i] = a[i];
			}
			a[8] = g.f[8];
			
			// rotate neighbor faces
			for (i = 0; i < 4; i++) {
				g = this.f[ qube.adj[c][i*2] ];
				t = qube.adj[c][i*2 + 1];
				for (j = 0; j < 3; j++) {
					b[i*3+j] = g.f[(t*2 + j) % 8];
					a.push(b[i*3+j]);
				}
			}
			for (i = 0; i < 4; i++) {
				t = (i + 1) % 4;
				g = this.f[ qube.adj[c][t*2] ];
				t = qube.adj[c][t*2 + 1];
				for (j = 0; j < 3; j++) {
					g.f[(t*2 + j) % 8] = b[i*3+j];
				}
			}
			
		}
		
		/*
		if ((!e && !d) || h) {
			this.anm = new CustomAnimation(20, qube.rotanm);
			this.anm.target = (h ? -90 : 90)*deg;
			this.anm.theta = 0;
			this.anm.axis = qube.axes[c];
			this.anm.faces = a;
			animator.start(this.anm);
		}
		*/
		
	}
	
	/*
	toString: function() {
		var i, g, x, y, s=[], r='';
		for (i = 0; i < 36; i++) {
			s[i]='   ';
		}
		for (i = 0; i < 6; i++) {
			g = this.f[i].f;
			x = (i == 5 ? 0 : (i == 4 ? 2 : 1));
			y = (i == 3 ? 0 : (i == 1 ? 6 : (i == 2 ? 9 : 3)));
			s[y*3 + x] = g[0].c + g[1].c + g[2].c;
			s[y*3 + 3 + x] = g[7].c + g[8].c + g[3].c;
			s[y*3 + 6 + x] = g[6].c + g[5].c + g[4].c;
		}
		
		for (i = 0; i < 12; i++) {
			r += s[i*3] + s[i*3 + 1] + s[i*3 + 2] + '\n';
		}
		return r;
	}
	*/
};

qube.rotanm = function() {
	var i, m, t = animator.milliseconds - this.startTime, p = t / 600, dst, dt;
	
	dst = (p < 1) ? animator.ease(0, this.target, p, animator.kEaseInOut) : this.target;
	
	dt = dst - this.theta;
	
	m = mr(this.axis.substr(1), (/^-/.test(this.axis) ? -1 : 1) * dt);
	this.theta += dt;
	
	for (i = 0; i < this.faces.length; i++) {
		ds.txface(this.faces[i].f, m);
	}
	
	ds.render();
	
	return p <= 1;
};





function qface(c) {
	var i, p;
	c = c ? c : 'w';
	with (this) {
		// adj = {};
		f = {};
		for (i = 0; i < 9; i++) {
			p = qface.placement[i];
			f[i] = {c: c, f: ds.mkface({dynamic: 1, color: qface.rgb[c]}, p[0], p[1], 0, p[0]+1, p[1], 0, p[0]+1, p[1]+1, 0, p[0], p[1]+1, 0)};
		}
	}
}

qface.prototype = {
	// adj: 0,
	f: 0,
	
	tx: function(m) {
		for (var i = 0; i < 9; i++) {
			ds.txface(this.f[i].f, m);
		}
	}
};


qface.rgb = {
	r: {r: 240, g: 48, b: 49},
	o: {r: 252, g: 125, b: 49},
	y: {r: 255, g: 240, b: 36},
	w: {r: 255, g: 255, b: 255},
	g: {r: 40, g: 196, b: 72},
	b: {r: 53, g: 93, b: 228}
};

qface.colorhex = {
	r: '#e33',
	o: '#e83',
	y: '#dd2',
	w: '#eee',
	g: '#3e3',
	b: '#33e'
};

qface.placement = [
	[0,0],
	[1,0],
	[2,0],
	[2,1],
	[2,2],
	[1,2],
	[0,2],
	[0,1],
	[1,1]
];


deg=Math.PI/180;




function ddd(c) {
	with (this) {
		$ = c;
		pts = [];
		f = [];
		ft = [];
		brds = [];
		brdst = [];
		mat = mi();
	}
}
ddd.prototype = {
	$:0,
	pts:0,
	ptst:0,
	f:0,
	ft:0,
	brds:0,
	brdst:0,
	mat:0,
	
	// methods
	mkpt: function(x, y, z, d) {
		if (!d) {
			for (var i = 0; i < this.pts.length; i++) {
				if (this.pts[i].x == x && this.pts[i].y == y && this.pts[i].z == z) {
					return i;
				}
			}
		}
		// didn't find the point in pts already
		this.pts.push({x:x, y:y, z:z});
		return this.pts.length - 1;
	},
	
	mkface: function(o) {
		var i, a, t=[], d, g;
		o = o ? o : {};
		d = o.dynamic ? 1 : 0;
		
		for (i = 1; i < arguments.length; i+=3) {
			t.push(this.mkpt(arguments[i], arguments[i + 1], arguments[i + 2], d));
		}
		g = {p: t, c: o.color, z: 0, d: d};
		this.f.push(g);
		this.ft.push(g);
		return this.f.length - 1;
	},
	
	mkbrd: function(x, y, z, o) {
		var i, b;
		if (o.img && !o.width && !o.height) {
			o.width = o.img.srcWidth;
			o.height = o.img.srcHeight;
		}
		
		b = {o: o, p: this.mkpt(x, y, z, 1)};
		this.brds.push(b);
		this.brdst.push(b);
		return this.brds.length - 1;
	},
	
	txface: function(g, m) {
		var i, t;
		g = this.f[g];
		for (i = 0; i < g.p.length; i++) {
			t = ma(m, this.pts[g.p[i]]);
			this.pts[g.p[i]] = {x:t[0], y:t[1], z:t[2]};
		}
	},
	
	txpt: function(p, m) {
		var t = ma(m, this.pts[p]);
		this.pts[p] = {x:t[0], y:t[1], z:t[2]};
	},
	
	precalc: function() {
		var i, j, a, b, z=function(a, b) { return a.z - b.z };
		
		with (this) {
			// transform points
			ptst = [];
			for (i = 0; i < pts.length; i++) {
				t = ma(mat, pts[i]);
				ptst.push({x:t[0], y:t[1], z:t[2]});
			}
			
			// calc z-order
			// faces
			for (i = 0; i < ft.length; i++) {
				a = ft[i].p;
				ft[i].z = 0;
				for (j = 0; j < a.length; j++) {
					ft[i].z += ptst[a[j]].z;
				}
				ft[i].z /= a.length;
			}
			// order faces
			ft.sort(z);
			
			// billboards
			for (i = 0; i < brdst.length; i++) {
				brdst[i].z = ptst[brdst[i].p];
			}
			brdst.sort(z);
		}
		

	},
	
	// calcs the midpt of a face
	midpt: function(g) {
		var i, j, p, m={x:0,y:0,z:0};
		with (this) {
			p = f[g].p;
			for (i in m) {
				for (j = 0; j < p.length; j++) {
					m[i] += pts[p[j]][i];
				}
				m[i] /= p.length;
			}
		}
		return m;
	},
	
	// sticks a billboard in the middle of a face
	stick: function(b, g) {
		with (this) {
			pts[brds[b].p] = midpt(g);
		}
	},
	
	render: function() {
		var i, j, g, p, s;
		
		with (this) {
			$.clearRect(-2,-2,4,4);
			precalc();
			
			for (i = 0; i < ft.length; i++) {
				g = ft[i].p;
				p = ptst[g[0]];
				$.beginPath();
				$.moveTo(p.x, p.y);
				for (j = 1; j < g.length; j++) {
					p = ptst[g[j]];
					$.lineTo(p.x, p.y);
				}
				$.closePath();
				s = .5 + (p.z + 1.5)/4;
				$.fillStyle = 'rgb(' + Math.floor(ft[i].c.r * s) + ',' + Math.floor(ft[i].c.g * s) + ',' + Math.floor(ft[i].c.b * s) + ')';
				$.fill();
				$.stroke();
			}
			
			for (i = 0; i < brdst.length; i++) {
				g = brdst[i];
				if (g.o.img) {
					p = ptst[g.p];
					$.drawImage(p.x - g.o.width / 2, p.y - g.o.height / 2, g.o.width, g.o.height);
				}
			}
		}
	},
	
	// finds the billboard closest to the coordinates
	getclosestbrd: function(x, y, z, c) {
		var i, d, b, bd, p, dx, dy, dz;
		c ? c : c = 1e308;
		bd = c;
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


function mr(a, t) {
	var c = Math.cos(t), s = Math.sin(t);
	if (a == 'x') {
		return [
			1, 0,  0, 0,
			0, c, -s, 0,
			0, s,  c, 0,
			0, 0,  0, 1
		];
	} else if (a == 'y') {
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


function mt(x, y, z) {
	return [
		1, 0, 0, x,
		0, 1, 0, y,
		0, 0, 1, z,
		0, 0, 0, 1
	];
}

function ms(x, y, z) {
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

function mi() {
	return ms();
}

function mc() {
	var a, b, m, i, j, t;
	
	for (m = 1; m < arguments.length; m++) {
		t ? t : t = arguments[0];
		b = mcp(t);
		a = arguments[m];
		for (i = 0; i < 4; i++) {
			for (j = 0; j < 4; j++) {
				t[i*4 + j] = a[i*4]*b[j] + a[i*4+1]*b[4+j] + a[i*4+2]*b[8+j] + a[i*4+3]*b[12+j];
			}
		}
	}
	return t;
}

function mcp(a) {
	var i, t={};
	for (i = 0; i < 16; i++) {
		t[i] = a[i];
	}
	return t;
}

function ma(a, v) {
	var i, j, t={};
	if (typeof(v.x) != 'undefined') {
		return ma(a, [v.x, v.y, v.z, 1]);
	}
	for (i = 0; i < 4; i++) {
		t[i] = a[i*4]*v[0] + a[i*4+1]*v[1] + a[i*4+2]*v[2] + a[i*4+3]*v[3];
	}
	
	return t;
}

function rot_mousedown() {
	var i, j, a, b, c, dx, dy, m={x:0, y:0};
	if (rd) {
		if (system.event.shiftKey || system.event.altKey) {
			rote = 1;
			rd = 0;
			with (rotr) {
				if (a && a.kill) {
					a.kill();
				}
				g = 1;
				x = system.event.x;
				y = system.event.y;
			}
		} else {
			rd = rote = 0;
			with (rotf) {
				d = 1;
				t = 0;
				g = -1;
				c = ds.getclosestbrd((system.event.x - 128) / 64, (system.event.y - 128) / 64, 1);
				for (i = 0; i < 6; i++) {
					for (j = 0; j < 9; j++) {
						if (cube.f[i].f[j].f == c) {
							g = i;
						}
					}
				}
				f = cube.getf(g);
				
				i = g * 9 + 8; // get the center facelet
				
				a = ds.f[i].p;
				for (j = 0; j < 4; j++) {
					m.x += ds.ptst[a[j]].x / 4;
					m.y += ds.ptst[a[j]].y / 4;
				}
				xi = m.x;
				yi = m.y;
				dx = (system.event.x - 128) / 64 - xi;
				dy = (system.event.y - 128) / 64 - yi;
				tf = tc = ti = Math.atan2(dy, dx);
			}
		}
	}
}

function rot_mousedrag() {
	var dx, dy, t;
	if (rote) {
		with (rotr) {
			if (g) {
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
	var i, m;
	if (rote) {
		with (rotr) {
			ds.mat = mc(ds.mat, mr('y', dx*deg), mr('x', -dy*deg));
		}
	} else {
		with (rotf) {
			m = mr(qube.axes[g].substr(1), (/^-/.test(qube.axes[g]) ? -1 : 1) * (tf - tc));
			tc = tf;
			for (i = 0; i < f.length; i++) {
				ds.txface(f[i].f, m);
			}
		}
	}
	ds.render();
}


function rot_mouseup() {
	var i, td, r;
	if (rote) {
		with (rotr) {
			g = 0;
			td = Math.max(Math.abs(dx), Math.abs(dy));
			if (animator.milliseconds - t < 100 && td > 1) {
				a = new CustomAnimation(20, rotr_anm, ready);
				a.dx = dx > 0 ? Math.min(dx, 16) : Math.max(dx, -16);
				a.dy = dy > 0 ? Math.min(dy, 16) : Math.max(dy, -16);
				a.dur = Math.max(Math.abs(a.dx), Math.abs(a.dy)) * 10;
				animator.start(a);
			} else {
				ready();
			}
		}
	} else {
		with (rotf) {
			if (d) {
				d = 0;
				
				if (ti != tf) {
					r = Math.floor((((tf - ti + 405*deg) % (360*deg)) ) / (90*deg));
										
					do_rot(g, r, tc - ti);
				} else {
					ready();
				}
			}
		}
	}
}

function do_rot(a, b, c, d) { // a = face, b = num turns, c = initial angle, d = quick
	var i;
	for (i = 0; i < b; i++) {
		cube.rot(a);
	}
	
	g = new CustomAnimation(20, rotf_anm, ready);
	g.ti = g.theta = c;
	g.target = b * 90*deg;
	g.axis = qube.axes[a];
	g.f = cube.getf(a);
	g.q = d;
	animator.start(g);
}


function rotf_anm() {
	with (this) {
		var i, m, t = animator.milliseconds - this.startTime, p = t / (q ? 80 : 250), dst, dt;
		
		if (target - ti > 180*deg) {
			target -= 360*deg;
		} else if (ti - target > 180*deg) {
			target += 360*deg;
		}
		dst = (p < 1) ? animator.ease(ti, target, p, q ? animator.kEaseNone : animator.kEaseOut) : target;
		
		dt = dst - theta;
		
		m = mr(axis.substr(1), (/^-/.test(axis) ? -1 : 1) * dt);
		theta += dt;
		
		for (i = 0; i < f.length; i++) {
			ds.txface(f[i].f, m);
		}
		ds.render();
		
		return p <= 1;
	}
}


function rotr_anm() {
	var p = (animator.milliseconds - this.startTime) / this.dur, m = animator.ease(.8, 0, p, animator.kEaseOut);
	
	with (rotr) {
		if (g || p > 1) {
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
	rd = 1;
	if (scrm.i > 0)
		scrm();
	cube.restick();
	ds.render();
}
	
function rst() {
	reloadWidget();
}

function scrm() {
	var a, b;
	if (scrm.i < 40) {
		rd = 0;
		a = random(0, 6);
		b = random(1, 4);
		do_rot(a, b, 0, 1);
		scrm.i++;
	} else {
		scrm.i = 0;
	}
}
scrm.i = 0;




var i, wn, rd, $, wdf = system.widgetDataFolder, cv, ds, rote, rotf = {d:0, g:0, f:0, ti:0, tc:0, tf:0, xi:0, yi:0}, rotr = { a:0, g:0, t:0, x:0, y:0, dx:0, dy:0 };

wn=mk(Window,{width:256,height:256,contextMenuItems:[
	mk(MenuItem, {title: 'Scramble', onSelect: scrm}),
	mk(MenuItem, {title: 'Reset', onSelect: rst})
]});
cv=mkapp(Canvas,wn,{width:256,height:256,onMouseDown: rot_mousedown, onMouseDrag: rot_mousedrag, onMouseUp: rot_mouseup});
$ = cv.getContext('2d');
with ($) {
	scale(64, 64);
	translate(2,2);
	lineWidth=.04;
	lineJoin='round';
	globalAlpha=.96;
}
ds = new ddd($);

cube = new qube();

// initial, pretty rotation
ds.mat = mc(mr('y', -30*deg), mr('x', -15*deg));


ready();

