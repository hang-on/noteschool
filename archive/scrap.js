    // Toggle clef image between F-clef and G-clef
    document.getElementById('clef-image-container').addEventListener('click', function() {
        const clefImage = document.getElementById('clef-image');
        if (clefImage.src.includes('f-clef.png')) {
            clefImage.src = 'images/g-clef.png';
        } else {
            clefImage.src = 'images/f-clef.png';
        }
        toggleClefMode();
        initializeStaff();
        clearedPages = 0;
        updateClearedPagesDisplay();
    });

