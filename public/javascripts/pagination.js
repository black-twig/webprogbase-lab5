function calculateRange(pageNumber, pagesCount, pagerSize) {
  var start = pageNumber - pagerSize;
  if (start < 1) {
      return {
          start: 1,
          stop: Math.min(2 * pagerSize + 1, pagesCount),
      };
  }
  var stop = pageNumber + pagerSize;
  if (stop > pagesCount) {
      return {
          start: Math.max(1, pagesCount - 2 * pagerSize),
          stop: pagesCount,
      };
  }
  return { start, stop };
}

function addPageButton(parent, style, topage, text) {
  var button = document.createElement('a');
  button.className = style;
  button.innerText = text;
  button.href = "#";
  button.onclick = function(event){event.preventDefault();showMuseums(topage);};
  parent.appendChild(button);
};

function addPagging(parent, pageNumber, pagesCount, pagerSize) {
  var pagesrange = calculateRange(pageNumber, pagesCount, pagerSize);
  var pager = document.createElement('div');
  pager.className = 'pager';
  if (pageNumber>1)
    addPageButton(pager, 'pagerlink', 1, 'First');
  for (var i = pagesrange.start; i <= pagesrange.stop; ++i) {
      var style = 'pagerbutton ' + (i === pageNumber ? 'selected' : 'default');
      addPageButton(pager, style,  i, i);
  }
  if (pageNumber<pagesCount)
    addPageButton(pager, 'pagerlink', pagesCount, 'Last');
  parent.appendChild(pager);
}
