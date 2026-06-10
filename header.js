document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.getElementById('toggle');
    var navLinks = document.querySelectorAll('.nav-list a');

    // Function to close the navigation menu
    function closeNavigation() {
        toggle.checked = false;
    }

    // Event listener for clicks on navigation links
    navLinks.forEach(function (link) {
        link.addEventListener('click', closeNavigation);
    });

    // Rest of your existing code...
});
