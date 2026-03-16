import React, { useState, useEffect } from 'react';
import { Copy, Check, TrendingUp, Sparkles, X, ArrowRight, MessageCircle } from 'lucide-react';

export default function DeniMessageHelper() {
  const [currentView, setCurrentView] = useState('onboarding');
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [selectedCard, setSelectedCard] = useState(null);
  const [formData, setFormData] = useState({
    message: '',
    sender: '',
    tone: '',
    keyMessage: '',
    nickname: '',
    signOff: '',
    signOffCustom: '',
    additional: '',
    cardSpecific1: '',
    cardSpecific2: ''
  });
  const [voiceProfile, setVoiceProfile] = useState({
    samples: ['', '', ''],
    emojiUsage: '',
    messageLength: '',
    formality: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResponses, setGeneratedResponses] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showAnxietyModal, setShowAnxietyModal] = useState(false);
  const [anxietyModalType, setAnxietyModalType] = useState('before'); // 'before' or 'after'
  const [anxietyBefore, setAnxietyBefore] = useState(5);
  const [anxietyAfter, setAnxietyAfter] = useState(5);
  const [stats, setStats] = useState({
    totalResponses: 0,
    averageAnxiety: 0,
    anxietyHistory: [],
    improvementCount: 0,
    hasCompletedOnboarding: false
  });

  // Load data from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('deniMessageStats');
    const savedVoice = localStorage.getItem('deniVoiceProfile');
    
    if (savedStats) {
      try {
        const parsed = JSON.parse(savedStats);
        setStats(parsed);
        if (parsed.hasCompletedOnboarding) {
          setCurrentView('home');
        }
      } catch (e) {
        console.error('Error loading stats:', e);
      }
    }
    
    if (savedVoice) {
      try {
        setVoiceProfile(JSON.parse(savedVoice));
      } catch (e) {
        console.error('Error loading voice profile:', e);
      }
    }
  }, []);

  // Save data
  useEffect(() => {
    localStorage.setItem('deniMessageStats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('deniVoiceProfile', JSON.stringify(voiceProfile));
  }, [voiceProfile]);

  const MESSAGE_CARDS = [
    {
      id: 'checking-in',
      title: 'Just checking on me',
      icon: '💙',
      description: 'Someone reached out to see how you\'re doing',
      specific1: { label: 'How close are you?', type: 'select', options: ['Very close', 'Close', 'Casual friend', 'Acquaintance'] },
      specific2: { label: 'How much do you want to share?', type: 'select', options: ['Keep it light', 'Open up a bit', 'Be honest about struggles', 'Share good news'] }
    },
    {
      id: 'appearance',
      title: 'Compliment on appearance',
      icon: '✨',
      description: 'They said something nice about how you look',
      specific1: { label: 'What did they compliment?', type: 'text', placeholder: 'e.g., my outfit, hair, smile' },
      specific2: { label: 'How does it make you feel?', type: 'select', options: ['Happy/flattered', 'Awkward but nice', 'Uncomfortable', 'Confident'] }
    },
    {
      id: 'work',
      title: 'Compliment on work',
      icon: '🌟',
      description: 'They praised your work or achievement',
      specific1: { label: 'What project/task?', type: 'text', placeholder: 'e.g., presentation, report, design' },
      specific2: { label: 'Want to acknowledge others?', type: 'select', options: ['Just accept it', 'Share credit with team', 'Mention who helped', 'Keep focus on the work'] }
    },
    {
      id: 'personality',
      title: 'Compliment on personality',
      icon: '💜',
      description: 'They appreciated who you are as a person',
      specific1: { label: 'What trait did they mention?', type: 'text', placeholder: 'e.g., kindness, thoughtfulness, sense of humor' },
      specific2: { label: 'How does it feel?', type: 'select', options: ['Really touching', 'Means everything', 'Bit overwhelmed', 'Grateful they see this'] }
    },
    {
      id: 'offer-help',
      title: 'Ask if I need anything',
      icon: '🤝',
      description: 'They offered support or help',
      specific1: { label: 'Do you actually need help?', type: 'select', options: ['Yes, I could use support', 'Not right now but nice to know', 'I\'m okay', 'Maybe later'] },
      specific2: { label: 'Comfort level accepting help?', type: 'select', options: ['Easy to accept', 'Grateful but hesitant', 'Hard to ask for things', 'Want to reciprocate'] }
    },
    {
      id: 'feelings',
      title: 'Ask how I\'m feeling',
      icon: '🫂',
      description: 'They asked about your emotional state',
      specific1: { label: 'How are you really feeling?', type: 'select', options: ['Great actually', 'Pretty good', 'Struggling a bit', 'Not great', 'Mixed feelings'] },
      specific2: { label: 'Want to open up or keep light?', type: 'select', options: ['Open up fully', 'Share a bit', 'Keep it positive', 'Be honest but brief'] }
    },
    {
      id: 'general',
      title: 'General nice message',
      icon: '💌',
      description: 'A sweet or kind message',
      specific1: { label: 'Context of your relationship?', type: 'select', options: ['Best friends', 'Good friends', 'Family', 'Dating/romantic', 'Work friend', 'Casual'] },
      specific2: { label: 'Want to continue the conversation?', type: 'select', options: ['Yes, keep chatting', 'Quick reply only', 'Leave door open', 'Make plans'] }
    },
    {
      id: 'busy-later',
      title: 'I\'m too anxious right now',
      icon: '⏰',
      description: 'Need to say you\'ll respond later',
      specific1: { label: 'When will you respond?', type: 'select', options: ['Later today', 'Tomorrow', 'This weekend', 'Soon (no specific time)', 'When I can'] },
      specific2: { label: 'Reason to mention?', type: 'select', options: ['Just busy', 'Overwhelmed right now', 'Need time to think', 'No reason needed', 'Family/personal stuff'] }
    }
  ];

  const TONE_OPTIONS = [
    'Grateful', 'Warm', 'Casual', 'Professional', 'Cheeky', 
    'Hopeful', 'Melancholy', 'Enthusiastic', 'Sincere', 'Playful'
  ];

  const KEY_MESSAGE_OPTIONS = {
    'checking-in': ["I'm okay", "Doing well, thanks", "Feeling a bit low", "Really appreciate you checking", "Been busy but good"],
    'appearance': ["So sweet of you", "Thank you", "Appreciate it", "Made my day", "You're kind"],
    'work': ["Thank you", "Worked really hard on it", "Appreciate you noticing", "Means a lot", "Team effort"],
    'personality': ["This means so much", "Thank you for seeing that", "You're so kind", "Appreciate you", "That's touching"],
    'offer-help': ["I'm okay for now", "That's so kind", "I'll let you know", "Actually yes, if you don't mind", "Thank you for offering"],
    'feelings': ["Doing okay", "Been better, been worse", "Actually struggling a bit", "Feeling good", "It's complicated"],
    'general': ["So sweet", "Made my day", "Appreciate you", "Right back at you", "You're the best"],
    'busy-later': ["Will respond properly soon", "Need a bit of time", "I appreciate this", "Thanks for understanding", "I'll get back to you"]
  };

  const completeOnboarding = () => {
    setStats(prev => ({ ...prev, hasCompletedOnboarding: true }));
    setCurrentView('home');
  };

  const resetForm = () => {
    setFormData({
      message: '',
      sender: '',
      tone: '',
      keyMessage: '',
      nickname: '',
      signOff: '',
      signOffCustom: '',
      additional: '',
      cardSpecific1: '',
      cardSpecific2: ''
    });
    setGeneratedResponses([]);
    setSelectedCard(null);
    setCurrentView('home');
  };

  const handleGenerateResponses = async () => {
    setIsGenerating(true);
    setGeneratedResponses([]);

    const card = MESSAGE_CARDS.find(c => c.id === selectedCard);
    
    // Build voice profile context
    const voiceContext = voiceProfile.samples.filter(s => s.trim()).length > 0
      ? `DENI'S WRITING STYLE (learn from these examples):
${voiceProfile.samples.filter(s => s.trim()).map((sample, i) => `Example ${i + 1}: "${sample}"`).join('\n')}

STYLE PREFERENCES:
- Emoji usage: ${voiceProfile.emojiUsage}
- Message length: ${voiceProfile.messageLength}
- Formality level: ${voiceProfile.formality}

IMPORTANT: Match Deni's natural voice, tone, and style from the examples above. Use similar sentence structure, vocabulary, and emoji patterns.`
      : 'Write in a warm, genuine, casual tone that feels natural for a young person texting.';

    // Special handling for busy-later card
    const isBusyCard = selectedCard === 'busy-later';
    const contextNote = isBusyCard 
      ? `\n\nSPECIAL NOTE: Deni is feeling too anxious to respond properly right now. This is a brief message to acknowledge receipt and say she'll respond later. Keep it SHORT, kind, and low-pressure. She doesn't owe an explanation.`
      : '';

    const prompt = `You are helping Deni craft an authentic response to a message. Deni has anxiety around responding, especially to compliments.

${voiceContext}

MESSAGE TYPE: ${card.title}
MESSAGE RECEIVED: "${formData.message}"
FROM: ${formData.sender}
DESIRED TONE: ${formData.tone}
KEY MESSAGE: ${formData.keyMessage}
${card.specific1 ? `${card.specific1.label}: ${formData.cardSpecific1}` : ''}
${card.specific2 ? `${card.specific2.label}: ${formData.cardSpecific2}` : ''}
${formData.nickname ? `NICKNAME TO USE: ${formData.nickname}` : ''}
${formData.signOff === 'yes' ? 'SIGN OFF: End with "- Deni"' : formData.signOff === 'other' ? `SIGN OFF: End with "- ${formData.signOffCustom}"` : 'NO SIGN OFF needed'}
${formData.additional ? `ADDITIONAL CONTEXT: ${formData.additional}` : ''}${contextNote}

Generate 2 different response messages that:
1. Sound EXACTLY like Deni based on her writing samples (match her style, vocabulary, emoji usage)
2. Feel completely natural and authentic - not AI-generated
3. Match the requested tone perfectly
4. Convey the key message clearly
5. Are appropriately short (1-3 sentences unless more is natural for the context)${isBusyCard ? ' - ESPECIALLY brief for this "busy/later" message' : ''}
6. Address the specific context provided
${formData.nickname ? `7. Use "${formData.nickname}" naturally if it fits` : ''}

Format EXACTLY like this:

Response 1:
[First response here - write it exactly as Deni would text it]

Response 2:
[Second response here - different approach but still authentic to Deni's voice]

NO explanations, NO quotation marks around the responses, NO extra commentary. Just the two labeled responses that Deni can copy and send.`;

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${apiUrl}/api/generate-response`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate responses');
      }

      const data = await response.json();
      const text = data.content.find(c => c.type === 'text')?.text || '';
      
      // Parse responses
      const lines = text.trim().split('\n');
      const responses = [];
      let currentResponse = '';
      let inResponse = false;
      
      for (const line of lines) {
        if (line.startsWith('Response 1:')) {
          inResponse = true;
          currentResponse = line.replace('Response 1:', '').trim();
        } else if (line.startsWith('Response 2:')) {
          if (currentResponse) responses.push(currentResponse);
          currentResponse = line.replace('Response 2:', '').trim();
          inResponse = true;
        } else if (inResponse && line.trim()) {
          currentResponse += (currentResponse ? ' ' : '') + line.trim();
        }
      }
      if (currentResponse) responses.push(currentResponse);

      // Fallback if parsing failed
      if (responses.length < 2) {
        setGeneratedResponses([
          'Thank you so much! 💙',
          'I really appreciate you reaching out ☺️'
        ]);
      } else {
        setGeneratedResponses(responses.slice(0, 2));
      }
      
    } catch (error) {
      console.error('Error generating responses:', error);
      setGeneratedResponses([
        'Thank you so much! 💙',
        'I really appreciate this ☺️'
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyResponse = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleAnxietySubmit = () => {
    if (anxietyModalType === 'before') {
      // Store the before anxiety and proceed to form
      setAnxietyBefore(anxietyAfter); // Using anxietyAfter as the temp state
      setShowAnxietyModal(false);
      setCurrentView('form');
    } else {
      // This is after - calculate improvement
      const improvement = anxietyBefore - anxietyAfter;
      const newHistory = [...stats.anxietyHistory, { before: anxietyBefore, after: anxietyAfter }];
      const allAfterScores = newHistory.map(h => h.after);
      const newAverage = allAfterScores.reduce((a, b) => a + b, 0) / allAfterScores.length;
      
      setStats({
        ...stats,
        totalResponses: stats.totalResponses + 1,
        averageAnxiety: newAverage,
        anxietyHistory: newHistory,
        improvementCount: improvement > 0 ? stats.improvementCount + 1 : stats.improvementCount
      });
      
      setShowAnxietyModal(false);
      setAnxietyAfter(5); // Reset
      resetForm();
    }
  };

  const handleCardClick = (cardId) => {
    setSelectedCard(cardId);
    setAnxietyModalType('before');
    setAnxietyAfter(5); // Reset to middle for the modal
    setShowAnxietyModal(true);
  };

  const handleDoneClick = () => {
    setAnxietyModalType('after');
    setAnxietyAfter(5); // Reset to middle for the modal
    setShowAnxietyModal(true);
  };

  // Anxiety Rating Modal Component
  const AnxietyModal = () => {
    if (!showAnxietyModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          {anxietyModalType === 'before' ? (
            <>
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">💙</div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Before we start...</h3>
                <p className="text-slate-600">How anxious do you feel about responding right now?</p>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm text-slate-600 font-medium">Calm</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={anxietyAfter}
                    onChange={(e) => setAnxietyAfter(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gradient-to-r from-green-300 via-yellow-300 to-red-300 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-slate-600 font-medium">Anxious</span>
                </div>
                <div className="text-center">
                  <span className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {anxietyAfter}/10
                  </span>
                </div>
              </div>

              <button
                onClick={handleAnxietySubmit}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl hover:opacity-90 transition font-semibold shadow-md"
              >
                Continue
              </button>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">🎉</div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">You did it, Deni!</h3>
                <p className="text-slate-600">How anxious do you feel now after sending it?</p>
                <p className="text-sm text-purple-600 mt-2">Before: {anxietyBefore}/10</p>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm text-slate-600 font-medium">Calm</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={anxietyAfter}
                    onChange={(e) => setAnxietyAfter(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gradient-to-r from-green-300 via-yellow-300 to-red-300 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-slate-600 font-medium">Anxious</span>
                </div>
                <div className="text-center">
                  <span className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {anxietyAfter}/10
                  </span>
                </div>
                {anxietyAfter < anxietyBefore && (
                  <div className="mt-4 text-center">
                    <p className="text-sm font-semibold text-green-600">
                      🎉 You're feeling better! That's progress!
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={handleAnxietySubmit}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl hover:opacity-90 transition font-semibold shadow-md"
              >
                Submit
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  // ONBOARDING VIEW
  if (currentView === 'onboarding') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-4">
        <AnxietyModal />
        <div className="max-w-2xl mx-auto pt-12 pb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {onboardingStep === 1 && (
              <>
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">💌</div>
                  <h1 className="text-3xl font-bold text-slate-800 mb-2">Hey Deni! Welcome 💜</h1>
                  <p className="text-slate-600">Let's set this up so I can help you respond in YOUR voice</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-3">
                      First, I need to learn how you text
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                      Paste 3 recent messages you've sent (texts, WhatsApp, emails - any casual messages). 
                      This helps me match your natural voice so responses feel like YOU. 💙
                    </p>
                    
                    {[0, 1, 2].map((index) => (
                      <div key={index} className="mb-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Message example {index + 1}
                        </label>
                        <textarea
                          value={voiceProfile.samples[index]}
                          onChange={(e) => {
                            const newSamples = [...voiceProfile.samples];
                            newSamples[index] = e.target.value;
                            setVoiceProfile({...voiceProfile, samples: newSamples});
                          }}
                          className="w-full border-2 border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-slate-700"
                          rows="3"
                          placeholder="Paste a message you've sent..."
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setOnboardingStep(2)}
                    disabled={voiceProfile.samples.filter(s => s.trim()).length === 0}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2"
                  >
                    Next
                    <ArrowRight size={20} />
                  </button>
                </div>
              </>
            )}

            {onboardingStep === 2 && (
              <>
                <div className="text-center mb-8">
                  <div className="text-5xl mb-4">✨</div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">A few quick preferences</h2>
                  <p className="text-slate-600">This helps me match your style even better</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      How do you use emojis?
                    </label>
                    <select
                      value={voiceProfile.emojiUsage}
                      onChange={(e) => setVoiceProfile({...voiceProfile, emojiUsage: e.target.value})}
                      className="w-full border-2 border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-slate-700"
                    >
                      <option value="">Select...</option>
                      <option value="lots">I use them a lot! 🎉✨💜</option>
                      <option value="moderate">Occasionally, when it feels right 😊</option>
                      <option value="rarely">Rarely or never</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Typical message length?
                    </label>
                    <select
                      value={voiceProfile.messageLength}
                      onChange={(e) => setVoiceProfile({...voiceProfile, messageLength: e.target.value})}
                      className="w-full border-2 border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-slate-700"
                    >
                      <option value="">Select...</option>
                      <option value="short">Short and sweet (1-2 sentences)</option>
                      <option value="medium">Medium (2-4 sentences)</option>
                      <option value="longer">I write longer messages</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      How formal/casual are you?
                    </label>
                    <select
                      value={voiceProfile.formality}
                      onChange={(e) => setVoiceProfile({...voiceProfile, formality: e.target.value})}
                      className="w-full border-2 border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-slate-700"
                    >
                      <option value="">Select...</option>
                      <option value="very-casual">Very casual (hey! omg haha)</option>
                      <option value="casual">Casual but clear</option>
                      <option value="balanced">Mix of both</option>
                      <option value="polished">More polished/proper</option>
                    </select>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setOnboardingStep(1)}
                      className="flex-1 py-3 px-6 border-2 border-slate-300 rounded-xl text-slate-700 font-semibold hover:bg-slate-50 transition"
                    >
                      Back
                    </button>
                    <button
                      onClick={completeOnboarding}
                      disabled={!voiceProfile.emojiUsage || !voiceProfile.messageLength || !voiceProfile.formality}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed font-semibold"
                    >
                      Let's go! 🎉
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // HOME VIEW
  if (currentView === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-4">
        <AnxietyModal />
        <div className="max-w-4xl mx-auto pt-8 pb-12">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">💌</div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
              Deni's Message Helper
            </h1>
            <p className="text-slate-600">You've got this. Let's respond together. 💜</p>
          </div>

          {/* PROGRESS DASHBOARD - Always visible */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="text-purple-600" size={24} />
              <h2 className="text-xl font-bold text-slate-800">Your Progress</h2>
            </div>
            
            {stats.totalResponses === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-500">No messages sent yet. Let's get started! 💪</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
                  <div className="text-3xl font-bold text-purple-700">{stats.totalResponses}</div>
                  <div className="text-sm text-purple-600 font-medium">Messages Sent</div>
                </div>
                <div className="bg-pink-50 rounded-xl p-5 border border-pink-200">
                  <div className="text-3xl font-bold text-pink-700">{stats.averageAnxiety.toFixed(1)}/10</div>
                  <div className="text-sm text-pink-600 font-medium">Avg Anxiety After</div>
                </div>
                <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                  <div className="text-3xl font-bold text-green-700">{stats.improvementCount}</div>
                  <div className="text-sm text-green-600 font-medium">Times Felt Better</div>
                  {stats.anxietyHistory.length >= 2 && (
                    <div className="text-xs text-green-500 mt-1">
                      {stats.improvementCount > stats.totalResponses / 2 
                        ? '📈 Great progress!' 
                        : '💪 Keep going!'}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">What kind of message did you receive?</h2>
            <p className="text-slate-600 mb-6">Pick the card that matches your situation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MESSAGE_CARDS.map((card) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-6 text-left border-2 border-transparent hover:border-purple-400 group"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{card.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-800 group-hover:text-purple-700 transition mb-1">
                      {card.title}
                    </h3>
                    <p className="text-sm text-slate-600">{card.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // FORM VIEW
  if (currentView === 'form') {
    const card = MESSAGE_CARDS.find(c => c.id === selectedCard);
    const keyMessageOptions = KEY_MESSAGE_OPTIONS[selectedCard] || [];

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 p-4">
        <AnxietyModal />
        <div className="max-w-3xl mx-auto pt-8 pb-12">
          <button
            onClick={() => setCurrentView('home')}
            className="mb-6 text-purple-600 hover:text-purple-700 font-medium"
          >
            ← Back to cards
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="text-4xl">{card.icon}</div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">{card.title}</h2>
                <p className="text-slate-600 text-sm">{card.description}</p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Message received */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  1. What message did you receive? *
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full border-2 border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-slate-700"
                  rows="3"
                  placeholder="Paste or type the message here..."
                />
              </div>

              {/* Who sent it */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  2. Who sent it? *
                </label>
                <input
                  type="text"
                  value={formData.sender}
                  onChange={(e) => setFormData({...formData, sender: e.target.value})}
                  className="w-full border-2 border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-slate-700"
                  placeholder="e.g., my best friend, my mom, my colleague"
                />
              </div>

              {/* Tone */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  3. What tone do you want? *
                </label>
                <select
                  value={formData.tone}
                  onChange={(e) => setFormData({...formData, tone: e.target.value})}
                  className="w-full border-2 border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-slate-700"
                >
                  <option value="">Select a tone...</option>
                  {TONE_OPTIONS.map(tone => (
                    <option key={tone} value={tone}>{tone}</option>
                  ))}
                </select>
              </div>

              {/* Key message */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  4. What's your key message? *
                </label>
                <select
                  value={formData.keyMessage}
                  onChange={(e) => setFormData({...formData, keyMessage: e.target.value})}
                  className="w-full border-2 border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-slate-700"
                >
                  <option value="">Select...</option>
                  {keyMessageOptions.map(msg => (
                    <option key={msg} value={msg}>{msg}</option>
                  ))}
                </select>
              </div>

              {/* Card-specific field 1 */}
              {card.specific1 && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    5. {card.specific1.label}
                  </label>
                  {card.specific1.type === 'select' ? (
                    <select
                      value={formData.cardSpecific1}
                      onChange={(e) => setFormData({...formData, cardSpecific1: e.target.value})}
                      className="w-full border-2 border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-slate-700"
                    >
                      <option value="">Select...</option>
                      {card.specific1.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={formData.cardSpecific1}
                      onChange={(e) => setFormData({...formData, cardSpecific1: e.target.value})}
                      className="w-full border-2 border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-slate-700"
                      placeholder={card.specific1.placeholder}
                    />
                  )}
                </div>
              )}

              {/* Card-specific field 2 */}
              {card.specific2 && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    6. {card.specific2.label}
                  </label>
                  {card.specific2.type === 'select' ? (
                    <select
                      value={formData.cardSpecific2}
                      onChange={(e) => setFormData({...formData, cardSpecific2: e.target.value})}
                      className="w-full border-2 border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-slate-700"
                    >
                      <option value="">Select...</option>
                      {card.specific2.options.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={formData.cardSpecific2}
                      onChange={(e) => setFormData({...formData, cardSpecific2: e.target.value})}
                      className="w-full border-2 border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-slate-700"
                      placeholder={card.specific2.placeholder}
                    />
                  )}
                </div>
              )}

              {/* Nickname */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  7. Any nickname they go by? (optional)
                </label>
                <input
                  type="text"
                  value={formData.nickname}
                  onChange={(e) => setFormData({...formData, nickname: e.target.value})}
                  className="w-full border-2 border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-slate-700"
                  placeholder="e.g., babe, hun, mate"
                />
              </div>

              {/* Sign off */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  8. Do you want to sign off at the end?
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="signOff"
                      value="yes"
                      checked={formData.signOff === 'yes'}
                      onChange={(e) => setFormData({...formData, signOff: e.target.value})}
                      className="text-purple-600"
                    />
                    <span className="text-slate-700">Yes, sign "- Deni"</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="signOff"
                      value="no"
                      checked={formData.signOff === 'no'}
                      onChange={(e) => setFormData({...formData, signOff: e.target.value})}
                      className="text-purple-600"
                    />
                    <span className="text-slate-700">No sign-off</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="signOff"
                      value="other"
                      checked={formData.signOff === 'other'}
                      onChange={(e) => setFormData({...formData, signOff: e.target.value})}
                      className="text-purple-600"
                    />
                    <span className="text-slate-700">Other:</span>
                  </label>
                  {formData.signOff === 'other' && (
                    <input
                      type="text"
                      value={formData.signOffCustom}
                      onChange={(e) => setFormData({...formData, signOffCustom: e.target.value})}
                      className="w-full border-2 border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-slate-700 ml-6"
                      placeholder="Your custom sign-off"
                    />
                  )}
                </div>
              </div>

              {/* Anything else */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  9. Anything else to add? (optional)
                </label>
                <textarea
                  value={formData.additional}
                  onChange={(e) => setFormData({...formData, additional: e.target.value})}
                  className="w-full border-2 border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-slate-700"
                  rows="2"
                  placeholder="Any other context or special requests..."
                />
              </div>
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerateResponses}
            disabled={!formData.message || !formData.sender || !formData.tone || !formData.keyMessage || isGenerating}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed font-semibold shadow-md flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Generating responses...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Run with AI
              </>
            )}
          </button>

          {/* Generated Responses */}
          {generatedResponses.length > 0 && (
            <div className="mt-8 space-y-4">
              {/* Instructions */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200 mb-6">
                <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                  <MessageCircle className="text-blue-600" size={20} />
                  Next steps:
                </h3>
                <ol className="text-sm text-blue-800 space-y-2 ml-6 list-decimal">
                  <li>Copy the response you like</li>
                  <li>Send it to the person</li>
                  <li>Come back here and click "Done" below to track how you feel now!</li>
                </ol>
              </div>

              <h3 className="text-xl font-bold text-slate-800 mb-4">Your response options:</h3>
              {generatedResponses.map((response, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md p-5 border-2 border-purple-200">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <span className="text-sm font-semibold text-purple-600">Response {index + 1}</span>
                  </div>
                  <p className="text-slate-800 mb-4 leading-relaxed whitespace-pre-wrap">{response}</p>
                  <button
                    onClick={() => handleCopyResponse(response, index)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm font-medium"
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check size={16} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              ))}

              {/* Done Button */}
              <div className="mt-6">
                <button
                  onClick={handleDoneClick}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl hover:opacity-90 transition font-semibold shadow-md flex items-center justify-center gap-2"
                >
                  <Check size={20} />
                  I sent it! Mark how I feel now
                </button>
              </div>
            </div>
          )}

          {generatedResponses.length > 0 && (
            <button
              onClick={resetForm}
              className="w-full mt-6 bg-slate-200 text-slate-700 py-3 px-6 rounded-xl hover:bg-slate-300 transition font-medium"
            >
              Start over
            </button>
          )}
        </div>
      </div>
    );
  }

  // Fallback (shouldn't reach here)
  return null;
}