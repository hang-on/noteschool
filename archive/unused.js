/**
 * Renders all notes within the container.
 * @param {HTMLElement} container - The container to render the notes in.
 */
function renderNotes(container) {
    notesData.forEach((noteData, index) => {
        addNoteAtPosition(container, index * 50, noteData.y, noteData.strikeThrough);
    });
}