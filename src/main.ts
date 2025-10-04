import Phaser from 'phaser';
import { GameScene } from './scenes/GameScene';
import { PreloadScene } from './scenes/PreloadScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  backgroundColor: '#2d2d2d',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 300 },
      debug: false,
    },
  },
  scene: [PreloadScene, GameScene],
};

const game = new Phaser.Game(config);

export default game;
