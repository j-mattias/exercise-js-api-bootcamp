// Exercise 1
getPokemons();

function getPokemons() {

  const sectionRef = document.querySelector("#exercise1");

  fetch("https://santosnr6.github.io/Data/pokemons.json")
    .then((response) => response.json())
    .then((data) => {
      data.forEach(pokemon => {
        // console.log(pokemon);
        const pokemonRef = document.createElement("p");
        pokemonRef.textContent = pokemon.name;
        sectionRef.appendChild(pokemonRef);
      });
    })
    .catch(error => console.log(error.message));  
}

// Exercise 2
getDogs();

async function getDogs() {

  try {
    const response = await fetch("https://majazocom.github.io/Data/dogs.json");
    const data = await response.json();
    const sectionRef = document.querySelector("#exercise2");
  
    data.forEach(dog => {
      // console.log(dog.name);
      const dogRef = document.createElement("p");
      dogRef.textContent = dog.name;
      sectionRef.appendChild(dogRef);
    });
  } catch(error) {
    console.log(error.message);
  }
}

// Exercise 3
getBooks();

async function getBooks() {

  try {
    const response = await fetch("https://majazocom.github.io/Data/books.json");
    const data = await response.json();
    const sectionRef = document.querySelector("#exercise3");
  
    data.forEach(book => {
      if (book.pages < 500) {
        const bookRef = document.createElement("p");
        bookRef.textContent = `${book.title} - ${book.author}`;
        sectionRef.appendChild(bookRef);
      }
    });
  } catch(error) {
    console.log(error.message);
  }
}

// Exercise 4
getVisitors();

function getVisitors() {

  const sectionRef = document.querySelector("#exercise4");

  fetch("https://majazocom.github.io/Data/attendees.json")
    .then(response => response.json())
    .then(data => {

      const attendingRef = document.createElement("h3");
      attendingRef.textContent = "Attending:";
      sectionRef.appendChild(attendingRef);

      const allergicRef = document.createElement("h3");
      allergicRef.textContent = "Allergic:";
      sectionRef.appendChild(allergicRef);

      data.forEach(visitor => {
        if (visitor.attending) {
          const visitorRef = document.createElement("p");
          visitorRef.textContent = visitor.name;
          attendingRef.after(visitorRef);
        }

        if (visitor.attending && visitor.allergies.length > 0) {
          const visitorAllergicRef = document.createElement("p");
          visitorAllergicRef.textContent = visitor.name;
          allergicRef.after(visitorAllergicRef);
        }
      });
    })
    .catch(error => console.log(error.message));
}