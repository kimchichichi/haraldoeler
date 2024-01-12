
function showPage(pageId) {

  // Always show the navbar
  const navbar = document.querySelector('.nav-bar');
  if (navbar) {
      navbar.style.display = 'flex';
  }

  // Hide all pages except the navigation bar
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => {
      page.style.display = 'none';
  });

  // Scroll to the top of the document
  window.scrollTo({
      top: 0,
      behavior: 'smooth'
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




/* termime searchbox */
document.addEventListener("DOMContentLoaded", function () {
const searchBox = document.querySelector(".searchbox");
const searchInput = searchBox.querySelector("input");

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
  const elementsToSearch = document.querySelectorAll('.uhr, .datum, .concert, .location, .concert-info');

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

});

/* media */ 

    function openModal() {
      document.getElementById("myModal").style.display = "block";
    }

    function closeModal() {
      document.getElementById("myModal").style.display = "none";
    }

    var slideIndex = 1;
    showSlides(slideIndex);

    function plusSlides(n) {
      showSlides((slideIndex += n));
    }

    function currentSlide(n) {
      showSlides((slideIndex = n));
    }

    function showSlides(n) {
      var i;
      var slides = document.getElementsByClassName("mySlides");
      if (n > slides.length) {
        slideIndex = 1;
      }
      if (n < 1) {
        slideIndex = slides.length;
      }
      for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
      }
      slides[slideIndex - 1].style.display = "block";
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "ArrowRight") {
        plusSlides(1);
      } else if (event.key === "ArrowLeft") {
        plusSlides(-1);
      }
    });

//


    function scrollToTop() {
      // Assuming 'past' is the ID of your section
      var pastSection = document.getElementById('past');
      // Scroll back to the top of the 'past' section
      pastSection.scrollIntoView({ behavior: 'smooth' });
  }


