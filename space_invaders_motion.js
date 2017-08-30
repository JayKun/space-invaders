var aliens;
var ship;
var shipImage, bulletImage, particleImage;
var MARGIN = 40;
var score = 0;
var level = 0;
var start = 0;
var health = 100;
var startTime;
var endTime;
var serial;
var latestData;

// AI variables
var aiEn = false;
var min = 0;
var max = 800;

function setup() {
startTime = new Date().getTime();
createCanvas(800,600);

bulletImage = loadImage("assets/asteroids_bullet.png");
shipImage = loadImage("assets/asteroids_ship0001.png");
particleImage = loadImage("assets/asteroids_particle.png");

// Create Ship
ship = createSprite(width/2, height-15);
ship.maxSpeed = 6;
ship.friction = .98;
ship.setCollider("circle", 0,0, 20);
ship.rotation -= 90;

// Add ship image
ship.addImage("normal", shipImage);
ship.addAnimation("thrust", "assets/asteroids_ship0002.png", "assets/asteroids_ship0007.png");

// Instantiate aliens
aliens = new Group();
bullets = new Group();
alienBullets = new Group();

// Create Aliens
for(var i =1; i<7; i++) {
  for(var j=1; j<5; j++){
       var px = i/8*(width);
       var py = j/8*(height);
       createAlien(3, px, py);
  }
  }

//Initialize Serial Port
serial = new p5.SerialPort();
serial.list();
serial.open('COM5');
serial.on('data',gotData);
}

function draw() {
    
  background(0);
  
  fill(255);
  
  textAlign(CENTER);

  if(!start){
      background(65, 0, 180);
      textSize(30);
      text("MOVE IT", width/2 , height/2 - 100);
      text("Press ENTER to start", width/2, height/2);
      text("Press TAB when in game for AI player", width/2, height/2 + 40);
  }
  else{
   if(aliens.length===0 || health <= 0){
       
       time = (end-startTime)/1000;
       text("GAME OVER", width/2, height/2);
       text("Time: "+ time + "s", width/2, height/2.5);
       ship.addSpeed(100, ship.rotation);
       ship.changeAnimation("thrust");
       drawSprites();
       
       if(ship.position.y < 10)
       {
          
           final_score = floor(1000/time +10*score+ 20*health);
           text("GAME OVER", width/2, height/2);
           text("Final Score: "+final_score, width/2, height/2+50);
       }
   }
   else{
  text("Score: "+ score, width-50, height-10);
  text("Health: " + health, width-50, height-20);
  for(var i=0; i<aliens.length; i++) {
      var s = aliens[i];
      if(s.position.x > s.initialPosX + 80 ) s.setSpeed(-2.5, 0);
      if(s.position.x < s.initialPosX - 80 ) s.setSpeed(2.5, 0);
      var n = floor(random(0,300));
      if(n==1){
          alienShoot(s);
      }
  }
  
  ai();

  aliens.overlap(bullets, aliensHit);
  ship.overlap(alienBullets, shipHit);
  ship.bounce(aliens);
  
  if(latestData>12 && latestData<70)
    ship.position.x -= 4;
  if(latestData<-12 && latestData>-70)
    ship.position.x += 4;
  else
    ship.changeAnimation("normal");
    
  if(keyWentDown("x")){
    shipShoot();
  }
 
  end = new Date().getTime();
  if(!aiEn)
    ship.position.x = constrain(ship.position.x, 10, 790);
  drawSprites();
   }
  }
}

function keyPressed() {
  if (keyCode === TAB) {
    if(aiEn === true)
      aiEn = false;
    else
      aiEn = true;
  }
  if(keyCode === ENTER)
    start = true;
}


function createAlien(type, x, y) {
  var a = createSprite(x, y);
  var img  = loadImage("assets/invader.png");
  a.addImage(img);
  a.setSpeed(2.5, 0);
  //a.rotationSpeed = .5;
  //a.debug = true;
  a.initialPosX = x;
  a.initialPosY = y;
  a.type = type;
  
  if(type == 2)
    a.scale = .6;
  if(type == 1)
    a.scale = .3;
  
  a.mass = 2+a.scale;
  a.setCollider("circle", 0, 0, 50);
  aliens.add(a);
  return a;
}

function aliensHit(alien, bullet) {
var newType = alien.type-1;

if(newType>0) {
  createAlien(newType, alien.position.x, alien.position.y);
  createAlien(newType, alien.position.x, alien.position.y);
  }

for(var i=0; i<10; i++) {
  var p = createSprite(bullet.position.x, bullet.position.y);
  p.addImage(particleImage);
  p.setSpeed(random(300,500), random(360));
  p.friction = .9;
  p.life = 30;
  }
score += 10;
bullet.remove();
alien.remove();
}

function shipShoot(){
    var bullet = createSprite(ship.position.x, ship.position.y);
    bullet.addImage(bulletImage);
    bullet.setSpeed(10+ship.getSpeed(), ship.rotation);
    bullet.life = 100;
    bullets.add(bullet);
}

function alienShoot(alien){
    var bullet = createSprite(alien.position.x, alien.position.y);
    bullet.addImage(bulletImage);
    bullet.setSpeed(8+alien.getSpeed(), 90);
    bullet.life = 50;
    alienBullets.add(bullet);
}

function shipHit(ship, alienBullet){
 for(var i=0; i<10; i++) {
  var p = createSprite(alienBullet.position.x, alienBullet.position.y);
  p.addImage(particleImage);
  p.setSpeed(random(300,500), random(360));
  p.friction = 0.95;
  p.life = 15;
  health --;
  }
}

function ai(){
      // AI code
  if(aiEn){

    for(var i=0; i<alienBullets.length; i++){
      if(dist(alienBullets[i].position.x, alienBullets[i].position.y, ship.position.x, ship.position.y)< 120){
        if(alienBullets[i].position.x > ship.position.x)
          ship.position.x -= 5;

        if(alienBullets[i].position.x < ship.position.x)
          ship.position.x += 5;
      }
     
    }
   max = 0;
   min = 800;
    for(var i=0; i<aliens.length; i++){
        if(aliens[i].position.x < min)
          min = aliens[i].position.x;
        if(aliens[i].position.x > max)
          max = aliens[i].position.x;
    }
    
    ship.position.x = constrain(ship.position.x, min, max);
    var nn = floor(random(0,100));
        if(nn<=3){
          shipShoot();
        }
  }
}

function serverConnected() {
  console.log("1.Connected to Server");
}

function gotList(thelist) {
	console.log("List of Serial Ports:");
  // theList is an array of their names
  for (var i = 0; i < thelist.length; i++) {
    // Display in the console
    console.log(i + " " + thelist[i]);
  }
}


function gotData(){
var currentString=serial.readLine();
      trim(currentString);                    // remove any trailing whitespace
  if (!currentString) return;             // if the string is empty, do no more
  //console.log(currentString);             // println the string
  latestData = currentString;
}
