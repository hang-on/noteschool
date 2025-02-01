import { stats, saveStats} from './stats.js';

document.getElementById('start-button').addEventListener('click', function() {
    // Reset stats in localStorage
    saveStats();
});
