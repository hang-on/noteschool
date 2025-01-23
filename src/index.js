import { setFocusNoteColor, getFocusNote, initializeStaff, updateFocusNote, isFocusNoteOutOfBounds, displayNoteName } from './notes.js';
import { initializeMIDI, getScientificPitchNotation, printMIDIInfo } from './utils/index.js';

const NOTE_ON = 144;
const NOTE_OFF = 128;
const ACTIVE_SENSING = 254; // Active Sensing message
let totalMIDIEvents = 0;

document.addEventListener('DOMContentLoaded', () => {
    let midiBuffer = [];
    
    initializeMIDI(handleMIDIEvent);

    initializeStaff();     

    // Get the value of the --cambridge-blue CSS variable (used to mark correct input)
    const cambridgeBlue = getComputedStyle(document.documentElement).getPropertyValue('--cambridge-blue').trim();

    function processNote(midiNote){

        //const note = getScientificPitchNotation(midiNote);
        const focusNoteElement = getFocusNote();
        var focusNote = focusNoteElement.getAttribute('data-note-name'); // Get the note name from the data attribute
        //console.log('Focus Note: ', focusNote);
        //console.log(midiNote);

        // Print MIDI message information to the MIDI info section
        // console.log(`Command: ${command}, Note: ${midiNote}, Velocity: ${velocity}`);
        const x = getScientificPitchNotation(midiNote);
        // console.log('Note played: ', x);
        console.log('Total midi events: ', totalMIDIEvents);
        printMIDIInfo(totalMIDIEvents);

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

    setInterval(() => {
        while (midiBuffer.length) {
            const data = midiBuffer.shift();
            const [command, midiNote, velocity] = data;    
            // Ignore all commands except NOTE_ON
            if ((command & 0xF0) === NOTE_ON ) {
                processNote(midiNote);
            }    
        }
        midiBuffer = [];

    }, 250);

    function handleMIDIEvent (event){
        //
        midiBuffer.push(event.data);
        totalMIDIEvents++;
    }
});

