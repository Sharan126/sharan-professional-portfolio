/**
 * THE INVENTOR'S DIMENSION — APP CONTROLLER & INTERACTIVITY
 * Author: Sharan M
 */

(function () {
  'use strict';

  // --- CROSS-COMPONENT CONTROLLER HOOKS ---
  let pauseSpotlightAutoCycle = null;
  let resumeSpotlightAutoCycle = null;

  // --- PROJECT CASE STUDIES DATA STORE ---
  const CASE_STUDIES = {
    macrosnap: {
      id: 'SYS-01 // AI_AGENT',
      title: 'MacroSnap',
      tagline: 'Multimodal AI Nutrition & Dietary Intelligence Assistant',
      category: 'AI & Agents',
      status: 'LIVE PRODUCTION APP',
      problem: 'Accurate nutritional tracking typically requires tedious manual entry of ingredient weights, brand names, and portion sizes, causing high abandonment rates.',
      concept: 'A visual-first assistant leveraging multimodal vision models to extract nutritional breakdowns directly from meal photographs or conversational descriptions.',
      implementation: 'Engineered using Streamlit and Python with Gemini 2.5 Flash Lite. Implemented few-shot vision prompting for calorie and macro estimation, contextual conversational memory for follow-up dietary queries, and automated session summary dispatch via email.',
      stack: ['Python', 'Streamlit', 'Gemini 2.5 Flash Lite', 'Multimodal Vision', 'SMTP Email Pipeline'],
      liveUrl: 'https://macrosnap-9nhkfrumfthntx8pxgkb2i.streamlit.app/',
      githubUrl: 'https://github.com/Sharan126/MacroSnap'
    },
    dasara: {
      id: 'SYS-02 // 3D_WEBGL',
      title: 'Mangaluru Dasara 2026',
      tagline: 'Interactive 3D Virtual Cultural Heritage Tour',
      category: 'Creative & Engineering',
      status: 'LIVE WEBGL EXPERIENCE',
      problem: 'Physical distance and accessibility barriers prevent devotees and cultural enthusiasts globally from experiencing the architectural grandeur of Sri Gokarnanatha Kshetra during Navaratri.',
      concept: 'A browser-based interactive 3D digital twin combining spatial navigation, bilingual cultural narration, festival timelines, and an interactive cultural quiz.',
      implementation: 'Constructed using WebGL and vanilla JavaScript with procedural lighting, spatial audio, and low-polygon architectural modeling for fast loading across mobile and desktop devices. Features both Kannada and English voice guidance.',
      stack: ['WebGL', 'JavaScript', 'Interactive 3D', 'Web Audio API', 'Cultural Heritage'],
      liveUrl: 'https://sharan126.github.io/Mangaluru-Dasara/',
      githubUrl: 'https://github.com/Sharan126/Mangaluru-Dasara'
    },
    aura: {
      id: 'SYS-03 // AI_AGENT',
      title: 'Aura Voice 2.0',
      tagline: 'Multimodal Personal AI Agent with Tool Execution & Persistent Memory',
      category: 'AI & Agents',
      status: 'DEPLOYED WEB AGENT',
      problem: 'Most voice assistants act as rigid single-turn command responders without multimodal understanding, persistent memory, or ability to reason across uploaded files.',
      concept: 'An autonomous personal agent that listens, sees, remembers past user context, reads uploaded documents, and executes multi-step computational tools.',
      implementation: 'Built with Next.js, TypeScript, and Supabase vector storage for long-term memory retrieval. Integrates browser Web Speech synthesis/recognition APIs, document parsing, and agentic tool dispatching.',
      stack: ['Next.js', 'TypeScript', 'Supabase', 'Web Speech API', 'Multimodal LLMs', 'Agentic Workflows'],
      liveUrl: 'https://auravoice-voicesssistant.vercel.app',
      githubUrl: 'https://github.com/Sharan126/VoiceAssistant'
    },
    docushield: {
      id: 'SYS-04 // SECURITY',
      title: 'DocuShield AI',
      tagline: 'AI-Assisted Document Integrity & Underwriting Forensics Platform',
      category: 'Security',
      status: 'HACKATHON FINALIST // CANARA BANK',
      problem: 'Financial underwriting is vulnerable to digital document tampering, forged seals, altered metadata, and spliced financial figures that bypass standard OCR.',
      concept: 'An end-to-end document forensics pipeline combining metadata inspection, pixel-level copy-move tamper detection, OCR layout checks, and signature cross-verification.',
      implementation: 'Engineered as a full-stack system with a FastAPI Python backend and Next.js frontend. Implemented computer vision image analysis filters, PDF EXIF metadata auditing, and cross-document anomaly detection models. Recognized as a Finalist at Canara Bank Suraksha Hackathon.',
      stack: ['FastAPI', 'Python', 'Next.js', 'Computer Vision', 'Document Forensics', 'OCR'],
      liveUrl: 'https://docu-shield-ai.vercel.app',
      githubUrl: 'https://github.com/Sharan126/DocuShield_AI'
    },
    gramya: {
      id: 'SYS-05 // RURAL_TECH',
      title: 'Gramya AI',
      tagline: 'Multilingual Rural Employment & AI-Assisted Assessment Platform',
      category: 'Social Impact',
      status: 'FINALIST // AI FOR BHARAT',
      problem: 'Rural workers face systemic language hurdles and paper barriers in discovering and qualifying for government and private employment schemes.',
      concept: 'A localized employment ecosystem with voice-first multilingual job discovery, guided video skill assessment, and automated fraud prevention.',
      implementation: 'Engineered using FastAPI, React, and Bhashini multilingual speech/translation APIs. Utilized sentence-transformers (MiniLM) for semantic opportunity matching, with background job queues managed via Celery, Redis, PostgreSQL, and MinIO storage in Docker. Finalist at HackerEarth AI for Bharat Hackathon.',
      stack: ['FastAPI', 'React', 'Bhashini API', 'MiniLM', 'Docker', 'PostgreSQL', 'Redis', 'Celery'],
      liveUrl: 'https://gramya-ai.vercel.app',
      githubUrl: 'https://github.com/Sharan126/Gramya-AI'
    },
    'yt-rag': {
      id: 'SYS-06 // RAG_PIPELINE',
      title: 'YT Chatbot RAG',
      tagline: 'Retrieval-Augmented Video Knowledge Extraction Platform',
      category: 'AI & Agents',
      status: 'OPEN SOURCE CONTAINER',
      problem: 'Consuming multi-hour technical lectures or tutorials to find a specific answer requires inefficient scrubbing and time-consuming manual skimming.',
      concept: 'A grounded RAG platform that indexes video transcripts, segments semantic chunks with timestamp offsets, and delivers cited answers with direct video anchors.',
      implementation: 'Built as a containerized Docker full-stack application. Employs text chunking with overlap, dense vector embeddings, cosine similarity search, and prompt grounding to prevent hallucinations while providing exact timestamp links.',
      stack: ['Python', 'RAG Architecture', 'Vector Search', 'LLMs', 'Docker', 'REST API'],
      liveUrl: 'https://github.com/Sharan126/YT-Chatbot-RAG',
      githubUrl: 'https://github.com/Sharan126/YT-Chatbot-RAG'
    },
    datawhisperer: {
      id: 'SYS-07 // SERVERLESS',
      title: 'DataWhisperer',
      tagline: 'Serverless Natural Language CSV Intelligence & Analytics',
      category: 'AI & Agents',
      status: 'AWS CLOUD PIPELINE',
      problem: 'Non-technical stakeholders struggle to query tabular data without knowing SQL or complex spreadsheet macros.',
      concept: 'A serverless web tool allowing users to upload arbitrary CSV files and query trends, anomalies, and correlations in conversational English.',
      implementation: 'Built with React on the frontend and an AWS serverless architecture: Amazon S3 for file ingestion, AWS Lambda for compute, and Amazon Bedrock foundation models for natural language data reasoning and chart generation.',
      stack: ['React', 'Python', 'AWS Lambda', 'Amazon S3', 'Amazon Bedrock', 'Serverless'],
      liveUrl: 'https://github.com/Sharan126/data-whisperer',
      githubUrl: 'https://github.com/Sharan126/data-whisperer'
    },
    parametric: {
      id: 'SYS-08 // CAD_FABRICATION',
      title: 'Parametric 3D-Printable Designs',
      tagline: 'Algorithmic Mechanical Modeling & Additive Fabrication',
      category: 'Creative & Engineering',
      status: 'PHYSICAL FABRICATION ARCHIVE',
      problem: 'Standard mechanical assemblies often require rigid tooling with high unit costs and slow iteration cycles for custom fitments.',
      concept: 'A portfolio of algorithmically parameterized mechanical parts and enclosures engineered specifically for FDM 3D printing tolerances.',
      implementation: 'Designed using parametric CAD equations with constraints for print orientation, overhang limits without supports, and snap-fit mechanical interlocks. Validated through physical prototyping and additive fabrication runs.',
      stack: ['Parametric CAD', 'Additive Manufacturing', 'Mechanical Tolerances', 'Rapid Prototyping'],
      liveUrl: 'https://sites.google.com/view/parametric-3d-printable-sharan/full-page-embed?authuser=1',
      githubUrl: 'https://sites.google.com/view/parametric-3d-printable-sharan/full-page-embed?authuser=1'
    },
    biosecurity: {
      id: 'SYS-09 // BIOSECURITY_AI',
      title: 'Karnataka Biosecurity Network',
      tagline: 'AI-Powered Livestock Epidemic Surveillance & Farmer-Vet Telemetry Platform',
      category: 'AI & Social Impact',
      status: '1ST PLACE NATIONAL WINNER',
      problem: 'Rural livestock farming communities face catastrophic regional disease contagions due to delayed early-symptom reporting and manual paper veterinary communication pipelines.',
      concept: 'A real-time distributed epidemic intelligence network combining computer vision symptom screening, contagion radius simulation, and automated farmer-veterinarian biosecurity alerts.',
      implementation: 'Engineered as a distributed bio-telemetry architecture with localized symptom classification models, disease contagion radius modeling, automated distress SMS/IVR dispatching, and regional quarantine zone mapping. Won 1st Place nationally at KLE Belagavi Hackathon 2026.',
      stack: ['Computer Vision', 'Epidemiological ML', 'Geo-Zoning', 'FastAPI', 'Tele-Vet Network'],
      liveUrl: '#achievements',
      githubUrl: 'https://github.com/Sharan126'
    }
  };

  // --- "HOW I THINK" 6-STEP WORKFLOW DATA ---
  const WORKFLOW_STEPS = [
    {
      index: '01',
      tag: 'STAGE: 01 // SYSTEM_PERCEPTION',
      title: 'Observe & Ground in Physical Reality',
      body: 'Every project begins outside the screen. As a mechanical engineering student, I investigate where real friction occurs: physical supply bottlenecks, thermal inefficiencies in electronics, animal disease outbreaks in farming communities, or manual underwriting backlogs.',
      caseLabel: 'REAL-WORLD EVIDENCE',
      caseText: 'In the Karnataka Biosecurity Network, we grounded our AI architecture directly in livestock veterinary communication gaps, winning 1st Place nationally.'
    },
    {
      index: '02',
      tag: 'STAGE: 02 // ASSUMPTION_DECONSTRUCTION',
      title: 'Question & Formulate the Core Constraint',
      body: 'I isolate the foundational bottleneck before writing a single line of code. Can we detect document tamper without sending raw customer documents to third-party APIs? Can an AI agent run speech synthesis with zero perceived audio stutter?',
      caseLabel: 'REAL-WORLD EVIDENCE',
      caseText: 'In DocuShield AI, questioning traditional OCR trust models led to our dual-layer forensic verification pipeline combining EXIF metadata, copy-move visual artifact detection, and signature layout validation.'
    },
    {
      index: '03',
      tag: 'STAGE: 03 // ARCHITECTURAL_MAPPING',
      title: 'Design Parametric & System Architecture',
      body: 'Bridging CAD parametric logic with software systems. I diagram state machines, API boundaries, database schemas, and mechanical tolerances. Rigorous structural mapping prevents technical debt before implementation begins.',
      caseLabel: 'REAL-WORLD EVIDENCE',
      caseText: 'Applied parametric equation constraints in CAD to ensure printable interlocks, mirrored in software by defining strict TypeScript interfaces and OpenAPI schemas in FastAPI.'
    },
    {
      index: '04',
      tag: 'STAGE: 04 // ITERATIVE_PROTOTYPING',
      title: 'Build Rapid Working Prototypes',
      body: 'Speed of learning beats perfection on paper. I assemble functioning full-stack software using modern stacks: Next.js, FastAPI, Three.js, Python, and multimodal LLMs, iterating rapidly with immediate visual feedback.',
      caseLabel: 'REAL-WORLD EVIDENCE',
      caseText: 'Shipped MacroSnap with Streamlit and Gemini vision APIs in days, giving users instant conversational nutrition diagnostics with live camera input.'
    },
    {
      index: '05',
      tag: 'STAGE: 05 // REAL_WORLD_VALIDATION',
      title: 'Test Under Extreme Constraints',
      body: 'Real validation occurs under pressure: competitive hackathon juries, adversarial document inputs, slow rural internet conditions, and edge-case testing.',
      caseLabel: 'REAL-WORLD EVIDENCE',
      caseText: 'Tested Gramya AI with simulated low-bandwidth rural connections and multilingual speech edge cases, earning Finalist honors at HackerEarth AI for Bharat.'
    },
    {
      index: '06',
      tag: 'STAGE: 06 // CONTINUOUS_REFINEMENT',
      title: 'Improve, Containerize & Package',
      body: 'A project is only complete when it is reproducible, documented, and maintainable. I containerize backends with Docker, optimize asset delivery, write thorough READMEs, and open-source repositories.',
      caseLabel: 'REAL-WORLD EVIDENCE',
      caseText: 'Containerized YT Chatbot RAG with complete Docker Compose configurations and modular vector search pipelines for zero-friction local deployment.'
    }
  ];

  // --- DOM INITIALIZATION ---
  document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initOscilloscope();
    initNavigation();
    initScrollReveals();
    initWorkflowBoard();
    initFeaturedSpotlight();
    initProjectFiltering();
    initCaseStudyModal();
    initSkillsTopology();
    initClipboard();
  });

  // 1. Live IST Clock & Telemetry
  function initClock() {
    const clockEl = document.getElementById('istClock');
    if (!clockEl) return;

    function update() {
      const now = new Date();
      // IST is UTC + 5:30
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const istDate = new Date(utc + (3600000 * 5.5));
      const hours = String(istDate.getHours()).padStart(2, '0');
      const minutes = String(istDate.getMinutes()).padStart(2, '0');
      const seconds = String(istDate.getSeconds()).padStart(2, '0');
      clockEl.textContent = `${hours}:${minutes}:${seconds} IST`;
    }
    update();
    setInterval(update, 1000);
  }

  // 2. Soundless Oscilloscope Telemetry Canvas
  function initOscilloscope() {
    const canvas = document.getElementById('oscilloscopeCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = 64;
    let height = canvas.height = 18;
    let phase = 0;
    let activity = 0.5;

    // Pulse activity on scroll or mouse move
    window.addEventListener('scroll', () => { activity = 1.0; }, { passive: true });
    window.addEventListener('mousemove', () => { activity = Math.min(activity + 0.05, 1.0); }, { passive: true });

    function draw() {
      requestAnimationFrame(draw);
      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();
      ctx.strokeStyle = '#d6fa77';
      ctx.lineWidth = 1.2;

      activity += (0.35 - activity) * 0.05;
      phase += 0.08 * (0.6 + activity);

      const midY = height / 2;
      for (let x = 0; x < width; x++) {
        const normX = x / width;
        const y = midY + Math.sin(normX * 8 + phase) * (height * 0.35 * activity);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    draw();
  }


  // 4. Navigation & Active Section Tracking
  function initNavigation() {
    const header = document.getElementById('siteHeader');
    const toggle = document.getElementById('menuToggle');
    const menu = document.getElementById('navMenu');
    const links = document.querySelectorAll('.nav-link');

    // Sticky header border
    window.addEventListener('scroll', () => {
      if (header) {
        header.classList.toggle('scrolled', window.scrollY > 20);
      }
    }, { passive: true });

    // Mobile menu toggle
    if (toggle && menu) {
      toggle.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(isOpen));
      });
      links.forEach(link => {
        link.addEventListener('click', () => {
          menu.classList.remove('open');
          if (toggle) toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY + 120;
      sections.forEach(sec => {
        const top = sec.offsetTop;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');
        if (scrollY >= top && scrollY < top + height) {
          links.forEach(l => {
            l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { passive: true });
  }

  // 5. Scroll Reveals
  function initScrollReveals() {
    const reveals = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      reveals.forEach(el => obs.observe(el));
    } else {
      reveals.forEach(el => el.classList.add('visible'));
    }
  }

  // 6. "How I Think" Interactive Engineering Workflow
  function initWorkflowBoard() {
    const stepBtns = document.querySelectorAll('.workflow-step-btn');
    const stageTag = document.getElementById('displayStageTag');
    const titleEl = document.getElementById('displayTitle');
    const bodyEl = document.getElementById('displayBody');
    const caseLabelEl = document.getElementById('displayCaseLabel');
    const caseTextEl = document.getElementById('displayCaseText');

    stepBtns.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        stepBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const stepData = WORKFLOW_STEPS[idx];
        if (!stepData) return;

        // Smooth fade update
        const card = document.getElementById('workflowDisplayCard');
        if (card) {
          card.style.opacity = '0.4';
          card.style.transform = 'translateY(4px)';
          setTimeout(() => {
            if (stageTag) stageTag.textContent = stepData.tag;
            if (titleEl) titleEl.textContent = stepData.title;
            if (bodyEl) bodyEl.textContent = stepData.body;
            if (caseLabelEl) caseLabelEl.textContent = stepData.caseLabel;
            if (caseTextEl) caseTextEl.textContent = stepData.caseText;
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 150);
        }
      });
    });
  }

  // 7. Project Filtering
  function initProjectFiltering() {
    const tabs = document.querySelectorAll('.filter-tab');
    const cards = document.querySelectorAll('.project-card');
    const counter = document.getElementById('projectsCounter');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.dataset.filter;
        let count = 0;

        cards.forEach(card => {
          const cat = card.dataset.category;
          const show = filter === 'all' || cat === filter;
          card.style.display = show ? 'flex' : 'none';
          if (show) count++;
        });

        if (counter) {
          counter.textContent = `${String(count).padStart(2, '0')} VERIFIED SYSTEMS`;
        }
      });
    });
  }

  // 8. Featured Project Spotlight Showcase Carousel
  function initFeaturedSpotlight() {
    const spotlight = document.getElementById('featuredSpotlight');
    if (!spotlight) return;

    const slides = spotlight.querySelectorAll('.spotlight-slide');
    const tabBtns = spotlight.querySelectorAll('.spotlight-tab-btn');
    const counter = document.getElementById('spotlightCounter');
    const prevBtn = document.getElementById('spotlightPrevBtn');
    const nextBtn = document.getElementById('spotlightNextBtn');
    const modal = document.getElementById('caseStudyModal');

    if (!slides.length) return;

    let currentIndex = 0;
    let timer = null;
    let isHovered = false;
    let isFocused = false;
    const totalSlides = slides.length;

    function canAutoCycle() {
      if (isHovered || isFocused) return false;
      if (modal && modal.classList.contains('open')) return false;
      return true;
    }

    function goToSlide(index) {
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;
      currentIndex = index;

      slides.forEach((slide, i) => {
        const isActive = i === currentIndex;
        slide.classList.toggle('active', isActive);
        slide.setAttribute('aria-hidden', String(!isActive));
      });

      tabBtns.forEach((btn, i) => {
        const isActive = i === currentIndex;
        btn.classList.toggle('active', isActive);
        btn.setAttribute('aria-selected', String(isActive));
      });

      if (counter) {
        counter.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(totalSlides).padStart(2, '0')}`;
      }
    }

    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    function prevSlide() {
      goToSlide(currentIndex - 1);
    }

    function startAutoCycle() {
      stopAutoCycle();
      if (!canAutoCycle()) return;
      timer = setInterval(nextSlide, 7000);
    }

    function stopAutoCycle() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    pauseSpotlightAutoCycle = stopAutoCycle;
    resumeSpotlightAutoCycle = () => {
      if (canAutoCycle()) startAutoCycle();
    };

    tabBtns.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        goToSlide(idx);
        if (canAutoCycle()) startAutoCycle();
      });
    });

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        if (canAutoCycle()) startAutoCycle();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        if (canAutoCycle()) startAutoCycle();
      });
    }

    // Pause on hover or focus; resume only when conditions permit
    spotlight.addEventListener('mouseenter', () => {
      isHovered = true;
      stopAutoCycle();
    });

    spotlight.addEventListener('mouseleave', () => {
      isHovered = false;
      if (canAutoCycle()) startAutoCycle();
    });

    spotlight.addEventListener('focusin', () => {
      isFocused = true;
      stopAutoCycle();
    });

    spotlight.addEventListener('focusout', (e) => {
      if (e.relatedTarget && spotlight.contains(e.relatedTarget)) {
        return;
      }
      isFocused = false;
      if (canAutoCycle()) startAutoCycle();
    });

    // Keyboard navigation (Arrow keys when spotlight has focus)
    spotlight.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        nextSlide();
        if (canAutoCycle()) startAutoCycle();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
        if (canAutoCycle()) startAutoCycle();
      }
    });

    // Touch swipe support for mobile with 2D axis isolation
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    spotlight.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
      touchStartY = e.changedTouches[0].clientY;
      stopAutoCycle();
    }, { passive: true });

    spotlight.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].clientX;
      touchEndY = e.changedTouches[0].clientY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
        if (diffX < 0) nextSlide();
        else prevSlide();
      }
      if (canAutoCycle()) startAutoCycle();
    }, { passive: true });

    startAutoCycle();
  }

  // 9. Project Deep-Dive Slide-Over Modal / Architecture Drawer
  function initCaseStudyModal() {
    const modal = document.getElementById('caseStudyModal');
    const closeBtn = document.getElementById('modalCloseBtn');
    const inspectBtns = document.querySelectorAll('.card-inspect-btn, .spotlight-inspect-btn');
    const liveBtn = document.getElementById('modalLiveBtn');
    const gitBtn = document.getElementById('modalGitBtn');

    if (!modal) return;

    function openModal(projectId) {
      const data = CASE_STUDIES[projectId];
      if (!data) return;

      if (pauseSpotlightAutoCycle) pauseSpotlightAutoCycle();

      document.getElementById('modalBlueprintId').textContent = data.id;
      document.getElementById('modalTitle').textContent = data.title;
      document.getElementById('modalTagline').textContent = data.tagline;
      document.getElementById('modalStatus').textContent = data.status;
      document.getElementById('modalProblem').textContent = data.problem;
      document.getElementById('modalConcept').textContent = data.concept;
      document.getElementById('modalImplementation').textContent = data.implementation;

      // Render stack badges
      const stackContainer = document.getElementById('modalStack');
      stackContainer.innerHTML = '';
      data.stack.forEach(tech => {
        const badge = document.createElement('span');
        badge.className = 'card-tag';
        badge.textContent = tech;
        stackContainer.appendChild(badge);
      });

      // Actions
      if (liveBtn) {
        liveBtn.href = data.liveUrl;
        if (data.liveUrl && data.liveUrl.startsWith('#')) {
          liveBtn.target = '_self';
          liveBtn.removeAttribute('rel');
        } else {
          liveBtn.target = '_blank';
          liveBtn.setAttribute('rel', 'noopener noreferrer');
        }
      }

      if (gitBtn) {
        gitBtn.href = data.githubUrl;
      }

      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      if (resumeSpotlightAutoCycle) resumeSpotlightAutoCycle();
    }

    if (liveBtn) {
      liveBtn.addEventListener('click', () => {
        const href = liveBtn.getAttribute('href');
        if (href && href.startsWith('#')) {
          closeModal();
        }
      });
    }

    inspectBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const card = btn.closest('.project-card, .spotlight-slide');
        const projKey = btn.dataset.project || (card ? card.dataset.project : null);
        if (projKey) openModal(projKey);
      });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });
  }

  // 9. Interactive Skills Topology & Cross-Highlighting
  function initSkillsTopology() {
    const skillNodes = document.querySelectorAll('.skill-node');
    const projectCards = document.querySelectorAll('.project-card');
    const activeNote = document.getElementById('skillActiveEvidence');

    // Mapping of skills to projects
    const SKILL_MAP = {
      'Python': ['macrosnap', 'docushield', 'gramya', 'yt-rag', 'datawhisperer'],
      'Generative AI': ['macrosnap', 'aura', 'docushield', 'gramya', 'yt-rag', 'datawhisperer'],
      'AI agents': ['aura', 'macrosnap', 'yt-rag'],
      'RAG': ['yt-rag', 'aura'],
      'Computer vision': ['docushield', 'macrosnap'],
      'FastAPI': ['docushield', 'gramya'],
      'Next.js': ['aura', 'docushield'],
      'React.js': ['gramya', 'datawhisperer'],
      'WebGL': ['dasara'],
      'Interactive 3D': ['dasara', 'parametric'],
      'Parametric design': ['parametric'],
      'Docker': ['gramya', 'yt-rag'],
      'AWS Lambda': ['datawhisperer'],
      'Supabase': ['aura']
    };

    skillNodes.forEach(node => {
      node.addEventListener('click', () => {
        const skillName = node.textContent.trim();
        const isAlreadyActive = node.classList.contains('highlighted');

        // Reset all
        skillNodes.forEach(n => n.classList.remove('highlighted'));
        projectCards.forEach(c => {
          c.style.borderColor = '';
          c.style.boxShadow = '';
        });

        if (!isAlreadyActive && SKILL_MAP[skillName]) {
          node.classList.add('highlighted');
          const matchedProjects = SKILL_MAP[skillName];

          projectCards.forEach(c => {
            if (matchedProjects.includes(c.dataset.project)) {
              c.style.borderColor = 'var(--lime)';
              c.style.boxShadow = '0 0 25px rgba(214, 250, 119, 0.25)';
            }
          });

          if (activeNote) {
            activeNote.textContent = `SELECTED: [${skillName}] → Evidenced in ${matchedProjects.length} projects highlighted in Projects section.`;
          }
        } else {
          if (activeNote) {
            activeNote.textContent = 'Click any skill to highlight its real-world implementation across project repositories.';
          }
        }
      });
    });
  }

  // 10. Email Copy-to-Clipboard with HUD Feedback
  function initClipboard() {
    const copyBtn = document.getElementById('copyEmailBtn');
    const feedback = document.getElementById('copyFeedback');
    if (!copyBtn || !feedback) return;

    copyBtn.addEventListener('click', () => {
      const email = 'sm9505659@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        feedback.classList.add('show');
        setTimeout(() => feedback.classList.remove('show'), 2500);
      }).catch(() => {
        window.location.href = `mailto:${email}`;
      });
    });
  }

})();
