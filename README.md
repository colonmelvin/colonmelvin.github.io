# 🎵 Vibe Coding Experience

An interactive coding atmosphere where you control the vibe. Adjust lighting, colors, animation speed, and focus levels in real-time to create your perfect coding environment.

## ✨ Features

- 🎛️ **5 Interactive Controls**: Ambiance, Color, Speed, Focus, Sound
- 🔊 **Procedural Ambient Audio**: Rain, keyboard clicks, cafe sounds, forest ambiance
- 🎨 **Glass Morphism Design**: Beautiful neon effects and smooth animations
- 📱 **Fully Responsive**: Optimized for mobile and desktop
- 🎯 **4 Preset Modes**: Focus, Chill, Energy, Midnight
- ⚡ **60fps Performance**: Smooth animations powered by Framer Motion

## 🚀 Live Demo

- **Primary**: [https://colonmelvin.com](https://colonmelvin.com)
- **GitHub Pages**: [https://colonmelvin.github.io](https://colonmelvin.github.io)

## 🛠️ Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup
```bash
# Clone the repository
git clone https://github.com/colonmelvin/colonmelvin.github.io.git
cd colonmelvin.github.io

# Switch to development branch
git checkout development

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

### Project Structure
```
├── src/
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   └── lib/                 # Utilities and stores
├── public/                  # Static assets
└── out/                     # Built files (generated)
```

## 📦 Deployment to GitHub Pages

### Current Setup
This project uses a **manual deployment** pattern:

- **`development`** branch: Source code for development
- **`master`** branch: Built static files (served by GitHub Pages)

### Deploy Process

1. **Make changes on development branch:**
```bash
git checkout development
# Make your changes...
git add .
git commit -m "Your changes"
git push origin development
```

2. **Deploy to GitHub Pages:**
```bash
# Build and deploy (from development branch)
npm run deploy
```

This will:
- Build the Next.js app (`npm run export`)
- Deploy built files to `master` branch using `gh-pages` tool
- GitHub Pages serves from `master` branch

### ⚠️ Important Notes

- **Always work on `development` branch** - never edit `master` directly
- **Master branch gets overwritten** on each deployment
- **Include `.nojekyll` file** to serve `_next/` directory properly
- **Wait 2-5 minutes** for GitHub Pages to update after deployment

## 🔧 Configuration

### Next.js Config
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: 'export',           // Static export for GitHub Pages
  trailingSlash: true,        // Required for GitHub Pages
  images: { unoptimized: true }, // GitHub Pages doesn't support Image Optimization
};
```

### GitHub Pages Settings
- **Source**: Deploy from a branch
- **Branch**: `master` / `/ (root)`
- **Custom domain**: `colonmelvin.com` (configured via CNAME file)

## 🎯 Better Deployment Options

### Option 1: GitHub Actions (Recommended)
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ development ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./out
          cname: colonmelvin.com
```

### Option 2: Simplified Branch Structure
- Use `main` branch for source code
- Auto-deploy to `gh-pages` branch
- Standard GitHub Pages pattern

## 🎨 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4 (beta)
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Audio**: Web Audio API
- **Deployment**: GitHub Pages
- **Development**: TypeScript, ESLint

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch from `development`
3. Make your changes
4. Test locally with `npm run dev`
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

Created collaboratively using [Amazon Q CLI](https://github.com/aws/amazon-q-developer-cli) - where human creativity meets AI assistance to build something extraordinary.

---

**Live at**: [colonmelvin.com](https://colonmelvin.com) 🎵✨
