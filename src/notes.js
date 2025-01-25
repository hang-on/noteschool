import fClefNotes from "./data/fClefNotes.js";
import { getScientificPitchNotation } from './utils/index.js';


// The pool from which to generate random notes
var notePool = [];

// Array to keep track of active notes on the staff
const notesOnStaff = [];

// Index for notesOnStaff. Used for testing, changing etc.
let focusNoteIndex = 0;
let numberOfNotes = 16;

// Two different data sets for the note pool
const notePool1 = ['c3', 'd3', 'e3', 'f3', 'g3', 'b3', 'a3', 'b3', 'c4'];
const notePool2 = ['e2', 'f2', 'g2', 'a2', 'b2', 'c3', 'd3', 'e3', 'f3'];

// Get the value of the --cambridge-blue CSS variable (used to mark correct input)
const cambridgeBlue = getComputedStyle(document.documentElement).getPropertyValue('--cambridge-blue').trim();

export function processNote(midiNote){
    const focusNoteElement = getFocusNote();
    const focusNote = focusNoteElement.getAttribute('data-note-name'); // Get the note name from the data attribute
    const note = getScientificPitchNotation(midiNote);

    if (note == focusNote) {
        setFocusNoteColor(cambridgeBlue);

        // Display the note name below the note
        displayNoteName(focusNoteElement, focusNote, cambridgeBlue);

        updateFocusNote();

        if (isFocusNoteOutOfBounds()){
            initializeStaff();
        }    
    }
}

function selectRandomNotePool() {
    const randomIndex = Math.floor(Math.random() * 2);
    return randomIndex === 0 ? notePool1 : notePool2;
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
    return fClefNotes.find(note => note.name === randomNote);
}

export function setFocusNoteColor(color) {
    //console.log(`notesOnStaff length: ${notesOnStaff.length}`);
    notesOnStaff[focusNoteIndex].style.backgroundColor = color;
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
