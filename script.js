var canvasWidth = 900;
var canvasHeight = 600;
var blockSize = 30;
var delay = 75;
var context;
var snake;
var apple;
var appleColor = "#3c3";
var snakeColor = "#f00";
var canvasWidthInBlocks = canvasWidth/blockSize;
var canvasHeightInBlocks = canvasHeight/blockSize;

window.onload = function (){

    init();

    function init(){

        canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "1px solid";
        this.document.body.appendChild(canvas);
        context = canvas.getContext('2d');
        snake = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4],[1,4]]);
        apple = new Apple([10,10]);
        refreshCanvas();
    }

    function refreshCanvas(){

        snake.forward();

        if(snake.checkCollision()){
            console.log('Game over');
            gameOver();
        }else{

            if(this.snake.isEatingApple(apple.position)){
                this.apple.setNewPosition();
                this.snake.ateApple = true;
            }
            context.clearRect(0,0,canvas.width,canvas.height);
            apple.draw();
            snake.draw();
            setTimeout(refreshCanvas,delay);
        }
        
    }

    function drawBlock(context, position){
        var x = position[0]*blockSize;
        var y = position[1]*blockSize;
        context.fillRect(x,y,blockSize,blockSize);
    }

    function gameOver(){
        context.save();
        context.fillText("Game Over", (canvasWidth/2)-40,canvasHeight/2);
        context.fillText("Appuyer sur la touche espace pour recommencer la partie.", (canvasWidth/2)-80,(canvasHeight/2)+20);
        context.restore();
    }
    
    function restart(){
            snake = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4],[1,4]]);
            apple = new Apple([10,10]);
            refreshCanvas();
    }

    function Snake(body){
        this.body = body;
        this.direction = "right";
        this.ateApple = false;
        this.draw = function(){

            context.save();
            context.fillStyle = snakeColor;
            for(var i = 0; i < this.body.length;i++){
                drawBlock(context, this.body[i]);
            }
            context.restore();
        };

        this.forward = function(){
            var newHeadPosition = this.body[0].slice();
            switch (this.direction){

                case "up":
                    newHeadPosition[1] -= 1
                    break;
                case "down":
                    newHeadPosition[1] += 1
                    break;
                case "left":
                    newHeadPosition[0] -= 1
                     break;
                case "right":
                    newHeadPosition[0] += 1
                    break;
            }
            this.body.unshift(newHeadPosition);

            if(!this.ateApple){
                this.body.pop();
            }else{
                this.ateApple = false;
            }
            
        };

        this.setDirection = function(newDirection){
            var allowedDirections;

            switch (this.direction){

                case "up":
                    allowedDirections = ["left","right"];
                    break;
                case "down":
                    allowedDirections = ["left","right"];
                    break;
                case "left":
                    allowedDirections = ["up","down"];
                     break;
                case "right":
                    allowedDirections = ["up","down"];
                    break;
                default:
                    throw("Desired direction is invalid.")
            }

            if(allowedDirections.indexOf(newDirection) > -1){
                this.direction = newDirection;
            }
        };

        this.checkCollision = function (){
            var wallCollision = false;
            var snakeCollision = false;
            var snakeHead = this.body[0];
            var snakeBody = this.body.slice(1);
            var snakeX = snakeHead[0];
            var snakeY = snakeHead[1];
            var snakeBodyPart_x;
            var snakeBodyPart_y;

            if(snakeX > canvasWidthInBlocks || snakeX < 0 || snakeY > canvasHeightInBlocks || snakeY < 0){
                wallCollision = true;
            }


            for(var i = 0; i < snakeBody.length; i++){
                snakeBodyPart_x = snakeBody[i][0];
                snakeBodyPart_y = snakeBody[i][1];

                if(snakeX === snakeBodyPart_x && snakeY === snakeBodyPart_y){
                    snakeCollision = true;
                    break;
                }
            }

            return snakeCollision || wallCollision;
        };

        this.isEatingApple = function(applePosition){
            var snakeHead = this.body[0];
            var isEating = false;

            if(snakeHead[0] === applePosition[0] && snakeHead[1] === applePosition[1]){
                isEating = true;
            }

            return isEating;
        };
        
        

    }
    
}


function Apple(position){
    this.position = position;
    this.draw = function (){
        context.save();
        context.fillStyle = appleColor;
        context.beginPath();
        var radius = blockSize/2;
        var x = this.position[0]*blockSize+radius;
        var y = this.position[1]*blockSize+radius;
        context.arc(x,y,radius,0,Math.PI*2,true);
        context.fill();
        context.restore();
    };

    this.isOnSnake = function(snake, newX, newY){
        
        snake.body.forEach(element => {
            if(element[0] === newX && element[1 === newY]){
                return true;
            }
        });

        return false;

    }

    this.setNewPosition = function(){
        var newX = Math.round(Math.random() * (canvasWidthInBlocks-1));
        var newY = Math.round(Math.random() * (canvasHeightInBlocks -1));
        if(this.isOnSnake(snake,newX,newY)){
            console.log('Was overlapping');
            this.setNewPosition();
        }else{
            this.position = [newX,newY];
        }
        
    }

    
}



document.onkeydown = function handleKeyDown(e){
    var key = e.keyCode;
    var newDirection;

    switch(key){
        case 38:
            newDirection = "up";
            break;
        case 40:
            newDirection = "down";
            break;
        case 37:
            newDirection = "left";
            break;
        case 39:
            newDirection = "right";
            break;
        case 32:
            restart();
            return
    }
    snake.setDirection(newDirection);
}