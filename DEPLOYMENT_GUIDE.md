# 🚀 FoodApp Deployment Guide - GitHub Pages

## Quick Deployment Steps

### 1. Create GitHub Repository
1. Go to [GitHub.com](https://github.com) and sign in to your account [@Alexr00t](https://github.com/Alexr00t)
2. Click the **"+"** button in the top right corner
3. Select **"New repository"**
4. Repository name: `foodapp`
5. Description: `Romanian Calorie & Nutrition Tracking App`
6. Make it **Public** (required for free GitHub Pages)
7. **DO NOT** initialize with README, .gitignore, or license (we already have files)
8. Click **"Create repository"**

### 2. Upload Files to GitHub
**Option A: Using GitHub Web Interface (Easiest)**
1. In your new repository, click **"uploading an existing file"**
2. Drag and drop all files from the `deploy/` folder:
   - `index.html`
   - `app.js`
   - `style.css`
   - `favicon.ico`
   - All `.json` files (products.json, restaurants.json, etc.)
   - `README.md`
3. Scroll down and click **"Commit changes"**

**Option B: Using Git Command Line**
```bash
cd deploy
git init
git add .
git commit -m "Initial commit: FoodApp deployment"
git branch -M main
git remote add origin https://github.com/Alexr00t/foodapp.git
git push -u origin main
```

### 3. Enable GitHub Pages
1. Go to your repository: `https://github.com/Alexr00t/foodapp`
2. Click on **"Settings"** tab
3. Scroll down to **"Pages"** section in the left sidebar
4. Under **"Source"**, select **"Deploy from a branch"**
5. Select **"main"** branch and **"/ (root)"** folder
6. Click **"Save"**
7. Wait 2-3 minutes for deployment

### 4. Access Your Live App
Your FoodApp will be available at:
**https://alexr00t.github.io/foodapp**

## 🎉 You're Done!

Your Romanian calorie tracking app is now live and accessible to anyone with the URL!

## 📝 Important Notes

- **Data Storage**: The app uses browser localStorage, so each user's data stays on their device
- **No Server Required**: This is a static site that works entirely in the browser
- **Free Hosting**: GitHub Pages is completely free for public repositories
- **Custom Domain**: You can later add a custom domain if desired

## 🔄 Updating Your App

To update your app:
1. Make changes to files in the `deploy/` folder
2. Upload the updated files to GitHub (same process as step 2)
3. Changes will be live within 2-3 minutes

## 🆘 Troubleshooting

**App not loading?**
- Check that all files are uploaded correctly
- Ensure GitHub Pages is enabled in repository settings
- Wait a few minutes for deployment to complete

**Features not working?**
- Make sure all `.json` data files are uploaded
- Check browser console for any errors
- Ensure you're using a modern browser (Chrome, Firefox, Safari, Edge)

## 📱 Sharing Your App

Share your app with this URL: **https://alexr00t.github.io/foodapp**

The app works on:
- ✅ Desktop computers
- ✅ Mobile phones
- ✅ Tablets
- ✅ Any device with a modern web browser
