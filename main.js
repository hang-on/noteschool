// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeMIDI();
    const notesContainer = document.querySelector('.notes-container');

    const staffWidth = notesContainer.clientWidth;

    // Generate a new note every 1500ms
    setInterval(() => {
        // 10% chance to skip generating a note
        if (Math.random() < 0.1) {
            return;
        }
        placeNoteOnStaff(notesContainer, generateRandomNote(), staffWidth - 20);
    }, 1500);

    // Update notes every 20ms
    setInterval(updateNotes, 30);
});
