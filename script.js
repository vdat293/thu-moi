const envelope = document.getElementById('envelope');
const invitationCard = document.getElementById('invitationCard');
const btnRsvp = document.getElementById('btnRsvp');
const thankYouPage = document.getElementById('thankYouPage');
const typewriterText = document.getElementById('typewriterText');
const subMessage = document.getElementById('subMessage');
const thankYouDetails = document.getElementById('thankYouDetails');
const btnCalendar = document.getElementById('btnCalendar');

// Event details
const eventDetails = {
    title: 'Tiệc Tất niên cuối năm - 8386',
    description: 'Buổi tiệc tất niên cuối năm cùng với 8386. Chúng tôi rất vui được gặp bạn!',
    location: 'Nhà hàng 81&91, 168-170 Hoàng Văn Thụ, Phường Chánh Nghĩa, TP. Thủ Dầu Một, Bình Dương, 820000',
    startDate: '2026-02-06T18:00:00',
    endDate: '2026-02-06T21:00:00'
};

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
                    btnCalendar.classList.add('visible');
                }, 300);
            });
        }, 400);
    }, 300);
}

// Format date for ICS file (YYYYMMDDTHHMMSS)
function formatDateForICS(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}

// Generate ICS file content
function generateICS() {
    const startFormatted = formatDateForICS(eventDetails.startDate);
    const endFormatted = formatDateForICS(eventDetails.endDate);
    const now = formatDateForICS(new Date().toISOString());

    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//8386 Party//Invitation//VI',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        `DTSTART:${startFormatted}`,
        `DTEND:${endFormatted}`,
        `DTSTAMP:${now}`,
        `UID:${Date.now()}@8386party.com`,
        `SUMMARY:${eventDetails.title}`,
        `DESCRIPTION:${eventDetails.description}`,
        `LOCATION:${eventDetails.location}`,
        'STATUS:CONFIRMED',
        'BEGIN:VALARM',
        'TRIGGER:-PT30M',
        'ACTION:DISPLAY',
        'DESCRIPTION:Reminder: Tiệc Tất niên sẽ bắt đầu sau 30 phút nữa!',
        'END:VALARM',
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    return icsContent;
}

// Download ICS file - optimized for iOS
function downloadICS() {
    const icsContent = generateICS();
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    // Create blob
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });

    if (isIOS) {
        // Method for iOS Safari - create a link and simulate click
        const url = URL.createObjectURL(blob);

        // Create invisible link
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'tiec-tat-nien-8386.ics');
        link.style.display = 'none';
        document.body.appendChild(link);

        // Trigger click
        link.click();

        // Cleanup after delay
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 1000);
    } else {
        // For other devices
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'tiec-tat-nien-8386.ics';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

// Generate Google Calendar URL
function getGoogleCalendarUrl() {
    const startFormatted = formatDateForICS(eventDetails.startDate);
    const endFormatted = formatDateForICS(eventDetails.endDate);

    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: eventDetails.title,
        dates: `${startFormatted}/${endFormatted}`,
        details: eventDetails.description,
        location: eventDetails.location,
        ctz: 'Asia/Ho_Chi_Minh'
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// Generate Android Calendar Intent URL (opens Google Calendar app directly)
function getAndroidCalendarIntent() {
    // Format: content://com.android.calendar/events
    // But for web, Google Calendar URL works best and opens the app if installed
    const startFormatted = formatDateForICS(eventDetails.startDate);
    const endFormatted = formatDateForICS(eventDetails.endDate);

    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: eventDetails.title,
        dates: `${startFormatted}/${endFormatted}`,
        details: eventDetails.description,
        location: eventDetails.location,
        ctz: 'Asia/Ho_Chi_Minh'
    });

    // This URL will open in Google Calendar app if installed on Android
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// Check if running in in-app browser (Zalo, Facebook, etc.)
function isInAppBrowser() {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    return (
        ua.includes('FBAN') || ua.includes('FBAV') ||
        ua.includes('Instagram') || ua.includes('Zalo') ||
        ua.includes('ZaloTheme') || ua.includes('Line') ||
        (ua.includes('wv') && ua.includes('Android'))
    );
}

// Show alert for in-app browser users
function showInAppBrowserAlert() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const browserName = isIOS ? 'Safari' : 'Chrome';

    const overlay = document.createElement('div');
    overlay.id = 'inAppAlert';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);display:flex;justify-content:center;align-items:center;z-index:9999;padding:20px;box-sizing:border-box;';

    overlay.innerHTML = `
        <div style="background:#fffef8;padding:30px;border-radius:12px;text-align:center;max-width:320px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.3);">
            <div style="font-size:40px;margin-bottom:15px;">📅</div>
            <h3 style="font-family:'Cormorant Garamond',serif;font-size:1.4rem;color:#2c2c2c;margin-bottom:10px;">Thêm vào lịch</h3>
            <p style="font-size:0.9rem;color:#666;margin-bottom:20px;line-height:1.5;">
                Để thêm sự kiện vào lịch, vui lòng mở trang này bằng <strong>${browserName}</strong>
            </p>
            <p style="font-size:0.8rem;color:#999;margin-bottom:20px;">
                Nhấn <strong>⋮</strong> hoặc <strong>⋯</strong> → "Mở bằng ${browserName}"
            </p>
            <button onclick="navigator.clipboard.writeText(window.location.href).then(()=>{this.textContent='✓ Đã sao chép!';this.style.background='#27ae60';})" style="background:linear-gradient(135deg,#c9a86c,#b89855);color:white;border:none;padding:12px 25px;font-size:0.85rem;border-radius:25px;cursor:pointer;margin-bottom:10px;width:100%;">📋 Sao chép link</button>
            <br>
            <button onclick="document.getElementById('inAppAlert').remove()" style="background:transparent;color:#666;border:1px solid #ddd;padding:10px 25px;font-size:0.8rem;border-radius:25px;cursor:pointer;width:100%;">Đóng</button>
        </div>
    `;

    document.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
}

// Add to calendar - detect device and use appropriate method
function addToCalendar() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    const isMac = /Macintosh/.test(navigator.userAgent);

    if (isInAppBrowser()) {
        showInAppBrowserAlert();
        return;
    }

    if (isIOS || isAndroid) {
        window.location.href = getGoogleCalendarUrl();
    } else if (isMac) {
        downloadICS();
    } else {
        window.open(getGoogleCalendarUrl(), '_blank');
    }
}

// Event listeners
btnRsvp.addEventListener('click', showThankYouPage);
btnCalendar.addEventListener('click', addToCalendar);
