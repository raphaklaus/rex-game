import Phaser from 'phaser';

export default class BootState extends Phaser.State {
  init() {
    this.stage.backgroundColor = '#f7f7f7';
  }

  preload() {
    this.load.image('cacti1', '../../assets/cacti1.png');
    this.load.image('cacti2', '../../assets/cacti2.png');
    this.load.image('dino', '../../assets/dino.png');
    this.load.image('ground', '../../assets/ground.png');
    this.load.image('hud', '../../assets/hud.png');
    this.load.image('cloud', '../../assets/cloud.png');
    this.load.image('replay', '../../assets/replay.png');

    this.load.onLoadComplete.add(() => {
      this.state.start('Game');
    });
  }
}