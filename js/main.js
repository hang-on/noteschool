import { initializeMIDI, onMIDIMessage } from "./midi.js";
import { placeNoteOnStaff, updateNotes, generateRandomNote } from "./notes.js"

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeMIDI();
    const notesContainer = document.querySelector('.notes-container');

    const staffWidth = notesContainer.clientWidth;

    // Generate a new note every 1500ms
    setInterval(() => {
        // 10% chance to skip generating a note
        if (Math.random() < 0.15) {
            return;
        }
        placeNoteOnStaff(notesContainer, generateRandomNote(), staffWidth - 400);
    }, 1500);

    // Update notes every 20ms
    setInterval(updateNotes, 30);

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
