import fClefNotes from "./data/fClefNotes.js";
import { getActiveNotes } from "./utils/midi.js";

// The pool from which to generate random notes
const notePool = ['c3', 'd3', 'e3', 'f3', 'g3'];

// Array to keep track of active notes on the staff
const notesOnStaff = [];
// Focus note (an imdex for notesOnStaff. Used for testing, changing etc,)
const focusNoteIndex = 0;

export function getFocusNote(){
    return notesOnStaff[focusNoteIndex];
}


export function initializeStaff(numberOfNotes = 8){
    // Generate 8 random notes and place them evenly spaced on the staff
    const notesContainer = document.querySelector('.notes-container');

    const staffWidth = notesContainer.clientWidth;
    const spacing = staffWidth / (numberOfNotes+1);

    let notes = [];
    for (let i = 0; i < numberOfNotes; i++) {
        const randomNoteData = generateRandomNote();
        const note = addNoteAtPosition(notesContainer, i * spacing + spacing, randomNoteData.y, randomNoteData.strikeThrough, randomNoteData.name);
        notes.push(note);
    }
}


/**
 * Adds a note at a specific position within the container.
 * @param {HTMLElement} container - The container to add the note to.
 * @param {number} x - The x-coordinate for the note.
 * @param {number} y - The y-coordinate for the note.
 * @param {boolean} strikeThrough - Whether the note has a strike-through line.
 * @param {string} noteName - The name of the note (e.g., 'c4').
 * @returns {HTMLElement} The created note element.
 */
function addNoteAtPosition(container, x, y, strikeThrough = false, noteName) {
    const note = document.createElement('div');
    note.classList.add('note');
    if (strikeThrough) {
        note.classList.add('strike-through-note');
    }
    note.style.left = `${x}px`;
    note.style.top = `${y}px`;
    note.setAttribute('data-note-name', noteName); // Set the note name as a data attribute
    container.appendChild(note);
    notesOnStaff.push(note); // Add the note to the notesOnStaff array
    return note;
}

/**
 * Generates a random note from the global note pool.
 * @returns {Object} The generated note data.
 */
function generateRandomNote() {
    const randomNote = notePool[Math.floor(Math.random() * notePool.length)];
    return fClefNotes.find(note => note.name === randomNote);
}

/**
 * Sets the color of a note at a specific index on the staff.
 * @param {number} index - The index of the note to set the color for (0-7).
 * @param {string} color - The color to set.
 */
function setNoteColor(index, color) {
    console.log(`notesOnStaff length: ${notesOnStaff.length}`);
    if (index >= 0 && index < notesOnStaff.length) {
        const note = notesOnStaff[index];
        note.style.backgroundColor = color;
    } else {
        console.error('Invalid index.');
    }
}

/**
 * Removes a note at a specific index from the staff.
 * @param {number} index - The index of the note to remove (0-7).
 */
function removeNoteFromStaff(index) {
    console.log(`notesOnStaff length: ${notesOnStaff.length}`);
    if (index >= 0 && index < notesOnStaff.length) {
        const note = notesOnStaff[index];
        note.parentNode.removeChild(note);
        notesOnStaff.splice(index, 1);
    } else {
        console.error('Invalid index.');
    }
}

export { addNoteAtPosition, generateRandomNote, setNoteColor, removeNoteFromStaff };