magnets = [];

function Magnet(wn) {
	with (this) {
		cv = new Canvas();
		cv.mag = this;
		with (cv) {
			hAlign = 'center';
			vAlign = 'center';
			onMouseDown = Magnet.onMouseDown;
			onMouseDrag = Magnet.onMouseDrag;
			onMouseUp = Magnet.onMouseUp;
		}
		$ = cv.getContext('2d');
		$.save();
		
		if (wn && wn.appendChild) {
			wn.appendChild(cv);
		}
		
		_drag = {
			clicked: false,
			x: 0/0,
			y: 0/0,
			initX: 0/0,
			initY: 0/0
		};
		id = magnets.length;
	}
	magnets.push(this);
}

Magnet.prototype = {
	id: -1,
	
	cv: null,  // canvas
	$: null,   // canvas context
	
	scale: 1,
	hOffset: 0,
	vOffset: 0,
	width: 1,
	height: 1,
	rotation: 0,
	
	
	// methods
	
	update: function(force) {
		with (this) {
			_draw(_recenter(force) || force);
		}
	},
	
	
	// internal vars
	_drag: null,
	
	
	// internal methods
	/**
	 * _recenter(force)
	 * retursn true if an update was made
	 */
	_recenter: function(force) {
		with (this) {
			// cache variables to check if an update is needed
			_recenter.hOffset = _recenter.hOffset || 0/0;
			_recenter.vOffset = _recenter.vOffset || 0/0;
			_recenter.width = _recenter.width || 0/0;
			_recenter.height = _recenter.height || 0/0;
			_recenter.scale = _recenter.scale || 0/0;
			_recenter.rotation = _recenter.rotation || 0/0;
			
			if (force || _recenter.hOffset != hOffset || _recenter.vOffset != vOffset || _recenter.width != width || _recenter.height != height || _recenter.scale != scale || _recenter.rotation != rotation) {
				// log('Recentering Magnet', width, height, scale);
				
				$.restore();
				cv.hOffset = hOffset;
				cv.vOffset = vOffset;
				cv.width = cv.height = Math.max(width, height) * scale * 2;
				$.save();
				
				// Force rotation between -PI and PI
				rotation = ((rotation + Math.PI) % (2*Math.PI)) - Math.PI;
				
				$.translate(cv.width / scale / 2, cv.height / scale / 2);
				$.scale(scale, scale);
				$.rotate(rotation);
				
				// cache current values
				_recenter.hOffset = hOffset;
				_recenter.vOffset = vOffset;
				_recenter.width = width;
				_recenter.height = height;
				_recenter.scale = scale;
				_recenter.rotation = rotation;
			
				return true;
			} else {
				return false;
			}
		}
	},
	
	_draw: function(force) {
		//log('Magnet._draw()');
	}
};

// event handler - comes from context of Canvas object
// this.mag = Magnet object
Magnet.onMouseDown = function() {
	var p;
	with (this.mag) {
		_drag.clicked = true;
		_drag.initX = _drag.x = system.event.screenX;
		_drag.initY = _drag.y = system.event.screenY;
		p = { x: system.event.screenX - hOffset, y: system.event.screenY - vOffset };
		
		ptheta = Math.atan2(p.y, p.x);
		
		_drag.ratio = Math.min(1, Math.sqrt(p.x*p.x + p.y*p.y) * Math.cos(ptheta - rotation) / (width / 2));
		
		cv.orderAbove();
	}
};

Magnet.onMouseDrag = function() {
	var dx, dy, p, pp, q, ratio, ptheta, dtheta;
	with (this.mag) {
		if (_drag.clicked) {
			p = { x: _drag.x - hOffset, y: _drag.y - vOffset };
			p = { x: system.event.screenX - hOffset, y: system.event.screenY - vOffset };
			
			ptheta = Math.atan2(p.y, p.x);
			
			dtheta = Math.atan2(pp.y, pp.x) - ptheta;
			
			rotation += .1 * dtheta;
			
			/*
			ratio = Math.min(1, Math.sqrt(p.x*p.x + p.y*p.y) * Math.cos(ptheta - rotation) / (width / 2));
			log(ratio);
			*/
			
			
			
			hOffset += Math.abs(1 - _drag.ratio) * p.x;
			vOffset += Math.abs(1 - _drag.ratio) * p.y;
			
			
			/*
			r = Math.sqrt(p.x*p.x + p.y*p.y);
			pqtheta = Math.atan(q.y - p.y, q.x - p.x);
			
			ppqqtheta = Math.atan(q.y - pp.y, q.x - pp.x);
			
			if (pp.x == q.x) {
				if (pp.y > q.y) {
					// qq = { x: q.x, y: pp.y - 2*r };
					ppqqtheta = -Math.PI/2;
				} else {
					// qq = { x: q.x, y: pp.y + 2*r };
					ppqqtheta = Math.PI/2;
				}
			} else {
				// slope = (q.y - pp.y) / (q.x - pp.x);
				ppqqtheta = Math.atan(q.y - pp.y, q.x - pp.x);
				// qq = { x: pp.x + 2*r * Math.sin(ppqqtheta), y: pp.y + 2*r * Math.cos(ppqqtheta) };
			}
			
			rotation += 1 * (ppqqtheta - pqtheta);
			
			//hOffset += pp.x + r * Math.sin(ppqqtheta);
			//vOffset += pp.y + r * Math.cos(ppqqtheta);
			
			hOffset += pp.x + r * Math.sin(ppqqtheta);
			vOffset += pp.y - r * Math.cos(ppqqtheta);
			
			log(ppqqtheta - pqtheta);
			
			qq = { x: pp.x + 2*r * Math.sin(ppqqtheta), y: pp.y + 2*r * Math.cos(ppqqtheta) };
			log(qq.x, qq.y);
			// log(p.x, p.y, q.x, q.y, pp.x, pp.y);
			*/
			
			/*
			dx = system.event.screenX - _drag.x;
			dy = system.event.screenY - _drag.y;
			
			// log(dx, dy);
			
			// arotation - rotation if grabbed at the edge
			arotation = rotation;
			
			brotation = Math.atan2(dy, dx);
			if (brotation - rotation > Math.PI / 2) {
				// log('flip a');
				brotation -= Math.PI; // flip by 180
			} else if (rotation - brotation > Math.PI / 2) {
				// log('flip b');
				brotation += Math.PI; // flip by 180
			}
			
			
			// log(brotation, rotation);
			
			rotation = .1 * (_drag.ratio * arotation + (1 - _drag.ratio) * brotation) + .9 * rotation;
			
			hOffset += dx;
			vOffset += dy;
				
			*/
			
			_drag.x = system.event.screenX;
			_drag.y = system.event.screenY;
			
			update();
		}
	}
	
	
};

Magnet.onMouseUp = function() {
	with (this.mag) {
		_drag.clicked = false;
	}
};

Magnet.toXML = function() {
	var doc, root, settings, mag, xmlmag, i, j, p;
	doc = XMLDOM.createDocument();
	root = doc.appendChild(doc.createElement('magnets'));
	
	settings = doc.createElement('settings');
	settings.setAttribute('width', wn.width);
	settings.setAttribute('height', wn.height);
	root.appendChild(settings);
	
	for (i = 0; i < magnets.length; i++) {
		mag = magnets[i];
		magxml = null;
		if (mag instanceof WordMagnet) {
			magxml = doc.createElement('wordmagnet');
			
			for (j = 0; j < Magnet.toXML.properties.WordMagnet.length; j++) {
				p = Magnet.toXML.properties.WordMagnet[j];
				magxml.setAttribute(p, mag[p]);
			}
		}
		
		if (magxml) {
			root.appendChild(magxml);
		}
	}
	
	return doc.toXML();
};

Magnet.toXML.properties = {
	WordMagnet: ['hOffset', 'vOffset', 'rotation', 'text', 'scale', 'font', 'size']
};

Magnet.clear = function() {
	var i;
	for (i = 0; i < magnets.length; i++) {
		magnets[i].cv.removeFromSuperview();
	}
}

Magnet.fromXML = function(xml, append) {
	var doc, settings, mags, mag, node, i, j, attr;
	if (!append) {
		Magnet.clear();
	}
	
	doc = XMLDOM.parse(xml);
	// settings = doc.evaluate('magnets/settings');
	
	mags = doc.evaluate('magnets/*');
	
	for (i = 0; i < mags.length; i++) {
		node = mags.item(i);
		switch (node.nodeName) {
			case 'wordmagnet':
				mag = new WordMagnet(wn);
				for (j = 0; j < node.attributes.length; j++) {
					attr = node.attributes.item(j);
					if (Number(attr.value) == attr.value) {
						mag[attr.name] = Number(attr.value);
					} else {
						mag[attr.name] = attr.value;
					}
				}
				break;
		}
	}
	
	Magnet.refresh();
}

Magnet.refresh = function() {
	var i;
	for (i = 0; i < magnets.length; i++) {
		magnets[i].update();
	}
}


