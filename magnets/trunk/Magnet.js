magnets = [];
magnets.dirty = false;

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
	magnets.dirty = true;
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
				magnets.dirty = true;
				
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
	var p, dst;
	with (this.mag) {
		_drag.clicked = true;
		_drag.initC = { x: hOffset, y: vOffset };
		_drag.initP = { x: system.event.screenX - hOffset, y: system.event.screenY - vOffset };
		_drag.initX = _drag.x = system.event.screenX;
		_drag.initY = _drag.y = system.event.screenY;
		_drag.initTheta = Math.atan2(_drag.y - vOffset, _drag.x - hOffset);
		_drag.initRotation = rotation;
		if (Math.sqrt(_drag.initP.x*_drag.initP.x + _drag.initP.y*_drag.initP.y) < width / 4) {
			_drag.stab = true;
			_drag.translate = true;
		} else {
			_drag.stab = false;
			_drag.translate = false;
		}
		
		cv.orderAbove();
	}
};

Magnet.onMouseDrag = function() {
	var p, pProj, r, theta, bRotation;
	
	with (this.mag) {
		if (_drag.clicked) {
			p = { x: system.event.screenX - hOffset, y: system.event.screenY - vOffset };
			
			r = Math.sqrt(p.x*p.x + p.y*p.y);
			theta = Math.atan2(p.y, p.x);
			
			pProj = { x: r * Math.cos(rotation - theta), y: r * Math.sin(rotation - theta) };
			
			if (_drag.stab) {
				theta -= Math.PI;

				brotation = Math.atan2(system.event.screenY - _drag.y, system.event.screenX - _drag.x);
				
				
				
				// get to correct side of PI
				if (rotation - brotation > Math.PI) {
					brotation += 2 * Math.PI;
				} else if (brotation - rotation > Math.PI) {
					brotation -= 2 * Math.PI;
				}
				
				// get to nearest 180
				if (brotation - rotation > Math.PI / 2) {
					brotation -= Math.PI;
				} else if (rotation - brotation > Math.PI / 2) {
					brotation += Math.PI;
				}
				
				// get to nearest 90
				if (brotation - rotation > Math.PI / 4) {
					brotation -= Math.PI / 2;
				} else if (rotation - brotation > Math.PI / 4) {
					brotation += Math.PI / 2;
				}
				
				
				if (rotation - theta > Math.PI) {
					theta += Math.PI;
				} else if (theta - rotation > Math.PI) {
					theta -= Math.PI;
				}
				
				rotation = .1 * brotation + .9 * rotation;
			} else {
				if ((Math.abs(pProj.x) > width / 2 || Math.abs(pProj.y) > height / 2) && !_drag.translate) {
					_drag.initP = p;
					_drag.translate = true;
				}
				
				rotation = theta - _drag.initTheta + _drag.initRotation;
			}
			
			if (_drag.translate) {
				hOffset += p.x - _drag.initP.x;
				vOffset += p.y - _drag.initP.y;
			}
			
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
	
	Magnet.sort();
	
	doc = XMLDOM.createDocument();
	root = doc.appendChild(doc.createElement('magnets'));
	
	settings = doc.createElement('settings');
	settings.setAttribute('width', magFrame.width);
	settings.setAttribute('height', magFrame.height);
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
	var doc, settings, mags, mag, node, i, j, attr, noChanges;
	if (!append) {
		Magnet.clear();
	}
	
	doc = XMLDOM.parse(xml);
	settings = doc.evaluate('magnets/settings');
	
	if (settings.length == 1) {
		settings = settings.item(0);
		pdump(settings);
		noChanges = (settings.getAttribute('width') == magFrame.width && settings.getAttribute('height') == magFrame.height);
		log(settings.getAttribute('foo'));
		log('foo');
	}
	mags = doc.evaluate('magnets/*');
	
	for (i = 0; i < mags.length; i++) {
		node = mags.item(i);
		switch (node.nodeName) {
			case 'wordmagnet':
				mag = new WordMagnet(magFrame);
				for (j = 0; j < node.attributes.length; j++) {
					attr = node.attributes.item(j);
					switch (attr.name) {
						case 'hOffset':
							if (!noChanges && attr.value > magFrame.width) {
								mag.hOffset = magFrame.width;
							} else {
								mag.hOffset = Number(attr.value);
							}
							break;
						case 'vOffset':
							if (!noChanges && attr.value > magFrame.height) {
								mag.vOffset = magFrame.height;
							} else {
								mag.vOffset = Number(attr.value);
							}
							break;
						
						default:
							if (Number(attr.value) == attr.value) {
								mag[attr.name] = Number(attr.value);
							} else {
								mag[attr.name] = attr.value;
							}
							break;
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


Magnet.sort = function() {
	var newMagnets = [];
	for (i = magFrame.firstChild; i != null; i = i.nextSibling) {
		if (i.mag) {
			newMagnets.push(i.mag);
		} else {
			log('found a non-magnet:');
			pdump(i);
		}
	}
	magnets = newMagnets;
}


