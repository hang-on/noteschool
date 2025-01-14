import { addNoteAtPosition, updateNotes, generateRandomNote, checkAndLogActiveNotes } from './notes.js';
import { onMIDIMessage, initializeMIDI } from './midi.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeMIDI();

    // Generate a new note every 1500ms
    setInterval(() => {
        // 10% chance to skip generating a note
        if (Math.random() < 0.15) {
            return;
        }
        const notesContainer = document.querySelector('.notes-container');
        const randomNoteData = generateRandomNote();
        const staffWidth = notesContainer.clientWidth;
        addNoteAtPosition(notesContainer, staffWidth - 400, randomNoteData.y, randomNoteData.strikeThrough, randomNoteData.note);
    }, 2000);

    // Update notes and check active notes every 100ms
    setInterval(() => {
        updateNotes();
        checkAndLogActiveNotes();
    }, 50);

    // Set up MIDI message handler
    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess().then((midiAccess) => {
            midiAccess.inputs.forEach((input) => {
                input.onmidimessage = onMIDIMessage;
            });
        });
    } else {
        console.warn('WebMIDI is not supported in this browser.');
    }
});
