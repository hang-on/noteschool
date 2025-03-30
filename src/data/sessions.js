export const sessionData = [
    {
        value: "1",
        text: "C Major Scale, F-Clef",
        clef: "F",
        key: "C",
        notes: [
            { name: "c4", y: 30, strikeThrough: true },     // THESE ARE INVALID VALUES
            { name: "b3", y: 40, strikeThrough: false },    // for placeholding only!
            { name: "a3", y: 50, strikeThrough: false },
            { name: "g3", y: 60, strikeThrough: false },
            { name: "f3", y: 70, strikeThrough: false }
        ]
    },
    {
        value: "2",
        text: "C Major Scale, G-Clef",
        clef: "G",
        key: "C",
        notes: [
            { name: "e5", y: 30, strikeThrough: true },
            { name: "d5", y: 40, strikeThrough: false },
            { name: "c5", y: 50, strikeThrough: false },
            { name: "b4", y: 60, strikeThrough: false },
            { name: "a4", y: 70, strikeThrough: false }
        ]
    },
    {
        value: "3",
        text: "A Major Scale, G-Clef",
        clef: "G",
        key: "A",
        notes: [
            { name: "a5", y: 30, strikeThrough: true },
            { name: "g5", y: 40, strikeThrough: false },
            { name: "f5", y: 50, strikeThrough: false },
            { name: "e5", y: 60, strikeThrough: false },
            { name: "d5", y: 70, strikeThrough: false }
        ]
    }
];