//======= MODULES ===============
const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate");

//======== SERVER ==============

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const prodData = JSON.parse(data);

const ser = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //OVERVIEW PAGE
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-type": "html",
    });

    const cardsHTML = prodData
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHTML);

    res.end(output);

    //PRODUCT PAGE
  } else if (pathname === "/product") {
    const product = prodData[query.id];
    res.writeHead(200, {
      "Content-type": "html",
    });
    const output = replaceTemplate(tempProduct, product);
    res.end(output);

    //API PAGE
  } else if (pathname === "/api") {
    res.end(data);

    //NOT FOUND PAGE
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello world",
    });
    res.end("<h1>Page not found!</h1>");
  }
});

ser.listen(8000, "127.0.0.1", () => {
  console.log("Listening on port 8000");
});
