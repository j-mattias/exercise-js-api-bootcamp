getBooks();

async function getBooks() {
  const sectionRef = document.querySelector(".books");

  try {
    const response = await fetch("https://majazocom.github.io/Data/books.json");
    const data = await response.json();

    data.forEach((book) => {
      sectionRef.innerHTML += createCard(book.cover, book.title, book.author, book.pages, book.genre);
    });
  } catch (error) {
    console.log(error.message);
  }
}

function createCard(img, title, author, pages, genre) {
  const templateCard = `
    <article class="card">
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
      </div>
    </article>
  `;

  return templateCard;
}

{
  /* <article class="card">
  <figure>
    <img
      src=""
      alt=""
    />
  </figure>
  <div class="description">
    <div class="info">
      <h3>The fellowship of the ring</h3>
      <h4>JRR Tolkien</h4>
    </div>
    <div class="details">
      <p>Pages: 423</p>
      <p>Genre: Fantasy</p>
    </div>
  </div>
</article> */
}
