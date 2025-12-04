# 🔥 BASED BEATS - Quick Start

## Get Running in 5 Minutes

### 1. Install Dependencies

```bash
npm install
```

### 2. Get OnchainKit API Key

1. Go to https://portal.cdp.coinbase.com/
2. Sign up or log in
3. Create a new project
4. Copy your API key

### 3. Set Up Environment

```bash
# Create .env file
cp .env.example .env

# Edit .env and paste your API key
VITE_ONCHAINKIT_API_KEY=your_api_key_here
```

### 4. Start Dev Server

```bash
npm run dev
```

### 5. Open in Browser

```
http://localhost:3000
```

---

## What You'll See

- **Create Tab**: MPC sampler interface
  - Select a drum kit (Hip Hop, Trap, Acoustic)
  - Tap pads to make sounds
  - Hit Record → make a beat → Stop
  - Play back your beat
  - Export or Share to Feed

- **Feed Tab**: Community beats
  - Browse beats from others (mock data for now)
  - Play beats inline
  - Sort by Latest/Trending/Popular

---

## Next Steps

1. **Test the sampler**
   - Try all 3 kits
   - Record a beat
   - Play it back
   - Export the audio file

2. **Build for production**
   ```bash
   npm run build
   ```

3. **Deploy** (see DEPLOYMENT.md)
   - Vercel (recommended)
   - Netlify
   - Cloudflare Pages
   - Custom server

4. **Submit to Base**
   - Deploy to public URL
   - Test on mobile
   - Submit at https://base.org/mini-apps

---

## Common Issues

**Port 3000 already in use?**
```bash
# Edit vite.config.ts and change port
server: {
  port: 3001,
}
```

**TypeScript errors?**
```bash
# Make sure you're on Node 18+
node --version

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Audio not working?**
- Web Audio API requires user interaction
- Make sure you tap a pad before recording
- Check browser console for errors

---

## Project Structure

```
src/
├── components/        # React components
├── config/           # Drum kits configuration  
├── types/            # TypeScript types
├── utils/            # Audio engine
├── App.tsx           # Main app
└── main.tsx          # Entry point
```

---

## Key Files to Customize

- `src/config/drumKits.ts` - Add/modify drum kits
- `src/components/MPCSampler.tsx` - MPC interface logic
- `src/components/MPCSampler.css` - MPC styling
- `src/App.css` - Global app styling

---

## Need Help?

- Read full README.md
- Check DEPLOYMENT.md for deploy guides
- Open an issue on GitHub
- Join Base Discord

---

**Let's make some beats! 🎵**
