class Game {
  constructor() {
this.resetTitle = createElement("h2"); 
this.resetButton = createButton("");
this.leadeboardTitle = createElement("h2"); 
this.leader1 = createElement("h2"); 
this.leader2 = createElement("h2");
this.playerMoving = false;
this.leftKeyActive = false;
this.blast = false;
}
  //BP
  getState() {
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data) {
      gameState = data.val();
    });
  }
  //BP
  update(state) {
    database.ref("/").update({
      gameState: state
    });
  }

  // TA
  start() {
    player = new Player();
    playerCount = player.getCount();

    form = new Form();
    form.display();

    car1 = createSprite(width / 2 - 50, height - 100);
    car1.addImage("car1", car1_img);
    car1.scale = 0.07;
    car1.addImage("blast1",blastImg);

    car2 = createSprite(width / 2 + 100, height - 100);
    car2.addImage("car2", car2_img);
    car2.scale = 0.07;
    car2.addImage("blast1",blastImg);

    cars = [car1, car2];
    fuel = new Group();
    powerCoin = new Group();
    obstacle1grp = new Group();
    obstacle2grp = new Group();
    var obstacle1Positions = [ { 
      x: width / 2 - 150, y: height - 1300, image: obstacle1 }, 
      { x: width / 2 + 250, y: height - 1800, image: obstacle1 }, 
      { x: width / 2 - 180, y: height - 3300, image: obstacle1 }, 
      { x: width / 2 - 150, y: height - 4300, image: obstacle1 }, 
      { x: width / 2, y: height - 5300, image: obstacle1 },
       ]; 
      
      var obstacle2Positions = [ 
      { x: width / 2 + 250, y: height - 800, image: obstacle2 }, 
      { x: width / 2 - 180, y: height - 2300, image: obstacle2 }, 
      { x: width / 2, y: height - 2800, image: obstacle2 }, 
      { x: width / 2 + 180, y: height - 3300, image: obstacle2 }, 
      { x: width / 2 + 250, y: height - 3800, image: obstacle2 }, 
      { x: width / 2 + 250, y: height - 4800, image: obstacle2 }, 
      { x: width / 2 - 180, y: height - 5500, image: obstacle2 } 
       ];
      this.addSprites( obstacle1grp, obstacle1Positions.length, obstacle1, 0.04, obstacle1Positions );
      this.addSprites( obstacle2grp, obstacle2Positions.length, obstacle2, 0.04, obstacle2Positions );

    this.addSprites(fuel, 4, fuelImg, 0.02); 
  // Adding coin sprite in the game 
 this.addSprites(powerCoin, 18, powercoinImg, 0.09);
  }

handleObstacleCollision(index) {
if(cars[index-1].collide(obstacle1grp)||cars[index-1].collide(obstacle2grp)){ 
if (this.leftKeyActive) { 
player.positionX += 100; 
} 
else { 
player.positionX -= 100; 
} 
if(player.life>0){ 
player.life-=185/4; 
} 
player.update(); 
    } 
     }


addSprites(spriteGroup, numberOfSprites, spriteImage, scale) { 
for (var i = 0; i < numberOfSprites; i++) { 
var x, y; 
x = random(width / 2 + 150, width / 2 - 150);
y = random(-height * 4.5, height - 400); 
var sprite = createSprite(x, y); 
sprite.addImage("sprite", spriteImage); 
sprite.scale = scale; 
spriteGroup.add(sprite); 
 } 
  }

  //BP
  handleElements() {
    form.hide();
    form.titleImg.position(40, 50);
    form.titleImg.class("gameTitleAfterEffect");
    this.resetTitle.html("Reset Game"); 
    this.resetTitle.class("resetText"); 
    this.resetTitle.position(width / 2 + 200, 40); 
    this.resetButton.class("resetButton"); 
    this.resetButton.position(width / 2 + 230, 100);
    this.leadeboardTitle.html("Leaderboard"); 
    this.leadeboardTitle.class("resetText"); 
    this.leadeboardTitle.position(width / 3 - 60, 40); 
    this.leader1.class("leadersText"); 
    this.leader1.position(width / 3 - 50, 80); 
    this.leader2.class("leadersText"); 
    this.leader2.position(width / 3 - 50, 130);
  }

  handleResetButton() { 
  this.resetButton.mousePressed(() => { 
  database.ref("/").set
  ({ 
  playerCount: 0, 
  gameState: 0, 
  players: {} 
  });
  window.location.reload(); }); 
 }

  //SA
  play() {
    this.handleElements();
    this.handleResetButton();
    Player.getPlayersInfo();
    player.getCarsAtEnd();
    if (allPlayers !== undefined) {
      image(track, 0, -height * 5, width, height * 6);

      //index of the array
      this.showLeaderboard()
      this.showLife()
      this.showFuelBar()
      var index = 0;
      for (var plr in allPlayers) {
        index = index + 1;
        //use data form the database to display the cars in x and y direction
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;
        var currentLife = allPlayers[plr].life;
        if(currentLife<=0){
          cars[index-1].changeImage("blast1",blastImg);
          cars[index-1].scale = 0.3;
        }
        cars[index-1].position.x = x;
        cars[index-1].position.y = y;

        //add 1 to the index for every loop
        if(index===player.index){
        this.handleFuel(index)
        this.handlePowerCoins(index)
        this.handleObstacleCollision(index)
        if(player.life<=0){
          this.blast = true;
          this.playerMoving = false;
        }
        camera.position.x = cars[index - 1].position.x; 
        camera.position.y = cars[index - 1].position.y;
        }
      }

      // handling keyboard events
     
    }
    this.handlePlayerControls()

    const finishLine = height * 6 - 100; 
    if (player.positionY > finishLine) { 
    gameState = 2; 
    player.rank += 1; 
    Player.updateCarsAtEnd(player.rank); 
    player.update();
    this.showRank();
  }
      drawSprites();
    }
    
handlePlayerControls() { 
if(!this.blast){

if (keyIsDown(UP_ARROW)) { 
player.positionY += 10; 
player.update(); 
this.playerMoving = true;
} 
if (keyIsDown(LEFT_ARROW) && player.positionX > width / 3 - 50) { 
player.positionX -= 5; 
player.update(); 
this.leftKeyActive = true;
} 
if (keyIsDown(RIGHT_ARROW) && player.positionX < width / 2 + 300) { 
player.positionX += 5; 
player.update(); 
this.leftKeyActive = false;
}
} 
   }

handleFuel(index) { 
cars[index - 1].overlap(fuel, function(collector, collected) { 
player.fuel = 185; 
collected.remove(); 
  }); 
  if(player.fuel>0 && this.playerMoving){
    player.fuel -= 0.3;
  }

  if (player.fuel<=0){
    this.gameOver();
    gameState=2;
  }
    }

gameOver() { 
swal({ 
title: `Game Over`, 
text: "Oops you lost the race....!!!", 
imageUrl: "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png", 
imageSize: "100x100", 
confirmButtonText: "Thanks For Playing" 
  }); 
       }

handlePowerCoins(index) { 
cars[index - 1].overlap(powerCoin, function(collector, collected) { 
player.score += 21; 
player.update(); 
collected.remove(); 
  }); 
      }  

showLeaderboard() { 
var leader1, leader2; 
var players = Object.values(allPlayers); 
if ( (players[0].rank === 0 && players[1].rank === 0) || players[0].rank === 1 ) { 
// &emsp; This tag is used for displaying four spaces. 
leader1 = players[0].rank + 
"&emsp;" + 
players[0].name + 
"&emsp;" +
 players[0].score; 
 leader2 = players[1].rank + 
 "&emsp;" + 
 players[1].name + 
 "&emsp;" + 
 players[1].score; 
} 

if (players[1].rank === 1) { 
leader1 = players[1].rank + 
"&emsp;" + 
players[1].name + 
"&emsp;" + 
players[1].score; 
leader2 = players[0].rank + 
"&emsp;" + 
players[0].name + 
"&emsp;" + 
players[0].score; 
 } 
 this.leader1.html(leader1); 
 this.leader2.html(leader2); 
}   

showRank() { 
swal({ 
title: `Awesome!${"\n"}Rank${"\n"}${player.rank}`, 
text: "You reached the finish line successfully", 
imageUrl: "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png", 
imageSize: "100x100", 
confirmButtonText: "Ok" 
  });
  }

showFuelBar() { 
push();
image(fuelImg,width / 2 - 130, height - player.positionY - 100, 20, 20); 
fill("white");
rect(width / 2 - 100, height - player.positionY - 100, 185, 20); 
fill("#ffc400"); 
rect(width / 2 - 100, height - player.positionY - 100, player.fuel, 20); 
noStroke(); 
pop(); 
  }

showLife() { 
push(); 
image(lifeImage, width / 2 - 130, height - player.positionY - 300, 20, 20); 
fill("white"); 
rect(width / 2 - 100, height - player.positionY - 300, 185, 20); 
fill("#f50057"); 
rect(width / 2 - 100, height - player.positionY - 300, player.life, 20); 
noStroke(); 
pop(); 
  }

  }

