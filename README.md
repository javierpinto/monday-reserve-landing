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
