const sneakerDisplay = document.getElementById('sneaker-display');
const glowAmbient = document.getElementById('glow-ambient');
const sneakerTitle = document.getElementById('sneaker-title');
const sneakerDesc = document.getElementById('sneaker-desc');

const exploreBtn = document.getElementById('explore-btn');
const backBtn = document.getElementById('back-btn');
const explorePanel = document.getElementById('explore-panel');

const profileTitle = document.getElementById('profile-title');
const profileHistory = document.getElementById('profile-history');
const profileMaterials = document.getElementById('profile-materials');
const profileStyling = document.getElementById('profile-styling');
const profileColorCode = document.getElementById('profile-color-code');

const SHOE_DATA = [
    {
        name: "Bred Reimagined",
        desc: "A timeless masterpiece remixed with ultra-premium black tumbled leather, underlying iconic mesh grid panels, and fire red hardware hits.",
        img: "blackjs.jpg",
        glow: "#e53e3e",
        bg: "#f4f4f6",
        colorCode: "Black/Fire Red-Cement Grey",
        history: "An evolution of the legendary 1989 profile. This 'Reimagined' edition upgrades the traditional nubuck upper into premium, durable tumbled leather sheets while staying perfectly faithful to the classic Chicago Bulls palette parameters.",
        materials: "Crafted with full-grain supple leather panels, structural over-molded black mesh net windows, a soft interior collar lining layer, and vibrant Fire Red supportive lacing wings.",
        styling: "Perfect for high-contrast streetwear. Pairs exceptionally well with oversized black heavyweight hoodies, charcoal distressed cargo trousers, or clean monochromatic fits."
    },
    {
        name: "Military Blue",
        desc: "An elite clean aesthetic sporting crisp industrial white nubuck overlays layered smoothly against deep royal military blue support wings.",
        img: "jwhite.jpg",
        glow: "#3182ce",
        bg: "#ebf4fa",
        colorCode: "White/Military Blue-Neutral Grey",
        history: "A historic 1:1 structural return to the original 1989 release blueprint specifications. This edition captures the pristine vintage silhouette tracking shapes exactly, stamping the highly coveted original 'Nike Air' brand insignia back onto the heel spine vector.",
        materials: "Features smooth grain leather uppers, precise Neutral Grey nubuck toe wrap overlays, vivid Military Blue stabilizer wings, and classic high-compression sole plates.",
        styling: "Excellent for clean summer lookbooks. Pulls together flawlessly when combined with light-wash vintage denim jeans, clean white cotton tees, or minimalist athletic wear lines."
    },
    {
        name: "Pine Green SB",
        desc: "Engineered specifically for optimal flexibility, featuring pure sail white tones contrasted cleanly by vivid, lush pine green accent structures.",
        img: "greenjs.png",
        glow: "#38a169",
        bg: "#edf7f2",
        colorCode: "Sail/Pine Green-Neutral Grey",
        history: "The legendary crossover collaboration vector between Jordan Brand shapes and Nike Skateboarding (SB) engineering. The upper geometry was heavily re-modeled with flexible properties to handle intense skate impacts while retaining basketball heritage lines.",
        materials: "Constructed using fine off-white suede mudguards, flexible side grid panel matrices, responsive internal foam dampening layers, and high-grip natural gum rubber outer rims.",
        styling: "Suited beautifully for relaxed skate aesthetics. Coordinates perfectly alongside earth-toned canvas work trousers, brown corduroy jackets, or muted olive utility gear."
    }
];

let activeIndex = 0;
let currentTrackingIndex = 0;
let rotationIntervalId = null;

function switchProductColorway() {
    if (!sneakerDisplay) return;

    sneakerDisplay.style.opacity = '0';
    sneakerDisplay.style.transform = 'rotate(-25deg) scale(0.8)';

    setTimeout(() => {
        currentTrackingIndex = activeIndex;
        const item = SHOE_DATA[activeIndex];

        sneakerDisplay.src = item.img;
        sneakerTitle.textContent = item.name;
        sneakerDesc.textContent = item.desc;
        glowAmbient.style.backgroundColor = item.glow;
        document.body.style.backgroundColor = item.bg;

        sneakerDisplay.style.opacity = '1';
        sneakerDisplay.style.transform = 'rotate(-15deg) scale(1)';

        activeIndex = (activeIndex + 1) % SHOE_DATA.length;
    }, 400);
}

function startInterval() {
    if (!rotationIntervalId) {
        rotationIntervalId = setInterval(switchProductColorway, 4500);
    }
}

function stopInterval() {
    clearInterval(rotationIntervalId);
    rotationIntervalId = null;
}

exploreBtn.addEventListener('click', () => {
    stopInterval();
    const currentShoe = SHOE_DATA[currentTrackingIndex];
    
    profileTitle.textContent = `${currentShoe.name} Profile`;
    profileHistory.textContent = currentShoe.history;
    profileMaterials.textContent = currentShoe.materials;
    profileStyling.textContent = currentShoe.styling;
    profileColorCode.textContent = currentShoe.colorCode;
    
    explorePanel.style.display = 'flex';
});

backBtn.addEventListener('click', () => {
    explorePanel.style.display = 'none';
    startInterval();
});

document.addEventListener('DOMContentLoaded', () => {
    switchProductColorway();
    startInterval();
});
