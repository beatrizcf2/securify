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
  async function gettingThirdURLs(tabs) {
    let tab = tabs.pop();
    let sourceUrl = new URL(tab.url);

    let html = await FetchHtml(sourceUrl).then((text) => {
      return text;
    }); // Get html from the promise
    let p_count = (html.match("politica")|| []).length;
    

    if ((html.includes("policy")||html.includes("politica")|| html.includes("privacy")||html.includes("privacidad")) && p_count < 3 ) {
      // set src of image
        document.getElementById("privacy-policy-img").src = "icons/check.png";
        document.getElementById("has-policy").textContent = "This website has a privacy policy";
    } else {
      document.getElementById("privacy-policy-img").src = "icons/cancel.png";
        document.getElementById("has-policy").textContent = "No privacy policy found for this website";
    }
    
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
  
  }

  

  //get active tab to run an callback function.
  //it sends to our callback an array of tab objects
  function getActiveTab() {
    return browser.tabs.query({ currentWindow: true, active: true });
  }
  
  getActiveTab().then(gettingThirdURLs);
  
  //close the popup when the close button is clicked
  document.getElementById("close").addEventListener("click", () => {
      window.close();
  });
 
  
  