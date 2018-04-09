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
	Game.xy2Box = document.getElementById("xy2Box")
	Game.xy2ctx = Game.xy2Box.getContext("2d");
	Game.sclBox = document.getElementById("sclBox")
	Game.sclctx = Game.sclBox.getContext("2d");
	toggle_visibility('xy2Box');
	toggle_visibility('xy2Label');
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
		if(Game.fuzz)
			Toggle.tool('fuzz');
		if(Game.crush)
			Toggle.tool('crush');
		if(Game.mosaic)
			Toggle.tool('mosaic');
		if(Game.color)
			Toggle.tool('color');
		if(Game.points)
			Toggle.tool('points');
		Value.setDefaults();
		document.getElementById('step').value = Game.step;
		document.getElementById('rings').value = Game.td;
		document.getElementById('redValue').value = Game.r;
		document.getElementById('greenValue').value = Game.g;
		document.getElementById('blueValue').value = Game.b;
		Select.resolution('640');
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
		Game.xy2ctx.clearRect(0, 0, Game.xy2Box.width, Game.xy2Box.height);
		Game.xy2ctx.drawImage(Game.cursor, (Game.x_2/Game.canvas.width) * 156 - 8, (Game.y_2/Game.canvas.height) * 156 - 8);
		Game.rBox.style.background = 'linear-gradient(to bottom right, rgb('+Game.r+',0,0), rgb('+(Game.r-156)+',0,0))';
		Game.rctx.clearRect(0, 0, Game.rBox.width, Game.rBox.height);
		Game.rctx.drawImage(Game.cursor, Game.r2 - 8, Game.r3*156 - 8);
		Game.gBox.style.background = 'linear-gradient(to bottom right, rgb(0,'+Game.g+',0), rgb(0,'+(Game.g-156)+',0))';
		Game.gctx.clearRect(0, 0, Game.gBox.width, Game.gBox.height);
		Game.gctx.drawImage(Game.cursor, Game.g2 - 8, Game.g3*156 - 8);
		Game.bBox.style.background = 'linear-gradient(to bottom right, rgb(0,0,'+Game.b+'), rgb(0,0,'+(Game.b-156)+'))';
		Game.bctx.clearRect(0, 0, Game.bBox.width, Game.bBox.height);
		Game.bctx.drawImage(Game.cursor, Game.b2 - 8, Game.b3*156 - 8);
		Game.sclctx.clearRect(0, 0, Game.sclBox.width, Game.sclBox.height);
		Game.sclctx.drawImage(Game.cursor, (Game.xscl/5) * 156 - 8, (Game.yscl/5) * 156 - 8);
		if(Game.fuzz) {
			document.getElementById('pausePlay').classList.remove('button');
			document.getElementById('pausePlay').classList.add('disabled');
		} else if(Game.crush || Game.mosaic || Game.color || Game.points) {
			document.getElementById('pausePlay').classList.remove('disabled');
			document.getElementById('pausePlay').classList.add('button');
		}
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
		Game.r = 127.5; //From 0 to 255
		Game.g = 127.5; //From 0 to 255
		Game.b = 127.5; //From 0 to 255
		Game.r2 = 78; //From 0 to 156
		Game.r3 = .5; //From 0 to 1
		Game.g2 = 78; //From 0 to 156
		Game.g3 = .5; //From 0 to 1
		Game.b2 = 78; //From 0 to 156
		Game.b3 = .5; //From 0 to 1
		Game.x_mainscale = 1;
		Game.y_mainscale = 1;
		Game.xscl = 2.5 * Game.x_mainscale; //From 0 to 5
		Game.yscl = 2.5 * Game.y_mainscale; //From 0 to 5
		Game.toggleScale = true;
		State.check('scale');
		State.check('640');
		this.setFun('sin');
		this.setMode('spiral');
		return;
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
				}
				break;
		}
		return;
	},

	setFun: function(fun) {
		try {
			document.getElementById(Game.function).style.backgroundColor = '#FFFEB3';
		} catch (e) {
			if(e instanceof TypeError) {}
		}
		Game.function = fun;
		document.getElementById(fun).style.backgroundColor = '#6FCB9F';
		try {
			State.update();
		} catch (e) {
			if(e instanceof TypeError) {}
		}
		return;
	},

	generateNew: function() {
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
		if(Math.random() <= .05)
			Toggle.tool('fuzz');
		if(Math.random() <= .05)
			Toggle.tool('crush');
		if(Math.random() <= .05)
			Toggle.tool('mosaic');
		if(Math.random() <= .05)
			Toggle.tool('color');
		if(Math.random() <= .05) {
			Toggle.tool('points');
			Game.x_2 = Math.getRandomInt(0,Game.canvas.width);
			Game.y_2 = Math.getRandomInt(0,Game.canvas.height);
		}
		switch(Math.getRandomInt(0,8)) {
			case 0:
				this.setFun('sin');
				break;
			case 1:
				this.setFun('cos');
				break;
			case 2:
				this.setFun('tan');
				break;
			case 3:
				this.setFun('sqrt');
				break;
			case 4:
				this.setFun('log');
				break;
			case 5:
				this.setFun('exsec');
				break;
			case 6:
				this.setFun('sincos');
				break;
			case 7: 
				this.setFun('cool_1');
				break;
			case 8:
				this.setFun('cool_2');
				break;
		}
		document.getElementById('step').value = Game.step;
		document.getElementById('rings').value = Game.td;
		document.getElementById('redValue').value = Game.r;
		document.getElementById('greenValue').value = Game.g;
		document.getElementById('blueValue').value = Game.b;
		return;
	},

	random: function() {
		this.generateNew();
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
		Game.x_mainscale = x/Game.canvas.width;
		Game.y_mainscale = y/Game.canvas.height;
		Game.canvas.width = x;
		Game.canvas.height = y;
		if(Game.toggleScale) {
			Game.x = Game.x*Game.x_mainscale;
			Game.y = Game.y*Game.y_mainscale;
			if(Game.points) {
				Game.x_2 = Game.x_2*Game.x_mainscale;
				Game.y_2 = Game.y_2*Game.y_mainscale;
			}
		}
		document.getElementById("wrapper").setAttribute("class",cls_1);
		document.getElementById("toolbarWrapper").setAttribute("class",cls_1);
		document.getElementById("mainContent").setAttribute("class",cls_1);
		document.getElementById("gameBorder").setAttribute("class",cls_2);
		document.getElementById("gameWrapper").setAttribute("class",cls_3);
		Game.canvas.setAttribute("class",cls_3);
		console.log("get");
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

			case 'xy2Box':
				Game.x_2 = Math.round((Game.mouseCoords.x/156) * Game.canvas.width, 1000);
				Game.y_2 = Math.round((Game.mouseCoords.y/156) * Game.canvas.height, 1000);
				Game.xy2ctx.clearRect(0, 0, document.getElementById('xy2Box').width, document.getElementById('xy2Box').height);
				Game.xy2ctx.drawImage(Game.cursor, Game.mouseCoords.x - 8, Game.mouseCoords.y - 8);
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
		x_2off = Game.x_2;
		y_2off = Game.y_2;

		// walk left-to-right, top-to-bottom; it's the
		// same as the ordering in the imagedata array:
		for (y = 0; y <Game.canvas.height; y++) {
			for (x = 0; x <Game.canvas.width; x++) {
				// calculate sine based on distance
				if(Game.toggleScale) {
					td = Game.td;
				}

				if(Game.crush) {
					td = (Game.td + globalCount) / 100;
				}

				a = x - xoff;
				b = y - yoff;
				m = Game.xscl*a;
				n = Game.yscl*b;
				d = Math.sqrt(m*m + n*n);
				q = Math.getRandomInt(d,d**2);
				r = Game.r;
				g = Game.g;
				b = Game.b;
				r2 = Game.r2;
				g2 = Game.g2;
				b2 = Game.b2;
				r3 = Game.r3;
				g3 = Game.g3;
				b3 = Game.b3;
				globalCount = Game.globalCount;
				distance = d;

				if(Game.points) {
					a_2 = x - x_2off;
					b_2 = y - y_2off;
					m_2 = Game.xscl*a_2;
					n_2 = Game.yscl*b_2;
					d_2 = Math.sqrt(m_2*m_2 + n_2*n_2);
					davg = (d+d_2)/2 - Math.sqrt(d+d_2);
					d_mid = Math.sqrt(((m+m_2)/2)**2 + ((n+n_2)/2)**2);
					d_3 = d_mid - davg/(td*3);
					d_min = Math.min(d,d_2,davg);
					d_4 = d_3-(d_min/3);
					distance = d_4;
					q = Math.getRandomInt(distance,distance**2);
				}

				if(Game.mosaic) {
					distance = distance*Math.sin(d**2 + globalCount);
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

				r = r - r3*(distance+t*(r2));
				g = g - g3*(distance+t*(g2));
				b = b - b3*(distance+t*(b2));

				if(Game.fuzz) {
					r -= (q * (r3 / Game.td*r3) + r**r3)/td;
		 			g -= (q * (g3 / Game.td*g3) + g**g3)/td;
		 			b -= (q * (b3 / Game.td*b3) + b**b3)/td;
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
					document.getElementById('tool_fuzz').style.backgroundColor = '#6FCB9F';
					State.update();
				}
				else {
					Game.fuzz = false;
					State.docSet_innerHTML('tool_fuzz', "Fuzz");
					document.getElementById('tool_fuzz').style.backgroundColor = '#FFFEB3';
					State.update();
				}
				break;
			case 'crush':
				if(!Game.crush) {
					Game.crush = true;
					State.docSet_innerHTML('tool_crush', "Uncrush");
					document.getElementById('tool_crush').style.backgroundColor = '#6FCB9F';
					State.update();
				}
				else {
					Game.crush = false;
					State.docSet_innerHTML('tool_crush', "Crush");
					document.getElementById('tool_crush').style.backgroundColor = '#FFFEB3';
					State.update();
				}
				break;
			case 'mosaic':
				if(!Game.mosaic) {
					Game.mosaic = true;
					State.docSet_innerHTML('tool_mosaic', "Demosaic");
					document.getElementById('tool_mosaic').style.backgroundColor = '#6FCB9F';
					State.update();
				}
				else {
					Game.mosaic = false;
					State.docSet_innerHTML('tool_mosaic', "Mosaic");
					document.getElementById('tool_mosaic').style.backgroundColor = '#FFFEB3';
					State.update();
				}
				break;
			case 'color':
				if(!Game.color) {
					Game.color = true;
					State.docSet_innerHTML('tool_color', "RGB");
					document.getElementById('tool_color').style.backgroundColor = '#6FCB9F';
					State.update();
				}
				else {
					Game.color = false;
					State.docSet_innerHTML('tool_color', "GrayScale");
					document.getElementById('tool_color').style.backgroundColor = '#FFFEB3';
					State.update();
				}
				break;
			case 'points':
				if(!Game.points) {
					Game.points = true;
					State.docSet_innerHTML('tool_points', "One Point");
					document.getElementById('tool_points').style.backgroundColor = '#6FCB9F';
					toggle_visibility('xy2Box');
					toggle_visibility('xy2Label');
					Game.x_2 = Game.canvas.width/2;
					Game.y_2 = Game.canvas.height/2;
					State.update();
				}
				else {
					Game.points = false;
					State.docSet_innerHTML('tool_points', "Two Points");
					document.getElementById('tool_points').style.backgroundColor = '#FFFEB3';
					toggle_visibility('xy2Box');
					toggle_visibility('xy2Label');
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

function toggle_visibility(id) {
  var e = document.getElementById(id);
  if(e.style.display == 'none')
    e.style.display = 'inline-block';
  else
    e.style.display = 'none';
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

window.onwheel = function(event) {
	try {
		if(isDescendant('sideBarRight',event.srcElement)) {
			document.getElementById("sideBarRight").style.top = event.deltaY;
		}		
	} catch (e) {
		if(e instanceof TypeError) {}
	}
}