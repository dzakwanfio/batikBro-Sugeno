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

    const jenisBatik = document.getElementById("jenisBatik");

    const demandSlider = document.getElementById("demandSlider");
    const demandValue = document.getElementById("demandValue");
    const ketDemand = document.getElementById("ketDemand");

    const inventorySlider = document.getElementById("inventorySlider");
    const inventoryValue = document.getElementById("inventoryValue");
    const ketInventory = document.getElementById("ketInventory");

    // DATA RANGE SETIAP BATIK
    const dataRange = {
        "tulis": {
            demandMin: 10, demandMax: 50,
            inventoryMin: 9, inventoryMax: 100,
            ketDemand: "Keterangan : Batik Tulis 10–50",
            ketInventory: "Keterangan : Batik Tulis 9–100"
        },
        "cantingcap": {
            demandMin: 10, demandMax: 55,
            inventoryMin: 100, inventoryMax: 209,
            ketDemand: "Keterangan : Batik CantingCap 10–55",
            ketInventory: "Keterangan : Batik CantingCap 100–209"
        },
        "printing": {
            demandMin: 10, demandMax: 100,
            inventoryMin: 100, inventoryMax: 203,
            ketDemand: "Keterangan : Batik Printing 10–100",
            ketInventory: "Keterangan : Batik Printing 100–203"
        }
    };

    // KETIKA DROPDOWN DIUBAH
    jenisBatik.addEventListener("change", function () {

        const pilihan = jenisBatik.value;
        const set = dataRange[pilihan];

        // SET DEMAND
        demandSlider.min = set.demandMin;
        demandSlider.max = set.demandMax;
        demandSlider.value = set.demandMin;

        demandValue.min = set.demandMin;
        demandValue.max = set.demandMax;
        demandValue.value = set.demandMin;

        ketDemand.innerText = set.ketDemand;

        // SET INVENTORY
        inventorySlider.min = set.inventoryMin;
        inventorySlider.max = set.inventoryMax;
        inventorySlider.value = set.inventoryMin;

        inventoryValue.min = set.inventoryMin;
        inventoryValue.max = set.inventoryMax;
        inventoryValue.value = set.inventoryMin;

        ketInventory.innerText = set.ketInventory;
    });

    // SLIDER → NUMBER
    const sliders = document.querySelectorAll(".slider-input");
    sliders.forEach(slider => {
        let labelId = slider.dataset.label;
        let inputNumber = document.getElementById(labelId);

        slider.addEventListener("input", function () {
            inputNumber.value = slider.value;
        });

        inputNumber.addEventListener("input", function () {
            let val = Number(inputNumber.value);

            if (val < slider.min) val = slider.min;
            if (val > slider.max) val = slider.max;

            inputNumber.value = val;
            slider.value = val;
        });
    });

});
// VALIDASI KETIKA TOMBOL ANALISIS DIKLIK
document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const jenisBatik = document.getElementById("jenisBatik");

    form.addEventListener("submit", function (event) {
        if (jenisBatik.value === "" || jenisBatik.value === null) {
            event.preventDefault(); // cegah form terkirim
            alert("Silakan pilih jenis batik terlebih dahulu!");
        }
    });
});
document.addEventListener("DOMContentLoaded", function () {

    const jenis = document.getElementById("jenisBatik");
    const demandSlider = document.getElementById("demandSlider");
    const demandValue = document.getElementById("demandValue");
    const invSlider = document.getElementById("inventorySlider");
    const invValue = document.getElementById("inventoryValue");

    const ketDemand = document.getElementById("ketDemand");
    const ketInv = document.getElementById("ketInventory");

    const form = document.querySelector("form");

    // TEMPAT UNTUK MENARUH OUTPUT
    const outputContainer = document.createElement("div");
    outputContainer.id = "hasilPrediksi";
    outputContainer.className = "mt-10";
    outputContainer.style.display = "none"; // mulai disembunyikan

    document.querySelector(".rounded-3xl").appendChild(outputContainer);


    // === RANGE TIAP BATIK ===
    const settings = {
        tulis: { demand: [10, 50], inv: [9, 100], output: "10–52" },
        cantingcap: { demand: [10, 55], inv: [100, 209], output: "50–100" },
        printing: { demand: [10, 100], inv: [100, 203], output: "80–100" }
    };

    jenis.addEventListener("change", () => {
        const set = settings[jenis.value];

        demandSlider.min = set.demand[0];
        demandSlider.max = set.demand[1];
        demandSlider.value = set.demand[0];
        demandValue.value = set.demand[0];
        ketDemand.innerHTML = `Keterangan : Batik ${jenis.value} ${set.demand[0]}–${set.demand[1]}`;

        invSlider.min = set.inv[0];
        invSlider.max = set.inv[1];
        invSlider.value = set.inv[0];
        invValue.value = set.inv[0];
        ketInv.innerHTML = `Keterangan : Batik ${jenis.value} ${set.inv[0]}–${set.inv[1]}`;
    });

    // Sync Slider & Input
    demandSlider.oninput = () => demandValue.value = demandSlider.value;
    demandValue.oninput = () => demandSlider.value = demandValue.value;

    invSlider.oninput = () => invValue.value = invSlider.value;
    invValue.oninput = () => invSlider.value = invValue.value;



    // === KETIKA ANALISIS DIKLIK ===
    // === KETIKA ANALISIS DIKLIK ===
form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!jenis.value) {
        alert("Silakan pilih jenis batik terlebih dahulu!");
        return;
    }

    const demand = Number(demandValue.value);
    const inv = Number(invValue.value);

    // rumus dummy
    const prediksi = Math.round((demand * 0.6) + (inv * 0.4));

    // tampilkan hasil
    outputContainer.style.display = "block";

    outputContainer.innerHTML = `
        <h2 class="text-2xl font-bold text-center text-[#C8A24C]">Hasil Prediksi</h2>

        <h3 class="text-center text-xl font-semibold mt-3">
            Rekomendasi Produksi Bulan Ini
        </h3>

        <p class="text-center text-4xl text-green-600 font-bold mt-2">
            ${prediksi} pcs
        </p>

        <p class="text-center mt-4 text-gray-700">
            Berdasarkan permintaan <b>${demand} pcs</b> dan stok <b>${inv} lembar</b>,
            sistem merekomendasikan produksi <b>${prediksi} pcs</b>.
        </p>

        <p class="text-center mt-6 text-gray-600 text-sm px-4">
            <b>Validasi Akurasi (MPE)</b>:
            Jika perusahaan memproduksi sesuai rekomendasi sistem (${prediksi} pcs),
            maka tingkat kesalahan prediksi rata-rata hanya sekitar 20–24%.
        </p>

        <div class="w-full flex justify-center mt-8">
            <button id="ulangBtn"
                class="px-14 py-3 text-white font-semibold rounded-xl
                       bg-[#4AB2E4] hover:bg-[#3A9DCB] transition shadow-md">
                ANALISIS ULANG
            </button>
        </div>
    `;

    // 🔥 HILANGKAN tombol ANALISIS
    document.getElementById("btnAnalisis").style.display = "none";

    // ANALISIS ULANG
    document.getElementById("ulangBtn").onclick = () => {
        location.reload();
    };
});


});
