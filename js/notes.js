import notesData from "./notesData.js";

const notePool = ['c3', 'd3', 'e3'];

// Array to keep track of active notes on the staff
const notesOnStaff = [];

/**
 * Adds a note at a specific position within the container.
 * @param {HTMLElement} container - The container to add the note to.
 * @param {number} x - The x-coordinate for the note.
 * @param {number} y - The y-coordinate for the note.
 * @param {boolean} strikeThrough - Whether the note has a strike-through line.
 * @returns {HTMLElement} The created note element.
 */
function addNoteAtPosition(container, x, y, strikeThrough = false) {
    const note = document.createElement('div');
    note.classList.add('note');
    if (strikeThrough) {
        note.classList.add('strike-through-note');
    }
    note.style.left = `${x}px`;
    note.style.top = `${y}px`;
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
        const noteElement = addNoteAtPosition(container, x, noteData.y, noteData.strikeThrough);
        notesOnStaff.push(noteElement);
    }
}

/**
 * Updates the position of the notes on the staff, moving them to the left.
 * Removes notes that reach the left border of the staff.
 */
function updateNotes() {
    notesOnStaff.forEach((note, index) => {
        const currentX = parseInt(note.style.left, 10);
        if (currentX <= 0) {
            note.remove();
            notesOnStaff.splice(index, 1);
        } else {
            note.style.left = `${currentX - 1}px`;
        }
    });
}

export { placeNoteOnStaff, updateNotes, generateRandomNote }