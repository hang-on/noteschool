import fClefNotes from "./data/fClefNotes.js";
import { getActiveNotes } from "./utils/midi.js";


// The pool from which to generate random notes
const notePool = ['c3', 'd3', 'e3'];

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
    note.textContent = noteName; // Set the text content to the note name
    container.appendChild(note);
    notesOnStaff.push(note); // Add the note to the notesOnStaff array
    return note;
}

/**
 * Generates a random note from the provided note pool.
 * @param {Array} notePool - The pool of notes to choose from.
 * @param {Array} noteData - The array of note data to search in.
 * @returns {Object} The generated note data.
 */
function generateRandomNote(notePool, noteData) {
    const randomNote = notePool[Math.floor(Math.random() * notePool.length)];
    return noteData.find(note => note.note === randomNote);
}

/**
 * Updates the position of active notes.
 * Removes notes that reach the left border of the staff.
 */
function updateNotes() {
    notesOnStaff.forEach((note, index) => {
        const currentX = parseInt(note.style.left, 10);
        if (currentX <= 0) {
            note.remove();
            notesOnStaff.splice(index, 1);
        }
    });
}

/**
 * Compares the notes with the notes in the activeNotes set.
 * Logs "match" to the console if there is a match.
 */
function compareNotesWithActiveNotes() {
    try {
        const activeNotes = new Set(getActiveNotes().map(note => note.toLowerCase())) || new Set();
        notesOnStaff.forEach((note) => {
            if (activeNotes.has(note.textContent.toLowerCase())) {
                console.log("match");
            }
        });
    } catch (error) {
        console.error("An error occurred:", error);
        debugger; // Pauses execution for debugging
    }
}

export { addNoteAtPosition, updateNotes, generateRandomNote, compareNotesWithActiveNotes };