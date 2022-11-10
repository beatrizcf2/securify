// Getting the HTML
async function FetchHtml(url) 
{
    let response = await fetch(url);
    return await response.text(); // Returns it as Promise
}

String.prototype.isDomain = function (domain) {
    var pat = '^https?://(?:[^/@:]*:[^/@]*@)?(?:[^/:]+\.)?' + domain + '(?=[/:]|$)';
    var re = new RegExp(pat, 'i');
    return re.test(this);
}

// Usaing the HTML
async function Do(sourceUrl)
{
   let html = await FetchHtml(sourceUrl).then(text => {return text}); // Get html from the promise
   let sourceDoc = new DOMParser().parseFromString(html, "text/html");
   let links = sourceDoc.links;
   let urls = [];
   let thirdUrls = [];
    // for (let link of links) {   
    //     urls.push(new URL(link.href));
    // }
    
    
    let third_party_length = document.getElementById('external-links-list');
    for (let i = 0; i < links.length; i++) {
        urls.push(new URL(links[i].href));
        if (!((urls[i]).href).isDomain(sourceUrl.hostname)){  
            //alert( url + " is first party");
            thirdUrls.push(urls[i]);
            let li = document.createElement("li");
            let content = document.createTextNode(urls[i]);
            li.appendChild(content);
            third_party_length.appendChild(li);

        }
    }

    // add lengh to html


    //alert(thirdUrls);
    return urls;
}


function showCookiesForTab(tabs) {
    //get the first tab object in the array
    let tab = tabs.pop();
    //urls = document.querySelectorAll('a'); for (url in urls) console.log(urls[url].href);

    let currentUrl = new URL(tab.url);
    
    
    let thirdUrls =  Do(currentUrl);
    
    
    let gettingAllCookies = browser.cookies.getAll({url: tab.url});
    gettingAllCookies.then((cookies) => {
  
      //set the header of the panel
      let activeTabUrl = document.getElementById('header-title');
      let text = document.createTextNode("Cookies at: "+tab.title);
      let cookieList = document.getElementById('cookie-list');
      activeTabUrl.appendChild(text);
  
      if (cookies.length > 0) {
        //add an <li> item with the name and value of the cookie to the list
        for (let cookie of cookies) {
            let li = document.createElement("li");
            if (cookie.session) {
                let content = document.createTextNode("SESSION: " + cookie.name + ": "+ cookie.value);
                li.appendChild(content);
            } else if (!cookie.session) {
                let content = document.createTextNode("NAVIGATION: " + cookie.name + ": "+ cookie.value);
                li.appendChild(content);
            }
            // CHECK IF ITS FIRST PARTY OR THIRD PARTY
            if ((currentUrl.href).isDomain(cookie.domain)){  
                let content = document.createTextNode(" (First Party)");
                li.appendChild(content);
            } else {
                let content = document.createTextNode(" (Third Party)"  );
                li.appendChild(content);
            }

            cookieList.appendChild(li);

        }
      } else {
        let p = document.createElement("p");
        let content = document.createTextNode("No cookies in this tab.");
        let parent = cookieList.parentNode;
  
        p.appendChild(content);
        parent.appendChild(p);
      }
      //set the footer of the panel
      let cookie_length = document.getElementById('cookie-length');
      let cookie_length_content = document.createTextNode("Total Cookies: "+cookies.length);
      cookie_length.appendChild(cookie_length_content);

      if (typeof(Storage) !== "undefined"){
          let local_storage = document.getElementById('local-storage');
          let local_storage_content = document.createTextNode("Local Storage: is Avaiable ");
          local_storage.appendChild(local_storage_content);
      } else {
            let local_storage = document.getElementById('local-storage');
            let local_storage_content = document.createTextNode("Local Storage: is NOT Avaiable");
            local_storage.appendChild(local_storage_content);
      }
    });
  }
  
  //get active tab to run an callback function.
  //it sends to our callback an array of tab objects
  function getActiveTab() {
    return browser.tabs.query({currentWindow: true, active: true});
  }
  getActiveTab().then(showCookiesForTab);



    