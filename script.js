document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------
    // 1. CHART.JS CONFIGURATION
    // ---------------------------------------------------------
    const ctx = document.getElementById('growthChart').getContext('2d');

    const gradient = ctx.createLinearGradient(0, 0, 0, 160);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.5)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
            datasets: [{
                label: 'Nuevos Talentos',
                data: [12, 19, 25, 32, 45, 60],
                borderColor: '#6366f1',
                backgroundColor: gradient,
                borderWidth: 2,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#6366f1',
                pointRadius: 3,
                pointHoverRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#fff',
                    bodyColor: '#cbd5e1',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#94a3b8', font: { size: 10 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#94a3b8', font: { size: 10 } }
                }
            }
        }
    });

    // ---------------------------------------------------------
    // 2. EXPAND/COLLAPSE JOB DETAILS (Ver más / Ver menos)
    // ---------------------------------------------------------
    const toggleButtons = document.querySelectorAll('.toggle-details');

    toggleButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card click

            const targetId = button.getAttribute('data-target');
            const content = document.getElementById(targetId);

            if (content.classList.contains('expanded')) {
                // Collapse
                content.classList.remove('expanded');
                button.classList.remove('active');
                button.textContent = 'Ver más ▼';
            } else {
                // Expand
                content.classList.add('expanded');
                button.classList.add('active');
                button.textContent = 'Ver menos ▲';
            }
        });
    });

    // ---------------------------------------------------------
    // 3. TESTIMONIAL CAROUSEL
    // ---------------------------------------------------------
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    let currentSlide = 0;
    let autoSlideInterval;
    const AUTO_SLIDE_DELAY = 5000;

    function showSlide(index) {
        if (index >= slides.length) index = 0;
        if (index < 0) index = slides.length - 1;

        currentSlide = index;

        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) slide.classList.add('active');
        });

        dots.forEach((dot, i) => {
            dot.classList.remove('active');
            if (i === index) dot.classList.add('active');
        });
    }

    function nextSlide() { showSlide(currentSlide + 1); }
    function prevSlide() { showSlide(currentSlide - 1); }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, AUTO_SLIDE_DELAY);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }

    prevBtn.addEventListener('click', () => { prevSlide(); resetAutoSlide(); });
    nextBtn.addEventListener('click', () => { nextSlide(); resetAutoSlide(); });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => { showSlide(index); resetAutoSlide(); });
    });

    startAutoSlide();

    // ---------------------------------------------------------
    // 4. MODAL LOGIC
    // ---------------------------------------------------------
    const modal = document.getElementById('applicationModal');
    const closeModalBtn = document.getElementById('closeModal');
    const modalTitle = document.getElementById('modalTitle');
    const jobRoleInput = document.getElementById('jobRole');

    window.openModal = function (roleName) {
        modalTitle.textContent = `Aplicando para: ${roleName}`;
        jobRoleInput.value = roleName;
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };

    function closeModal() {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
    });

    // ---------------------------------------------------------
    // 5. FILE UPLOAD
    // ---------------------------------------------------------
    const form = document.getElementById('recruitmentForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    const cvInput = document.getElementById('cvFile');
    const dropArea = document.getElementById('dropArea');
    const filePreview = document.getElementById('filePreview');
    const fileName = document.getElementById('fileName');
    const removeFileBtn = document.getElementById('removeFile');
    const successMessage = document.getElementById('successMessage');
    const closeSuccessBtn = document.getElementById('closeSuccessBtn');

    // Production webhook (requires workflow to be active in n8n)
    const WEBHOOK_URL = 'https://n8n-n8n.4043xj.easypanel.host/webhook/recruitment-mvp';

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        }, false);
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.classList.add('dragover'));
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.classList.remove('dragover'));
    });

    dropArea.addEventListener('drop', (e) => handleFiles(e.dataTransfer.files));
    cvInput.addEventListener('change', function () { handleFiles(this.files); });

    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            if (file.type === 'application/pdf') {
                fileName.textContent = file.name;
                dropArea.classList.add('hidden');
                filePreview.classList.remove('hidden');

                if (cvInput.files.length === 0 || cvInput.files[0] !== file) {
                    const dt = new DataTransfer();
                    dt.items.add(file);
                    cvInput.files = dt.files;
                }
            } else {
                alert('⚠️ Solo se permiten archivos PDF.');
            }
        }
    }

    removeFileBtn.addEventListener('click', () => {
        cvInput.value = '';
        dropArea.classList.remove('hidden');
        filePreview.classList.add('hidden');
    });

    // ---------------------------------------------------------
    // 6. FORM SUBMISSION
    // ---------------------------------------------------------
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!form.checkValidity()) return form.reportValidity();

        setLoading(true);
        const formData = new FormData(form);

        // Add timestamp (Colombia timezone: UTC-5)
        const now = new Date();
        const colombiaTime = new Date(now.getTime() - (5 * 60 * 60 * 1000));
        const timestamp = colombiaTime.toISOString().replace('T', ' ').substring(0, 19);
        formData.append('submittedAt', timestamp);

        try {
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            form.classList.add('hidden');
            successMessage.classList.remove('hidden');
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Error al enviar. Por favor intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    });

    function setLoading(isLoading) {
        if (isLoading) {
            btnText.classList.add('hidden');
            btnLoader.classList.remove('hidden');
            submitBtn.disabled = true;
        } else {
            btnText.classList.remove('hidden');
            btnLoader.classList.add('hidden');
            submitBtn.disabled = false;
        }
    }

    closeSuccessBtn.addEventListener('click', () => {
        closeModal();
        setTimeout(() => {
            form.reset();
            form.classList.remove('hidden');
            successMessage.classList.add('hidden');
            dropArea.classList.remove('hidden');
            filePreview.classList.add('hidden');
        }, 500);
    });
});
