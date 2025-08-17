#!/bin/bash
# setup.sh - Script para configurar el proyecto monday Reserve

echo "🚀 Configurando proyecto monday Reserve Landing Page..."

# Crear estructura de directorios
echo "📁 Creando estructura de directorios..."
mkdir -p netlify/functions

# Crear netlify.toml
echo "⚙️ Creando netlify.toml..."
cat > netlify.toml << 'EOF'
[build]
  functions = "netlify/functions"
  publish = "."

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/.netlify/functions/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
    Access-Control-Allow-Headers = "Content-Type, Authorization"
    Access-Control-Allow-Methods = "GET, POST, PUT, DELETE, OPTIONS"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

# Configuración de caché para assets estáticos
[[headers]]
  for = "/*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "/*.woff2"
  [headers.values]
    Cache-Control = "public, max-age=31536000"
EOF

# Crear package.json
echo "📦 Creando package.json..."
cat > package.json << 'EOF'
{
    "name": "monday-reserve-landing",
    "version": "1.0.0",
    "description": "Landing page exclusiva para el evento monday Reserve en México",
    "main": "index.html",
    "scripts": {
        "build": "echo 'Static site - no build needed'",
        "dev": "netlify dev",
        "deploy": "netlify deploy --prod",
        "test": "echo 'Testing endpoint...' && curl -X POST http://localhost:8888/.netlify/functions/monday-webhook"
    },
    "keywords": ["monday.com", "evento", "landing-page", "mexico"],
    "author": "monday.com Mexico",
    "license": "MIT",
    "dependencies": {},
    "devDependencies": {
        "netlify-cli": "^17.0.0"
    },
    "engines": {
        "node": ">=18.0.0"
    }
}
EOF

# Crear .gitignore
echo "🔒 Creando .gitignore..."
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Netlify
.netlify/
dist/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity
EOF

# Crear README.md
echo "📖 Creando README.md..."
cat > README.md << 'EOF'
# monday Reserve - Landing Page Exclusiva

Landing page para el evento exclusivo **monday Reserve** en Ciudad de México.

## 🎯 Características

- ✨ Diseño profesional y responsivo
- 🔗 Integración directa con monday.com
- 📱 Optimizado para móviles
- 🚀 Desplegado en Netlify
- 🎨 Tipografía Poppins y colores profesionales

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Backend**: Netlify Functions (Node.js)
- **Integración**: monday.com API v2
- **Hosting**: Netlify

## 📋 Configuración Rápida

1. **Clonar y configurar**:
   ```bash
   git clone <tu-repo>
   cd monday-reserve-landing
   chmod +x setup.sh
   ./setup.sh
   ```

2. **Instalar Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   netlify login
   ```

3. **Configurar variables de entorno**:
   ```bash
   netlify env:set MONDAY_API_TOKEN "tu_token_aqui"
   ```

4. **Probar localmente**:
   ```bash
   netlify dev
   ```

5. **Desplegar**:
   ```bash
   netlify deploy --prod
   ```

## 🔧 Configuración de monday.com

### Tablero: 9819426015 - "Registro de Invitados"

**Columnas requeridas:**
- `name` - Nombre (texto)
- `text_mkttwsxe` - Nombre del Invitado
- `email_mkttdysy` - Correo Electrónico  
- `phone_mktt53e7` - Teléfono
- `text_mkttf67d` - Empresa
- `color_mkttd2ew` - Estado (Registrado/Confirmado/Rechazado)
- `long_text_mkttfbxz` - Solicitudes Especiales
- `long_text_mkttkqhg` - Mensaje de Confirmación

## 📊 Estructura del Proyecto

```
monday-reserve-landing/
├── index.html                     # Landing page principal
├── netlify/
│   └── functions/
│       └── monday-webhook.js      # API para monday.com
├── netlify.toml                   # Configuración Netlify
├── package.json                   # Dependencias
├── .gitignore                     # Archivos ignorados
└── README.md                      # Documentación
```

## 🎨 Personalización

### Colores del Brand
```css
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --accent-color: #6c5ce7;
    --success-color: #00b894;
}
```

### Tipografía
- **Fuente principal**: Poppins (Google Fonts)
- **Pesos**: 300, 400, 500, 600, 700

## 🔐 Seguridad

- ✅ Token API en variables de entorno
- ✅ Validación de entrada en backend
- ✅ Headers de seguridad configurados
- ✅ CORS apropiado
- ✅ Rate limiting implementado

## 📈 Analytics

Para habilitar Google Analytics, agregar el tracking ID en las variables de entorno:
```bash
netlify env:set GA_MEASUREMENT_ID "G-XXXXXXXXXX"
```

## 🚨 Troubleshooting

### Error 500 en formulario
```bash
# Verificar logs
netlify logs

# Verificar variables
netlify env:list
```

### No aparecen datos en monday.com
- Verificar Board ID: `9819426015`
- Verificar columnas y sus IDs
- Probar API token con Postman

## 📞 Soporte

- **Logs**: `netlify logs`
- **Testing local**: `netlify dev`
- **Monday.com API**: https://developer.monday.com/

---

Desarrollado para **monday.com México** 🇲🇽
EOF

# Crear archivo de variables de entorno de ejemplo
echo "🔐 Creando .env.example..."
cat > .env.example << 'EOF'
# monday.com API Configuration
MONDAY_API_TOKEN=tu_token_de_monday_com_aqui

# Optional: Google Analytics
GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Board Configuration
MONDAY_BOARD_ID=9819426015
EOF

echo ""
echo "✅ ¡Proyecto configurado exitosamente!"
echo ""
echo "📝 Próximos pasos:"
echo "1. Configurar tu token de Monday.com: netlify env:set MONDAY_API_TOKEN 'tu_token'"
echo "2. Probar localmente: netlify dev"
echo "3. Desplegar: netlify deploy --prod"
echo ""
echo "🔗 URLs importantes:"
echo "- Tablero Monday.com: https://partners-latam.monday.com/boards/9819426015"
echo "- Documentación API: https://developer.monday.com/"
echo ""
echo "¡Listo para el evento monday Reserve! 🎉"