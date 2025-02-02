import { initializeStaff, processNote, toggleClefMode } from './notes.js';
import { initializeMIDI } from './utils/index.js';
import { DEBUG_MODE, FAKE_NOTE_CORRECT, FAKE_NOTE_INCORRECT } from './config.js';
import { stats, saveStats, getAverageTimePerCorrectNote} from './stats.js';

document.addEventListener('DOMContentLoaded', () => {
    let midiBuffer = [];
    let clearedPages = 0;
    const NOTE_ON = 144;
    const PAGE_CLEARED = 255;
    const CORRECT_NOTE = 1;

    stats.sessionStartTime = Date.now();


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
                handleNoteInput(midiNote);
            }   
        }
        // Clear midi buffer.
        midiBuffer = [];
        saveStats();
    }, 50);

    function handleNoteInput(note){
        stats.notesPlayed++;
        if (stats.startTime === null){
            // Begin to track the time
            stats.startTime = Date.now();
        }
        
        let result = 0;
        result = processNote(note);
        if (result === PAGE_CLEARED) {
            handlePageClear();
        }
        if (result === PAGE_CLEARED || result === CORRECT_NOTE){
            stats.correctNotes++;
        }        
    }


    function handlePageClear(){
        // Play the success sound if sound is enabled
        const soundToggle = document.getElementById('sound-toggle');
        if (soundToggle.checked) {
            playSound('success');
        }                    
        clearedPages++;
        updateClearedPagesDisplay();
        const endTime = Date.now();
        stats.totalTimeSpent += endTime - stats.startTime;
        stats.startTime = null;

        // Calculate the new average time per correct note for the current page
        const newAverageTime = (stats.totalTimeSpent / stats.correctNotes) / 1000; // Convert to seconds

        // Update the averageTime property
        if (stats.averageTime) {
            stats.averageTime = (parseFloat(stats.averageTime) + newAverageTime) / 2;
        } else {
            stats.averageTime = newAverageTime;
        }
    }

    function handleMIDIEvent (event){
        // Every MIDI event is buffered.
        midiBuffer.push(event.data);
    }    
    // Update the clearedPages variable and display its value
    function updateClearedPagesDisplay() {
        const clearedPagesDisplay = document.getElementById('cleared-pages-display');
        clearedPagesDisplay.textContent = `Cleared Pages: ${clearedPages}`;
    }

    // Event listener for key presses
    document.addEventListener('keydown', function(event) {
        if (DEBUG_MODE) {
            console.log(`Key pressed: ${event.key}`);
            // The 'z' key simulates a correct note.
            if (event.key === 'z') {
                const fakeNote = FAKE_NOTE_CORRECT;
                handleNoteInput(fakeNote);
            }
            if (event.key === 'x') {
                const fakeNote = FAKE_NOTE_INCORRECT;
                handleNoteInput(fakeNote);
            }

        }
    });

    // Event listener for the "End Session" button
    document.getElementById('end-session-button').addEventListener('click', function() {
        // Track session end time and calculate total session time
        const sessionEndTime = Date.now();
        stats.totalSessionTime = (sessionEndTime - stats.sessionStartTime) / 1000; // Convert to seconds
        saveStats(); // Save stats to localStorage
    });
    

});

