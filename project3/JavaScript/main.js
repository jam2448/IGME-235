// We will use `strict mode`, which helps us by having the browser catch many common JS mistakes
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
"use strict";
let app = new PIXI.Application({
    width: 600,
    height: 600,
});

window.onload = function()
{
    document.body.appendChild(app.view);
    document.querySelector("canvas").onselectstart = function () {return false; };

}



// constants
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;	

// pre-load the images (this code works with PIXI v6)
app.loader.
    add([
        "Images/betterBG.jpg",
        "Images/playerShip.png",
        "Images/enemyShip.png",
        "Images/cannonBall.png",
        "Images/explosions.png",
        "Images/heart.png"
    ]);
app.loader.onProgress.add(e => { console.log(`progress=${e.progress}`) });
app.loader.onComplete.add(setup);
app.loader.load();


// aliases
let stage;

// game variables
let startScene;
let gameScene,ship,scoreLabel,lifeLabel,shootSound,hitSound,healthSound,fireballSound;
let gameOverScene;
let controlsScene;
let background;

let powerUps = [];
let enemies = [];
let bullets = [];
let aliens = [];
let explosions = [];
let explosionTextures;
let score = 0;
let life = 100;
let levelNum = 1;
let paused = true;
let keys = {};
let angle;
let mousePositionX;
let mousePositionY;
let elapsedTime = 0;
let powerupSpawnInterval = 8;
let lastPowerUpSpawn = 0;




function setup() {
	stage = app.stage;

	// #1 - Create the `start` scene
    startScene = new PIXI.Container();
    stage.addChild(startScene);
	
	// #2 - Create the main `game` scene and make it invisible
    gameScene = new PIXI.Container();
    gameScene.visible = false;
    stage.addChild(gameScene);

	// #3 - Create the `gameOver` scene and make it invisible
    gameOverScene = new PIXI.Container();
    gameOverScene.visible = false;
    stage.addChild(gameOverScene);

    //create a controls screen and make it invisible
    controlsScene = new PIXI.Container();
    controlsScene.visible = false;
    stage.addChild(controlsScene);

	
	// #4 - Create labels for all 4 scenes
    createLabelsAndButtons();
	
	// #5 - Create ship
    ship = new Ship();
    gameScene.addChild(ship);
	
	// #6 - Load Sounds
    // #6 - Load Sounds
    shootSound = new Howl({
        src: ['sounds/laserShoot.wav']
    });

    hitSound = new Howl({
        src: ['sounds/hitHurt.wav']
    });

    fireballSound = new Howl({
        src: ['sounds/explosion.wav']
    });

    healthSound = new Howl({
        src: ['sounds/jump.wav']
    });
	
    // #7 - Load sprite sheet
    explosionTextures = loadSpriteSheet();
		
    // #8 - Start update loop
    app.ticker.add(gameLoop);
	
	// #9 - Start listening for click events on the canvas
    app.view.onclick = fireBullet;
	
	// Now our `startScene` is visible
	// Clicking the button calls startGame()
}

function createLabelsAndButtons()
{
    let buttonStyle = new PIXI.TextStyle({
        fill: 0xFF0000,
        fontSize: 48,
        fontFamily: "Varela Round"


    });

    ///set up start scene and make label
    //Setting up the background to be behind everything 
    startScene.addChild(new PIXI.Sprite(app.loader.resources["Images/betterBG.jpg"].texture));

    let startlabel1 = new PIXI.Text(" Welcome To\n SHIPWRECK");
    startlabel1.style = new PIXI.TextStyle({
        fill: 0xF7F9F9,
        fontSize: 60,
        fontFamily: "Varela Round",
        stroke: 0x0D00A4,
        strokeThickness: 10
    });

    startlabel1.x = 100;
    startlabel1.y = 20;
    startScene.addChild(startlabel1);

    let startLabel2 = new PIXI.Text("SHOOT SHIPS AND BLOW THEM UP\n             ....OR DIE TRYING");
    startLabel2.style = new PIXI.TextStyle({
        fill: 0xF7F9F9,
        fontSize: 30,
        fontFamily: "Varela Round",
        stroke: 0x0D00A4,
        strokeThickness: 6
    });

    startLabel2.x = 35;
    startLabel2.y = 275;
    startScene.addChild(startLabel2);

    //start game button
    let startGameButton = new PIXI.Text("START");
    startGameButton.x = 200;
    startGameButton.y = sceneHeight - 100;
    startGameButton.interactive = true;
    startGameButton.buttonMode = true;
    startGameButton.on("pointerup", gameControls);
    startGameButton.on("pointerover", e => e.target.alpha = 0.7);
    startGameButton.on("pointerout", e => e.currentTarget.alpha = 1.0);
    startGameButton.style = new PIXI.TextStyle({
        fill: 0x0D00A4,
        fontSize: 55,
        fontFamily: "Varela Round",
        stroke: 0xF7F9F9,
        strokeThickness: 10
    });
    startScene.addChild(startGameButton);


    //making the text for the controls screen
    controlsScene.addChild(new PIXI.Sprite(app.loader.resources["Images/betterBG.jpg"].texture));

    //adding a heart sprite and mputting it in place
    let heartImage  = new PIXI.Sprite(app.loader.resources["Images/heart.png"].texture);
    heartImage.scale.set(0.15);
    heartImage.anchor.set(0.5);
    heartImage.x = 200;
    heartImage.y = 335;
    controlsScene.addChild(heartImage);

    let wasdText = new PIXI.Text("Use WASD To Move");
    wasdText.style = new PIXI.TextStyle({
        fill: 0xF7F9F9,
        fontSize: 40,
        fontFamily: "Varela Round",
        stroke: 0x0D00A4,
        strokeThickness: 6
    });

    wasdText.x = 100;
    wasdText.y = 100;
    controlsScene.addChild(wasdText);

    let mouseText = new PIXI.Text("       Move the mouse to aim.   \n Click (Left Mouse) to fire bullets.");
    mouseText.style = new PIXI.TextStyle({
        fill: 0xF7F9F9,
        fontSize: 30,
        fontFamily: "Varela Round",
        stroke: 0x0D00A4,
        strokeThickness: 6
    });
    mouseText.x = 80;
    mouseText.y = 175;
    controlsScene.addChild(mouseText);

    let heartText = new PIXI.Text(
    "                              Collect hearts\n"+
    "                               to stay alive!");
    heartText.style = new PIXI.TextStyle({
        fill: 0xF7F9F9,
        fontSize: 30,
        fontFamily: "Varela Round",
        stroke: 0x0D00A4,
        strokeThickness: 6
    })

    heartText.x = 50;
    heartText.y = 300;
    controlsScene.addChild(heartText);



    let playButton = new PIXI.Text("PLAY");
    playButton.x = 225;
    playButton.y = sceneHeight - 100;
    playButton.interactive = true;
    playButton.buttonMode = true;
    playButton.on("pointerup", startGame);
    playButton.on("pointerover", e => e.target.alpha = 0.7);
    playButton.on("pointerout", e => e.currentTarget.alpha = 1.0);
    playButton.style = new PIXI.TextStyle({
        fill: 0x0D00A4,
        fontSize: 55,
        fontFamily: "Varela Round",
        stroke: 0xF7F9F9,
        strokeThickness: 10
    });
    controlsScene.addChild(playButton);





   
    //set up gameScene 
    //putting the backround behind the gamescene
    gameScene.addChild(new PIXI.Sprite(app.loader.resources["Images/betterBG.jpg"].texture));

    let textStyle = new PIXI.TextStyle({
        fill: 0xF7F9F9,
        fontSize: 25,
        fontFamily: "Varela Round",
        stroke: 0x0D00A4,
        strokeThickness: 4

    });

    //make score label
    scoreLabel = new PIXI.Text();
    scoreLabel.style = textStyle;
    scoreLabel.x = 5;
    scoreLabel.y = 5;
    gameScene.addChild(scoreLabel);

    //make life label
    lifeLabel = new PIXI.Text();
    lifeLabel.style = textStyle;
    lifeLabel.x = 5;
    lifeLabel.y = 40;
    gameScene.addChild(lifeLabel);
    decreaseLifeBy(0);

   
    // 3 - set up `gameOverScene`
    // 3A - make game over text
    //Putting the background behind the game over scene
    gameOverScene.addChild(new PIXI.Sprite(app.loader.resources["Images/betterBG.jpg"].texture));

    let gameOverText = new PIXI.Text("Looks Like Your Ship \n       has sailed!");
    textStyle = new PIXI.TextStyle({
        fill: 0xF7F9F9,
        fontSize: 40,
        fontFamily: "Varela Round",
        stroke: 0x0D00A4,
        strokeThickness: 7
    });

    gameOverText.style = textStyle;
    gameOverText.x = 120;
    gameOverText.y = 120;
    gameOverScene.addChild(gameOverText);

    // 3B - make "play again?" button
    let playAgainButton = new PIXI.Text("Try Again");
    playAgainButton.style = buttonStyle;
    playAgainButton.x = 185;
    playAgainButton.y = 500;
    playAgainButton.interactive = true;
    playAgainButton.buttonMode = true;
    playAgainButton.on("pointerup",gameControls); // startGame is a function reference
    playAgainButton.on('pointerover',e=>e.target.alpha = 0.7); // concise arrow function with no brackets
    playAgainButton.on('pointerout',e=>e.currentTarget.alpha = 1.0); // ditto
    playAgainButton.style = new PIXI.TextStyle({
        fill: 0x0D00A4,
        fontSize: 50,
        fontFamily: "Varela Round",
        stroke: 0xF7F9F9,
        strokeThickness: 10
    });
    gameOverScene.addChild(playAgainButton);


}

function gameControls()
{
    startScene.visible = false;
    gameOverScene.visible = false;
    controlsScene.visible = true;
    gameScene.visible = false;
}


function startGame()
{
    startScene.visible = false;
    gameOverScene.visible = false;
    controlsScene.visible = false;
    gameScene.visible = true;

    levelNum = 1;
    score = 0;
    life = 100;
    increaseScoreBy(0);
    decreaseLifeBy(0);
    ship.x = 300;
    ship.y = 300;
    loadLevel();
}

function increaseScoreBy(value)
{
    score += value; 
    scoreLabel.text = `Score:  ${score}`;
}

function decreaseLifeBy(value)
{
    life -= value;
    life = parseInt(life);
    lifeLabel.text = `Health:  ${life}%`;
}

function increaseLifeBy(value){
    life += value;
    life = parseInt(life);
    lifeLabel.text = `Health: ${life}%`;
}

function gameLoop(){
	if (paused) return; 
	
	// #1 - Calculate "delta time"
    let dt = 1/app.ticker.FPS;
    if (dt > 1/12) dt=1/12;

    //counting to see how much tome has passed
    elapsedTime += dt;

    // Check if it's time to spawn a powerup
    if (elapsedTime > powerupSpawnInterval) {
        //spawn an extra life if needed
        createExtraLife(); 

        //reset the time
        elapsedTime = 0;
    }

	// #2 - Move Ship using keyboard input
    mousePositionX = app.renderer.plugins.interaction.mouse.global.x;
    mousePositionY = app.renderer.plugins.interaction.mouse.global.y;

    //keyboard event handlers
    window.addEventListener("keydown", keysDown);
    window.addEventListener("keyup", keysUp);

    //W
    if(keys["87"]){
        ship.y -= 3;
    }

    //A
    if(keys["65"])
    {
        ship.x -= 3;

    }

    //S
    if(keys["83"])
    {
        ship.y += 3;

    }

    //D
    if(keys["68"])
    {
        ship.x += 3;
    }

    //get the ship to rotate based on where the mouse is so that it can shoot
    //in any direction

    //math to make it rotate
    angle = Math.atan2(mousePositionX - ship.x, -(mousePositionY - ship.y));
    ship.rotation = angle;

    let amt = 6 * dt;


    let w2 = ship.width/2;
    let h2 = ship.height/2;

    //clamp so that the ship does not go off the screen 
    ship.x = clamp(ship.x, 0+w2, sceneWidth-w2);
    ship.y = clamp(ship.y, 0+h2, sceneWidth-h2);
	
	
	
	// #3 - Move Circles
    for(let c of enemies){
        c.move(dt);
        if(c.x <= c.radius || c.x >= sceneWidth-c.radius){
            c.reflectX();
            c.move(dt);
        }

        if(c.y <= c.radius || c.y >= sceneWidth-c.radius){
            c.reflectY();
            c.move(dt);
        }

    }
	
	
	// #4 - Move Bullets
	for (let b of bullets){
		b.move(dt);
	}

	
	// #5 - Check for Collisions
    for(let c of enemies)
    {
        for(let c of enemies){
            for(let b of bullets){

                if(BulletEnemyIntersect(c,b)){
                    fireballSound.play();
                    createExplosion(c.x,c.y,64,64);
                    gameScene.removeChild(c);
                    c.isAlive = false;
                    gameScene.removeChild(b);
                    b.isAlive = false;
                    increaseScoreBy(10);

                }

                if(b.y < -10) b.isAlive = false;
            }
        }


        if(c.isAlive && PlayerEnemyIntersect(c,ship)){
            hitSound.play();
            gameScene.removeChild(c);
            c.isAlive = false;
            decreaseLifeBy(20);
        } 
    }
	
    //do a collision check to see if the player has picked up the
    //power up or
    for( let p of powerUps)
    {
        if(p.isAlive && PlayerEnemyIntersect(p,ship)){
            healthSound.play();
            gameScene.removeChild(p);
            p.isAlive = false;
            increaseLifeBy(20);

        }
    }
	
	// #6 - Now do some clean up
    bullets = bullets.filter(b => b.isAlive);
    enemies = enemies.filter(c => c.isAlive);
    explosions = explosions.filter(e => e.isAlive);
	
    // #7 - Is game over?
    if (life <= 0){
        end(score);
        return; // return here so we skip #8 below
    }
	
	
	// #8 - Load next level
    if (enemies.length == 0){
	levelNum ++;
	loadLevel();
    }
}

function createEnemies(numEnemies)
{
    for(let i=0; i<numEnemies; i++){
        let c = new Enemy(10,0xFFFF00);
        c.x = getRandom(20, sceneWidth - 20);
        c.y = getRandom(20, sceneHeight - 20);
        c.speed = getRandom(60, 155);
        enemies.push(c);
        gameScene.addChild(c);
    }
}

//creating a powerup (extra lives for the player to pickup)
function createExtraLife() {
    //an extra life has a 30% chance of spawning  
    if(Math.random() <= 0.3)
    {
        let p = new ExtraLife();
        p.x = getRandom(40, sceneWidth - 40);
        p.y = getRandom(40, sceneHeight - 40);
        powerUps.push(p);
        gameScene.addChild(p);

    }
    
        
}

function loadLevel(){
	createEnemies(levelNum * 3);
	paused = false;
}

function end(finalScore)
{
    paused = true;

    enemies.forEach(c => gameScene.removeChild(c));
    enemies = [];

    bullets.forEach(b => gameScene.removeChild(b));
    bullets = [];

    explosions.forEach(e => gameScene.removeChild(e));
    explosions = [];

    gameOverScene.visible = true;
    gameScene.visible = false;

    // Update the game over text with the final score
    let scoreText = new PIXI.Text("Your Score: " + finalScore);
    let textStyle = new PIXI.TextStyle({
        fill: 0xF7F9F9,
        fontSize: 40,
        fontFamily: "Varela Round",
        stroke: 0x0D00A4,
        strokeThickness: 8
    });

    scoreText.style = textStyle;
    scoreText.x = 160;
    scoreText.y = 300;
    gameOverScene.addChild(scoreText);

    score = 0;

}

function fireBullet(e) {
    if (paused) return;

    // Calculate the direction vector based on the mouse position and ship position
    let directionX = mousePositionX - ship.x;
    let directionY = mousePositionY - ship.y;

    // Normalize the direction vector
    let length = Math.sqrt(Math.pow(directionX, 2) + Math.pow(directionY, 2));
    directionX /= length;
    directionY /= length;

    let b = new Bullet(0xFFFFFF, ship.x, ship.y);
    b.fwd.x = directionX;
    b.fwd.y = directionY;

    bullets.push(b);
    gameScene.addChild(b);

    //play the shooting sound
    shootSound.play();
}


function loadSpriteSheet()
{

    let spriteSheet = PIXI.BaseTexture.from("Images/explosions.png");
    let width = 64;
    let height = 64;
    let numFrames = 16;
    let textures = [];

    for (let i=0; i<numFrames; i++){
        let frame = new PIXI.Texture(spriteSheet, new PIXI.Rectangle(i*width, 64,width,height));
        textures.push(frame);
    }

    return textures;
}

function createExplosion(x,y,frameWidth, frameHeight)
{
    let w2 = frameWidth/2;
    let h2 = frameHeight/2;
    let expl = new PIXI.AnimatedSprite(explosionTextures);

    expl.x = x - w2;
    expl.y = y - h2;
    expl.animationSpeed = 1/7;
    expl.loop = false;
    expl.onComplete = e => gameScene.removeChild(expl);
    explosions.push(expl);
    gameScene.addChild(expl);
    expl.play();
}

//function for the keys to work on player movement 
function keysDown(e){
    keys[e.keyCode] = true

}

function keysUp(e){
    keys[e.keyCode] = false;

}