# Caesar Stylometric Assignment

This assignment is an analysis of Caesar's *De Bello Gallico*. There are 7 parts to this assignment.

## Part 1: Build corpus and normalise the text
- The text is fetched from thelatinlibrary.com, and is fetched via node-fetch.

## Part 2: Normalise the text
- Text is formatted using regex to remove newlines, text between the square brackets at the beginning of each chapter.
- Text is converted to lower case.

## Part 3: Determine the average length of sentence in characters and words.
- Text is parsed into sentences using an external library, as abbreviations such as vii. and kal. made it impossible to split sentences by looking for periods.
- The total word count or the number of characters is then divided by the total number of sentences to get the average characters or words in a sentence.

## Part 4: Comparative length of a sentences in a paragraph.
- I haven't quite figured this part out yet

## Part 5: Stop Words
-  The text is split into words, and the words are then sorted by frequency of their occurance.
- A list of "stop words" like prepositions and common forms of sum was compiled.
- The most common words excluding the "stop words" are then displayed


## Results and more to come!