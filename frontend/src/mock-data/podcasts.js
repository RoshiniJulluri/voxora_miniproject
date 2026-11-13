// Mock podcast data – updated to match reference image and requirements
export const mockPodcasts = [
  {
    id: 'pod-001',
    title: 'Renewable Energy: A Sustainable Future',
    topic: 'Renewable Energy',
    category: 'student',
    style: 'Educational',
    language: 'English',
    duration: '5-10',
    durationLabel: '12 min',
    level: 'Intermediate',
    createdAt: '2024-11-01T10:00:00Z',
    audioUrl: null,
    artwork: { gradient: 'linear-gradient(135deg,#22c55e,#15803d)', emoji: '🌱' },
    plays: 54,
    transcript: [
      { time: '00:00', text: "Welcome to VOXORA. In this episode, we'll explore renewable energy and why it is important for our future." },
      { time: '01:20', text: 'Renewable energy comes from natural sources like sunlight, wind, water, and biomass. Unlike fossil fuels, these sources are naturally replenished.' },
      { time: '02:45', text: 'Solar energy is one of the fastest-growing renewable sources. Photovoltaic cells convert sunlight directly into electricity.' },
      { time: '04:10', text: 'Wind energy harnesses the power of moving air. Modern wind turbines can generate enough electricity to power hundreds of homes.' },
      { time: '06:00', text: 'Hydropower uses flowing water to generate electricity, and it has been used for over a century. It is currently the largest renewable energy source.' },
      { time: '08:30', text: 'The transition to renewable energy is not just about the environment. It also creates millions of jobs and reduces energy costs in the long run.' },
      { time: '10:15', text: 'Countries around the world are setting ambitious renewable energy targets. The future of energy is clean, sustainable, and increasingly affordable.' },
    ],
    keyTakeaways: [
      'Renewable energy sources are naturally replenished and virtually inexhaustible',
      'Solar, wind, and hydropower are leading the energy transition globally',
      'Renewable energy creates jobs and reduces long-term energy costs',
      'The global transition to clean energy is accelerating with strong policy support',
      'Energy storage innovations are solving the intermittency challenge of renewables',
    ],
    quiz: [
      { id: 'q1', question: 'Which of the following is the largest renewable energy source today?', options: ['Solar Energy', 'Wind Energy', 'Hydropower', 'Geothermal'], correctAnswer: 2, explanation: 'Hydropower is currently the largest renewable energy source globally.' },
      { id: 'q2', question: 'What do photovoltaic cells convert?', options: ['Wind into heat', 'Sunlight into electricity', 'Water into hydrogen', 'Heat into mechanical energy'], correctAnswer: 1, explanation: 'Photovoltaic cells convert sunlight directly into electricity.' },
      { id: 'q3', question: 'Which statement about renewable energy is TRUE?', options: ['It is more expensive than fossil fuels permanently', 'It depletes over time like fossil fuels', 'It creates jobs and reduces long-term energy costs', 'It produces more CO₂ than coal'], correctAnswer: 2, explanation: 'Renewable energy creates millions of jobs and reduces energy costs in the long run.' },
      { id: 'q4', question: 'Renewable energy sources are naturally:', options: ['Finite and limited', 'Replenished continuously', 'Only available in warm climates', 'Dependent on fossil fuels'], correctAnswer: 1, explanation: 'Renewable energy sources are naturally and continuously replenished.' },
      { id: 'q5', question: 'What is the primary challenge being solved by energy storage innovations?', options: ['Cost of solar panels', 'Intermittency of renewable sources', 'Lack of wind in cities', 'Water scarcity for hydropower'], correctAnswer: 1, explanation: 'Energy storage innovations address the intermittency (variable availability) of renewable sources like solar and wind.' },
    ],
  },
  {
    id: 'pod-002',
    title: 'Artificial Intelligence in Daily Life',
    topic: 'Artificial Intelligence',
    category: 'professional',
    style: 'Informative',
    language: 'English',
    duration: '5-10',
    durationLabel: '10 min',
    level: 'Beginner',
    createdAt: '2024-11-02T09:30:00Z',
    audioUrl: null,
    artwork: { gradient: 'linear-gradient(135deg,#3b82f6,#1d4ed8)', emoji: '🤖' },
    plays: 32,
    transcript: [
      { time: '00:00', text: 'Artificial Intelligence is no longer science fiction. It is in your phone, your car, your home, and your workplace.' },
      { time: '02:00', text: 'Virtual assistants like Siri and Google Assistant use natural language processing to understand your questions and respond intelligently.' },
      { time: '04:30', text: 'Recommendation systems on Netflix, Spotify, and Amazon use AI to predict what you will enjoy next based on your history.' },
    ],
    keyTakeaways: [
      'AI is embedded in everyday applications we use constantly',
      'Natural language processing enables machines to understand human language',
      'Recommendation engines use AI to personalize experiences',
      'Machine learning improves system performance over time without explicit programming',
    ],
    quiz: [
      { id: 'q1', question: 'What technology powers virtual assistants like Siri?', options: ['Computer Vision', 'Natural Language Processing', 'Robotics', 'Blockchain'], correctAnswer: 1, explanation: 'Natural Language Processing (NLP) enables virtual assistants to understand and respond to human language.' },
      { id: 'q2', question: 'How do Netflix recommendations work?', options: ['Random suggestions', 'Manual editor picks', 'AI analyzing your history', 'Most popular content'], correctAnswer: 2, explanation: 'AI-powered recommendation systems analyze your viewing history to suggest relevant content.' },
    ],
  },
  {
    id: 'pod-003',
    title: 'Women in Technology',
    topic: 'Technology & Society',
    category: 'general',
    style: 'Storytelling',
    language: 'English',
    duration: '10-15',
    durationLabel: '15 min',
    level: 'Intermediate',
    createdAt: '2024-11-03T14:00:00Z',
    audioUrl: null,
    artwork: { gradient: 'linear-gradient(135deg,#ec4899,#9333ea)', emoji: '👩‍💻' },
    plays: 78,
    transcript: [
      { time: '00:00', text: 'The story of women in technology is one of brilliance, perseverance, and transformation.' },
      { time: '03:00', text: 'Ada Lovelace is often called the first computer programmer, writing algorithms for Charles Babbage\'s Analytical Engine in the 1840s.' },
    ],
    keyTakeaways: [
      'Women have been pioneers in computing since its earliest days',
      'Representation and inclusion drive innovation in technology',
      'Mentorship programs are crucial for increasing women in STEM',
    ],
    quiz: [
      { id: 'q1', question: 'Who is considered the first computer programmer?', options: ['Grace Hopper', 'Ada Lovelace', 'Marie Curie', 'Hedy Lamarr'], correctAnswer: 1, explanation: 'Ada Lovelace is credited as the first computer programmer for her work on Babbage\'s Analytical Engine.' },
    ],
  },
  {
    id: 'pod-004',
    title: 'The Indian Economy: An Overview',
    topic: 'Economics',
    category: 'student',
    style: 'Educational',
    language: 'Hindi',
    duration: '15-20',
    durationLabel: '20 min',
    level: 'Intermediate',
    createdAt: '2024-11-04T11:00:00Z',
    audioUrl: null,
    artwork: { gradient: 'linear-gradient(135deg,#f59e0b,#b45309)', emoji: '📈' },
    plays: 45,
    transcript: [
      { time: '00:00', text: 'India is the fifth-largest economy in the world and one of the fastest-growing major economies globally.' },
      { time: '03:30', text: 'The Indian economy is characterized by its large services sector, particularly in IT, finance, and telecommunications.' },
    ],
    keyTakeaways: [
      'India is the fifth-largest economy globally by GDP',
      'Services sector, especially IT, is the backbone of modern Indian economy',
      'Agriculture still employs a large portion of the workforce',
      'India\'s young demographic is a key economic advantage',
    ],
    quiz: [
      { id: 'q1', question: 'India is the ___-largest economy in the world.', options: ['Third', 'Fourth', 'Fifth', 'Sixth'], correctAnswer: 2, explanation: 'India is the fifth-largest economy in the world by nominal GDP.' },
    ],
  },
  {
    id: 'pod-005',
    title: 'Climate Change Explained',
    topic: 'Environment',
    category: 'general',
    style: 'Educational',
    language: 'English',
    duration: '5-10',
    durationLabel: '12 min',
    level: 'Beginner',
    createdAt: '2024-10-28T08:00:00Z',
    audioUrl: null,
    artwork: { gradient: 'linear-gradient(135deg,#10b981,#0f766e)', emoji: '🌍' },
    plays: 112,
    transcript: [
      { time: '00:00', text: 'Climate change is one of the most pressing challenges of our time, affecting every corner of the globe.' },
      { time: '02:00', text: 'The primary driver of modern climate change is the increase in greenhouse gases, especially CO₂ from burning fossil fuels.' },
    ],
    keyTakeaways: [
      'Global temperatures have risen 1.1°C since pre-industrial times',
      'CO₂ emissions from fossil fuels are the primary driver of climate change',
      'Renewable energy is now cost-competitive with fossil fuels',
      'Individual action combined with policy change is essential',
    ],
    quiz: [
      { id: 'q1', question: 'What is the primary cause of modern climate change?', options: ['Volcanic eruptions', 'Solar flares', 'Greenhouse gas emissions', 'Ocean currents'], correctAnswer: 2, explanation: 'Greenhouse gas emissions, particularly CO₂ from burning fossil fuels, are the primary driver of modern climate change.' },
    ],
  },
]

// ── ENUM OPTIONS ──────────────────────────────────────────

export const userCategories = [
  { id: 'student',      label: 'Student' },
  { id: 'professional', label: 'Professional' },
  { id: 'researcher',   label: 'Researcher' },
  { id: 'educator',     label: 'Educator' },
  { id: 'general',      label: 'General User' },
]

export const knowledgeLevels = [
  { id: 'beginner',      label: 'Beginner' },
  { id: 'intermediate',  label: 'Intermediate' },
  { id: 'professional',  label: 'Professional' },
]

export const podcastStyles = [
  { id: 'educational',   label: 'Educational' },
  { id: 'informative',   label: 'Informative' },
  { id: 'conversational',label: 'Conversational' },
  { id: 'storytelling',  label: 'Storytelling' },
  { id: 'interview',     label: 'Interview-style' },
  { id: 'news',          label: 'News & Updates' },
]

export const supportedLanguages = [
  { id: 'en',  label: 'English' },
  { id: 'te',  label: 'Telugu' },
  { id: 'hi',  label: 'Hindi' },
  { id: 'ta',  label: 'Tamil' },
  { id: 'kn',  label: 'Kannada' },
  { id: 'ml',  label: 'Malayalam' },
  { id: 'mr',  label: 'Marathi' },
  { id: 'bn',  label: 'Bengali' },
  { id: 'gu',  label: 'Gujarati' },
  { id: 'pa',  label: 'Punjabi' },
  { id: 'or',  label: 'Odia' },
  { id: 'as',  label: 'Assamese' },
  { id: 'ur',  label: 'Urdu' },
]

export const podcastDurations = [
  { id: '2-5',    label: '2–5 min',    minutes: 3  },
  { id: '5-10',   label: '5–10 min',   minutes: 7  },
  { id: '10-15',  label: '10–15 min',  minutes: 12 },
  { id: '15-20',  label: '15–20 min',  minutes: 17 },
  { id: '20-30',  label: '20–30 min',  minutes: 25 },
  { id: '30-45',  label: '30–45 min',  minutes: 37 },
  { id: 'custom', label: 'Custom',     minutes: null },
]

export const suggestedTopics = [
  'Quantum Computing', 'Indian Economy', 'Women in Tech',
  'Climate Change', 'Machine Learning', 'Space Exploration',
  'Blockchain', 'Mental Health', 'Entrepreneurship', 'History of India',
]

// ── MOCK USER STATS ───────────────────────────────────────
export const mockUserStats = {
  podcastsCreated: 12,
  totalListeningHrs: 6.8,
  topicsExplored: 5,
}
