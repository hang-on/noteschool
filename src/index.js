import { setFocusNoteColor, getFocusNote, initializeStaff, updateFocusNote, isFocusNoteOutOfBounds } from './notes.js';
import { initializeMIDI, getActiveNotes } from './utils/index.js';
import { initializeMessageLabel, clearMessageLabel } from './messageHandler.js';


document.addEventListener('DOMContentLoaded', () => {
    let readyForInput = false; 

    // Get the value of the --cambridge-blue CSS variable (used to mark correct input)
    const cambridgeBlue = getComputedStyle(document.documentElement).getPropertyValue('--cambridge-blue').trim();

    initializeMIDI();

    initializeMessageLabel("Welcome to Noteschool. Click anywhere to start the session.");

    const succesSound = new Audio('./sfx/success.mp3');

    /**
     * Initializes a new session. It is called the first time the user clicks or taps somewhere.
     * 
     * This function performs the following steps:
     * 1. Calls `initializeStaff()` to initialize the staff.
     * 2. Creates an `AudioContext` to manage and play audio.
     * 3. Creates a `GainNode` to control the volume of the audio.
     * 4. Connects the audio track to the gain node and the gain node to the audio context's destination.
     * 5. Plays the success sound, then immidiately pauses and resets it (preloading the sound).
     * 6. Removes the click event listener for starting a new session.
     * 7. Clears the welcome message.
     * 
     * @function
     * @name startNewSession
     * @throws {Error} If there is an issue enabling sound playback.
     */
    const startNewSession = () => {
        initializeStaff();     
    
        // Create an AudioContext
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const track = audioContext.createMediaElementSource(succesSound);
    
        // Create a GainNode to control the volume
        const gainNode = audioContext.createGain();
        gainNode.gain.value = 2; // Amplify the sound (2x volume)
    
        // Connect the track to the gain node and the gain node to the audio context's destination
        track.connect(gainNode).connect(audioContext.destination);
    
        succesSound.play().then(() => {
            succesSound.pause();
            succesSound.currentTime = 0;
            document.removeEventListener('click', startNewSession);
            clearMessageLabel(); // Clear the welcome message
        }).catch((error) => {
            console.error('Error enabling sound playback:', error);
        });
    };

    // Add event listener for user interaction to start a new session.
    document.addEventListener('click', startNewSession);

    /**
     * Updates the state of the application based on the active notes and the focused note.
     * 
     * - Retrieves the active notes from the MIDI library.
     * - Gets the currently focused note element.
     * - If a focused note is found and ready for input:
     *   - Sets the focus note color.
     *   - Displays the note name below the note.
     *   - Updates the focus note.
     *   - Checks if the focus note is out of bounds and plays a success sound if it is.
     *   - Initializes the staff.
     * - Resets the readyForInput flag if there are no active notes.
     */
    const update = () => {
        const activeNotes = getActiveNotes(); // activeNotes is a set handled by the midi.js library
        const focusNoteElement = getFocusNote(); // focusNote is handled by notes.js
        if (focusNoteElement) {
            var focusNote = focusNoteElement.getAttribute('data-note-name'); // Get the note name from the data attribute
        } else {
            //console.log("Problem accessing getFocusNote...");
        }
              
        if (readyForInput === true && activeNotes.has(focusNote)) {
            setFocusNoteColor(cambridgeBlue);

            // Display the note name below the note
            const noteNameElement = document.createElement('div');
            noteNameElement.textContent = focusNote;
            noteNameElement.style.position = 'absolute';
            noteNameElement.style.top = `${focusNoteElement.offsetTop + 20}px`;
            noteNameElement.style.left = `${focusNoteElement.offsetLeft}px`;
            noteNameElement.style.color = cambridgeBlue;
            noteNameElement.classList.add('note-name');
            focusNoteElement.parentElement.appendChild(noteNameElement); // Append to the parent element of the focus note

            updateFocusNote();
            readyForInput = false;
            if (isFocusNoteOutOfBounds()){
                succesSound.play(); // Play the sound
                initializeStaff();
            }
        }

        if (activeNotes.size === 0 && readyForInput === false){
            readyForInput = true;
        }  
    };

    // Set up an interval to run the update function
    setInterval(update, 1000 / 30);
});

