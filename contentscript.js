chrome.extension.sendRequest({method: "get_rules"}, function(response) {
    if (response.rules == "") {
        // No rules, don't do anything!
        return;
    }

    var rules = "";
    var match = [];
    rules = response.rules.split("\n");

    // Loop through all of the rules and add the specific rule if there is a match
    // If multiple rules match, we will take action on the last rule matched.
    // This is so that we can override previous rules.
    for (key in rules) {
        var thisrule = rules[key].split(",");
        var url_regex = thisrule[1].trim();
        url_regex = url_regex.replace(/\*/g, "[^ ]+");
        if (url_regex.indexOf("file://") == -1 && url_regex.indexOf("http") == -1) {
            url_regex = "^http[s]?://" + url_regex;
        }
        if (window.location.pathname == "/") {
            url_regex = url_regex + "[/]";
        }
        regexp = new RegExp(url_regex);
        if (regexp.test(window.location.href)) {
            // Set the match even if it's a revert operation
            match = thisrule;
        }
    }

    // If there is a match, process it
    if (match[0] && chrome.extension.inIncognitoContext) {
        var operation = match[0].trim().toLowerCase();
        if (operation != "revert") {
            var textval = "";
            if (typeof match[2] != "undefined") {
                textval = match[2].trim();
            }

            if (operation == "rename") {
                var iconElement = [];
                var linkList = document.getElementsByTagName("link");
                for(var i=0; i<linkList.length; i++){
                    var link = linkList[i];
                    if((typeof(link.rel) === "string") && (link.rel.indexOf("icon")>-1)){
                        iconElement.push(link);
                    }
                }
                document.title = textval;
                setInterval(function(){
                    if(document.title !== textval){
                        document.title = textval;
                    }
                    for(var i=0; i<iconElement.length; i++){
                        if(iconElement[i].href !== "https://www.baidu.com/favicon.ico"){
                            iconElement[i].href = "https://www.baidu.com/favicon.ico";
                        }
                    }
                }, 200);
            }

            if (operation == "prefix") {
                document.title = textval + " " + document.title;
            }

            if (operation == "suffix") {
                document.title = document.title + " " + textval;
            }

            // Tell the background page that there is a match.
            // This will make the icon appear in the address bar.
            chrome.extension.sendRequest({method: "is_active"}, function(response) {});
        }
    }
});