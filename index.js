const { createServer } = require("http");
const { readFileSync } = require("fs");
const url = require("url");

const replaceTemplate = require("./modules/replaceTemplate");

const templateOverview = readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const templateCard = readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const templateProduct = readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObject = JSON.parse(data);

createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
 

  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const cardHtml = dataObject
      .map((el) => replaceTemplate(templateCard, el))
      .join("");
    const output = templateOverview.replace("{%PRODUCT_CARDS%}", cardHtml);

    res.end(output);
  } else if (pathname === "/product") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    const product = dataObject[query.id];
    const output = replaceTemplate(templateProduct, product);
    res.end(output);
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "My-head": "MyBody",
    });
    res.end("<h1>page not found!</h1>");
  }
}).listen(7000, () => {
  console.log(`http://localhost:7000/`);
});
