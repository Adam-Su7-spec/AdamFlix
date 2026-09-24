import { Movie, User, HomepageConfig } from '../types';

export const HERO_SCIFI_IMAGE = '/src/assets/images/hero_scifi_voyage_1790165629911.jpg';
export const BACKDROP_NOIR_IMAGE = '/src/assets/images/backdrop_neon_noir_1790165645799.jpg';
export const BACKDROP_FANTASY_IMAGE = '/src/assets/images/backdrop_fantasy_realm_1790165657538.jpg';
export const BACKDROP_ACTION_IMAGE = '/src/assets/images/backdrop_action_pursuit_1790165670034.jpg';

// Standard high-quality open-source legal video demo streams for the video player
const DEMO_VIDEO_SOURCES = [
  {
    id: 'srv-1',
    name: 'Server 1 (Alpha High-Speed CDN)',
    quality: '4K' as const,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
  },
  {
    id: 'srv-2',
    name: 'Server 2 (Beta 1080p Direct)',
    quality: 'FHD' as const,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  },
  {
    id: 'srv-3',
    name: 'Server 3 (Gamma Adaptive Stream)',
    quality: 'HD' as const,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
  }
];

const STANDARD_SUBTITLES = [
  { id: 'sub-en', label: 'English', lang: 'en', url: '' },
  { id: 'sub-en-cc', label: 'English [CC]', lang: 'en', url: '' },
  { id: 'sub-es', label: 'Spanish', lang: 'es', url: '' },
  { id: 'sub-fr', label: 'French', lang: 'fr', url: '' }
];

export const INITIAL_MOVIES: Movie[] = [
  {
    id: 'm1',
    slug: 'chronicles-of-the-void',
    title: 'Chronicles of the Void',
    originalTitle: 'Chronicles of the Void: Horizon Zero',
    type: 'movie',
    description: 'When an enigmatic alien beacon awakens on the edge of the Kuiper belt, an elite reconnaissance crew embarks on an expedition through uncharted wormholes to safeguard human civilization from an ancient cosmic singularity.',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    backdrop: HERO_SCIFI_IMAGE,
    releaseYear: 2026,
    genres: ['Science Fiction', 'Adventure', 'Action'],
    rating: 9.3,
    duration: '2h 28m',
    country: 'United States',
    director: 'Marcus Vance',
    cast: ['Elena Rostova', 'David Chen', 'Sarah Kensington', 'Kaelen Miller', 'Victor Thorne'],
    trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    videoSources: DEMO_VIDEO_SOURCES,
    subtitles: STANDARD_SUBTITLES,
    quality: '4K',
    badges: ['NEW', 'TRENDING', 'TOP RATED'],
    views: 489200,
    featured: true,
    addedAt: '2026-03-12'
  },
  {
    id: 'm2',
    slug: 'neon-syndicate-tokyo-2088',
    title: 'Neon Syndicate: Tokyo 2088',
    originalTitle: 'Neon Syndicate',
    type: 'movie',
    description: 'In a rain-drenched cyberpunk metropolis governed by megacorporations and neural syndicates, a disgraced cybernetic detective unravels a corporate conspiracy that threatens to rewrite human consciousness.',
    poster: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
    backdrop: BACKDROP_NOIR_IMAGE,
    releaseYear: 2025,
    genres: ['Science Fiction', 'Action', 'Thriller'],
    rating: 8.9,
    duration: '2h 14m',
    country: 'Japan / United Kingdom',
    director: 'Kenji Takahashi',
    cast: ['Ryohei Matsuda', 'Maya Lin', 'Caleb Adams', 'Sofia De Luca'],
    trailerUrl: '',
    videoSources: DEMO_VIDEO_SOURCES,
    subtitles: STANDARD_SUBTITLES,
    quality: '4K',
    badges: ['TRENDING', 'TOP RATED'],
    views: 342100,
    featured: true,
    addedAt: '2026-02-18'
  },
  {
    id: 'm3',
    slug: 'the-last-citadel',
    title: 'The Last Citadel: Dawn of Kings',
    originalTitle: 'The Last Citadel',
    type: 'movie',
    description: 'Surrounded by frostbound peaks and mythological beasts, the guardians of the high fortress must unite fractured kingdoms before the eclipse unleashes the slumbering titans of the forgotten age.',
    poster: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
    backdrop: BACKDROP_FANTASY_IMAGE,
    releaseYear: 2025,
    genres: ['Fantasy', 'Adventure', 'Drama'],
    rating: 8.7,
    duration: '2h 42m',
    country: 'United Kingdom / New Zealand',
    director: 'Alistair Sterling',
    cast: ['Gareth MacLeod', 'Lyra Pendelton', 'Arthur Pendelton', 'Branimir Holt'],
    videoSources: DEMO_VIDEO_SOURCES,
    subtitles: STANDARD_SUBTITLES,
    quality: '4K',
    badges: ['TOP RATED'],
    views: 298500,
    featured: true,
    addedAt: '2026-01-20'
  },
  {
    id: 'm4',
    slug: 'velocity-overdrive',
    title: 'Velocity: Overdrive',
    originalTitle: 'Velocity',
    type: 'movie',
    description: 'An underground street racer and ex-formula champion is coerced into an international syndicate chase spanning five continents, pushing experimental hypercars to lethal thresholds.',
    poster: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=800&auto=format&fit=crop&q=80',
    backdrop: BACKDROP_ACTION_IMAGE,
    releaseYear: 2026,
    genres: ['Action', 'Thriller'],
    rating: 8.4,
    duration: '1h 56m',
    country: 'United States / Germany',
    director: 'Harrison Drake',
    cast: ['Jaxson Reed', 'Mira Novak', 'Carlos Santana', 'Zack Wheeler'],
    videoSources: DEMO_VIDEO_SOURCES,
    subtitles: STANDARD_SUBTITLES,
    quality: '4K',
    badges: ['NEW', 'TRENDING'],
    views: 412000,
    featured: true,
    addedAt: '2026-03-01'
  },
  {
    id: 'm5',
    slug: 'shadows-in-the-mist',
    title: 'Shadows in the Mist',
    originalTitle: 'Shadows in the Mist',
    type: 'movie',
    description: 'A secluded lighthouse keeper on a storm-swept coastal island discovers an ancient maritime secret washed ashore, turning a peaceful night into an escalating psychological nightmare.',
    poster: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=800&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=1600&auto=format&fit=crop&q=80',
    releaseYear: 2025,
    genres: ['Horror', 'Mystery', 'Thriller'],
    rating: 8.2,
    duration: '1h 48m',
    country: 'Canada / Ireland',
    director: 'Fiona Gallagher',
    cast: ['Colm Feore', 'Hannah Murray', 'Brendan Gleeson Jr.'],
    videoSources: DEMO_VIDEO_SOURCES,
    subtitles: STANDARD_SUBTITLES,
    quality: 'FHD',
    badges: ['NEW'],
    views: 185400,
    addedAt: '2026-02-10'
  },
  {
    id: 'm6',
    slug: 'the-grand-laugh-conspiracy',
    title: 'The Grand Laugh Conspiracy',
    originalTitle: 'The Grand Laugh Conspiracy',
    type: 'movie',
    description: 'Two delightfully inept detectives masquerade as Michelin-star pastry chefs in Paris to foil an eccentric billionaire art thief targeting the royal palace bakery.',
    poster: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=800&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600&auto=format&fit=crop&q=80',
    releaseYear: 2026,
    genres: ['Comedy', 'Crime', 'Adventure'],
    rating: 7.9,
    duration: '1h 42m',
    country: 'France / United States',
    director: 'Jean-Luc Moreau',
    cast: ['Simon Pegg', 'Pierre Richard', 'Camille Cottin', 'Bradley Whitford'],
    videoSources: DEMO_VIDEO_SOURCES,
    subtitles: STANDARD_SUBTITLES,
    quality: 'FHD',
    badges: ['NEW'],
    views: 154200,
    addedAt: '2026-03-05'
  },
  {
    id: 'm7',
    slug: 'echoes-of-the-serengeti',
    title: 'Echoes of the Serengeti',
    originalTitle: 'Echoes of the Serengeti: Wild Heart',
    type: 'movie',
    description: 'Captured over four seasons in groundbreaking 8K Ultra High Definition, witness the raw survival, migration triumphs, and majestic ecosystem of East Africa in breathtaking intimacy.',
    poster: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?w=1600&auto=format&fit=crop&q=80',
    releaseYear: 2025,
    genres: ['Documentary', 'Adventure'],
    rating: 9.5,
    duration: '1h 35m',
    country: 'Kenya / United Kingdom',
    director: 'Sir David Attenborough (Narrator)',
    cast: ['David Attenborough', 'Amina Mwangi'],
    videoSources: DEMO_VIDEO_SOURCES,
    subtitles: STANDARD_SUBTITLES,
    quality: '4K',
    badges: ['TOP RATED'],
    views: 243000,
    addedAt: '2025-11-20'
  },
  {
    id: 'm8',
    slug: 'celestial-odyssey',
    title: 'Celestial Odyssey: Starlight Realm',
    originalTitle: 'Celestial Odyssey',
    type: 'movie',
    description: 'An animated visual symphony following a young astral cartographer who discovers how to paint constellations, breathing life into mythological star beasts that protect peaceful worlds.',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1600&auto=format&fit=crop&q=80',
    releaseYear: 2026,
    genres: ['Animation', 'Fantasy', 'Family'],
    rating: 9.1,
    duration: '1h 50m',
    country: 'Japan / United States',
    director: 'Makoto Hoshino',
    cast: ['Yuki Yamada', 'Clara Hughes', 'Ken Watanabe'],
    videoSources: DEMO_VIDEO_SOURCES,
    subtitles: STANDARD_SUBTITLES,
    quality: '4K',
    badges: ['NEW', 'TOP RATED'],
    views: 310500,
    addedAt: '2026-03-08'
  },
  {
    id: 'm9',
    slug: 'the-venice-affair',
    title: 'The Venice Affair',
    originalTitle: 'The Venice Affair',
    type: 'movie',
    description: 'Set along the moonlit canals of autumn Venice, a classical pianist and an undercover diplomat become tangled in a high-stakes intelligence game while fighting forbidden passion.',
    poster: 'https://images.unsplash.com/photo-1523906834658-6e2b32c729a4?w=800&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=1600&auto=format&fit=crop&q=80',
    releaseYear: 2025,
    genres: ['Romance', 'Drama', 'Mystery'],
    rating: 8.1,
    duration: '2h 02m',
    country: 'Italy / France',
    director: 'Matteo Rossi',
    cast: ['Giulia De Angelis', 'Julian Mercer', 'Vincent Cassel'],
    videoSources: DEMO_VIDEO_SOURCES,
    subtitles: STANDARD_SUBTITLES,
    quality: 'FHD',
    views: 128900,
    addedAt: '2025-12-14'
  },
  {
    id: 'm10',
    slug: 'cold-protocol',
    title: 'Cold Protocol: Arctic Breach',
    originalTitle: 'Cold Protocol',
    type: 'movie',
    description: 'When an offshore deep-sea drilling rig penetrates a subglacial volcanic fissure in Antarctica, the team encounters an organism that adapts, mimics, and isolates them from the surface.',
    poster: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=800&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&auto=format&fit=crop&q=80',
    releaseYear: 2026,
    genres: ['Horror', 'Science Fiction', 'Thriller'],
    rating: 8.3,
    duration: '1h 54m',
    country: 'Norway / United States',
    director: 'Astrid Lindgren',
    cast: ['Soren Mikkelsen', 'Erika Vance', 'Lars Eidinger'],
    videoSources: DEMO_VIDEO_SOURCES,
    subtitles: STANDARD_SUBTITLES,
    quality: '4K',
    badges: ['NEW'],
    views: 221000,
    addedAt: '2026-03-02'
  },

  // TV SHOWS
  {
    id: 'tv1',
    slug: 'chronosphere-syndicate',
    title: 'Chronosphere: Syndicate',
    originalTitle: 'Chronosphere',
    type: 'tv',
    description: 'When temporal shifts begin erasing key historical milestones, a clandestine squad of chrononavigators must hunt down rogue time travelers across Renaissance Florence, Victorian London, and 2099 Neo-Tokyo.',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    backdrop: BACKDROP_NOIR_IMAGE,
    releaseYear: 2026,
    genres: ['Science Fiction', 'Action', 'Mystery'],
    rating: 9.4,
    duration: '3 Seasons',
    country: 'United States',
    director: 'Jonathan Crane',
    cast: ['Alexander Ward', 'Seraphina Scott', 'Tariq Al-Mansoor', 'Chloe Bennett'],
    videoSources: DEMO_VIDEO_SOURCES,
    subtitles: STANDARD_SUBTITLES,
    quality: '4K',
    badges: ['NEW', 'TRENDING', 'TOP RATED'],
    views: 620500,
    featured: true,
    addedAt: '2026-03-10',
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Point of Origin',
        episodes: [
          {
            id: 'ep-s1-1',
            episodeNumber: 1,
            title: 'Fractured Timeline',
            description: 'Agent Katherine Cole investigates an impossible anomaly in Geneva that alters global historical records within minutes.',
            thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
            duration: '54m',
            airDate: 'Jan 10, 2026',
            videoSources: DEMO_VIDEO_SOURCES,
            subtitles: STANDARD_SUBTITLES
          },
          {
            id: 'ep-s1-2',
            episodeNumber: 2,
            title: 'The Venice Disruption',
            description: 'The team jumps to 1512 Venice to track a temporal thief attempting to steal Da Vinci’s classified blueprints.',
            thumbnail: 'https://images.unsplash.com/photo-1523906834658-6e2b32c729a4?w=600&auto=format&fit=crop&q=80',
            duration: '52m',
            airDate: 'Jan 17, 2026',
            videoSources: DEMO_VIDEO_SOURCES,
            subtitles: STANDARD_SUBTITLES
          },
          {
            id: 'ep-s1-3',
            episodeNumber: 3,
            title: 'Echoes in the Quantum Core',
            description: 'Trapped between parallel centuries, Cole must decode a transmission sent by her future self.',
            thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
            duration: '58m',
            airDate: 'Jan 24, 2026',
            videoSources: DEMO_VIDEO_SOURCES,
            subtitles: STANDARD_SUBTITLES
          },
          {
            id: 'ep-s1-4',
            episodeNumber: 4,
            title: 'Zero Hour Convergence',
            description: 'The syndicate headquarters faces an existential lockdown as the paradox reaches critical mass.',
            thumbnail: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&auto=format&fit=crop&q=80',
            duration: '1h 02m',
            airDate: 'Jan 31, 2026',
            videoSources: DEMO_VIDEO_SOURCES,
            subtitles: STANDARD_SUBTITLES
          }
        ]
      },
      {
        seasonNumber: 2,
        title: 'Season 2: The Parallel War',
        episodes: [
          {
            id: 'ep-s2-1',
            episodeNumber: 1,
            title: 'New Coordinates',
            description: 'A rogue alternate dimension threatens to collide with Earth Prime.',
            thumbnail: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80',
            duration: '56m',
            airDate: 'Feb 15, 2026',
            videoSources: DEMO_VIDEO_SOURCES,
            subtitles: STANDARD_SUBTITLES
          },
          {
            id: 'ep-s2-2',
            episodeNumber: 2,
            title: 'The Shadow Accord',
            description: 'Allies turn into suspects when an intercepted cipher points to a mole in high command.',
            thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
            duration: '53m',
            airDate: 'Feb 22, 2026',
            videoSources: DEMO_VIDEO_SOURCES,
            subtitles: STANDARD_SUBTITLES
          }
        ]
      }
    ]
  },
  {
    id: 'tv2',
    slug: 'the-silicon-monarchs',
    title: 'The Silicon Monarchs',
    originalTitle: 'The Silicon Monarchs',
    type: 'tv',
    description: 'An electrifying high-stakes corporate drama detailing the vicious power struggle between four ambitious tech dynasties competing to monopolize the next global artificial intelligence infrastructure.',
    poster: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    backdrop: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&auto=format&fit=crop&q=80',
    releaseYear: 2025,
    genres: ['Drama', 'Crime', 'Thriller'],
    rating: 9.0,
    duration: '2 Seasons',
    country: 'United States',
    director: 'Claire Sterling',
    cast: ['Harrison Thorne', 'Olivia Sterling', 'Matthew Vance', 'Cynthia Wu'],
    videoSources: DEMO_VIDEO_SOURCES,
    subtitles: STANDARD_SUBTITLES,
    quality: '4K',
    badges: ['TRENDING', 'TOP RATED'],
    views: 450100,
    featured: true,
    addedAt: '2026-01-15',
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Valuation',
        episodes: [
          {
            id: 'ep-sm-1',
            episodeNumber: 1,
            title: 'The Hostile Takeover',
            description: 'Venture titan Jonathan Croft initiates an audacious boardroom coup against his founding partner.',
            thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80',
            duration: '59m',
            airDate: 'Nov 02, 2025',
            videoSources: DEMO_VIDEO_SOURCES,
            subtitles: STANDARD_SUBTITLES
          },
          {
            id: 'ep-sm-2',
            episodeNumber: 2,
            title: 'Algorithmic Leverage',
            description: 'A leaked proprietary model threatens to crash the venture exchange before the IPO.',
            thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80',
            duration: '55m',
            airDate: 'Nov 09, 2025',
            videoSources: DEMO_VIDEO_SOURCES,
            subtitles: STANDARD_SUBTITLES
          }
        ]
      }
    ]
  },
  {
    id: 'tv3',
    slug: 'valkyrie-ascendant',
    title: 'Valkyrie Ascendant: Iron Skies',
    originalTitle: 'Valkyrie Ascendant',
    type: 'tv',
    description: 'In an alternate 1948 where dieselpunk mechs and aerial dreadnoughts dominate the skies, an elite multinational air wing protects neutral sanctuaries from encroaching empires.',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    backdrop: BACKDROP_ACTION_IMAGE,
    releaseYear: 2026,
    genres: ['Action', 'Adventure', 'Science Fiction'],
    rating: 8.8,
    duration: '1 Season',
    country: 'Germany / Sweden',
    director: 'Lars von Holtz',
    cast: ['Astrid Lind', 'Maximilian Bauer', 'Nadia Romanov'],
    videoSources: DEMO_VIDEO_SOURCES,
    subtitles: STANDARD_SUBTITLES,
    quality: '4K',
    badges: ['NEW'],
    views: 312000,
    addedAt: '2026-03-04',
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Skystrike Protocol',
        episodes: [
          {
            id: 'ep-va-1',
            episodeNumber: 1,
            title: 'Wings Over the Baltic',
            description: 'Captain Lind leads her squadron in an intercept mission over the stormy Scandinavian coast.',
            thumbnail: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80',
            duration: '50m',
            airDate: 'Mar 01, 2026',
            videoSources: DEMO_VIDEO_SOURCES,
            subtitles: STANDARD_SUBTITLES
          }
        ]
      }
    ]
  },
  {
    id: 'tv4',
    slug: 'whispers-of-the-moor',
    title: 'Whispers of the Moor',
    originalTitle: 'Whispers of the Moor',
    type: 'tv',
    description: 'A detective with a haunting past returns to her ancestral village on the Yorkshire moors to investigate a series of locked-room mysteries rooted in local folklore.',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    backdrop: BACKDROP_FANTASY_IMAGE,
    releaseYear: 2025,
    genres: ['Mystery', 'Crime', 'Drama'],
    rating: 8.6,
    duration: '2 Seasons',
    country: 'United Kingdom',
    director: 'Arthur Miller',
    cast: ['Rebecca Hall', 'Mark Strong', 'Kenneth Branagh'],
    videoSources: DEMO_VIDEO_SOURCES,
    subtitles: STANDARD_SUBTITLES,
    quality: 'FHD',
    views: 245000,
    addedAt: '2025-10-18',
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: The Blackwood Curse',
        episodes: [
          {
            id: 'ep-wm-1',
            episodeNumber: 1,
            title: 'The Raven of Greycliff',
            description: 'Inspector Sarah Vance returns to Blackwood Manor after twenty years.',
            thumbnail: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=600&auto=format&fit=crop&q=80',
            duration: '48m',
            airDate: 'Oct 05, 2025',
            videoSources: DEMO_VIDEO_SOURCES,
            subtitles: STANDARD_SUBTITLES
          }
        ]
      }
    ]
  }
];

export const ALL_GENRES = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Science Fiction',
  'Thriller'
];

export const GENRE_METADATA: Record<string, { description: string; image: string }> = {
  'Action': {
    description: 'High-octane pursuits, explosive showdowns, and heart-pounding spectacles.',
    image: BACKDROP_ACTION_IMAGE
  },
  'Adventure': {
    description: 'Expeditions into uncharted frontiers, lost civilizations, and epic voyages.',
    image: BACKDROP_FANTASY_IMAGE
  },
  'Animation': {
    description: 'Stunning visual storytelling, imaginative realms, and animated masterpieces.',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80'
  },
  'Comedy': {
    description: 'Clever satire, hilarious misadventures, and heartwarming laugh-out-loud stories.',
    image: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=800&auto=format&fit=crop&q=80'
  },
  'Crime': {
    description: 'High-stakes heists, undercover operations, and intense forensic investigations.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80'
  },
  'Documentary': {
    description: 'True stories, natural wonders, and revelatory explorations of humanity.',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&auto=format&fit=crop&q=80'
  },
  'Drama': {
    description: 'Compelling emotional narratives, deep character arcs, and moral dilemmas.',
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80'
  },
  'Fantasy': {
    description: 'Mythical empires, enchanted prophecies, dragons, and ancient sorcery.',
    image: BACKDROP_FANTASY_IMAGE
  },
  'Horror': {
    description: 'Spine-chilling dread, supernatural terror, and psychological suspense.',
    image: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=800&auto=format&fit=crop&q=80'
  },
  'Mystery': {
    description: 'Intricate whodunits, hidden secrets, and mind-bending puzzle thrillers.',
    image: 'https://images.unsplash.com/photo-1523906834658-6e2b32c729a4?w=800&auto=format&fit=crop&q=80'
  },
  'Romance': {
    description: 'Passionate connections, heartfelt chemistry, and unforgettable love stories.',
    image: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=800&auto=format&fit=crop&q=80'
  },
  'Science Fiction': {
    description: 'Futuristic worlds, quantum paradoxes, interstellar spaceflight, and AI.',
    image: HERO_SCIFI_IMAGE
  },
  'Thriller': {
    description: 'Nail-biting suspense, psychological tension, and adrenaline-charged twists.',
    image: BACKDROP_NOIR_IMAGE
  }
};

export const INITIAL_USER: User = {
  id: 'u-101',
  name: 'Souhaimat (Administrator)',
  email: 'ssouhaimat1999@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  role: 'admin',
  joinedDate: 'January 2026'
};

export const DEFAULT_HOMEPAGE_CONFIG: HomepageConfig = {
  heroMovieId: 'm1',
  featuredMovieIds: ['m1', 'm2', 'm3', 'm4', 'tv1', 'tv2'],
  sections: [
    { id: 'sec-latest-movies', title: 'Latest Movies', enabled: true, filterType: 'special', filterValue: 'latest_movies' },
    { id: 'sec-latest-tv', title: 'Latest TV Shows', enabled: true, filterType: 'special', filterValue: 'latest_tv' },
    { id: 'sec-trending', title: 'Trending Now', enabled: true, filterType: 'special', filterValue: 'trending' },
    { id: 'sec-most-watched', title: 'Most Watched', enabled: true, filterType: 'special', filterValue: 'most_watched' },
    { id: 'sec-action', title: 'Action Movies', enabled: true, filterType: 'genre', filterValue: 'Action' },
    { id: 'sec-adventure', title: 'Adventure Movies', enabled: true, filterType: 'genre', filterValue: 'Adventure' },
    { id: 'sec-scifi', title: 'Science Fiction', enabled: true, filterType: 'genre', filterValue: 'Science Fiction' },
    { id: 'sec-comedy', title: 'Comedy', enabled: true, filterType: 'genre', filterValue: 'Comedy' },
    { id: 'sec-horror', title: 'Horror', enabled: true, filterType: 'genre', filterValue: 'Horror' },
    { id: 'sec-recommended', title: 'Recommended For You', enabled: true, filterType: 'special', filterValue: 'recommended' }
  ]
};
