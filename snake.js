var snake; 
var scl = 20;
var food;
var start = true;

function setup(){
    createCanvas(600, 600);
    snake = new Snake();
    frameRate(10);
    pickLocation();
}

function draw(){
    background(51);
    snake.death();
    snake.update();
    snake.show();
    
    if(snake.eat(food)){
        this.total++;
        pickLocation();
    }
    
    fill(255, 0, 10);
    rect(food.x, food.y, scl, scl);
}

function mousePressed(){
    snake.total ++; 
}

function pickLocation(){
    var cols = floor(width/scl);
    var rows = floor(height/scl);
    food = createVector(floor(random(cols)), floor(random(rows)));
    food.mult(scl);
}
function keyPressed(){
    if(keyCode == UP_ARROW && snake.speedY != 1){
        snake.dir(0, -1);
    }
    else if (keyCode == DOWN_ARROW && snake.speedY != -1){
        snake.dir(0, 1);
    }
    if(keyCode == LEFT_ARROW && snake.speedX != 1){
        snake.dir(-1, 0);
    }
    else if(keyCode == RIGHT_ARROW && snake.speedX != -1){
        snake.dir(1, 0);
    }
}

function Snake(){
    this.x = 0 ;
    this.y = 0;
    this.speedX = 1;
    this.speedY = 0;
    this.total = 0; 
    this.tail = [];
    
    this.dir = function(x, y){
        this.speedX = x;
        this.speedY = y;
    }
    
    this.eat = function(pos){
        var d = dist(this.x, this.y, pos.x, pos.y);
        if(d<1){
          this.total++;
          return true;
        }
        else
          return false;
    }
    
    
    this.update= function() {
        if(this.total === this.tail.length){
            for(var i=0; i<this.tail.length-1; i++){
                this.tail[i] = this.tail[i+1];
            }
        }

        this.tail[this.total-1] = createVector(this.x, this.y);
        
        this.x = this.x + this.speedX*scl;
        this.y = this.y + this.speedY*scl;
        
        this.x = constrain(this.x, 0, width-scl);
        this.y = constrain(this.y, 0, height-scl);
    }
    
    this.death = function(){
        for(var i =0; i<this.tail.length;i ++){
            var pos = this.tail[i];
            var d = dist(this.x, this.y, pos.x, pos.y);
            if(d <1){
                this.total = 0;
                this.tail=[];
            }
        }
        if((this.x === 0 || this.x === width) && !start){
            this.speedX = 0;
        }
        if((this.y === 0 || this.y === height) && !start){
            this.speedY = 0;
        }
    }
    
    
    this.show = function(){
        fill(255);
        for(var i=0; i<this.tail.length; i++){
             rect(this.tail[i].x, this.tail[i].y, scl, scl);
        }
        
        rect(this.x, this.y, scl, scl);
    }
    

}

