// Constants for MIDI message types
const NOTE_ON = 144;
const NOTE_OFF = 128;

// Set to keep track of active notes
let activeNotes = new Set();

// Global variable to control logging
const isLoggingEnabled = false;

const scientificPitchNotationToMIDI = {
    'c0': 12, 'c#0': 13, 'd0': 14, 'd#0': 15, 'e0': 16, 'f0': 17, 'f#0': 18, 'g0': 19, 'g#0': 20, 'a0': 21, 'a#0': 22, 'b0': 23,
    'c1': 24, 'c#1': 25, 'd1': 26, 'd#1': 27, 'e1': 28, 'f1': 29, 'f#1': 30, 'g1': 31, 'g#1': 32, 'a1': 33, 'a#1': 34, 'b1': 35,
    'c2': 36, 'c#2': 37, 'd2': 38, 'd#2': 39, 'e2': 40, 'f2': 41, 'f#2': 42, 'g2': 43, 'g#2': 44, 'a2': 45, 'a#2': 46, 'b2': 47,
    'c3': 48, 'c#3': 49, 'd3': 50, 'd#3': 51, 'e3': 52, 'f3': 53, 'f#3': 54, 'g3': 55, 'g#3': 56, 'a3': 57, 'a#3': 58, 'b3': 59,
    'c4': 60, 'c#4': 61, 'd4': 62, 'd#4': 63, 'e4': 64, 'f4': 65, 'f#4': 66, 'g4': 67, 'g#4': 68, 'a4': 69, 'a#4': 70, 'b4': 71,
    'c5': 72, 'c#5': 73, 'd5': 74, 'd#5': 75, 'e5': 76, 'f5': 77, 'f#5': 78, 'g5': 79, 'g#5': 80, 'a5': 81, 'a#5': 82, 'b5': 83,
    'c6': 84, 'c#6': 85, 'd6': 86, 'd#6': 87, 'e6': 88, 'f6': 89, 'f#6': 90, 'g6': 91, 'g#6': 92, 'a6': 93, 'a#6': 94, 'b6': 95,
    'c7': 96, 'c#7': 97, 'd7': 98, 'd#7': 99, 'e7': 100, 'f7': 101, 'f#7': 102, 'g7': 103, 'g#7': 104, 'a7': 105, 'a#7': 106, 'b7': 107,
    'c8': 108
};

/**
 * Converts a scientific pitch notation note to its corresponding MIDI value.
 * @param {string} note - The scientific pitch notation note (e.g., 'c4').
 * @returns {number} The corresponding MIDI value, or undefined if the note is not found.
 */
export function getMIDINoteValue(note) {
    return scientificPitchNotationToMIDI[note.toLowerCase()];
}

/**
 * Converts a MIDI note value to its corresponding scientific pitch notation.
 * @param {number} midiValue - The MIDI note value (e.g., 60).
 * @returns {string} The corresponding scientific pitch notation, or undefined if the value is not found.
 */
export function getScientificPitchNotation(midiValue) {
    const MIDIToScientificPitchNotation = {};
    for (let note in scientificPitchNotationToMIDI) {
        MIDIToScientificPitchNotation[scientificPitchNotationToMIDI[note]] = note;
    }
    return MIDIToScientificPitchNotation[midiValue];
}

/**
 * Retrieves the currently active MIDI notes.
 *
 * @returns {Set} A set of active MIDI notes.
 */
export function getActiveNotes() {
    return activeNotes;
}

// Function to initialize MIDI access
export function initializeMIDI() {
    WebMidi.enable(function (err) {
        if (err) {
            alert('WebMIDI is not supported in this browser.');
            return;
        }

        const inputs = WebMidi.inputs;
        let inputCount = 0;
        for (const input of inputs) {
            input.addListener('midimessage', 'all', (event) => {
                const [command] = event.data;
                if (command === NOTE_ON || command === NOTE_OFF) {
                    onMIDIMessage(event);
                }
            });
            console.log(`MIDI input added: ${input.name}`);
            inputCount++;
        }

        if (inputCount === 0) {
            console.log('No MIDI inputs detected.');
        } else {
            console.log(`Total MIDI inputs detected: ${inputCount}`);
        }
        console.log('MIDI access granted');
    }, true); // Enable sysex
}

// Function to handle incoming MIDI messages
export function onMIDIMessage(event) {
    // MIDI message structure: [command, midiNote, velocity]
    const [command, midiNote, velocity] = event.data;
    // Scientific Pitch Notation (spr)
    const note = getScientificPitchNotation(midiNote);

    if (note === undefined) {
        if (isLoggingEnabled) console.log(`Note ${midiNote} is not mapped to any note.`);
        return;
    }

    if (command === NOTE_ON && velocity > 0) { 
        if (!activeNotes.has(note)) {
            activeNotes.add(note);
            if (isLoggingEnabled) console.log(`Note on: ${note} (velocity: ${velocity})`);
        }
    } else if (command === NOTE_OFF || (command === NOTE_ON && velocity === 0)) {
        if (activeNotes.has(note)) {
            activeNotes.delete(note);
            if (isLoggingEnabled) console.log(`Note off: ${note}`);
        }
    }

    if (isLoggingEnabled) {
        console.log(`MIDI message received: ${event.data}`);
        console.log(`Command: ${command}, Note: ${midiNote}, Velocity: ${velocity}`);
        console.log(`Played Note: ${note}`);
        console.log(`Active Notes: ${Array.from(activeNotes).join(', ')}`);
    }
}
