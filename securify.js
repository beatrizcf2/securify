// Getting the HTML
async function FetchHtml(url) {
  let response = await fetch(url);
  return await response.text(); // Returns it as Promise
}

String.prototype.isDomain = function (domain) {
  var pat =
    "^https?://(?:[^/@:]*:[^/@]*@)?(?:[^/:]+.)?" + domain + "(?=[/:]|$)";
  var re = new RegExp(pat, "i");
  return re.test(this);
};

// Usaing the HTML
async function Do(sourceUrl) {
  let html = await FetchHtml(sourceUrl).then((text) => {
    return text;
  }); // Get html from the promise
  let sourceDoc = new DOMParser().parseFromString(html, "text/html");
  let links = sourceDoc.links;
  // filter all links that contain moz-extension
    let filteredLinks = Array.from(links).filter((link) => {
        return !link.href.includes("moz-extension")&&(!link.href.includes("void(0)"));
    });
  let urls = [];
  let thirdUrls = [];
  let thirdConnectionList = document.getElementById("connections-list");
    for (let i = 0; i < filteredLinks.length; i++) {
        urls.push(new URL(filteredLinks[i].href));
        if (!urls[i].href.isDomain(sourceUrl.hostname.split('.').slice(-2).join('.'))) {
            thirdUrls.push(urls[i]);
            let li = document.createElement("li");
            thirdConnectionList.appendChild(li);
            
            var link = document.createElement("a");
            link.setAttribute('href', urls[i].href);
            link.innerHTML = urls[i].hostname;
            //let content = document.createTextNode(urls[i]);
            
            li.appendChild(link);
        }
        
    }
    
  document.getElementById("connections-count").textContent = thirdUrls.length;

  // add lengh to html
}

function showCookiesForTab(tabs) {
  //get the first tab object in the array
  let tab = tabs.pop();
  let currentUrl = new URL(tab.url);

  Do(currentUrl);

  let gettingAllCookies = browser.cookies.getAll({ url: tab.url });
  gettingAllCookies.then((cookies) => {
    let cookieList;
    let first_count = 0;
    let third_count = 0;

    if (cookies.length >= 0) {
      //add an <li> item with the name and value of the cookie to the list
      for (let cookie of cookies) {
        // CHECK IF ITS FIRST PARTY OR THIRD PARTY
        if (currentUrl.href.isDomain(cookie.domain)) {
          first_count++;
          cookieList = document.getElementById("first-cookie-list");
        } else {
          third_count++;
          cookieList = document.getElementById("third-cookie-list");
        }

        let li = document.createElement("li");

        if (cookie.session) {
          let content = document.createTextNode(
            "SESSION: " + cookie.name + ": " + cookie.value
          );
          li.appendChild(content);
        } else if (!cookie.session) {
          let content = document.createTextNode(
            "NAVIGATION: " + cookie.name + ": " + cookie.value
          );
          li.appendChild(content);
        }

        cookieList.appendChild(li);
      }
      
    }
    //set the couter of cookies
    document.getElementById("cookie-count").textContent = cookies.length;
    if (first_count<=0){
        const element = document.getElementById("first-title");
        element.remove();
    }
    if(third_count<=0){
        const element = document.getElementById("third-title");
        element.remove();
    }
    
    document.getElementById("storage-count").textContent = localStorage.length;
    let storageList = document.getElementById("local-storage-list");
    for (let i = 0; i < localStorage.length; i++) {
        let li = document.createElement("li");
        let content = document.createTextNode(localStorage.key(i) + ": " + localStorage.getItem(localStorage.key(i)));
        li.appendChild(content);
        storageList.appendChild(li);
    }

  });
}

//get active tab to run an callback function.
//it sends to our callback an array of tab objects
function getActiveTab() {
  return browser.tabs.query({ currentWindow: true, active: true });
}
getActiveTab().then(showCookiesForTab);
