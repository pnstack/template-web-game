import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  private player?: Phaser.Physics.Arcade.Sprite;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private platforms?: Phaser.Physics.Arcade.StaticGroup;
  private stars?: Phaser.Physics.Arcade.Group;
  private score = 0;
  private scoreText?: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    // Add title
    this.add.text(400, 50, 'Phaser 3 Game Template', {
      fontSize: '32px',
      color: '#ffffff',
    }).setOrigin(0.5);

    // Create platforms
    this.platforms = this.physics.add.staticGroup();
    
    // Ground
    const ground = this.add.rectangle(400, 568, 800, 64, 0x00ff00);
    this.physics.add.existing(ground, true);
    this.platforms.add(ground);

    // Platform ledges
    const platform1 = this.add.rectangle(600, 400, 200, 32, 0x00ff00);
    this.physics.add.existing(platform1, true);
    this.platforms.add(platform1);

    const platform2 = this.add.rectangle(50, 250, 200, 32, 0x00ff00);
    this.physics.add.existing(platform2, true);
    this.platforms.add(platform2);

    const platform3 = this.add.rectangle(750, 220, 200, 32, 0x00ff00);
    this.physics.add.existing(platform3, true);
    this.platforms.add(platform3);

    // Create player
    this.player = this.physics.add.sprite(100, 450, '');
    this.player.setDisplaySize(32, 48);
    this.player.setTint(0xff0000);
    const playerGraphics = this.add.graphics();
    playerGraphics.fillStyle(0xff0000, 1);
    playerGraphics.fillRect(84, 426, 32, 48);
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    // Add collision between player and platforms
    this.physics.add.collider(this.player, this.platforms);

    // Create stars
    this.stars = this.physics.add.group({
      key: '',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    this.stars.children.iterate((child) => {
      const star = child as Phaser.Physics.Arcade.Sprite;
      star.setDisplaySize(24, 24);
      star.setTint(0xffff00);
      star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      
      // Draw star shape
      const x = star.x;
      const y = star.y;
      const starGraphics = this.add.graphics();
      starGraphics.fillStyle(0xffff00, 1);
      starGraphics.fillCircle(x, y, 12);
      
      return true;
    });

    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.overlap(
      this.player,
      this.stars,
      this.collectStar as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );

    // Score text
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '24px',
      color: '#ffffff',
    });

    // Controls
    this.cursors = this.input.keyboard?.createCursorKeys();

    // Instructions
    this.add.text(400, 100, 'Use Arrow Keys to Move', {
      fontSize: '18px',
      color: '#ffffff',
    }).setOrigin(0.5);
  }

  update() {
    if (!this.player || !this.cursors) return;

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
    } else {
      this.player.setVelocityX(0);
    }

    if (this.cursors.up.isDown && this.player.body?.touching.down) {
      this.player.setVelocityY(-330);
    }
  }

  private collectStar(
    _player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    star: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) {
    const starSprite = star as Phaser.Physics.Arcade.Sprite;
    starSprite.disableBody(true, true);

    this.score += 10;
    this.scoreText?.setText('Score: ' + this.score);

    if (this.stars?.countActive(true) === 0) {
      this.stars.children.iterate((child) => {
        const star = child as Phaser.Physics.Arcade.Sprite;
        star.enableBody(true, star.x, 0, true, true);
        return true;
      });
    }
  }
}
