import notesData from "./notesData.js";
import { getActiveNotes } from "./midi.js";
import { isNoteInHighlightRect, handleHighlightRect, getNotesInHighlightRect } from "./highlightRect.js";

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
 * Generates a random note from the notePool.
 * @returns {Object} The generated note data.
 */
function generateRandomNote() {
    const randomNote = notePool[Math.floor(Math.random() * notePool.length)];
    return notesData.find(note => note.note === randomNote);
}

/**
 * Moves a note to the left and removes it if it reaches the left border.
 * @param {HTMLElement} note - The note element to move.
 * @param {number} index - The index of the note in the notesOnStaff array.
 */
function moveNoteLeft(note, index) {
    const currentX = parseInt(note.style.left, 10);
    if (currentX <= 0) {
        note.remove();
        notesOnStaff.splice(index, 1);
    } else {
        note.style.left = `${currentX - 1}px`;
    }
}

/**
 * Updates the position of active notes, moving them to the left.
 * Removes notes that reach the left border of the staff.
 * Logs when a note enters or leaves the highlight rectangle.
 */
function updateNotes() {
    const highlightRect = document.querySelector('.highlight-rectangle').getBoundingClientRect();

    notesOnStaff.forEach((note, index) => {
        moveNoteLeft(note, index);
        handleHighlightRect(note, highlightRect);
    });

    // Call the function to compare notes in the highlight rect with active notes
    compareNotesInHighlightRectWithActiveNotes();
}

/**
 * Compares the notes in the highlight rect with the notes in the activeNotes set.
 * Logs "match" to the console if there is a match.
 */
function compareNotesInHighlightRectWithActiveNotes() {
    try {
        const activeNotes = new Set(getActiveNotes().map(note => note.toLowerCase())) || new Set();
        const x = getNotesInHighlightRect()
        x.forEach((note) => {
            if (activeNotes.has(note.textContent.toLowerCase())) {
                console.log("match");
            }
        });
    } catch (error) {
        console.error("An error occurred:", error);
        debugger; // Pauses execution for debugging
    }
}

export { addNoteAtPosition, updateNotes, generateRandomNote };