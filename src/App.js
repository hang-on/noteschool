import { addNoteAtPosition, generateRandomNote, setNoteColor, removeNoteFromStaff } from './notes.js';
import { onMIDIMessage, initializeMIDI, getActiveNotes } from './utils/index.js';

const App = () => {
    document.addEventListener('DOMContentLoaded', () => {
        initializeMIDI();


    });
};

export default App;