# template-web-game

Modern web game template built with Phaser 3, TypeScript, and Vite.

## 🎮 Features

- **Phaser 3** - Powerful HTML5 game framework
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Clean Architecture** - Well-organized project structure
- **CI/CD** - Automated deployment to GitHub Pages

## 📁 Project Structure

```
template-web-game/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD workflow
├── public/                     # Static assets (favicon, etc.)
├── src/
│   ├── scenes/                 # Game scenes
│   │   ├── PreloadScene.ts     # Asset loading scene
│   │   └── GameScene.ts        # Main game scene
│   ├── assets/                 # Game assets
│   │   ├── images/             # Images and sprites
│   │   └── audio/              # Sound effects and music
│   └── main.ts                 # Entry point
├── index.html                  # Main HTML file
├── package.json                # Project dependencies
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/pnstack/template-web-game.git
cd template-web-game
```

2. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The game will be available at `http://localhost:5173`

### Build

Build for production:
```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

Preview the production build locally:
```bash
npm run preview
```

## 🎯 Creating Your Game

### Adding New Scenes

1. Create a new scene file in `src/scenes/`:
```typescript
import Phaser from 'phaser';

export class MyScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MyScene' });
  }

  create() {
    // Your scene logic here
  }

  update() {
    // Update logic here
  }
}
```

2. Register the scene in `src/main.ts`:
```typescript
import { MyScene } from './scenes/MyScene';

const config: Phaser.Types.Core.GameConfig = {
  // ...
  scene: [PreloadScene, MyScene, GameScene],
};
```

### Adding Assets

1. Place your assets in `src/assets/images/` or `src/assets/audio/`
2. Import and load them in `PreloadScene.ts`:
```typescript
import logoImage from '@/assets/images/logo.png';
import musicAudio from '@/assets/audio/music.mp3';

preload() {
  this.load.image('logo', logoImage);
  this.load.audio('music', musicAudio);
}
```

Or for assets in the `public/` folder (copied as-is):
```typescript
preload() {
  this.load.image('logo', '/logo.png');
}
```

## 🚢 Deployment

The project is configured to automatically deploy to GitHub Pages when you push to the `main` branch.

### Setup GitHub Pages

1. Go to your repository settings
2. Navigate to "Pages" section
3. Under "Build and deployment", select:
   - Source: "GitHub Actions"

The game will be available at: `https://pnstack.github.io/template-web-game/`

## 📚 Resources

- [Phaser 3 Documentation](https://photonstorm.github.io/phaser3-docs/)
- [Phaser 3 Examples](https://phaser.io/examples)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.
