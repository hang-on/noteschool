import { stats, saveStats} from './stats.js';
import { initializeMIDI } from './utils/index.js';
import { sessionData, setCurrentSession } from './data/sessions.js'; // Import the JSON data

window.onload = function(){
    // List available midi-devices in the designated section.
    initializeMIDI(dummy(), true);


};

function dummy (){
    // Do not do anything with midi messages here...
    return;
}

document.getElementById('start-button').addEventListener('click', function() {
    // Reset stats in localStorage
    saveStats();

    // Get the selected value from the drop-down box
    const dropdown = document.getElementById('session-dropdown');
    const selectedValue = dropdown.value; // Get the value of the selected option

    // Find the selected session in sessionData
    const selectedSession = sessionData.find(session => session.value === selectedValue);

    if (selectedSession) {
        // Set the global currentSession variable
        setCurrentSession(selectedSession);
    } else {
        console.error('Selected session not found in sessionData.');
    } 
});

document.addEventListener("DOMContentLoaded", function () {
    const dropdown = document.getElementById("session-dropdown");

    // Populate the dropdown with options
    sessionData.forEach(session => {
        const option = document.createElement("option");
        option.value = session.value;
        option.textContent = session.title;
        dropdown.appendChild(option);
    });

});

document.getElementById('reset-stats-button').addEventListener('click', function() {
    localStorage.removeItem('stats');
    localStorage.removeItem('avgTimeHistory');
    alert('Stats and history have been reset.');
});