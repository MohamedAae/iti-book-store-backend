const fs = require('fs'),
    path = require("path");

const filePath = (fileName) => {
    return path.join(__dirname, fileName);
}

const createFile = (fileName) => {
    if (!fs.existsSync(fileName)) {
        fs.writeFileSync( filePath(fileName), "[]" );
    }
}

const add = (fileName, book) => {
    const booksArray = readFile( filePath(fileName) );
    booksArray.push(book);

    writeToFile(filePath(fileName), booksArray);
    console.log(`Added book to books.json`);
}

const readFile = (PATH) => {
    const content = fs.readFileSync(PATH, 'UTF-8');
    return JSON.parse(content);
}

const writeToFile = (PATH, content) => {
    const books = JSON.stringify(content, null, 4);
    fs.writeFileSync(PATH, books);
}

module.exports = {
    createFile, add
}