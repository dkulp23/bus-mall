'use strict';

var productNames = [];

var allProducts = [];

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
  'img/breakfast.jpg',
  'img/usb.gif',
  'img/water-can.jpg',
  'img/wine-glass.jpg'
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

function randomImageNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function imageArgument() {
  return allProducts[randomImageNumber(0, imgPaths.length)];
}

function renderImage(prod, elementID) {
  var divEl = document.getElementById(elementID);
  var imgEl = document.createElement('img');
  imgEl.setAttribute('id', prod.name);
  imgEl.setAttribute('src', prod.filePath);
  divEl.appendChild(imgEl);
}

var clickTotals = {
  left: renderImage(imageArgument(), 'leftImage'),
  middle: renderImage(imageArgument(), 'middleImage'),
  right: renderImage(imageArgument(), 'rightImage')
};
