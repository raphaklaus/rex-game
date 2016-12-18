import 'pixi';
import 'p2';
import Phaser from 'phaser';
import BootState from './states/boot.js';
import GameState from './states/game.js';

class Game extends Phaser.Game {
  constructor() {
    let width = (document.documentElement.clientWidth > 600) ?
      600 : document.documentElement.clientWidth;
    let height = (document.documentElement.clientHeight > 150) ?
      150 : document.documentElement.clientHeight;

    super(width, height, Phaser.AUTO, 'Rex Game', null);

    this.state.add('Boot', BootState);
    this.state.add('Game', GameState);

    this.state.start('Boot');
  }
}

new Game();
