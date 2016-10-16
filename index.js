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

var clickCounter = 0; //counts user clicks

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

}; //will become large obect to handle clicks

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

function $(idName) {
  return document.getElementById(idName);
} //helper function to hook element in DOM

function renderImage(prod, elementID) {
  var divEl = $(elementID);
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

function imgClickEvent(event) {
  var userVote = event.target.id;
  for (var i = 0; i < allProducts.length; i++) {
    if (userVote === allProducts[i].name) {
      allProducts[i].numTimesClicked += 1;
      randomNumbers = [ ];
      randomImageNumber(imgPaths.length);
      showImages();
      clickCounter += 1;
      countEventListeners();
    }
  }
} //update value product object when it is clicked by user

function addingEventListeners(eventType, functionToExecute) {
  for (var i = 0; i < imgIDNames.length; i++) {
    $(imgIDNames[i]).addEventListener(eventType, functionToExecute);
  }
} // function to create event listeners on each of the three images

function removingEventListeners(eventType, functionToExecute) {
  for (var i = 0; i < imgIDNames.length; i++) {
    $(imgIDNames[i]).removeEventListener(eventType, functionToExecute);
  }
} //function for disabling event listeners

function createButton(idName, nameAttribute, textContent) {
  var divEl = $(idName);
  var buttonEl = document.createElement('button');
  buttonEl.setAttribute('name', nameAttribute);
  buttonEl.textContent = textContent;
  divEl.appendChild(buttonEl);
} //create result and refresh button

function countEventListeners() {
  if (clickCounter < 15) {
    addingEventListeners('click', imgClickEvent);
  } else {
    createButton('getResultsButton', 'resultsButton', 'See the results!');
    removingEventListeners('click', imgClickEvent);
  }
} //creates event listener for 15 clicks and then disables it

countEventListeners(); //calls function above

function resultsButtonClickEvent(event) {
  var buttonEl = $('getResultsButton');
  buttonEl.innerHTML = ' ';
  createButton('resetButton', 'refreshButton', 'Reset the page');
  var divEl = $('trackerList');
  var listTitleEl = document.createElement('p');
  listTitleEl.textContent = 'Here is a list of the available products and a count of which ones you chose:';
  divEl.appendChild(listTitleEl);
  var ulEl = document.createElement('ul');
  ulEl.setAttribute('id', 'productList');
  for (var i = 0; i < allProducts.length; i++) {
    if (allProducts[i].numTimesShown > 0) {
      var liEl = document.createElement('li');
      liEl.setAttribute('class', 'products');
      liEl.textContent = 'The ' + allProducts[i].name + ' was clicked ' + allProducts[i].numTimesClicked + ' times out of ' + allProducts[i].numTimesShown + ' times shown.';
      ulEl.appendChild(liEl);
    }
  }
  divEl.appendChild(ulEl);
} //render list of products and times clicked in DOM

$('getResultsButton').addEventListener('click', resultsButtonClickEvent);

function refreshThePage(event) {
  localStorage.setItem('clicks', clickCounter);
  window.location.reload();
}

$('resetButton').addEventListener('click', refreshThePage);
