// // Update nilai slider secara realtime
// document.addEventListener("DOMContentLoaded", () => {
//     const sliders = document.querySelectorAll(".slider-input");

//     sliders.forEach(slider => {
//         slider.addEventListener("input", function () {
//             const labelId = this.dataset.label;
//             const labelElement = document.getElementById(labelId);
//             if (labelElement) {
//                 labelElement.innerText = this.value;
//             }
//         });
//     });
// });
// document.addEventListener("DOMContentLoaded", function () {

//     const sliders = document.querySelectorAll(".slider-input");

//     sliders.forEach(slider => {
//         let labelId = slider.dataset.label;
//         let inputNumber = document.getElementById(labelId);

//         // Slider → Number
//         slider.addEventListener("input", function () {
//             inputNumber.value = slider.value;
//         });

//         // Number → Slider
//         inputNumber.addEventListener("input", function () {
//             let val = Number(inputNumber.value);

//             if (val < 0) val = 0;
//             if (val > 100) val = 100;

//             inputNumber.value = val;
//             slider.value = val;
//         });
//     });

// });

document.addEventListener("DOMContentLoaded", function () {

    const jenis = document.getElementById("jenisBatik");
    const demandSlider = document.getElementById("demandSlider");
    const demandValue = document.getElementById("demandValue");
    const invSlider = document.getElementById("inventorySlider");
    const invValue = document.getElementById("inventoryValue");

    const ketDemand = document.getElementById("ketDemand");
    const ketInv = document.getElementById("ketInventory");

    // pastikan input number bisa menampung 3 digit (tidak terpotong)
    demandValue.style.width = "72px"; // cukup untuk 3 digit + spinner
    invValue.style.width = "72px";

    // disable native browser validation message while still keeping attributes correct
    demandValue.setAttribute("aria-live", "polite");
    invValue.setAttribute("aria-live", "polite");

    // TEMPAT UNTUK MENARUH OUTPUT
    const outputContainer = document.createElement("div");
    outputContainer.id = "hasilPrediksi";
    outputContainer.className = "mt-10";
    outputContainer.style.display = "none"; // mulai disembunyikan

    document.querySelector(".rounded-3xl").appendChild(outputContainer);

    const form = document.querySelector("form");

    // === RANGE TIAP BATIK ===
    const settings = {
        tulis: { demand: [10, 50], inv: [9, 100], output: "10–52" },
        cantingcap: { demand: [10, 55], inv: [100, 209], output: "50–100" },
        printing: { demand: [10, 100], inv: [100, 203], output: "80–100" }
    };

    // helper: apply range ke slider dan ke input number (min/max) saat jenis berubah
    function applyRangesFor(type) {
        const set = settings[type];
        demandSlider.min = set.demand[0];
        demandSlider.max = set.demand[1];
        demandSlider.value = set.demand[0];

        demandValue.min = set.demand[0];
        demandValue.max = set.demand[1];
        demandValue.value = set.demand[0];

        ketDemand.innerHTML = `Keterangan : Batik ${type} ${set.demand[0]}–${set.demand[1]}`;

        invSlider.min = set.inv[0];
        invSlider.max = set.inv[1];
        invSlider.value = set.inv[0];

        invValue.min = set.inv[0];
        invValue.max = set.inv[1];
        invValue.value = set.inv[0];

        ketInv.innerHTML = `Keterangan : Batik ${type} ${set.inv[0]}–${set.inv[1]}`;
    }

    jenis.addEventListener("change", () => {
        if (!jenis.value) return;
        applyRangesFor(jenis.value);
    });

    // jika halaman dimuat dengan pilihan sudah terisi, terapkan range awal
    if (jenis.value) {
        if (settings[jenis.value]) {
            applyRangesFor(jenis.value);
        }
    }
    
    // Sync Slider & Input
    const syncInputs = (slider, input) => {
        slider.addEventListener('input', () => input.value = slider.value);
        input.addEventListener('input', () => {
            let val = Number(input.value);
            const min = Number(slider.min);
            const max = Number(slider.max);
            if (val < min) val = min;
            if (val > max) val = max;
            input.value = val;
            slider.value = val;
        });
    };

    syncInputs(demandSlider, demandValue);
    syncInputs(invSlider, invValue);

    // === KETIKA ANALISIS DIKLIK ===
    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const jenisBatikValue = jenis.value;
        if (!jenisBatikValue) {
            alert("Silakan pilih jenis batik terlebih dahulu!");
            return;
        }

        const demand = Number(demandValue.value);
        const inv = Number(invValue.value);
        const btnAnalisis = document.getElementById("btnAnalisis");

        // Tampilkan loading
        btnAnalisis.disabled = true;
        btnAnalisis.innerText = "MENGANALISIS...";

        try {
            const response = await fetch('/analyze/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                },
                body: JSON.stringify({
                    jenisBatik: jenisBatikValue,
                    demand: demand,
                    inventory: inv
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const prediksi = data.prediction;

            // Fungsi untuk membuat baris tabel dari data langkah perhitungan
            function createTableRows(steps) {
                return steps.map(step => `
                    <tr class="border-b border-gray-200">
                        <td class="py-3 px-4 text-center">${step.rule}</td>
                        <td class="py-3 px-4 text-center">${step.alpha.toFixed(4)}</td>
                        <td class="py-3 px-4 text-center">${step.z.toFixed(2)}</td>
                        <td class="py-3 px-4 text-center">${step.az.toFixed(2)}</td>
                    </tr>
                `).join('');
            }

            // Baris total untuk tabel
            const totalRow = `
                <tr class="font-bold text-white" style="background: linear-gradient(90deg, rgba(200,162,76,0.90), rgba(139,94,60,0.90));">
                    <td class="py-3 px-4 text-center">Total</td>
                    <td class="py-3 px-4 text-center">${data.total_alpha.toFixed(4)}</td>
                    <td class="py-3 px-4"></td>
                    <td class="py-3 px-4 text-center">${data.total_alpha_z.toFixed(2)}</td>
                </tr>
            `;

            // Tampilkan hasil
            outputContainer.style.display = "block";
            outputContainer.innerHTML = `
                <h2 class="text-2xl font-bold text-center text-[#C8A24C]">Hasil Prediksi</h2>
                <h3 class="text-center text-xl font-semibold mt-3">Rekomendasi Produksi Bulan Ini</h3>
                <p class="text-center text-4xl text-green-600 font-bold mt-2">${prediksi} pcs</p>
                <p class="text-center mt-4 text-gray-700">
                    Berdasarkan permintaan <b>${demand} pcs</b> dan stok <b>${inv} lembar</b>,
                    sistem merekomendasikan produksi <b>${prediksi} pcs</b>.
                </p>
                <p class="text-center mt-6 text-gray-600 text-sm px-4">
                    <b>Catatan</b>: Perhitungan ini menggunakan metode Fuzzy Sugeno untuk memberikan rekomendasi.
                    ${data.range_warning ? '<br><b class="text-red-500">Peringatan: Hasil prediksi berada di luar rentang output yang diharapkan.</b>' : ''}
                </p>

                <!-- Tabel Detail Perhitungan -->
                <div class="mt-10">
                    <h4 class="text-xl font-bold text-center text-gray-800 mb-4">Tabel Detail Proses Defuzzifikasi</h4>
                    <div class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                        <table class="w-full text-sm text-left text-gray-700">
                            <thead style="background: linear-gradient(90deg, rgba(200,162,76,0.90), rgba(139,94,60,0.90));" class="text-xs text-white uppercase">
                                <tr>
                                    <th scope="col" class="py-3 px-4 text-center">Aturan</th>
                                    <th scope="col" class="py-3 px-4 text-center">α-predikat</th>
                                    <th scope="col" class="py-3 px-4 text-center">Jumlah Produksi (z)</th>
                                    <th scope="col" class="py-3 px-4 text-center">α * z</th>
                                </tr>
                            </thead>
                            <tbody>${createTableRows(data.steps)}${totalRow}</tbody>
                        </table>
                    </div>

                    <!-- Equation / Perhitungan WA -->
                    <div class="mt-6 p-4 rounded-lg" style="background: linear-gradient(180deg, rgba(217,185,138,0.12), rgba(200,162,76,0.06));">
                        <div class="text-center text-sm text-gray-700 mb-2">Perhitungan Weight Average (WA)</div>
                        <div class="flex justify-center items-center">
                            <div class="text-center font-mono text-lg text-gray-800">
                                <div style="font-size:1.0rem; line-height:1.1;">
                                    WA = (α1·z1 + α2·z2 + ... + αn·zn) / (α1 + α2 + ... + αn)
                                </div>
                                <div class="mt-2" style="font-size:1.05rem;">
                                    = ${data.total_alpha_z.toFixed(2)} / ${data.total_alpha.toFixed(4)}
                                    = <strong>${data.wa.toFixed(2)}</strong>
                                    ≈ <strong>${Math.round(data.wa)}</strong> pcs
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="w-full flex justify-center mt-8">
                    <button id="ulangBtn" 
        class="px-14 py-3 text-white font-semibold rounded-xl 
               bg-gradient-to-r from-[#B88A44] to-[#E6C98E] 
               hover:from-[#9C7438] hover:to-[#C8A24C] 
               transition-all duration-300 shadow-md">
    ANALISIS ULANG
</button>
                </div>
            `;

            btnAnalisis.style.display = "none";
            document.getElementById("ulangBtn").onclick = () => location.reload();

        } catch (error) {
            alert(`Terjadi kesalahan: ${error.message}`);
            btnAnalisis.disabled = false;
            btnAnalisis.innerText = "ANALISIS";
        }
    });
});
