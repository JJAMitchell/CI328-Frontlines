class UI{
	constructor(){
		
		this.startText = game.add.text(phaser.config.width/2,100,'Frontlines',{
			font:'100px Arial',
			fill: '#fff'
		});
		this.startText.setOrigin(0.5,0.5);
		
		this.playerHealthText = game.add.text(10, 10, 'Player Morale: 100',{
			font:'24px Arial',
			fill: '#fff'
		});
		
		this.enemyHealthText = game.add.text(phaser.config.width - 210, 10, 'Enemy Morale: 100',{
			font:'24px Arial',
			fill: '#fff'											  
		});
		
		this.scoreText = game.add.text(phaser.config.width/2,50, 'Final Score: ',{
			font: '30px Arial',
			fill: '#fff'
		});
		this.scoreText.setOrigin(0.5, 0.5);
		
		this.highScoreText = game.add.text(phaser.config.width/2,550, 'High Score: ',{
			font: '30px Arial',
			fill: '#fff'
		});
		this.highScoreText.setOrigin(0.5, 0.5);
		
		
		this.gameOverText = game.add.text(phaser.config.width/2,100, 'Select a difficulty to play again!',{
			font: '30px Arial',
			fill: '#fff'
		});
		this.gameOverText.setOrigin(0.5, 0.5);
		
    }

	//Update scores
    updateScoreText(newScore) {
        this.scoreText.setText('Score: ' + newScore);
    }
	
	updateHighScoreText(newScore){
		this.highScoreText.setText('High Score: '+ newScore);
	}
	
	//Update health
	updatePlayerHealth(newHealth){
		this.playerHealthText.setText('Player Morale: ' + newHealth);
	}
	
	updateEnemyHealth(newHealth){
		this.enemyHealthText.setText('Enemy Morale: ' + newHealth);
	}
	
	//Show/hide functions
	showStartText(){
		this.startText.visible = true;
	}
	
	disableStartText(){
		this.startText.visible = false;
	}
	
	showScoreText() {
		this.scoreText.visible = true;
		this.highScoreText.visible = true;
		this.gameOverText.visible = true;
	}
	
	disableScoreText() {
		this.scoreText.visible = false;
		this.highScoreText.visible = false;
		this.gameOverText.visible = false;
	}
	
}