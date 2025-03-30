import { stats, saveStats} from './stats.js';
import { initializeMIDI } from './utils/index.js';
import { sessionData } from './data/sessions.js'; // Import the JSON data

window.onload = function(){
    // List available midi-devices in the designated section.
    initializeMIDI(dummy(), true);

    // Retrieve the selected session from localStorage
    const savedSession = localStorage.getItem('selectedSession');
    if (savedSession) {
        const dropdown = document.getElementById('session-dropdown');
        dropdown.value = savedSession; // Set the drop-down to the saved value
    }    
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

    // Save the selected value to localStorage
    localStorage.setItem('selectedSession', selectedValue);
    
});

document.addEventListener("DOMContentLoaded", function () {
    const dropdown = document.getElementById("session-dropdown");

    // Populate the dropdown with options
    sessionData.forEach(session => {
        const option = document.createElement("option");
        option.value = session.value;
        option.textContent = session.text;
        dropdown.appendChild(option);
    });

    // Retrieve the selected session from localStorage and set it as selected
    const savedSession = localStorage.getItem("selectedSession");
    if (savedSession) {
        dropdown.value = savedSession;
    }
});
