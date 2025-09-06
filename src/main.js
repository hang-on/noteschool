import { initializeStaff, processNote } from './notes.js';
import { initializeMIDI } from './utils/index.js';
import { DEBUG_MODE, FAKE_NOTE_CORRECT, FAKE_NOTE_INCORRECT } from './config.js';
import { stats, saveStats, getAverageTimePerCorrectNote} from './stats.js';
import { initializeAudio, playSound } from './utils/audio.js';
import { getCurrentSession } from './data/sessions.js'; 


let midiBuffer = [];
let clearedPages = 0;
const NOTE_ON = 144;
const PAGE_CLEARED = 255;
const CORRECT_NOTE = 1;

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

document.getElementById('sound-toggle').addEventListener('change', function() {
    if (this.checked) {
        playSound('click');
    }
});

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

document.addEventListener('DOMContentLoaded', function () {

    // Retrieve the current session
    const session = getCurrentSession();

    if (session) {
        // Update the header with the session title
        const headerTitle = document.querySelector('.header .title');
        headerTitle.textContent = session.title;
    } else {
        console.error('No current session set.');
    }
    
    initializeStaff();     

});

initializeAudio();
initializeMIDI(handleMIDIEvent);

stats.sessionStartTime = Date.now();

// -----------------------------------------------------------------------------------------------------
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
    stats.totalPagesCleared++;
    saveStats();
    updateClearedPagesDisplay();
    const endTime = Date.now();
    stats.totalTimeSpent += endTime - stats.startTime;
    stats.startTime = null;

    // Calculate the new average time per correct note for the current page
    const newAverageTime = (stats.totalTimeSpent / stats.correctNotes) / 1000; // Convert to seconds

    const session = getCurrentSession();
    if (session.length && clearedPages == session.length){
        // End the session automatically
        const sessionEndTime = Date.now();
        stats.totalSessionTime = (sessionEndTime - stats.sessionStartTime) / 1000; // Convert to seconds
        saveStats(); // Save stats to localStorage
        window.location.href = 'end.html';
    }

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
