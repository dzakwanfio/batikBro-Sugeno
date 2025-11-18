document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".card-reveal");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.remove("opacity-0", "translate-y-5");
                entry.target.classList.add("opacity-100", "translate-y-0");
            }
        });
    }, {
        threshold: 0.2
    });

    cards.forEach(card => observer.observe(card));
});
