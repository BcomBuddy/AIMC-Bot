#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building AIMC Assistant for Netlify...');

try {
  // Clean previous build
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true });
    console.log('✅ Cleaned previous build');
  }

  // Install dependencies
  console.log('📦 Installing dependencies...');
  execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });

  // Try different build approaches
  console.log('🔨 Attempting build...');
  
  try {
    // Try standard build first
    execSync('npm run build:standard', { stdio: 'inherit' });
    console.log('✅ Standard build successful');
  } catch (error) {
    console.log('⚠️ Standard build failed, trying alternative...');
    
    try {
      // Try with esbuild
      execSync('npx vite build --mode production', { stdio: 'inherit' });
      console.log('✅ Alternative build successful');
    } catch (error2) {
      console.log('❌ All build methods failed');
      console.log('💡 Try deploying directly from development mode');
      process.exit(1);
    }
  }

  // Verify build output
  if (fs.existsSync('dist')) {
    console.log('✅ Build completed successfully');
    console.log('📁 Output directory: dist/');
    console.log('🚀 Ready for Netlify deployment!');
  } else {
    console.log('❌ Build output not found');
    process.exit(1);
  }

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
