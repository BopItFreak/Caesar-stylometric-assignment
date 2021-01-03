//import cheerio module. Cheerio is esentially jquery for node and will help me parse the html of the Caesar text.
global.cheerio = require("cheerio");

//import node-fetch module. This is essentially the fetch() function for node.
global.fetch = require("node-fetch");

//import Caesar class.
global.Caesar = require("./caesar.js");

//instantiate new instance of "Caesar" class.
let caesar = new Caesar();
caesar.getCaesarText().then((caesarText) => {
  console.log(`Average Sentence Length By Words: ${caesar.getAverageSentenceLengthByWords(caesarText)}`);
  console.log(`Average Sentence Length By Characters: ${caesar.getAverageSentenceLengthByCharacters(caesarText)}`);
})