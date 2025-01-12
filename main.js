// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeMIDI();
    const notesContainer = document.querySelector('.notes-container');

    // Function to add a note at a specific position
    function addNoteAtPosition(x, y, strikeThrough = false) {
        const note = document.createElement('div');
        note.classList.add('note');
        if (strikeThrough) {
            note.classList.add('strike-through-note');
        }
        note.style.left = `${x}px`;
        note.style.top = `${y}px`;
        notesContainer.appendChild(note);
    }

    // Example: Add notes at different positions
    const positions = [
        { x: 50, y: 12, strikeThrough: true },
        { x: 150, y: 75, strikeThrough: false },
        { x: 250, y: 100 },
        { x: 350, y: 125 },
        { x: 450, y: 37 },
        { x: 550, y: 62 },
        { x: 650, y: 87},
        { x: 750, y: 112},
    ];

    positions.forEach(pos => addNoteAtPosition(pos.x, pos.y, pos.strikeThrough));
});