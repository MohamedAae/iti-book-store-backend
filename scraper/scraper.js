const axios     = require('axios'),
    cheerio     = require('cheerio'),
    DomParser   = require('dom-parser'),
    parser      = new DomParser(),
    handleJSON  = require('./handle-json-file'),
    homePageUrl =  "https://www.barnesandnoble.com",
    categoryUrl =["https://www.barnesandnoble.com/b/booktok/_/N-2vdn","https://www.barnesandnoble.com/b/the-best-books-of-2022-so-far/_/N-2vj7","https://www.barnesandnoble.com/b/audiobooks/_/N-2sgz","https://www.barnesandnoble.com/b/ebooks-nook/_/N-8qa"] ,
     pages      = require("./booksUrl.json") || [],
     booksJson  = require("./books.json") || [];

let currentDom;

const loopThroughPages = async (pages) => {
    handleJSON.createFile("books.json");

    pages.map( async (page) => {
        try {
            // console.log(page.categoryName)
            const postCategoryName = await postCategoryToApi(page.categoryName),
            categoryId = postCategoryName.category._id,
            booksUrl = page.bookUrl;
            booksUrl.map(async (bookUrl)=>{
                const book = await getPage(bookUrl);
            if(book){
                book.categoryId = categoryId
                handleJSON.add("books.json", book);
            }
            })
            
        
        } catch (err) {
            console.error(err.message);
        }
    });
}

const getAllBooks=async ()=>{
    try {
    handleJSON.createFile("booksUrl.json");
    categoryUrl.map(async (url)=>{
        const categoryData ={"categoryName":"","bookUrl":[]},
        page=await axios.get(url);
   currentDom     = parseHTML(page.data);
    // {"categoryName":"","categoryDescription":"","bookUrl":[]}
    getAttributeByAttribute('header','role','presentation',(result)=>{ 
        if(!categoryData.categoryName){
            categoryData.categoryName = result.getElementsByTagName('h1')[0].textContent
        }
    })
    getAttributeByAttribute('a','title','view details',(result)=>{ 
        const targetElement= homePageUrl + result.getAttribute('href');
        categoryData.bookUrl.push(targetElement)
        // console.log(result)
    })
    handleJSON.add("booksUrl.json",categoryData)
    })
}catch (err){
console.log(err);
}
}


const getAttributeByAttribute = (tagName,comparisonAttribute,comparisonValue,cb)=>{
   const elements       = currentDom.getElementsByTagName(tagName);
   elements.map((element)=>{
    if(element.getAttribute(comparisonAttribute)=== comparisonValue){
            cb(element)
        };
    })
}

// {"categoryName":"","categoryDescription":"","bookUrl":[]}


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
            )[0].value,
            author       =  mapElementAttributes(
                getElmentAttributes('author'),
                "value"
            )[0].value,
            thumbnails   = currentDom.getElementsByClassName("secondary-image").map((div)=>{
             return div.getAttribute("src")
            });
console.log(thumbnails)
        return { name, description, rating, price, image ,author,thumbnails};
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

const postCategoryToApi= async(categoryname)=>{
try{
    const res=await axios.post("http://127.0.0.1:5003/categories",{"name" : categoryname})
    return res.data;
}catch(err){
console.log(err.data);
}
}



// postToApi(booksJson)
loopThroughPages(pages);

// getAllBooks()