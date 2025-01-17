import fClefNotes from "./data/fClefNotes.js";
import { getActiveNotes } from "./utils/midi.js";

// The pool from which to generate random notes
const notePool = ['c3', 'd3', 'e3', 'f3', 'g3'];

// Array to keep track of active notes on the staff
const notesOnStaff = [];
// Index for notesOnStaff. Used for testing, changing etc.
let focusNoteIndex = 0;
let numberOfNotes = 16;


export function getFocusNote(){
    return notesOnStaff[focusNoteIndex];
}

export function updateFocusNote(){
    focusNoteIndex++;
}

export function isFocusNoteOutOfBounds(){
    if (focusNoteIndex >= numberOfNotes) {
        return true
    } else {
        return false
    }
}

export function initializeStaff(){
    // Clear existing notes
    notesOnStaff.length = 0;

    // Reset index
    focusNoteIndex = 0;

    // Generate random notes and place them evenly spaced on the staff
    const notesContainer = document.querySelector('.notes-container');
    notesContainer.innerHTML = ''; // Clear the container

    const staffWidth = notesContainer.clientWidth;
    const spacing = staffWidth / (numberOfNotes + 1);

    for (let i = 0; i < numberOfNotes; i++) {
        const randomNoteData = generateRandomNote();
        const note = addNoteAtPosition(notesContainer, i * spacing + spacing, randomNoteData.y, randomNoteData.strikeThrough, randomNoteData.name);
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
export function setFocusNoteColor(color) {
    //console.log(`notesOnStaff length: ${notesOnStaff.length}`);
    notesOnStaff[focusNoteIndex].style.backgroundColor = color;
}


export { addNoteAtPosition, generateRandomNote };