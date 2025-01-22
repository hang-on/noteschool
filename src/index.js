import { setFocusNoteColor, getFocusNote, initializeStaff, updateFocusNote, isFocusNoteOutOfBounds, displayNoteName } from './notes.js';
import { initializeMIDI, getActiveNotes, clearMidiBuffer } from './utils/index.js';
import { initializeMessageLabel, clearMessageLabel } from './messageHandler.js';
import { closeMIDIConnection } from './utils/midi.js';


document.addEventListener('DOMContentLoaded', () => {
    let readyForInput = false; 

    // Get the value of the --cambridge-blue CSS variable (used to mark correct input)
    const cambridgeBlue = getComputedStyle(document.documentElement).getPropertyValue('--cambridge-blue').trim();


    initializeMessageLabel("Welcome to Noteschool. Click anywhere to start the session.");

    const startNewSession = () => {
        initializeMIDI();

        initializeStaff();     

        // Set up an interval to run the update function
       setInterval(update, 1000 / 30);
 
        document.removeEventListener('click', startNewSession);
        clearMessageLabel(); // Clear the welcome message        

    };

    // Add event listener for user interaction to start a new session.
    document.addEventListener('click', startNewSession);

    const update = () => {
        const activeNotes = getActiveNotes(); // activeNotes is a set handled by the midi.js library
        const focusNoteElement = getFocusNote(); // focusNote is handled by notes.js
        if (focusNoteElement) {
            var focusNote = focusNoteElement.getAttribute('data-note-name'); // Get the note name from the data attribute
        } else {
            console.log("Problem accessing getFocusNote...");
        }
              
        if (readyForInput === true && activeNotes.has(focusNote)) {
            setFocusNoteColor(cambridgeBlue);

            // Display the note name below the note
            displayNoteName(focusNoteElement, focusNote, cambridgeBlue);

            updateFocusNote();
            readyForInput = false;
            if (isFocusNoteOutOfBounds()){
                clearMidiBuffer();
                initializeStaff();
            }
        }

        if (activeNotes.size === 0 && readyForInput === false){
            readyForInput = true;
        }  
    };

});

