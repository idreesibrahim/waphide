// WAPHIDE Engine - IDREESIB
let settings = {
  enabled: true,
  blurAvatars: true,
  blurPreviews: true,
  blurMessages: true,
  blurMedia: true,
  unlockedChats: []
};

// Load saved settings
chrome.storage.sync.get(settings, (data) => {
  settings = data;
  applyPrivacySettings();
});

// Sync updates from storage or background shortcut
chrome.storage.onChanged.addListener((changes) => {
  for (let key in changes) {
    settings[key] = changes[key].newValue;
  }
  applyPrivacySettings();
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "toggleState") {
    settings.enabled = request.enabled;
    applyPrivacySettings();
  }
});

function applyPrivacySettings() {
  const root = document.documentElement;
  
  if (!settings.enabled) {
    root.classList.remove("waphide-active", "waphide-blur-avatars", "waphide-blur-previews", "waphide-blur-messages", "waphide-blur-media");
    return;
  }

  root.classList.add("waphide-active");
  root.classList.toggle("waphide-blur-avatars", settings.blurAvatars);
  root.classList.toggle("waphide-blur-previews", settings.blurPreviews);
  root.classList.toggle("waphide-blur-messages", settings.blurMessages);
  root.classList.toggle("waphide-blur-media", settings.blurMedia);

  injectChatToggleButtons();
}

// Observe DOM updates for newly rendered chats
const observer = new MutationObserver(() => {
  if (settings.enabled) {
    injectChatToggleButtons();
  }
});

observer.observe(document.body, { childList: true, subtree: true });

function injectChatToggleButtons() {
  const chatRows = document.querySelectorAll('div[role="row"]');
  chatRows.forEach((row) => {
    const titleEl = row.querySelector('span[title]');
    if (!titleEl) return;

    const chatName = titleEl.getAttribute('title');
    if (!chatName || row.querySelector('.waphide-eye-btn')) return;

    const btn = document.createElement('span');
    btn.className = 'waphide-eye-btn';
    const isUnlocked = settings.unlockedChats.includes(chatName);
    btn.innerHTML = isUnlocked ? '👁️' : '🔒';
    btn.title = isUnlocked ? 'WAPHIDE: Hidden (Click to blur)' : 'WAPHIDE: Click to show chat';

    if (isUnlocked) {
      row.setAttribute('data-waphide-unlocked', 'true');
    }

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      let updatedUnlocked = [...settings.unlockedChats];
      
      if (updatedUnlocked.includes(chatName)) {
        updatedUnlocked = updatedUnlocked.filter(id => id !== chatName);
        row.removeAttribute('data-waphide-unlocked');
      } else {
        updatedUnlocked.push(chatName);
        row.setAttribute('data-waphide-unlocked', 'true');
      }

      settings.unlockedChats = updatedUnlocked;
      chrome.storage.sync.set({ unlockedChats: updatedUnlocked });
      applyPrivacySettings();
    });

    titleEl.parentNode.appendChild(btn);
  });
}
