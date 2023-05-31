// Get the necessary elements
const inputText = document.getElementById('input-text');
const wordCount = document.getElementById('word-count');
const charCount = document.getElementById('char-count');
const lineCount = document.getElementById('line-count');
const uniqueWordCount = document.getElementById('unique-word-count');
const readingTime = document.getElementById('reading-time');
const searchWordInput = document.getElementById('search-word');
const highlightButton = document.getElementById('highlight-button');
const clearButton = document.getElementById('clear-button');
const copyButton = document.getElementById('copy-button');
const keywordDensityTable = document.getElementById('keyword-density-table');
const keywordDensityBody = document.getElementById('keyword-density-body');
const top10WordsTable = document.getElementById('top-10-words-table');
const top10WordsBody = document.getElementById('top-10-words-body');

// Event listeners
inputText.addEventListener('input', updateCounts);
highlightButton.addEventListener('click', highlightWord);
clearButton.addEventListener('click', clearInputText);
copyButton.addEventListener('click', copyTextToClipboard);

// Update counts and features on input change
function updateCounts() {
  const text = inputText.value;

  // Word count
  const words = text.trim().split(/\s+/);
  const numWords = words.length;
  wordCount.textContent = numWords;

  // Character count
  const numChars = text.length;
  charCount.textContent = numChars;

  // Line count
  const numLines = text.split(/\r*\n/).length;
  lineCount.textContent = numLines;

  // Unique word count
  const uniqueWords = [...new Set(words)];
  const numUniqueWords = uniqueWords.length;
  uniqueWordCount.textContent = numUniqueWords;

  // Reading time (assuming 200 words per minute)
  const readingSpeed = 200; // words per minute
  const minutes = Math.ceil(numWords / readingSpeed);
  readingTime.textContent = minutes > 0 ? `${minutes} min` : 'Less than 1 min';

  // Calculate keyword density
  const keywordDensity = calculateKeywordDensity(words);
  displayKeywordDensity(keywordDensity);

  // Calculate top 10 frequent words
  const top10Words = calculateTop10Words(words);
  displayTop10Words(top10Words);
}

// Calculate keyword density
function calculateKeywordDensity(words) {
  const keywordMap = {};
  for (const word of words) {
    keywordMap[word] = (keywordMap[word] || 0) + 1;
  }
  return keywordMap;
}

// Display keyword density
function displayKeywordDensity(keywordMap) {
  clearKeywordDensity();

  for (const word in keywordMap) {
    const density = ((keywordMap[word] / wordCount.textContent) * 100).toFixed(2);

    const row = document.createElement('tr');
    const wordCell = document.createElement('td');
    const densityCell = document.createElement('td');

    wordCell.textContent = word;
    densityCell.textContent = density;

    row.appendChild(wordCell);
    row.appendChild(densityCell);

    keywordDensityBody.appendChild(row);
  }
}

// Calculate top 10 frequent words
function calculateTop10Words(words) {
  const wordFrequency = {};
  for (const word of words) {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  }

  const sortedWords = Object.keys(wordFrequency).sort((a, b) => wordFrequency[b] - wordFrequency[a]);
  return sortedWords.slice(0, 10).map(word => ({ word, frequency: wordFrequency[word] }));
}

// Display top 10 frequent words
function displayTop10Words(top10Words) {
  clearTop10Words();

  for (const { word, frequency } of top10Words) {
    const row = document.createElement('tr');
    const wordCell = document.createElement('td');
    const frequencyCell = document.createElement('td');

    wordCell.textContent = word;
    frequencyCell.textContent = frequency;

    row.appendChild(wordCell);
    row.appendChild(frequencyCell);

    top10WordsBody.appendChild(row);
  }
}

// Highlight occurrences of a word in the input text
function highlightWord() {
  const searchWord = searchWordInput.value.trim();
  const regex = new RegExp(searchWord, 'gi');

  const highlightedText = inputText.value.replace(regex, match => `<span class="highlight">${match}</span>`);
  inputText.innerHTML = highlightedText;
}

// Clear the input text
function clearInputText() {
  inputText.value = '';
  updateCounts();
  clearKeywordDensity();
  clearTop10Words();
}

// Copy the text in the input area to the clipboard
function copyTextToClipboard() {
  inputText.select();
  inputText.setSelectionRange(0, 99999);
  document.execCommand('copy');
}

// Clear keyword density
function clearKeywordDensity() {
  while (keywordDensityBody.firstChild) {
    keywordDensityBody.firstChild.remove();
  }
}

// Clear top 10 frequent words
function clearTop10Words() {
  while (top10WordsBody.firstChild) {
    top10WordsBody.firstChild.remove();
  }
}