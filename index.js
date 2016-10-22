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
  productsNamesArrayForChart: [ ], //array of names for chart labels
  productsClickedTimesForChart: [ ], //array of times clicked data for chart
  productsShownTimesForChart: [ ], //array of times shown data for chart
  percentageClicksToShown: [ ],
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
    for (var i = 0; i < this.randomNumbers.length; i++) {
      this.renderImage(this.allProducts[this.randomNumbers[i]], this.imgIDNames[i]);
    }
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
    tracker.createButton('#resetButton', 'refreshButton', 'Pick Your Favorites Again');
    tracker.makeTheChart();
    tracker.makeTheDoughnutChart();
    tracker.createButton('#clearStorageButton', 'clearStorage', 'Clear Results and Start Again');
    tracker.createButton('#marketingData', 'redirectToTable', 'Marketing Team Click Here');
  }, //render list of products and times clicked in DOM

  getNumTimesClickedandShown: function(obj) {
    tracker.productsNamesArrayForChart.push(obj.name);
    tracker.productsClickedTimesForChart.push(obj.numTimesClicked);
    tracker.productsShownTimesForChart.push(obj.numTimesShown);
  }, //helper function to use with forEach to extract data for chart

  sortTheArrayBasedOnClicks: function(obj) {
    tracker.allProducts.sort(function(a, b) {
      return a.numTimesClicked - b.numTimesClicked;
    })
  }, //function to sort object instances by number of times clicked (ascending)

  reverseTheSortedArray: function(source, destination) {
    destination.push(source.reverse());
  }, //function to reverse order of sort (descending) to help extract top five

  calculationsForChartData: function(clicked, shown) {
    for (var i = 0; i < tracker.productsClickedTimesForChart.length; i++) {
      tracker.percentageClicksToShown.push(((clicked[i] / shown[i]) * 100).toFixed(2));
    }
  },

  getDataForChart: function() {
    tracker.productsNamesArrayForChart = [ ];
    tracker.productsShownTimesForChart = [ ];
    tracker.productsClickedTimesForChart = [ ];
    tracker.sortTheArrayBasedOnClicks();
    tracker.reverseTheSortedArray(tracker.allProducts, tracker.productInstancesSortedDescendingByTimesClicked);
    tracker.allProducts.forEach(tracker.getNumTimesClickedandShown);
    tracker.calculationsForChartData(tracker.productsClickedTimesForChart, tracker.productsShownTimesForChart);
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
        labels: this.productsNamesArrayForChart,
        datasets: [
          {
            label: 'Number of Times Product was Clicked',
            backgroundColor: 'rgba( 51, 92, 124, 1)',
            borderColor: 'rgba( 28, 70, 101, 1)',
            borderWidth: 1,
            data: this.productsClickedTimesForChart,
          },
          {
            label: 'Number of Times Product was Shown',
            backgroundColor: 'rgba(193, 106, 71, 1)',
            borderColor: 'rgba(157, 71, 36, 1)',
            borderWidth: 1,
            data: this.productsShownTimesForChart,
          }
        ]
      }
    })
  }, //create canvas element and render chart of results using chart.js

  makeTheDoughnutChart: function() {
    var canvasSectionEl = this.$('#doughnutChart');
    var canvasDivEl = document.createElement('div');
    canvasDivEl.setAttribute('id', 'clickResultsDoughnutChartDiv');
    var canvasEl = document.createElement('canvas');
    canvasEl.setAttribute('id', 'clickResultsDoughnutChart');
    canvasDivEl.appendChild(canvasEl);
    canvasSectionEl.appendChild(canvasDivEl);
    var ctx = this.$('#clickResultsDoughnutChart');
    var myChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.productsNamesArrayForChart,
        datasets: [
          {
            data: this.percentageClicksToShown,
            backgroundColor: [
              '#527896',
              '#E9CD78',
              '#E99878',
              '#6060A3',
              '#B2C7D8',
              '#BBBBDE',
              '#FFF3D0',
              '#FFEBD0',
              '#7C9CB4',
              '#8A8AC0',
              '#FFEAAA',
              '#FFDBAA',
              '#335C7C',
              '#3E3E87',
              '#C1A247',
              '#C18D47',
              '#1C4665',
              '#26266E',
              '#9D7F24',
              '#9D6924'
            ]
          },
        ]
      }
    })
  }, //create canvas element and render chart of results using chart.js

  refreshThePage: function(event) {
    localStorage.setItem('allProducts', JSON.stringify(tracker.allProducts));
    window.location.reload();
  },

  clearResults: function(event) {
    localStorage.removeItem('allProducts');
    window.location.reload();
  },

  goToMarketingPage: function(event) {
    localStorage.setItem('tracker', JSON.stringify(tracker));
    window.location.assign('file:///Users/JRM/cf/201/bus-mall/marketing.html');
  }

};

function doAllTheMethods(obj) {
  obj.extractNames(); //calling function to create product name values
  obj.createTheProductInstances(); // calling object constructor function
  obj.randomImageNumber(obj.imgPaths.length); //calls function to push 3 unique, random numbers to array
  obj.showImages(); //calls function above
  obj.countEventListeners(); //calls function above
}

tracker.checkForLocalStorage();

tracker.$('#getResultsButton').addEventListener('click', tracker.resultsButtonClickEvent);
tracker.$('#resetButton').addEventListener('click', tracker.refreshThePage);
tracker.$('#clearStorageButton').addEventListener('click', tracker.clearResults);
tracker.$('#marketingData').addEventListener('click', tracker.goToMarketingPage);
