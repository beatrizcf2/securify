browser.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.method === "localStorage") {
    sendResponse({
      data: Object.entries(localStorage),
    });
  }
});

function calculateScore(tabs){
  let first_count = parseInt(document.getElementById("first-count").textContent);
  let third_count = parseInt(document.getElementById("third-count").textContent);
  let storage_count = parseInt(document.getElementById("storage-count").textContent);
  let hasPrivacyPolicy = 0;
  if (document.getElementById("has-policy").textContent == "This website has a privacy policy") {
    hasPrivacyPolicy = 0;
  } else {
    hasPrivacyPolicy = 1;
  }
  
  let tab = tabs.pop();
  let sourceUrl = new URL(tab.url);
  isSecure = 0;
  if (sourceUrl.protocol === "https:") {
    isSecure = 1;
  }

  
  let score = 0;
  score = (first_count*0.2 + third_count*0.4 + storage_count*0.5 + 1*hasPrivacyPolicy)*isSecure;

  let rating = ""
  let message = ""
  if (score > 7) {
    rating = "D"
    message = "This website is not secure. It has a lot of third party cookies and local storage."
  } else if (score > 5) {
    rating = "C"
    message = "This website isn't completly insecure. It has a considerable number of third party cookies and local storage."
  } else if (score > 3) {
    rating = "B"
    message = "This website isn't very secure. It has some third party cookies and local storage."
  } else if (score < 3 && score > 0 && isSecure == 1) {
    rating = "A"
    message = "This website is secure."
  } else if (score == 0) {
    rating = "I"
    message = "This website is not secure. It is not using HTTPS."
  } else{
    rating = ""
  }
  

  
  document.getElementById("privacy-score").textContent = rating;
  document.getElementById("privacy-score-message").textContent = message;
  
}

function getActiveTab() {
  return browser.tabs.query({ currentWindow: true, active: true });
}

setTimeout(() => {
  getActiveTab().then(calculateScore);
}, 100);

