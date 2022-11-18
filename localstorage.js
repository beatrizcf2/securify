const getLocalStorage = async (tabs) => {
  let tab = tabs.pop();

  const response = await browser.tabs.sendMessage(tab.id, {
    method: "localStorage",
  });
  const localStorageLength = response.data.length;
  document.getElementById("storage-count").textContent = localStorageLength;
  storageList = document.getElementById("local-storage-list");
  for (let i = 0; i < localStorageLength; i++) {
    let li = document.createElement("li");
    let content = document.createTextNode(
      response.data[i][0]
    );
    li.appendChild(content);
    storageList.appendChild(li);
  }

};

function getActiveTab() {
  return browser.tabs.query({
    currentWindow: true,
    active: true,
  });
}

getActiveTab().then(getLocalStorage);