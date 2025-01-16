import { addNoteAtPosition, generateRandomNote, setNoteColor, removeNoteFromStaff } from './notes.js';
import { onMIDIMessage, initializeMIDI, getActiveNotes } from './utils/index.js';

const App = () => {
    document.addEventListener('DOMContentLoaded', () => {
        initializeMIDI();

        // Generate 8 random notes and place them evenly spaced on the staff
        const notesContainer = document.querySelector('.notes-container');

        const staffWidth = notesContainer.clientWidth;
        const spacing = staffWidth / 8;

        let notes = [];
        for (let i = 0; i < 8; i++) {
            const randomNoteData = generateRandomNote();
            const note = addNoteAtPosition(notesContainer, i * spacing + 50, randomNoteData.y, randomNoteData.strikeThrough, randomNoteData.name);
            notes.push(note);
        }

        const checkLeftmostNote = () => {
            if (notes.length === 0) return;

            const activeNotes = getActiveNotes();
            const leftmostNote = notes[0].getAttribute('data-note-name'); // Get the note name from the data attribute

            if (activeNotes.has(leftmostNote)) {
                console.log(`Leftmost note ${leftmostNote} matches active notes.`);
            }
        };

        setInterval(checkLeftmostNote, 1000 / 60); // Check 60 times per second
    });
};

export default App;