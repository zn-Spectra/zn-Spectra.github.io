/** @jsx React.createElement */
const { useState, useEffect, useRef } = React;


const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggle = () => setIsDark(!isDark);

  return (
    <button className="theme-toggle" onClick={toggle} aria-label="Toggle dark mode">
      {isDark ? '🌙' : '☀️'}
    </button>
  );
};

/* ───────────────────────── Hooks ───────────────────────── */

function useSlideshow(interval = 6000) {
  useEffect(() => {
    const slides = document.querySelectorAll('#bg-slideshow .slide');
    if (!slides.length) return;
    let current = 0;
    const timer = setInterval(() => {
      current = (current + 1) % slides.length;
      slides.forEach((s, i) => s.classList.toggle('active', i === current));
    }, interval);
    return () => clearInterval(timer);
  }, [interval]);
}

function useCounter(target, duration = 1600) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.max(target / (duration / 16), 0.1);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return { ref, count };
}

function useSmoothScroll() {
  useEffect(() => {
    const links = document.querySelectorAll('a[href^="#"]');
    const handler = function (e) {
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    links.forEach((a) => a.addEventListener('click', handler));
    return () => links.forEach((a) => a.removeEventListener('click', handler));
  }, []);
}

function useScrollProgress() {
  useEffect(() => {
    const bar = document.getElementById('scrollProgress');
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      if (bar) bar.style.width = progress + '%';
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
}

function useBackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  return { visible, scrollToTop };
}

/* ───────────────────────── Icons ───────────────────────── */

const iconProps = {
  width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none',
  stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round',
};

const Icon3D = () => (
  <svg {...iconProps}>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

const IconGame = () => (
  <svg {...iconProps}>
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <path d="M6 12h4" /><path d="M8 10v4" />
    <path d="M15 13a1 1 0 1 0 2 0 1 1 0 0 0-2 0" />
    <path d="M18 11a1 1 0 1 0 2 0 1 1 0 0 0-2 0" />
  </svg>
);

const IconLevel = () => (
  <svg {...iconProps}>
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
  </svg>
);

const IconOptimize = () => (
  <svg {...iconProps}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const IconBriefcase = () => (
  <svg {...iconProps}>
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const IconStar = () => (
  <svg {...iconProps}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const IconMail = () => (
  <svg {...iconProps}>
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const IconArrowUp = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
);

/* ───────────────────────── 3D Viewport preview ───────────────────────── */

function ViewportPreview() {
  const mountRef = useRef(null);

  useEffect(() => {
    const THREE = window.THREE;
    if (!THREE || !mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = Math.max(220, Math.min(360, Math.floor(width * 0.62)));

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.0, 3.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x334466, 0.6));
    const key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(4, 6, 5); key.castShadow = true;
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x55d992, 0.25);
    fill.position.set(-4, 2, -3);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0x4d9bff, 0.45);
    rim.position.set(0, -2, 6);
    scene.add(rim);

    const geom = new THREE.TorusKnotGeometry(0.65, 0.25, 64, 8, 2, 3);
    const mat = new THREE.MeshPhysicalMaterial({
      color: 0x4d9bff, metalness: 0.3, roughness: 0.3,
      clearcoat: 0.2, clearcoatRoughness: 0.3,
      emissive: 0x0a1a3a, emissiveIntensity: 0.15,
    });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.castShadow = true; mesh.position.y = 0.1;
    scene.add(mesh);

    const wireGeom = new THREE.TorusKnotGeometry(0.67, 0.27, 64, 8, 2, 3);
    const wireMat = new THREE.MeshBasicMaterial({ color: 0x8fc3ff, wireframe: true, transparent: true, opacity: 0.10 });
    const wire = new THREE.Mesh(wireGeom, wireMat);
    wire.position.y = 0.1;
    scene.add(wire);

    const ringGeom = new THREE.TorusGeometry(0.9, 0.015, 16, 60);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x4d9bff, transparent: true, opacity: 0.20 });
    const ring1 = new THREE.Mesh(ringGeom, ringMat);
    ring1.rotation.x = Math.PI / 2.5; ring1.rotation.z = 0.3; ring1.position.y = 0.1;
    scene.add(ring1);
    const ring2 = new THREE.Mesh(ringGeom, ringMat);
    ring2.rotation.x = Math.PI / 3; ring2.rotation.y = 0.8; ring2.scale.set(1.2, 1.2, 1.2); ring2.position.y = 0.1;
    scene.add(ring2);

    const particleCount = 180;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) posArray[i] = (Math.random() - 0.5) * 6;
    const particleGeom = new THREE.BufferGeometry();
    particleGeom.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particles = new THREE.Points(particleGeom, new THREE.PointsMaterial({ color: 0x8fc3ff, size: 0.015, transparent: true, opacity: 0.3 }));
    scene.add(particles);

    let rafId, time = 0;
    const animate = () => {
      time += 0.005;
      mesh.rotation.x = Math.sin(time * 0.3) * 0.2;
      mesh.rotation.y += 0.008;
      wire.rotation.x = mesh.rotation.x;
      wire.rotation.y = mesh.rotation.y;
      ring1.rotation.z += 0.003;
      ring1.rotation.x = Math.PI / 2.5 + Math.sin(time * 0.4) * 0.1;
      ring2.rotation.y += 0.005;
      ring2.rotation.x = Math.PI / 3 + Math.sin(time * 0.5) * 0.1;
      particles.rotation.y += 0.0005;
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      const w = container.clientWidth;
      const h = Math.max(220, Math.min(360, Math.floor(w * 0.62)));
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="viewport-frame">
      <div className="corner-tl"></div><div className="corner-tr"></div>
      <div className="corner-bl"></div><div className="corner-br"></div>
      <div className="hud-label" style={{ position: 'absolute', top: 12, left: 26, zIndex: 5 }}>SELECT · TorusKnot_01</div>
      <div className="hud-label" style={{ position: 'absolute', top: 12, right: 26, zIndex: 5, color: '#55d992' }}>● LIVE</div>
      <div className="hud-label" style={{ position: 'absolute', bottom: 12, left: 26, zIndex: 5 }}>CAM 0.0 / 1.0 / 3.2</div>
      <div ref={mountRef} className="w-full" style={{ minHeight: '220px' }} />
    </div>
  );
}

/* ───────────────────────── Small components ───────────────────────── */

function Card({ title, children, className = '' }) {
  return (
    <div className={`panel p-5 ${className}`}>
      {title && <h3 className="hud-label mb-3">{title}</h3>}
      {children}
    </div>
  );
}

function Stat({ label, value, suffix = '', change, animated = false }) {
  const { ref, count } = useCounter(animated ? value : 0);
  const display = animated ? Math.floor(count) : value;
  return (
    <div ref={ref}>
      <div className="hud-label">{label}</div>
      <div className="font-display text-2xl font-medium tracking-tight leading-none mt-1.5">
        {display}{suffix}
      </div>
      {change && (
        <div className={`font-mono text-[0.65rem] mt-1.5 ${change.startsWith('+') ? 'text-[#55d992]' : 'text-[#ffb454]'}`}>
          {change}
        </div>
      )}
    </div>
  );
}

function TransformRow() {
  const items = [
    { axis: 'x', label: 'Unity' },
    { axis: 'y', label: 'Godot' },
    { axis: 'z', label: 'AR / VR' },
  ];
  return (
    <div className="transform-row">
      <span className="hud-label">POS</span>
      {items.map((it) => (
        <div className="transform-chip" key={it.axis}>
          <span className={`axis-dot axis-${it.axis}`}></span>
          {it.label}
        </div>
      ))}
    </div>
  );
}

function Testimonial({ quote, author, role, avatar }) {
  return (
    <div className="testimonial-card">
      <div className="flex items-center gap-3 mb-3">
        <img src={avatar} alt={`Portrait de ${author}`} className="w-10 h-10 rounded-full object-cover border border-[rgba(77,155,255,0.25)]" />
        <div>
          <div className="text-[var(--text)] font-medium text-sm">{author}</div>
          <div className="hud-label">{role}</div>
        </div>
      </div>
      <p className="text-[var(--text-dim)] text-sm leading-relaxed">&ldquo;{quote}&rdquo;</p>
    </div>
  );
}

function ExperienceItem({ version, title, company, period, description }) {
  return (
    <div className="timeline-item">
      <div className="timeline-dot"><IconBriefcase /></div>
      <div className="flex-1">
        <div className="timeline-version">{version}</div>
        <h4 className="text-[var(--text)] font-medium mt-0.5">{title}</h4>
        <div className="hud-label mt-0.5">{company} · {period}</div>
        <p className="text-[var(--text-dim)] text-sm mt-2 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function PortfolioItem({ title, category, engine, image, onClick }) {
  return (
    <div className="portfolio-item" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick(); }}>
      <img src={image} alt={title} loading="lazy" />
      <div className="overlay">
        <span className="engine-tag">{engine}</span>
        <h4 className="text-[var(--text)] text-base font-medium">{title}</h4>
        <span className="hud-label">{category}</span>
      </div>
    </div>
  );
}

/* ───────────────────────── App ───────────────────────── */

function App() {
  useSlideshow(6000);
  useSmoothScroll();
  useScrollProgress();
  const { visible, scrollToTop } = useBackToTop();

  const [filter, setFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const services = [
    { icon: <Icon3D />, axis: 'x', title: 'Modélisation 3D', desc: 'Assets low-poly et high-poly, texturing PBR, prêts pour le jeu vidéo ou l\u2019animation.' },
    { icon: <IconGame />, axis: 'y', title: 'Développement de jeu', desc: 'Mécaniques complètes, prototypage rapide, gameplay abouti sur Unity et Godot.' },
    { icon: <IconLevel />, axis: 'z', title: 'Level Design', desc: 'Environnements immersifs, éclairage et narration environnementale.' },
    { icon: <IconOptimize />, axis: 'warn', title: 'Optimisation', desc: 'Topologie efficace et budgets mémoire maîtrisés pour des builds fluides.' },
  ];

  const portfolioItems = [
    { id: 1, title: 'Cyberpunk City', category: 'Environnement urbain', engine: 'UNITY', image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop' },
    { id: 2, title: 'Mystic Forest', category: 'Environnement naturel', engine: 'GODOT', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop' },
    { id: 3, title: 'Space Station AR', category: 'Réalité augmentée', engine: 'AR/VR', image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=2070&auto=format&fit=crop' },
    { id: 4, title: 'Ancient Ruins', category: 'Exploration VR', engine: 'VR', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop' },
    { id: 5, title: 'Neon Racer', category: 'Circuit stylisé', engine: 'UNITY', image: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2070&auto=format&fit=crop' },
    { id: 6, title: 'Underwater World', category: 'Environnement sous-marin', engine: 'GODOT', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2070&auto=format&fit=crop' },
  ];

  const filteredItems = filter === 'all' ? portfolioItems : portfolioItems.filter((i) => i.engine === filter);

  const testimonials = [
    { quote: 'Nidhal a transformé notre concept de jeu en une réalité saisissante. Son travail 3D est exceptionnel.', author: 'Sarah K.', role: 'CEO, GameForge', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { quote: 'Livraison de qualité, dans les temps et le budget. Une collaboration sans accroc du début à la fin.', author: 'Mark R.', role: 'Lead Developer, VR Solutions', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { quote: 'L\u2019expérience AR qu\u2019il a construite a dépassé toutes nos attentes. Immersive et très soignée.', author: 'Emily T.', role: 'Product Manager, AR Innovations', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
  ];

  const experiences = [
    { version: 'v3 — actuel', title: 'Artiste 3D Senior', company: 'Studio Alpha', period: '2022 – présent', description: 'Artiste 3D principal sur des projets AAA, spécialisé en environnement et optimisation.' },
    { version: 'v2', title: 'Développeur Unity', company: 'Indie Games Inc.', period: '2020 – 2022', description: 'Développement de plusieurs prototypes et jeux complets, axés gameplay et performance.' },
    { version: 'v1', title: 'Généraliste 3D freelance', company: 'Indépendant', period: '2018 – 2020', description: 'Modélisation, texturing et animation 3D pour des clients variés, jeux et simulations.' },
  ];

  const openModal = (item) => setSelectedProject(item);
  const closeModal = () => setSelectedProject(null);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <main className="min-h-screen max-w-6xl mx-auto px-5 sm:px-8 py-5 relative z-10">
      <ThemeToggle />

      {/* NAVBAR */}
      <div className="flex items-center justify-between py-4 mb-4 border-b border-[var(--border)] sticky top-0 bg-[rgba(13,15,18,0.85)] backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <div className="logo-mark">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none">
              <rect width="120" height="120" rx="24" fill="#0B1120" />
              <path d="M35 38L60 18L85 38" stroke="#4d9bff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M26 40L60 18L94 40" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
              <path d="M35 42L40 68L44 76L56 80L60 90L64 80L76 76L80 68L85 42" fill="#4d9bff" />
              <path d="M47 56C47 52 51 50 60 50C69 50 73 52 73 56C73 60 69 62 60 62C51 62 47 60 47 56Z" fill="#fff" />
              <path d="M12 100L38 66" stroke="#fff" strokeWidth="8" strokeLinecap="round" />
              <path d="M108 100L82 66" stroke="#fff" strokeWidth="8" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div className="font-display text-white font-medium text-lg tracking-tight">ZITOUNI</div>
            <div className="hud-label">3D · Unity · Godot</div>
          </div>
          <span className="hud-label border border-[var(--border-strong)] rounded-full px-2.5 py-0.5 ml-1">$15/hr</span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <a href="#services" className="nav-link">Services</a>
          <a href="#portfolio" className="nav-link">Portfolio</a>
          <a href="#experience" className="nav-link">Parcours</a>
          <a href="#testimonials" className="nav-link">Avis</a>
          <a href="#contact" className="nav-link">Contact</a>
          <a href="https://upwork.com/freelancers/zitounin2" target="_blank" rel="noopener noreferrer" className="btn-outline">Upwork</a>
          <a href="#contact" className="btn-primary">Me contacter</a>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <a href="#contact" className="btn-primary text-sm px-4 py-1.5">Contact</a>
        </div>
      </div>

      {/* HERO */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 py-6 pb-12">
        <div className="lg:col-span-3 flex flex-col justify-center fade-in">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-px bg-[var(--axis-z)]"></span>
            <span className="hud-label" style={{ color: 'var(--axis-z)' }}>3D · Unity · Godot · AR/VR</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.05] tracking-tight">
            Je construis des mondes<br />qu&rsquo;on a envie d&rsquo;explorer.
          </h1>
          <p className="text-[var(--text-dim)] text-base sm:text-lg max-w-md mt-5 font-light leading-relaxed">
            Artiste 3D et développeur de jeux. De l&rsquo;asset brut au niveau jouable,
            j&rsquo;assemble modélisation, gameplay et optimisation en une seule pipeline.
          </p>
          <div className="flex flex-wrap gap-3 mt-7">
            <a href="#portfolio" className="btn-primary">Voir le portfolio</a>
            <a href="#contact" className="btn-outline">Discuter d&rsquo;un projet</a>
          </div>
          <div className="mt-8 max-w-sm">
            <TransformRow />
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-3 fade-in fade-in-d2">
          <ViewportPreview />
          <div className="grid grid-cols-2 gap-3">
            <Card><Stat label="Scènes actives" value={47} change="+12%" /></Card>
            <Card><Stat label="Performance" value={98.2} suffix="%" /></Card>
          </div>
        </div>
      </div>

      {/* SERVICES */}
      <div id="services" className="pt-4 pb-8 fade-in fade-in-d3">
        <div className="section-header">
          <span className="eyebrow">Ce que je fais</span>
          <h2>Services</h2>
          <div className="line"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((s, i) => (
            <Card key={i} className="flex flex-col">
              <div className={`icon-box axis-${s.axis}`}>{s.icon}</div>
              <h4 className="text-[var(--text)] text-sm font-medium mb-1">{s.title}</h4>
              <p className="text-[var(--text-dim)] text-xs leading-relaxed">{s.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* PORTFOLIO */}
      <div id="portfolio" className="py-6 fade-in fade-in-d4">
        <div className="section-header">
          <span className="eyebrow">Travaux récents</span>
          <h2>Portfolio</h2>
          <div className="line"></div>
        </div>
        <div className="flex flex-wrap gap-2 mb-6">
          {['all', 'UNITY', 'GODOT', 'AR/VR', 'VR'].map((cat) => (
            <button key={cat} className={`filter-btn ${filter === cat ? 'active' : ''}`} onClick={() => setFilter(cat)}>
              {cat === 'all' ? 'Tout' : cat}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <PortfolioItem key={item.id} {...item} onClick={() => openModal(item)} />
          ))}
        </div>
      </div>

      {/* EXPERIENCE */}
      <div id="experience" className="py-6 fade-in fade-in-d5">
        <div className="section-header">
          <span className="eyebrow">Journal de bord</span>
          <h2>Parcours</h2>
          <div className="line"></div>
        </div>
        <div className="max-w-2xl">
          {experiences.map((exp, idx) => <ExperienceItem key={idx} {...exp} />)}
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div id="testimonials" className="py-6 fade-in fade-in-d6">
        <div className="section-header">
          <IconStar />
          <h2>Avis clients</h2>
          <div className="line"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {testimonials.map((t, idx) => <Testimonial key={idx} {...t} />)}
        </div>
      </div>

      {/* CONTACT */}
      <div id="contact" className="py-6 fade-in fade-in-d7">
        <div className="section-header">
          <IconMail />
          <h2>Me contacter</h2>
          <div className="line"></div>
        </div>
        <Card className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[var(--text-dim)] text-sm font-medium">Nom</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="contact-input mt-1.5" placeholder="Votre nom" required />
            </div>
            <div>
              <label className="text-[var(--text-dim)] text-sm font-medium">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="contact-input mt-1.5" placeholder="vous@exemple.com" required />
            </div>
            <div>
              <label className="text-[var(--text-dim)] text-sm font-medium">Message</label>
              <textarea name="message" rows="4" value={formData.message} onChange={handleChange} className="contact-input mt-1.5" placeholder="Parlez-moi de votre projet..." required></textarea>
            </div>
            <button type="submit" className="btn-primary w-full">{sent ? 'Message envoyé ✓' : 'Envoyer le message'}</button>
          </form>
        </Card>
      </div>

      {/* IMPACT STATS */}
      <div className="py-6 fade-in fade-in-d8">
        <div className="section-header">
          <span className="eyebrow">Bilan</span>
          <h2>Impact</h2>
          <div className="line"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><Stat label="Projets livrés" value={112} animated /></Card>
          <Card><Stat label="Clients satisfaits" value={89} animated change="+18%" /></Card>
          <Card><Stat label="Titres AR/VR" value={24} animated /></Card>
          <Card><Stat label="Années d'expérience" value={7} animated /></Card>
        </div>
      </div>

      {/* FOOTER */}
      <div className="pt-10 pb-5 mt-2 border-t border-[var(--border)] flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="hud-label">© 2026 Nidhal Zitouni · Artiste 3D &amp; Développeur Unity/Godot</div>
        <div className="flex flex-wrap items-center gap-5 hud-label">
          <a href="#" className="hover:text-[var(--text)] transition-colors">GitHub</a>
          <a href="#" className="hover:text-[var(--text)] transition-colors">LinkedIn</a>
          <a href="#" className="hover:text-[var(--text)] transition-colors">ArtStation</a>
          <a href="#" className="hover:text-[var(--text)] transition-colors">Itch.io</a>
          <a href="https://upwork.com/freelancers/zitounin2" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--text)] transition-colors">Upwork</a>
        </div>
      </div>

      {/* MODAL */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)'}} onClick={closeModal}>
          <div className="panel max-w-2xl w-full p-6" onClick={(e) => e.stopPropagation()}>
            <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-64 object-cover rounded-lg mb-4" />
            <span className="engine-tag">{selectedProject.engine}</span>
            <h3 className="font-display text-2xl font-medium text-[var(--text)] mt-1">{selectedProject.title}</h3>
            <p className="hud-label mt-1">{selectedProject.category}</p>
            <p className="text-[var(--text-dim)] mt-4 text-sm leading-relaxed">
              Détails du projet à compléter : contexte, rôle exact, outils utilisés et résultat obtenu.
            </p>
            <button onClick={closeModal} className="mt-6 btn-outline">Fermer</button>
          </div>
        </div>
      )}

      {/* BACK TO TOP */}
      <div className={`back-to-top ${visible ? 'visible' : ''}`} onClick={scrollToTop} role="button" aria-label="Retour en haut">
        <IconArrowUp />
      </div>
    </main>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
