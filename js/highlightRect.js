// Set to keep track of notes within the highlight rectangle
const notesInHighlightRect = new Set();

function getNotesInHighlightRect() {
    return notesInHighlightRect
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
 * Handles the logic for notes entering or leaving the highlight rectangle.
 * @param {HTMLElement} note - The note element to check.
 * @param {DOMRect} highlightRect - The bounding rectangle of the highlight rectangle.
 */
function handleHighlightRect(note, highlightRect) {
    const isInHighlight = isNoteInHighlightRect(note, highlightRect);
    if (isInHighlight && !notesInHighlightRect.has(note)) {
        notesInHighlightRect.add(note);
    } else if (!isInHighlight && notesInHighlightRect.has(note)) {
        notesInHighlightRect.delete(note);
    }
}

export { isNoteInHighlightRect, handleHighlightRect, getNotesInHighlightRect };