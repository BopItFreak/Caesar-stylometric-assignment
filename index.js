const Caesar = require("./caesar.js");

//import cheerio module. Cheerio is esentially jquery for node and will help me parse the html of the Caesar text.
global.cheerio = require("cheerio");

//import node-fetch module. This is essentially the fetch() function for node.
global.fetch = require("node-fetch");

//import Caesar class.
global.Caesar = require("./caesar.js");

//instantiate new instance of "Caesar" class.
let caesar = new Caesar();

//express web server
const express = require('express')
const app = express();
const port = 3001;
app.use(require("cors")());

app.listen(port);

//Part 1 and 2: get Caesar Text and format it.
(async () => {
  let caesarText = await caesar.getCaesarText()
  let sentences = caesar.getSentencesWithWordAndCharacterCount(caesarText);
  //Part 3: Analysis of Sentence and Clause Length
  let averageSentenceLengthByWords = caesar.getAverageSentenceLengthByWords(caesarText);
  let averageSentenceLengthByCharacters = caesar.getAverageSentenceLengthByCharacters(caesarText);
  console.log(`Average Sentence Length By Words: ${averageSentenceLengthByWords}`);
  console.log(`Average Sentence Length By Characters: ${averageSentenceLengthByCharacters}`);
  //unfortunatly the text from thelatinlibrary does not have paragraphgs, so part 4 is impossible.

  //Part 5: Stop Words
  //get most common words
  let mostCommonWords = caesar.getMostCommonWords(caesar.getAllWords(caesarText));
  //print 10 most common words
  console.log("Most Common Words: ");
  for (let i = 0; i < 50; i++) {
    console.log(`${i + 1}. ${mostCommonWords[i][0]}: ${mostCommonWords[i][1]}`)
  }
  
  //print most common words without stock words
  let stockWords = ["in", "et", "ad", "ut", "cum", "ex", "atque", "quod", "se", "qui", "ab", "non", "neque", "esse", "quae", "est", "de", "a", "ac", "his", "quam", "eo", "si", "ne", "aut", "erat", "eius", "eorum", "sibi", "quo", "sed", "per", "quibus", "id", "eos", "ea", "eum", "tamen", "sunt", "ipse", "quos", "hoc", "erant", "pro", "suis", "inter", "sese", "qua", "haec", "quorum", "ante", "quid", "etiam", "esset", "nostri", "suos", "iam", "propter", "uti", "quem", "posset", "sine", "ibi", "iis", "ita", "nostris", "ubi"];
  let mostCommonWordsWithoutStockWords = caesar.getMostCommonWords(caesar.getAllWords(caesarText), stockWords);
  console.log("Most Common Words Without Stock Words:");
  for (let i = 0; i < 50; i++) {
    console.log(`${i + 1}. ${mostCommonWordsWithoutStockWords[i][0]}: ${mostCommonWordsWithoutStockWords[i][1]}`)
  }

  app.get('/data', (req, res) => {
    res.send({"sentences": sentences, "mostCommonWords": mostCommonWords, "mostCommonWordsWithoutStockWords": mostCommonWordsWithoutStockWords, "averageSentenceLengthByWords": averageSentenceLengthByWords, "averageSentenceLengthByCharacters": averageSentenceLengthByCharacters, "stockWords": stockWords});
  });
})();

  
