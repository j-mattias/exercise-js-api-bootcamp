document.addEventListener("DOMContentLoaded", () => {
  getBooks();
  enableNavigation();
  
  // Display books based on local storage content (available books default landing page)
  displayBooks("borrow", "availableBooks", document.querySelector(".available-books"));
});

async function getBooks() {
  try {
    // Get books from API
    const response = await fetch("https://majazocom.github.io/Data/books.json");
    const data = await response.json();

    // Check if localStorage already has books loaded
    const isAvailableBooks = localStorage.getItem("availableBooks");
    const isBorrowedBooks = localStorage.getItem("borrowedBooks");

    // If books haven't been loaded, load them
    if (!isAvailableBooks || !isBorrowedBooks) {
      localStorage.setItem("availableBooks", JSON.stringify(data));
    }
  } catch (error) {
    console.log(error.message);
  }
}

// Function to create the cards to display books
function createCard(img, title, author, pages, genre, id, btnClass, btnText) {
  const templateCard = `
    <article class="card" data-id="${id}">
      <figure>
      <div class="${btnClass}">${btnText}</div>
        <img
          src="${img}"
          alt="Cover for ${title}"
          class="btn-img" 
          data-id="${id}"
        />
      </figure>
      <div class="description">
        <div class="info">
          <h3>${title}</h3>
          <h4>${author}</h4>
        </div>
        <div class="details">
          <p>Pages: ${pages}</p>
          <p>Genre: ${genre}</p>
        </div>
      </div>
    </article>
  `;

  return templateCard;
}

function bookAction(action) {

  let addList, removeList, storageKey, sectionSelector;

  // If action is borrow, set removeList to be what's available, addList to what's borrowed and vice versa
  if (action === "borrow") {
    removeList = JSON.parse(localStorage.getItem("availableBooks")) || [];
    addList = JSON.parse(localStorage.getItem("borrowedBooks")) || [];
    storageKey = "availableBooks";
    sectionSelector = document.querySelector(".available-books");
  } else if (action === "return") {
    addList = JSON.parse(localStorage.getItem("availableBooks")) || [];
    removeList = JSON.parse(localStorage.getItem("borrowedBooks")) || [];
    storageKey = "borrowedBooks";
    sectionSelector = document.querySelector(".borrowed-books");
}

  const cardRefs = document.querySelectorAll(".card");

  // Add functionality to each borrow button
  cardRefs.forEach((button) => {
    button.addEventListener("click", () => {
      // If the books is available to be lended / returned
      if (removeList.some((book) => String(book.isbn) === button.dataset.id)) {
        // Find the book object in the array
        const findBook = removeList.find((book) => String(book.isbn) === button.dataset.id);

        // Get the index of the book, remove it from lended/returned and add to lended/returned
        const bookIndex = removeList.indexOf(findBook);
        removeList.splice(bookIndex, 1);
        addList.push(findBook);

        // Update localStorage to reflect new status for available/borrowed
        if (action === "borrow") {
          localStorage.setItem("availableBooks", JSON.stringify(removeList));
          localStorage.setItem("borrowedBooks", JSON.stringify(addList));
        } else if (action === "return") {
          localStorage.setItem("borrowedBooks", JSON.stringify(removeList));
          localStorage.setItem("availableBooks", JSON.stringify(addList));
        }

        // Display the new state for the books
        displayBooks(action, storageKey, sectionSelector);
      }
    });
  });
}

function displayBooks(btnMsg, storageKey, sectionSelector) {
  const books = JSON.parse(localStorage.getItem(storageKey)) || [];

  // Clear the innerHTML and update the list of books based on localStorage
  sectionSelector.innerHTML = "";
  books.forEach((book) => {
    sectionSelector.innerHTML += createCard(
      book.cover,
      book.title,
      book.author,
      book.pages,
      book.genre,
      book.isbn,
      "btn-borrow",
      `${btnMsg}`
    );
  });

  // Enable borrow and return functionality for respective buttons
  bookAction(btnMsg);
}

function enableNavigation() {
  const borrowRef = document.querySelector(".borrowed");
  const availableRef = document.querySelector(".available");
  const navItemsRef = document.querySelectorAll(".navbar_links > li");

  // For each nav item add click event to hide/show desired section
  navItemsRef.forEach((item) => {
    item.addEventListener("click", (e) => {

      // If borrow nav item is clicked, show available section and display available books
      if (e.target.className === "borrow") {
        borrowRef.classList.add("hidden");
        availableRef.classList.remove("hidden");
        displayBooks("borrow", "availableBooks", document.querySelector(".available-books"));

      // If return nav item is clicked, show borrowed section and display borrowed books
      } else if (e.target.className === "return") {
        borrowRef.classList.remove("hidden");
        availableRef.classList.add("hidden");
        displayBooks("return", "borrowedBooks", document.querySelector(".borrowed-books"));
      }
    });
  });
}
