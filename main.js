// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeMIDI();
    const notesContainer = document.querySelector('.notes-container');

    // Function to add a note at a specific position
    function addNoteAtPosition(x, y) {
        const note = document.createElement('div');
        note.classList.add('note');
        note.style.left = `${x}px`;
        note.style.top = `${y}px`;
        notesContainer.appendChild(note);
    }

    // Example: Add notes at different positions
    const positions = [
        { x: 0, y: 0 },
        { x: 100, y: 25 },
        { x: 200, y: 50 },
        { x: 300, y: 75 },
        { x: 400, y: 12 },
        { x: 500, y: 37 },
        { x: 600, y: 62},
        { x: 700, y: 87},
    ];

    positions.forEach(pos => addNoteAtPosition(pos.x, pos.y));
});