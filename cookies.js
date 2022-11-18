String.prototype.isDomain = function (domain) {
    var pat =
      "^https?://(?:[^/@:]*:[^/@]*@)?(?:[^/:]+.)?" + domain + "(?=[/:]|$)";
    var re = new RegExp(pat, "i");
    return re.test(this);
  };
  

function showCookiesForTab(tabs) {
    //get the first tab object in the array
    let tab = tabs.pop();
    let currentUrl = new URL(tab.url);  
  
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
              "SESSION: " + cookie.name + ": " + cookie.domain 
            );
            li.appendChild(content);
          } else if (!cookie.session) {
            let content = document.createTextNode(
              "NAVIGATION: " + cookie.name + ": " + cookie.domain 
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
  
    });
  
  }

  //get active tab to run an callback function.
  //it sends to our callback an array of tab objects
  function getActiveTab() {
    return browser.tabs.query({ currentWindow: true, active: true });
  }
  
  getActiveTab().then(showCookiesForTab);