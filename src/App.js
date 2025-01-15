
import { addNoteAtPosition, generateRandomNote } from './notes.js';
import { onMIDIMessage, initializeMIDI } from './utils/index.js';

const App = () => {
    document.addEventListener('DOMContentLoaded', () => {
        initializeMIDI();
    });
};

export default App;