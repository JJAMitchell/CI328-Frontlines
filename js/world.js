class World{
	constructor(game){
		this.bg = game.add.image(0,0,'bgimg');
		this.bg.setOrigin(0,0);
		
		this.placeholder = game.add.image(600,phaser.config.height,'placeholder');
		this.placeholder.setOrigin(0,1);
		
		//Randomly add flowers and holes
		for(var i=0;i<10;i++){
			this.flower = game.add.image(Phaser.Math.Between(10,1200),Phaser.Math.Between(10,500),'flower');
			this.flower.setOrigin(0.5,0.5);
		}
		
		for(var i=0;i<2;i++){
			this.hole = game.add.image(Phaser.Math.Between(10,1200),Phaser.Math.Between(10,500),'hole');
			this.hole.setOrigin(0.5,0.5);
		}
	}
}