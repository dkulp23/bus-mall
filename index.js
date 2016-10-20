'use strict';

var Product = function(productName, productPath, timesShown, timesClicked) {
  this.name = productName;
  this.filePath = productPath;
  this.numTimesShown = timesShown || 0;
  this.numTimesClicked = timesClicked || 0;
  tracker.allProducts.push(this);
}; // constructor for Product object instances

var tracker = {
  productNames: [], //created by slicing off path and file type. used to define product names
  allProducts: [], //array of Product instances
  randomNumbers: [], //3 unique random numbers in range of number of images used to reference their index number in the allProducts array when rendering to DOM
  imgPaths: [
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
  ],
  imgIDNames: [
    '#leftImage',
    '#middleImage',
    '#rightImage'
  ], //used to create document.getElementById helper function
  clickCounter: 0, //counts user clicks
  productsClickedTimesForChart: [ ], //array of times clicked data for chart
  productsShownTimesForChart: [ ], //array of times shown data for chart
  productInstancesSortedDescendingByTimesClicked: [ ],
  topFiveProductsClicked: [ ],

  checkForLocalStorage: function() {
    if (localStorage.allProducts) {
      var products = JSON.parse(localStorage.getItem('allProducts'));
      for (var pro of products) {
        new Product(pro.name, pro.filePath, pro.numTimesShown, pro.numTimesClicked);
      }
      tracker.extractNames();
      tracker.randomImageNumber(tracker.imgPaths.length); //calls function to push 3 unique, random numbers to array
      tracker.showImages(); //calls function above
      tracker.countEventListeners(); //calls function above
    } else {
      doAllTheMethods(tracker);
    }
  },

  extractNames: function() {
    for (var i = 0; i < this.imgPaths.length; i++) {
      this.productNames.push(this.imgPaths[i].slice(4, -4));
    }
  }, //used to slice off path and file type from image path to extract just the name

  createTheProductInstances: function() {
    for (var i = 0; i < this.imgPaths.length; i++) {
      new Product(this.productNames[i], this.imgPaths[i]);
    }
  }, // loop to create Product instances

  randomImageNumber: function(max) {
    for (var i = 0; i < 3; i++) {
      var number = Math.floor(Math.random() * max);
      while(this.randomNumbers.indexOf(number) > -1) {
        number = Math.floor(Math.random() * max);
      }
      this.randomNumbers.push(number);
      this.allProducts[number].numTimesShown +=1; //updates value of product objects when they're shown
    }
  }, //used to generate unique random number array

  $: function(selector) {
    return document.querySelector(selector);
  }, //helper function to hook element in DOM

  renderImage: function(prod, elementSelector) {
    var divEl = this.$(elementSelector);
    divEl.innerHTML = ' ';
    var imgEl = document.createElement('img');
    imgEl.setAttribute('id', prod.name);
    imgEl.setAttribute('class', 'randomImage')
    imgEl.setAttribute('src', prod.filePath);
    divEl.appendChild(imgEl);
  }, //helper function for rendering images in DOM

  showImages: function() {
    this.renderImage(this.allProducts[this.randomNumbers[0]], this.imgIDNames[0]);
    this.renderImage(this.allProducts[this.randomNumbers[1]], this.imgIDNames[1]);
    this.renderImage(this.allProducts[this.randomNumbers[2]], this.imgIDNames[2]);
  }, // uses index values of products and unique random numbers generated to render images

  imgClickEvent: function(event) {
    var userVote = event.target.id;
    for (var i = 0; i < tracker.allProducts.length; i++) {
      if (userVote === tracker.allProducts[i].name) {
        tracker.allProducts[i].numTimesClicked += 1;
        tracker.randomNumbers = [ ];
        tracker.randomImageNumber(tracker.imgPaths.length);
        tracker.showImages();
        tracker.clickCounter += 1;
        tracker.countEventListeners();
      }
    }
  }, //update value product object when it is clicked by user

  addingEventListeners: function(eventType, functionToExecute) {
    for (var i = 0; i < this.imgIDNames.length; i++) {
      this.$(this.imgIDNames[i]).addEventListener(eventType, functionToExecute);
    }
  }, // function to create event listeners on each of the three images

  removingEventListeners: function(eventType, functionToExecute) {
    for (var i = 0; i < this.imgIDNames.length; i++) {
      this.$(this.imgIDNames[i]).removeEventListener(eventType, functionToExecute);
    }
  }, //function for disabling event listeners

  createButton: function(elementSelector, nameAttribute, textContent) {
    var divEl = this.$(elementSelector);
    var buttonEl = document.createElement('button');
    buttonEl.setAttribute('name', nameAttribute);
    buttonEl.textContent = textContent;
    divEl.appendChild(buttonEl);
  }, //create result and refresh button

  countEventListeners: function() {
    if (this.clickCounter < 15) {
      this.addingEventListeners('click', this.imgClickEvent);
    } else {
      this.createButton('#getResultsButton', 'resultsButton', 'See the results!');
      this.removingEventListeners('click', this.imgClickEvent);
    }
  }, //creates event listener for 15 clicks and then disables it

  resultsButtonClickEvent: function(event) {
    tracker.getDataForChart();
    var buttonEl = tracker.$('#getResultsButton');
    buttonEl.innerHTML = ' ';
    tracker.createButton('#resetButton', 'refreshButton', 'Reset the page');
    tracker.makeTheChart();
  }, //render list of products and times clicked in DOM

  getDataForChart: function() { //TODO
    // tracker.productsClickedTimesForChart = [ ];
    // tracker.productsShownTimesForChart = [ ];
    function getNumTimesClickedandShown(obj) {
      tracker.productsClickedTimesForChart.push(obj.numTimesClicked);
      tracker.productsShownTimesForChart.push(obj.numTimesShown);
    }
    // function sortTheArrayBasedOnClicks(obj) {
    //   tracker.allProducts.sort(function(a, b) {
    //     return a.numTimesClicked - b.numTimesClicked;
    //   })
    // }
    tracker.allProducts.forEach(getNumTimesClickedandShown);
    // sortTheArrayBasedOnClicks();
    // function reverseTheSortedArray(source, destination) {
    //   destination.push(source.reverse());
    // }
    // reverseTheSortedArray(this.allProducts, this.productInstancesSortedDescendingByTimesClicked);
    // function extractTheTopFive() {
    //   tracker.productInstancesSortedDescendingByTimesClicked.splice(5);
    //   tracker.topFiveProductsClicked.push(tracker.productInstancesSortedDescendingByTimesClicked);
    // }
    // extractTheTopFive();
  }, //create data arrays for chart.js

  makeTheChart: function() {
    var canvasSectionEl = this.$('#chart');
    var canvasDivEl = document.createElement('div');
    canvasDivEl.setAttribute('id', 'clickResultsChartDiv');
    var canvasEl = document.createElement('canvas');
    canvasEl.setAttribute('id', 'clickResultsChart');
    canvasDivEl.appendChild(canvasEl);
    canvasSectionEl.appendChild(canvasDivEl);
    var ctx = this.$('#clickResultsChart');
    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.productNames,
        datasets: [
          {
            label: 'Number of Times Product was Clicked',
            backgroundColor: 'rgb(6, 21, 57)',
            borderColor: 'rgb(120, 135, 171)',
            borderWidth: 1,
            data: this.productsClickedTimesForChart,
          },
          {
            label: 'Number of Times Product was Shown',
            backgroundColor: 'rgb(85, 38, 0)',
            borderColor: 'rgb(212, 154, 106)',
            borderWidth: 1,
            data: this.productsShownTimesForChart,
          }
        ]
      }
    })
  }, //create canvas element and render chart of results using chart.js

  refreshThePage: function(event) {
    localStorage.setItem('allProducts', JSON.stringify(tracker.allProducts));
    window.location.reload();
  },

};

function doAllTheMethods(obj) {
  obj.extractNames(); //calling function to create product name values
  obj.createTheProductInstances(); // calling object constructor function
  obj.randomImageNumber(obj.imgPaths.length); //calls function to push 3 unique, random numbers to array
  obj.showImages(); //calls function above
  obj.countEventListeners(); //calls function above
}

tracker.checkForLocalStorage();
// doAllTheMethods(tracker);

tracker.$('#getResultsButton').addEventListener('click', tracker.resultsButtonClickEvent);
tracker.$('#resetButton').addEventListener('click', tracker.refreshThePage);
