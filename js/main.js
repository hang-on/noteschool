import { addNoteAtPosition, updateNotes, generateRandomNote, compareNotesWithActiveNotes } from './notes.js';
import { onMIDIMessage, initializeMIDI } from './midi.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeMIDI();

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
