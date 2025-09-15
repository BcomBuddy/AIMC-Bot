#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';

console.log('🚀 Building AIMC Assistant with fallback strategy...');

try {
  // Clean previous build
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true });
    console.log('✅ Cleaned previous build');
  }

  // Install dependencies with legacy peer deps
  console.log('📦 Installing dependencies...');
  execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });

  // Try different build approaches
  console.log('🔨 Attempting build...');
  
  try {
    // Try with simple config first
    execSync('npx vite build --config vite.config.simple.ts', { stdio: 'inherit' });
    console.log('✅ Simple build successful');
  } catch (error) {
    console.log('⚠️ Simple build failed, trying standard build...');
    
    try {
      // Try standard build
      execSync('npx vite build', { stdio: 'inherit' });
      console.log('✅ Standard build successful');
    } catch (error2) {
      console.log('⚠️ Standard build failed, trying with no minification...');
      
      try {
        // Try with no minification
        execSync('npx vite build --minify false', { stdio: 'inherit' });
        console.log('✅ No-minify build successful');
      } catch (error3) {
        console.log('❌ All build methods failed');
        console.log('Error details:', error3.message);
        process.exit(1);
      }
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
