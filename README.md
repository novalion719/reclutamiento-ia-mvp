# Reclutamiento IA MVP

Landing page de reclutamiento con filtrado automático de candidatos usando IA.

## 🚀 Características

- **Formulario de postulación** con subida de CV en PDF
- **Integración con n8n** para automatización del proceso
- **Análisis con Gemini AI** para evaluar candidatos
- **Diseño moderno** con glassmorphism y animaciones
- **Carrusel de testimonios** automático
- **Gráfico de crecimiento** con Chart.js

## 📁 Estructura

```
├── index.html    # Página principal
├── style.css     # Estilos
├── script.js     # Lógica del formulario y UI
└── README.md     # Este archivo
```

## 🔗 Integración

El formulario envía datos a n8n via webhook:
- Nombre completo
- Email y teléfonos
- Cargo al que aplica
- Archivo PDF del CV
- Timestamp de envío

## 🛠️ Despliegue

Puede desplegarse en cualquier hosting estático:
- Vercel
- Netlify
- GitHub Pages

## 📝 Licencia

MIT
