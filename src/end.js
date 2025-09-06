// Retrieve stats from localStorage
const stats = JSON.parse(localStorage.getItem('stats')) || { notesPlayed: 0, correctNotes: 0 };

// Save the average Time Historiy
const avgTimeHistoryKey = 'avgTimeHistory';
let avgTimeHistory = JSON.parse(localStorage.getItem(avgTimeHistoryKey)) || [];

if (stats.averageTime && stats.averageTime > 0) {
    avgTimeHistory.push(stats.averageTime);
    // Keep only the last 5 attempts
    if (avgTimeHistory.length > 5) {
        avgTimeHistory = avgTimeHistory.slice(-5);
    }
    // Fill missing items with '2'
    while (avgTimeHistory.length < 5) {
        avgTimeHistory.unshift(2);
    }

    localStorage.setItem(avgTimeHistoryKey, JSON.stringify(avgTimeHistory));
}

// Exclude the current attempt (last value)
const previousAttempts = avgTimeHistory.slice(0, -1);
const previousMean = previousAttempts.reduce((sum, val) => sum + val, 0) / previousAttempts.length;

// Display stats
const statsDisplay = document.getElementById('stats-display');
statsDisplay.innerHTML = `
    <p><b>Total Pages Cleared:</b> ${stats.totalPagesCleared}</p>
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
    <p><b>Average Time Per Correct Note:</b> ${stats.averageTime.toFixed(2)} seconds. <b> Recent average: </b>${previousMean.toFixed(2)}</p>
    `;
}

let comparisonMessage = '';


if (stats.averageTime < previousMean) {
    comparisonMessage = '<p style="color:green;"><b>Improved!</b> Your average time per correct note is better than your recent average.</p>';
} else if (stats.averageTime > previousMean) {
    comparisonMessage = '<p style="color:red;"><b>Slower!</b> Your average time per correct note is worse than your recent average.</p>';
} else {
    comparisonMessage = '<p><b>No change</b> compared to your recent average.</p>';
}

timeStatsDisplay.innerHTML += comparisonMessage;
timeStatsDisplay.innerHTML += `
    <p><b>Total Session Time:</b> ${stats.totalSessionTime.toFixed(2)} seconds</p>
`;


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


