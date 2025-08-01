// Smart Shuffle Spotify Clone Functionality

// Song data
const songs = [
  { title: "Blinding Lights", artist: "The Weeknd" },
  { title: "Watermelon Sugar", artist: "Harry Styles" },
  { title: "Good 4 U", artist: "Olivia Rodrigo" },
  { title: "Heat Waves", artist: "Glass Animals" },
  { title: "Levitating", artist: "Dua Lipa" }
];

// Player state
let currentSongIndex = 0;
let isPlaying = false;
let smartShuffleEnabled = false;
let playHistory = [];
let smartQueue = [];

// DOM elements
const playButton = document.getElementById("playBtn");
const prevButton = document.getElementById("prevBtn");
const nextButton = document.getElementById("nextBtn");
const smartShuffleBtn = document.getElementById("smartShuffleBtn");
const currentTrack = document.getElementById("currentTrack");
const shuffleMessage = document.getElementById("shuffleMessage");
const songItems = document.querySelectorAll(".song-item");

// Update now playing display
function updateNowPlaying() {
  const song = songs[currentSongIndex];
  currentTrack.innerHTML = `<strong>${song.title}</strong> — ${song.artist}`;
  
  // Update visual indicators
  songItems.forEach((item, index) => {
    item.classList.remove("playing", "next-smart");
    if (index === currentSongIndex) {
      item.classList.add("playing");
    }
  });
  
  // Show next smart recommendation
  if (smartShuffleEnabled && smartQueue.length > 0) {
    const nextSongIndex = smartQueue[0];
    songItems[nextSongIndex].classList.add("next-smart");
  }
}

// Generate smart recommendations (simulated AI logic)
function generateSmartQueue() {
  if (!smartShuffleEnabled) return [];
  
  let availableSongs = songs.map((_, index) => index).filter(index => 
    index !== currentSongIndex && !playHistory.slice(-2).includes(index)
  );
  
  // Shuffle available songs for variety
  for (let i = availableSongs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [availableSongs[i], availableSongs[j]] = [availableSongs[j], availableSongs[i]];
  }
  
  return availableSongs.slice(0, 2); // Return 2 smart picks
}

// Play/Pause functionality
playButton.addEventListener("click", () => {
  isPlaying = !isPlaying;
  playButton.textContent = isPlaying ? "⏸️" : "▶️";
  
  if (smartShuffleEnabled) {
    shuffleMessage.textContent = isPlaying ? 
      "🎵 Playing with Smart Shuffle - discovering perfect matches!" : 
      "⏸️ Paused - Smart Shuffle ready for your next track";
  }
});

// Previous song
prevButton.addEventListener("click", () => {
  if (playHistory.length > 0) {
    currentSongIndex = playHistory.pop();
  } else {
    currentSongIndex = currentSongIndex > 0 ? currentSongIndex - 1 : songs.length - 1;
  }
  updateNowPlaying();
  shuffleMessage.textContent = "⏮️ Playing previous track";
});

// Next song
nextButton.addEventListener("click", () => {
  playHistory.push(currentSongIndex);
  
  if (smartShuffleEnabled && smartQueue.length > 0) {
    // Use smart recommendation
    currentSongIndex = smartQueue.shift();
    shuffleMessage.textContent = "🎯 Smart pick! This song perfectly matches your taste";
    
    // Refresh smart queue
    smartQueue = [...smartQueue, ...generateSmartQueue()].slice(0, 2);
  } else {
    // Regular next song
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    shuffleMessage.textContent = smartShuffleEnabled ? 
      "⏭️ Next track (Smart Shuffle active)" : 
      "⏭️ Next track";
  }
  
  updateNowPlaying();
});

// Smart Shuffle toggle
smartShuffleBtn.addEventListener("click", () => {
  smartShuffleEnabled = !smartShuffleEnabled;
  
  if (smartShuffleEnabled) {
    smartShuffleBtn.classList.add("active");
    shuffleMessage.textContent = "✨ Smart Shuffle activated! AI is analyzing your preferences...";
    
    // Generate initial smart queue
    smartQueue = generateSmartQueue();
    
    setTimeout(() => {
      shuffleMessage.textContent = "🎧 Smart Shuffle ready! Your next songs are perfectly curated for you.";
    }, 2000);
  } else {
    smartShuffleBtn.classList.remove("active");
    shuffleMessage.textContent = "🔄 Smart Shuffle off - playing in normal order";
    smartQueue = [];
  }
  
  updateNowPlaying();
});

// Song selection from list
songItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    playHistory.push(currentSongIndex);
    currentSongIndex = index;
    
    if (smartShuffleEnabled) {
      smartQueue = generateSmartQueue();
      shuffleMessage.textContent = "🎵 Great choice! Smart Shuffle is updating your recommendations...";
    } else {
      shuffleMessage.textContent = `🎵 Now playing: ${songs[index].title}`;
    }
    
    updateNowPlaying();
    
    // Auto-play
    isPlaying = true;
    playButton.textContent = "⏸️";
  });
});

// Search functionality
const searchBar = document.querySelector(".search-bar");
searchBar.addEventListener("input", (e) => {
  const value = e.target.value.toLowerCase();
  console.log("Searching for:", value);
  
  if (smartShuffleEnabled && value) {
    shuffleMessage.textContent = `🔍 Searching "${value}" - Smart Shuffle will enhance results!`;
  }
});

// Initialize the player
updateNowPlaying();
shuffleMessage.textContent = "🎵 Ready to play! Try Smart Shuffle for personalized recommendations.";
