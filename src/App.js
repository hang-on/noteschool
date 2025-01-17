import { addNoteAtPosition, generateRandomNote, setNoteColor, removeNoteFromStaff, getFocusNote, initializeStaff } from './notes.js';
import { onMIDIMessage, initializeMIDI, getActiveNotes } from './utils/index.js';

const App = () => {
    document.addEventListener('DOMContentLoaded', () => {
        initializeMIDI();

        initializeStaff(16);

        //console.log(getFocusNote());
    });
};

export default App;