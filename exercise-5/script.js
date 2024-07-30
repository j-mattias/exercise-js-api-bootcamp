getBooks();

async function getBooks() {

  try {

    // Get books from API
    const response = await fetch("https://majazocom.github.io/Data/books.json");
    const data = await response.json();

    // Check if localStorage already has books loaded
    const isAvailableBooks = localStorage.getItem("availableBooks");
    const isBorrowedBooks = localStorage.getItem("borrowedBooks");

    // If books haven't been loaded, load them
    if(!isAvailableBooks || !isBorrowedBooks) {
      localStorage.setItem("availableBooks", JSON.stringify(data));
    }
    
    // Display books based on local storage content
    displayBooks();

  } catch (error) {
    console.log(error.message);
  }
}

// Function to create the cards to display books
function createCard(img, title, author, pages, genre, id, btnClass, btnText) {
  const templateCard = `
    <article class="card" data-id="${id}">
      <figure>
        <img
          src="${img}"
          alt="Cover for ${title}"
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
        <div class="lending">
          <button class="${btnClass}" data-id="${id}">${btnText}</button>
        </div>
      </div>
    </article>
  `;

  return templateCard;
}

function borrowBook() {
  const availableBooks = JSON.parse(localStorage.getItem("availableBooks")) || [];
  const borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || [];

  const buttonRefs = document.querySelectorAll(".btn-borrow");

  // Add functionality to each borrow button
  buttonRefs.forEach((button) => {
    button.addEventListener("click", (e) => {

      // If the books is available to be lended out
      if (availableBooks.some((book) => String(book.isbn) === e.target.dataset.id)) {

        // Find the book object in the array
        const findBook = availableBooks.find((book) => String(book.isbn) === e.target.dataset.id);

        // Get the index of the book, remove it from available, add it to borrowed
        const bookIndex = availableBooks.indexOf(findBook);
        availableBooks.splice(bookIndex, 1);
        borrowedBooks.push(findBook);

        // Update localStorage to reflect new status for available/borrowed
        localStorage.setItem("availableBooks", JSON.stringify(availableBooks));
        localStorage.setItem("borrowedBooks", JSON.stringify(borrowedBooks));

        // Display the new state for the books
        displayBooks();
      }
    });
  });
}

function returnBook() {
  const availableBooks = JSON.parse(localStorage.getItem("availableBooks")) || [];
  const borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || [];

  const buttonRefs = document.querySelectorAll(".btn-return");

  // Add functionality to each return button
  buttonRefs.forEach(button => {
    button.addEventListener("click", (e) => {

      // If the books is available to be returned
      if (borrowedBooks.some((book) => String(book.isbn) === e.target.dataset.id)) {

        // Find the book object in the array
        const findBook = borrowedBooks.find((book) => String(book.isbn) === e.target.dataset.id);

        // Get the index of the book, remove it from borrowed, add it to available
        const bookIndex = borrowedBooks.indexOf(findBook);
        borrowedBooks.splice(bookIndex, 1);
        availableBooks.push(findBook);

        // Update localStorage to reflect new status for available/borrowed
        localStorage.setItem("borrowedBooks", JSON.stringify(borrowedBooks));
        localStorage.setItem("availableBooks", JSON.stringify(availableBooks));

        // Display the new state for the books
        displayBooks();
      }
    });
  });
}

function displayBooks() {
  const availableBooks = JSON.parse(localStorage.getItem("availableBooks")) || [];
  const borrowedBooks = JSON.parse(localStorage.getItem("borrowedBooks")) || [];

  const availableBooksRef = document.querySelector(".available-books");
  const borrowedBooksRef = document.querySelector(".borrowed-books");

  // Clear the innerHTML and update the list of available books based on localStorage
  availableBooksRef.innerHTML = "";
  availableBooks.forEach(book => {
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

  // Clear the innerHTML and update the list of borrowed books based on localStorage
  borrowedBooksRef.innerHTML = "";
  borrowedBooks.forEach(book => {
    borrowedBooksRef.innerHTML += createCard(
      book.cover,
      book.title,
      book.author,
      book.pages,
      book.genre,
      book.isbn,
      "btn-return",
      "Return"
    );
  });

  // Enable borrow and return functionality for respective buttons
  borrowBook();
  returnBook();
}