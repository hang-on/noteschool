import { setFocusNoteColor, getFocusNote, initializeStaff, updateFocusNote, isFocusNoteOutOfBounds, displayNoteName } from './notes.js';
import { initializeMIDI, getScientificPitchNotation, printMIDIInfo } from './utils/index.js';


document.addEventListener('DOMContentLoaded', () => {
    let midiBuffer = [];
    const NOTE_ON = 144;

    initializeMIDI(handleMIDIEvent);

    initializeStaff();     

    // Get the value of the --cambridge-blue CSS variable (used to mark correct input)
    const cambridgeBlue = getComputedStyle(document.documentElement).getPropertyValue('--cambridge-blue').trim();

    function processNote(midiNote){
        const focusNoteElement = getFocusNote();
        const focusNote = focusNoteElement.getAttribute('data-note-name'); // Get the note name from the data attribute
        const note = getScientificPitchNotation(midiNote);

        if (note == focusNote) {
            setFocusNoteColor(cambridgeBlue);

            // Display the note name below the note
            displayNoteName(focusNoteElement, focusNote, cambridgeBlue);
    
            updateFocusNote();
    
            if (isFocusNoteOutOfBounds()){
                initializeStaff();
            }    
        }
    }

    setInterval(() => {
        while (midiBuffer.length) {
            const data = midiBuffer.shift();
            printMIDIInfo(data);
            const [command, midiNote, velocity] = data;
            // Ignore all commands except NOTE_ON
            if (command === NOTE_ON) {
                processNote(midiNote);    
            }   
        }
        midiBuffer = [];
    }, 250);

    function handleMIDIEvent (event){
        midiBuffer.push(event.data);
        }    
});

