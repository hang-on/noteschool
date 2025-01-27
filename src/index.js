import { initializeStaff, processNote, toggleClefMode } from './notes.js';
import { initializeMIDI } from './utils/index.js';


document.addEventListener('DOMContentLoaded', () => {
    let midiBuffer = [];
    let clearedPages = 0;
    const NOTE_ON = 144;
    const PAGE_CLEARED = 255;

    // Initialize Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const sounds = {};

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

    // Load sounds
    loadSound('sfx/success.mp3', 'success');
    loadSound('sfx/click.mp3', 'click');

    // Function to play a sound
    function playSound(name) {
        const sound = sounds[name];
        if (sound) {
            const source = audioContext.createBufferSource();
            source.buffer = sound;
            source.connect(audioContext.destination);
            source.start(0);
        }
    }


    document.getElementById('sound-toggle').addEventListener('change', function() {
        if (this.checked) {
            playSound('click');
        }
    });

    // Toggle clef image between F-clef and G-clef
    document.getElementById('clef-image-container').addEventListener('click', function() {
        const clefImage = document.getElementById('clef-image');
        if (clefImage.src.includes('f-clef.png')) {
            clefImage.src = 'images/g-clef.png';
        } else {
            clefImage.src = 'images/f-clef.png';
        }
        toggleClefMode();
        initializeStaff();
        clearedPages = 0;
        updateClearedPagesDisplay();
    });


    initializeMIDI(handleMIDIEvent);

    initializeStaff();     

    setInterval(() => {
        // At a set interval, process all NOTE_ON messages in the MIDI buffer,
        // and clear the buffer afterwards.
        while (midiBuffer.length) {
            const data = midiBuffer.shift();
            const [command, midiNote] = data;
            // Ignore all commands except NOTE_ON
            if (command === NOTE_ON) {
                let result = 0;
                result = processNote(midiNote);
                if (result === PAGE_CLEARED) {
                    // Play the success sound if sound is enabled
                    const soundToggle = document.getElementById('sound-toggle');
                    if (soundToggle.checked) {
                        playSound('success');
                    }                    
                    clearedPages++;
                    updateClearedPagesDisplay();
                }    
            }   
        }
        // Clear midi buffer.
        midiBuffer = [];
    }, 50);

    function handleMIDIEvent (event){
        // Every MIDI event is buffered.
        midiBuffer.push(event.data);
    }    
    // Update the clearedPages variable and display its value
    function updateClearedPagesDisplay() {
        const clearedPagesDisplay = document.getElementById('cleared-pages-display');
        clearedPagesDisplay.textContent = `Cleared Pages: ${clearedPages}`;
    }

});

