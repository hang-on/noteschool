import { addNoteAtPosition, generateRandomNote, setNoteColor, removeNoteFromStaff } from './notes.js';
import { onMIDIMessage, initializeMIDI } from './utils/index.js';

const App = () => {
    document.addEventListener('DOMContentLoaded', () => {
        initializeMIDI();

        // Generate 8 random notes and place them evenly spaced on the staff
        const notesContainer = document.querySelector('.notes-container');

        const staffWidth = notesContainer.clientWidth;
        const spacing = staffWidth / 8;

        for (let i = 0; i < 8; i++) {
            const randomNoteData = generateRandomNote();
            addNoteAtPosition(notesContainer, i * spacing + 50, randomNoteData.y, randomNoteData.strikeThrough, randomNoteData.note);
        }
        // Set the color of the note
        setNoteColor(1, 'red');

        // Remove the note
        removeNoteFromStaff(2);

    });

};

export default App;