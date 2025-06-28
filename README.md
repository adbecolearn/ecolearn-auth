# 🔐 EcoLearn Authentication

> Green computing authentication system untuk platform pembelajaran digital business di Akademi Digital Bandung.

## 🎯 **Overview**

EcoLearn Authentication adalah micro frontend untuk sistem autentikasi yang mengutamakan green computing dan sustainability. Dirancang khusus untuk penelitian Agentic AI dalam pembelajaran Digital Business dengan 300 mahasiswa.

## 🌱 **Green Computing Features**

### **Carbon Footprint Tracking**
- **Real-time monitoring**: Setiap interaksi user dilacak carbon footprintnya
- **Carbon budget**: Target < 0.5g CO2 per session
- **Visual indicator**: Status carbon footprint dengan color coding
- **Performance optimization**: Bundle size < 50KB

### **Energy Efficiency**
- **Minimal dependencies**: Pure vanilla JavaScript ES6+
- **Optimized animations**: Hardware-accelerated CSS transitions
- **Lazy loading**: Components dimuat sesuai kebutuhan
- **Efficient DOM manipulation**: Minimal reflows dan repaints

## 🔧 **Technical Architecture**

### **Technology Stack**
```
Frontend: HTML5 + CSS3 + Vanilla JavaScript ES6+
Shared Libraries: EcoLearn Shared (GitHub Pages CDN)
Authentication: PASETO-based tokens
Backend API: Go Fiber + MongoDB Atlas
Hosting: GitHub Pages (green hosting)
```

### **File Structure**
```
ecolearn-auth/
├── 📄 index.html              # Main authentication page
├── 📁 assets/
│   ├── 🎨 css/
│   │   └── auth.css           # Authentication styles
│   ├── 📜 js/
│   │   └── auth.js            # Authentication logic
│   └── 🖼️ images/
│       └── ecolearn-logo.svg  # EcoLearn logo
├── 📋 package.json            # Project configuration
└── 📖 README.md               # Documentation
```

## 🚀 **Features**

### **Authentication Forms**
- **Login**: Email + password dengan remember me
- **Register**: Pendaftaran mahasiswa dengan validasi akademik
- **Forgot Password**: Reset password via email
- **Real-time Validation**: Validasi form secara real-time
- **Password Strength**: Indikator kekuatan password

### **User Experience**
- **Tab Navigation**: Smooth switching antar form
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG 2.1 compliant
- **Loading States**: Visual feedback untuk semua actions
- **Error Handling**: User-friendly error messages

### **Security Features**
- **Academic Email Validation**: Hanya @digitalbdg.ac.id
- **Student ID Format**: Validasi format ADB001
- **Password Requirements**: Strong password policy
- **PASETO Tokens**: Secure authentication tokens
- **Session Management**: Auto-refresh dan timeout

## 🎓 **Academic Integration**

### **Student Registration**
```javascript
// Format yang diterima
{
  firstName: "John",
  lastName: "Doe", 
  email: "john.doe@digitalbdg.ac.id",
  studentId: "ADB001", // Format: ADB + 3 digits
  password: "SecurePass123",
  role: "student"
}
```

### **Experiment Groups**
- **openai_gpt4**: Menggunakan OpenAI GPT-4
- **local_llama2**: Menggunakan Local LLaMA 2
- **hybrid_adaptive**: Kombinasi cloud + local AI
- **control_group**: Tanpa AI assistance

## 📊 **Performance Metrics**

### **Green Computing Targets**
```
✅ Carbon Budget: < 0.5g CO2 per session
✅ Load Time: < 2 seconds
✅ Bundle Size: < 50KB total
✅ Energy Efficiency: Optimized algorithms
✅ Accessibility: WCAG 2.1 AA compliant
```

### **Real-time Monitoring**
- Carbon footprint tracking per user action
- Performance metrics collection
- Energy consumption estimation
- User behavior analytics untuk research

## 🛠️ **Development**

### **Local Development**
```bash
# Clone repository
git clone https://github.com/adbecolearn/ecolearn-auth.git
cd ecolearn-auth

# Start development server
npm run dev
# atau
python3 -m http.server 8000

# Open browser
open http://localhost:8000
```

### **Dependencies**
```javascript
// EcoLearn Shared Libraries (CDN)
import { 
    initEcoLearn, 
    carbonTracker, 
    apiService, 
    authUtils 
} from 'https://adbecolearn.github.io/ecolearn-shared/index.js';
```

### **Environment Configuration**
```javascript
// Automatic environment detection
const config = {
    development: {
        API_BASE_URL: 'http://localhost:8080',
        DEBUG_MODE: true
    },
    production: {
        API_BASE_URL: 'https://ecolearn-api.run.app',
        DEBUG_MODE: false
    }
};
```

## 🔗 **API Integration**

### **Authentication Endpoints**
```javascript
// Login
POST /v1/auth/login
{
  "email": "student@digitalbdg.ac.id",
  "password": "password123"
}

// Register
POST /v1/auth/register
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@digitalbdg.ac.id",
  "studentId": "ADB001",
  "password": "SecurePass123",
  "role": "student"
}

// Forgot Password
POST /v1/auth/forgot-password
{
  "email": "student@digitalbdg.ac.id"
}
```

### **Response Format**
```javascript
// Success Response
{
  "success": true,
  "message": "Login successful",
  "token": "v2.local.xxx...",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@digitalbdg.ac.id",
    "role": "student",
    "experimentGroup": "openai_gpt4"
  }
}

// Error Response
{
  "success": false,
  "message": "Invalid credentials",
  "error": "authentication_failed"
}
```

## 🌍 **Deployment**

### **GitHub Pages**
```bash
# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### **Live URLs**
- **Production**: https://adbecolearn.github.io/ecolearn-auth/
- **Repository**: https://github.com/adbecolearn/ecolearn-auth
- **Shared Libraries**: https://adbecolearn.github.io/ecolearn-shared/

## 🧪 **Testing**

### **Manual Testing**
1. Open authentication page
2. Test all three forms (login, register, forgot)
3. Verify real-time validation
4. Check carbon footprint tracking
5. Test responsive design
6. Verify accessibility features

### **Carbon Footprint Testing**
```javascript
// Check carbon metrics
const metrics = carbonTracker.getMetrics();
console.log('Carbon footprint:', metrics.totalCarbonGrams, 'g CO2');

// Check budget status
const budget = carbonTracker.getCarbonBudget();
console.log('Budget status:', budget.status);
```

## 📈 **Research Integration**

### **Data Collection**
- User authentication patterns
- Carbon footprint per user session
- Performance metrics
- Error rates dan user behavior
- A/B testing untuk different AI models

### **Analytics Events**
```javascript
// Tracked events
carbonTracker.track('auth_login_attempt', { email, timestamp });
carbonTracker.track('auth_tab_switch', { from, to });
carbonTracker.track('password_strength_check', { score, feedback });
carbonTracker.track('form_validation_error', { field, error });
```

## 🤝 **Contributing**

### **Development Guidelines**
1. Follow green computing principles
2. Maintain carbon budget < 0.5g CO2
3. Ensure accessibility compliance
4. Write semantic HTML
5. Use efficient CSS dan JavaScript
6. Test on multiple devices

### **Code Style**
- ES6+ JavaScript modules
- Semantic CSS class names
- BEM methodology untuk CSS
- JSDoc comments untuk functions
- Consistent indentation (2 spaces)

## 📄 **License**

MIT License - Supporting open source education dan green computing research.

## 🏫 **Academic Context**

**Institution**: Akademi Digital Bandung  
**Program**: Digital Business Study Program  
**Research**: Agentic AI in Digital Business Learning  
**Participants**: 300 students  
**Duration**: Academic Year 2024/2025  

---

**🌱 EcoLearn Authentication - Sustainable digital learning for the future! 🔐**
