// Retrieve stats from localStorage
const stats = JSON.parse(localStorage.getItem('stats')) || { notesPlayed: 0, correctNotes: 0 };

// Display stats
const statsDisplay = document.getElementById('stats-display');
statsDisplay.innerHTML = `
    <p><b>Notes Played:</b> ${stats.notesPlayed}</p>
    <p><b>Correct Notes:</b> ${stats.correctNotes}</p>
`;
const timeStatsDisplay = document.getElementById('time-stats-display');
if (stats.averageTime == 0){
    timeStatsDisplay.innerHTML += `
    <p><b>Average Time Per Correct Note:</b> * Not available * Please clear a whole page to see this stat.</p>
    `;
} else {
    timeStatsDisplay.innerHTML += `
    <p><b>Average Time Per Correct Note:</b> ${stats.averageTime.toFixed(2)} seconds</p>
    <p><b>Total Session Time:</b> ${stats.totalSessionTime.toFixed(2)} seconds</p>
    `;
    console.log(stats.totalSessionTime)
}

// Calculate ratios
const totalNotes = stats.notesPlayed;
const correctRatio = totalNotes ? (stats.correctNotes / totalNotes) * 100 : 0;

// Set the CSS variable for the progress bar width
document.documentElement.style.setProperty('--progress-width', `${correctRatio}%`);

// Update progress bars
const correctProgressBar = document.getElementById('correct-progress');
correctProgressBar.style.width = '0'; // Start with 0 width to trigger the animation
setTimeout(() => {
    correctProgressBar.style.width = `${correctRatio}%`;
}, 100); // Delay to ensure the animation triggers

