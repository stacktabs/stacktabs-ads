document.addEventListener("DOMContentLoaded", () => {

  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  if (!token) {
    console.warn("No token (dev mode)");
  }

  const status = document.getElementById("status");
  const closeBtn = document.getElementById("closeBtn");
  const timerDisplay = document.getElementById("timerDisplay");

  let remainingSeconds = 5;
  let timer = null;
  let completed = false;

  closeBtn.style.display = "none";
  status.textContent = "Please wait 5 seconds...";

  function startTimer() {
    if (timer || completed) return;

    timer = setInterval(() => {
      remainingSeconds--;

      status.textContent = `Please watch ${remainingSeconds}s`;
      timerDisplay.textContent = `${remainingSeconds}s`;

      if (remainingSeconds <= 0) {
        completeAd();
      }
    }, 1000);
  }
  
  function completeAd() {
    if (completed) return;

    completed = true;
    clearInterval(timer);

    status.textContent = "Ad completed. You may close this page.";
    status.classList.add("completed");
    timerDisplay.textContent = "✔";

    closeBtn.style.display = "block";

    window.postMessage({
      source: "stacktabs-ad",
      action: "REWARDED_AD_COMPLETE",
      token: token
    }, "*");
  }

  // 🔥 START TIMER ONLY AFTER VIDEO
  window.addEventListener("message", (event) => {
    if (event.data?.type === "VIDEO_DONE") {
      startTimer();
    }
  });

  closeBtn.onclick = () => {
    if (window.opener) {
      window.opener.postMessage({
        source: "stacktabs-ad",
        action: "AD_CLOSED"
      }, "*");
    }

    window.close();

    setTimeout(() => {
      window.location.href = "about:blank";
    }, 200);
  };

});
