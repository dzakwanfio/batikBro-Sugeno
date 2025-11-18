document.addEventListener("DOMContentLoaded", function () {
    const ctx = document.getElementById("gaugeChart").getContext("2d");

    const gaugeChart = new Chart(ctx, {
        type: "doughnut",
        data: {
            datasets: [{
                data: [finalScore, 100 - finalScore],
                backgroundColor: ["#FF3B30", "#E5E5E5"], // MERAH & ABU MUDA (desain)
                borderWidth: 0,
                circumference: 180, // setengah lingkaran
                rotation: 270      // start dari kiri
            }]
        },
        options: {
            responsive: false,        // WAJIB supaya chart tidak membesar
            maintainAspectRatio: false,
            cutout: "75%",            // ketebalan gauge

            plugins: {
                legend: { display: false },
                tooltip: { enabled: false },

                // Persentase TIDAK ditampilkan di dalam chart
                datalabels: {
                    display: false
                }
            }
        },
        plugins: [ChartDataLabels]
    });
});
