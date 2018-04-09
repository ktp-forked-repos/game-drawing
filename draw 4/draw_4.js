Game = {}
Pxl = {}

Math.sinh = Math.sinh || function(x) {
  	var y = Math.exp(x);
  	return (y - 1 / y) / 2;
}

Math.exsec = Math.exsec || function(x) {
  	var y = Math.cos(x);
  	return (1 - y)/ y;
}

Math.getRandomArbitrary = Math.getRandomArbitrary || function(min, max) {
	return Math.random() * (max - min) + min;
}

Math.getRandomInt = Math.getRandomInt || function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

Math.precisionRound = Math.precisionRound || function(x, precion) {
	return Math.round(x * precion)/precion;
}

window.onload = function() {
	Game.on = false;
	Game.canvas = document.getElementById("gameCanvas");
	Game.ctx = Game.canvas.getContext("2d");
	Game.rBox = document.getElementById("rBox")
	Game.rctx = Game.rBox.getContext("2d");
	Game.gBox = document.getElementById("gBox")
	Game.gctx = Game.gBox.getContext("2d");
	Game.bBox = document.getElementById("bBox")
	Game.bctx = Game.bBox.getContext("2d");
	Game.xy1Box = document.getElementById("xy1Box")
	Game.xy1ctx = Game.xy1Box.getContext("2d");
	Game.sclBox = document.getElementById("sclBox")
	Game.sclctx = Game.sclBox.getContext("2d");
	Game.mode = 'spiral';
	Game.flag = 'sp';
	Value.setDefaults();
	Game.cursor = new Image();
	Game.cursor.src = 'cursor.png';
	Game.cursor.onload = function() {
    	State.update();
	};
	Select.resolution('640');
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
	docSet_innerHTML: function(docName, value) {
		document.getElementById(docName).innerHTML = value;
		return;
	},

	//resets the page and sets saved values to starting point
	hardReset: function() {
		Game.mode = 'spiral';
		Game.flag = 'sp';
		this.reset();
		return
	},

	//sets page values to be the same as when the game first loads
	reset: function() {
		Value.setDefaults();
		this.update();
		return;
	},

	update: function() {
		Game.r = JSON.parse(document.getElementById('redValue').value);
		Game.g = JSON.parse(document.getElementById('greenValue').value);
		Game.b = JSON.parse(document.getElementById('blueValue').value);
		Game.td = JSON.parse(document.getElementById('rings').value);
		Game.step = JSON.parse(document.getElementById('step').value);
		Game.xy1ctx.clearRect(0, 0, Game.xy1Box.width, Game.xy1Box.height);
		Game.xy1ctx.drawImage(Game.cursor, (Game.x/Game.canvas.width) * 156 - 8, (Game.y/Game.canvas.height) * 156 - 8);
		Game.rctx.clearRect(0, 0, Game.rBox.width, Game.rBox.height);
		Game.rctx.drawImage(Game.cursor, Game.r2 - 8, Game.r3*156 - 8);
		Game.gctx.clearRect(0, 0, Game.gBox.width, Game.gBox.height);
		Game.gctx.drawImage(Game.cursor, Game.g2 - 8, Game.g3*156 - 8);
		Game.bctx.clearRect(0, 0, Game.bBox.width, Game.bBox.height);
		Game.bctx.drawImage(Game.cursor, Game.b2 - 8, Game.b3*156 - 8);
		Game.sclctx.clearRect(0, 0, Game.sclBox.width, Game.sclBox.height);
		Game.sclctx.drawImage(Game.cursor, (Game.xscl/5) * 156 - 8, (Game.yscl/5) * 156 - 8);
		Output.draw();
		return;
	},

	check: function(name) {
		document.getElementById(name).checked = true;
	},

	uncheck: function(name) {
    	document.getElementById(name).checked = false;
	},

	gameLoop: function() {
		if(Game.on){
			setTimeout(State.gameLoop, (1/Game.framerate) * 1000);
			Output.draw();
			Game.globalCount+=Game.step;
		}
		return;
	}
}

Value = {
	setDefaults: function() {
		Game.mouseCoords = [];
		Game.canvas.width = 640;
		Game.canvas.height = 480;
		Game.framerate = 100; //From 0 to whatever
		Game.globalCount = 0;
		Game.step = .005; //From .001 to .1
		Game.x = Game.canvas.width/2;
		Game.y = Game.canvas.height/2;
		Game.r2 = 78; //From 0 to 156
		Game.r3 = .5; //From 0 to 1
		Game.g2 = 78; //From 0 to 156
		Game.g3 = .5; //From 0 to 1
		Game.b2 = 78; //From 0 to 156
		Game.b3 = .5; //From 0 to 1
		Game.xscl = 2.5; //From 0 to 5
		Game.yscl = 2.5; //From 0 to 5
		Game.toggleScale = true;
		State.check('scale');
		State.check('640');
		Game.function = 'sin';
		Toggle.dropdown('drp_tool');
		Toggle.dropdown('drp_fun');
		Toggle.dropdown('drp_tool_1');
		Toggle.dropdown('drp_fun_1');
		Toggle.dropdown('pausePlay');
	},

	setMode: function(mode) {
		Game.mode = mode;
		switch(mode) {
			case 'spiral':
				if(Game.flag != 'sp') {
					Toggle.dropdown('drp_tool');
					Toggle.dropdown('drp_fun');
					Toggle.dropdown('drp_tool_1');
					Toggle.dropdown('drp_fun_1');
					Toggle.dropdown('pausePlay');
					Game.flag = 'sp';
					State.reset();
				}
				break;
			case 'user':
				Game.on = false;
				if(Game.flag != 'us') {
					Toggle.dropdown('drp_tool');
					Toggle.dropdown('drp_fun');
					Toggle.dropdown('drp_tool_1');
					Toggle.dropdown('drp_fun_1');
					Toggle.dropdown('pausePlay');
					Game.flag = 'us';
					State.reset();
				}
				break;
		}
		return;
	},

	setFun: function(fun) {
		Game.function = fun;
		State.update();
		return;
	},

	generateNew: function() {
		Game.fuzz = false;
		State.docSet_innerHTML('tool_fuzz', "Fuzz");
		Game.crush = false;
		State.docSet_innerHTML('tool_crush', "Crush");
		Game.mosaic = false;
		State.docSet_innerHTML('tool_mosaic', "Mosaic");
		Game.globalCount = 0;
		Game.step = Math.precisionRound(Math.getRandomArbitrary(.001,.1), 100);
		Game.td = Math.precisionRound(Math.getRandomArbitrary(1,5), 100);
		Game.x = Math.getRandomInt(0,Game.canvas.width);
		Game.y = Math.getRandomInt(0,Game.canvas.height);
		Game.r = Math.getRandomInt(0,255);
		Game.r2 = Math.getRandomInt(0,156);
		Game.r3 = Math.precisionRound(Math.random(), 1000);
		Game.g = Math.getRandomInt(0,255);
		Game.g2 = Math.getRandomInt(0,156);
		Game.g3 = Math.precisionRound(Math.random(), 1000);
		Game.b = Math.getRandomInt(0,255);
		Game.b2 = Math.getRandomInt(0,156);
		Game.b3 = Math.precisionRound(Math.random(), 1000);
		Game.xscl = Math.precisionRound(Math.getRandomArbitrary(0,5), 100);
		Game.yscl = Math.precisionRound(Math.getRandomArbitrary(0,5), 100);
		if(Math.random() <= .05) {
			Game.fuzz = true;
			State.docSet_innerHTML('tool_fuzz', "Unfuzz");
		}
		if(Math.random() <= .05) {
			Game.crush = true;
			State.docSet_innerHTML('tool_crush', "Uncrush");
		}
		if(Math.random() <= .05) {
			Game.mosaic = true;
			State.docSet_innerHTML('tool_mosaic', "Demosaic");
		}
		if(Math.random() <= .05) {
			Game.grcolor = true;
			State.docSet_innerHTML('tool_color', "RGB");
		}
		if(Math.random() <= .05) {
			Game.twoPoints = true;
			State.docSet_innerHTML('tool_points', "One Point");
		}
		switch(Math.getRandomInt(0,8)) {
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
			case 7: 
				Game.function = 'cool_1';
				break;
			case 8:
				Game.function = 'cool_2';
				break;
		}
		document.getElementById('step').value = Game.step;
		document.getElementById('rings').value = Game.td;
		document.getElementById('redValue').value = Game.r;
		document.getElementById('greenValue').value = Game.g;
		document.getElementById('blueValue').value = Game.b;
		State.update();
	}
}

Select = {
	resolution: function(res) {
		switch(res) {
			case '640':
				this.res(640,480,'res_1_width_1','res_1_width_2','res_1_width_3','disabled','button');
				break;
			case '852':
				this.res(852,480,'res_2_width_1','res_2_width_2','res_2_width_3','disabled','button');
				break;
			case '1280':
				this.res(1280,720,'res_3_width_1','res_3_width_2','res_3_width_3','button','disabled');
				if(Game.on){
					Game.on = false;
					State.docSet_innerHTML('pausePlay', "Play");
				}
				break;
			case '1920':
				this.res(1920,1080,'res_3_width_1','res_3_width_2','res_3_width_3','button','disabled');
				if(Game.on){
					Game.on = false;
					State.docSet_innerHTML('pausePlay', "Play");
				}
				break;
			case '2560':
				this.res(2560,1440,'res_3_width_1','res_3_width_2','res_3_width_3','button','disabled');
				if(Game.on){
					Game.on = false;
					State.docSet_innerHTML('pausePlay', "Play");
				}
				break;
			case '4096':
				this.res(4096,2160,'res_4_width_1','res_4_width_2','res_4_width_3','button','disabled');
				if(Game.on){
					Game.on = false;
					State.docSet_innerHTML('pausePlay', "Play");
				}
				break;
		}
		State.update();
		return;
	},

	res: function(x,y,cls_1,cls_2,cls_3,remv,add) {
		var x_mainscale = x/Game.canvas.width;
		var y_mainscale = y/Game.canvas.height;
		Game.canvas.width = x;
		Game.canvas.height = y;
		if(Game.toggleScale) {
			Game.x = Game.x*x_mainscale;
			Game.y = Game.y*y_mainscale;
		}
		document.getElementById("wrapper").setAttribute("class",cls_1);
		document.getElementById("toolbarWrapper").setAttribute("class",cls_1);
		document.getElementById("mainContent").setAttribute("class",cls_1);
		document.getElementById("gameBorder").setAttribute("class",cls_2);
		document.getElementById("gameWrapper").setAttribute("class",cls_3);
		Game.canvas.setAttribute("class",cls_3);
		document.getElementById('pausePlay').classList.remove(remv);
		document.getElementById('pausePlay').classList.add(add);
		return;
	},

	selectors: function(sel) {
		switch(sel) {
			case 'xy1Box':
				Game.x = Math.round((Game.mouseCoords.x/156) * Game.canvas.width, 1000);
				Game.y = Math.round((Game.mouseCoords.y/156) * Game.canvas.height, 1000);
				Game.xy1ctx.clearRect(0, 0, document.getElementById('xy1Box').width, document.getElementById('xy1Box').height);
				Game.xy1ctx.drawImage(Game.cursor, Game.mouseCoords.x - 8, Game.mouseCoords.y - 8);
				State.update();
				break;

			case 'rBox':
				Game.r2 = Math.precisionRound(Game.mouseCoords.x,100);
				Game.r3 = Math.precisionRound(Game.mouseCoords.y/156,100);
				Game.rctx.clearRect(0, 0, document.getElementById('rBox').width, document.getElementById('rBox').height);
				Game.rctx.drawImage(Game.cursor, Game.mouseCoords.x - 8, Game.mouseCoords.y - 8);
				State.update();
				break;

			case 'gBox':
				Game.g2 = Math.precisionRound(Game.mouseCoords.x,100);
				Game.g3 = Math.precisionRound(Game.mouseCoords.y/156,100);
				Game.gctx.clearRect(0, 0, document.getElementById('gBox').width, document.getElementById('gBox').height);
				Game.gctx.drawImage(Game.cursor, Game.mouseCoords.x - 8, Game.mouseCoords.y - 8);
				State.update();
				break;

			case 'bBox':
				Game.b2 = Math.precisionRound(Game.mouseCoords.x,100);
				Game.b3 = Math.precisionRound(Game.mouseCoords.y/156,100);
				Game.bctx.clearRect(0, 0, document.getElementById('bBox').width, document.getElementById('bBox').height);
				Game.bctx.drawImage(Game.cursor, Game.mouseCoords.x - 8, Game.mouseCoords.y - 8);
				State.update();
				break;
			case 'gameCanvas':
				if(Game.mode == 'user') {
					Game.x = Math.round(Game.mouseCoords.x/2);
					Game.y = Math.round(Game.mouseCoords.y/2);

					draw(x,y,Game.canvas.width,Game.canvas.height);
				}
				break;
			case 'sclBox':
				Game.xscl = Math.precisionRound((Game.mouseCoords.x/156) * 5,10);
				Game.yscl = Math.precisionRound((Game.mouseCoords.y/156) * 5,10);
				Game.sclctx.clearRect(0, 0, document.getElementById('sclBox').width, document.getElementById('sclBox').height);
				Game.sclctx.drawImage(Game.cursor, Math.round(Game.mouseCoords.x) - 8, Math.round(Game.mouseCoords.y) - 8);
				State.update();
				break;
			default:
				State.update();
				break;
		}
		return;
	}
}

Output = {
	//Thanks to Beej @ Beej's Bit Bucket found here: http://beej.us/blog/data/html5s-canvas-2-pixel/ for the sin function and the learns to do this :)
	draw: function() {
		switch(Game.mode) {
			case 'spiral':
				this.drawSpiral();
				break;
			case 'user':
				this.drawUser();
				break;
			default:
				return;
		}
		return;
	},

	drawSpiral: function() {
		Game.ctx.clearRect(0, 0,Game.canvas.width,Game.canvas.height);
		Game.imageData = Game.ctx.getImageData(0,0,Game.canvas.width,Game.canvas.height);
		pos = 0; // index position into imagedata array

		// offsets to "center"
		xoff = Game.x;
		yoff = Game.y;

		// walk left-to-right, top-to-bottom; it's the
		// same as the ordering in the imagedata array:
		for (y = 0; y <Game.canvas.height; y++) {
			for (x = 0; x <Game.canvas.width; x++) {
				// calculate sine based on distance
				a = x - xoff;
				b = y - yoff;
				m = Game.xscl*a;
				n = Game.yscl*b;
				distance = Math.sqrt(m*m + n*n);
				q = Math.getRandomInt(distance,distance**2);
				r = Game.r;
				g = Game.g;
				b = Game.b;
				r2 = Game.r2;
				g2 = Game.g2;
				b2 = Game.b2;
				r3 = Game.r3;
				g3 = Game.g3;
				b3 = Game.b3;
				globalCount = Game.globalCount

				if(Game.twoPoints) {

				}

				if(Game.toggleScale) {
					td = Game.td;
				}

				if(Game.crush) {
					td = (Game.td + globalCount) / 100;
				}

				if(Game.mosaic) {
					davg = davg*Math.sin(d**2 + globalCount);
				}

				switch(Game.function) {
					case 'sin':
						t = Math.sin(distance/td - globalCount * 2 * Math.PI);
						break;
					case 'cos':
						t = Math.cos(distance/td - globalCount * 2 * Math.PI);
						break;
					case 'tan':
						t = Math.tan(distance/td - globalCount * 2 * Math.PI);
						break;
					case 'sqrt':
						t = Math.sqrt(distance/td - globalCount * 2 * Math.PI);
						break;
					case 'log':
						t = Math.log(distance/td - globalCount * 2 * Math.PI);
						break;
					case 'exsec':
						t = Math.exsec(distance/td - globalCount * 2 * Math.PI);
						break;
					case 'sincos':
						t = Math.sin((Math.cos(distance/td - globalCount * 2 * Math.PI))*td);
						break;
					case 'cool_1': 
						t = Math.sin(12 * td * Math.cos(Math.tan(distance/(8 * td) - globalCount)/distance*globalCount));
						break;
					case 'cool_2':
						t = 6;
				}

				r = r - (distance*r3)+(t*r3)*(r2);
				g = g - (distance*g3)+(t*g3)*(g2);
				b = b - (distance*b3)+(t*b3)*(b2);

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
	},

	drawUser: function(x,y) {
		Game.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
		Game.imageData = Game.ctx.getImageData(0,0,Game.canvas.width,Game.canvas.height);
		w = Game.canvas.width;
		h = Game.canvas.height;
		pos = 0;
		for (y = 0; y < h; y++) {
			for (x = 0; x < w; x++) {
				// set red, green, blue, and alpha:
				Game.imageData.data[pos++] = 25;
				Game.imageData.data[pos++] = 50;
				Game.imageData.data[pos++] = 100;
				Game.imageData.data[pos++] = 255; // opaque alpha
			}
		}
		Game.ctx.putImageData(Game.imageData, 0, 0);
		return;
	}
}

Toggle = {
	scale: function() {
		if(Game.toggleScale)
			Game.toggleScale = false;
		else
			Game.toggleScale = true;
	},

	/* When the user clicks on the button, 
	toggle between hiding and showing the dropdown content */
	dropdown: function(name) {
	    document.getElementById(name).classList.toggle("show");
	},

	tool: function(tool) {
		switch(tool) {
			case 'fuzz':
				if(!Game.fuzz) {
					Game.fuzz = true;
					State.docSet_innerHTML('tool_fuzz', "Unfuzz");
					State.update();
				}
				else {
					Game.fuzz = false;
					State.docSet_innerHTML('tool_fuzz', "Fuzz");
					State.update();
				}
				break;
			case 'crush':
				if(!Game.crush) {
					Game.crush = true;
					State.docSet_innerHTML('tool_crush', "Uncrush");
					State.update();
				}
				else {
					Game.crush = false;
					State.docSet_innerHTML('tool_crush', "Crush");
					State.update();
				}
				break;
			case 'mosaic':
				if(!Game.mosaic) {
					Game.mosaic = true;
					State.docSet_innerHTML('tool_mosaic', "Demosaic");
					State.update();
				}
				else {
					Game.mosaic = false;
					State.docSet_innerHTML('tool_mosaic', "Mosaic");
					State.update();
				}
				break;
		}
		State.update();
		return;
	},

	animate: function() {
		if(!Game.on) {
			Game.on = true;
			State.docSet_innerHTML('pausePlay', "Pause");
			State.gameLoop();
		}
		else {
			Game.on = false;
			State.docSet_innerHTML('pausePlay', "Play");
			State.update();
		}
		return;
	}
}

function isDescendant(p,c) {
	while (c != null) {
		c = c.parentElement;
		if(c.id == p)
			return true;
		else
			isDescendant(p,c);
	}	
	return false;
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

window.onmousedown = function(event) {
	try {
		if (event.srcElement.classList.contains('boxSelector')) {
	  		Game.mouseDown = true;
		}
	} catch (e) {
		if(e instanceof TypeError) {}
	}
}

window.onmouseup = function(event) {
	try {
		if (event.srcElement.classList.contains('boxSelector')) {
		  		Game.mouseDown = false;
		}
	} catch (e) {
		if(e instanceof TypeError) {}
	}
}

window.onmousemove = function(event) {
	try {
		if (event.srcElement.classList.contains('boxSelector')) {
		  	Game.mouseCoords = {x:event.offsetX, y:event.offsetY};
			if(Game.mouseDown) {
				Select.selectors(event.srcElement.id);
			}
			return;
		}
	} catch (e) {
		if(e instanceof TypeError) {}
	}
}
