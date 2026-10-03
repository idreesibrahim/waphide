chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-waphide") {
    chrome.storage.sync.get({ enabled: true }, (data) => {
      const newState = !data.enabled;
      chrome.storage.sync.set({ enabled: newState }, () => {
        chrome.tabs.query({ url: "https://web.whatsapp.com/*" }, (tabs) => {
          tabs.forEach((tab) => {
            chrome.tabs.sendMessage(tab.id, { action: "toggleState", enabled: newState });
          });
        });
      });
    });
  }
});
