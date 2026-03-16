# 💌 Deni's Message Helper

A supportive app to help manage anxiety around responding to messages. Features AI-powered response suggestions that match your personal writing style, anxiety tracking, and progress monitoring.

## ✨ Features

- **Personalized Responses**: AI learns your writing style from sample messages
- **8 Message Types**: Compliments, check-ins, work praise, and more
- **Anxiety Tracking**: Track before/after anxiety levels
- **Progress Dashboard**: See your improvement over time
- **"Too Anxious" Card**: Generate "I'll respond later" messages when needed

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Anthropic API key ([Get one here](https://console.anthropic.com/))

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd deni-message-helper
```

2. **Install all dependencies**
```bash
npm run install-all
```

3. **Set up environment variables**

In the `server` folder, create a `.env` file:
```bash
cd server
cp .env.example .env
```

Edit `server/.env` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
```

4. **Run the app**

From the root directory:
```bash
npm run dev
```

This starts both:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 📁 Project Structure

```
deni-message-helper/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── App.js         # Main component
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Styles
│   └── package.json
├── server/                 # Express backend
│   ├── index.js           # API server
│   ├── package.json
│   └── .env               # API keys (create this!)
├── package.json           # Root package.json
└── README.md
```

## 🌐 Deployment

### Option 1: Deploy to Vercel (Recommended - Easiest)

**Frontend (Vercel)**
1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Set Root Directory to `client`
5. Add environment variable: `REACT_APP_API_URL=<your-backend-url>`
6. Deploy!

**Backend (Render/Railway/Fly.io)**
1. Create new Web Service on [Render](https://render.com)
2. Connect your GitHub repo
3. Set Root Directory to `server`
4. Add environment variable: `ANTHROPIC_API_KEY=sk-ant-xxxxx`
5. Deploy!
6. Copy the backend URL and add it to Vercel frontend env vars

### Option 2: Deploy to Netlify + Railway

**Frontend (Netlify)**
1. Push to GitHub
2. Go to [Netlify](https://netlify.com)
3. New site from Git → select your repo
4. Base directory: `client`
5. Build command: `npm run build`
6. Publish directory: `client/build`
7. Add env var: `REACT_APP_API_URL=<your-backend-url>`

**Backend (Railway)**
1. Go to [Railway](https://railway.app)
2. New Project → Deploy from GitHub
3. Select your repo
4. Root directory: `server`
5. Add env var: `ANTHROPIC_API_KEY=sk-ant-xxxxx`
6. Deploy!

### Option 3: Single Server (Both frontend + backend)

You can serve the React build from the Express server:

1. Build the frontend:
```bash
cd client
npm run build
```

2. Update `server/index.js` to serve static files:
```javascript
// Add after other middleware
app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});
```

3. Deploy to a single platform (Render, Railway, Fly.io, etc.)

## 🔑 Getting an Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Sign up or log in
3. Go to API Keys section
4. Create a new API key
5. Copy it to your `server/.env` file

**Important**: Never commit your `.env` file or share your API key!

## 🛡️ Security Notes

- ✅ API key is stored securely on the backend
- ✅ Frontend never sees the API key
- ✅ `.env` files are in `.gitignore`
- ⚠️ Make sure to use HTTPS in production
- ⚠️ Consider adding rate limiting for production

## 📊 Usage

1. **First Time**: Complete onboarding - paste 3 sample messages you've sent
2. **Select Card**: Choose what type of message you received
3. **Rate Anxiety**: Before starting, rate how anxious you feel
4. **Fill Form**: Answer questions about the message
5. **Get Responses**: AI generates 2 options in YOUR voice
6. **Copy & Send**: Copy the one you like and send it
7. **Track Progress**: Mark how you feel after sending

## 🤝 Contributing

Feel free to open issues or submit pull requests!

## 📝 License

MIT License - feel free to use this for personal or commercial projects

## 💜 Support

This app was created to help manage message anxiety. If it helps you, that's amazing! Feel free to customize it for your own needs.

---

Made with 💜 for Deni
