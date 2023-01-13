const { Router } = require("express");
const e = require("express");
const express = require("express");
const routes = express.Router();
const main = require("./scrapeFn/scrape");
const path = require("path");

routes.post("/indeed", async (req, res) => {
  try {
    const { skill } = req.body;
    let scrap = await main(skill);
    return res.status(200).json({
      status: "ok",
      list: scrap?.list || {},
    });
  } catch (error) {
    return res.status(500).send(error);
  }
});

routes.get("/getdata", async (req, res) => {
  try {
    //path define to send data when a get request is made
    const jobs = path.join(__dirname, "..", "job.json");
    console.log(jobs)
    return res.status(200).sendFile(jobs)
  } catch (error) {
    return res.status(500).send(error);
  }
  // const jobs = path.join(__dirname, "..", "job.json");
  // console.log(jobs);
});

module.exports = routes;
