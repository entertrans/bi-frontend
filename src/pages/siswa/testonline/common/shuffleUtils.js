// Fungsi untuk mengacak array (Fisher-Yates algorithm)
export const shuffleArray = (array) => {
  if (!array || !Array.isArray(array)) return [];
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const mapJawabanBS = (soal, shuffledIndex, jawaban) => {
  const originalIndex = soal.shuffledToOriginalMap[shuffledIndex];
  return { index: originalIndex, jawaban };
};

export const mapJawabanMatching = (soal, leftShuffledIdx, rightShuffledIdx) => {
  const leftIndex = soal.shuffledToOriginalMap.left[leftShuffledIdx];
  const rightIndex = soal.shuffledToOriginalMap.right[rightShuffledIdx];
  return { leftIndex, rightIndex };
};

// Fungsi untuk mengacak pilihan jawaban tetapi menjaga integritas jawaban
export const processSoalWithShuffle = (soalData) => {
  if (!soalData || !Array.isArray(soalData)) return [];

  return soalData.map((soal) => {
    let shuffledPilihan = null;
    let originalToShuffledMap = null;
    let shuffledToOriginalMap = null;

    // Acak untuk PG, PG Kompleks, Matching, dan Benar/Salah
    if (
      soal.tipe_soal === "pg" ||
      soal.tipe_soal === "pg_kompleks" ||
      soal.tipe_soal === "matching" ||
      soal.tipe_soal === "bs"
    ) {
      try {
        const pilihan = JSON.parse(soal.pilihan_jawaban);
        if (Array.isArray(pilihan) && pilihan.length > 0) {
          // Inisialisasi mapping
          originalToShuffledMap = {};
          shuffledToOriginalMap = {};

          // Untuk Benar/Salah, kita perlu mengacak tapi menjaga mapping jawaban
          // Pastikan bagian ini benar untuk tipe "bs"
          if (soal.tipe_soal === "bs") {
            const itemsWithIndex = pilihan.map((item, index) => ({
              ...item,
              originalIndex: index,
            }));

            const shuffledItems = shuffleArray(itemsWithIndex);
            shuffledPilihan = shuffledItems.map((item) => {
              const { originalIndex, ...rest } = item;
              return rest;
            });

            // Buat mapping yang benar
            shuffledItems.forEach((item, shuffledIndex) => {
              originalToShuffledMap[item.originalIndex] = shuffledIndex;
              shuffledToOriginalMap[shuffledIndex] = item.originalIndex;
            });
          }
          // Untuk Matching - acak kedua kolom secara independen
          else if (soal.tipe_soal === "matching") {
            // Acak sisi kiri (beserta lampirannya)
            const leftItems = pilihan.map((pair) => ({
              left: pair.left,
              leftLampiran: pair.leftLampiran,
            }));
            const shuffledLeft = shuffleArray(leftItems);

            // Acak sisi kanan (beserta lampirannya) secara independen
            const rightItems = pilihan.map((pair) => ({
              right: pair.right,
              rightLampiran: pair.rightLampiran,
            }));
            const shuffledRight = shuffleArray(rightItems);

            // Gabungkan menjadi pasangan yang diacak
            shuffledPilihan = shuffledLeft.map((leftItem, index) => ({
              left: leftItem.left,
              leftLampiran: leftItem.leftLampiran,
              right: shuffledRight[index].right,
              rightLampiran: shuffledRight[index].rightLampiran,
            }));

            // Untuk matching, kita tidak perlu mapping index karena jawaban disimpan berdasarkan teks left
            // Tetapi kita tetap buat mapping kosong untuk konsistensi
            originalToShuffledMap = { left: {}, right: {} };
            shuffledToOriginalMap = { left: {}, right: {} };

            pilihan.forEach((pair, originalIndex) => {
              const shuffledLeftIndex = shuffledLeft.findIndex(
                (item) => item.left === pair.left
              );
              if (shuffledLeftIndex !== -1) {
                originalToShuffledMap.left[originalIndex] = shuffledLeftIndex;
                shuffledToOriginalMap.left[shuffledLeftIndex] = originalIndex;
              }

              const shuffledRightIndex = shuffledRight.findIndex(
                (item) => item.right === pair.right
              );
              if (shuffledRightIndex !== -1) {
                originalToShuffledMap.right[originalIndex] = shuffledRightIndex;
                shuffledToOriginalMap.right[shuffledRightIndex] = originalIndex;
              }
            });
          }
          // Untuk PG dan PG Kompleks
          else {
            shuffledPilihan = shuffleArray(pilihan);

            // Buat mapping
            pilihan.forEach((item, originalIndex) => {
              const shuffledIndex = shuffledPilihan.findIndex(
                (x) => x === item
              );
              if (shuffledIndex !== -1) {
                originalToShuffledMap[originalIndex] = shuffledIndex;
                shuffledToOriginalMap[shuffledIndex] = originalIndex;
              }
            });
          }
        }
      } catch (error) {
        console.error("Error parsing pilihan jawaban:", error);
        shuffledPilihan = JSON.parse(soal.pilihan_jawaban);
      }
    }

    return {
      ...soal,
      shuffledPilihan,
      originalToShuffledMap,
      shuffledToOriginalMap,
    };
  });
};

// Fungsi untuk mendapatkan nilai asli dari jawaban yang diacak
export const getOriginalAnswerValue = (soal, shuffledIndex, shuffledValue) => {
  if (!soal || !soal.shuffledToOriginalMap) return shuffledValue;

  try {
    const pilihanAsli = JSON.parse(soal.pilihan_jawaban);
    if (Array.isArray(pilihanAsli)) {
      const originalIndex = soal.shuffledToOriginalMap[shuffledIndex];
      return pilihanAsli[originalIndex] || shuffledValue;
    }
  } catch (error) {
    console.error("Error getting original answer value:", error);
  }

  return shuffledValue;
};

// Fungsi untuk mendapatkan index asli dari index yang diacak
// Di shuffleUtils.js - perbaiki getOriginalIndex
export const getOriginalIndex = (soal, shuffledIndex) => {
  if (!soal || !soal.shuffledToOriginalMap) return shuffledIndex;

  // Untuk tipe "bs", shuffledToOriginalMap adalah object biasa
  // Pastikan kita mengakses property dengan benar
  return soal.shuffledToOriginalMap[shuffledIndex] ?? shuffledIndex;
};

// Fungsi untuk memeriksa apakah soal perlu diacak
export const shouldShuffleSoal = (tipeSoal) => {
  return ["pg", "pg_kompleks", "matching", "bs"].includes(tipeSoal);
};
