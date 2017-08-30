var aliens;
var ship;
var shipImage, bulletImage, particleImage;
var MARGIN = 40;
var score = 0;
var level = 0;
var start = 1;
var health = 20;
var startTime;
var endTime;
var serial;
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
var portlist = serial.list();
serial.on('list', gotList);
}

function draw() {
    
  background(0);
  
  fill(255);
  
  textAlign(CENTER);
//   if(score < 0){
//       text("GAME OVER", width/2, height/2);
//       text("Score: 0", width/2, height/2+50);
//   }

   if(aliens.length===0 || health <= 0){
       
       time = (end-startTime)/1000;
       text("GAME OVER", width/2, height/2);
       text("Time: "+ time + "s", width/2, height/2.5);
       ship.addSpeed(100, ship.rotation);
       ship.changeAnimation("thrust");
       drawSprites();
       start = 0; 
       
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
  
  aliens.overlap(bullets, aliensHit);
  ship.overlap(alienBullets, shipHit);
  ship.bounce(aliens);
  
  if(keyDown(LEFT_ARROW))
    ship.position.x -= 4;
  if(keyDown(RIGHT_ARROW))
    ship.position.x += 4;
//   if(keyDown(UP_ARROW))
//     {
//     ship.addSpeed(.2, ship.rotation);
//     ship.changeAnimation("thrust");
//     }
  else
    ship.changeAnimation("normal");
    
  if(keyWentDown("x")){
    var bullet = createSprite(ship.position.x, ship.position.y);
    bullet.addImage(bulletImage);
    bullet.setSpeed(10+ship.getSpeed(), ship.rotation);
    bullet.life = 100;
    bullets.add(bullet);
    }
 
      
  end = new Date().getTime();
  ship.position.x = constrain(ship.position.x, 10, 790);
  drawSprites();
   }
  
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

function alienShoot(alien){
    var bullet = createSprite(alien.position.x, alien.position.y);
    bullet.addImage(bulletImage);
    bullet.setSpeed(10+alien.getSpeed(), 90);
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

function gotList(thelist) {
	log("List of Serial Ports:");

	if (portSelect) {
		portSelect.remove();	
	}
 	portSelect = createSelect();	
	portSelect.parent(portDiv);

	for (var i = 0; i < thelist.length; i++) {
		log(i + " " + thelist[i]);
		portSelect.option(thelist[i]);
	}
}
