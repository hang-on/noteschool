const sprToMidi = {
    'C0': 12, 'C#0': 13, 'D0': 14, 'D#0': 15, 'E0': 16, 'F0': 17, 'F#0': 18, 'G0': 19, 'G#0': 20, 'A0': 21, 'A#0': 22, 'B0': 23,
    'C1': 24, 'C#1': 25, 'D1': 26, 'D#1': 27, 'E1': 28, 'F1': 29, 'F#1': 30, 'G1': 31, 'G#1': 32, 'A1': 33, 'A#1': 34, 'B1': 35,
    'C2': 36, 'C#2': 37, 'D2': 38, 'D#2': 39, 'E2': 40, 'F2': 41, 'F#2': 42, 'G2': 43, 'G#2': 44, 'A2': 45, 'A#2': 46, 'B2': 47,
    'C3': 48, 'C#3': 49, 'D3': 50, 'D#3': 51, 'E3': 52, 'F3': 53, 'F#3': 54, 'G3': 55, 'G#3': 56, 'A3': 57, 'A#3': 58, 'B3': 59,
    'C4': 60, 'C#4': 61, 'D4': 62, 'D#4': 63, 'E4': 64, 'F4': 65, 'F#4': 66, 'G4': 67, 'G#4': 68, 'A4': 69, 'A#4': 70, 'B4': 71,
    'C5': 72, 'C#5': 73, 'D5': 74, 'D#5': 75, 'E5': 76, 'F5': 77, 'F#5': 78, 'G5': 79, 'G#5': 80, 'A5': 81, 'A#5': 82, 'B5': 83,
    'C6': 84, 'C#6': 85, 'D6': 86, 'D#6': 87, 'E6': 88, 'F6': 89, 'F#6': 90, 'G6': 91, 'G#6': 92, 'A6': 93, 'A#6': 94, 'B6': 95,
    'C7': 96, 'C#7': 97, 'D7': 98, 'D#7': 99, 'E7': 100, 'F7': 101, 'F#7': 102, 'G7': 103, 'G#7': 104, 'A7': 105, 'A#7': 106, 'B7': 107,
    'C8': 108
};

const midiToSpr = {};
for (let note in sprToMidi) {
    midiToSpr[sprToMidi[note]] = note;
}

const NOTE_ON = 144;
const NOTE_OFF = 128;

let activeNotes = new Set();

// Function to initialize MIDI access
function initializeMIDI() {
    WebMidi.enable(function (err) {
        if (err) {
            console.error(`Failed to enable WebMidi: ${err}`);
            document.getElementById('error-message').innerText = `Failed to enable WebMidi: ${err}`;
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
function onMIDIMessage(event) {
    // MIDI message structure: [command, midiNote, velocity]
    const [command, midiNote, velocity] = event.data;
    // Scientific Pitch Notation (spr)
    const sprNote = midiToSpr[midiNote];

    if (sprNote === undefined) {
        console.log(`Note ${midiNote} is not mapped to any note on the midi-to-note map.`);
        return;
    }

    if (command === NOTE_ON && velocity > 0) { 
        if (!activeNotes.has(sprNote)) {
            activeNotes.add(sprNote);
            console.log(`Note on: ${sprNote} (velocity: ${velocity})`);
        }
    } else if (command === NOTE_OFF || (command === NOTE_ON && velocity === 0)) {
        if (activeNotes.has(sprNote)) {
            activeNotes.delete(sprNote);
            console.log(`Note off: ${sprNote}`);
        }
    }

    console.log(`MIDI message received: ${event.data}`);
    console.log(`Command: ${command}, Note: ${midiNote}, Velocity: ${velocity}`);
    console.log(`Played Note: ${sprNote}`);
    console.log(`Active Notes: ${Array.from(activeNotes).join(', ')}`);

}