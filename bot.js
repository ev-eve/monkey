// ==UserScript==
// @name         BotBing
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Bot for bing
// @author       Evgeniy Titov
// @match        https://www.bing.com/*
// @match        https://napli.ru/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

let input = document.getElementsByName("q")[0];
let links = document.links;
let searchBtn = document.getElementsByName("search")[0];
let keywords = ["вывод произвольных полей wordpress", "10 самых популярных шрифтов от Google", "Отключение редакций и ревизий в WordPress"];
let keyword = keywords[getRandom(0, keywords.length)];

// Работаем на главной странице поисковика, отключение автозаполнения input Bing:
// https://answers.microsoft.com/en-us/bing/forum/all/how-to-disable-bing-suggestions-when-i-search/aebd0069-f1cb-4a69-a3b2-17f785ad3e76


if (searchBtn !== undefined) {
  let i = 0;
  let timerId = setInterval(function() {
    input.value += keyword[i];
    i++;
    if (i == keyword.length) {
      clearInterval(timerId);
      searchBtn.click();
    }
  }, 300)

  } else if (location.hostname == "napli.ru") {
    console.log("Мы на целевом сайте");
  }
//Работаем на странице поисковой выдачи  
else {
  let nextPage = true;
  for (let i = 0; i < links.length; i++) {
    if (links[i].href.indexOf('napli.ru') != -1) {
      let link = links[i];
      nextPage = false;
      console.log("Нашел строку " + link);
      setTimeout(()=>{
        link.click();
      }, getRandom(2000, 4000)); 
      break;
    }
  }
  if (document.querySelector(".sb_pagS").innerText == "5") {
    nextPage = false;
    location.href = "https://www.bing.com/";
  }
  if (nextPage) {
    setTimeout(()=>{
      document.querySelector(".sb_pagN").click();
    }, getRandom(2500, 4000))

  }
}

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
