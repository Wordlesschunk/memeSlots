import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    static values = {
        number: String,
        spinMs: { type: Number, default: 2000 }
    }

    connect() {
        const EXTRA_SPINS_BASE = 4;
        const EXTRA_SPINS_VARIANCE = 2;
        const STAGGER_PER_REEL_MS = 150;

        const numberStr = (this.numberValue || "0").replace(/\D/g, "") || "0";
        const totalSpinMs = this.spinMsValue;

        this.element.innerHTML = "";

        const wrapper = document.createElement("div");
        wrapper.className = "spinner";

        const reels = [];

        numberStr.split("").forEach(() => {
            const reel = document.createElement("div");
            reel.className = "reel";

            const strip = document.createElement("div");
            strip.className = "digit-strip";

            // repeat 0-9 many times to allow long spin
            const loops = EXTRA_SPINS_BASE + EXTRA_SPINS_VARIANCE + 2;
            for (let loop = 0; loop < loops; loop++) {
                for (let i = 0; i <= 9; i++) {
                    const d = document.createElement("div");
                    d.className = "digit";
                    d.textContent = i;
                    strip.appendChild(d);
                }
            }

            reel.appendChild(strip);
            wrapper.appendChild(reel);
            reels.push({ reel, strip });
        });

        this.element.appendChild(wrapper);

        // Start spinning
        const digits = numberStr.split("");
        reels.forEach((item, idx) => {
            const strip = item.strip;
            const targetDigit = parseInt(digits[idx], 10) || 0;

            // Wait for next frame to ensure DOM is updated and we can get height
            requestAnimationFrame(() => {
                const digitHeight = strip.firstElementChild.offsetHeight || 80;

                strip.style.transition = "none";
                strip.style.transform = "translateY(0px)";

                // Trigger reflow
                void strip.offsetHeight;

                const extraSpins = EXTRA_SPINS_BASE +
                    Math.floor(Math.random() * (EXTRA_SPINS_VARIANCE + 1));

                const steps = extraSpins * 10 + targetDigit;
                const distance = digitHeight * steps;

                const duration = (totalSpinMs + idx * STAGGER_PER_REEL_MS) / 1000;
                const easing = "cubic-bezier(0.05, 0.9, 0.2, 1)";

                strip.style.transition = `transform ${duration}s ${easing}`;
                strip.style.transform = `translateY(${-distance}px)`;
            });
        });
    }
}
