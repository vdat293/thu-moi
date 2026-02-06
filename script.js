const envelope = document.getElementById('envelope');
const invitationCard = document.getElementById('invitationCard');
const btnRsvp = document.getElementById('btnRsvp');
const thankYouPage = document.getElementById('thankYouPage');
const typewriterText = document.getElementById('typewriterText');
const subMessage = document.getElementById('subMessage');
const thankYouDetails = document.getElementById('thankYouDetails');

// Open envelope animation
envelope.addEventListener('click', function () {
    envelope.classList.add('opening');

    setTimeout(() => {
        envelope.classList.add('opened');
        invitationCard.classList.add('visible');
    }, 800);
});

// Typewriter effect function
function typeWriter(element, text, speed = 50, callback) {
    let i = 0;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else {
            element.classList.add('done');
            if (callback) callback();
        }
    }

    type();
}

// Show thank you page with typewriter effect
function showThankYouPage() {
    // Hide invitation card
    invitationCard.style.opacity = '0';
    invitationCard.style.transform = 'translate(-50%, -50%) scale(0.95)';

    setTimeout(() => {
        invitationCard.style.visibility = 'hidden';
        thankYouPage.classList.add('visible');

        // Start typewriter effect after page is visible
        setTimeout(() => {
            typeWriter(typewriterText, 'Cảm ơn bạn đã xác nhận!', 60, () => {
                // Show sub message after typewriter finishes
                subMessage.textContent = 'Chúng tôi rất vui được gặp bạn tại buổi tiệc';
                subMessage.classList.add('visible');

                // Show details
                setTimeout(() => {
                    thankYouDetails.classList.add('visible');
                }, 300);
            });
        }, 400);
    }, 300);
}

// Event listeners
btnRsvp.addEventListener('click', showThankYouPage);
