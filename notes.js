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
 * Renders all notes within the container.
 * @param {HTMLElement} container - The container to render the notes in.
 */
function renderNotes(container) {
    notesData.forEach((noteData, index) => {
        addNoteAtPosition(container, index * 50, noteData.y, noteData.strikeThrough);
    });
}