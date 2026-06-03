# README العربي

# 🌐 لوحة تحكم OpenWrt MWAN3 Dashboard

لوحة تحكم احترافية وحديثة لإدارة دمج خطوط الإنترنت (Multi-WAN Load Balancing) في OpenWrt

## ✨ المميزات الرئيسية

### 🎛️ إدارة إعدادات MWAN3
- ✅ إضافة/تعديل/حذف واجهات الشبكة (WAN/LAN)
- ✅ تكوين قواعس الدمج والتوزيع التلقائي
- ✅ تحديد أولويات الخطوط (Priority Routing)
- ✅ إعدادات الفشل والعودة التلقائية (Failover)
- ✅ إدارة جداول التوجيه المتقدمة

### 📊 مراقبة جودة الخطوط (Health Check)
- 📈 مراقبة حي للـ Ping والـ Loss والسرعة
- 📉 رسوم بيانية توضيحية ومفصلة
- 🔴 تنبيهات فورية عند سقوط الخطوط
- 📅 سجل الأداء التاريخي والإحصائيات
- 🌍 اختبار الاتصال بخوادم متعددة

### ⚡ إدارة QoS والسرعات
- 🎯 تحديد حدود السرعة للمستخدمين
- 🎮 أولويات التطبيقات (Gaming, Streaming, Download)
- 📊 توزيع عادل للنطاق الترددي
- 🔒 حماية من الاستهلاك الزائد
- 👥 إدارة ملفات العائلات (Family Profiles)

### 🔐 الأمان والتحكم
- 🛡️ تسجيل دخول آمن مع كلمات مرور قوية
- 🔑 إدارة صلاحيات المستخدمين
- 📝 سجل العمليات (Audit Log)
- 🚫 حجب المواقع والتطبيقات

---

## 🚀 البدء السريع

### المتطلبات
- **Node.js** 14+
- **NPM** أو **Yarn**
- **OpenWrt** مع **MWAN3** مثبت بالفعل
- **SSH Access** للراوتر

### خطوات التثبيت

#### 1️⃣ استنساخ المستودع
```bash
git clone https://github.com/BakiAbaad/openwrt-mwan3-dashboard.git
cd openwrt-mwan3-dashboard
```

#### 2️⃣ تثبيت المكتبات
```bash
npm install
```

#### 3️⃣ إعداد ملف الإعدادات
```bash
cp config/config.example.json config/config.json
```

ثم عدّل `config/config.json` بإضافة بيانات الراوتر:
```json
{
  "router": {
    "host": "192.168.1.1",
    "port": 22,
    "username": "root",
    "password": "YOUR_PASSWORD"
  },
  "server": {
    "port": 3000,
    "host": "0.0.0.0"
  }
}
```

#### 4️⃣ تشغيل الخادم
```bash
npm start
```

الوصول للوحة التحكم:
- **الرابط:** http://localhost:3000
- **اسم المستخدم:** admin
- **كلمة المرور:** admin123 (غيرها فوراً)

---

## 📁 هيكل المشروع

```
openwrt-mwan3-dashboard/
│
├── backend/
│   ├── server.js                 # نقطة البداية الرئيسية
│   ├── routes/
│   │   ├── mwan3.routes.js       # مسارات MWAN3
│   │   ├── qos.routes.js         # مسارات QoS
│   │   ├── health.routes.js      # مسارات مراقبة الصحة
│   │   └── auth.routes.js        # مسارات المصادقة
│   ├── controllers/
│   │   ├── mwan3.controller.js   # معالج MWAN3
│   │   ├── qos.controller.js     # معالج QoS
│   │   ├── health.controller.js  # معالج الصحة
│   │   └── auth.controller.js    # معالج المصادقة
│   ├── services/
│   │   ├── ssh.service.js        # خد��ة SSH
│   │   ├── mwan3.service.js      # خدمة MWAN3
│   │   ├── qos.service.js        # خدمة QoS
│   │   └── health.service.js     # خدمة المراقبة
│   ├── middleware/
│   │   ├── auth.middleware.js    # التحقق من المصادقة
│   │   └── error.middleware.js   # معالجة الأخطاء
│   └── config/
│       └── config.json           # ملف الإعدادات
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx     # لوحة التحكم الرئيسية
│   │   │   ├── MWAN3Manager.jsx  # مدير MWAN3
│   │   │   ├── HealthMonitor.jsx # مراقب الصحة
│   │   │   ├── QoSManager.jsx    # مدير QoS
│   │   │   ├── Chart.jsx         # الرسوم البيانية
│   │   │   └── Navigation.jsx    # القائمة الجانبية
│   │   ├── pages/
│   │   │   ├── Login.jsx         # صفحة تسجيل الدخول
│   │   │   ├── Home.jsx          # الصفحة الرئيسية
│   │   │   └── Settings.jsx      # الإعدادات
│   │   ├── hooks/
│   │   │   ├── useAuth.js        # Hook للمصادقة
│   │   │   ├── useMWAN3.js       # Hook لـ MWAN3
│   │   │   └── useAPI.js         # Hook لطلب API
│   │   ├── App.jsx               # التطبيق الرئيسي
│   │   └── index.css             # الأنماط
│   ├── public/
│   │   ├── index.html
│   │   └── logo.png
│   └── package.json
│
├── docs/
│   ├── AR/
│   │   ├── SETUP.md              # دليل الإعداد بالعربية
│   │   ├── MWAN3_GUIDE.md        # شرح MWAN3
│   │   ├── QOS_GUIDE.md          # شرح QoS
│   │   └── TROUBLESHOOTING.md    # حل المشاكل
│   └── EN/
│       ├── SETUP.md
│       ├── API.md
│       └── ARCHITECTURE.md
│
├── scripts/
│   ├── install-mwan3.sh          # سكريبت تثبيت MWAN3
│   ├── setup-router.sh           # سكريبت إعداد الراوتر
│   └── backup-config.sh          # سكريبت النسخ الاحتياطي
│
├── tests/
│   ├── mwan3.test.js
│   ├── qos.test.js
│   └── health.test.js
│
├── .env.example                  # مثال ملف البيئة
├── .gitignore
├── package.json
└── README.md
```

---

## 📖 الوثائق الكاملة

- 📘 [دليل الإعداد الكامل](./docs/AR/SETUP.md)
- 📗 [شرح MWAN3 مفصل](./docs/AR/MWAN3_GUIDE.md)
- 📙 [شرح QoS والسرعات](./docs/AR/QOS_GUIDE.md)
- 📕 [حل المشاكل الشائعة](./docs/AR/TROUBLESHOOTING.md)
- 🌐 [API Documentation](./docs/EN/API.md)

---

## 🛠 الأوامر المهمة

```bash
# تشغيل في وضع التطوير مع Hot Reload
npm run dev

# بناء الإصدار النهائي
npm run build

# تشغيل الاختبارات
npm test

# التحقق من جودة الكود
npm run lint
```

---

## 🔌 الاتصال بـ OpenWrt عبر SSH

البرنامج يتصل تلقائياً بالراوتر عبر SSH ويقرأ/يعدل إعدادات MWAN3 من الملفات:
- `/etc/config/mwan3`
- `/etc/config/network`
- `/etc/config/qos`

---

## 📱 الواجهة الرسومية

### الصفحات الرئيسية:
1. **لوحة التحكم** - نظرة عامة على حالة النظام
2. **إدارة MWAN3** - تكوين الخطوط والقواعس
3. **مراقبة الصحة** - حالة كل خط إنترنت
4. **إدارة QoS** - توزيع السرعات والأولويات
5. **الإحصائيات** - رسوم بيانية مفصلة
6. **الإعدادات** - إعدادات النظام والأمان

---

## 🔒 الأمان

⚠️ **قبل النشر في الإنتاج:**
- غيّر كلمة السر الافتراضية
- استخدم HTTPS بدلاً من HTTP
- فعّل جدار حماية
- استخدم SSH Keys بدلاً من كلمات المرور

---

## 🐛 الإبلاغ عن الأخطاء

وجدت خطأ؟ أنشئ Issue هنا:
https://github.com/BakiAbaad/openwrt-mwan3-dashboard/issues

---

## 🤝 المساهمة

نرحب بالمساهمات! 🎉

1. اعمل Fork للمستودع
2. أنشئ فرع للميزة الجديدة: `git checkout -b feature/amazing-feature`
3. اكتب الكود واختبره
4. اعمل Commit: `git commit -m 'Add amazing feature'`
5. اعمل Push: `git push origin feature/amazing-feature`
6. أنشئ Pull Request

---

## 📞 التواصل والدعم

- 📧 البريد الإلكتروني: bakiabaad@example.com
- 💬 GitHub Issues: للإبلاغ والنقاش
- 🐦 Twitter: @BakiAbaad

---

## 📄 الترخيص

هذا المشروع مرخص تحت **MIT License** - استخدمه بحرية!

---

**تم الإنشاء بـ ❤️ لإدارة شبكات احترافية وموثوقة**

**آخر تحديث:** 2024
