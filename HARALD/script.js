/* 
document.addEventListener("DOMContentLoaded", function () {
    // Initial page load, show the home section
    showPage('home');
});

function showPage(pageId) {
    // Hide all pages except the navigation bar
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        if (pageId === 'home') {
            page.style.display = 'none';
        } else {
            page.style.display = 'none';
        }
    });

    // Show the selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.style.display = 'block';
    }

    // If the home link is clicked, show the home section
    if (pageId === 'home') {
        const homePage = document.getElementById('home');
        if (homePage) {
            homePage.style.display = 'block';
        }
    }
}
*/
function toggleMedia() {
  var mediaList = document.getElementById('mediaList');
  mediaList.style.display = (mediaList.style.display === 'none') ? 'block' : 'none';
}

function hideMediaList() {
  var mediaList = document.getElementById('mediaList');
  mediaList.style.display = 'none';
}
function showPage(pageId) {
  // Always show the navbar
  const navbar = document.querySelector('.navbar');
  if (navbar) {
      navbar.style.display = 'flex';
  }

  // Hide all pages except the navigation bar
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => {
      page.style.display = 'none';

  });

  // Show the selected page
  const selectedPage = document.getElementById(pageId);
  if (selectedPage) {
      selectedPage.style.display = 'block';

      
  }

  // If the home link is clicked, hide the home section
  if (pageId === 'home') {
      const homePage = document.getElementById('home');
      if (homePage) {
          homePage.style.display = 'block'; // Initially, show the home section
      }
  } else {
      const homePage = document.getElementById('home');
      if (homePage) {
          homePage.style.display = 'none'; // Hide the home section when navigating to another page
      }
  }
}







// TOGGLE BUTTON ON NAVIGATION
document.addEventListener("DOMContentLoaded", function() {
  const toggleBtn = document.querySelector(".toggle");
  const navbar = document.querySelector(".navbar");
  const vertical = document.querySelector(".vertical");
  const horizontal = document.querySelector(".horizontal");
  const verticalLinks = document.querySelectorAll('.vertical a');
  const horizontalLinks = document.querySelectorAll('.horizontal a');

  toggleBtn.addEventListener("click", () => {
      vertical.classList.toggle("active");
      horizontal.classList.toggle("active");

      // Adjust the navbar height dynamically
      if (vertical.classList.contains("active") || horizontal.classList.contains("active")) {
          navbar.style.height = "100%"; 
      } else {
          // Reset the navbar height when toggle is deactivated
          setNavbarHeight();
      }
  });

  function closeToggle() {
      vertical.classList.remove("active");
      horizontal.classList.remove("active");

      // Reset the navbar height when toggle is deactivated
      setNavbarHeight();
  }

  function setNavbarHeight() {
      // Check the screen width and adjust the navbar height accordingly
      if (window.innerWidth <= 768) {
          navbar.style.height = "50px";
      } else {
          navbar.style.height = ""; // Reset to default (CSS-defined) height
      }
  }

  // Initial setup on page load
  setNavbarHeight();

  window.addEventListener("resize", setNavbarHeight);

  verticalLinks.forEach(link => {
      link.addEventListener('click', closeToggle);
  });

  horizontalLinks.forEach(link => {
      link.addEventListener('click', closeToggle);
  });
});


// #ABOUT SLIDE 
document.addEventListener("DOMContentLoaded", function() {
    const radioButtons = document.querySelectorAll('input[name="radio-btn"]');
    const manualButtons = document.querySelectorAll('.manual-btn');
  
    let currentSlide = 0; 
    function autoChangeSlide() {
    
      radioButtons[currentSlide].checked = false;
      currentSlide = (currentSlide + 1) % radioButtons.length;
      radioButtons[currentSlide].checked = true;
    }
  
    const intervalId = setInterval(autoChangeSlide, 4000); // 
    manualButtons.forEach((button, index) => {
      button.addEventListener("click", function() {
                radioButtons[currentSlide].checked = false;
          currentSlide = index;
          radioButtons[currentSlide].checked = true;
          clearInterval(intervalId);
        intervalId = setInterval(autoChangeSlide, 5000); // 
      });
    });
  });




document.addEventListener("DOMContentLoaded", function () {
    // Initial page load, show the home section
    showPage('home');
    showDefaultYearItems('year2023'); // Show default items from the year 2023
});




// "Archive" button
// Add event listener for the "Archive" button
const archive = document.querySelector(".archive");
const scrollToTopButton = document.querySelector(".scroll-to-top");
let currentItems = 3;
let archiveActivated = false; // Added variable to track archive activation

archive.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent the default behavior of the anchor link

    const elementList = [...document.querySelectorAll(".schedule-info li")];
    e.target.classList.add("show-loader");

    for (let i = currentItems; i < currentItems + 3; i++) {
        if (elementList[i]) {
            elementList[i].style.display = "block";
        }
    }

    currentItems += 3;

    if (currentItems >= elementList.length) {
        // If there are no more items, hide the "Archive" button
        e.target.style.display = "none";
    }

    e.target.classList.remove("show-loader");

    if (elementList[currentItems - 1]) {
        elementList[currentItems - 1].appendChild(archive);

        // Scroll to the first newly displayed item
        const firstNewItem = elementList[currentItems - 3]; // Assuming 3 items are added each time
        if (firstNewItem) {
            firstNewItem.scrollIntoView({
                behavior: 'smooth'
            });
        }

        // Show the "Up" button
        scrollToTopButton.style.display = 'block';

        // Set archiveActivated to true
        archiveActivated = true;
    }
});

// Add event listener for the "Scroll to Top" button
scrollToTopButton.addEventListener("click", () => {
    if (archiveActivated) {
        // If archive button is activated, scroll to "PAST EVENTS" title
        const pastEventsTitle = document.querySelector(".past-events .title");
        if (pastEventsTitle) {
            const offsetTop = pastEventsTitle.offsetTop;

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    } else {
        // If archive button is not activated, scroll to "UPCOMING" section
        const upcomingSection = document.querySelector("#termine .upcoming");
        if (upcomingSection) {
            upcomingSection.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }

    // Hide the "Up" button after scrolling
    scrollToTopButton.style.display = 'none';
});




//search box 
const searchIcon = document.getElementById("search-icon");
const searchBox = document.querySelector(".search_box");
const searchInput = searchBox.querySelector("input");
const noResultsMessage = document.getElementById("no-results-message");

searchIcon.addEventListener("click", () => {
  toggleSearchBox();
});

searchInput.addEventListener("input", () => {
  performSearch();
});

searchInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    performSearch();
  } else if (event.key === "Backspace" && searchInput.value.trim() === "") {
    // If Backspace is pressed and the search input is empty, remove highlighting
    displaySearchResults("");
  }
});

function toggleSearchBox() {
  if (searchBox.classList.contains("active")) {
    searchBox.classList.remove("active");
    searchInput.value = "";
    // Remove highlighting when hiding the search box
    displaySearchResults("");
  } else {
    searchBox.classList.add("active");
    searchInput.focus();
  }
}

function performSearch() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  if (searchTerm === "") {
    // If the search input is empty or only contains whitespace, do nothing
    displaySearchResults("");
    noResultsMessage.style.display = "none";
    return;
  }

  // Clear previous highlights before applying the new ones
  clearSearchHighlights();

  // Display search results and update 'noResultsMessage'
  const searchResults = displaySearchResults(searchTerm);
  noResultsMessage.style.display = searchResults.length === 0 ? "block" : "none";
}

function clearSearchHighlights() {
  const highlightedElements = document.querySelectorAll('.highlight');
  highlightedElements.forEach(element => {
    element.outerHTML = element.textContent; // Remove the span but keep the text content
  });
}

function displaySearchResults(searchTerm) {
  const elementsToSearch = document.querySelectorAll('.schedule-info-upcoming .bold, .schedule-info-upcoming .concert, .schedule-info-upcoming .location, .schedule-info-upcoming .concert-info');

  return Array.from(elementsToSearch).map(element => {
    const originalContent = element.textContent;
    const searchTermLower = searchTerm.toLowerCase();
    const originalContentLower = originalContent.toLowerCase();
    const highlightedContent = highlightSearchTerms(originalContent, searchTermLower);
    element.innerHTML = highlightedContent;

    return highlightedContent; // Return highlighted content for checking results
  });
}

function highlightSearchTerms(content, searchTerm) {
  if (!searchTerm) {
    // If the search term is empty, return the original content without highlighting
    return content;
  }

  const regex = new RegExp(searchTerm, 'gi'); // 'gi' for global and case-insensitive search
  return content.replace(regex, match => `<span class="highlight">${match}</span>`);
}



// Function to toggle the visibility of past events
function toggleArchive() {
  const pastEvents = document.querySelectorAll("#past-events li");
  pastEvents.forEach(event => {
      event.style.display = !isArchiveVisible ? "block" : "none";
  });
  isArchiveVisible = !isArchiveVisible;
}

const pastSearchInput = document.getElementById("past-search-input");
const archiveButton = document.getElementById("archive-button");
const isArchiveVisible = false;



//hidepage
function showProjectInfo(hiddenPageId) {
    var hiddenPage = document.getElementById(hiddenPageId);
    // Toggle the visibility of the hidden page
    hiddenPage.style.display = (hiddenPage.style.display === 'none' || hiddenPage.style.display === '') ? 'block' : 'none';
}


// dropdown button for years on schedule

showSelectedYear();

    function showSelectedYear() {
        // Get the selected year from the dropdown
        var selectedYear = document.getElementById('yearSelector').value;

        // Hide all sections for past events
        var pastEventSections = document.querySelectorAll('.past-events section');
        pastEventSections.forEach(function(section) {
            section.style.display = 'none';
        });

        // Show the selected year's section for past events
        var selectedSection = document.getElementById('year' + selectedYear);
        if (selectedSection) {
            selectedSection.style.display = 'block';
        }
      // Scroll up the page to the selected section
      var offsetTop = selectedSection.offsetTop;
      window.scrollTo({
          top: offsetTop - window.innerHeight / 4, // Adjust as needed
          behavior: 'smooth' // You can change this to 'auto' for an instant scroll
      });
    }

//mp3 
