const booklist = document.querySelector("#book-container");
const searchBtn = document.getElementById("search-btn");

let books = [];
let currentPage = 1;
let bookspage = 10;

// fetch all the books data
const fetchData = async () => {
  const data = await fetch(
    `https://api.freeapi.app/api/v1/public/books?page=${currentPage}&limit=${bookspage}&inc=kind%252Cid%252Cetag%252CvolumeInfo&query=tech`
  );
  const Json = await data.json(); // convert all the data to json format

  console.log(Json);

  let book = Json.data.data;

  books = [...books, ...book];

  bookList(books);
};

// book details including title, author, publisher, published date, and thumbnail
function bookList(books) {
  booklist.innerHTML = "";

  books.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.className = "book-card";
    bookCard.onclick = () => window.open(book?.volumeInfo?.infoLink); //Clicking on a book item, should open more details in a new tab (using infoLink)
    bookCard.innerHTML = `
        <img src="${book?.volumeInfo?.imageLinks?.thumbnail}" alt="${
      book.title
    }">
      <div>
      <h3>${book?.volumeInfo?.title}</h3>
      <p><strong>Author:</strong> ${
        book?.volumeInfo?.authors
          ? book.volumeInfo.authors.join(", ")
          : "Unknown Author"
      }</p>
      <p><strong>Publisher:</strong> ${book?.volumeInfo?.publisher}</p>
      <p><strong>Published:</strong> ${book?.volumeInfo?.publishedDate}</p>
      </div>
       `;
    booklist.appendChild(bookCard);
  });
}

// search bar to filter books by title or author
searchBtn.addEventListener("click", () => {
  const query = document.getElementById("search-in");

  console.log(query.value);

  const filtered = books.filter(
    (book) =>
      book?.volumeInfo?.title
        ?.toLowerCase()
        .includes(query.value.toLowerCase()) ||
      book?.volumeInfo?.authors[0]
        .toLowerCase()
        .includes(query.value.toLowerCase())
  );

  console.log(filtered);
  bookList(filtered);
});

// Implement a sort feature to list books in Alphabetical order based on their title, date of release (publishedDate)
const sortBy = document.querySelector(".sort");

sortBy.addEventListener("change", () => {
  books.sort((a, b) => {
    if (sortBy.value === "title") {
      return a.volumeInfo?.title.localeCompare(b.volumeInfo?.title);
    } else if (sortBy.value === "date") {
      return (
        new Date(b.volumeInfo?.publishedDate) -
        new Date(a.volumeInfo?.publishedDate)
      );
    }
  });

  bookList(books);
});

// Provide an option to user to switch between the viewing type of list v/s grid
const toggleChange = document.querySelector(".toggle");

toggleChange.addEventListener("change", () => {
  if (toggleChange.value === "Grid") {
    booklist.classList.remove("list-view");
  } else if (toggleChange.value === "List") {
    booklist.classList.add("list-view");
    //bookList.classList.remove('grid-view')
  }
});

// Implement pagination on reaching the end of the page to call next set of details
const page = document.getElementById("next");
next.addEventListener("click", () => {
  currentPage++;
  fetchData();
});

fetchData();
