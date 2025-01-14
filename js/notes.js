import notesData from "./notesData.js";
import { getActiveNotes } from "./midi.js";

const notePool = ['c3', 'd3', 'e3'];

// Array to keep track of active notes on the staff
const notesOnStaff = [];

// Set to keep track of notes within the highlight rectangle
const notesInHighlightRect = new Set();

// Variable to keep track of the previous state of active notes
let previousActiveNotes = new Set();

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
 * Checks if a note is wholly within the highlight rectangle.
 * @param {HTMLElement} note - The note element to check.
 * @param {DOMRect} rect - The bounding rectangle of the highlight rectangle.
 * @returns {boolean} True if the note is wholly within the highlight rectangle, false otherwise.
 */
function isNoteInHighlightRect(note, rect) {
    const noteRect = note.getBoundingClientRect();
    return (
        noteRect.left >= rect.left &&
        noteRect.right <= rect.right &&
        noteRect.top >= rect.top &&
        noteRect.bottom <= rect.bottom
    );
}

/**
 * Updates the position of active notes, moving them to the left.
 * Removes notes that reach the left border of the staff.
 * Logs when a note enters or leaves the highlight rectangle.
 */
function updateNotes() {
    const highlightRect = document.querySelector('.highlight-rectangle').getBoundingClientRect();

    notesOnStaff.forEach((note, index) => {
        const currentX = parseInt(note.style.left, 10);
        if (currentX <= 0) {
            note.remove();
            notesOnStaff.splice(index, 1);
        } else {
            note.style.left = `${currentX - 1}px`;

            const isInHighlight = isNoteInHighlightRect(note, highlightRect);
            if (isInHighlight && !notesInHighlightRect.has(note)) {
                notesInHighlightRect.add(note);
            } else if (!isInHighlight && notesInHighlightRect.has(note)) {
                notesInHighlightRect.delete(note);
            }
        }
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
        notesInHighlightRect.forEach((note) => {
            if (activeNotes.has(note.textContent.toLowerCase())) {
                console.log("match");
            }
        });
    } catch (error) {
        console.error("An error occurred:", error);
        debugger; // Pauses execution for debugging
    }
}

/**
 * Logs the contents of the active notes set if it has changed.
 */
function checkAndLogActiveNotes() {
    const currentActiveNotes = new Set(getActiveNotes().map(note => note.toLowerCase()));
    if (!setsAreEqual(previousActiveNotes, currentActiveNotes)) {
        console.log(`Active notes: ${Array.from(currentActiveNotes).join(', ')}`);
        previousActiveNotes = currentActiveNotes;
    }
}

/**
 * Helper function to check if two sets are equal.
 * @param {Set} setA - The first set to compare.
 * @param {Set} setB - The second set to compare.
 * @returns {boolean} True if the sets are equal, false otherwise.
 */
function setsAreEqual(setA, setB) {
    if (setA.size !== setB.size) return false;
    for (let item of setA) {
        if (!setB.has(item)) return false;
    }
    return true;
}

export { addNoteAtPosition, updateNotes, generateRandomNote, checkAndLogActiveNotes };