const axios     = require('axios'),
    cheerio     = require('cheerio'),
    DomParser   = require('dom-parser'),
    parser      = new DomParser(),
    handleJSON  = require('./handle-json-file');


const pages = [
    'https://www.barnesandnoble.com/w/where-the-crawdads-sing-delia-owens/1127681226?ean=9780735219106',
];

let currentDom;

const loopThroughPages = async (pages) => {
    handleJSON.createFile("books.json");

    pages.map( async (page) => {
        try {
            const book = await getPage(page);
            handleJSON.add("books.json", book);
        } catch (err) {
            console.error(err.message);
        }
    });
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

loopThroughPages(pages);
