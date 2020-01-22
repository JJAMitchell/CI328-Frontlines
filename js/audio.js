class Audio{
	constructor(){
		this.theme = game.sound.add('theme');
		this.theme.setLoop(true);
		
		this.gunshot = game.sound.add('gunshot');
		
		this.marching = game.sound.add('marching');
	}
}