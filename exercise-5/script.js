getBooks();
enableNavigation();

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

    // Display books based on local storage content (available books default landing page)
    displayAvailableBooks();
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

function borrowBook() {
  const availableBooks = JSON.parse(localStorage.getItem("availableBooks")) || [];
  const borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || [];

  const cardRefs = document.querySelectorAll(".card");

  // Add functionality to each borrow button
  cardRefs.forEach((button) => {
    button.addEventListener("click", () => {
      // If the books is available to be lended out
      if (availableBooks.some((book) => String(book.isbn) === button.dataset.id)) {
        // Find the book object in the array
        const findBook = availableBooks.find((book) => String(book.isbn) === button.dataset.id);

        // Get the index of the book, remove it from available, add it to borrowed
        const bookIndex = availableBooks.indexOf(findBook);
        availableBooks.splice(bookIndex, 1);
        borrowedBooks.push(findBook);

        // Update localStorage to reflect new status for available/borrowed
        localStorage.setItem("availableBooks", JSON.stringify(availableBooks));
        localStorage.setItem("borrowedBooks", JSON.stringify(borrowedBooks));

        // Display the new state for the books
        displayAvailableBooks();
      }
    });
  });
}

function returnBook() {
  const availableBooks = JSON.parse(localStorage.getItem("availableBooks")) || [];
  const borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || [];

  const cardRefs = document.querySelectorAll(".card");

  // Add functionality to each return button
  cardRefs.forEach((button) => {
    button.addEventListener("click", (e) => {
      // If the books is available to be returned
      if (borrowedBooks.some((book) => String(book.isbn) === button.dataset.id)) {
        // Find the book object in the array
        const findBook = borrowedBooks.find((book) => String(book.isbn) === button.dataset.id);

        // Get the index of the book, remove it from borrowed, add it to available
        const bookIndex = borrowedBooks.indexOf(findBook);
        borrowedBooks.splice(bookIndex, 1);
        availableBooks.push(findBook);

        // Update localStorage to reflect new status for available/borrowed
        localStorage.setItem("borrowedBooks", JSON.stringify(borrowedBooks));
        localStorage.setItem("availableBooks", JSON.stringify(availableBooks));

        // Display the new state for the books
        displayBorrowedBooks();
      }
    });
  });
}

function displayAvailableBooks() {
  const availableBooks = JSON.parse(localStorage.getItem("availableBooks")) || [];

  const availableBooksRef = document.querySelector(".available-books");

  // Clear the innerHTML and update the list of available books based on localStorage
  availableBooksRef.innerHTML = "";
  availableBooks.forEach((book) => {
    availableBooksRef.innerHTML += createCard(
      book.cover,
      book.title,
      book.author,
      book.pages,
      book.genre,
      book.isbn,
      "btn-borrow",
      "Borrow"
    );
  });

  // Enable borrow and return functionality for respective buttons
  borrowBook();
}

function displayBorrowedBooks() {
  const borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || [];

  const borrowedBooksRef = document.querySelector(".borrowed-books");

  // Clear the innerHTML and update the list of borrowed books based on localStorage
  borrowedBooksRef.innerHTML = "";
  borrowedBooks.forEach((book) => {
    borrowedBooksRef.innerHTML += createCard(
      book.cover,
      book.title,
      book.author,
      book.pages,
      book.genre,
      book.isbn,
      "btn-borrow",
      "Return"
    );
  });

  // Enable borrow and return functionality for respective buttons
  returnBook();
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
        displayAvailableBooks();

      // If return nav item is clicked, show borrowed section and display borrowed books
      } else if (e.target.className === "return") {
        borrowRef.classList.remove("hidden");
        availableRef.classList.add("hidden");
        displayBorrowedBooks();
      }
    });
  });
}
