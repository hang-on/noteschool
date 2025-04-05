const sounds = {};
var audioContext;

export function initializeAudio() {
    // Initialize Web Audio API
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    // Load sounds
    loadSound('sfx/success.mp3', 'success');
    loadSound('sfx/click.mp3', 'click');
}

// Function to load a sound
function loadSound(url, name) {
    fetch(url)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
            sounds[name] = audioBuffer;
        })
        .catch(e => console.error('Error loading sound:', e));
}

// Function to play a sound
export function playSound(name) {
    const sound = sounds[name];
    if (sound) {
        const source = audioContext.createBufferSource();
        source.buffer = sound;
        source.connect(audioContext.destination);
        source.start(0);
    }
}

