import { setFocusNoteColor, getFocusNote, initializeStaff, updateFocusNote, isFocusNoteOutOfBounds, displayNoteName } from './notes.js';
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
     * 1. Calls `initializeStaff()` to initialize the staff (including the focus note), 
     *    and sets up the update loop.
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

        // Set up an interval to run the update function
       setInterval(update, 1000 / 30);
 
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
     * - Retrieves the active notes (currently pressed keys on the piano) from the MIDI library.
     * - Gets the current focusnote (= the leftmost black note on the staff).
     * - If we are ready for input (all keys on the piano was released before new note input), and one of the 
     *   activeNotes (currently pressed keys) matches the focus note then:
     *   - Set the focus note color to mark it as correctly played.
     *   - Display the note name below the note.
     *   - Update the focus note --> next note to the right.
     *   - Check if the focus note is out of bounds (we have played all notes on the staff)
     *     and plays a success sound if it is.
     *   - Initialize the staff (including resetting the focus note to the first note on the staff).
     * - Resets the readyForInput flag if there are no active notes.
     */
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
                succesSound.play(); // Play the sound
                initializeStaff();
            }
        }

        if (activeNotes.size === 0 && readyForInput === false){
            readyForInput = true;
        }  
    };

});

