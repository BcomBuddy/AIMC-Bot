# AIMC Assistant - Netlify Deployment Guide

## 🚀 Quick Deployment to Netlify

### Prerequisites
- Netlify account
- OpenAI API key
- Git repository with your code

## ⚠️ Build Issues & Solutions

**Note**: The application uses LangChain which can cause build issues with Vite. Here are the solutions:

### Solution 1: Use Netlify's Build Environment (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Prepare for Netlify deployment"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your repository
   - Use these settings:
     - **Build command**: `npm install && npm run build`
     - **Publish directory**: `dist`
     - **Node version**: 18

3. **Set Environment Variables**
   - Go to Site settings → Environment variables
   - Add: `VITE_OPENAI_API_KEY` = `your-openai-api-key`

4. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete

### Solution 2: Manual Build & Deploy

If the automatic build fails, use this manual approach:

1. **Build locally with alternative method**
   ```bash
   # Install dependencies
   npm install
   
   # Try different build approaches
   npm run build:standard
   # OR
   npx vite build --mode production
   ```

2. **If build still fails, use development build**
   ```bash
   # Start dev server and build manually
   npm run dev
   # Then use browser dev tools to save the built files
   ```

3. **Upload to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Drag the `dist` folder to the deploy area

### Method 2: Drag & Drop Deployment

1. **Build locally**
   ```bash
   npm install
   npm run build
   ```

2. **Upload to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Drag the `dist` folder to the deploy area

## 🔧 Configuration Files

### netlify.toml
```toml
[build]
  command = "npm run build"
  publish = "dist"
  
[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Environment Variables
- `VITE_OPENAI_API_KEY`: Your OpenAI API key (required)

## 📁 Project Structure
```
project/
├── public/
│   ├── english_document.pdf
│   └── urdu_document.pdf
├── src/
│   ├── components/
│   ├── services/
│   └── types/
├── netlify.toml
├── package.json
└── vite.config.ts
```

## 🛠️ Build Optimization

The application is optimized for production with:
- Code splitting for better performance
- Terser minification
- Chunk optimization
- Static asset caching

## 🔒 Security Features

- XSS protection headers
- Content type protection
- Frame options security
- Referrer policy

## 📱 Mobile Responsive

The application is fully responsive and works on:
- Mobile phones (320px+)
- Tablets (640px+)
- Desktop (1024px+)

## 🚨 Troubleshooting

### Build Fails
- Check Node.js version (18+)
- Verify all dependencies are installed
- Check for TypeScript errors

### API Key Issues
- Ensure `VITE_OPENAI_API_KEY` is set in Netlify
- Verify API key is valid and has credits

### PDF Loading Issues
- Ensure PDF files are in the `public` folder
- Check file names match exactly

## 📊 Performance

- First load: ~2-3 seconds
- Subsequent loads: ~1 second
- Bundle size: ~2-3MB (optimized)

## 🔄 Updates

To update the deployment:
1. Push changes to your repository
2. Netlify will automatically rebuild
3. Changes will be live in 1-2 minutes

## 📞 Support

For issues with deployment:
1. Check Netlify build logs
2. Verify environment variables
3. Test locally with `npm run build`
