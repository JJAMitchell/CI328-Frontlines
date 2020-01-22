let game;
let phaser;
let world;

let ui;
let audio;

var playerHealth;
var enemyHealth;

var playerGrp;
var playerChild;
var enemyGrp;
var enemyChild;

var rifleDelay;
var scoutDelay;
var assualtDelay;

var rifleButton;
var scoutButton;
var assualtButton;

var enemyRifleTimer;
var enemyScoutTimer;
var enemyAssualtTimer;

var difficulty;

var easyButton;
var mediumButton;
var hardButton;

var highScore;


function main(){
	
	var config = {
		type: Phaser.AUTO,
		width: 1280,
		height: 800,
		physics: {
			default: 'arcade',
			arcade:{
				debug: false
			}
		},
		scene:{
			preload: preload,
			create: create,
			update: update
		}
	};
	phaser = new Phaser.Game(config);
}

function preload(){
	
	game = this;
	game.score = 0;
	
	//Buttons
	game.load.image('rifleButtonSpr','assets/rifleButtonSprite.png');
	game.load.image('scoutButtonSpr','assets/scoutButtonSprite.png');
	game.load.image('assualtButtonSpr','assets/assualtButtonSprite.png');
	game.load.image('easyButton','assets/easyButton.png');
	
	//Background
	game.load.image('bgimg','assets/basicBackground.png');
	game.load.image('placeholder','assets/placeholderUI.png');
	game.load.image('flower','assets/flowerSprite.png');
	game.load.image('hole','assets/holeSprite.png');
	
	//Player and enemy sprites
	game.load.image('playerRifleSpr','assets/playerRifleSprite.png');
	game.load.image('playerScoutSpr','assets/playerScoutSprite.png');
	game.load.image('playerAssualtSpr','assets/playerAssualtSprite.png');
	game.load.image('enemyRifleSpr','assets/enemyRifleSprite.png');
	game.load.image('enemyScoutSpr','assets/enemyScoutSprite.png');
	game.load.image('enemyAssualtSpr','assets/enemyAssualtSprite.png');
	
	//Audio
	
	//Glorious Morning by Waterflame https://www.newgrounds.com/audio/listen/91476
	game.load.audio('theme','assets/audio/mainTheme.mp3');
	//Gunshot sound by tcawte https://freesound.org/people/tcawte/sounds/147901/
	game.load.audio('gunshot','assets/audio/gunshot.mp3');
	//Marching sound by WebbFilmsUK https://freesound.org/people/WebbFilmsUK/sounds/200321/
	game.load.audio('marching','assets/audio/marchingSound.wav');
}

function create(){
	
	world = new World(game);
	ui = new UI();
	audio = new Audio();
	
	var pointer = game.input.activePointer;	
	
	//Sets difficulty Buttons
	easyButton = game.add.text(phaser.config.width/2,phaser.config.height/2 - 150,'Easy',{
		font:'50px Arial',
		fill:'#fff'
	}).setInteractive().setOrigin(0.5,0.5);
	mediumButton = game.add.text(phaser.config.width/2,phaser.config.height/2 - 50,'Medium',{
		font:'50px Arial',
		fill:'#fff'
	}).setInteractive().setOrigin(0.5,0.5);
	hardButton = game.add.text(phaser.config.width/2,phaser.config.height/2 + 50,'Hard',{
		font:'50px Arial',
		fill:'#fff'
	}).setInteractive().setOrigin(0.5,0.5);
	
	//Sets unit buttons
	rifleButton = game.add.image(0,phaser.config.height,'rifleButtonSpr').setInteractive().setOrigin(0,1);
	scoutButton = game.add.image(200,phaser.config.height,'scoutButtonSpr').setInteractive().setOrigin(0,1);
	assualtButton = game.add.image(400,phaser.config.height,'assualtButtonSpr').setInteractive().setOrigin(0,1);
	
	rifleDelay = 0;
	scoutDelay = 0;
	assualtDelay = 0;
	
	highScore = 0;
	ui.updateHighScoreText(highScore);
	
	//Sets physic groups
	playerGrp = game.physics.add.group();
	enemyGrp = game.physics.add.group();
	
	game.physics.add.overlap(playerGrp,enemyGrp,fight,null,this);
	
	//Difficulty buttons
	easyButton.on('pointerdown',function(pointer){
		startGame();
		
		difficulty = 40;
		
		disableButtons();
	});
	
	mediumButton.on('pointerdown',function(pointer){
		startGame();
		
		difficulty = 50;
		
		disableButtons();
	});
	
	hardButton.on('pointerdown',function(pointer){
		startGame();
		
		difficulty = 60;
		
		disableButtons();
	});
	
	//Unit buttons
	rifleButton.on('pointerdown', function(pointer){
		if(!game.paused){
			if(game.time.now > rifleDelay){
				playerRifle();
				audio.marching.play();
				rifleDelay = game.time.now + 2000;
			}
		}
	});
	
	scoutButton.on('pointerdown', function(pointer){
		if(!game.paused){
			if(game.time.now > scoutDelay){
				playerScout();
				audio.marching.play();
				scoutDelay = game.time.now + 5000;
			}
		}
	});
	
	assualtButton.on('pointerdown', function(pointer){
		if(!game.paused){
			if(game.time.now > assualtDelay){
				playerAssualt();
				audio.marching.play();
				assualtDelay = game.time.now + 7500;
			}
		}
	});
	
	ui.disableScoreText();
	
	ui.showStartText();
	
	audio.theme.play();
	
	pauseGame();
	
}

function pauseGame(){
	game.paused = true;
}

function resumeGame(){	
	game.paused = false;
}

function startGame(){
	if(!game.paused)
		return;
	
	ui.disableStartText();
	ui.disableScoreText();
	
	playerHealth = 100;
	enemyHealth = 100;
	ui.updatePlayerHealth(playerHealth);
	ui.updateEnemyHealth(enemyHealth);
	
	game.score = 0;	
	ui.updateScoreText(game.score);
	
	enemyRifleTimer = game.time.addEvent({delay: 2000, repeat: -1, callback: enemyRifle});
	enemyScoutTimer = game.time.addEvent({delay: 5000, repeat: -1, callback: enemyScout});
	enemyAssualtTimer = game.time.addEvent({delay: 7500, repeat: -1, callback: enemyAssualt});
	
	resumeGame();
}

function endGame(){	
	pauseGame();
	
	ui.updateScoreText(game.score);
	
	//Sets highscore
	if(game.score > highScore){
		ui.updateHighScoreText(game.score);
		highScore = game.score;
	}
	
	ui.showScoreText();
	
	enableButtons();

	enemyRifleTimer.remove();
	enemyScoutTimer.remove();
	enemyAssualtTimer.remove();
	
}

function update(){
	aiMove();
	
	//Checks if any player or enemy has reached the ends of the screen.
	for(var i=0;i<playerChild.length;i++){
		if(playerChild[i].x>phaser.config.width - 75){
			playerChild[i].destroy();
			enemyHealth-=10;
			ui.updateEnemyHealth(enemyHealth);
			game.score+=100;
		}
	}
	
	for(var i=0;i<enemyChild.length;i++){
		if(enemyChild[i].x< 75){
			enemyChild[i].destroy();
			playerHealth-=10;
			ui.updatePlayerHealth(playerHealth);
			game.score-=50;
		}
	}
	
	//Greys out the unit buttons if delay is still active
	if(game.time.now<rifleDelay){
		rifleButton.setTint(0xd3d3d3);
	}else{
		rifleButton.clearTint();
	}
	
	if(game.time.now<scoutDelay){
		scoutButton.setTint(0xd3d3d3);
	}else{
		scoutButton.clearTint();
	}
	
	if(game.time.now<assualtDelay){
		assualtButton.setTint(0xd3d3d3);
	}else{
		assualtButton.clearTint();
	}
	
	//Checks if either side has no health left
	if(playerHealth<=0||enemyHealth<=0){
		
		for(var i=0;i<playerChild.length;i++){
			playerChild[i].destroy();
		}
		
		for(var i=0;i<enemyChild.length;i++){
			enemyChild[i].destroy();
		}
		
		endGame();
	}
}

//Player and enemy unit functions
function playerRifle(){
	var x = Phaser.Math.Between(-10,-100);
    var y = Phaser.Math.Between(50,500);
	var playerRifle = playerGrp.create(x,y,'playerRifleSpr');
	playerRifle.setOrigin(0.5,0.5);
	playerRifle.setVelocityX(100);
}

function playerScout(){
	var x = Phaser.Math.Between(-10,-100);
    var y = Phaser.Math.Between(50,500);
	var playerScout = playerGrp.create(x,y,'playerScoutSpr');
	playerScout.setOrigin(0.5,0.5);
	playerScout.setVelocityX(150);
}

function playerAssualt(){
	var x = Phaser.Math.Between(-10,-100);
    var y = Phaser.Math.Between(50,500);
	var playerAssualt = playerGrp.create(x,y,'playerAssualtSpr');
	playerAssualt.setOrigin(0.5,0.5);
	playerAssualt.setScale(1.5);
	playerAssualt.setVelocityX(50);
}
	
function enemyRifle(){
	var x = Phaser.Math.Between(phaser.config.width+10,phaser.config.width+100);
    var y = Phaser.Math.Between(50,500);
	var enemyRifle = enemyGrp.create(x,y,'enemyRifleSpr');
	enemyRifle.setOrigin(0.5,0.5);
	enemyRifle.setVelocityX(-100);
}

function enemyScout(){
	var x = Phaser.Math.Between(phaser.config.width+10,phaser.config.width+100);
    var y = Phaser.Math.Between(50,500);
	var enemyScout = enemyGrp.create(x,y,'enemyScoutSpr');
	enemyScout.setOrigin(0.5,0.5);
	enemyScout.setVelocityX(-150);
}

function enemyAssualt(){
	var x = Phaser.Math.Between(phaser.config.width+10,phaser.config.width+100);
    var y = Phaser.Math.Between(50,500);
	var enemyAssualt = enemyGrp.create(x,y,'enemyAssualtSpr');
	enemyAssualt.setOrigin(0.5,0.5);
	enemyAssualt.setVelocityX(-50);
	enemyAssualt.setScale(1.5);
}

//Player and enemy units move towards eachother
function aiMove(){	
	playerChild = playerGrp.getChildren();
	enemyChild = enemyGrp.getChildren();
	if(playerChild!=null && enemyChild!=null){
		for(var i = 0; i<playerChild.length && i<enemyChild.length;i++){
			if(playerChild[i].x>enemyChild[i].x-600){
				if(playerChild[i].y>enemyChild[i].y+10){
					playerChild[i].setVelocityY(-100);
					enemyChild[i].setVelocityY(100);
				}else if (playerChild[i].y<enemyChild[i].y-10){
					playerChild[i].setVelocityY(100);
					enemyChild[i].setVelocityY(-100);
				}else{
					playerChild[i].setVelocityY(0);
					enemyChild[i].setVelocityY(0);
				}
			}else if (playerChild[i].x>enemyChild[i].x){
				playerChild[i].setVelocityY(0);
				enemyChild[i].setVelocityY(0);
			}
		}
	}	
}

//Handles collision between the player and enemies.
function fight(player,enemy){
	var chance = Phaser.Math.Between(0,100);
	//The difficulty increases or decreases the number that the chance has beat for the player unit to win
    if(chance > difficulty){
        enemy.destroy();
		enemyHealth-=1;
		ui.updateEnemyHealth(enemyHealth);
		game.score+=10;
		audio.gunshot.play();
    }else{
        player.destroy();
		playerHealth-=1;
		ui.updatePlayerHealth(playerHealth);
		game.score-=1;
		audio.gunshot.play();
    }
}


//Functions handle enabling and disabling difficulty buttons.
function enableButtons(){
	easyButton.visible = true;
	mediumButton.visible = true;
	hardButton.visible = true;
		
	easyButton.setInteractive();
	mediumButton.setInteractive();
	hardButton.setInteractive();
}

function disableButtons(){
	easyButton.visible = false;
	mediumButton.visible = false;
	hardButton.visible = false;
		
	easyButton.disableInteractive();
	mediumButton.disableInteractive();
	hardButton.disableInteractive();
}