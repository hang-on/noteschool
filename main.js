// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeMIDI();
    const notesContainer = document.querySelector('.notes-container');

    // Generate a random note and place it on the staff at a specified x-coordinate
    const randomNoteData = generateRandomNote();
    const staffWidth = notesContainer.clientWidth;
    placeNoteOnStaff(notesContainer, randomNoteData, staffWidth - 20);

});
