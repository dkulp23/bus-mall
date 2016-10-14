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
// function imageArgument() {
//   return allProducts[randomImageNumber(0, imgPaths.length)];
// }

function renderImage(prod, elementID) {
  var divEl = document.getElementById(elementID);
  var imgEl = document.createElement('img');
  imgEl.setAttribute('id', prod.name);
  imgEl.setAttribute('class', 'randomImage')
  imgEl.setAttribute('src', prod.filePath);
  divEl.appendChild(imgEl);
}

var clickTotals = {
  left: renderImage(allProducts[randomNumbers[0]], 'leftImage'),
  middle: renderImage(allProducts[randomNumbers[1]], 'middleImage'),
  right: renderImage(allProducts[randomNumbers[2]], 'rightImage'),
  imgEls: [
    document.getElementById('leftImage'),
    document.getElementById('middleImage'),
    document.getElementById('rightImage')
  ],
  userVote: function() {
    this.numTimesClicked += 1;
  },
  listen: imgEls[0].addEventListener('click', userVote)
};

function userVote(target) {
  target.numTimesClicked += 1;
}
