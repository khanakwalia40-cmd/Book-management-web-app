// app.js

// 1. Your Firebase config (replace with your own from Firebase console)
const firebaseConfig = {
  apiKey: "AIzaSyCuUZZapq3qvjeTvDECkK9QWgF2wJJ9uLs",
  authDomain: "book-management-webapp.firebaseapp.com",
  projectId: "book-management-webapp",
  storageBucket: "book-management-webapp.firebasestorage.app",
  messagingSenderId: "1026485157700",
  appId: "1:1026485157700:web:5ea91f705cb05b62be2111",
  measurementId: "G-3LQCD2SYFL",
};
console.log("App loaded - Firebase connected");

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// References
const booksContainer = document.getElementById("booksContainer");
const bookForm = document.getElementById("bookForm");

// Modal elements
const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");
const modalTitle = document.getElementById("modalTitle");
const modalImage = document.getElementById("modalImage");
const modalAuthor = document.getElementById("modalAuthor");
const modalPrice = document.getElementById("modalPrice");

// 2. Add dummy data once (run only once, then comment/remove)
  const dummy = [
    {
      title: "JavaScript Basics",
      author: "John Doe",
      price: 399,
      coverImageURL: "https://picsum.photos/300/200?1",
    },
    {
      title: "CSS Mastery",
      author: "Jane Smith",
      price: 299,
      coverImageURL: "https://picsum.photos/300/200?2",
    },
    {
      title: "HTML Handbook",
      author: "Alex Ray",
      price: 199,
      coverImageURL: "https://picsum.photos/300/200?3",
    },
    {
      title: "React in Action",
      author: "Chris Lee",
      price: 499,
      coverImageURL: "https://picsum.photos/300/200?4",
    },
    {
      title: "Node.js Guide",
      author: "Sam Kim",
      price: 450,
      coverImageURL: "https://picsum.photos/300/200?5",
    },
  ];

  for (const book of dummy) {
    await db.collection("books").add(book);
  }
  console.log("Dummy books added");
}
// Uncomment below, run once, then comment it again
// addDummyBooksOnce();

// 3. Realtime listener for books collection
db.collection("books").onSnapshot((snapshot) => {
  const books = [];
  snapshot.forEach((doc) => {
    books.push({ id: doc.id, ...doc.data() });
  });
  renderBooks(books);
});

// 4. Render cards
function renderBooks(books) {
  booksContainer.innerHTML = "";
  books.forEach((book) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${book.coverImageURL}" alt="${book.title}" />
      <h3>${book.title}</h3>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>Price:</strong> ₹${book.price}</p>
      <div class="actions">
        <button class="btn-update">Update Author</button>
        <button class="btn-delete">Delete</button>
        <button class="btn-view">View Details</button>
      </div>
    `;

    // Buttons
    const updateBtn = card.querySelector(".btn-update");
    const deleteBtn = card.querySelector(".btn-delete");
    const viewBtn = card.querySelector(".btn-view");

    // Update Author
    updateBtn.addEventListener("click", async () => {
      const newAuthor = prompt("Enter new author name:", book.author);
      if (newAuthor && newAuthor.trim() !== "") {
        await db.collection("books").doc(book.id).update({
          author: newAuthor.trim(),
        });
      }
    });

    // Delete
    deleteBtn.addEventListener("click", async () => {
      const ok = confirm("Delete this book?");
      if (ok) {
        await db.collection("books").doc(book.id).delete();
      }
    });

    // View Details
    viewBtn.addEventListener("click", () => {
      modalTitle.textContent = book.title;
      modalImage.src = book.coverImageURL;
      modalAuthor.textContent = "Author: " + book.author;
      modalPrice.textContent = "Price: ₹" + book.price;
      modal.classList.remove("hidden");
    });

    booksContainer.appendChild(card);
  });
}

// 5. Add new book from sidebar form
bookForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  const author = document.getElementById("author").value.trim();
  const price = Number(document.getElementById("price").value);
  const image = document.getElementById("image").value.trim();

  if (!title || !author || !price || !image) return;

  await db.collection("books").add({
    title,
    author,
    price,
    coverImageURL: image,
  });

  bookForm.reset();
});

// 6. Close modal
closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.add("hidden");
});
