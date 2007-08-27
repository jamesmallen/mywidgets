
WordMagnet.Inherits(Magnet);

function WordMagnet(wn, word) {
	this.Inherits(Magnet, wn);
	word = word ? word : '';
	this.text = word;
}

apply(WordMagnet.prototype, {
	font: '"Times New Roman"',
	text: '',
	size: '14px', // only supports size in px
	padding: [4, 8, 4, 8],
	
	// internal vars
	_textImg: null, // Image object for the text
	
	
	
	update: function(force) {
		with (this) {
			force = _updateText() || force;
			_draw(_recenter(force) || force);
		}
	},
	
	
	
	
	// internal methods
	_draw: function(force) {
		with (this) {
			_draw.rotation = _draw.rotation || 0/0;
			
			if (force || _draw.rotation != rotation) {
				// log('drawing');
				
				// clear
				$.globalCompositeOperation = 'destination-in';
				$.fillRect(-1, -1, .1, .1);
				$.fillRect(0, 0, .1, .1);
				$.globalCompositeOperation = 'source-over';
				
				
				// scoot the shadow down
				$.save();
				$.rotate(-rotation);
				$.translate(0, 1);
				$.rotate(rotation);
				rectangleShadow($, -width / 2, -height / 2, width, height, 5);
				$.restore();
				
				$.fillStyle = '#fff';
				$.fillRect(-width / 2, -height / 2, width, height);
				$.drawImage(_textImg, -width / 2 + padding[3], -height / 2 + padding[0], _textImg.srcWidth / scale, _textImg.srcHeight / scale);
				
				_draw.rotation = rotation;
			}
		}
	},
	
	_scaleSize: function() {
		with (this) {
			return (parseInt(size) * scale) + 'px';
		}
	},
	
	
	_updateText: function(force) {
		var tmp;
		with (this) {
			_updateText.text = _updateText.text || '';
			_updateText.font = _updateText.font || '';
			_updateText.size = _updateText.size || 0/0;
			
			if (force || _updateText.text != text || _updateText.font != font || _updateText.size != _scaleSize()) {
				_textImg = WordMagnet.doCache(this);
				
				width = _textImg.srcWidth / scale + padding[1] + padding[3];
				height = _textImg.srcHeight / scale + padding[0] + padding[2];
				// update local cache vars
				_updateText.text = text;
				_updateText.font = font;
				_updateText.size = _scaleSize();
				
				return true;
			} else {
				return false;
			}
			
		}
	}
	
	
	
	
	
});


WordMagnet.cache = {};

WordMagnet.doCache = function(wmgnt) {
	var tmp, filename, ptr;
	if (!WordMagnet.cache[wmgnt._scaleSize()]) {
		WordMagnet.cache[wmgnt._scaleSize()] = {};
	}
	ptr = WordMagnet.cache[wmgnt._scaleSize()];
	
	if (!ptr[wmgnt.font]) {
		ptr[wmgnt.font] = {};
	}
	ptr = ptr[wmgnt.font];
	
	if (!ptr[wmgnt.text]) {
		tmp = new Text();
		wmgnt._updateText.text = tmp.data = wmgnt.text;
		wmgnt._updateText.font = tmp.style.fontFamily = wmgnt.font;
		wmgnt._updateText.size = tmp.style.fontSize = wmgnt._scaleSize();
		
		do {
			filename = system.widgetDataFolder + '/tmp/' + randString(8) + '.png';
		} while (filesystem.itemExists(filename));
		
		ptr[wmgnt.text] = toImage(tmp, filename);
	}
	
	return ptr[wmgnt.text];
};

WordMagnet.cleanup = function(size, font, text) {
	try {
		var tmp = WordMagnet.cache[size][font][text], file = tmp.src;
		tmp.src = null;
		filesystem.remove(file);
		delete WordMagnet.cache[size][font][text];
	} catch (e) {
		log('Error removing item from WordMagnet.cache');
	}
};



