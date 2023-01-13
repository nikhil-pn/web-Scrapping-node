const puppeteer = require("puppeteer");
const fs = require("fs");
const { timeEnd } = require("console");
const { title } = require("process");
const data = {
  list: [],
};

async function main(skill) {
  //launces chromium
  const browser = await puppeteer.launch({ headless: false });
  //open new tab
  const page = await browser.newPage();
  // `https://in.indeed.com/jobs?q=${skill}&l=Ernakulam%2C+Kerala`

  await page.goto(
    `https://in.indeed.com/jobs?q=${skill}&l=Ernakulam%2C+Kerala`,
    { timeout: 0, waitUntil: "networkidle0" }
  );

  const jobData = await page.evaluate(async (data) => {
    const items = document.querySelectorAll("td.resultContent");
    items.forEach((item, index) => {
      const title = item.querySelector("h2.jobTitle>a")?.innerText;
      const link = item.querySelector("h2.jobTitle>a")?.href;
      console.log("link=", link);
      console.log("title", title);
      let salary = item.querySelector(
        "div.metadata.salary-snippet-container > div"
      )?.innerText;
      const compamyName = item.querySelector("span.companyName")?.innerText;

      if (salary === null) {
        salary = "not defined";
      }

      data.list.push({
        title,
        salary,
        compamyName,
        link,
      });
    });
    return data;
  }, data);

  let response = await jobData;
  let json = JSON.stringify(jobData, null, 2);
  fs.writeFile("job.json", json, "utf-8", () => {
    console.log("written in job.json");
    console.log("title", data, data.link);
  });
  //close browser
  browser.close();
  return response;
}

module.exports = main;
