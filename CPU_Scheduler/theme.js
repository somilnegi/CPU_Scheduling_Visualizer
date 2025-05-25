document.addEventListener('DOMContentLoaded', () => {
    // Apply saved theme from localStorage on page load
    const savedTheme = localStorage.getItem('theme');
    const checkbox = document.getElementById('checkbox');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        if (checkbox) checkbox.checked = true;
    } else {
        document.body.classList.remove('dark-mode');
        if (checkbox) checkbox.checked = false;
    }

    // Add event listener for theme toggle checkbox
    if (checkbox) {
        checkbox.addEventListener('change', () => {
            document.body.classList.toggle('dark-mode');
            // Save the current theme to localStorage
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        });
    }
});