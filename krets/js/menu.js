document.addEventListener("DOMContentLoaded", function() {
    // Dynamically add a CSS file
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/css/menu.css?v=' + new Date().getTime();
    document.head.appendChild(link);

    fetch('/nav.html')
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data, 'text/html');
            const nav = doc.querySelector('nav');
            if (nav) {
                document.body.insertBefore(nav, document.body.firstChild);

                const trigger = document.createElement('div');
                trigger.id = 'menu-trigger';
                document.body.insertBefore(trigger, document.body.firstChild);
            }
        })
        .catch(error => console.error('Error loading the navigation menu:', error));

});
