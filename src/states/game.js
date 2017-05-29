import Phaser from 'phaser';
import FontFaceObserver from 'fontfaceobserver';

export default class GameState extends Phaser.State {
  preload() {
    let font = new FontFaceObserver('arcade');
    font.load().then(() => {
      this.gameObjects.highScoreText = this.add.text(this.game.width - 200, 10, 'hi', {
        font: '20px arcade',
        fill: '#666'
      });

      this.gameObjects.scoreText = this.add.text(this.game.width - 80, 10, '00000', {
        font: '20px arcade',
        fill: '#666'
      });
    })
    .catch(() => {
      console.log('oops, font not loaded');
    });
  }

  create() {
    this.gameObjects = {
      ground: this.add.sprite(0, 130, 'ground'),
      secondaryGround: this.add.sprite(600, 130, 'ground'),
      cacti: this.add.sprite(600, 92, 'cacti1'),
      rex: this.add.sprite(20, 14, 'rex'),
      score: 0
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

    this.physics.arcade.gravity.y = 1800;

    this.gameObjects.ground.body.allowGravity = false;
    this.gameObjects.ground.body.immovable = true;

    // this.gameObjects.cacti.body.allowGravity = false;
    // this.gameObjects.cacti.body.immovable = true;

    // this.gameObjects.rex.body.friction.x = 1000;
    // this.gameObjects.rex.body.friction.y = 3000;
    // this.gameObjects.rex.body.mass = 0;
    // this.gameObjects.rex.body.drag.y = 1000;

    // this.gameObjects.rex.body.setSize(this.gameObjects.rex.width - 20,
    //   this.gameObjects.rex.height, 10, 0);

    this.adjustsCacti();

    // this.gameObjects.cacti.body.setSize(this.gameObjects.cacti.randomWidth,
    //     this.gameObjects.cacti.height, 0, 0);

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

    this.gameObjects.cacti.getBounds = this.getSpecificBounds.bind(null, this.gameObjects.cacti);

    this.gameObjects.rex.getBounds = () => {
      return new Phaser.Rectangle(this.gameObjects.rex.x + 10, this.gameObjects.rex.y,
          20, this.gameObjects.rex.height - 2);
    };

    this.gameObjects.secondaryGround.visible = false;

    this.keys = {
      space: {
        jumping: false
      }
    };

    this.time.events.loop(100, this.calculateScore, this);
    // this.game.physics.desiredFps = 60;

    // this.keys.space.onDown.add(() => {
      // if (this.gameState.gameover) {
      //   this.gameState.gameover = false;
      //   this.gameState.started = true;
      //   this.adjustsCacti();
      //   this.gameObjects.rex.y = 83;
      //   this.physics.arcade.isPaused = false;
      //   this.gameObjects.score = 0;
      // } else if (this.gameState.gamePlayStarted && this.gameObjects.rex.body.touching.down) {
      //   this.gameObjects.rex.body.velocity.y = -600;
      //   console.log(this.gameObjects.rex.body.velocity.x);
      //   console.log('counter', this.counter);
      // } else if (!this.gameState.started) {
      //   this.gameState.started = true;
      //   let tween = this.add.tween(this.gameObjects.rex).to({x: this.gameObjects.rex.body.x + 20},
      //     600, Phaser.Easing.Linear.None, true);
      //
      //   tween.onComplete.add(() => {
      //     this.gameState.gamePlayStarted = true;
      //   });
      // }
    // });

    this.counter = 0;
  }

  update () {
    this.counter++;
    this.physics.arcade.collide(this.gameObjects.rex,
      [this.gameObjects.ground, this.gameObjects.secondaryGround]);

    if (this.gameState.gamePlayStarted) {
      if (this.keys.space.jumping && this.gameObjects.rex.body.touching.down) {
        console.log('wow', this.gameObjects.rex.body.touching.down);
        this.keys.space.jumping = false;
      }

      if (this.keys.space.jumping) {
        console.log('jumping true', this.counter);
        this.gameObjects.rex.body.velocity.x = 0;
      } else {
        console.log('jumping false', this.counter);
        this.gameObjects.rex.body.velocity.x = 300;
      }
    }

    if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
      if (this.gameState.gameover) {
        this.gameState.gameover = false;
        this.gameState.started = true;
        this.adjustsCacti();
        this.gameObjects.rex.y = 83;
        this.physics.arcade.isPaused = false;
        this.gameObjects.score = 0;
      } else if (this.gameState.gamePlayStarted && this.gameObjects.rex.body.touching.down &&
                !this.keys.space.jumping) {
        this.keys.space.jumping = true;
        console.log('entered?');
        this.gameObjects.rex.body.velocity.x = 0;
        this.gameObjects.rex.body.velocity.y = -600;
        console.log(this.gameObjects.rex.body.velocity.x);
        console.log('counter', this.counter);
      } else if (!this.gameState.started) {
        this.gameState.started = true;
        let tween = this.add.tween(this.gameObjects.rex).to({x: this.gameObjects.rex.body.x + 20},
                  600, Phaser.Easing.Linear.None, true);

        tween.onComplete.add(() => {
          this.gameState.gamePlayStarted = true;
          this.gameObjects.rex.body.velocity.x = 300;
          console.log('tween', this.counter);
        });
      }

    // this.physics.arcade.collide(this.gameObjects.rex, this.gameObjects.cacti, this.gameOver.bind(this));

    if (this.checkOverlap(this.gameObjects.rex, this.gameObjects.cacti))
      this.gameOver();

    if (this.gameObjects.cacti.right <= 0 && this.gameState.started && !this.gameState.gameover)
      this.adjustsCacti();


    if (this.gameObjects.ground.body.right <= this.game.width)
      this.gameObjects.secondaryGround.visible = true;

    if (this.gameObjects.ground.body.right <= 0) {
      this.gameObjects.secondaryGround.visible = false;
      this.gameObjects.secondaryGround.body.x = 600;
      this.gameObjects.ground.body.x = 0;
    }

    if (this.gameObjects.secondaryGround.visible && this.gameState.started)
      this.gameObjects.secondaryGround.body.velocity.x = -300;

    if (this.gameState.started) {
      this.gameObjects.ground.body.velocity.x = -300;
      this.gameObjects.cacti.x -= 1;
    }

    if (this.input.keyboard.isDown(Phaser.Keyboard.DOWN))
      this.gameObjects.rex.body.velocity.y = 600;

    if (this.gameObjects.rex.body.touching.down && this.gameState.started)
      this.gameObjects.rex.animations.play('walk');
    else if (this.gameState.started)
      this.gameObjects.rex.animations.play('jump');
  }

  calculateScore() {
    if (this.gameState.gamePlayStarted && !this.gameState.gameover) {
      this.gameObjects.score++;
      this.gameObjects.scoreText.setText(('00000' + this.gameObjects.score).slice(-5));
    }
  }

  adjustsCacti() {
    this.gameObjects.cacti.randomWidth = this.misc.cactiWidthSampleSpace[this.rnd
        .integerInRange(0, this.misc.cactiWidthSampleSpace.length - 1)];
    this.gameObjects.cacti.x = 600;
    // this.gameObjects.cacti.body.setSize(this.gameObjects.cacti.randomWidth,
    //     this.gameObjects.cacti.height, 0, 0);
    this.gameObjects.cacti.crop(new Phaser.Rectangle(0, 0,
      this.gameObjects.cacti.randomWidth, 100));
  }

  getSpecificBounds(object) {
    return new Phaser.Rectangle(object.x + 10, object.y,
        object.randomWidth - 20, object.height - 2);
  }

  checkOverlap(rex, cacti) {
    return Phaser.Rectangle.intersects(rex.getBounds(), cacti.getBounds());
  }

  gameOver() {
    console.log('morreu');
    this.gameObjects.rex.body.velocity.y = 0;
    this.gameObjects.rex.animations.play('dead');
    this.gameState.started = false;
    this.gameState.gameover = true;
    this.physics.arcade.isPaused = true;
  }

  render() {
    this.game.debug.spriteBounds(this.gameObjects.rex);
    this.game.debug.spriteBounds(this.gameObjects.cacti);
    this.game.debug.text(this.gameObjects.rex.body.x, 10, 10);
    // console.log(this.gameObjects.rex.body.moves);
    // this.game.debug.key(this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR), 10, 10);
    // this.game.debug.body(this.gameObjects.secondaryGround);
  }
}
