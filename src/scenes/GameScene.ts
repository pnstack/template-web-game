import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  private player?: Phaser.Physics.Arcade.Sprite;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private platforms?: Phaser.Physics.Arcade.StaticGroup;
  private stars?: Phaser.Physics.Arcade.Group;
  private score = 0;
  private scoreText?: Phaser.GameObjects.Text;
  private fpsText?: Phaser.GameObjects.Text;
  private isFpsVisible = true;
  private settingsContainer?: Phaser.GameObjects.Container;
  private settingsPanel?: Phaser.GameObjects.Rectangle;
  private settingsText?: Phaser.GameObjects.Text;
  private inventoryContainer?: Phaser.GameObjects.Container;
  private inventoryPanel?: Phaser.GameObjects.Rectangle;
  private inventoryText?: Phaser.GameObjects.Text;
  private menuKey?: Phaser.Input.Keyboard.Key;
  private inventoryKey?: Phaser.Input.Keyboard.Key;
  private fullscreenKey?: Phaser.Input.Keyboard.Key;
  private fpsToggleKey?: Phaser.Input.Keyboard.Key;

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
    }).setDepth(10);

    this.fpsText = this.add.text(0, 16, 'FPS: 0', {
      fontSize: '20px',
      color: '#9be7ff',
      backgroundColor: '#000000aa',
      padding: { x: 8, y: 4 },
    }).setDepth(10);

    this.settingsPanel = this.add.rectangle(0, 0, 380, 220, 0x000000, 0.85);
    this.settingsText = this.add.text(0, 0, '', {
      fontSize: '18px',
      color: '#ffffff',
      align: 'left',
      lineSpacing: 8,
    });
    this.settingsContainer = this.add.container(0, 0, [this.settingsPanel, this.settingsText]).setDepth(20).setVisible(false);

    this.inventoryPanel = this.add.rectangle(0, 0, 380, 220, 0x000000, 0.85);
    this.inventoryText = this.add.text(0, 0, 'Inventory\n\n[1] Sword\n[2] Shield\n[3] Potion x3\n[4] Empty\n[5] Empty', {
      fontSize: '18px',
      color: '#ffffff',
      align: 'left',
      lineSpacing: 8,
    });
    this.inventoryContainer = this.add.container(0, 0, [this.inventoryPanel, this.inventoryText]).setDepth(20).setVisible(false);

    // Controls
    this.cursors = this.input.keyboard?.createCursorKeys();
    this.menuKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.inventoryKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.I);
    this.fullscreenKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.F);
    this.fpsToggleKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.H);

    // Instructions
    this.add.text(400, 100, 'Arrow Keys: Move | Esc: Settings | I: Inventory', {
      fontSize: '18px',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.layoutUi();
    this.updateSettingsText();
    this.scale.on('resize', this.handleResize, this);
  }

  update() {
    if (!this.player || !this.cursors) return;

    if (this.fpsText) {
      this.fpsText.setText(`FPS: ${Math.round(this.game.loop.actualFps)}`);
      this.fpsText.setVisible(this.isFpsVisible);
    }

    if (this.menuKey && Phaser.Input.Keyboard.JustDown(this.menuKey)) {
      const isVisible = !(this.settingsContainer?.visible ?? false);
      this.settingsContainer?.setVisible(isVisible);
      if (isVisible) this.inventoryContainer?.setVisible(false);
      this.physics.world.isPaused = isVisible;
    }

    if (this.inventoryKey && Phaser.Input.Keyboard.JustDown(this.inventoryKey)) {
      const isVisible = !(this.inventoryContainer?.visible ?? false);
      this.inventoryContainer?.setVisible(isVisible);
      if (isVisible) this.settingsContainer?.setVisible(false);
      this.physics.world.isPaused = isVisible;
    }

    if (this.fullscreenKey && Phaser.Input.Keyboard.JustDown(this.fullscreenKey)) {
      if (this.scale.isFullscreen) {
        this.scale.stopFullscreen();
      } else {
        this.scale.startFullscreen();
      }
      this.updateSettingsText();
    }

    if (this.fpsToggleKey && Phaser.Input.Keyboard.JustDown(this.fpsToggleKey)) {
      this.isFpsVisible = !this.isFpsVisible;
      this.updateSettingsText();
    }

    if ((this.settingsContainer?.visible ?? false) || (this.inventoryContainer?.visible ?? false)) {
      this.player.setVelocityX(0);
      return;
    }

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

  private handleResize(gameSize: Phaser.Structs.Size) {
    this.cameras.resize(gameSize.width, gameSize.height);
    this.layoutUi();
  }

  private layoutUi() {
    const width = this.scale.width;
    const height = this.scale.height;
    this.fpsText?.setPosition(width - 16, 16).setOrigin(1, 0);
    this.settingsPanel?.setPosition(width / 2, height / 2);
    this.settingsText?.setPosition(width / 2 - 165, height / 2 - 85);
    this.inventoryPanel?.setPosition(width / 2, height / 2);
    this.inventoryText?.setPosition(width / 2 - 165, height / 2 - 85);
  }

  private updateSettingsText() {
    this.settingsText?.setText(
      'Settings\n\n[F] Toggle Fullscreen: ' + (this.scale.isFullscreen ? 'On' : 'Off') + '\n[H] Show FPS: ' + (this.isFpsVisible ? 'On' : 'Off') + '\n[Esc] Close Menu'
    );
  }
}
