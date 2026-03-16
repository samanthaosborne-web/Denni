# 💌 Deni's Message Helper - Vercel Deployment

Super simple deployment to Vercel with secure API key handling!

## 🚀 Deploy to Vercel (5 minutes)

### Step 1: Upload to GitHub

1. Go to your GitHub repository: https://github.com/samanthaosborne-web/deni
2. Delete all existing files
3. Upload these files:
   - `index.html`
   - `package.json`
   - `vercel.json`
   - `api/generate-response.js`

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repo: `samanthaosborne-web/deni`
4. Click **"Deploy"** (don't change any settings)
5. Wait for deployment to complete (1-2 minutes)

### Step 3: Add Your API Key

1. Go to your project dashboard on Vercel
2. Click **"Settings"** → **"Environment Variables"**
3. Add a new variable:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** Your Anthropic API key (get from https://console.anthropic.com/)
4. Click **"Save"**
5. Go to **"Deployments"** → Click the 3 dots on latest deployment → **"Redeploy"**

### Step 4: Done! 🎉

Your app is now live at: `https://your-project-name.vercel.app`

No API key needed on the frontend - it's all secure on the backend!

## 📁 Project Structure

```
deni/
├── index.html              # Frontend (the app Deni uses)
├── api/
│   └── generate-response.js   # Backend API (secure)
├── vercel.json             # Vercel configuration
└── package.json            # Project metadata
```

## 🔑 Getting an Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Sign up or log in
3. Click **"API Keys"** in the sidebar
4. Click **"Create Key"**
5. Copy the key (starts with `sk-ant-`)
6. Paste it into Vercel environment variables

## 🔒 Security

- ✅ API key stored securely in Vercel (never exposed to users)
- ✅ Frontend never sees the API key
- ✅ All data stored locally in user's browser
- ✅ HTTPS by default on Vercel

## 🎯 Usage

Just share the Vercel URL with Deni:
- No setup required
- No API key to enter
- Just open and use!

## 🛠️ Troubleshooting

**"API key not configured" error:**
- Make sure you added the `ANTHROPIC_API_KEY` environment variable in Vercel
- Make sure you redeployed after adding it

**"Failed to generate response":**
- Check that your Anthropic API key is valid
- Make sure you have credits in your Anthropic account

## 💜 That's it!

The app is now live and Deni can use it anytime without worrying about API keys!
