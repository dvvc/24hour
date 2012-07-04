var Binary = function () {

	/* Constants */
	var WIDTH = 1024, HEIGHT = 640;
	var PLANET_RADIUS = 100;
	var BLOCK_WIDTH = 4;
	var MOUSE_THRESHOLD = 40;
	var MAX_LEVELS = 8;

	/* Globals */
	var ctx;
	var canvasTop, canvasLeft;
	var mouseX, mouseY, mouseAngle, mouseColumn, mouseLevel;
	var planetCirc;
	var mouseInThreshold;
	var planetColor = 'black';
	var nColumns, columnAngle;
	var planetX = 200, planetY = 200;
	
	/**
	* The columns array determines what is there in the planet at a certain point. Columns are counted starting from theta = 0 rad
	* (or x=RADIUS, y=0), and advance *counterclockwise*. There are as many columns as PLANET_CIRC / BLOCK_WIDTH. Therefore we can
	* calculate the current column by dividing the angle between nColumns.
	* The contents of the array are arrays themselves, with an entry for each level above the ground. The contents of each element in
	* the second array tell what type of construction is there: 0 -> Nothing, 1 -> tower
	*/
	var columns;

	/************************** Classes ******************************/
	var Point = function(x, y) {
		this.x = x;
		this.y = y;
	}
	
	Point.prototype.distance = function(p) {
		return (Math.sqrt(Math.pow(p.x-this.x, 2) + Math.pow(p.y-this.y,2)));
	}
	
	/************************** Functions *****************************/
	var updateMousePosition = function(evt) {
	
		var distToPlanet;
		
		mouseX = evt.clientX - canvasLeft;
		mouseY = evt.clientY - canvasTop;
		
		// find if the mouse is in the corona at MOUSE_THRESHOLD distance of the circumference
		distToPlanet = new Point(mouseX, mouseY).distance(new Point(planetX,planetY));
		mouseInThreshold = (distToPlanet > (PLANET_RADIUS - MOUSE_THRESHOLD)) && (distToPlanet < (PLANET_RADIUS + MOUSE_THRESHOLD));
		
		// if the mouse is in the threshold, calculate the column
		if (mouseInThreshold) {
			mouseAngle = (Math.atan2(mouseY-planetY, mouseX-planetX) + Math.PI*2) % (Math.PI*2);
			mouseColumn = ((parseInt(mouseAngle / columnAngle) *columnAngle) * nColumns) / (Math.PI * 2);
			// hack to avoid rounding errors like 24.9999999
			mouseColumn = parseInt(mouseColumn + 0.5);
			mouseLevel = 0;
			while (mouseLevel < MAX_LEVELS && columns[mouseColumn][mouseLevel] != 0 ) {
				mouseLevel++;
			}
			
			// change this at some point
			if (mouseLevel >= MAX_LEVELS) {
				mouseLevel = 0;
			}
		}
	};

	var handleMouseClick = function(evt) {
	
		if (mouseInThreshold) {
			columns[mouseColumn][mouseLevel] = 1;
			
		}
		else {
			alert("not in threshold");
		}
	
	};
	
	var start = function() {
		ctx = document.getElementById("canvas").getContext("2d");
		canvasTop = $("canvas").offset().top;
		canvasLeft = $("canvas").offset().left;

		$("canvas").mousemove(updateMousePosition);
		$("canvas").click(handleMouseClick);
		
		planetCirc = 2 * Math.PI * PLANET_RADIUS;
			
		nColumns = parseInt(planetCirc / BLOCK_WIDTH);
		columns = Array(nColumns);
		for (var i = 0; i < nColumns; i++) {
			var stack = Array(MAX_LEVELS);
			for (var j = 0; j < MAX_LEVELS; j++) {
				stack[j] = 0;
			}
			columns[i] = stack;
		}
			
		columnAngle = Math.PI * 2 / nColumns;
		mouseInThreshold = false;

		// start the main loop
		mainLoop();
	};

	var update = function() {

		// find the column
		if (mouseInThreshold) {
			planetColor = 'red';
			
		}
		else {
			planetColor = 'black';
		}

	};

	var drawBlock = function(column, level, color) {
		ctx.save()
		ctx.fillStyle = color;
		var x = ((PLANET_RADIUS + (level * BLOCK_WIDTH))* Math.cos(column*columnAngle));
		var y = ((PLANET_RADIUS + (level * BLOCK_WIDTH)) * Math.sin(column*columnAngle));
		ctx.translate(planetX+x, planetY+y);
		ctx.rotate(column*columnAngle);
		ctx.fillRect(0, 0, BLOCK_WIDTH, BLOCK_WIDTH);
		ctx.restore()
	}
	
	var draw = function() {
		
		ctx.clearRect(0, 0, WIDTH, HEIGHT);
		
		ctx.beginPath();
		ctx.arc(planetX, planetY, PLANET_RADIUS, 0, Math.PI * 2);
		ctx.stroke();
		
		// draw the columns
		for (var i = 0; i < nColumns; i++) {
			for (var j=0; j < MAX_LEVELS; j++) {
				if (columns[i][j] == 1) {
					drawBlock(i,j, 'black');
				}
			}
		}
		
		// draw mouse position
		if (mouseInThreshold) {
			drawBlock(mouseColumn, mouseLevel, 'green');
		}
		
		//ctx.save();
		//ctx.fillStyle = planetColor;
		//ctx.fill();
		//ctx.restore();
		
		
	};

	var mainLoop = function() {
	
		var startLoop, loopTime;
		
		startLoop = new Date().getTime();
		update();
		draw();
		loopTime = new Date().getTime() - startLoop;
		ctx.fillText(parseInt((1000/loopTime)) + " FPS", WIDTH - 80, HEIGHT - 20);
		ctx.fillText("Angle: " + mouseAngle, WIDTH - 80, HEIGHT - 40);
		setTimeout(mainLoop, 33);
	
	};

	return {
		start: start
	};
};


$(Binary().start);