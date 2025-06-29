const quoteDisplay = document.getElementById("quoteDisplay");
const newQuote = document.getElementById("newQuote");

// Declare variables (they will be assigned in the form)
let quoteInput, categoryInput, addQuoteBtn;

// Load quotes from localStorage or use default
let quotes = [];
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

// Save quotes to localStorage
function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Create the form dynamically
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

    // Assign to global variables
    quoteInput = quoteTextInput;
    categoryInput = categoryTextInput;
    addQuoteBtn = addQuoteButton;

    // Add event listener to the button
    addQuoteBtn.addEventListener("click", addQuote);
}

// Show random quote
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.innerHTML = `<p>${quote.text}</p><small>(${quote.category})</small>`;

    // Save the last quote shown (example use of sessionStorage)
    sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

// Add quote
function addQuote() {
    const text = quoteInput.value.trim();
    const category = categoryInput.value.trim();

    if (text && category) {
        quotes.push({ text, category });
        localStorage.setItem("quotes", JSON.stringify(quotes));
        populateCategories(); // Refresh dropdown
        quoteInput.value = "";
        categoryInput.value = "";
        alert("Quote added!");
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

    // Use map to extract all categories, then use Set to make them unique
    const categories = [...new Set(quotes.map(q => q.category))];

    // Clear and reset dropdown
    filterDropdown.innerHTML = `<option value="all">All Categories</option>`;

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        filterDropdown.appendChild(option);
    });

    // Restore previously selected category from localStorage
    const savedFilter = localStorage.getItem("selectedCategory");
    if (savedFilter) {
        filterDropdown.value = savedFilter;
        filterQuotes();
    }
}


const savedFilter = localStorage.getItem("selectedCategory");
if (savedFilter) {
    filterDropdown.value = savedFilter;
    filterQuotes();
}

// Export quotes to JSON file
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

// Import quotes from a JSON file
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


// Run on page load
loadQuotes();
createAddQuoteForm();
populateCategories();
newQuote.addEventListener("click", showRandomQuote);
document.getElementById("exportBtn").addEventListener("click", exportQoutesToJson);
document.getElementById("importFile").addEventListener("change", importFromJsonFile);
