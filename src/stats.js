export const stats = {
    notesPlayed: 0,
    correctNotes: 0,
    startTime: null,
    totalTimeSpent: 0,
};

export function getAverageTimePerCorrectNote(){
    if (stats.correctNotes > 0) {
        return stats.totalTimeSpent / stats.correctNotes;
    }
    return 0;
}

// Initialize stats from localStorage if available
//if (localStorage.getItem('stats')) {
//    Object.assign(stats, JSON.parse(localStorage.getItem('stats')));
//}

// Function to save stats to localStorage
export function saveStats() {
    localStorage.setItem('stats', JSON.stringify(stats));
}