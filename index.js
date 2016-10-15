'use strict';

var productNames = []; //created by slicing off path and file type. used to define product names

var allProducts = []; //array of Product instances

var randomNumbers = []; //3 unique random numbers in range of number of images used to reference their index number in the allProducts array when rendering to DOM

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
]; //used to create document.getElementById helper function

function extractNames() {
  for (var i = 0; i < imgPaths.length; i++) {
    productNames.push(imgPaths[i].slice(4, -4));
  }
} //used to slice off path and file type from image path to extract just the name

extractNames(); //calling function above

var Product = function(productName, productPath) {
  this.name = productName;
  this.filePath = productPath;
  this.numTimesShown = 0;
  this.numTimesClicked = 0;
  allProducts.push(this);
}; // constructor for Product object instances

function createTheProductInstances() {
  for (var i = 0; i < imgPaths.length; i++) {
    new Product(productNames[i], imgPaths[i]);
  }
} // loop to create Product instances

createTheProductInstances(); // calling function above

var tracker = {
  counter: 0,
}

function randomImageNumber(max) {
  for (var i = 0; i < 3; i++) {
    var number = Math.floor(Math.random() * max);
    while(randomNumbers.indexOf(number) > -1) {
      var number = Math.floor(Math.random() * max);
    }
    randomNumbers.push(number);
    allProducts[number].numTimesShown +=1; //updates value of product objects when they're shown
  }
} //used to generate unique random number array

randomImageNumber(imgPaths.length); //calls function above

function renderImage(prod, elementID) {
  var divEl = document.getElementById(elementID);
  divEl.innerHTML = ' ';
  var imgEl = document.createElement('img');
  imgEl.setAttribute('id', prod.name);
  imgEl.setAttribute('class', 'randomImage')
  imgEl.setAttribute('src', prod.filePath);
  divEl.appendChild(imgEl);
} //helper function for rendering images in DOM

function showImages() {
  renderImage(allProducts[randomNumbers[0]], imgIDNames[0]);
  renderImage(allProducts[randomNumbers[1]], imgIDNames[1]);
  renderImage(allProducts[randomNumbers[2]], imgIDNames[2]);
} // uses index values of products and unique random numbers generated to render images

showImages(); //calls function above

function userClick(idName) {
  return document.getElementById(idName);
} //helper function to hook element in DOM for click event handler

function imgClickEvent(event) {
  var userVote = event.target.id;
  for (var i = 0; i < allProducts.length; i++) {
    if (userVote === allProducts[i].name) {
      allProducts[i].numTimesClicked += 1;
      randomNumbers = [ ];
      randomImageNumber(imgPaths.length);
      showImages();
      tracker.counter += 1;
      console.log(tracker.counter);
    }
  }
} //update value product object when it is clicked by user

function createEventListeners(eventType, functionToExecute) {
  for (var i = 0; i < imgIDNames.length; i++) {
    userClick(imgIDNames[i]).addEventListener(eventType, functionToExecute);
  }
} // function to create event listeners on each of the three images

createEventListeners('click', imgClickEvent);
