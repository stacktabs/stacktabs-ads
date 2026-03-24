// ===============================
// STACKTABS REWARDED AD SCRIPT
// ===============================
// ===============================
// ADSTERRA POPUNDER (REWARDED)
// ===============================

window.addEventListener("load", () => {

  // delay improves CPM + avoids instant trigger
  setTimeout(() => {

    const s = document.createElement("script");
    s.src = "https://pl28972613.profitablecpmratenetwork.com/98/1b/0e/981b0e6a4364d3bdd66e35a5267c32be.js";
    s.async = true;

    document.body.appendChild(s);

  }, 1500);

});
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

// ===== STATE =====
let remainingSeconds = 30;
let timer = null;
let completed = false;

// hide close button initially
closeBtn.style.display = "none";
status.textContent = "Watch 30 seconds to unlock";

// ===============================
// TIMER CONTROL
// ===============================
function startTimer() {
  if (timer || completed) return;

  timer = setInterval(() => {
    remainingSeconds--;

    status.textContent = `Please watch ${remainingSeconds}s`;

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
  closeBtn.style.display = "block";

  // Broadcast to ALL extension pages
  window.postMessage({
    source: "stacktabs-ad",
    action: "REWARDED_AD_COMPLETE",
    token: token
  }, "*");
}


// ===============================
// VISIBILITY HANDLING
// ===============================
// Pause timer when user switches tabs / minimizes / changes window
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopTimer();
  } else {
    startTimer();
  }
});

// ===============================
// START INITIAL TIMER
// ===============================
startTimer();

// ===============================
// CLOSE BUTTON
// ===============================
closeBtn.onclick = () => {
  if (window.opener) {
    window.opener.postMessage({
      source: "stacktabs-ad",
      action: "AD_CLOSED"
    }, "*");
  }
  window.close();


  setTimeout(() => window.close(), 300);
};
