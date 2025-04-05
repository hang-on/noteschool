import { getScientificPitchNotation } from './utils/index.js';
import { DEBUG_MODE, FAKE_NOTE_CORRECT, FAKE_NOTE_INCORRECT } from './config.js';
import { getCurrentSession } from './data/sessions.js';


const fClefNotes = [
    { name: 'c4', y: 30, strikeThrough: true },
    { name: 'b3', y: 40, strikeThrough: false },
    { name: 'a3', y: 50, strikeThrough: false },
    { name: 'g3', y: 60, strikeThrough: false },
    { name: 'f3', y: 70, strikeThrough: false },
    { name: 'e3', y: 80, strikeThrough: false },
    { name: 'd3', y: 90, strikeThrough: false },
    { name: 'c3', y: 100, strikeThrough: false },
    { name: 'b2', y: 110, strikeThrough: false },
    { name: 'a2', y: 120, strikeThrough: false },
    { name: 'g2', y: 130, strikeThrough: false },
    { name: 'f2', y: 140, strikeThrough: false },
    { name: 'e2', y: 150, strikeThrough: true },
];

const gClefNotes = [
    { name: 'a5', y: 30, strikeThrough: true },
    { name: 'g5', y: 40, strikeThrough: false },
    { name: 'f5', y: 50, strikeThrough: false },
    { name: 'e5', y: 60, strikeThrough: false },
    { name: 'd5', y: 70, strikeThrough: false },
    { name: 'c5', y: 80, strikeThrough: false },
    { name: 'b4', y: 90, strikeThrough: false },
    { name: 'a4', y: 100, strikeThrough: false },
    { name: 'g4', y: 110, strikeThrough: false },
    { name: 'f4', y: 120, strikeThrough: false },
    { name: 'e4', y: 130, strikeThrough: false },
    { name: 'd4', y: 140, strikeThrough: false },
    { name: 'c4', y: 150, strikeThrough: true },
];

// The pool from which to generate random notes
var notePool = [];

// Array to keep track of active notes on the staff
const notesOnStaff = [];

// Index for notesOnStaff. Used for testing, changing etc.
let focusNoteIndex = 0;
let numberOfNotes = 16;

// Global register that controls the clef mode (f-clef or g-clef)
const F_CLEF = 0;
const G_CLEF = 255;
var clefMode = F_CLEF;

// Get the value of the --cambridge-blue CSS variable (used to mark correct input)
const correctNoteColor = getComputedStyle(document.documentElement).getPropertyValue('--cambridge-blue').trim();

export function initializeStaff(){

    const session = getCurrentSession();

    notePool = session.notes;

    // Set the clef mode based on the session's clef property
    const clefImage = document.getElementById('clef-image');
    if (session.clef === 'F') {
        clefMode = F_CLEF;
        clefImage.src = 'images/f-clef.png'; // Path to the F-clef image
        clefImage.alt = 'F Clef';
    } else if (session.clef === 'G') {
        clefMode = G_CLEF;
        clefImage.src = 'images/g-clef.png'; // Path to the G-clef image
        clefImage.alt = 'G Clef';
    } else {
        console.error(`Unknown clef mode: ${session.clef}`);
        return;
    }

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

export function processNote(midiNote){
    // Take a MIDI note value and convert it to scientific pitch notation. Compare it to the focus note. If they match
    // (the user played the right note), change the color of the focus note, display the note name. Let the next note
    // on the staff be the focus note, or re-initialize the staff with a new set of notes, if the current focus note
    // was the last on the staff.
    // Returns 0 if notes do not match, 1 if notes match, and 255 if page was cleared
    const focusNoteElement = getFocusNote();
    const focusNote = focusNoteElement.getAttribute('data-note-name'); // Get the note name from the data attribute
    const note = getScientificPitchNotation(midiNote);
    if (note == focusNote || (midiNote == FAKE_NOTE_CORRECT && DEBUG_MODE == true)) {
        setFocusNoteColor(correctNoteColor);

        displayNoteName(focusNoteElement, focusNote, '--rich-black');

        updateFocusNote();

        if (isFocusNoteOutOfBounds()){
            initializeStaff();
            return 255;        
        } else {
            return 1;
        }
    } else if (midiNote == FAKE_NOTE_INCORRECT && DEBUG_MODE == true){
        return 0;
    } else {
        return 0;
    }
}

function getFocusNote(){
    return notesOnStaff[focusNoteIndex];
}

function updateFocusNote(){
    focusNoteIndex++;
}

function isFocusNoteOutOfBounds(){
    if (focusNoteIndex >= numberOfNotes) {
        return true
    } else {
        return false
    }
}

function addNoteAtPosition(container, x, y, strikeThrough = false, noteName) {
    const note = document.createElement('div');
    note.classList.add('note');
    note.style.left = `${x}px`;
    note.style.top = `${y}px`;
    note.setAttribute('data-note-name', noteName); // Set the note name as a data attribute

    // Make a stem that fits the note's placement on the bars.
    if (y <= 90) {
        // Create the note stem
        const noteStem = document.createElement('div');
        noteStem.classList.add('note-stem-down');
        note.appendChild(noteStem);
        
        // Create the note head
        const noteHead = document.createElement('div');
        noteHead.classList.add('note-head');
        note.appendChild(noteHead);
    } else {
        // Create the note head
        const noteHead = document.createElement('div');
        noteHead.classList.add('note-head');
        note.appendChild(noteHead);

        // Create the note stem
        const noteStem = document.createElement('div');
        noteStem.classList.add('note-stem-up');
        note.appendChild(noteStem);
    }

    // Create the strike-through line if needed
    if (strikeThrough) {
        const strikeThroughLine = document.createElement('div');
        strikeThroughLine.classList.add('strike-through-line');
        note.appendChild(strikeThroughLine);
    }

    container.appendChild(note);
    notesOnStaff.push(note); // Add the note to the notesOnStaff array
    return note;
}

function generateRandomNote() {
    const randomNote = notePool[Math.floor(Math.random() * notePool.length)];
    if (clefMode === F_CLEF){
        return fClefNotes.find(note => note.name === randomNote);
    } else {
        return gClefNotes.find(note => note.name === randomNote);
    }
}

function setFocusNoteColor(color) {
    // Set the background color of the focus note
    //notesOnStaff[focusNoteIndex].style.backgroundColor = color;
 
    // Set the color of the note head
    const noteHead = notesOnStaff[focusNoteIndex].querySelector('.note-head');
    if (noteHead) {
        noteHead.style.backgroundColor = color;
    }

    const noteStem = notesOnStaff[focusNoteIndex].querySelector('.note-stem-up');
    if (noteStem) {
        noteStem.style.backgroundColor = color;
    }
    const noteStemDown = notesOnStaff[focusNoteIndex].querySelector('.note-stem-down');
    if (noteStemDown) {
        noteStemDown.style.backgroundColor = color;
    }

    // Check if the note has a strike-through line and set its color
    const strikeThroughLine = notesOnStaff[focusNoteIndex].querySelector('.strike-through-line');
    if (strikeThroughLine) {
        strikeThroughLine.style.backgroundColor = color;
    }
}
function displayNoteName(focusNoteElement, noteName, color) {
    const noteNameElement = document.createElement('div');
    noteNameElement.textContent = noteName;
    noteNameElement.style.position = 'absolute';
    noteNameElement.style.top = `${focusNoteElement.offsetTop + 20}px`;
    noteNameElement.style.left = `${focusNoteElement.offsetLeft}px`;
    noteNameElement.style.color = color;
    noteNameElement.classList.add('note-name');
    focusNoteElement.parentElement.appendChild(noteNameElement); // Append to the parent element of the focus note
}
