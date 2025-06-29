const quoteDisplay = document.getElementById("quoteDisplay");
const newQuote = document.getElementById("newQuote");
let quoteInput, categoryInput, addQuoteBtn;

// Quotes Array
let quotes = [];

// Load Quotes from localStorage or use defaults
function loadQuotes() {
    const savedQuotes = localStorage.getItem("quotes");
    if (savedQuotes) {
        quotes = JSON.parse(savedQuotes);
    } else {
        quotes = [
            { text: "Believe in yourself!", category: "Motivation" },
            { text: "Why don't scientists trust atoms? Because they make up everything!", category: "Humor" },
            { text: "Every day is a second chance.", category: "Inspiration" },
        ];
    }
}

function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

function createAddQuoteForm() {
    const quoteTextInput = document.createElement("input");
    quoteTextInput.id = "newQuoteText";
    quoteTextInput.type = "text";
    quoteTextInput.placeholder = "Enter a new quote";

    const categoryTextInput = document.createElement("input");
    categoryTextInput.id = "newQuoteCategory";
    categoryTextInput.type = "text";
    categoryTextInput.placeholder = "Enter quote category";

    const addQuoteButton = document.createElement("button");
    addQuoteButton.id = "addQuoteBtn";
    addQuoteButton.textContent = "Add Quote";

    const formDiv = document.createElement("div");
    formDiv.appendChild(quoteTextInput);
    formDiv.appendChild(categoryTextInput);
    formDiv.appendChild(addQuoteButton);
    document.body.appendChild(formDiv);

    quoteInput = quoteTextInput;
    categoryInput = categoryTextInput;
    addQuoteBtn = addQuoteButton;

    addQuoteBtn.addEventListener("click", addQuote);
}

function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.innerHTML = `<p>${quote.text}</p><small>(${quote.category})</small>`;
    sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

async function addQuote() {
    const text = quoteInput.value.trim();
    const category = categoryInput.value.trim();

    if (text && category) {
        quotes.push({ text, category });
        saveQuotes();
        populateCategories();
        quoteInput.value = "";
        categoryInput.value = "";
        alert("Quote added!");

        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ title: text, body: category })
            });
            const data = await response.json();
            console.log("Quote sent to server:", data);
        } catch (error) {
            console.error("Failed to sync with server:", error);
        }

    } else {
        alert("Please enter both quote text and category.");
    }
}

function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    localStorage.setItem("selectedCategory", selectedCategory);
    const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(q => q.category === selectedCategory);
    if (filteredQuotes.length > 0) {
        const quote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
        quoteDisplay.innerHTML = `<p>${quote.text}</p><small>(${quote.category})</small>`;
    } else {
        quoteDisplay.innerHTML = "<p>No quotes available for this category.</p>";
    }
}

function populateCategories() {
    const filterDropdown = document.getElementById("categoryFilter");
    const categories = [...new Set(quotes.map(q => q.category))];

    filterDropdown.innerHTML = `<option value="all">All Categories</option>`;
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        filterDropdown.appendChild(option);
    });

    const savedFilter = localStorage.getItem("selectedCategory");
    if (savedFilter) {
        filterDropdown.value = savedFilter;
        filterQuotes();
    }
}

function exportQoutesToJson() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "quotes.json";
    downloadLink.click();

    URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes.push(...importedQuotes);
                saveQuotes();
                populateCategories();
                alert("Quotes imported successfully!");
            } else {
                alert("Invalid JSON format. Must be an array.");
            }
        } catch (error) {
            alert("Error reading file: " + error.message);
        }
    };
    reader.readAsText(file);
}

async function fetchQuotesFromServer() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
        const data = await response.json();
        const serverQuotes = data.map(post => ({ text: post.title, category: "Server" }));
        const newQuotes = serverQuotes.filter(serverQuote => !quotes.some(localQuote => localQuote.text === serverQuote.text));
        if (newQuotes.length > 0) {
            quotes.push(...newQuotes);
            saveQuotes();
            populateCategories();
            alert("New quotes fetched from server!");
        }
    } catch (error) {
        console.error("Error fetching quotes from server:", error);
    }
}

function resolveConflicts(serverQuotes) {
    quotes = [...serverQuotes];
    saveQuotes();
    alert('Quotes synced from server.');
}

function showSyncMessage() {
    const msg = document.createElement('div');
    msg.textContent = 'Quotes synced with server!';
    document.body.prepend(msg);
    setTimeout(() => msg.remove(), 3000);
}

async function syncQuotes() {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
        const data = await response.json();
        const serverQuotes = data.map(post => ({ text: post.title, category: "Server" }));
        resolveConflicts(serverQuotes);
        showSyncMessage();
    } catch (error) {
        console.error("Sync error:", error);
    }
}

document.getElementById("manualSync").addEventListener("click", syncQuotes);

// Initialization
loadQuotes();
createAddQuoteForm();
populateCategories();
fetchQuotesFromServer();
setInterval(fetchQuotesFromServer, 30000);

// Event Listeners
newQuote.addEventListener("click", showRandomQuote);
document.getElementById("exportBtn").addEventListener("click", exportQoutesToJson);
document.getElementById("importFile").addEventListener("change", importFromJsonFile);