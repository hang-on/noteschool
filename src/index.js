import { stats, saveStats} from './stats.js';
import { initializeMIDI } from './utils/index.js';

window.onload = function(){
    initializeMIDI();
};

document.getElementById('start-button').addEventListener('click', function() {
    // Reset stats in localStorage
    saveStats();
});
