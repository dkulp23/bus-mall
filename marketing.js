var marketingTable = {
  products: JSON.parse(localStorage.getItem('allProducts')),
  productNames: [ ],
  productsShown: [ ],
  productsClicked: [ ],
  productsPercentage: [ ],
  recommendation: [ ],

  extactProductData: function() {
    for(var i = 0; i < marketingTable.products.length; i++) {
      marketingTable.productNames.push(marketingTable.products[i].name);
      marketingTable.productsShown.push(marketingTable.products[i].numTimesShown);
      marketingTable.productsClicked.push(marketingTable.products[i].numTimesClicked);
      marketingTable.productsPercentage.push(marketingTable.products[i].clickPercentage);
    }
  },

  yesOrNo: function() {
    for(var i = 0; i < marketingTable.productsPercentage.length; i++) {
      if(marketingTable.productsPercentage[i] < 25) {
        marketingTable.recommendation.push('no');
      } else {
        marketingTable.recommendation.push('yes');
      }
    }
  },

  makeAnElementWithText: function(element, textContent, parent) {
    var childEl = document.createElement(element);
    childEl.textContent = textContent;
    parent.appendChild(childEl);
  },

  createRow: function(idName, rowElement, El, tC1, tC2, tC3, tC4, tC5) {
    var tableEl = document.getElementById(idName);
    var rowEl = document.createElement(rowElement);
    marketingTable.makeAnElementWithText(El, tC1, rowEl);
    marketingTable.makeAnElementWithText(El, tC2, rowEl);
    marketingTable.makeAnElementWithText(El, tC3, rowEl);
    marketingTable.makeAnElementWithText(El, tC4, rowEl);
    marketingTable.makeAnElementWithText(El, tC5, rowEl);
    tableEl.appendChild(rowEl);
  },

  populateTable: function(name, viewed, clicked, percent, recommend) {
    for(var i = 0; i < marketingTable.productNames.length; i++) {
      marketingTable.createRow('marketingData', 'tr', 'td', name[i], viewed[i], clicked[i], percent[i] + '%', recommend[i]);
    }
  },

  setSelector: function() {
    var tableEl = document.getElementById('marketingData');
    var tableCells = tableEl.getElementsByTagName('td');
    for(i = 0; i < tableCells.length; i++) {
      if(tableCells[i].textContent === 'yes') {
        tableCells[i].setAttribute('class', 'green');
      } else if(tableCells[i].textContent === 'no') {
        tableCells[i].setAttribute('class', 'red');
      }
    }
  },

}

marketingTable.extactProductData();
marketingTable.yesOrNo();
marketingTable.createRow('marketingData', 'thead', 'th', 'Item', 'Views', 'Clicks', '% Times Clicked When Shown', 'Recomended?');
marketingTable.populateTable(marketingTable.productNames, marketingTable.productsShown, marketingTable.productsClicked, marketingTable.productsPercentage, marketingTable.recommendation);
marketingTable.setSelector();
