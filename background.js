function onRequest(request, sender, sendResponse) {
  if (request.method == "get_rules") {
    if (localStorage["ttt_rules"]) {
  	sendResponse({rules: localStorage["ttt_rules"]});
    }
    else {
  	sendResponse({rules: ""});
    }
  }
  else if (request.method = "is_active") {
    // Show the page action for the tab that the sender (content script) was on.
    chrome.pageAction.show(sender.tab.id);
  }
  else {
    // Return nothing to let the connection be cleaned up.
    sendResponse({});
  }
};

// Listen for the content script to send a message to the background page.
chrome.extension.onRequest.addListener(onRequest);
