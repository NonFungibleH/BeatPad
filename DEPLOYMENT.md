# 🚀 BASED BEATS - Deployment Guide

## Quick Deploy to Vercel (Recommended)

### Option 1: Deploy via GitHub

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit - Based Beats v1"
git remote add origin https://github.com/yourusername/based-beats.git
git push -u origin main
```

2. **Deploy on Vercel**
- Go to https://vercel.com
- Click "Import Project"
- Select your GitHub repo
- Add environment variable:
  - Name: `VITE_ONCHAINKIT_API_KEY`
  - Value: Your OnchainKit API key
- Click "Deploy"

### Option 2: Deploy via CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts and add env variable when asked
```

---

## Deploy to Netlify

### Via CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Build
npm run build

# Deploy
netlify deploy --prod

# When prompted, set:
# - Build directory: dist
# - Add environment variable in Netlify dashboard
```

### Via Dashboard

1. Go to https://netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub
4. Select your repo
5. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variable:
   - Key: `VITE_ONCHAINKIT_API_KEY`
   - Value: Your API key
7. Click "Deploy site"

---

## Deploy to Cloudflare Pages

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login
wrangler login

# Deploy
wrangler pages deploy dist --project-name=based-beats
```

---

## Custom Server Deployment

### Build

```bash
npm run build
```

This creates optimized files in `dist/` folder.

### Serve

Upload contents of `dist/` to your web server. Make sure to:
- Serve `index.html` for all routes (SPA routing)
- Enable gzip/brotli compression
- Set proper MIME types
- Configure HTTPS

### Example Nginx config

```nginx
server {
    listen 80;
    server_name basedbeats.xyz;
    root /var/www/based-beats/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/css application/javascript application/json;
}
```

---

## Base Mini App Submission

After deploying:

1. **Test your deployed app**
   - Make sure it works on mobile
   - Test wallet connection
   - Test audio playback
   - Test recording/export

2. **Prepare assets**
   - App icon (512x512 PNG)
   - Screenshots (mobile)
   - Description
   - Category tags

3. **Submit to Base**
   - Visit https://base.org/mini-apps
   - Click "Submit Mini App"
   - Fill in details:
     - Name: Based Beats
     - URL: Your deployed URL
     - Description: Make beats onchain with classic MPC sampler
     - Category: Music, Entertainment, Creator Tools
   - Upload assets
   - Submit for review

4. **Wait for approval**
   - Base team will review (usually 2-7 days)
   - They may request changes
   - Once approved, you'll be live in Base app!

---

## Environment Variables

Make sure to set these in your deployment platform:

```env
VITE_ONCHAINKIT_API_KEY=your_api_key_here
```

Get your API key from: https://portal.cdp.coinbase.com/

---

## Post-Deployment Checklist

- [ ] App loads successfully
- [ ] All 3 drum kits work
- [ ] Pads trigger sounds
- [ ] Recording works
- [ ] Playback works
- [ ] Export downloads file
- [ ] Feed displays (even if empty)
- [ ] Mobile responsive
- [ ] Works on iOS Safari
- [ ] Works on Android Chrome
- [ ] Wallet connects (if testing in Base app)
- [ ] HTTPS enabled
- [ ] Performance is good (<3s load time)

---

## Monitoring & Analytics (Optional)

### Add Google Analytics

1. Get tracking ID from Google Analytics
2. Add to `index.html`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Add Error Tracking (Sentry)

```bash
npm install @sentry/react
```

Initialize in `src/main.tsx`:

```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
});
```

---

## Custom Domain (Optional)

### Vercel

1. Go to project settings
2. Click "Domains"
3. Add your domain
4. Update DNS records as instructed

### Netlify

1. Go to "Domain settings"
2. Click "Add custom domain"
3. Follow DNS configuration steps

---

## Troubleshooting

**Build fails:**
- Check Node version (need 18+)
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check for TypeScript errors: `npm run lint`

**Audio doesn't work:**
- HTTPS is required for Web Audio API on production
- Check browser console for errors
- Test on different devices

**Wallet doesn't connect:**
- Make sure OnchainKit API key is set
- Check network (should be Base)
- Test in actual Base app (not just browser)

---

## Support

For issues:
- Check GitHub issues
- Join Base Discord: https://discord.gg/buildonbase
- Contact: [your email/twitter]

---

**Good luck! 🔥 Let's get Based Beats live!**
