# BaDaFuTa

Hệ thống foodfast cho phép khách hàng có thể đặt đồ ăn và thanh toán online và các đối tác có thể thiết lập menu và nhận đơn đồ ăn từ khách hàng

## Tính năng



## Cài đặt


### Clone repo
```bash
git clone https://github.com/letandat1607/BaDaFuTa.git
```
### Cài dependencies
```bash
## backend
### gateway
cd backend/gateway
npm install

### userService
cd backend/userService
npm install

### merchantService
cd backend/merchantService
npm install

### orderService
cd backend/orderService
npm install

### paymentService
cd backend/paymentService
npm install

## frontend
cd frontend
npm install
```
### Chạy project
```bash
##Add .env
touch .env
## backend
### gateway
cd backend/gateway
npm run dev

### userService
cd backend/userService
npm run dev

### merchantService
cd backend/merchantService
npm run dev

### orderService
cd backend/orderService
npm run dev

### paymentService
cd backend/paymentService
npm install

## frontend
cd frontend
npm run dev
```
## Kiến trúc dự án
```

├── 📁 backend
│   ├── 📁 gateway
│   │   ├── 📁 src
│   │   │   └── 📁 helpers
│   │   │       └── 📄 middleware.js
│   │   ├── 🐳 Dockerfile
│   │   ├── 📄 Dockerfile.dev
│   │   ├── 📄 app.js
│   │   ├── ⚙️ package-lock.json
│   │   └── ⚙️ package.json
│   ├── 📁 merchantService
│   │   ├── 📁 src
│   │   │   ├── 📁 controllers
│   │   │   │   └── 📄 merchantController.js
│   │   │   ├── 📁 helpers
│   │   │   │   └── 📄 middleware.js
│   │   │   ├── 📁 models
│   │   │   │   ├── 📄 category.js
│   │   │   │   ├── 📄 index.js
│   │   │   │   ├── 📄 menuItem.js
│   │   │   │   ├── 📄 menuItemOption.js
│   │   │   │   ├── 📄 merchant.js
│   │   │   │   ├── 📄 option.js
│   │   │   │   └── 📄 optionItem.js
│   │   │   ├── 📁 utils
│   │   │   │   └── 📄 db.js
│   │   │   └── 📁 validations
│   │   │       ├── 📄 categoryValidation.js
│   │   │       ├── 📄 menuItemOptionValidation.js
│   │   │       ├── 📄 menuItemValidation.js
│   │   │       ├── 📄 merchantValidation.js
│   │   │       ├── 📄 optionItemValidation.js
│   │   │       └── 📄 optionValidation.js
│   │   ├── 🐳 Dockerfile
│   │   ├── 📄 Dockerfile.dev
│   │   ├── 📄 app.js
│   │   ├── ⚙️ package-lock.json
│   │   └── ⚙️ package.json
│   ├── 📁 orderService
│   │   ├── 📁 src
│   │   │   ├── 📁 controllers
│   │   │   │   └── 📄 orderController.js
│   │   │   ├── 📁 models
│   │   │   │   ├── 📄 cart.js
│   │   │   │   ├── 📄 cartItem.js
│   │   │   │   ├── 📄 cartItemOption.js
│   │   │   │   ├── 📄 index.js
│   │   │   │   ├── 📄 order.js
│   │   │   │   ├── 📄 orderItem.js
│   │   │   │   └── 📄 otherItemOption.js
│   │   │   ├── 📁 utils
│   │   │   │   └── 📄 db.js
│   │   │   └── 📁 validations
│   │   │       ├── 📄 cartItemOptionValidation.js
│   │   │       ├── 📄 cartItemValidation.js
│   │   │       ├── 📄 cartValidation.js
│   │   │       ├── 📄 orderItemOptionValidation.js
│   │   │       ├── 📄 orderItemValidation.js
│   │   │       └── 📄 orderValidation.js
│   │   ├── 🐳 Dockerfile
│   │   ├── 📄 Dockerfile.dev
│   │   ├── 📄 app.js
│   │   ├── ⚙️ package-lock.json
│   │   └── ⚙️ package.json
│   ├── 📁 paymentService
│   │   ├── 📁 src
│   │   │   ├── 📁 controllers
│   │   │   │   └── 📄 paymentController.js
│   │   │   ├── 📁 models
│   │   │   │   └── 📄 payment.js
│   │   │   ├── 📁 untils
│   │   │   │   └── 📄 db.js
│   │   │   └── 📁 validations
│   │   │       └── 📄 paymentValidation.js
│   │   ├── 🐳 Dockerfile
│   │   ├── 📄 Dockerfile.dev
│   │   ├── 📄 app.js
│   │   ├── ⚙️ package-lock.json
│   │   └── ⚙️ package.json
│   ├── 📁 userService
│   │   ├── 📁 src
│   │   │   ├── 📁 controllers
│   │   │   │   └── 📄 userController.js
│   │   │   ├── 📁 helpers
│   │   │   │   └── 📄 middleware.js
│   │   │   ├── 📁 models
│   │   │   │   ├── 📄 address.js
│   │   │   │   ├── 📄 index.js
│   │   │   │   ├── 📄 roles.js
│   │   │   │   ├── 📄 userRole.js
│   │   │   │   └── 📄 users.js
│   │   │   ├── 📁 routes
│   │   │   │   ├── 📄 protected.js
│   │   │   │   └── 📄 public.js
│   │   │   ├── 📁 utils
│   │   │   └── 📁 validation
│   │   │       ├── 📄 addressValidation.js
│   │   │       ├── 📄 roleValidation.js
│   │   │       └── 📄 userValidation.js
│   │   ├── 🐳 Dockerfile
│   │   ├── 📄 Dockerfile.dev
│   │   ├── 📄 app.js
│   │   ├── 📄 db.js
│   │   ├── ⚙️ package-lock.json
│   │   ├── ⚙️ package.json
│   │   └── 📄 seeds.js
│   └── ⚙️ .gitignore
├── 📁 frontend
│   ├── 📁 public
│   │   └── 🖼️ vite.svg
│   ├── 📁 src
│   │   ├── 📁 assets
│   │   │   └── 🖼️ react.svg
│   │   ├── 📁 component
│   │   │   ├── 📁 common
│   │   │   └── 📁 merchantSys
│   │   │       ├── 📁 commonMerchant
│   │   │       │   ├── 📄 card.jsx
│   │   │       │   └── 📄 navbar.jsx
│   │   │       ├── 📄 merchantHome.jsx
│   │   │       ├── 📄 merchantInfor.jsx
│   │   │       ├── 📄 merchantLogin.jsx
│   │   │       └── 📄 merchantMenu.jsx
│   │   ├── 📁 routes
│   │   │   └── 📄 merhantSys.jsx
│   │   ├── 🎨 App.css
│   │   ├── 📄 App.jsx
│   │   ├── 🎨 index.css
│   │   └── 📄 main.jsx
│   ├── ⚙️ .gitignore
│   ├── 🐳 Dockerfile
│   ├── 📄 Dockerfile.dev
│   ├── 📝 README.md
│   ├── 📄 eslint.config.js
│   ├── 🌐 index.html
│   ├── ⚙️ package-lock.json
│   ├── ⚙️ package.json
│   ├── 📄 vite.config.js
│   └── 📄 vite.config.ts
├── 📁 word
│   ├── 📘 CNPM-Nhom16.docx
│   └── 📄 KTPM.drawio
├── ⚙️ .gitattributes
├── ⚙️ .env
├── ⚙️ .gitignore
├── 📝 README.md
└── ⚙️ docker-compose.yml
```
