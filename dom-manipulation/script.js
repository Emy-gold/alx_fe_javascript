const quoteDisplay = document.getElementById("quoteDisplay");
const newQuote = document.getElementById("newQuote");
const quoteInput = document.getElementById("newQuoteText");
const categoryInput = document.getElementById("newQuoteCategory");
const addQuoteBtn = document.getElementById("addQuoteBtn");

const quotes = [
    { text: "Believe in yourself!", category: "Motivation" },
    { text: "Why dont scientists trust atoms? Because they make up everything!", category: "Humor" },
    { text: "Every day is a second chance.", category: "Inspiration" },
];

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

newQuote.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);