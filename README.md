# 🔥 BASED BEATS

**Make beats onchain. Classic MPC interface. Web3 native.**

A mobile-first beat maker built for the Base ecosystem. Create beats with a classic MPC-style sampler, share them with the community, and own your music onchain.

## ✨ Features

- **16-Pad MPC Sampler** - Classic hardware-inspired interface with touch-optimized pads
- **3 Drum Kits** - Hip Hop, Trap, and Acoustic kits with synthesized sounds
- **Record & Playback** - Capture your live performances
- **Export Audio** - Download beats as high-quality audio files
- **Community Feed** - Browse and listen to beats from other creators
- **Base Integration** - Auto-connected wallet, ENS support, built on Base

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- A modern browser (Chrome, Firefox, Safari)

### Installation

1. **Clone or extract the project**
```bash
cd based-beats
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Create environment file**
```bash
cp .env.example .env
```

Edit `.env` and add your OnchainKit API key (get one at https://portal.cdp.coinbase.com/)

4. **Start development server**
```bash
npm run dev
# or
yarn dev
```

5. **Open in browser**
```
http://localhost:3000
```

## 📁 Project Structure

```
based-beats/
├── src/
│   ├── components/
│   │   ├── MPCSampler.tsx      # Main MPC interface
│   │   ├── MPCSampler.css      # MPC styling
│   │   ├── Feed.tsx            # Community feed
│   │   └── Feed.css            # Feed styling
│   ├── config/
│   │   └── drumKits.ts         # Drum kit configurations
│   ├── types/
│   │   └── beat.ts             # TypeScript types
│   ├── utils/
│   │   └── audioEngine.ts      # Audio synthesis engine
│   ├── App.tsx                 # Main app component
│   ├── App.css                 # App styling
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🎹 How to Use

### Creating a Beat

1. **Select a Kit** - Choose from Hip Hop, Trap, or Acoustic
2. **Tap the Pads** - Create your rhythm by tapping the 16 pads
3. **Hit Record** - Start recording your live performance
4. **Stop Recording** - When you're done, stop the recording
5. **Play Back** - Listen to your beat
6. **Share or Export** - Share to the feed or download the audio file

### Browsing the Feed

1. **Switch to Feed Tab** - Tap the Feed button in bottom navigation
2. **Browse Beats** - Scroll through community creations
3. **Play Beats** - Tap play button to listen inline
4. **Sort & Filter** - Use Latest/Trending/Popular tabs

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Wagmi** - Web3 React hooks
- **OnchainKit** - Base integration
- **Web Audio API** - Sound synthesis
- **MediaRecorder API** - Audio recording

## 🌐 Deployment

### Build for Production

```bash
npm run build
# or
yarn build
```

This creates an optimized build in the `dist/` folder.

### Deploy Options

**Vercel (Recommended)**
```bash
npm install -g vercel
vercel
```

**Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

**Base Mini App Submission**
1. Deploy to a public URL
2. Visit https://base.org/mini-apps
3. Submit your app for review

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```env
VITE_ONCHAINKIT_API_KEY=your_api_key_here
```

Get your API key from [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)

### Customize Drum Kits

Edit `src/config/drumKits.ts` to modify or add drum kits:

```typescript
export const drumKits = {
  yourkit: {
    name: 'Your Kit',
    pads: [
      { name: 'KICK', frequency: 60, type: 'kick' },
      // ... add 15 more pads
    ]
  }
}
```

## 📱 Base Mini App Integration

This app is designed to run as a Base Mini App inside the Base mobile app.

### Features

- ✅ Auto-connected wallet (no connection flow needed)
- ✅ User identity (ENS, avatar from Base profile)
- ✅ Native share integration
- ✅ Deep linking support (`base://basedbeats/*`)
- ✅ Mobile-optimized UI
- ✅ Touch & haptic feedback

### Testing in Base App

1. Deploy your app to a public URL
2. Open Base app on mobile
3. Navigate to Mini Apps
4. Enter your app URL
5. Test the experience

## 🎨 Design System

### Colors

- **Primary**: `#ff6b35` (Fire Orange)
- **Secondary**: `#f7931e` (Amber)
- **Background**: `#0a0a0a` to `#1a1a1a` (Dark)
- **Surface**: `#2d2d2d` (Gray)
- **Text**: `#f3f4f6` (Light Gray)

### Typography

- **Logo**: Bold, 900 weight, gradient
- **LCD**: Courier New, monospace
- **Body**: System font stack

## 🤝 Contributing

This is a V1 MVP. Future improvements:

- [ ] Backend API for beat storage
- [ ] Real audio playback in feed
- [ ] NFT minting on Base
- [ ] Mic recording for vocals
- [ ] EQ/effects
- [ ] Remix feature
- [ ] User profiles
- [ ] Likes & comments

## 📄 License

MIT License - feel free to use and modify!

## 🔗 Links

- **Base**: https://base.org
- **OnchainKit**: https://onchainkit.xyz
- **3UILD Studio**: [Your website]

## 🙏 Credits

Built with 🔥 by 3UILD

---

**Stay based. Make beats.** 🎵
