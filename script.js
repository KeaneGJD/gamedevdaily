// Get the target word for the day (ensure the word length is between 4 to 8 characters)
const targetWord = "unity"; // Example, this can be replaced with a dynamic word generator for each day.
let currentRow = 0;
let currentCol = 0;
const usedLetters = new Set();
let currentGuess = [];
let wordLength = targetWord.length; // Dynamically set word length

// Limit the grid to a max of 8 columns and a minimum of 4 columns
const maxColumns = 8;
const minColumns = 4;

const cells = document.querySelectorAll('.cell');
const submitButton = document.getElementById("submitGuess");
const removeLetterButton = document.getElementById("removeLetter");
const statusText = document.getElementById("status");

// Function to adjust grid size based on word length
function adjustGridSize() {
  // Set the correct number of columns (between 4 and 8)
  const validColumns = Math.max(minColumns, Math.min(wordLength, maxColumns));

  // Update grid layout
  const gridContainer = document.querySelector('.grid-container');
  gridContainer.style.gridTemplateColumns = `repeat(${validColumns}, 1fr)`;

  // Adjust the number of cells accordingly
  const totalCells = 5 * validColumns; // 5 rows maximum
  for (let i = 0; i < totalCells; i++) {
    const cell = cells[i];
    if (i < validColumns * 5) {
      cell.disabled = false; // Enable only the cells that are part of the grid
    } else {
      cell.disabled = true; // Disable any extra cells
    }
  }
}

// Handle the selection of letters for the current guess
function handleLetterSelection(letter) {
  if (currentCol < wordLength && currentRow < 5 && !isRowSubmitted(currentRow)) { // Limit the number of columns based on word length
    const currentCell = cells[currentRow * wordLength + currentCol];
    currentCell.value = letter;
    currentGuess[currentCol] = letter;
    currentCol++;
  }
}

// Check if the row has been submitted
function isRowSubmitted(row) {
  return currentRow > row; // If the current row is greater than the submitted row, the row has been submitted
}

// Handle the guess submission
function handleGuess() {
  if (currentGuess.length === wordLength) {
    const rowStartIndex = currentRow * wordLength;
    let allLettersUsed = true;

    for (let i = 0; i < wordLength; i++) {
      const cell = cells[rowStartIndex + i];
      const letter = currentGuess[i];

      // Provide feedback for each letter
      if (letter === targetWord[i]) {
        cell.classList.add('correct'); // Correct letter, correct position (green)
      } else if (targetWord.includes(letter)) {
        cell.classList.add('wrong-position'); // Correct letter, wrong position (amber)
      } else {
        cell.classList.add('incorrect'); // Incorrect letter (gray)
      }

      // Mark letter as used if it's not part of the word
      if (!targetWord.includes(letter)) {
        usedLetters.add(letter);
      }
    }

    // Disable the ability to remove letters after the word is submitted
    if (currentGuess.join('') === targetWord) {
      statusText.textContent = "CONGRATULATIONS! YOU'VE GUESSED TODAY'S GAME DEV WORD!\nCHECK BACK TOMORROW FOR ANOTHER CHALLENGE AND GOOD LUCK WITH YOUR JOB SEARCH!";
      statusText.style.fontSize = '24px'; // Slightly smaller text for victory message
      statusText.style.color = 'green'; // Green color
      statusText.style.textAlign = 'center'; // Center the victory message
      statusText.style.textTransform = 'uppercase'; // Make it all caps
      statusText.style.whiteSpace = 'pre-wrap'; // Allow new line
    } else if (currentRow === 4) {
      statusText.textContent = `Game over! The word was: ${targetWord}`;
    } else {
      // Move to the next row
      currentRow++;
      currentCol = 0;
      currentGuess = [];
      updateLetterButtons(); // Update the letter buttons to disable used ones
    }
  }
}

// Handle the removal of the last entered letter
function handleRemoveLetter() {
  if (currentCol > 0 && currentRow < 5 && !isRowSubmitted(currentRow)) { // Only allow removal if there is a letter to remove
    currentCol--;
    const currentCell = cells[currentRow * wordLength + currentCol];
    currentCell.value = '';
    currentGuess[currentCol] = '';
  }
}

// Update letter buttons to disable used letters
function updateLetterButtons() {
  const letterButtons = document.querySelectorAll('.letter');
  letterButtons.forEach(button => {
    const letter = button.getAttribute('data-letter');
    if (usedLetters.has(letter)) {
      button.classList.add('disabled');
    } else {
      button.classList.remove('disabled');
    }
  });
}

// Event listeners
submitButton.addEventListener("click", handleGuess);
removeLetterButton.addEventListener("click", handleRemoveLetter);

const letterButtons = document.querySelectorAll('.letter');
letterButtons.forEach(button => {
  button.addEventListener('click', () => handleLetterSelection(button.getAttribute('data-letter')));
});

// Allow users to type letters from the keyboard
document.addEventListener('keydown', (e) => {
  if (e.key.length === 1 && /^[a-zA-Z]$/.test(e.key)) { // Ensure it's a letter key
    const letter = e.key.toLowerCase();
    if (!usedLetters.has(letter) && currentCol < wordLength && !isRowSubmitted(currentRow)) {
      handleLetterSelection(letter);
    }
  }

  if (e.key === "Backspace") {
    handleRemoveLetter();
  }

  if (e.key === "Enter") {
    handleGuess();
  }
});

// Adjust the grid based on word length when the page loads
adjustGridSize();
