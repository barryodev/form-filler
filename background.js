function changeBackgroundColor() {
    document.body.style.backgroundColor = "blue";
  }

chrome.action.onClicked.addListener(function(tab) {
    // No tabs or host permissions needed!
    console.log('Turning ' + tab.url + ' blue!');
    
    chrome.scripting.executeScript({
        target : {tabId : tab.id},
        func : changeBackgroundColor,
      });
  });