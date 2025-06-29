const quoteDisplay = document.getElementById("quoteDisplay");
const newQuote = document.getElementById("newQuote");
const savedQuotes = localStorage.getItem("quotes");

// Declare variables for the inputs and button, but don't assign them initially
let quoteInput, categoryInput, addQuoteBtn;

loadQuotes();

function createAddQuoteForm() {
    // Dynamically create the input fields and button
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

    // Create a div to contain the form elements
    const formDiv = document.createElement("div");
    formDiv.appendChild(quoteTextInput);
    formDiv.appendChild(categoryTextInput);
    formDiv.appendChild(addQuoteButton);

    // Append the form to the body
    document.body.appendChild(formDiv);

    // Now assign the elements to the global variables
    quoteInput = quoteTextInput;
    categoryInput = categoryTextInput;
    addQuoteBtn = addQuoteButton;

    // Add event listener to the "Add Quote" button
    addQuoteBtn.addEventListener("click", addQuote);
}

let quotes = [
    { text: "Believe in yourself!", category: "Motivation" },
    { text: "Why dont scientists trust atoms? Because they make up everything!", category: "Humor" },
    { text: "Every day is a second chance.", category: "Inspiration" },
];



function loadQuotes() {
    if (savedQuotes) {
        quotes = JSON.parse(savedQuotes);
    } else {
        let quotes = [
            { text: "Believe in yourself!", category: "Motivation" },
            { text: "Why dont scientists trust atoms? Because they make up everything!", category: "Humor" },
            { text: "Every day is a second chance.", category: "Inspiration" },
        ];
    }
}

function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.innerHTML = `<p>${quote.text}</p><small>(${quote.category})</small>`;
}

function addQuote() {
    const text = quoteInput.value.trim();
    const category = categoryInput.value.trim();

    if (text && category) {
        quotes.push({ text, category });
        quoteInput.value = "";
        categoryInput.value = "";
        alert("Quote added!");
    } else {
        alert("Please enter both quote text and category.");
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
// Event listener for showing random quotes
document.getElementById("exportBtn").addEventListener("click", exportQoutesToJson);
newQuote.addEventListener("click", showRandomQuote);

// Create the form dynamically when the page loads
createAddQuoteForm();
