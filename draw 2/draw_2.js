Game = {}
Pxl = {}

Game.mouseCoords = [];

window.onload = function() {
	Game.on = false;
	Game.canvas = document.getElementById("gameCanvas");
	Game.ctx = Game.canvas.getContext("2d");
	Game.rCan = document.getElementById("rBox");
	Game.rctx = Game.rCan.getContext("2d");
	Game.gCan = document.getElementById("gBox");
	Game.gctx = Game.gCan.getContext("2d");
	Game.bCan = document.getElementById("bBox");
	Game.bctx = Game.bCan.getContext("2d");
	Game.xyCan = document.getElementById("xyBox");
	Game.xyctx = Game.xyCan.getContext("2d");
	Game.ctx.imageSmoothingEnabled = 'true';
	Game.width = Game.canvas.width;
	Game.height = Game.canvas.height;
	Game.cursor = new Image();
	Game.cursor.src = 'cursor.png';
	Game.function = 'sin';
	Game.framerate = 100;
	Game.mode = 'spiral';
	dropdownToggle('drp_tool');
	dropdownToggle('drp_fun');
	dropdownToggle('drp_tool_1');
	dropdownToggle('drp_fun_1');
	dropdownToggle('pausePlay');
	Game.flag = 'sp';

	Game.c1 = 0;
	Game.step = .005;
	Game.r2 = 1;
	Game.r3 = 1;
	Game.g2 = 1;
	Game.g3 = 1;
	Game.b2 = 1;
	Game.b3 = 1;
	Game.x = Game.width/2;
	Game.y = Game.height/2;

	generateRandomValues(Game.width, Game.height);

	State.update();
}

State = {
	//reloads the page
	reload: function() {
		location.reload();
	},

	//saves the game in the page
	saveGame: function() {
		alert("Game Saved");
		return;
	},

	//function to shorten repetitive pagestore function
	pageStore: function(foo, foo2) {
		localStorage.setItem(foo, JSON.stringify(foo2));
		return;
	},

	//returns value of requested string
	pageRetrieve: function(foo) {
		return JSON.parse(localStorage.getItem(foo));
	},

	//sets the innerHTML to value given by second argument
	docSet: function(docName, value) {
		document.getElementById(docName).innerHTML = value;
		return;
	},

	//returns the given value of the 
	docGet: function(docName, value) {
		return document.getElementById(docName).value;
	},

	//resets the page and sets saved values to starting point
	hardReset: function() {
		this.reset();
		return
	},

	//sets page values to be the same as when the game first loads
	reset: function() {
		width = Game.width;
		height = Game.height;
		Game.ctx.clearRect(0, 0, width, height);
		this.update();
		return;
	},

	update: function() {
		Game.r = JSON.parse(document.getElementById('redValue').value);
		Game.g = JSON.parse(document.getElementById('greenValue').value);
		Game.b = JSON.parse(document.getElementById('blueValue').value);
		Game.td = JSON.parse(document.getElementById('rings').value);
		draw(Game.width, Game.height);
	}
}

function generateNew() {
	generateRandomValues(Game.width, Game.height);
	State.update();
	Game.fuzz = false;
	Game.crush = false;
	Game.mosaic = false;
}

function generateRandomValues(width, height) {
	Game.c1 = 0;
	Game.step = getRandomArbitrary(.001,.1);
	Game.td = getRandomArbitrary(1,5);
	document.getElementById('rings').value = Game.td;
	Game.x = getRandomInt(0,width);
	Game.y = getRandomInt(0,height);
	Game.xyctx.clearRect(0, 0, document.getElementById('xyBox').width, document.getElementById('rBox').height);
	Game.xyctx.drawImage(Game.cursor, (Game.x/width) * 128 - 8, (Game.y/height) * 128 - 8);
	Game.r = getRandomInt(0,255);
	Game.r2 = getRandomInt(0,156);
	Game.r3 = Math.random();
	Game.rctx.clearRect(0, 0, document.getElementById('rBox').width, document.getElementById('rBox').height);
	Game.rctx.drawImage(Game.cursor, Game.r2 - 8, Game.r3*156 - 8);
	document.getElementById('redValue').value = Game.r;
	Game.g = getRandomInt(0,255);
	Game.g2 = getRandomInt(0,156);
	Game.g3 = Math.random();;
	Game.gctx.clearRect(0, 0, document.getElementById('gBox').width, document.getElementById('gBox').height);
	Game.gctx.drawImage(Game.cursor, Game.g2 - 8, Game.g3*156 - 8);
	document.getElementById('greenValue').value = Game.g;
	Game.b = getRandomInt(0,255);
	Game.b2 = getRandomInt(0,156);
	Game.b3 = Math.random();;
	Game.bctx.clearRect(0, 0, document.getElementById('bBox').width, document.getElementById('bBox').height);
	Game.bctx.drawImage(Game.cursor, Game.b2 - 8, Game.b3*156 - 8);
	document.getElementById('blueValue').value = Game.b;
	if(Math.random() <= .05) {
		Game.fuzz = true;
		State.docSet('tool_fuzz', "Unfuzz");
	}
	if(Math.random() <= .05) {
		Game.crush = true;
		State.docSet('tool_crush', "Uncrush");
	}
	if(Math.random() <= .05) {
		Game.mosaic = true;
		State.docSet('tool_mosaic', "Demosaic");
	}
	switch(getRandomInt(0,6)) {
		case 0:
		Game.function = 'sin';
			break;
		case 1:
		Game.function = 'cos';
			break;
		case 2:
		Game.function = 'tan';
			break;
		case 3:
		Game.function = 'sqrt';
			break;
		case 4:
		Game.function = 'log';
			break;
		case 5:
		Game.function = 'atan';
			break;
		case 6:
		Game.function = 'sincos';
			break;
	}
}

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function dropdownToggle(name) {
    document.getElementById(name).classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

function setMode(mode) {
	Game.mode = mode;
	switch(mode) {
		case 'spiral':
			State.reset();
			if(Game.flag != 'sp') {
				dropdownToggle('drp_tool');
				dropdownToggle('drp_fun');
				dropdownToggle('drp_tool_1');
				dropdownToggle('drp_fun_1');
				dropdownToggle('pausePlay');
				Game.flag = 'sp';
			}
			break;
		case 'user':
			State.reset();
			Game.on = false;
			if(Game.flag != 'us') {
				dropdownToggle('drp_tool');
				dropdownToggle('drp_fun');
				dropdownToggle('drp_tool_1');
				dropdownToggle('drp_fun_1');
				dropdownToggle('pausePlay');
				Game.flag = 'us';
			}
			break;
	}
}

function setFun(fun) {
	Game.function = fun;
	State.update();
	return;
}

function toggleFuzz() {
	if(!Game.fuzz) {
		Game.fuzz = true;
		State.docSet('tool_fuzz', "Unfuzz");
		State.update();
	}
	else {
		Game.fuzz = false;
		State.docSet('tool_fuzz', "Fuzz");
		State.update();
	}
	return;
}

function toggleCrush() {
	if(!Game.crush) {
		Game.crush = true;
		State.docSet('tool_crush', "Uncrush");
		State.update();
	}
	else {
		Game.crush = false;
		State.docSet('tool_crush', "Crush");
		State.update();
	}
	return;
}

function toggleMosaic() {
	if(!Game.mosaic) {
		Game.mosaic = true;
		State.docSet('tool_mosaic', "Demosaic");
		State.update();
	}
	else {
		Game.mosaic = false;
		State.docSet('tool_mosaic', "Mosaic");
		State.update();
	}
	return;
}

function toggleAnimate() {
	if(!Game.on) {
		Game.on = true;
		State.docSet('pausePlay', "Pause");
		gameLoop();
	}
	else {
		Game.on = false;
		State.docSet('pausePlay', "Play");
		State.update();
	}
	return;
}

function gameLoop() {
	if(Game.on){
		setTimeout(gameLoop, (1/Game.framerate) * 1000);
		draw(Game.width, Game.height);
		Game.c1+=Game.step;
	}
	return;
}

//Thanks to Beej @ Beej's Bit Bucket found here: http://beej.us/blog/data/html5s-canvas-2-pixel/ for the sin function and the learns to do this :)

function draw(width, height) {
	if(Game.mode == 'spiral') {
		drawSpiral(width, height);
		return;
	}
	else if(Game.mode == 'user') {
		drawUser(width, height);
		return;
	}
}

function drawSpiral(width, height) {
	Game.ctx.clearRect(0, 0, width, height);
	Game.imageData = Game.ctx.getImageData(0,0,width,height);
	pos = 0; // index position into imagedata array

	// offsets to "center"
	xoff = Game.x;
	yoff = Game.y;

	// walk left-to-right, top-to-bottom; it's the
	// same as the ordering in the imagedata array:
	for (y = 0; y < height; y++) {
		for (x = 0; x < width; x++) {
			// calculate sine based on distance
			x2 = x - xoff;
			y2 = y - yoff;
			d = Math.sqrt(x2*x2 + y2*y2);
			q = getRandomInt(d,d**2);
			r = Game.r;
			g = Game.g;
			b = Game.b;
			r2 = Game.r2;
			g2 = Game.g2;
			b2 = Game.b2;
			r3 = Game.r3;
			g3 = Game.g3;
			b3 = Game.b3;
			c1 = Game.c1
			td = Game.td;

			if(Game.crush) {
				td = (Game.td + c1) / 100;
			}

			if(Game.mosaic) {
				d = d*Math.sin(d**2 + c1);
			}

			switch(Game.function) {
				case 'sin':
					t = Math.sin(d/td - c1 * 2 * Math.PI);
					break;
				case 'cos':
					t = Math.cos(d/td - c1 * 2 * Math.PI);
					break;
				case 'tan':
					t = Math.tan(d/td - c1 * 2 * Math.PI);
					break;
				case 'sqrt':
					t = Math.sqrt(d/td - c1 * 2 * Math.PI);
					break;
				case 'log':
					t = Math.log(d/td - c1 * 2 * Math.PI);
					break;
				case 'atan':
					t = Math.atan(d/td - c1 * 2 * Math.PI);
					break;
				case 'sincos':
					t = Math.sin((Math.cos(d/td - c1 * 2 * Math.PI))*td);
					break;
			}

			r = (r + (t * r2 + (r3 * t) - d) * r3);
			g = (g + (t * g2 + (g3 * t) - d) * g3);
			b = (b + (t * b2 + (b3 * t) - d) * b3);

			if(Game.fuzz) {
				r -= (q * (r3 / Game.td*r3) + r**r3);
	 			g -= (q * (g3 / Game.td*g3) + g**g3);
	 			b -= (q * (b3 / Game.td*b3) + b**b3);
			}

			// set red, green, blue, and alpha:
			Game.imageData.data[pos++] = Math.max(0,Math.min(255, r));
			Game.imageData.data[pos++] = Math.max(0,Math.min(255, g));
			Game.imageData.data[pos++] = Math.max(0,Math.min(255, b));
			Game.imageData.data[pos++] = 255; // opaque alpha
		}
	}
	Game.ctx.putImageData(Game.imageData, 0, 0);
	return;
}

function drawUser(x,y,width, height) {
	Game.imageData = Game.ctx.getImageData(0,0,width,height);
	pos = x*width + y*2*height;
	for (y = 0; y < height; y++) {
		for (x = 0; x < width; x++) {

			// set red, green, blue, and alpha:
			Game.imageData.data[pos++] = 25;
			Game.imageData.data[pos++] = 50;
			Game.imageData.data[pos++] = 100;
			Game.imageData.data[pos++] = 255; // opaque alpha
		}
	}
	Game.ctx.putImageData(Game.imageData, 0, 0);
}

function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function isTrue(bool) {
	Game.mouseDown = bool;
}

function cnvs_getCoordinates(event) {
	Game.mouseCoords = relMouseCoords(event);
	if(Game.mouseDown) {
		updateSelectors(event.srcElement.id);
	}
}

function updateSelectors(sel) {
	switch(sel) {
		case 'xyBox':
			Game.x = (Game.mouseCoords.x/156) * Game.width;
			Game.y = (Game.mouseCoords.y/156) * Game.height;
			Game.xyctx.clearRect(0, 0, document.getElementById('xyBox').width, document.getElementById('rBox').height);
			Game.xyctx.drawImage(Game.cursor, Game.mouseCoords.x - 8, Game.mouseCoords.y - 8);
			State.update();
			break;

		case 'rBox':
			Game.r2 = Game.mouseCoords.x;
			Game.r3 = Game.mouseCoords.y/156;
			Game.rctx.clearRect(0, 0, document.getElementById('rBox').width, document.getElementById('rBox').height);
			Game.rctx.drawImage(Game.cursor, Game.mouseCoords.x - 8, Game.mouseCoords.y - 8);
			State.update();
			break;

		case 'gBox':
			Game.g2 = Game.mouseCoords.x;
			Game.g3 = Game.mouseCoords.y/156;
			Game.gctx.clearRect(0, 0, document.getElementById('gBox').width, document.getElementById('gBox').height);
			Game.gctx.drawImage(Game.cursor, Game.mouseCoords.x - 8, Game.mouseCoords.y - 8);
			State.update();
			break;

		case 'bBox':
			Game.b2 = Game.mouseCoords.x;
			Game.b3 = Game.mouseCoords.y/156;
			Game.bctx.clearRect(0, 0, document.getElementById('bBox').width, document.getElementById('bBox').height);
			Game.bctx.drawImage(Game.cursor, Game.mouseCoords.x - 8, Game.mouseCoords.y - 8);
			State.update();
			break;
		case 'gameCanvas':
			if(Game.mode == 'user') {
				console.log("gameCanvas " + Game.mouseCoords.x + ", " + Game.mouseCoords.y);
				Game.x = Game.mouseCoords.x/2;
				Game.y = Game.mouseCoords.y/2;
				draw(x,y,Game.width,Game.height);
				break;
			}
	}
}

function onClick(event) {
	Game.mouseCoords = relMouseCoords(event);
}

function relMouseCoords(event){
    return {x:event.offsetX, y:event.offsetY}; 
}

function cnvs_clearCoordinates() {
	State.docSet('xycoordinates', '(NaN,NaN)');
}