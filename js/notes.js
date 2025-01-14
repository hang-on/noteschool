import notesData from "./notesData.js";

const notePool = ['c3', 'd3', 'e3'];

// Array to keep track of active notes on the staff
const notesOnStaff = [];

// Set to keep track of notes within the highlight rectangle
const notesInHighlightRect = new Set();

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
 * Places a note on the staff at a specified x-coordinate.
 * @param {HTMLElement} container - The container to add the note to.
 * @param {Object} noteData - The note data to place.
 * @param {number} x - The x-coordinate for the note.
 */
function placeNoteOnStaff(container, noteData, x) {
    if (noteData) {
        const noteElement = addNoteAtPosition(container, x, noteData.y, noteData.strikeThrough, noteData.note);
        notesOnStaff.push(noteElement);
    }
}

/**
 * Checks if a note is within the highlight rectangle.
 * @param {HTMLElement} note - The note element to check.
 * @param {DOMRect} rect - The bounding rectangle of the highlight rectangle.
 * @returns {boolean} True if the note is within the highlight rectangle, false otherwise.
 */
function isNoteInHighlightRect(note, rect) {
    const noteRect = note.getBoundingClientRect();
    return (
        noteRect.left < rect.right &&
        noteRect.right > rect.left &&
        noteRect.top < rect.bottom &&
        noteRect.bottom > rect.top
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
            notesInHighlightRect.delete(note);
        } else {
            note.style.left = `${currentX - 1}px`;

            const isInHighlight = isNoteInHighlightRect(note, highlightRect);
            if (isInHighlight && !notesInHighlightRect.has(note)) {
                console.log(`Note entered highlight rectangle: ${note.textContent}`);
                notesInHighlightRect.add(note);
            } else if (!isInHighlight && notesInHighlightRect.has(note)) {
                console.log(`Note left highlight rectangle: ${note.textContent}`);
                notesInHighlightRect.delete(note);
            }
        }
    });
}

export { placeNoteOnStaff, updateNotes, generateRandomNote }