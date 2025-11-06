// main.js

import { getLocation, getMediaStream, stopMediaStream, capturePhoto } from './mediaCapture.js';

// --- Ambil elemen-elemen DOM ---
const getLocationBtn = document.getElementById('getLocationBtn');
const startVideoBtn = document.getElementById('startVideoBtn');
const startAudioBtn = document.getElementById('startAudioBtn');
const capturePhotoBtn = document.getElementById('capturePhotoBtn');
const stopAllBtn = document.getElementById('stopAllBtn');

const locationResult = document.getElementById('locationResult');
const videoElement = document.getElementById('videoElement');
const canvasElement = document.getElementById('canvasElement');
const photoResult = document.getElementById('photoResult');
const audioStatus = document.getElementById('audioStatus');

// --- Variabel untuk menyimpan stream ---
let currentVideoStream = null;
let currentAudioStream = null;

// --- Event Listeners ---

// 1. Dapatkan Lokasi
getLocationBtn.addEventListener('click', async () => {
  locationResult.textContent = 'Mengambil lokasi...';
  try {
    const position = await getLocation();
    locationResult.innerHTML = `
      <h4>Lokasi Ditemukan:</h4>
      <pre>
        Latitude: ${position.coords.latitude}
        Longitude: ${position.coords.longitude}
        Akurasi: ${position.coords.accuracy} meter
      </pre>
    `;
  } catch (error) {
    locationResult.textContent = `Error: ${error.message}`;
  }
});

// 2. Mulai Kamera (Video)
startVideoBtn.addEventListener('click', async () => {
  // Hentikan stream yang ada sebelumnya
  if (currentVideoStream) {
    stopMediaStream(currentVideoStream);
  }
  try {
    currentVideoStream = await getMediaStream({ video: true });
    videoElement.srcObject = currentVideoStream;
    videoElement.style.display = 'block';
  } catch (error) {
    console.error("Tidak dapat mengakses kamera:", error);
    alert("Tidak dapat mengakses kamera. Pastikan Anda memberikan izin.");
  }
});

// 3. Mulai Mikrofon (Audio)
startAudioBtn.addEventListener('click', async () => {
  if (currentAudioStream) {
    stopMediaStream(currentAudioStream);
  }
  try {
    currentAudioStream = await getMediaStream({ audio: true });
    audioStatus.textContent = 'Mikrofon aktif. Periksa konsol untuk detail stream.';
    console.log('Stream audio aktif:', currentAudioStream);
    // Untuk demo, kita tidak memutar audio kembali ke speaker
    // karena bisa menyebabkan feedback (dengung).
  } catch (error) {
    console.error("Tidak dapat mengakses mikrofon:", error);
    alert("Tidak dapat mengakses mikrofon. Pastikan Anda memberikan izin.");
  }
});

// 4. Ambil Foto dari Video
capturePhotoBtn.addEventListener('click', () => {
  if (!currentVideoStream) {
    alert('Harap mulai kamera terlebih dahulu!');
    return;
  }
  
  const dataUrl = capturePhoto(videoElement, canvasElement);
  
  photoResult.innerHTML = '<h4>Foto Diambil:</h4>';
  const img = document.createElement('img');
  img.src = dataUrl;
  photoResult.appendChild(img);
});

// 5. Hentikan Semua Media
stopAllBtn.addEventListener('click', () => {
  stopMediaStream(currentVideoStream);
  stopMediaStream(currentAudioStream);
  
  videoElement.srcObject = null;
  videoElement.style.display = 'none';
  
  currentVideoStream = null;
  currentAudioStream = null;
  
  audioStatus.textContent = 'Semua media telah dihentikan.';
  photoResult.innerHTML = '';
});