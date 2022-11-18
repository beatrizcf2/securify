browser.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.method === "localStorage") {
    sendResponse({
      data: Object.entries(localStorage),
    });
  }
});