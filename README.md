# BaDaFuTa

Hệ thống foodfast cho phép khách hàng có thể đặt đồ ăn và thanh toán online và các đối tác có thể thiết lập menu và nhận đơn đồ ăn từ khách hàng

## Tính năng



## Cài đặt


### Clone repo
```bash
git clone https://github.com/letandat1607/BaDaFuTa.git
```
### Cài dependencies và chạy project
```bash
##Add .env
touch .env
#Docker build và tự động chạy
cd BaDaFuTa
docker compose up -d --build
```
## Kiến trúc dự án
```

├── 📁 backend
│   ├── 📁 gateway
│   │   ├── 📁 src
│   │   │   ├── 📁 helpers
│   │   │   │   └── 📄 middleware.js
│   │   │   ├── 📁 rabbitMQ
│   │   │   │   ├── 📄 rabbitConfig.js
│   │   │   │   ├── 📄 rabbitConnect.js
│   │   │   │   ├── 📄 rabbitConsumer.js
│   │   │   │   └── 📄 rabbitFunction.js
│   │   │   └── 📁 services
│   │   │       └── 📄 gatewayService.js
│   │   ├── 🐳 Dockerfile
│   │   ├── 📄 Dockerfile.dev
│   │   ├── 📄 app.js
│   │   ├── 📄 merchant_dump.sql
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
│   │   │   ├── 📁 rabbitMQ
│   │   │   │   ├── 📄 rabbitConfig.js
│   │   │   │   ├── 📄 rabbitConnect.js
│   │   │   │   ├── 📄 rabbitConsumer.js
│   │   │   │   └── 📄 rabbitFunction.js
│   │   │   ├── 📁 repositories
│   │   │   │   └── 📄 merchantRepository.js
│   │   │   ├── 📁 services
│   │   │   │   └── 📄 merchantService.js
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
│   │   │   ├── 📁 helpers
│   │   │   │   └── 📄 middleware.js
│   │   │   ├── 📁 models
│   │   │   │   ├── 📄 cart.js
│   │   │   │   ├── 📄 cartItem.js
│   │   │   │   ├── 📄 cartItemOption.js
│   │   │   │   ├── 📄 index.js
│   │   │   │   ├── 📄 order.js
│   │   │   │   ├── 📄 orderItem.js
│   │   │   │   └── 📄 otherItemOption.js
│   │   │   ├── 📁 rabbitMQ
│   │   │   │   ├── 📄 rabbitConfig.js
│   │   │   │   ├── 📄 rabbitConnect.js
│   │   │   │   ├── 📄 rabbitConsumer.js
│   │   │   │   └── 📄 rabbitFunction.js
│   │   │   ├── 📁 repositories
│   │   │   │   └── 📄 orderRepository.js
│   │   │   ├── 📁 services
│   │   │   │   └── 📄 orderService.js
│   │   │   ├── 📁 utils
│   │   │   │   ├── 📄 db.js
│   │   │   │   └── ⚙️ seedOrderData.json
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
│   │   │   ├── 📁 rabbitMQ
│   │   │   │   ├── 📄 rabbitConfig.js
│   │   │   │   ├── 📄 rabbitConnect.js
│   │   │   │   ├── 📄 rabbitConsumer.js
│   │   │   │   └── 📄 rabbitFunction.js
│   │   │   ├── 📁 repositories
│   │   │   ├── 📁 services
│   │   │   │   └── 📄 paymentService.js
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
│   │   │   ├── 📁 repositories
│   │   │   │   └── 📄 userRepository.js
│   │   │   ├── 📁 routes
│   │   │   │   ├── 📄 protected.js
│   │   │   │   └── 📄 public.js
│   │   │   ├── 📁 services
│   │   │   │   └── 📄 userService.js
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
│   │   │   ├── 📁 customerSys
│   │   │   │   ├── 📁 commonCustomer
│   │   │   │   │   ├── 📄 card.jsx
│   │   │   │   │   ├── 📄 cartItem.jsx
│   │   │   │   │   ├── 📄 cartSummary.jsx
│   │   │   │   │   ├── 📄 checkOutForm.jsx
│   │   │   │   │   ├── 📄 checkOutItem.jsx
│   │   │   │   │   ├── 📄 emptyCart.jsx
│   │   │   │   │   ├── 📄 loadingSkeleton.jsx
│   │   │   │   │   ├── 📄 menuCategory.jsx
│   │   │   │   │   ├── 📄 menuItem.jsx
│   │   │   │   │   ├── 📄 navbar.jsx
│   │   │   │   │   ├── 📄 orderSummary.jsx
│   │   │   │   │   ├── 📄 protectedRouteCustomer.jsx
│   │   │   │   │   └── 📄 toppingModal.jsx
│   │   │   │   ├── 📄 checkOut.jsx
│   │   │   │   ├── 📄 loginCustomer.jsx
│   │   │   │   ├── 📄 merchantCart.jsx
│   │   │   │   ├── 📄 merchantList.jsx
│   │   │   │   ├── 📄 merchantMenu.jsx
│   │   │   │   ├── 📄 orderDetail.jsx
│   │   │   │   ├── 📄 orderHistory.jsx
│   │   │   │   ├── 📄 orderSuccess.jsx
│   │   │   │   └── 📄 paymentResult.jsx
│   │   │   └── 📁 merchantSys
│   │   │       ├── 📁 commonMerchant
│   │   │       │   ├── 📄 card.jsx
│   │   │       │   ├── 📄 navbar.jsx
│   │   │       │   ├── 📄 protectedRoute.jsx
│   │   │       │   └── 📄 text.jsx
│   │   │       ├── 📁 merchantMenu
│   │   │       │   ├── 📁 dialogs
│   │   │       │   │   ├── 📄 addCategoryDialog.jsx
│   │   │       │   │   ├── 📄 addMenuDialog.jsx
│   │   │       │   │   ├── 📄 addOptionDialog.jsx
│   │   │       │   │   ├── 📄 bulkAddMenuDialog.jsx
│   │   │       │   │   ├── 📄 bulkAddToppingDialog.jsx
│   │   │       │   │   ├── 📄 editMenuItemDialog.jsx
│   │   │       │   │   ├── 📄 editOptionItemDialog.jsx
│   │   │       │   │   └── 📄 linkOptionDialog.jsx
│   │   │       │   ├── 📄 menuItemOptionTab.jsx
│   │   │       │   ├── 📄 menuTab.jsx
│   │   │       │   └── 📄 optionItemTab.jsx
│   │   │       ├── 📄 merchantHome.jsx
│   │   │       ├── 📄 merchantInfor.jsx
│   │   │       ├── 📄 merchantLogin.jsx
│   │   │       ├── 📄 merchantMenu.jsx
│   │   │       ├── 📄 merchantOrders.jsx
│   │   │       └── 📄 testOrder.jsx
│   │   ├── 📁 routes
│   │   │   ├── 📄 customerSys.jsx
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
├── 📁 ngrok
│   └── ⚙️ ngrok.yml
├── ⚙️ .gitattributes
├── ⚙️ .gitignore
├── 📝 README.md
└── ⚙️ docker-compose.yml
```
