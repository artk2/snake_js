
var cellSize = 10;
var playing = false;
var snake;
var tailSize;
var score = 0;
var snakeColor = 'lightgray';
var foodX, foodY;

var txt = document.getElementById('txt');
var canvas = document.getElementById('canvas');
canvas.style.backgroundColor = '#000000';
var fieldWidth = Math.floor(canvas.width / cellSize);
var fieldHeight = Math.floor(canvas.height / cellSize);
var context = canvas.getContext('2d');

startNewGame();

function startNewGame(){
	snake = new Snake(5,Math.floor(fieldHeight/2));
	tailSize = 2;
	playing = true;

	paint(snake.x, snake.y, snakeColor);
	for(var i = 0; i < tailSize; i++) paint(snake.tail[i].x, snake.tail[i].y, snakeColor);
	generateFood();

	setInterval(update,80);
}

function generateFood(){
	var x = Math.floor(Math.random()*fieldWidth);
	var y = Math.floor(Math.random()*fieldHeight);
	if(x == snake.x && y == snake.y) generateFood(); 
	else {
		var col = false;
		for(var i = 0; i < tailSize; i++){
			if(x == snake.tail[i].x && y == snake.tail[i].y) col = true;
		}
		if(col) generateFood();
		else {
			foodX = x;
			foodY = y;
			paint(foodX, foodY, "red");
		}
	}
}

function update(){
	if(playing){
		if(snake.x + snake.dirX >= fieldWidth || snake.x + snake.dirX < 0 || snake.y + snake.dirY >= fieldHeight || snake.y + snake.dirY < 0){
			gameOver();
		} else {
			var col = false;
			for(var i = 0; i < tailSize - 1; i++){
				if (snake.x + snake.dirX == snake.tail[i].x && snake.y + snake.dirY == snake.tail[i].y) col = true;
			}
			if(col==true) gameOver();
			else{
				if(snake.x == foodX && snake.y == foodY){
					snake.tail.push(new Body(snake.tail[tailSize-1].x, snake.tail[tailSize-1].y));
					tailSize++;
					txt.innerHTML = 'Your score: ' + ++score;
					generateFood();
				} else  paint(snake.tail[tailSize-1].x, snake.tail[tailSize-1].y,"black");
				for(var i = tailSize - 1; i >= 0; i--){
					if(i==0){
						snake.tail[i].x = snake.x;
						snake.tail[i].y = snake.y;
					} else {
						snake.tail[i].x = snake.tail[i-1].x;
						snake.tail[i].y = snake.tail[i-1].y;
					}
				}
				snake.x += snake.dirX;
				snake.y += snake.dirY;
				snake.last = [snake.dirX, snake.dirY];

				paint(snake.x, snake.y, snakeColor);
			}
		}
	}
}

function gameOver(){
	txt.innerHTML = 'Game Over! Your Score: ' + score;
	playing = false;
}

function Snake(x,y){
	this.x = x;
	this.y = y;
	this.last = [1,0];
	this.tail = [new Body(this.x-1, this.y), new Body(this.x-2, this.y)];
	this.dirX = 1;
	this.dirY = 0;
	this.changeDir = function(x, y){
		this.dirX = x;
		this.dirY = y;
	};
}	

function Body(x,y){
	this.x = x;
	this.y = y;
}

function paint(x,y,color){
	context.beginPath();
	context.rect(x*cellSize, y*cellSize, cellSize, cellSize);
	context.fillStyle = color;
	context.fill();
}

document.addEventListener('keypress', function(event){
	// console.log(event.keyCode);
	switch(event.keyCode){
		case 119: 
			if(!(snake.last[0] == 0 && snake.last[1] == 1)){
				snake.dirX = 0;
				snake.dirY = -1; 
			}
			break;
		case 97: 
			if(!(snake.last[0] == 1 && snake.last[1] == 0)){
				snake.dirX = -1;
				snake.dirY = 0;
			}
			break;
		case 115:
			if(!(snake.last[0] == 0 && snake.last[1] == -1)){
				snake.dirX = 0;
				snake.dirY = 1;
			}
			break;
		case 100: 
			if(!(snake.last[0] == -1 && snake.last[1] == 0)){
				snake.dirX = 1;
				snake.dirY = 0;
			}
			break;
	}
});
