export async function exportSlideAsPNG(slideIndex, filename = 'slide') {
  const { default: html2canvas } = await import('html2canvas');

  const el = document.getElementById(`slide-${slideIndex}`);
  if (!el) throw new Error('Slide element not found');

  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null
  });

  const link = document.createElement('a');
  link.download = `${filename}-${slideIndex + 1}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export async function exportAllSlidesAsZip(slides, topic) {
  const { default: html2canvas } = await import('html2canvas');
  const { default: JSZip } = await import('jszip');

  const zip = new JSZip();
  const folder = zip.folder('cuemath-carousel');

  for (let i = 0; i < slides.length; i++) {
    const el = document.getElementById(`slide-${i}`);
    if (!el) continue;

    const canvas = await html2canvas(el, {
      scale: 2, useCORS: true, allowTaint: true, backgroundColor: null
    });

    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    folder.file(`slide-${i + 1}.png`, blob);
  }

  const content = await zip.generateAsync({ type: 'blob' });
  const link = document.createElement('a');
  link.download = `cuemath-carousel-${Date.now()}.zip`;
  link.href = URL.createObjectURL(content);
  link.click();
}
