import fClefNotes from "./data/fClefNotes.js";
import gClefNotes from "./data/gClefNotes.js";
import { getScientificPitchNotation } from './utils/index.js';

const F_CLEF = 0;
const G_CLEF = 255;


// Global register that controls the clef mode (f-clef or g-clef)
var clefMode = F_CLEF;

// The pool from which to generate random notes
var notePool = [];

// Array to keep track of active notes on the staff
const notesOnStaff = [];

// Index for notesOnStaff. Used for testing, changing etc.
let focusNoteIndex = 0;
let numberOfNotes = 16;

// Two different data sets for the note pool in f-clef mode
const noteCollection1 = ['c3', 'd3', 'e3', 'f3', 'g3', 'b3', 'a3', 'b3', 'c4'];
const noteCollection2 = ['e2', 'f2', 'g2', 'a2', 'b2', 'c3', 'd3', 'e3', 'f3'];

// Two different data sets for the note pool in g-clef mode
const noteCollection3 = ['c4', 'e4', 'f4', 'g4', 'a4', 'b4', 'c5', 'd5', 'e5'];
const noteCollection4 = ['g4', 'a4', 'b4', 'c5', 'd5', 'e5', 'f5', 'g5', 'a5'];


// Get the value of the --cambridge-blue CSS variable (used to mark correct input)
const correctNoteColor = getComputedStyle(document.documentElement).getPropertyValue('--cambridge-blue').trim();

export function toggleClefMode(){
    if (clefMode === F_CLEF){
        clefMode = G_CLEF;
    } else {
        clefMode = F_CLEF;
    }
}

export function processNote(midiNote){
    // Take a MIDI note value and convert it to scientific pitch notation. Compare it to the focus note. If they match
    // (the user played the right note), change the color of the focus note, display the note name. Let the next note
    // on the staff be the focus note, or re-initialize the staff with a new set of notes, if the current focus note
    // was the last on the staff. 
    const focusNoteElement = getFocusNote();
    const focusNote = focusNoteElement.getAttribute('data-note-name'); // Get the note name from the data attribute
    const note = getScientificPitchNotation(midiNote);

    if (note == focusNote) {
        const tapSound = document.getElementById('tap-sound');
        tapSound.play();

        setFocusNoteColor(correctNoteColor);

        // Display the note name below the note
        displayNoteName(focusNoteElement, focusNote, correctNoteColor);

        updateFocusNote();

        if (isFocusNoteOutOfBounds()){
            initializeStaff();
            // Play the success sound if sound is enabled
            const soundToggle = document.getElementById('sound-toggle');
            if (soundToggle.checked) {
                const successSound = document.getElementById('success-sound');
                successSound.play();
            }        
        }    
    }
}

function selectRandomNotePool() {
    if (clefMode === F_CLEF){
        const randomIndex = Math.floor(Math.random() * 2);
        return randomIndex === 0 ? noteCollection1 : noteCollection2;
    } else {
        const randomIndex = Math.floor(Math.random() * 2);
        return randomIndex === 0 ? noteCollection3 : noteCollection4;
    }

}

export function getFocusNote(){
    return notesOnStaff[focusNoteIndex];
}

export function updateFocusNote(){
    focusNoteIndex++;
}

export function isFocusNoteOutOfBounds(){
    if (focusNoteIndex >= numberOfNotes) {
        return true
    } else {
        return false
    }
}

export function initializeStaff(){
    notePool = selectRandomNotePool();

    // Clear existing notes
    notesOnStaff.length = 0;

    // Reset index
    focusNoteIndex = 0;

    // Generate random notes and place them evenly spaced on the staff
    const notesContainer = document.querySelector('.notes-container');
    notesContainer.innerHTML = ''; // Clear the container

    const staffWidth = notesContainer.clientWidth;
    const spacing = staffWidth / (numberOfNotes + 1);

    for (let i = 0; i < numberOfNotes; i++) {
        const randomNoteData = generateRandomNote();
        const note = addNoteAtPosition(notesContainer, i * spacing + spacing, randomNoteData.y, randomNoteData.strikeThrough, randomNoteData.name);
    }
}

export function addNoteAtPosition(container, x, y, strikeThrough = false, noteName) {
    const note = document.createElement('div');
    note.classList.add('note');
    if (strikeThrough) {
        note.classList.add('strike-through-note');
    }
    note.style.left = `${x}px`;
    note.style.top = `${y}px`;
    note.setAttribute('data-note-name', noteName); // Set the note name as a data attribute
    container.appendChild(note);
    notesOnStaff.push(note); // Add the note to the notesOnStaff array
    return note;
}

export function generateRandomNote() {
    const randomNote = notePool[Math.floor(Math.random() * notePool.length)];
    if (clefMode === F_CLEF){
        return fClefNotes.find(note => note.name === randomNote);
    } else {
        return gClefNotes.find(note => note.name === randomNote);
    }
}

export function setFocusNoteColor(color) {
    // Set the background color of the focus note
    notesOnStaff[focusNoteIndex].style.backgroundColor = color;

    // Check if the note has a strike-through line and set its color
    const strikeThroughNote = notesOnStaff[focusNoteIndex].classList.contains('strike-through-note');
    if (strikeThroughNote) {
        notesOnStaff[focusNoteIndex].style.setProperty('--strike-through-color', color);
    }
}
export function displayNoteName(focusNoteElement, noteName, color) {
    const noteNameElement = document.createElement('div');
    noteNameElement.textContent = noteName;
    noteNameElement.style.position = 'absolute';
    noteNameElement.style.top = `${focusNoteElement.offsetTop + 20}px`;
    noteNameElement.style.left = `${focusNoteElement.offsetLeft}px`;
    noteNameElement.style.color = color;
    noteNameElement.classList.add('note-name');
    focusNoteElement.parentElement.appendChild(noteNameElement); // Append to the parent element of the focus note
}
