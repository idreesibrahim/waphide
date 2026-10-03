document.addEventListener("DOMContentLoaded", () => {
  const masterToggle = document.getElementById("masterToggle");
  const blurAvatars = document.getElementById("blurAvatars");
  const blurPreviews = document.getElementById("blurPreviews");
  const blurMessages = document.getElementById("blurMessages");
  const blurMedia = document.getElementById("blurMedia");

  // Load saved toggles
  chrome.storage.sync.get({
    enabled: true,
    blurAvatars: true,
    blurPreviews: true,
    blurMessages: true,
    blurMedia: true
  }, (data) => {
    masterToggle.checked = data.enabled;
    blurAvatars.checked = data.blurAvatars;
    blurPreviews.checked = data.blurPreviews;
    blurMessages.checked = data.blurMessages;
    blurMedia.checked = data.blurMedia;
  });

  // Save changes
  const saveOptions = () => {
    chrome.storage.sync.set({
      enabled: masterToggle.checked,
      blurAvatars: blurAvatars.checked,
      blurPreviews: blurPreviews.checked,
      blurMessages: blurMessages.checked,
      blurMedia: blurMedia.checked
    });
  };

  [masterToggle, blurAvatars, blurPreviews, blurMessages, blurMedia].forEach((el) => {
    el.addEventListener("change", saveOptions);
  });
});
