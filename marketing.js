var marketingTable = {
  products: JSON.parse(localStorage.getItem('tracker')),
  allProducts: [ ],

  quickExtactProductData: function() {
    marketingTable.allProducts = marketingTable.products.allProducts;
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

  // loopForTableText: function(name, ) {
  //   for(var i = 0; i < marketingTable.allProducts.length; i++) {
  //     marketingTable.createRow('marketingData', '')
  //   }
  // },

}

marketingTable.quickExtactProductData();
marketingTable.createRow('marketingData', 'thead', 'th', 'Item', 'Views', 'Clicks', '% Times Clicked When Shown', 'Recomended?');
