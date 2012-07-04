var Binary = function () {

	/* Constants */
	var WIDTH = 1024, HEIGHT = 640;
	var PLANET_RADIUS = 200;
	var BLOCK_WIDTH = 6;
	var MOUSE_THRESHOLD = 

	/* Globals */
	var ctx;
	var canvasTop, canvasLeft;
	var mouseX, mouseY;
	var planetCirc;

	var updateMousePosition = function(evt) {
		mouseX = evt.clientX - canvasLeft;
		mouseY = evt.clientY - canvasTop;
	};

	var start = function() {
		ctx = document.getElementById("canvas").getContext("2d");
		canvasTop = $("canvas").offset().top;
		canvasLeft = $("canvas").offset().left;

		$("canvas").mousemove(updateMousePosition);

		ctx.beginPath();
		ctx.arc(200, 200, PLANET_RADIUS, 0, Math.PI * 2);
		ctx.stroke();

		planetCirc = 2 * Math.PI * PLANET_RADIUS;
		alert("there are " + (planetCirc / BLOCK_WIDTH)  + " columns");

		// start the main loop
		mainLoop();
	};

	var update = function() {

		// find the column

	};

	var draw = function() {
		
		ctx.clearRect(0, 0, WIDTH, HEIGHT);
		ctx.fillRect(mouseX, mouseY, 4, 4);

		
	};

	var mainLoop = function() {
	
		update();
		draw();
		setTimeout(mainLoop, 33);
	
	};

	return {
		start: start
	};
};


$(Binary().start);