// ==UserScript==
// @name         BotYandex2
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Bot for Yandex
// @author       Evgeniy Titov
// @match        https://ya.ru/*
// @match        https://napli.ru/*
// @match        https://kiteuniverse.ru/*
// @match        https://motoreforma.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

let input = document.getElementsByName("text")[0];
let links = document.links;
let searchBtn = document.querySelector(".search3__button");
let sites = {
  "napli.ru": ["вывод произвольных полей wordpress", "10 самых популярных шрифтов от Google",
               "Отключение редакций и ревизий в WordPress", "Базовые вещи про GIT"],
  "kiteuniverse.ru": ["Шоу воздушных змеев", "Kite Universe Россия", "Воздушные змеи – наша специализация"],
  "motoreforma.com": ["тюнинг Maverick", "прошивки CAN-AM", "запчасти для квадроциклов"],
}
let sitesLength = Object.keys(sites).length;
let site = Object.keys(sites)[getRandom(0, sitesLength)];

let keywords = sites[site];
let keyword = keywords[getRandom(0, keywords.length)];

if (searchBtn !== null) {
  document.cookie = `site=${site}`;
} else if (location.hostname == "ya.ru") {
  site = getCookie("site");
} else {
  site = location.hostname;
}

// Работаем на главной странице поисковика
if (searchBtn !== null) {
  let i = 0;
  let timerId = setInterval(function() {
    input.value += keyword[i];
    i++;
    if (i == keyword.length) {
      clearInterval(timerId);
      searchBtn.click();
    }
  }, 300)

  } else if (location.hostname == site) {
    setInterval (() => {
      let index = getRandom(0, links.length);
      let localLink = links[index];

      if (getRandom(0, 101) >= 60) {
        //увидел в cookies две одноименные записи с именем site, но разными сайтами в значениях
        document.cookie = `site=${site}; max-age=0`;
        location.href = "https://ya.ru/";
      }

      if (localLink.href.includes(site)) {
        localLink.click()
      }
    }, getRandom(1000, 1500)) //1-1.5 seconds
    console.log("Мы на целевом сайте");
  }
//Работаем на странице поисковой выдачи
else {
  let nextPage = true;
  for (let i = 0; i < links.length; i++) {
    if (links[i].href.indexOf(site) != -1) {
      let link = links[i];
      nextPage = false;
      console.log("Нашел строку " + link);
      setTimeout(()=>{
        link.removeAttribute("target");
        link.click();
      }, getRandom(2000, 4000));
      break;
    }
  }
  if (document.querySelector(".Pager-Item_current").innerText == "5") {
    nextPage = false;
    //увидел в cookies две одноименные записи с именем site, но разными сайтами в значениях
    document.cookie = `site=${site}; max-age=0`;
    location.href = "https://ya.ru/";
  }
  if (nextPage) {
    setTimeout(()=>{
      document.querySelector(".Pager-Item_type_next").click();
    }, getRandom(2500, 4000))

  }
}

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
