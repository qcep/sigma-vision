/**
 * ============================================
 * SCRIPT.JS - EstructuralPro
 * Toda la interactividad de la página
 * ============================================
 */

document.addEventListener('DOMContentLoaded', function() {

    // ==========================================
    // 1. MENÚ HAMBURGUESA
    // ==========================================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('open');
        });

        // Cerrar menú al hacer clic en un enlace
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('open');
            });
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('open');
            }
        });
    }

    // ==========================================
    // 2. NAVBAR CON EFECTO DE SCROLL
    // ==========================================
    const header = document.getElementById('header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Cambiar fondo del header
        if (scrollTop > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScrollTop = scrollTop;
    });

    // ==========================================
    // 3. ENLACE ACTIVO EN EL NAV (SCROLLSPY)
    // ==========================================
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-menu a:not(.btn-nav-cta)');

    function updateActiveNav() {
        const scrollPosition = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === '#' + sectionId) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);
    window.addEventListener('load', updateActiveNav);

    // ==========================================
    // 4. CONTADORES ANIMADOS
    // ==========================================
    const counters = document.querySelectorAll('.stat-number');
    let countersAnimated = false;
    let animationTriggered = false;

    function animateCounters() {
        if (animationTriggered) return;

        const triggerPoint = window.scrollY + window.innerHeight - 100;

        counters.forEach(counter => {
            const counterTop = counter.getBoundingClientRect().top + window.scrollY;

            if (triggerPoint > counterTop) {
                animationTriggered = true;
                countersAnimated = true;

                counters.forEach(count => {
                    const target = parseInt(count.getAttribute('data-count'));
                    const duration = 2000; // 2 segundos
                    const stepTime = 20;
                    const totalSteps = duration / stepTime;
                    let current = 0;
                    const increment = target / totalSteps;

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        // Para el caso especial de "Fallos estructurales" (0)
                        if (target === 0) {
                            count.textContent = '0';
                            clearInterval(timer);
                        } else {
                            count.textContent = Math.floor(current);
                        }
                    }, stepTime);
                });
            }
        });
    }

    // Ejecutar al cargar y al hacer scroll
    window.addEventListener('load', function() {
        setTimeout(animateCounters, 500);
    });

    window.addEventListener('scroll', animateCounters);

    // ==========================================
    // 5. SCROLL SUAVE PARA ENLACES ANCLA
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            // Ignorar si es solo "#" o está vacío
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();

                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ==========================================
    // 6. VALIDACIÓN DEL FORMULARIO
    // ==========================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Limpiar mensajes de error anteriores
            const existingErrors = this.querySelectorAll('.form-error');
            existingErrors.forEach(err => err.remove());

            let isValid = true;

            // Validar campos
            const nombre = document.getElementById('nombre');
            const email = document.getElementById('email');
            const telefono = document.getElementById('telefono');
            const proyecto = document.getElementById('proyecto');
            const mensaje = document.getElementById('mensaje');

            // Validar nombre
            if (!nombre.value.trim() || nombre.value.trim().length < 2) {
                showError(nombre, 'Por favor, ingresa tu nombre completo');
                isValid = false;
            }

            // Validar email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email.value.trim() || !emailRegex.test(email.value.trim())) {
                showError(email, 'Por favor, ingresa un correo electrónico válido');
                isValid = false;
            }

            // Validar teléfono (opcional pero con formato)
            if (telefono.value.trim()) {
                const phoneRegex = /^[0-9\s\-\(\)\+]{8,15}$/;
                if (!phoneRegex.test(telefono.value.trim())) {
                    showError(telefono, 'Ingresa un número de teléfono válido');
                    isValid = false;
                }
            }

            // Validar proyecto
            if (!proyecto.value) {
                showError(proyecto, 'Por favor, selecciona el tipo de proyecto');
                isValid = false;
            }

            // Validar mensaje
            if (!mensaje.value.trim() || mensaje.value.trim().length < 10) {
                showError(mensaje, 'Por favor, describe tu proyecto con al menos 10 caracteres');
                isValid = false;
            }

            if (isValid) {
                // Simular envío exitoso
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;

                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
                submitBtn.disabled = true;

                setTimeout(() => {
                    // Mostrar mensaje de éxito
                    const successDiv = document.createElement('div');
                    successDiv.className = 'form-success';
                    successDiv.innerHTML = `
                        <i class="fas fa-check-circle"></i>
                        <p>¡Mensaje enviado con éxito!<br>
                        <small>Te contactaremos en menos de 24 horas.</small></p>
                    `;
                    contactForm.innerHTML = '';
                    contactForm.appendChild(successDiv);

                    // Resetear después de 5 segundos (por si quieren enviar otro)
                    setTimeout(() => {
                        location.reload();
                    }, 5000);
                }, 2000);
            }
        });

        // Función para mostrar errores
        function showError(input, message) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'form-error';
            errorDiv.style.cssText = `
                color: #e94560;
                font-size: 0.8rem;
                font-weight: 600;
                margin-top: 4px;
                display: flex;
                align-items: center;
                gap: 6px;
            `;
            errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;

            // Insertar después del input o select
            input.parentNode.appendChild(errorDiv);

            // Marcar el input como error
            input.style.borderColor = '#e94560';
            input.style.background = 'rgba(233, 69, 96, 0.04)';

            // Quitar el error cuando el usuario empiece a escribir
            input.addEventListener('input', function() {
                this.style.borderColor = '#e8e8e8';
                this.style.background = '#fafafa';
                const error = this.parentNode.querySelector('.form-error');
                if (error) error.remove();
            });

            input.addEventListener('change', function() {
                this.style.borderColor = '#e8e8e8';
                this.style.background = '#fafafa';
                const error = this.parentNode.querySelector('.form-error');
                if (error) error.remove();
            });
        }
    }

    // ==========================================
    // 7. NEWSLETTER DEL FOOTER
    // ==========================================
    const footerForm = document.querySelector('.footer-form');

    if (footerForm) {
        footerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const input = this.querySelector('input');
            const email = input.value.trim();

            if (email && email.includes('@')) {
                // Simular suscripción
                const btn = this.querySelector('button');
                const originalIcon = btn.innerHTML;

                btn.innerHTML = '<i class="fas fa-check"></i>';
                btn.style.background = '#2ecc71';

                input.value = '';
                input.placeholder = '¡Gracias por suscribirte!';

                setTimeout(() => {
                    btn.innerHTML = originalIcon;
                    btn.style.background = '';
                    input.placeholder = 'Tu correo';
                }, 3000);
            } else {
                input.style.borderColor = '#e94560';
                input.placeholder = 'Ingresa un correo válido';

                setTimeout(() => {
                    input.style.borderColor = '';
                    input.placeholder = 'Tu correo';
                }, 3000);
            }
        });
    }

    // ==========================================
    // 8. ANIMACIÓN DE REVELADO AL SCROLL
    // (Efecto fade-in para elementos)
    // ==========================================
    const revealElements = document.querySelectorAll('.service-card, .project-card, .testimonial-card, .step');

    function revealOnScroll() {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            if (elementTop < windowHeight - 50) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }

    // Configurar estado inicial de los elementos
    revealElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    });

    // Ejecutar al cargar y al hacer scroll
    window.addEventListener('load', function() {
        setTimeout(revealOnScroll, 300);
    });

    window.addEventListener('scroll', revealOnScroll);

    // ==========================================
    // 9. EFECTO PARALLAX EN EL HERO
    // ==========================================
    const hero = document.querySelector('.hero');

    window.addEventListener('scroll', function() {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;

        if (hero && scrollY < hero.offsetHeight) {
            hero.style.backgroundPositionY = scrollY * 0.3 + 'px';
        }
    });

    // ==========================================
    // 10. EFECTO DE CARGA (Preloader opcional)
    // ==========================================
    // Pequeño efecto de entrada para el hero
    const heroContent = document.querySelector('.hero-content');
    const heroVisual = document.querySelector('.hero-visual');

    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(20px)';
        heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }

    if (heroVisual) {
        heroVisual.style.opacity = '0';
        heroVisual.style.transform = 'scale(0.95)';
        heroVisual.style.transition = 'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s';

        setTimeout(() => {
            heroVisual.style.opacity = '1';
            heroVisual.style.transform = 'scale(1)';
        }, 500);
    }

    // ==========================================
    // 11. TELÉFONO CON FORMATO AUTOMÁTICO
    // ==========================================
    const phoneInput = document.getElementById('telefono');

    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            // Solo números, espacios y guiones
            this.value = this.value.replace(/[^0-9\s\-\(\)\+]/g, '');
        });
    }

    // ==========================================
    // 12. SELECCIÓN DE PROYECTO CON BÚSQUEDA
    // (Mejora UX en móviles)
    // ==========================================
    const projectSelect = document.getElementById('proyecto');

    if (projectSelect) {
        // Añadir un placeholder visual
        const defaultOption = projectSelect.querySelector('option[value=""]');
        if (defaultOption) {
            defaultOption.textContent = 'Selecciona el tipo de proyecto...';
        }
    }

    console.log('🚀 EstructuralPro - Página cargada correctamente');
    console.log('📐 Ingeniería estructural de precisión');
});