import { setFocusNoteColor, getFocusNote, initializeStaff, updateFocusNote, isFocusNoteOutOfBounds, displayNoteName } from './notes.js';
import { initializeMIDI, getActiveNotes, getScientificPitchNotation } from './utils/index.js';
import { initializeMessageLabel, clearMessageLabel } from './messageHandler.js';

document.addEventListener('DOMContentLoaded', () => {
    let readyForInput = false; 

    // Get the value of the --cambridge-blue CSS variable (used to mark correct input)
    const cambridgeBlue = getComputedStyle(document.documentElement).getPropertyValue('--cambridge-blue').trim();


    initializeMessageLabel("Welcome to Noteschool. Click anywhere to start the session.");

    function handleMIDIEvent (event){
        const [command, midiNote, velocity] = event.data;
        // Constants for MIDI message types
        const NOTE_ON = 144;
        const NOTE_OFF = 128;
        const ACTIVE_SENSING = 254; // Active Sensing message

        // Ignore all commands except NOTE_ON
        if (command !== NOTE_ON) {
            return;
        }

        //const note = getScientificPitchNotation(midiNote);
        const focusNoteElement = getFocusNote();
        var focusNote = focusNoteElement.getAttribute('data-note-name'); // Get the note name from the data attribute
        // console.log('Focus Note: ', focusNote);

        // Print MIDI message information to the MIDI info section
        // console.log(`Command: ${command}, Note: ${midiNote}, Velocity: ${velocity}`);
        const x = getScientificPitchNotation(midiNote);
        // console.log('Note played: ', x);

        if (x == focusNote) {
            setFocusNoteColor(cambridgeBlue);

            // Display the note name below the note
            displayNoteName(focusNoteElement, focusNote, cambridgeBlue);
    
            updateFocusNote();
    
            if (isFocusNoteOutOfBounds()){
                initializeStaff();
            }    
        }
    }

    const startNewSession = () => {
        initializeMIDI(handleMIDIEvent);

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
                initializeStaff();
            }
        }

        if (activeNotes.size === 0 && readyForInput === false){
            readyForInput = true;
        }  
    };

});

