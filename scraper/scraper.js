const axios = require('axios'),
    cheerio = require('cheerio'),
    DomParser = require('dom-parser'),
    parser = new DomParser(),
    handleJSON = require('./handle-json-file'),
    homePageUrl = "https://www.barnesandnoble.com",
    categoryUrl = ["https://www.barnesandnoble.com/b/booktok/_/N-2vdn", "https://www.barnesandnoble.com/b/the-best-books-of-2022-so-far/_/N-2vj7", "https://www.barnesandnoble.com/b/audiobooks/_/N-2sgz", "https://www.barnesandnoble.com/b/ebooks-nook/_/N-8qa"],
    pages = require("./booksUrl.json") || [],
    booksJson = require("./books.json") || [];

let currentDom;

const loopThroughPages = async (pages) => {
    handleJSON.createFile("books.json");

    pages.map(async (page) => {
        try {
            const postCategoryName = await postCategoryToApi(page.categoryName),
                categoryId = postCategoryName.category._id,
                booksUrl = page.bookUrl;
            booksUrl.map(async (bookUrl) => {
                const book = await getPage(bookUrl);
                if (book) {
                    book.categoryId = categoryId
                    handleJSON.add("books.json", book);
                }
            })


        } catch (err) {
            console.error(err.message);
        }
    });
}

const getAllBooks = async () => {
    try {
        handleJSON.createFile("booksUrl.json");
        categoryUrl.map(async (url) => {
            const categoryData = {"categoryName": "", "bookUrl": []},
                page = await axios.get(url);
            currentDom = parseHTML(page.data);
            getAttributeByAttribute('header', 'role', 'presentation', (result) => {
                if (!categoryData.categoryName) {
                    categoryData.categoryName = result.getElementsByTagName('h1')[0].textContent
                }
            })
            getAttributeByAttribute('a', 'title', 'view details', (result) => {
                const targetElement = homePageUrl + result.getAttribute('href');
                categoryData.bookUrl.push(targetElement)
            })
            handleJSON.add("booksUrl.json", categoryData)
        })
    } catch (err) {
        console.log(err);
    }
}


const getAttributeByAttribute = (tagName, comparisonAttribute, comparisonValue, cb) => {
    const elements = currentDom.getElementsByTagName(tagName);
    elements.map((element) => {
        if (element.getAttribute(comparisonAttribute) === comparisonValue) {
            cb(element)
        }
    })
}

const getPage = async (pageUrl) => {
    try {
        const page = await axios.get(pageUrl);

        currentDom = parseHTML(page.data);
        const name = getElementText('pdp-header-title'),
            description = getElementText('overview-cntnt'),
            rating = generateRating(),
            image = mapElementAttributes(
                getElmentAttributes('pdpMainImage'),
                "src"
            )[0].value,
            author = mapElementAttributes(
                getElmentAttributes('author'),
                "value"
            )[0].value,
            thumbnails = currentDom.getElementsByClassName("secondary-image").map((div) => {
                return div.getAttribute("src")
            });
        let price =  getElementText('old-price')
            ? getElementText('old-price')
            : getElementText('price');
        price = +price.substring(1,);
        return {name, description, rating, price, image, author, thumbnails};
    } catch (err) {
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

const postToApi = (books) => {
    books.map(async (book) => {
        try {
            const req = await axios.post("http://127.0.0.1:5003/products", book)
            return req.data;
        } catch (err) {
            console.log(err);
        }
    })
}

const postCategoryToApi = async (categoryname) => {
    try {
        const res = await axios.post("http://127.0.0.1:5003/categories", {"name": categoryname})
        return res.data;
    } catch (err) {
        console.log(err.data);
    }
}

const generateDiscountRate = async () => {
    try {
        const res = await axios.get(`http://127.0.0.1:5003/products`),
            books = res.data.products;

        let sentRequest = 0;
        for (let i = 0; sentRequest < 55;  i++) {
            const book = books[i],
                id = book._id;
            if ( !book.discountrate ) {
                try {
                    // const res = await axios.patch(`http://127.0.0.1:5003/products/${id}`, { discountrate: 0.8 });
                    const res = await axios.patch(`http://127.0.0.1:5003/products/${id}`, { stock: randomInt(1, 25) } );
                    sentRequest++;
                } catch (err) {
                    console.log(err.data);
                }
            }
        }
    } catch(err) {
        console.log(err.data);
    }
}

const randomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}


// postToApi(booksJson);
// loopThroughPages(pages);
// getAllBooks()
generateDiscountRate();