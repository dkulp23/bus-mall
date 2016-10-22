var marketingTable = {
  products: JSON.parse(localStorage.getItem('tracker')),
  productNames: [ ],
  productsShown: [ ],
  productsClicked: [ ],
  productsPercentage: [ ],

  quickExtactProductData: function() {
    marketingTable.productNames = marketingTable.products.productsNamesArrayForChart;
    marketingTable.productsShown = marketingTable.products.productsShownTimesForChart;
    marketingTable.productsClicked = marketingTable.products.productsClickedTimesForChart;
    marketingTable.productsPercentage = marketingTable.products.percentageClicksToShown;
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

  populateTable: function(name, viewed, clicked, percent) {
    for(var i = 0; i < marketingTable.productNames.length; i++) {
      marketingTable.createRow('marketingData', 'tr', 'td', name[i], viewed[i], clicked[i], percent[i], 'yes');
    }
  },

}

marketingTable.quickExtactProductData();
marketingTable.createRow('marketingData', 'thead', 'th', 'Item', 'Views', 'Clicks', '% Times Clicked When Shown', 'Recomended?');
marketingTable.populateTable(marketingTable.productNames, marketingTable.productsShown, marketingTable.productsClicked, marketingTable.productsPercentage);
