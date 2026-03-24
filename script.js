// ===============================
// STACKTABS REWARDED AD SCRIPT
// ===============================

// ===============================
// ADSTERRA POPUNDER (REWARDED)
// ===============================
window.addEventListener("load", () => {
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

// NEW UI ELEMENTS (make sure these exist in HTML)
const timerText = document.getElementById("timerText");
const progress = document.getElementById("progress");

// ===== STATE =====
let total = 30;
let remainingSeconds = total;
let timer = null;
let completed = false;

// INITIAL UI
closeBtn.classList.add("hidden");
status.textContent = "Watch the ad to unlock";

// ===============================
// TIMER CONTROL
// ===============================
function startTimer() {
  if (timer || completed) return;

  timer = setInterval(() => {
    remainingSeconds--;

    // update countdown
    if (timerText) {
      timerText.textContent = remainingSeconds;
    }

    // update progress bar
    if (progress) {
      progress.style.width =
        ((total - remainingSeconds) / total) * 100 + "%";
    }

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

  status.textContent = "✅ Ad completed! You can now close.";

  // update timer UI
  if (timerText) {
    timerText.textContent = "✔";
  }

  // show close button with animation
  closeBtn.classList.remove("hidden");
  closeBtn.classList.add("show");

  // notify extension
  window.postMessage(
    {
      source: "stacktabs-ad",
      action: "REWARDED_AD_COMPLETE",
      token: token
    },
    "*"
  );
}

// ===============================
// VISIBILITY HANDLING
// ===============================
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopTimer();
  } else {
    startTimer();
  }
});

// ===============================
// START TIMER
// ===============================
startTimer();

// ===============================
// CLOSE BUTTON
// ===============================
closeBtn.onclick = () => {
  if (window.opener) {
    window.opener.postMessage(
      {
        source: "stacktabs-ad",
        action: "AD_CLOSED"
      },
      "*"
    );
  }

  window.close();

  setTimeout(() => window.close(), 300);
};
