import Phaser from 'phaser';

export default class GameState extends Phaser.State {
  create() {
    console.log(this.game.width);
    this.ground = this.add.sprite(0, 100, 'ground');
    this.finalGround = this.add.sprite(600, 100, 'ground');
    this.finalGround.visible = false;
  }

  update () {
    if (this.ground.x + this.ground.width <= this.game.width)
      this.finalGround.visible = true;

    if (this.ground.x + this.ground.width <= 0) {
      this.finalGround.visible = false;
      this.finalGround.x = 600;
      this.ground.x = 0;
    }

    if (this.finalGround.visible)
      this.finalGround.x -= 10;

    this.ground.x -= 10;
  }
}
