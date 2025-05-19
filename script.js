
function isValidUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch (e) {
    return false;
  }
}

function generateQR(urlOverride = null, werkpostOverride = null, appendTo = null) {
  const url = urlOverride || document.getElementById("url").value;
  const werkpost = werkpostOverride || document.getElementById("werkpost").value;
  if (!isValidUrl(url)) {
    alert("Ongeldige URL. Zorg dat deze begint met http:// of https://");
    return;
  }
  if (!werkpost) {
    alert("Vul een werkpost in.");
    return;
  }

  const canvas = document.createElement("canvas");
  QRCode.toCanvas(canvas, url, {
    errorCorrectionLevel: "H",
    margin: 1,
    width: 600,
    color: { dark: "#000000", light: "#ffffff" },
  }).then(() => {
    const ctx = canvas.getContext("2d");
    const size = canvas.width;
    const logo = new Image();
    logo.src = "logo2.png";
    logo.onload = () => {
      const logoSize = size * 0.3;
      ctx.drawImage(logo, (size - logoSize) / 2, (size - logoSize) / 2, logoSize, logoSize);

      const padding = 100;
      const finalCanvas = document.createElement("canvas");
      finalCanvas.width = size;
      finalCanvas.height = size + padding * 2;
      const finalCtx = finalCanvas.getContext("2d");
      finalCtx.fillStyle = "white";
      finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
      finalCtx.fillStyle = "black";
      finalCtx.font = "bold 36px sans-serif";
      finalCtx.textAlign = "center";
      finalCtx.fillText("Scan mij", size / 2, 50);
      finalCtx.drawImage(canvas, 0, padding);
      finalCtx.fillText(werkpost, size / 2, size + padding + 40);

      const result = appendTo || document.getElementById("result");
      const img = document.createElement("img");
      img.src = finalCanvas.toDataURL("image/png");
      result.innerHTML = "";
      result.appendChild(img);

      const download = document.createElement("a");
      download.href = img.src;
      download.download = `QR_${werkpost.replace(/\s+/g, "_")}.png`;
      download.textContent = "Download QR-code";
      result.appendChild(download);

      const printBtn = document.createElement("button");
      printBtn.textContent = "Print QR";
      printBtn.onclick = () => {
        const w = window.open();
        w.document.write(`<img src='${img.src}' style='width:100%;'><br><strong>${werkpost}</strong>`);
        w.print();
      };
      result.appendChild(printBtn);
    };
  });
}

function handleCSV() {
  const fileInput = document.getElementById("csvfile");
  const file = fileInput.files[0];
  if (!file) {
    alert("Selecteer een CSV-bestand.");
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    const lines = e.target.result.split(/\r?\n/).filter(line => line.trim());
    lines.shift(); // header weg
    lines.forEach(line => {
      const [url, werkpost] = line.split(/;|,/);
      if (url && werkpost) {
        const container = document.createElement("div");
        document.body.appendChild(container);
        generateQR(url.trim(), werkpost.trim(), container);
      }
    });
  };
  reader.readAsText(file);
}
