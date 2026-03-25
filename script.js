// ===============================
// STACKTABS REWARDED AD SCRIPT
// ===============================

document.addEventListener("DOMContentLoaded", () => {

  // ===== EXTENSION ID =====
  const EXTENSION_ID = "odajcbggmlnpoejgaljeabfkfgppidia";

  // ===== READ TOKEN =====
  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  if (!token) {
    console.error("Missing ad token");
  }

  // ===== DOM =====
  const status = document.getElementById("status");
  const closeBtn = document.getElementById("closeBtn");
  const timerDisplay = document.getElementById("timerDisplay");

  // ===== STATE =====
  let remainingSeconds = 5;
  let timer = null;
  let completed = false;

  if (closeBtn) closeBtn.style.display = "none";
  status.textContent = "Please wait 5 seconds...";

  // ===============================
  // TIMER CONTROL
  // ===============================
  function startTimer() {
    if (timer || completed) return;

    timer = setInterval(() => {
      remainingSeconds--;

      status.textContent = `Please watch ${remainingSeconds}s`;
      if (timerDisplay) timerDisplay.textContent = `${remainingSeconds}s`;

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

  // ===============================
  // COMPLETE AD
  // ===============================
  function completeAd() {
    if (completed) return;

    completed = true;
    stopTimer();

    status.textContent = "Ad completed. You may close this page.";
    status.classList.add("completed");

    if (timerDisplay) timerDisplay.textContent = "✔";

    if (closeBtn) closeBtn.style.display = "block";

    window.postMessage({
      source: "stacktabs-ad",
      action: "REWARDED_AD_COMPLETE",
      token: token
    }, "*");
  }

  // Detect user returning from ad (focus-based, more reliable)
  let hasStarted = false;
  
  window.addEventListener("focus", () => {
    if (!hasStarted && !completed) {
      hasStarted = true;
      startTimer();
    }
  });
  // Fallback: start timer after 8 seconds max
  setTimeout(() => {
    if (!hasStarted && !completed) {
      hasStarted = true;
      startTimer();
    }
  }, 8000);
  // ===============================
  // CLOSE BUTTON
  // ===============================
  closeBtn.onclick = () => {

    // notify extension FIRST (CRITICAL)
    if (window.opener) {
      window.opener.postMessage({
        source: "stacktabs-ad",
        action: "AD_CLOSED"
      }, "*");
    }
  
    // try to close
    window.close();
  
    // fallback (if browser blocks close)
    setTimeout(() => {
      window.location.href = "about:blank";
    }, 200);
  
  };

});
