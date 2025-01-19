/**
 * Initializes the message label with the provided text content.
 * @param {string} textContent - The text content to set for the message label.
 */
export function initializeMessageLabel(textContent) {
    const messageLabel = document.getElementById('message-label');
    if (messageLabel) {
        messageLabel.textContent = textContent;
        messageLabel.style.textAlign = 'center';
        messageLabel.style.marginBottom = '10px';
    } else {
        console.error('Message label element not found.');
    }
}

/**
 * Clears the message label.
 */
export function clearMessageLabel() {
    const messageLabel = document.getElementById('message-label');
    if (messageLabel) {
        messageLabel.textContent = '';
    } else {
        console.error('Message label element not found.');
    }
}