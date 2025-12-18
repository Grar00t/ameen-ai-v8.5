# ameen-ai-v8.5 🤖

**AMEEN AI v8.5** - نظام محادثة ذكي مع واجهة عربية وانتشار تلقائي على Azure Static Web Apps

## 📋 نظرة عامة

مشروع واجهة محادثة ذكية بالعربية مع:
- ✅ تصميم **RTL** كامل للغة العربية
- ✅ واجهة **Tailwind CSS** داكنة وعصرية
- ✅ مؤشر تفكير متحرك باستخدام **Lottie**
- ✅ نشر تلقائي على **Azure Static Web Apps**
- ✅ **Import Maps** لـ React بدون Build Tools

## 🚀 النشر السريع على Azure

### 1️⃣ إنشاء مورد Azure Static Web Apps

```bash
# سجّل الدخول إلى Azure
az login

# أنشئ Resource Group (إن لم يكن موجوداً)
az group create --name rg-ameen-prod --location eastus

# أنشئ Static Web App
az staticwebapp create \
  --name ameen-ai-v85 \
  --resource-group rg-ameen-prod \
  --source https://github.com/YOUR_USERNAME/ameen-ai-v8.5 \
  --location eastus2 \
  --branch main \
  --app-location "/" \
  --login-with-github
```

### 2️⃣ الحصول على Deployment Token

من **Azure Portal**:
1. افتح موردك: **Static Web Apps** → `ameen-ai-v85`
2. من القائمة اليسرى: **Settings** → **Configuration**
3. انسخ قيمة **Deployment token**

أو عبر CLI:
```bash
az staticwebapp secrets list \
  --name ameen-ai-v85 \
  --resource-group rg-ameen-prod \
  --query "properties.apiKey" -o tsv
```

### 3️⃣ إضافة Secret في GitHub

1. افتح مستودعك على GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. اضغط **New repository secret**
4. الاسم: `AZURE_STATIC_WEB_APPS_API_TOKEN`
5. القيمة: التوكن الذي نسخته من Azure
6. احفظ بـ **Add secret**

### 4️⃣ تفعيل النشر التلقائي ✅

الآن أي `git push` للفرع `main` = نشر تلقائي! 🎉

```bash
git add .
git commit -m "Deploy to Azure"
git push origin main
```

تابع التقدم في:
- GitHub: **Actions** tab
- Azure Portal: Static Web App → **Deployments**

## 🔐 النشر الداخلي (Private Endpoint)

للمستشفيات التي تحتاج وصولاً داخلياً فقط:

### تفعيل Private Endpoint

```bash
# أنشئ Virtual Network
az network vnet create \
  --resource-group rg-ameen-prod \
  --name vnet-hospital \
  --address-prefix 10.0.0.0/16 \
  --subnet-name subnet-ameen \
  --subnet-prefix 10.0.1.0/24

# أنشئ Private Endpoint لـ Static Web App
az staticwebapp update \
  --name ameen-ai-v85 \
  --resource-group rg-ameen-prod \
  --sku Standard  # يتطلب Standard SKU

az network private-endpoint create \
  --resource-group rg-ameen-prod \
  --name pe-ameen-swa \
  --vnet-name vnet-hospital \
  --subnet subnet-ameen \
  --private-connection-resource-id $(az staticwebapp show -n ameen-ai-v85 -g rg-ameen-prod --query id -o tsv) \
  --group-id staticSites \
  --connection-name ameen-private-connection
```

### ربط DNS الداخلي

```bash
# أنشئ Private DNS Zone
az network private-dns zone create \
  --resource-group rg-ameen-prod \
  --name privatelink.azurestaticapps.net

# اربطها بالـ VNet
az network private-dns link vnet create \
  --resource-group rg-ameen-prod \
  --zone-name privatelink.azurestaticapps.net \
  --name ameen-dns-link \
  --virtual-network vnet-hospital \
  --registration-enabled false
```

الآن الموقع **متاح فقط داخل الشبكة الداخلية** مع **استمرار النشر التلقائي** من GitHub! 🔒

## 📁 هيكل المشروع

```
ameen-ai-v8.5/
├── index.html              # الواجهة الرئيسية (RTL + Tailwind)
├── index.js                # منطق React + Lottie
├── assets/
│   └── neural_pulse.json   # مؤشر التفكير المتحرك
├── .github/
│   └── workflows/
│       └── azure-swa.yml   # نشر تلقائي لـ Azure
└── README.md
```

## 🎨 المميزات

### مؤشر التفكير (Lottie)
- **3 ثوانٍ** loop
- **60 FPS** سلس
- ألوان **أزرق→بنفسجي** متناسقة مع الواجهة

### حالات المحادثة
1. 📥 **تم الاستلام** - استقبال الرسالة
2. 🔍 **جارٍ التحليل** - معالجة المدخلات
3. ✍️ **يتم إنشاء الرد** - توليد الاستجابة
4. ✅ **محسّن** - جاهز للاستخدام

## 🛠 التطوير المحلي

```bash
# استنساخ المستودع
git clone https://github.com/Grar00t/ameen-ai-v8.5.git
cd ameen-ai-v8.5

# افتح بخادم HTTP بسيط
python -m http.server 8000
# أو
npx serve

# افتح المتصفح:
open http://localhost:8000
```

## 📦 تفعيل GitHub Pages (معاينة سريعة)

1. **Settings** → **Pages**
2. **Source**: Deploy from a branch
3. **Branch**: `main` / `/` (root)
4. احفظ واحصل على الرابط خلال دقائق

## 📚 المراجع

- [Azure Static Web Apps Docs](https://learn.microsoft.com/azure/static-web-apps/)
- [GitHub Actions for Azure](https://github.com/Azure/static-web-apps-deploy)
- [Lottie Web Player](https://airbnb.io/lottie/)
- [Tailwind CSS RTL](https://tailwindcss.com/docs/text-direction)

---

**Built with ❤️ for KSAU-HS Healthcare Innovation**
