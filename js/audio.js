class Audio{
	constructor(){
		this.theme = game.sound.add('theme');
		this.theme.setLoop(true);
		this.theme.setVolume(0.5);
		
		this.gunshot = game.sound.add('gunshot');
		
		this.marching = game.sound.add('marching');
	}
}