//import sbd module
const tokenizer = require('sbd');
class Caesar {
  constructor() {
    this.caesarUrl = "https://www.thelatinlibrary.com/caesar/gallic/"
  }
  /**
   * Removes newlines and stuff between square brackets from a string
   * @param {string} text
   */
  cleanText(text) {
    return text.replace(/\r?\n|\r/g, "").replace(/ *\[[^\]]*]/g, '');
  }
  /**
   * Removes punctuation in a string.
   * @param {string} text
   */
  removePunctuation(text) {
    return text.replace(/[.,\/#!$%\^&\*;:"{}=\-_`~()]/g,"");
  }
  /**
   * Gets de bello gallico text.
   * from https://www.thelatinlibrary.com/caesar/
   */
  async getCaesarText() {
    let caesarText = [];
    //fetch each html file by interating over them in a loop.
    for (let i = 1; i <= 8; i++) {
      // make indexes start at 0.
      caesarText[i - 1] = await this.getCaesarBook(i);
    }
    return caesarText;
  }
  
  /**
   * Gets a certain html file and returns the text.
   * based on the parameter.
   * from https://www.thelatinlibrary.com/caesar/
   * @param {string} i
   */
  async getCaesarBook(i) {
    //the fetch funtion sends a GET http request to fetch the text.
    //I've set it to return an object, which contains the full text, an object containing the text and chapter number for each chapter, and the book number.
    let caesarBook = await fetch(`${this.caesarUrl}gall${i}.shtml`).then(async (response) => {
      let text = await response.text();
      //initiate book object
      let book = {
        text: "",
        chapters: {},
        bookNumber: i
      };
      //load text in cheerio. 
      let $ = cheerio.load(text);
      //remove empty p elements.
      $( 'p:empty' ).remove();      
      //separate each chapter of the text.
      //for some reason the first book doesn't have .page_wrapper, so I have to use ternary expressions to change the selector for books 2-8.
      for (let j = (i !== 8 ? 3 : 4); j <= ( i == 1 ? $(".page_wrapper p").length : $("body p").length); j++) {       
        //delete the square brackets and any numbers inside them at the beginning of each chapter and remove linebreaks, and trim spaces.
        let chapterText = this.cleanText($(`${i == 1 ? ".page_wrapper" : "body"} p:nth-child(${j})`).text());    
        //fill objects with data.
        book.text = book.text.concat(chapterText);
        //convert all text to lowercase letters.
        book.text = book.text.toLowerCase();
        book.chapters[j - 3] = {
          chapterText: chapterText,
          chapterNumber: j - 3 
        }
      }
      return book;      
    })
    return caesarBook;
  }
  /**
   * Gets the entire text object.
   * @param {string} caesarText
   */
  getFullText(caesarText) {
    let fullText = "";
    //put the entire text into one string.
    for (let book of caesarText) {
      fullText = fullText.concat(" " + book.text);
    }
    return fullText;
  }
  /**
   * Splits the entire text into sentences.
   * @param {string} caesarText
   */
  getSentences(caesarText) {
    //get full text
    let fullText = this.getFullText(caesarText);
    //using an external module for parsing sentences, as some sentences are tricky with names, like "C. Caesare"
    let sentences = tokenizer.sentences(fullText, {
      //tell the tokenizer to note these various latin abbreviations.
      "abbreviations": ["Cn","cn", "C", "kal", "apr", "id", "ii", "iii", "iv", "v", "vi", "vii", "viii", "viiii", "x", "xi", "xii", "xiii", "xiiii", "XV", "ser", "ap"]
    });
    return sentences;
  }
  /**
   * Splits the entire text into sentences, and outputs word and character count.
   * @param {string} caesarText
   */
  getSentencesWithWordAndCharacterCount(caesarText) {
    //get sentences
    let sentences = this.getSentences(caesarText);
    //add data
    return sentences.map((sentence) => ({"sentence": sentence, "wordCount": this.getWords(sentence).length, "charCount": sentence.length}));
  }
  /**
   * Gets the average sentence length by the number of words.
   * @param {string} caesarText
   */
  getAverageSentenceLengthByWords(caesarText) {
    //get the sentences of the entire text.
    let sentences = this.getSentences(caesarText);
    //get the total word count
    let totalWordCount = 0;
    for (let sentence of sentences) {
      //split the word by each space, and count up how many words.
      let wordCount = sentence.split(" ").length;
      //equivilant to totalWordCount = totalWordCount + wordCount;
      totalWordCount += wordCount;
    }
    //return the totalWordCount divided by the total number of sentences.
    return totalWordCount / sentences.length;
  }
  /**
   * Gets the average sentence length by the number of characters, not including spaces.
   * @param {string} caesarText
   */
  getAverageSentenceLengthByCharacters(caesarText) {
    //get the sentences of the entire text.
    let sentences = this.getSentences(caesarText);
    //get the total character count
    let totalCharCount = 0;
    for (let sentence of sentences) {
      //split the word by each character.
      let words = sentence.split("");
      //filter out spaces.
      words = words.filter((char) => (char !== " " && char !== ""));
      //equivilant to totalCharCount = totalCharCount + words.length;
      totalCharCount += words.length;
    }
    //return the totalCharCount divided by the total number of characters.
    return totalCharCount / sentences.length;
  }
  /**
   * Gets an array of every word in the text.
   * @param {string} caesarText
   */
  getAllWords(caesarText) {
    //get full text
    let fullText = this.getFullText(caesarText);
    //remove punctuation
    fullText = this.removePunctuation(fullText);
    //get words and filter out spaces and quotations
    let words = fullText.split(" ").filter(char => (char !== " " && char !== ""));
    return words;
  }
  /**
   * Gets an array of every word in a string.
   * @param {string} str
   */
  getWords(str) {
    //remove punctuation
    str = this.removePunctuation(str);
    //get words and filter out spaces and quotations
    let words = str.split(" ").filter(char => (char !== " " && char !== ""));
    return words;
  }
  /**
   * Gets most common words.
   * @param {array} words
   */
  getMostCommonWords(words, stockWords = []) {
    //filter out stock words
    words = words.filter((word) => !stockWords.includes(word));

    //https://stackoverflow.com/a/35101824/10972030 -> get fequencies of each word
    let wordFrequencies = new Map([...new Set(words)].map(
      x => [x, words.filter(y => y === x).length]
    ));
    //get the entries iterator, and use spread syntax to convert to array. Sort by frequency.
    let wordFrequenciesSorted = [...wordFrequencies.entries()].sort((ab, bc) => bc[1] - ab[1] || bc[0] - ab[0]);
    return wordFrequenciesSorted; 
  }

}
module.exports = Caesar;