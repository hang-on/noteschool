import { stats, saveStats} from './stats.js';
import { initializeMIDI } from './utils/index.js';

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
});
