import fClefNotes from "./data/fClefNotes.js";
import { getActiveNotes } from "./utils/midi.js";

// The pool from which to generate random notes
const notePool = ['c3', 'd3', 'e3', 'f3', 'g3'];

// Array to keep track of active notes on the staff
const notesOnStaff = [];

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
    return fClefNotes.find(note => note.note === randomNote);
}

/**
 * Sets the color of a note at a specific index on the staff.
 * @param {number} index - The index of the note to set the color for (0-7).
 * @param {string} color - The color to set.
 */
function setNoteColor(index, color) {
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
    if (index >= 0 && index < notesOnStaff.length) {
        const note = notesOnStaff[index];
        note.parentNode.removeChild(note);
        notesOnStaff.splice(index, 1);
    } else {
        console.error('Invalid index.');
    }
}

export { addNoteAtPosition, generateRandomNote, setNoteColor, removeNoteFromStaff };