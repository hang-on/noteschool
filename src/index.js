import { initializeStaff, processNote, toggleClefMode } from './notes.js';
import { initializeMIDI } from './utils/index.js';


document.addEventListener('DOMContentLoaded', () => {
    let midiBuffer = [];
    const NOTE_ON = 144;

    document.getElementById('sound-toggle').addEventListener('change', function() {
        const clickSound = document.getElementById('click-sound');
        if (this.checked) {
            clickSound.play();
        }
    });

    // Toggle clef image between F-clef and G-clef
    document.getElementById('clef-image-container').addEventListener('click', function() {
        toggleClefMode();
        const clefImage = document.getElementById('clef-image');
        if (clefImage.src.includes('f-clef.png')) {
            clefImage.src = 'images/g-clef.png';
        } else {
            clefImage.src = 'images/f-clef.png';
        }
        initializeStaff();
    });


    initializeMIDI(handleMIDIEvent);

    initializeStaff();     

    setInterval(() => {
        // At a set interval, process all NOTE_ON messages in the MIDI buffer,
        // and clear the buffer afterwards.
        while (midiBuffer.length) {
            const data = midiBuffer.shift();
            const [command, midiNote] = data;
            // Ignore all commands except NOTE_ON
            if (command === NOTE_ON) {
                processNote(midiNote);    
            }   
        }
        // Clear midi buffer.
        midiBuffer = [];
    }, 100);

    function handleMIDIEvent (event){
        // Every MIDI event is buffered.
        midiBuffer.push(event.data);
        }    
});

