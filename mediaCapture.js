// mediaCapture.js

/**
 * Mendapatkan lokasi geografis pengguna saat ini.
 * @returns {Promise<GeolocationPosition>} Sebuah Promise yang resolves dengan objek posisi.
 */
export const getLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation tidak didukung oleh browser Anda.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

/**
 * Mengakses stream video (kamera) dan/atau audio (mikrofon).
 * @param {MediaStreamConstraints} constraints - Objek constraint untuk media.
 * @returns {Promise<MediaStream>} Sebuah Promise yang resolves dengan objek MediaStream.
 */
export const getMediaStream = (constraints) => {
  // Pastikan navigator.mediaDevices ada
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return Promise.reject(new Error('getUserMedia() tidak didukung.'));
  }
  
  return navigator.mediaDevices.getUserMedia(constraints);
};

/**
 * Fungsi pembantu untuk menghentikan semua track dalam sebuah MediaStream.
 * Ini penting untuk mematikan kamera/mikrofon (indikator lampu akan mati).
 * @param {MediaStream} stream - MediaStream yang akan dihentikan.
 */
export const stopMediaStream = (stream) => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
};

/**
 * Menangkap sebuah frame (foto) dari stream video yang sedang aktif.
 * @param {HTMLVideoElement} videoElement - Elemen video yang menampilkan stream.
 * @param {HTMLCanvasElement} canvasElement - Elemen canvas untuk menggambar foto.
 * @returns {string} - Foto dalam format Data URL (base64).
 */
export const capturePhoto = (videoElement, canvasElement) => {
  const context = canvasElement.getContext('2d');
  
  // Set ukuran canvas sama dengan ukuran video
  canvasElement.width = videoElement.videoWidth;
  canvasElement.height = videoElement.videoHeight;
  
  // Gambar frame saat ini dari video ke canvas
  context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
  
  // Kembalikan gambar dalam format Data URL
  return canvasElement.toDataURL('image/png');
};