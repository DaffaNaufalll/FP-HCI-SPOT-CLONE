// --- Playlists Data with Genre ---
const playlists = {
  "top-hits": {
    title: "Top Hits",
    songs: [
      { title: "Blinding Lights", artist: "The Weeknd", genre: "Pop" },
      { title: "Levitating", artist: "Dua Lipa", genre: "Pop" },
      { title: "Save Your Tears", artist: "The Weeknd", genre: "Pop" },
      { title: "Don't Start Now", artist: "Dua Lipa", genre: "Pop" },
      { title: "Peaches", artist: "Justin Bieber", genre: "R&B" }
    ]
  },
  "chill-vibes": {
    title: "Chill Vibes",
    songs: [
      { title: "Sunflower", artist: "Post Malone", genre: "Hip-Hop" },
      { title: "Lovely", artist: "Billie Eilish", genre: "Indie" },
      { title: "Circles", artist: "Post Malone", genre: "Hip-Hop" },
      { title: "Ocean Eyes", artist: "Billie Eilish", genre: "Indie" },
      { title: "Someone You Loved", artist: "Lewis Capaldi", genre: "Pop" }
    ]
  },
  "workout": {
    title: "Workout",
    songs: [
      { title: "Stronger", artist: "Kanye West", genre: "Hip-Hop" },
      { title: "Eye of the Tiger", artist: "Survivor", genre: "Rock" },
      { title: "Can't Hold Us", artist: "Macklemore & Ryan Lewis", genre: "Hip-Hop" },
      { title: "Titanium", artist: "David Guetta", genre: "EDM" },
      { title: "Remember the Name", artist: "Fort Minor", genre: "Hip-Hop" }
    ]
  },
  "daily-mix": {
    title: "Daily Mix",
    songs: [
      { title: "Good 4 U", artist: "Olivia Rodrigo", genre: "Pop" },
      { title: "drivers license", artist: "Olivia Rodrigo", genre: "Pop" },
      { title: "Positions", artist: "Ariana Grande", genre: "Pop" },
      { title: "Break My Heart", artist: "Dua Lipa", genre: "Pop" },
      { title: "Stuck with U", artist: "Ariana Grande & Justin Bieber", genre: "Pop" }
    ]
  },
  "top-trending": {
    title: "Top Trending",
    songs: [
      { title: "Heat Waves", artist: "Glass Animals", genre: "Indie" },
      { title: "Stay", artist: "The Kid LAROI & Justin Bieber", genre: "Pop" },
      { title: "MONTERO (Call Me By Your Name)", artist: "Lil Nas X", genre: "Pop" },
      { title: "Peaches", artist: "Justin Bieber", genre: "R&B" },
      { title: "Save Your Tears", artist: "The Weeknd", genre: "Pop" }
    ]
  }
};

function getAllSongs() {
  return Object.values(playlists).flatMap(pl => pl.songs);
}

// --- Queue State ---
let defaultQueue = [
  { title: "Blinding Lights", artist: "The Weeknd", genre: "Pop" },
  { title: "Watermelon Sugar", artist: "Harry Styles", genre: "Pop" },
  { title: "Good 4 U", artist: "Olivia Rodrigo", genre: "Pop" },
  { title: "Heat Waves", artist: "Glass Animals", genre: "Indie" },
  { title: "Levitating", artist: "Dua Lipa", genre: "Pop" }
];
let currentQueue = [...defaultQueue];
let currentQueueIndex = 0;
let smartShuffleOn = false;

// --- UI Elements ---
const currentTrack = document.getElementById('currentTrack');
const songListDiv = document.querySelector('.song-list');
const smartShuffleBtn = document.getElementById('smartShuffleBtn');
const shuffleMessage = document.getElementById('shuffleMessage');
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

// --- Navigation Highlight ---
function setActiveNav(linkId) {
  ['homeLink', 'searchLink', 'libraryLink'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  });
  if (linkId) {
    const el = document.getElementById(linkId);
    if (el) el.classList.add('active');
  }
}

function showSection(sectionId) {
  ['homeSection', 'searchSection', 'librarySection', 'playlistSection'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = (id === sectionId) ? '' : 'none';
  });
}

// --- Navigation Events ---
document.getElementById('homeLink').addEventListener('click', function(e) {
  e.preventDefault();
  setActiveNav('homeLink');
  showSection('homeSection');
  setQueue(defaultQueue, 0);
});
document.getElementById('searchLink').addEventListener('click', function(e) {
  e.preventDefault();
  setActiveNav('searchLink');
  showSection('searchSection');
});
document.getElementById('libraryLink').addEventListener('click', function(e) {
  e.preventDefault();
  setActiveNav('libraryLink');
  showSection('librarySection');
});

// --- Playlist Navigation (Sidebar) ---
document.querySelectorAll('.playlist-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    setActiveNav(null);
    showSection('playlistSection');
    const key = this.getAttribute('data-playlist');
    showPlaylist(key);
  });
});

// --- Playlist Navigation (Featured Playlists) ---
document.querySelectorAll('.featured-playlist').forEach(card => {
  card.addEventListener('click', function() {
    setActiveNav(null);
    showSection('playlistSection');
    const key = this.getAttribute('data-playlist');
    showPlaylist(key);
  });
});

function showPlaylist(key) {
  const playlist = playlists[key];
  document.getElementById('playlistTitle').textContent = playlist.title;
  document.getElementById('playlistSongs').innerHTML = playlist.songs.map((song, idx) =>
    `<div class="song-item" data-song-idx="${idx}" data-playlist="${key}">
      <p class="song-title">${song.title}</p>
      <p class="artist-name">${song.artist}</p>
    </div>`
  ).join('');
  // Add click listeners for new song items
  document.querySelectorAll('#playlistSongs .song-item').forEach(item => {
    item.addEventListener('click', function() {
      const idx = parseInt(this.getAttribute('data-song-idx'));
      const plKey = this.getAttribute('data-playlist');
      setQueue(playlists[plKey].songs, idx);
      showSection('homeSection');
    });
  });
}

// --- Set Queue and Update UI ---
function setQueue(queue, idx = 0) {
  currentQueue = [...queue];
  currentQueueIndex = idx;
  renderQueue();
  updateTrackInfo();
}

// --- Render Now Playing Queue ---
function renderQueue() {
  songListDiv.innerHTML = currentQueue.map((song, idx) =>
    `<div class="song-item${idx === currentQueueIndex ? ' active' : ''}" data-queue-idx="${idx}">
      <img src="https://via.placeholder.com/40" alt="Album" />
      <div class="song-details">
        <p class="song-title">${song.title}</p>
        <p class="artist-name">${song.artist}</p>
      </div>
    </div>`
  ).join('');
  // Add click listeners for queue
  document.querySelectorAll('.song-list .song-item').forEach((item, idx) => {
    item.addEventListener('click', function() {
      currentQueueIndex = idx;
      updateTrackInfo();
      renderQueue();
    });
  });
}

// --- Update Music Player ---
function updateTrackInfo() {
  if (currentTrack && currentQueue[currentQueueIndex]) {
    currentTrack.innerHTML = `<strong>${currentQueue[currentQueueIndex].title}</strong> — ${currentQueue[currentQueueIndex].artist}`;
  }
}

// --- Smart Shuffle by Genre Only ---
if (smartShuffleBtn && shuffleMessage) {
  smartShuffleBtn.addEventListener('click', function() {
    smartShuffleOn = !smartShuffleOn;
    if (smartShuffleOn) {
      shuffleMessage.textContent = "Smart Shuffle is ON! Suggesting similar genre songs...";
      const baseSongs = getAllSongs();
      const seed = currentQueue[currentQueueIndex] || baseSongs[Math.floor(Math.random() * baseSongs.length)];
      // Only match by genre (not artist)
      const similar = baseSongs.filter(
        s => s.genre === seed.genre && !(s.title === seed.title && s.artist === seed.artist)
      );
      const queue = [seed, ...(similar.length ? similar : baseSongs.filter(s => !(s.title === seed.title && s.artist === seed.artist)).sort(() => Math.random() - 0.5).slice(0, 4))];
      setQueue(queue, 0);
      setTimeout(() => {
        shuffleMessage.textContent = "Smart Shuffle is ready to enhance your listening experience";
      }, 2000);
    } else {
      shuffleMessage.textContent = "Smart Shuffle is OFF. Back to original queue.";
      setQueue(defaultQueue, 0);
      setTimeout(() => {
        shuffleMessage.textContent = "Smart Shuffle is ready to enhance your listening experience";
      }, 2000);
    }
  });
}


// --- Player Controls ---
if (playBtn) {
  let isPlaying = false;
  playBtn.addEventListener('click', function() {
    isPlaying = !isPlaying;
    playBtn.textContent = isPlaying ? '⏸️' : '▶️';
  });
}

if (prevBtn && nextBtn) {
  prevBtn.addEventListener('click', function() {
    currentQueueIndex = (currentQueueIndex - 1 + currentQueue.length) % currentQueue.length;
    updateTrackInfo();
    renderQueue();
  });
  nextBtn.addEventListener('click', function() {
    currentQueueIndex = (currentQueueIndex + 1) % currentQueue.length;
    updateTrackInfo();
    renderQueue();
  });
}

// --- Search Bar Interactivity ---
const searchBar = document.querySelector('.search-bar');
const searchResults = document.getElementById('searchResults');

searchBar.addEventListener('focus', function() {
  setActiveNav('searchLink');
  showSection('searchSection');
});

searchBar.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    setActiveNav('searchLink');
    showSection('searchSection');
    const query = searchBar.value.trim();
    if (query) {
      // Fake search results for demo
      searchResults.innerHTML = `
        <h3>Results for "${query}"</h3>
        <div class="song-item"><p class="song-title">${query} Song 1</p><p class="artist-name">Artist A</p></div>
        <div class="song-item"><p class="song-title">${query} Song 2</p><p class="artist-name">Artist B</p></div>
      `;
    } else {
      searchResults.innerHTML = "<p>No results found.</p>";
    }
  }
});

// --- Initial Render ---
setQueue(defaultQueue, 0);