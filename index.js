'use strict';

var productNames = [];

var allProducts = [];

var randomNumbers = [];

var imgPaths = [
  'img/bag.jpg',
  'img/banana.jpg',
  'img/bathroom.jpg',
  'img/boots.jpg',
  'img/breakfast.jpg',
  'img/bubblegum.jpg',
  'img/chair.jpg',
  'img/cthulhu.jpg',
  'img/dog-duck.jpg',
  'img/dragon.jpg',
  'img/pen.jpg',
  'img/pet-sweep.jpg',
  'img/scissors.jpg',
  'img/shark.jpg',
  'img/sweep.png',
  'img/tauntaun.jpg',
  'img/unicorn.jpg',
  'img/usb.gif',
  'img/water-can.jpg',
  'img/wine-glass.jpg'
];

var imgIDNames = [
  'leftImage',
  'middleImage',
  'rightImage'
];

function extractNames() {
  for (var i = 0; i < imgPaths.length; i++) {
    productNames.push(imgPaths[i].slice(4, -4));
  }
}

extractNames();

var Product = function(productName, productPath) {
  this.name = productName;
  this.filePath = productPath;
  this.numTimesShown = 0;
  this.numTimesClicked = 0;
  allProducts.push(this);
};

function createTheProductInstances() {
  for (var i = 0; i < imgPaths.length; i++) {
    new Product(productNames[i], imgPaths[i]);
  }
}

createTheProductInstances();

function randomImageNumber(max) {
  for (var i = 0; i < 3; i++) {
    var number = Math.floor(Math.random() * max);
    while(randomNumbers.indexOf(number) > -1) {
      var number = Math.floor(Math.random() * max);
    }
    randomNumbers.push(number);
  }
}

randomImageNumber(imgPaths.length);

function renderImage(prod, elementID) {
  var divEl = document.getElementById(elementID);
  divEl.innerHTML = ' ';
  var imgEl = document.createElement('img');
  imgEl.setAttribute('id', prod.name);
  imgEl.setAttribute('class', 'randomImage')
  imgEl.setAttribute('src', prod.filePath);
  divEl.appendChild(imgEl);
}

function showImages() {
  renderImage(allProducts[randomNumbers[0]], 'leftImage');
  renderImage(allProducts[randomNumbers[1]], 'middleImage');
  renderImage(allProducts[randomNumbers[2]], 'rightImage');
}

showImages();

function userClick(idName) {
  return document.getElementById(idName);
}

function imgClickEvent(event) {
  var userVote = event.target.id;
  console.log(userVote);
  for (var i = 0; i < allProducts.length; i++) {
    if (userVote === allProducts[i].name) {
      allProducts[i].numTimesClicked += 1;
      console.log(allProducts[i].numTimesClicked);
      showImages();
    }
  }
}

function createEventListeners() {
  for (var i = 0; i < imgIDNames.length; i++) {
    userClick(imgIDNames[i]).addEventListener('click', imgClickEvent);
  }
}

createEventListeners();
