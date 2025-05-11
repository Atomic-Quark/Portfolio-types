/*==================== matter.js physics background ====================*/
const canvas = document.getElementById('physics-bg');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Matter.js setup
const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;

const engine = Engine.create();
const world = engine.world;

const particles = [];
const colors = ['#00ffcc', '#ff007a', '#e0e7ff'];
const numberOfParticles = 30;

// Create particles
for (let i = 0; i < numberOfParticles; i++) {
  const radius = Math.random() * 10 + 5;
  const x = Math.random() * (canvas.width - 2 * radius) + radius;
  const y = Math.random() * (canvas.height - 2 * radius) + radius;
  const particle = Bodies.circle(x, y, radius, {
    restitution: 0.9,
    friction: 0,
    render: { fillStyle: colors[Math.floor(Math.random() * colors.length)] }
  });
  particles.push(particle);
  World.add(world, particle);
}

// Add walls
const walls = [
  Bodies.rectangle(canvas.width / 2, -25, canvas.width, 50, { isStatic: true }),
  Bodies.rectangle(canvas.width / 2, canvas.height + 25, canvas.width, 50, { isStatic: true }),
  Bodies.rectangle(-25, canvas.height / 2, 50, canvas.height, { isStatic: true }),
  Bodies.rectangle(canvas.width + 25, canvas.height / 2, 50, canvas.height, { isStatic: true })
];
World.add(world, walls);

// Animation loop
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  Engine.update(engine, 1000 / 60);

  particles.forEach(particle => {
    ctx.beginPath();
    ctx.arc(particle.position.x, particle.position.y, particle.circleRadius, 0, Math.PI * 2);
    ctx.fillStyle = particle.render.fillStyle;
    ctx.fill();
    ctx.shadowBlur = 20;
    ctx.shadowColor = particle.render.fillStyle;
  });

  requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

/*==================== toggle icon navbar ====================*/
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
  menuIcon.classList.toggle('bx-x');
  navbar.classList.toggle('active');
};

/*==================== scroll sections active link ====================*/
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
  sections.forEach(sec => {
    const top = window.scrollY;
    const offset = sec.offsetTop - 150;
    const height = sec.offsetHeight;
    const id = sec.getAttribute('id');

    if (top >= offset && top < offset + height) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        document.querySelector(`header nav a[href*=${id}]`).classList.add('active');
      });
    }
  });

  /*==================== sticky navbar ====================*/
  const header = document.querySelector('.header');
  header.classList.toggle('sticky', window.scrollY > 100);

  /*==================== remove toggle icon and navbar when click navbar link (scroll) ====================*/
  menuIcon.classList.remove('bx-x');
  navbar.classList.remove('active');
};

/*==================== scroll reveal ====================*/
ScrollReveal({
  reset: true,
  distance: '100px',
  duration: 2000,
  delay: 200
});

ScrollReveal().reveal('.home-content, .heading', { origin: 'top' });
ScrollReveal().reveal('.home-img, .services-container, .portfolio-box, .contact form', { origin: 'bottom' });
ScrollReveal().reveal('.home-content h1, .about-img', { origin: 'left' });
ScrollReveal().reveal('.home-content p, .about-content, .skills, .education', { origin: 'right' });

/*==================== gsap animations ====================*/
gsap.from('.logo', { opacity: 0, x: -100, duration: 1, ease: 'power2.out' });
gsap.from('.navbar a', { opacity: 0, y: -50, duration: 1, stagger: 0.2, delay: 0.5 });
gsap.from('.home-img img', { scale: 0, duration: 1.5, ease: 'elastic.out(1, 0.5)', delay: 1 });
gsap.from('.social-media a', { opacity: 0, scale: 0, duration: 1, stagger: 0.2, delay: 1.5 });
gsap.from('.skill-item', { opacity: 0, x: 50, duration: 1, stagger: 0.2, delay: 2 });
gsap.from('.timeline li', { opacity: 0, y: 50, duration: 1, stagger: 0.3, delay: 2.5 });

/*==================== typed js ====================*/
const typed = new Typed('.multiple-text', {
  strings: ['Cosmic Coder', 'UI/UX Wizard', 'App Architect', 'Dream Weaver'],
  typeSpeed: 100,
  backSpeed: 50,
  backDelay: 1000,
  loop: true
});