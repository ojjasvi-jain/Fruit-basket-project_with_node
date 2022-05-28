const fs = require("fs");
const http = require("http");
const url = require("url");

// const fileData = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(fileData);

// const textWrite = "hi my name is ojjasvi jain";

// fs.writeFileSync("./txt/input.txt", textWrite);

//------------------------------------------------------------------------
//server

let server = http.createServer((req, res) => {
  console.log("response url ====>", req.url);

  const { pathname, query } = url.parse(req.url, true);

  const replaceTemplate = (card, cardData) => {
    let cardWithData = card;

    cardWithData = cardWithData.replace(
      /{%PRODUCT_TITLE%}/g,
      cardData.productName
    );
    cardWithData = cardWithData.replace(/{%ID%}/g, cardData.id);
    cardWithData = cardWithData.replace(/{%IMAGE%}/g, cardData.image);
    cardWithData = cardWithData.replace(/{%QUANTITY%}/g, cardData.quantity);
    cardWithData = cardWithData.replace(/{%PRICE%}/g, cardData.price);
    cardWithData = cardWithData.replace(/{%FROM%}/g, cardData.from);
    cardWithData = cardWithData.replace(
      /{%DISCRIPTION%}/g,
      cardData.description
    );
    cardWithData = cardWithData.replace(/{%PRICE%}/g, cardData.price);
    cardWithData = cardWithData.replace(
      /{%PRODUCT_NAME%}/g,
      cardData.productName
    );
    cardWithData = cardWithData.replace(/{%NUTRIENTS%}/g, cardData.nutrients);
    return cardWithData;
  };

  // reading file synchronously

  const data = fs.readFileSync("./dev-data/data.json", "utf-8");
  const overviewHTML = fs.readFileSync(
    `${__dirname}/templates/template-overview.html`,
    "utf-8"
  );
  const product = fs.readFileSync(
    `${__dirname}/templates/template-product.html`,
    "utf-8"
  );

  const card = fs.readFileSync(
    `${__dirname}/templates/template-card.html`,
    "utf-8"
  );

  // overview
  if (pathname === "/" || pathname === "/overview") {
    const dataParse = JSON.parse(data);
    console.log(card);
    const cardSetInHtml = dataParse.map((cardData) =>
      replaceTemplate(card, cardData)
    );
    let overviewHTMLUpdated = overviewHTML.replace(
      "{%PRODUCT_CARD%}",
      cardSetInHtml.join()
    );
    res.writeHead(200, { "content-type": "text/html" });
    res.end(overviewHTMLUpdated);
  }

  //product
  else if (pathname === `/product`) {
    res.writeHead(200, { "content-type": "text/html" });
    const dataParse = JSON.parse(data);

    const output = replaceTemplate(product, dataParse[query.id]);
    res.end(output);
  }
  // api
  else if (pathname === "/api") {
    res.writeHead(200, { "content-type": "application/json" });

    res.end(data);
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("i am listing ");
});
