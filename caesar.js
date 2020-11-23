class Caesar {
  constructor() {
    this.caesarUrl = "https://www.thelatinlibrary.com/caesar/gallic/"
  }

  /**
   * Gets de bello gallico text.
   * from https://www.thelatinlibrary.com/caesar/
   */
  async getCaesarText() {
    let caesarText = {};
    //fetch each html file by interating over them in a loop.
    for (let i = 1; i <= 8; i++) {    
      caesarText[i] = await this.getCaesarBook(i);
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
      //separate each chapter of the text.
      //for some reason the first book doesn't have .page_wrapper, so I have to use ternary expressions to change the selector for books 2-8.
      for (let j = 3; j <= ( i == 1 ? $(".page_wrapper p").length : $("body p").length); j++) {
        //fill objects with data.
        let chapterText = $(`${i == 1 ? ".page_wrapper" : "body"} p:nth-child(${j})`).text();
        //delete the square brackets and any numbers inside them at the beginning of each chapter and remove linebreaks.
        book.text = book.text.concat(chapterText.replace(/\r?\n|\r/g, "").replace(/\[.*\]/, ""))
        //convert all text to lowercase letters.
        book.text = book.text.toLowerCase();
        book.chapters[j] = {
          chapterText: chapterText,
          chapterNumber: j
        }
      }
      return book;      
    })
    return caesarBook;
  }
}
module.exports = Caesar;