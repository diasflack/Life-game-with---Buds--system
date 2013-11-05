$(document).ready( function(){
	
	//Start game. Generation.
	var cellNumber = 1600;
	var cellSideNumber = Math.sqrt(cellNumber);
	var generation = 0;
	var timer = [];
	var budsCount = 0;
	
	var game = new Array;

	var gameNew = new Array;
	
	var aliveCount = new Array;
	
	game[cellSideNumber] = [];
	game[-1] = [];
	
	//Game filling
	
	for (x=0; x<cellSideNumber; x++) {
		$('.mainfield').append('<tr></tr>');
		game[x] = [];
		gameNew[x] = [];
		aliveCount[x] = []
		for (y=0; y<cellSideNumber; y++) {
			$('.mainfield tr').last().append('<td class="gamefield"></td>');
			game[x][y]= [];
			game[x][y] = 0;
			gameNew[x][y]=0;
			
			aliveCount[x][y] = 0;
		}
		}

	//Clicker
	
	$('.gamefield').click(function() {

		var fieldIndexX = $(this).index();
		var fieldIndexY = $(this).parent().index();
		

		if ($(this).css('background-color') == 'rgb(0, 0, 0)') {
			$(this).css('background-color', 'white');
			game[fieldIndexX][fieldIndexY] = 0;
		} else { 
			$(this).css('background-color', 'black');
			game[fieldIndexX][fieldIndexY]  = 1;
		}
	});	
	
	
	//Game engine
	
	function infinityField() {
		
		game[-1][-1] = game[cellSideNumber-1][cellSideNumber-1];
		game[-1][cellSideNumber] = game[cellSideNumber-1][0];
		
		game[cellSideNumber][-1] = game[0][cellSideNumber-1];
		game[cellSideNumber][cellSideNumber] = game[0][0];
		
		for (i=0; i<=cellSideNumber; i++) {
			
			game[-1][i] = game[cellSideNumber-1][i];
			game[cellSideNumber][i]=game[0][i];
			
			game[i][-1] = game[i][cellSideNumber-1];
			game[i][cellSideNumber]=game[i][0];
		}
				
	}
	
	
	
	function neighborCount(x,y) {
		
		var neighborNumber = game[x-1][y-1]+game[x][y-1]+game[x+1][y-1]
							+game[x-1][y]+game[x+1][y]
							+game[x-1][y+1]+game[x][y+1]+game[x+1][y+1];
							
		if ((game[x][y] == 0) && (neighborNumber == 3)) {
			gameNew[x][y] = 1;
		} else if ((game[x][y] == 1) && ((neighborNumber > 3) || (neighborNumber<2))) {
			gameNew[x][y] = 0;
		} else if ((game[x][y] == 1) && ((neighborNumber == 3) || (neighborNumber == 2))) {
			gameNew[x][y] = 1;
		}

	}
	
	function drawSwitch() {
		var alive = 0;
		
		for (x=0; x<cellSideNumber; x++) {
			for (y=0; y<cellSideNumber; y++) {
				game[x][y] = gameNew[x][y];
				
				if (game[x][y] == '1') {
					$('.mainfield tr').eq(y).children('td').eq(x).css('background-color', 'black');
					
					alive=1;
					
					aliveCount[x][y] += 1;
					
					if (aliveCount[x][y]>$('#buds').val() && $('#budCheck').prop('checked')==true){
						bud(x,y);
						aliveCount[x][y]=0;						
					}
					
				} else { 
					$('.mainfield tr').eq(y).children('td').eq(x).css('background-color', 'white');
					aliveCount[x][y] = 0;
				}
		}
		}
		if (alive == 0) {alert('System survived through - '+generation+'generations. Budded - '+budsCount+' cells'); stopGame(); generation = 0; budsCount=0;};
	}
	
	function gameMove() {
		infinityField();
	
		for (x=0; x<cellSideNumber; x++) {
			for (y=0; y<cellSideNumber; y++) {
				neighborCount(x,y);			
		}
		}
	}
	
	//BUDDER!
	function invert(x,y) {
		if (game[x][y] == 1) {
			game[x][y] = 0;
		} else game[x][y] = 1;
	}
	
	function bud(x,y) {
		var randX = Math.floor(Math.random() * (1 + 1 + 1) - 1);
		var randY = Math.floor(Math.random() * (1 + 1 + 1) - 1);
		
		budsCount ++;
		invert(x+randX,y+randY);
	}
	
	/*
		BUTTONS!
	*/
	
	function randomGame() {
		for (x=0; x<cellSideNumber; x++) {
			for (y=0; y<cellSideNumber; y++) {
				game[x][y] = Math.round(Math.random());
				if (game[x][y] == '1') {
					$('.mainfield tr').eq(y).children('td').eq(x).css('background-color', 'black');
				} else $('.mainfield tr').eq(y).children('td').eq(x).css('background-color', 'white');
		}
		}
	}
	
	//STOP!
	function stopGame() {
		$.each(timer, function (_, id) {
				clearTimeout(id);
				});
					timer = [];
				
	}
	
	
	
	//GO-GO-GO!!!
	$('#go').click(function(event){
	
		var repeat = $('#repeat').val();
		
			for (var i=0; i<repeat; i++){
					
					timer.push(setTimeout(gameMove,0));
					timer.push(setTimeout(drawSwitch, 0));
					timer.push(setTimeout(function() {generation ++; $('#generation').text(generation);}, 0));
				}
		
		$('#stop').click(function(){
			stopGame();
				});	
	});
	
	
	//NonStop
	$('#nonstop').click(function(){

					timer.push(setInterval(gameMove,100));
					timer.push(setInterval(drawSwitch, 100));
					timer.push(setInterval(function() {generation ++; $('#generation').text(generation);}, 100));
		
		$('#stop').click(function(){
			stopGame()
				});	
	});
	
	//Random
	$('#random').click(function(){
		generation = 0;
		budsCount = 0;
		randomGame();
	});
});