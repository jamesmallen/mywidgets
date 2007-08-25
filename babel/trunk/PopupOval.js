
/**
 * alertPopupOval(str, buttonLabel)
 * alertPopupOval(str)
 * Helper function - just pops up an alert message, without any callbacks
 */
function alertPopupOval(str1, str2, buttonLabel) {
	if (!buttonLabel) {
		buttonLabel = 'OK';
	}
	var oval = makePopupOval({
		heading: 'Babel',
		line1: str1,
		line2: str2,
		button1: buttonLabel
	}, mainWindow);
	
	PopupOval.show(oval);
	
}



/**
 * makePopupOval(params, oldWnd, wnd)
 * Helper class for popping up a popup window
 * Automatically disables the window passed in as oldWnd by using a blank image
 * on top of it
 */
makePopupOval = function(params, oldWnd, wnd) {
	if (!wnd) {
		wnd = PopupOval.defaultWindow;
	}
	
	if (oldWnd) {
		wnd.oldWnd = oldWnd;
		wnd.oldOpacity = oldWnd.opacity;
		wnd.oldWnd.opacity = wnd.oldWnd.opacity / 2;
		wnd.oldCover = new Canvas();
		wnd.oldWnd.appendChild(wnd.oldCover);
		wnd.oldCover.tracking = 'rectangle';
		wnd.oldCover.width = wnd.oldWnd.width;
		wnd.oldCover.height = wnd.oldWnd.height;
		wnd.oldCover.onMouseEnter = function() { };
		wnd.oldCover.onMouseDown = function() { log('mousedown intercepted'); };
	}
	
	wnd._close = function(button) {
		if (this.onClose) {
			this.onClose(button);
		}
		this.visible = false;
		this.onClose = null;
		this.oldWnd.opacity = this.oldOpacity;
		this.oldCover.removeFromSuperview();
		emptyFrame(this);
	};
	
	wnd.onClose = null;
	
	if (params) {
		PopupOval.populate(wnd, params);
	}
	
	return wnd;
};


PopupOval = {
	// STATIC PROPERTIES
	defaultWindow: popupWindow,
	
	populateParams: {
		heading: 1,
		line1: 1,
		line2: 1,
		button1: 1,
		button2: 1,
		onClose: 1
	},
	
	
	
	// STATIC METHODS
	/**
	 * populate(wnd, params)
	 * Fills the popup window with items specified in params.
	 * Clears any current contents of the PopupOval.
	 * Valid items include:
	 * {
	 *   heading: 'Heading Text',
	 *   line1:   'Line 1 Text',
	 *   line2:   'Line 2 Text',
	 *   button1: 'Button 1 Label',
	 *   button2: 'Button 2 Label',
	 *   
	 * }
	 */
	populate: function(wnd, params) {
		if (!params) {
			params = {};
		}
		
		emptyFrame(wnd);
		
		var tFrame = new Frame();
		tFrame.style.fontFamily = "'Lucida Grande','Lucida Sans','Lucida Sans Unicode',sans-serif";
		tFrame.style.color = '#fff';
		tFrame.style.KonShadowColor = '#000';
		tFrame.style.fontSize = '14px';
		
		for (var i in params) {
			if (typeof(PopupOval.populateParams[i]) == 'undefined') {
				tFrame[i] = params[i];
			}
		}
		
		wnd.appendChild(tFrame);
		
		// onClose handler
		if (params.onClose) {
			wnd.onClose = params.onClose;
		}
		
		// heading
		if (params.heading) {
			var heading = new Text();
			heading.hOffset = 223;
			heading.vOffset = 69;
			heading.hAlign = 'center';
			heading.style.KonShadowOffset = '0px 2px';
			heading.style.fontWeight = 'bold';
			heading.style.fontSize = '24px';
			heading.data = params.heading;
			tFrame.appendChild(heading);
		}
		
		// text lines
		if (params.line1 && params.line2) {
			var t1 = new Text();
			t1.hOffset = 223;
			t1.vOffset = 110;
			t1.hAlign = 'center';
			t1.style.KonShadowOffset = '0px 1px';
			t1.data = params.line1;
			tFrame.appendChild(t1);
		} else if (params.line1) {
			var t1 = new Text();
			t1.hOffset = 223;
			t1.vOffset = 123;
			t1.hAlign = 'center';
			t1.style.KonShadowOffset = '0px 1px';
			t1.data = params.line1;
			tFrame.appendChild(t1);
		}
		
		// buttons
		if (params.button1 && params.button2) {
			var b1 = makePopupButton({
				hOffset: 158,
				hAlign: 'center',
				vOffset: 160,
				src: 'Resources/PopupButton1.png',
				data: params.button1,
				onClick: function() { this.window._close(1); }
			}, tFrame);
			b1.label.style.fontSize = '16px';
			b1.label.style.fontWeight = 'bold';
			b1.label.style.KonShadowOffset = '0px 2px';

			var b2 = makePopupButton({
				hOffset: 288,
				hAlign: 'center',
				vOffset: 160,
				src: 'Resources/PopupButton2.png',
				data: params.button2,
				onClick: function() { this.window._close(2); }
			}, tFrame);
			b2.label.style.fontSize = '16px';
			b2.label.style.fontWeight = 'bold';
			b2.label.style.KonShadowOffset = '0px 2px';

		} else if (params.button1) {
			var b1 = makePopupButton({
				hOffset: 223,
				vOffset: 160,
				hAlign: 'center',
				src: 'Resources/PopupButton1.png',
				data: params.button1,
				onClick: function() { this.window._close(1); }
			}, tFrame);
			b1.label.style.fontSize = '16px';
			b1.label.style.fontWeight = 'bold';
			b1.label.style.KonShadowOffset = '0px 2px';
		}
		
		if (params.line2) {
			var t2 = new Text();
			t2.hOffset = 223;
			t2.vOffset = 132;
			t2.hAlign = 'center';
			t2.style.KonShadowOffset = '0px 1px';
			t2.data = params.line2;
			tFrame.appendChild(t2);
		}
		
	},
	
	
	/**
	 * show(wnd)
	 * Shows the PopupOval
	 */
	show: function(wnd) {
		wnd.hOffset = screen.availLeft + ((screen.availWidth - popupWindow.width) / 2);
		wnd.vOffset = screen.availTop + ((screen.availHeight - popupWindow.height) / 2);
		wnd.visible = true;
		wnd.level = 'topMost';
		wnd.focus();
	},
	
	/**
	 * hide(wnd)
	 * Hides it
	 */
	hide: function(wnd) {
		popupWindow.visible = false;
	},
	
}
