import { removeBackground } from "@imgly/background-removal";

self.onmessage = async (event) => {
  const { imageData } = event.data;

  try {
    const blob = new Blob([imageData], { type: "image/png" });
    const resultBlob = await removeBackground(blob);
    self.postMessage({ success: true, blob: resultBlob });
  } catch (error) {
    if (error instanceof Error) {
      self.postMessage({ success: false, error: error.message });
    } else {
      self.postMessage({ success: false, error: String(error) });
    }
  }
};
