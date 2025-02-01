// Retrieve stats from localStorage
const stats = JSON.parse(localStorage.getItem('stats')) || { notesPlayed: 0, correctNotes: 0 };

// Display stats
const statsDisplay = document.getElementById('stats-display');
statsDisplay.innerHTML = `
    <p>Notes Played: ${stats.notesPlayed}</p>
    <p>Correct Notes: ${stats.correctNotes}</p>
`;
const timeStatsDisplay = document.getElementById('time-stats-display');
if (stats.averageTime == 0){
    timeStatsDisplay.innerHTML += `
    <p>Average Time Per Correct Note: * Not available * Please clear a whole page to see this stat.</p>
    `;
} else {
    timeStatsDisplay.innerHTML += `
    <p>Average Time Per Correct Note: ${stats.averageTime.toFixed(2)} seconds</p>
    `;
}

// Calculate ratios
const totalNotes = stats.notesPlayed;
const correctRatio = totalNotes ? (stats.correctNotes / totalNotes) * 100 : 0;

// Update progress bars
document.getElementById('correct-progress').style.width = `${correctRatio}%`;
