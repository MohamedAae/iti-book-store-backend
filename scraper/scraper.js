const axios     = require('axios'),
    cheerio     = require('cheerio'),
    DomParser   = require('dom-parser'),
    parser      = new DomParser(),
    handleJSON  = require('./handle-json-file'),
    homePageUrl =  "https://www.barnesandnoble.com",
     pages      = require("./booksUrl.json"),
     booksJson= require("./books.json");

let currentDom;

const loopThroughPages = async (pages) => {
    handleJSON.createFile("books.json");

    pages.map( async (page) => {
        try {
            const book = await getPage(page);
            if(book){
                handleJSON.add("books.json", book);
            }
        } catch (err) {
            console.error(err.message);
        }
    });
}

const getAllBooks=async ()=>{
    try {
    handleJSON.createFile("booksUrl.json");
    const homePage=await axios.get(homePageUrl);
   currentDom     = parseHTML(homePage.data),
    tagNames       = currentDom.getElementsByTagName("a");
    tagNames.map((tagName)=>{
    if(tagName.getAttribute("title")=== "view details"){
        const bookUrl= homePageUrl+ tagName.getAttribute("href");
            handleJSON.add("booksUrl.json",bookUrl)
        };
    })
}catch (err){
console.log(err);
}
}




const getPage = async (pageUrl) => {
    try {
        const page      = await axios.get(pageUrl);

        currentDom  = parseHTML(page.data);
        const name      = getElementText('pdp-header-title'),
            description = getElementText('overview-cntnt'),
            rating      = generateRating(),
            price       = getElementText('old-price')
                ? getElementText('old-price')
                : getElementText('price'),
            image       = mapElementAttributes(
                getElmentAttributes('pdpMainImage'),
                "src"
            )[0].value;

        console.log(image);
        return { name, description, rating, price, image };
    } catch(err) {
        console.error(err);
    }
}

const parseHTML = (htmlString) => {
    return parser.parseFromString(htmlString);
}

const getElementText = (selector) => {
    return currentDom.getElementsByClassName(selector)[0].textContent;
}

const getElmentAttributes = (selectorId) => {
    return currentDom.getElementById(selectorId).attributes;
}

const mapElementAttributes = (attributes, target) => {
    return attributes.filter(attribue => attribue.name == target);
}

const generateRating = () => {
    return Math.floor(Math.random() * 5) + 1;
}

const postToApi=(books)=>{
books.map(async(book)=>{
try{
const req=await axios.post("http://127.0.0.1:5003/products",book)
return console.log(req.data);
}catch(err){
console.log(err.data);
}
})
}
postToApi(booksJson)
// loopThroughPages(pages);
