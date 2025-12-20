
# CopyTrade Deployment Guide

Follow these 3 steps to launch your app:

### 1. Get your API Key
Go to [Google AI Studio](https://aistudio.google.com/app/apikey) and create a free Gemini API Key.

### 2. Put Files on GitHub
1. Create a folder on your computer.
2. Put all the files from this chat into that folder.
3. Upload that folder to a new GitHub repository.

### 3. Connect to Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **"Add New"** > **"Project"**.
3. Import your GitHub repository.
4. **CRITICAL STEP**: Open the "Environment Variables" section.
   - **Name**: `API_KEY`
   - **Value**: (Paste your Gemini Key here)
5. Click **"Deploy"**.

### Done!
Your app is now live. Open the link on your phone, click "Install App", and you're a professional trader!
