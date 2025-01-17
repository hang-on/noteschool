import { addNoteAtPosition, generateRandomNote, setFocusNoteColor, getFocusNote, initializeStaff, updateFocusNote, isFocusNoteOutOfBounds } from './notes.js';
import { onMIDIMessage, initializeMIDI, getActiveNotes } from './utils/index.js';

const App = () => {
    document.addEventListener('DOMContentLoaded', () => {
        initializeMIDI();

        initializeStaff();     
        
        let readyForInput = false; 

        const update = () => {
            const activeNotes = getActiveNotes();
            const focusNoteElement = getFocusNote();
            if (focusNoteElement) {
                var focusNote = focusNoteElement.getAttribute('data-note-name'); // Get the note name from the data attribute
            } else {
                console.log("Problem accessing getFocusNote...");
            }
            
            
            if (readyForInput === true && activeNotes.has(focusNote)) {
                setFocusNoteColor('lightblue');
                updateFocusNote();
                readyForInput = false;
                if (isFocusNoteOutOfBounds()){
                    initializeStaff();
                }

            }

            if (activeNotes.size === 0 && readyForInput === false){
                readyForInput = true;
                console.log("Ready for input");
            }  

        };

        // Set up an interval to run the update function 60 times per second
        setInterval(update, 1000 / 30); // 1000ms / 60 = ~16.67ms
    });
};

export default App;