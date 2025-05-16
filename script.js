
function generateQR() {
  const url = document.getElementById("url").value;
  const werkpost = document.getElementById("werkpost").value;
  if (!url || !werkpost) return;

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
    logo.src = "VDM graan.png";
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

      const result = document.getElementById("result");
      result.innerHTML = "";

      const img = document.createElement("img");
      img.src = finalCanvas.toDataURL("image/png");
      result.appendChild(img);

      const link = document.createElement("a");
      link.href = img.src;
      link.download = `QR_${werkpost.replace(/\s+/g, "_")}.png`;
      link.textContent = "Download QR-code";
      result.appendChild(link);
    };
  });
}
