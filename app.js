// 1. Firebase config (YOUR config)
const firebaseConfig = {
  apiKey: "AIzaSyCuUZZapq3qvjeTvDECkK9QWgF2wJJ9uLs",
  authDomain: "book-management-webapp.firebaseapp.com",
  projectId: "book-management-webapp",
  storageBucket: "book-management-webapp.firebasestorage.app",
  messagingSenderId: "1026485157700",
  appId: "1:1026485157700:web:5ea91f705cb05b62be2111",
  measurementId: "G-3LQCD2SYFL",
};

// 2. Initialize Firebase + Firestore
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

console.log("App loaded - Firebase connected");

// 3. Get DOM elements
const addBookForm = document.getElementById("add-book-form");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");
const priceInput = document.getElementById("price");
const imageInput = document.getElementById("image");
const booksGrid = document.getElementById("books-grid");

// Modal elements (if you have View Details)
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const modalAuthor = document.getElementById("modal-author");
const modalPrice = document.getElementById("modal-price");
const modalImage = document.getElementById("modal-image");
const closeModal = document.getElementById("close-modal");

// 4. Render one book card
function renderBookCard(book) {
  const card = document.createElement("div");
  card.className = "book-card";

  card.innerHTML = `
    <img src="${book.coverImageURL}" alt="${book.title}" class="book-image" />
    <h3 class="book-title">${book.title}</h3>
    <p class="book-author">Author: ${book.author}</p>
    <p class="book-price">Price: ₹${book.price}</p>
    <div class="book-actions">
      <button class="btn-update">Update Author</button>
      <button class="btn-delete">Delete</button>
      <button class="btn-view">View Details</button>
    </div>
  `;

  const updateBtn = card.querySelector(".btn-update");
  const deleteBtn = card.querySelector(".btn-delete");
  const viewBtn = card.querySelector(".btn-view");

  // Update author
  updateBtn.addEventListener("click", async () => {
    const newAuthor = prompt("Enter new author name:", book.author);
    if (!newAuthor) return;

    try {
      await db.collection("books").doc(book.id).update({ author: newAuthor });
      alert("Author updated successfully");
    } catch (err) {
      console.error("Error updating author:", err);
      alert("Failed to update author");
    }
  });

  // Delete book
  deleteBtn.addEventListener("click", async () => {
    const ok = confirm(`Delete "${book.title}"?`);
    if (!ok) return;

    try {
      await db.collection("books").doc(book.id).delete();
      alert("Book deleted");
    } catch (err) {
      console.error("Error deleting book:", err);
      alert("Failed to delete book");
    }
  });

  // View details (modal)
  viewBtn.addEventListener("click", () => {
    if (!modal) return;
    modalTitle.textContent = book.title;
    modalAuthor.textContent = `Author: ${book.author}`;
    modalPrice.textContent = `Price: ₹${book.price}`;
    modalImage.src = book.coverImageURL;
    modal.classList.remove("hidden");
  });

  booksGrid.appendChild(card);
}

// 5. Realtime listener for books collection
db.collection("books").onSnapshot(
  (snapshot) => {
    booksGrid.innerHTML = "";
    snapshot.forEach((doc) => {
      const data = doc.data();
      const book = {
        id: doc.id,
        title: data.title,
        author: data.author,
        price: data.price,
        coverImageURL: data.coverImageURL,
      };
      renderBookCard(book);
    });
  },
  (error) => {
    console.error("Error in onSnapshot:", error);
  }
);

// 6. Add new book from form
addBookForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const price = Number(priceInput.value);
  const coverImageURL = imageInput.value.trim();

  if (!title || !author || !price || !coverImageURL) {
    alert("Please fill all fields");
    return;
  }

  try {
    await db.collection("books").add({
      title,
      author,
      price,
      coverImageURL,
    });
    addBookForm.reset();
  } catch (err) {
    console.error("Error adding book:", err);
    alert("Failed to add book");
  }
});

// 7. Modal close logic
if (closeModal && modal) {
  closeModal.addEventListener("click", () => {
    modal.classList.add("hidden");
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.add("hidden");
  });
}
