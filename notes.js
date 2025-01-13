// Data structure for notes
const notesData = [
    { note: 'c4', y: 30, strikeThrough: true },
    { note: 'b3', y: 40, strikeThrough: false },
    { note: 'a3', y: 50, strikeThrough: false },
    { note: 'g3', y: 60, strikeThrough: false },
    { note: 'f3', y: 70, strikeThrough: false },
    { note: 'e3', y: 80, strikeThrough: false },
    { note: 'd3', y: 90, strikeThrough: false },
    { note: 'c3', y: 100, strikeThrough: false },
    { note: 'b2', y: 110, strikeThrough: false },
    { note: 'a2', y: 120, strikeThrough: false },
    { note: 'g2', y: 130, strikeThrough: false },
    { note: 'f2', y: 140, strikeThrough: false },
    { note: 'e2', y: 150, strikeThrough: true },
    { note: 'd2', y: 160, strikeThrough: false },
    { note: 'c2', y: 170, strikeThrough: true }
];

const notePool = ['c3', 'd3', 'e3'];

/**
 * Adds a note at a specific position within the container.
 * @param {HTMLElement} container - The container to add the note to.
 * @param {number} x - The x-coordinate for the note.
 * @param {number} y - The y-coordinate for the note.
 * @param {boolean} strikeThrough - Whether the note has a strike-through line.
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
}

/**
 * Generates a random note from the notePool, looks up the note in the notesData,
 * and places the note on the rightmost part of the staff.
 * @param {HTMLElement} container - The container to add the note to.
 */
function generateRandomNoteAndPlace(container) {
    // Generate a random note from the notePool
    const randomNote = notePool[Math.floor(Math.random() * notePool.length)];

    // Look up the note in the notesData
    const noteData = notesData.find(note => note.note === randomNote);

    if (noteData) {
        // Get the width of the staff container to place the note on the rightmost part
        const staffWidth = container.clientWidth;

        // Add the note at the rightmost part of the staff
        addNoteAtPosition(container, staffWidth - 20, noteData.y, noteData.strikeThrough);
    }
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
        addNoteAtPosition(container, x, noteData.y, noteData.strikeThrough);
    }
}