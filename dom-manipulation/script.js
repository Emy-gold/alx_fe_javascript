const quoteDisplay = document.getElementById("quoteDisplay");
const newQuote = document.getElementById("newQuote");
const quoteInput = document.getElementById("newQuoteText");
const categoryInput = document.getElementById("newQuoteCategory");
const addQuoteBtn = document.getElementById("addQuoteBtn");

const quotes = [
    { text: "Believe in yourself!", category: "Motivation" },
    { text: "Why don't scientists trust atoms? Because they make up everything!", category: "Humor" },
    { text: "Every day is a second chance.", category: "Inspiration" },
];

// Function to create and display the "Add Quote" form
function createAddQuoteForm() {
    // Creating the input elements for the quote text and category
    const quoteTextInput = document.createElement('input');
    quoteTextInput.id = 'newQuoteText';
    quoteTextInput.type = 'text';
    quoteTextInput.placeholder = 'Enter a new quote';

    const categoryTextInput = document.createElement('input');
    categoryTextInput.id = 'newQuoteCategory';
    categoryTextInput.type = 'text';
    categoryTextInput.placeholder = 'Enter quote category';

    const addQuoteButton = document.createElement('button');
    addQuoteButton.id = 'addQuoteBtn';
    addQuoteButton.textContent = 'Add Quote';

    // Appending the inputs and button to the DOM (inside a div)
    const formDiv = document.createElement('div');
    formDiv.appendChild(quoteTextInput);
    formDiv.appendChild(categoryTextInput);
    formDiv.appendChild(addQuoteButton);

    // Insert the form into the DOM (inside the body or a specific container)
    document.body.appendChild(formDiv);

    // Update the references for quote inputs and button
    quoteInput = quoteTextInput;
    categoryInput = categoryTextInput;
    addQuoteBtn = addQuoteButton;

    // Add event listener to the Add Quote button
    addQuoteBtn.addEventListener("click", addQuote);
}

// Function to show random quote
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    quoteDisplay.innerHTML = `<p>${quote.text}</p><small>(${quote.category})</small>`;
}

// Function to add a new quote to the array
function addQuote() {
    const text = quoteInput.value.trim();
    const category = categoryInput.value.trim();

    if (text && category) {
        quotes.push({ text, category });
        quoteInput.value = "";  // Clear input fields after adding the quote
        categoryInput.value = "";
        alert("Quote added!");
    } else {
        alert("Please enter both quote text and category.");
    }
}

// Event listener for the Show New Quote button
newQuote.addEventListener("click", showRandomQuote);

// Call the function to create the Add Quote form when the page loads
createAddQuoteForm();
