document.addEventListener("DOMContentLoaded", () => {

  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  const status = document.getElementById("status");
  const closeBtn = document.getElementById("closeBtn");
  const timerDisplay = document.getElementById("timerDisplay");

  let remainingSeconds = 5;
  let timer = null;
  let completed = false;
  let adOpened = false;

  closeBtn.style.display = "none";
  status.textContent = "Opening ad...";

  // 🔥 STEP 1: FORCE POP AD
  setTimeout(() => {
    document.body.click(); // triggers monetag pop
    adOpened = true;
  }, 1000);

  // 🔥 STEP 2: WAIT UNTIL USER RETURNS
  window.addEventListener("focus", () => {
    if (adOpened && !timer && !completed) {
      startTimer();
    }
  });

  // 🔥 TIMER FUNCTION
  function startTimer() {
    status.textContent = "Please wait 5 seconds...";

    timer = setInterval(() => {

      remainingSeconds--;
      timerDisplay.textContent = remainingSeconds + "s";

      if (remainingSeconds <= 0) {
        completeAd();
      }

    }, 1000);
  }

  function stopTimer() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  // 🔥 PAUSE IF USER LEAVES TAB
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopTimer();
    } else {
      if (!completed && adOpened) {
        startTimer();
      }
    }
  });

  function completeAd() {
    completed = true;
    stopTimer();

    status.textContent = "Ad completed. You may close this page.";
    timerDisplay.textContent = "✔";

    closeBtn.style.display = "block";

    window.postMessage({
      source: "stacktabs-ad",
      action: "REWARDED_AD_COMPLETE",
      token: token
    }, "*");
  }

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
