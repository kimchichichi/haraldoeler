document.addEventListener('DOMContentLoaded', function () {
    var header = document.querySelector('#header .header');
    var hamburgerDivs = document.querySelectorAll('.hamburger for');
    var logo = document.querySelector('#header .logo');

    // Function to update styles based on the current page and screen width
    function updateStyles() {
        var currentPageHash = window.location.hash;
        var screenWidth = window.innerWidth;

        // Check the screen width range and current page hash before applying styles
        if (screenWidth >= 320 && screenWidth <= 991) {
            if (currentPageHash !== '#home') {
                // Update styles for non-home pages
                header.style.backgroundColor = 'white';
                hamburgerDivs.forEach(function (div) {
                    div.style.backgroundColor = 'whitesmoke';
                });
                logo.style.color = 'whitesmoke';
            } else {
                // Set the default styles for #home page
                header.style.backgroundColor = 'transparent';
                hamburgerDivs.forEach(function (div) {
                    div.style.backgroundColor = 'var(--whitesmoke)';
                });
                logo.style.color = 'var(--whitesmoke)';
            }
        } else {
            // Reset styles for larger screens
            header.style.backgroundColor = 'white';
        }
    }


    // Event listener for hash changes (page navigation)
    window.addEventListener('hashchange', function () {
        // Update the styles based on the current page and screen width
        updateStyles();
    });

    // Additional logic for responsiveness (optional)
    window.addEventListener('resize', function () {
        // Update styles on window resize if needed
        updateStyles();
    });

    // Rest of your existing code...
});
