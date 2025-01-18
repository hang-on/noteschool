import { addNoteAtPosition, generateRandomNote, setFocusNoteColor, getFocusNote, initializeStaff, updateFocusNote, isFocusNoteOutOfBounds } from './notes.js';
import { onMIDIMessage, initializeMIDI, getActiveNotes } from './utils/index.js';


document.addEventListener('DOMContentLoaded', () => {
    initializeMIDI();


    // Preload the sound

    let readyForInput = false; 

    // Get the message label element
    const messageLabel = document.getElementById('message-label');
    messageLabel.textContent = 'Click anywhere to start a new session.';
    messageLabel.style.textAlign = 'center';
    messageLabel.style.marginBottom = '10px';

    const succesSound = new Audio('./sfx/success.mp3');

    // Function to enable sound playback after user interaction
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
            messageLabel.textContent = ''; // Clear the welcome message
        }).catch((error) => {
            console.error('Error enabling sound playback:', error);
        });
    };


    // Add event listener for user interaction to enable sound playback
    document.addEventListener('click', startNewSession);

    // Get the value of the --cambridge-blue CSS variable
    const cambridgeBlue = getComputedStyle(document.documentElement).getPropertyValue('--cambridge-blue').trim();

    const update = () => {
        const activeNotes = getActiveNotes();
        const focusNoteElement = getFocusNote();
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
            noteNameElement.style.top = `${focusNoteElement.offsetTop + 20}px`; // Adjust as needed
            noteNameElement.style.left = `${focusNoteElement.offsetLeft}px`; // Adjust as needed
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

    // Set up an interval to run the update function 60 times per second
    setInterval(update, 1000 / 30); // 1000ms / 60 = ~16.67ms
});

