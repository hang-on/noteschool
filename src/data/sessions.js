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
        title: "C Major Scale, F-Clef",
        clef: "F",
        key: "C",
        notes: ['c3', 'd3', 'e3', 'f3', 'g3', 'b3', 'a3', 'b3', 'c4']
    },
    {
        value: "2",
        title: "C Major Scale, G-Clef",
        clef: "G",
        key: "C",
        notes: ['c3', 'd3', 'e3', 'f3', 'g3', 'b3', 'a3', 'b3', 'c4']
    },
    {
        value: "3",
        title: "A Major Scale, G-Clef",
        clef: "G",
        key: "A",
        notes: ['c3', 'd3', 'e3', 'f3', 'g3', 'b3', 'a3', 'b3', 'c4']
        }
];