export function setCurrentSession(session) {
    localStorage.setItem('currentSession', JSON.stringify(session)); // Save session to localStorage
}

export function getCurrentSession() {
    const session = JSON.parse(localStorage.getItem('currentSession')); // Retrieve session from localStorage
    if (!session) {
        console.error('No current session set.');
        return;
    }
    return session;
}

export const sessionData = [
    {
        value: "1",
        title: "C Major Scale, F-Clef, Full Set, 5 pages",
        length: "5",
        clef: "F",
        key: "C",
        notes: ['e2', 'f2', 'g2', 'b2', 'c3', 'd3', 'e3', 'f3', 'g3', 'b3', 'a3', 'b3', 'c4']
    },
    {
        value: "2",
        title: "C Major Scale, F-Clef, Low Set ",
        clef: "F",
        key: "C",
        notes: ['e2', 'f2', 'g2', 'a2', 'b2', 'c3', 'd3', 'e3']
    },
    {
        value: "3",
        title: "C Major Scale, G-Clef, Full Set, 5 pages",
        length: "5",
        clef: "G",
        key: "C",
        notes: ['c4', 'd4', 'e4', 'f4', 'g4', 'a4', 'b4', 'c5', 'd5', 'e5', 'f5', 'g5', 'a5']
    },
    {
        value: "4",
        title: "A Major Scale, G-Clef",
        clef: "G",
        key: "A",
        notes: ['c#4', 'd4', 'e4', 'f#4', 'g#4', 'b4', 'a4', 'c#5', 'd5', 'e5', 'f#5', 'g#5', 'a5']
    }    
];