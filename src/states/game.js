import Phaser from 'phaser';

export default class GameState extends Phaser.State {
  create() {
    this.gameObjects = {
      ground: this.add.sprite(0, 130, 'ground'),
      secondaryGround: this.add.sprite(600, 130, 'ground'),
      cacti: this.add.sprite(600, 92, 'cacti1'),
      rex: this.add.sprite(20, 14, 'rex'),
    };

    this.gameState = {
      started: false,
      gamePlayStarted: false
    };

    this.misc = {
      cactiWidthSampleSpace: [25, 25, 25, 50, 50, 75]
    };

    this.physics.startSystem(Phaser.Physics.ARCADE);

    this.physics.enable([this.gameObjects.rex, this.gameObjects.ground,
      this.gameObjects.secondaryGround], Phaser.Physics.ARCADE);

    this.physics.arcade.gravity.y = 2800;

    this.gameObjects.ground.body.allowGravity = false;
    this.gameObjects.ground.body.immovable = true;

    this.gameObjects.ground.body.setSize(this.gameObjects.ground.width,
      this.gameObjects.ground.height, 0, 10);

    this.gameObjects.secondaryGround.body.setSize(this.gameObjects.secondaryGround.width,
      this.gameObjects.secondaryGround.height, 0, 10);

    this.gameObjects.secondaryGround.body.allowGravity = false;
    this.gameObjects.secondaryGround.body.immovable = true;

    this.gameObjects.rex.animations.add('idle', [0, 1, 0, 0, 0], 5, false);
    this.gameObjects.rex.animations.add('jump', [0], 10);
    this.gameObjects.rex.animations.add('walk', [2, 3], 10);
    this.gameObjects.rex.animations.add('dead', [4], 10);

    this.gameObjects.cacti.crop(new Phaser.Rectangle(0, 0, 75, 100));

    // this.gameObjects.cacti.animations.add('default', [0]);
    // this.gameObjects.cacti.animations.add('default', [0]);

    // this.gameObjects.rex.animations.play('idle');
    // this.gameObjects.cacti.animations.play('default');

    this.gameObjects.secondaryGround.visible = false;
  }

  update () {
    this.physics.arcade.collide(this.gameObjects.rex,
      [this.gameObjects.ground, this.gameObjects.secondaryGround]);

    if (this.gameObjects.cacti.right <= 0) {
      let randomWidth = this.misc.cactiWidthSampleSpace[this.rnd
          .integerInRange(0, this.misc.cactiWidthSampleSpace.length - 1)];
      this.gameObjects.cacti.x = 600;
      this.gameObjects.cacti.crop(new Phaser.Rectangle(0, 0, randomWidth, 100));
    }

    if (this.gameObjects.ground.body.right <= this.game.width)
      this.gameObjects.secondaryGround.visible = true;

    if (this.gameObjects.ground.body.right <= 0) {
      this.gameObjects.secondaryGround.visible = false;
      this.gameObjects.secondaryGround.x = 600;
      this.gameObjects.ground.x = 0;
    }

    if (this.gameObjects.secondaryGround.visible)
      this.gameObjects.secondaryGround.x -= 5;

    if (this.gameState.started) {
      this.gameObjects.ground.x -= 5;
      this.gameObjects.cacti.x -= 5;
    }

    if (this.input.keyboard.isDown(Phaser.Keyboard.DOWN))
      this.gameObjects.rex.body.velocity.y = 600;
    else if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      if (this.gameState.gamePlayStarted && this.gameObjects.rex.body.touching.down)
        this.gameObjects.rex.body.velocity.y = -750;
      else if (!this.gameState.started) {
        this.gameState.started = true;
        let tween = this.add.tween(this.gameObjects.rex).to({x: this.gameObjects.rex.body.x + 20},
          600, Phaser.Easing.Linear.None, true);

        tween.onComplete.add(() => {
          this.gameState.gamePlayStarted = true;
        });
      }
    }

    if (this.gameObjects.rex.body.touching.down && this.gameState.started)
      this.gameObjects.rex.animations.play('walk');
    else if (this.gameState.started)
      this.gameObjects.rex.animations.play('jump');


  }

  render() {
    // this.game.debug.body(this.gameObjects.rex);
    // this.game.debug.body(this.gameObjects.ground);
    // this.game.debug.body(this.gameObjects.secondaryGround);
  }
}
