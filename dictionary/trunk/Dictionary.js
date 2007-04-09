var activeRequest;

const extendDuration = 600;


/**
 * Window set up
 */


var currentWidth = 246;
var currentHeight = 244;

var extenderFrame = new Frame();
extenderFrame.opacity = 0;
mainWindow.appendChild(extenderFrame);
var extenderBG = new KImage({src: 'Resources/ExtenderBG*.png', colorize:'#000', height: 44, opacity:122, mask: 'Resources/SearchBarBG<.png', maskHeight:44}, extenderFrame);
var extender = new KImage({src: 'Resources/Extender*.png', height: 44, mask: 'Resources/SearchBarBG<.png', maskHeight:44}, extenderFrame);

extenderContentsFrame = new Frame();
extenderFrame.appendChild(extenderContentsFrame);
resultsBox = new JHTML({hOffset: 16, vOffset: 33, width: currentWidth - 32 - 20, height: 195}, extenderContentsFrame);
resultsBox.vScrollBar = new ScrollBar();
resultsBox.vScrollBar.hOffset = currentWidth - 34;
resultsBox.vScrollBar.vOffset = 44;
resultsBox.vScrollBar.height = 180;
resultsBox.vScrollBar.opacity = 127;
extenderContentsFrame.appendChild(resultsBox.vScrollBar);

var searchBarBG = new KImage({src: 'Resources/SearchBarBG<.png', colorize:'#000', opacity:122}, mainWindow);

var searchBar = new KImage({src: 'Resources/SearchBar<.png'}, mainWindow);

var throbber = new Throbber({size: 15, hOffset: currentWidth - 31, vOffset: 12, inactiveColor: 'rgba(0,0,0,0)'}, mainWindow);

var cancelButton = new Image();
cancelButton.hOffset = currentWidth - 31;
cancelButton.vOffset = 12;
cancelButton.src = 'Resources/CancelButton.png';
cancelButton.opacity = 127;
cancelButton.onMouseEnter = function() { this.opacity = 255; };
cancelButton.onMouseExit = function() { this.opacity = 127; };
cancelButton.onMouseUp = cancelAll;
cancelButton.visible = false;
mainWindow.appendChild(cancelButton);

var searchBarIcon = new Image();
searchBarIcon.hOffset = 61;
searchBarIcon.vOffset = 11;
searchBarIcon.src = 'Resources/MagnifyIcon.png';
mainWindow.appendChild(searchBarIcon);


var searchBarGlow = new KImage({src: 'Resources/SearchBarGlow<.png', visible: false}, mainWindow);


var searchBarInput = new TextArea();
searchBarInput.style.fontFamily = "'Lucida Grande', 'Lucida Sans', 'Lucida Sans Unicode', sans-serif";
searchBarInput.style.fontSize = '12px';
searchBarInput.style.color = '#999';
searchBarInput.data = 'Dictionary';
searchBarInput.hOffset = 74;
searchBarInput.vOffset = 12;
searchBarInput.width = 138;
searchBarInput.lines = 1;
searchBarInput.spellcheck = false;

searchBarInput.onGainFocus = function() {
	searchBarGlow.visible = true;
	if (this.style.color == '#999') {
		this.data = '';
		this.style.color = '#000';
	}
}

searchBarInput.onLoseFocus = function() {
	searchBarGlow.visible = false;
	if (!this.data) {
		this.data = 'Dictionary';
		this.style.color = '#999';
	}
}

searchBarInput.onKeyPress = function() {
	switch (system.event.keyString) {
		case 'Return':
		case 'Enter':
			activeRequest = lookup(this.data, 'wordsc');
			break;
		case 'Tab':
			this.rejectKeyPress();
			break;
		case 'Escape':
			cancelAll();
			break;
		default:
			break;
	}
}

mainWindow.appendChild(searchBarInput);



function hideExtender() {
	var fadeAnm = new KFadeAnimation(extenderContentsFrame, 0, extendDuration, animator.kEaseInOut, function() {
		var hideAnms = [
			new KResizeAnimation(extenderBG, currentWidth, 44, extendDuration, animator.kEaseInOut),
			new KResizeAnimation(extender, currentWidth, 44, extendDuration, animator.kEaseInOut),
			new KFadeAnimation(extenderFrame, 0, extendDuration, animator.kEaseIn, function() {
				mainWindow.height = 44;
			})
		];
		animator.start(hideAnms);
	});
	animator.start(fadeAnm);
}

function showExtender() {
	mainWindow.height = 244;
	var showAnms = [
		new KFadeAnimation(extenderFrame, 255, extendDuration, animator.kEaseOut),
		new KResizeAnimation(extenderBG, currentWidth, 244, extendDuration, animator.kEaseInOut),
		new KResizeAnimation(extender, currentWidth, 244, extendDuration, animator.kEaseInOut, function() {
			var fadeAnm = new KFadeAnimation(extenderContentsFrame, 255, extendDuration, animator.kEaseNone);
			animator.start(fadeAnm);
		})
	];
	animator.start(showAnms);
}




function cancelAll() {
	throbber.stop();
	cancelButton.visible = false;
	// shrink extender...
	hideExtender();
	
	// cancel ajax request
	if (activeRequest) {
		activeRequest.abort();
	}
	
	searchBarInput.data = '';
	searchBarInput.loseFocus();
}



/*
widget.onKeyDown = function() {
	log("keyDown - keyString: " + system.event.keyString + ", keyCode: " + system.event.keyCode + ", charCode: " + system.event.charCode);
}

widget.onKeyUp = function() {
	log("keyUp - keyString: " + system.event.keyString + ", keyCode: " + system.event.keyCode + ", charCode: " + system.event.charCode);
}

widget.onKeyPress = function() {
	log("keyPress - keyString: " + system.event.keyString + ", keyCode: " + system.event.keyCode + ", charCode: " + system.event.charCode);
	switch (system.event.keyString) {
		case 'Escape':
			cancelAll();
			break;
	}
}
var keyCodes = {
	enter:  13,
	escape: 27,
	tab:     9
}
*/



function lookup(word, source) {
	var source = sources[source];
	var url = source.getURL(word);
	
	var request = new XMLHttpRequest();
	
	if (activeRequest) {
		activeRequest.abort();
	}
	
	// Additional properties for the XMLHttpRequest object
	request.url = url;
	request.target = resultsBox;
	request.source = source;
	
	request.open('GET', url, true);
	request.onreadystatechange = function() {
		if (this.readyState == 4) {
			pdump(this);
			switch (this.status) {
				case 200:
					try {
						this.target.data = this.source.parse(this.responseText);
						this.target.url = this.url;
					} catch (e) {
						if (e instanceof DictionaryParseError) {
							log('Parse error');
							pdump(e);
						} else if (e instanceof DictionaryWordNotFoundError) {
							this.target.data = '<h1>' + word + '</h1><p>Sorry, but the word ' + word + ' was not found.</p>';
						} else {
							log('Unexpected error');
							pdump(e);
						}
					}
					break;
				default:
					this.target.data = this.status + ' ' + this.statusText;
					break;
			}
			
			// turn off throbber, turn on cancel button, reset scrollbar
			throbber.stop();
			cancelButton.visible = true;
			resultsBox.vScrollBar.value = 0;
		}
	}
	request.send();
	// turn on throbber, turn off cancel button, show results
	showExtender();
	cancelButton.visible = false;
	throbber.start();
	
	return request;
}


function updatePreferences()
{
	extenderBG.opacity = searchBarBG.opacity = preferences.bgOpacity.value;
	extenderBG.colorize = searchBarBG.colorize = preferences.bgColor.value;
}

widget.onPreferencesChanged = updatePreferences;

updatePreferences();





/**
 * Dictionary-specific Error objects
 */

function DictionaryParseError(message) {
	this.message = message;
}

function DictionaryWordNotFoundError(message) {
	this.message = message;
}



/**
 * Plug-in system for parsing urls
 */
sources = {};

log('empty sources created');

include('wordsc.js');


