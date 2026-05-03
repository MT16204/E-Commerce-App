# E - Commerce App

<p align="center">
  <img src="mobile/assets/images/icon.png" width="150" alt="Nova Logo" />
</p>

> Ứng dụng thương mại điện tử hiện đại, bao gồm ứng dụng di động cho khách hàng, trang quản trị cho người bán và hệ thống backend mạnh mẽ. Dự án tích hợp các giải pháp thanh toán, vận hành và theo dõi lỗi hàng đầu hiện nay.

[![React Native](https://img.shields.io/badge/React_Native-Expo-61DAFB?logo=react&logoColor=white)](https://reactnative.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Stripe](https://img.shields.io/badge/Payment-Stripe-635BFF?logo=stripe&logoColor=white)](https://stripe.com)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?logo=clerk&logoColor=white)](https://clerk.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-22C55E.svg)](LICENSE)

## 📱 Trải nghiệm trên Android

> [!IMPORTANT]
> Dự án hiện tại chỉ hỗ trợ tối ưu cho hệ điều hành **Android**.

### Cách 1: Sử dụng Expo Go (Khuyên dùng)
1. Tải ứng dụng **Expo Go** từ Google Play Store.
2. Mở Expo Go (Hoặc sử dụng Camera điện thoại để quét mã), chọn **Scan QR Code** và quét mã phía trên.
3. Chờ hệ thống tải JavaScript Bundle (khoảng 30s) để bắt đầu trải nghiệm.

### Cách 2: Cài đặt file APK trực tiếp
1. Truy cập mục [Releases](#) và tải file `.apk`.
2. Trong quá trình cài đặt, nếu gặp cảnh báo *Play Protect*, chọn **"Install anyway"**.

---

## 🔑 Tài khoản dùng thử (Demo)

| Loại thông tin | Giá trị demo |
| :--- | :--- |
| **Email** | `demo@novastore.com` |
| **Password** | `NovaDemo#2025!` |
| **Test Card** | `4242 4242 4242 4242` |
| **CVC / Expiry** | `123` / `04/27` |

---

## 📋 Mục lục

- [Tính năng](#-tính-năng)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Giao diện ứng dụng](#-giao-diện-ứng-dụng-screenshots)
- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Cài đặt & Chạy ứng dụng](#-cài-đặt--chạy-ứng-dụng)

---

## ✨ Tính năng

- 🔐 **Xác thực đa phương thức**: Đăng nhập qua Clerk (Email, Google, Apple).
- 🛍️ **Trải nghiệm mua sắm mượt mà**: Tìm kiếm, lọc sản phẩm, giỏ hàng thời gian thực.
- 💳 **Thanh toán an toàn**: Tích hợp Stripe Payment Sheet xử lý thẻ quốc tế.
- 🏗️ **Quản lý Background Jobs**: Sử dụng Inngest để xử lý các tác vụ ngầm (email, dọn dẹp dữ liệu).
- 📊 **Dashboard Admin**: Quản lý sản phẩm, đơn hàng và khách hàng tập trung.
- 💬 **Real-time Chat & Notification**: Thông báo biến động đơn hàng qua Socket.io.
- 🛡️ **Giám sát hệ thống**: Theo dõi lỗi và crash ứng dụng với Sentry.

---

## 🛠 Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| **Mobile App** | React Native Expo, TailwindCSS (NativeWind), Sentry |
| **Admin Web** | React (Vite), TailwindCSS, DaisyUI |
| **Backend** | Node.js, Express, Socket.io |
| **Database** | MongoDB (Mongoose) |
| **Auth & Security** | Clerk Auth |
| **Payment Gate** | Stripe |
| **Workflow Manager**| Inngest |
| **Cloud Storage** | Cloudinary |
| **Deployment** | Railway (Backend/Admin), EAS (Mobile) |

---

## 📁 Cấu trúc thư mục

```bash
e-commerce-app/
│
├── admin/                          # Dashboard quản trị viên (Vite + React)
│   └── src/
│       ├── components/             # Navbar, Sidebar, PageLoader
│       ├── layouts/                # DashboardLayout
│       ├── lib/                    # axios, socket, api, utils
│       └── pages/                  # Dashboard, Products, Orders, Customers, Messages
│
├── backend/                        # API Server (Node.js + Express)
│   └── src/
│       ├── config/                 # Kết nối DB, Cloudinary, Inngest
│       ├── controllers/            # Xử lý logic: user, product, order, cart, payment...
│       ├── middleware/             # Auth (Clerk), Multer upload
│       ├── models/                 # Schema: User, Product, Order, Cart, Review...
│       ├── routes/                 # Định nghĩa API endpoints
│       └── server.js               # Entry point, Socket.io setup
│
└── mobile/                         # Ứng dụng di động (Expo + TypeScript)
    ├── app/                        # File-based Routing
    │   ├── (auth)/                 # signIn, signUp, verify, reset
    │   ├── (tabs)/                 # home, cart, orders, profile, wishList
    │   ├── (home)/                 # search, new-arrivals, popular-products
    │   ├── (profile)/              # edit-profile, addresses, privacy-security...
    │   ├── (cart)/                 # checkout
    │   ├── product/[id].tsx        # Chi tiết sản phẩm (dynamic route)
    │   ├── notifications.tsx
    │   ├── onboarding.tsx
    │   └── welcome.tsx
    ├── components/                 # ProductCard, PromoCarousel, FilterModal, OrderDetailsModal...
    ├── hooks/                      # useCart, useOrders, useProducts, useWishlist, useReviews...
    ├── lib/                        # api, socket, utils
    ├── theme/                      # colors, typography, scale
    └── types/                      # Định nghĩa TypeScript toàn cục
```

---

## 📱 Giao diện ứng dụng (Screenshots)

### Splash & Onboarding & Welcome (Màn hình khởi động)

Giao diện chào mừng và giới thiệu tính năng khi lần đầu mở ứng dụng.

<img width="200" src="https://github.com/user-attachments/assets/16b3adba-fe2a-4b71-9000-771cc6a3c2de" /> 
<img width="200" src="https://github.com/user-attachments/assets/8d34e9be-7fe7-4ae1-9d42-93d71490eb25" /> 
<img width="200" src="https://github.com/user-attachments/assets/616a09df-f577-46d1-a1f2-629c505e4a99" /> 
<img width="200" src="https://github.com/user-attachments/assets/da58660b-b2d1-42f2-9229-6afec91e724e" />
<img width="200" src="https://github.com/user-attachments/assets/9e87d5f9-48cc-43df-a6b2-1b5088674dde" /> 

---

### Login & SignUp (Đăng nhập & Đăng ký)

Giao diện đăng nhập và đăng ký tài khoản qua Email, Google hoặc Apple.

<img width="200" src="https://github.com/user-attachments/assets/acb1206a-6d10-4a95-ac37-010395e238c5" />
<img width="200" src="https://github.com/user-attachments/assets/bfd9bdf8-e825-4cd5-a8be-c400103618d2" />

---

### Home (Trang chủ)

Giao diện màn hình chính hiển thị banner khuyến mãi, danh mục sản phẩm, hàng mới về và sản phẩm nổi bật.

<img width="200" src="https://github.com/user-attachments/assets/19b29051-563f-4ee0-a891-3ce2687e7291" />
<img width="200" src="https://github.com/user-attachments/assets/431698e1-5358-458c-81ed-1c8dd34c4c25" />
<img width="200" src="https://github.com/user-attachments/assets/66b3bf75-f054-42bd-af44-044df158b292" />

---

### Search & Filter (Tìm kiếm & Lọc)

Giao diện tìm kiếm sản phẩm và bộ lọc theo danh mục, giá, đánh giá.

<img width="200" src="https://github.com/user-attachments/assets/8f19dca5-8cca-4f72-8b19-77a7beddb8d4" />
<img width="200" src="https://github.com/user-attachments/assets/11597a2f-f63c-4ee0-9b4b-58d862c4f2fc" />

---

### Product Detail (Chi tiết sản phẩm)

Giao diện hiển thị thông tin chi tiết sản phẩm, hình ảnh, đánh giá (Rating Modal) và nút thêm vào giỏ hàng / wishlist.

<img width="200" src="https://github.com/user-attachments/assets/f61a5877-ce7d-40db-9a13-d20d78f3496b" />

---

### Cart & Checkout (Giỏ hàng & Thanh toán)

Giao diện giỏ hàng thời gian thực và luồng thanh toán tích hợp Stripe Payment Sheet.

<img width="200" src="https://github.com/user-attachments/assets/4027eadf-6570-4850-b60f-ddbcc7784201" />
<img width="200" src="https://github.com/user-attachments/assets/32bd8a45-13da-47ba-a837-9a87c0a994a6" />
<img width="200" src="https://github.com/user-attachments/assets/158174c5-5671-474f-9d68-9d217872b2d0" />
<img width="200" src="https://github.com/user-attachments/assets/824c798e-3bd2-4f78-902b-8f4ad3553d59" />


---

### Orders (Đơn hàng)

Giao diện lịch sử mua hàng và theo dõi chi tiết trạng thái từng đơn hàng.

<img width="200" src="https://github.com/user-attachments/assets/8aad394a-2a89-4d6a-a809-df1f80e18509" />
<img width="200" src="https://github.com/user-attachments/assets/8d342696-a720-45ca-960c-f682ce0d1574" />
<img width="200" src="https://github.com/user-attachments/assets/64219ba2-e4ba-4e52-b55d-48179af9a7cc" />


---

### Wishlist (Yêu thích)

Giao diện danh sách sản phẩm đã lưu.

<img width="200" src="https://github.com/user-attachments/assets/f6b1d9af-b5cb-443f-8831-e77e131f719d" />


---

### Notifications (Thông báo)

Giao diện thông báo biến động đơn hàng theo thời gian thực qua Socket.io.

<img width="200" src="https://github.com/user-attachments/assets/b17903e7-e7e8-4346-af64-80ac8cd20828" />

---

### Profile (Hồ sơ)

Giao diện quản lý thông tin cá nhân, địa chỉ giao hàng, bảo mật tài khoản và trung tâm hỗ trợ.

<img width="200" src="https://github.com/user-attachments/assets/d86f0dd5-bc32-44d4-aa73-cc28ec801f90" />
<img width="200" src="https://github.com/user-attachments/assets/517d7f66-0494-4dfd-8e10-18b909710b92" />
<img width="200" src="https://github.com/user-attachments/assets/3a66bd93-6ff9-4d74-8116-a174ce7072bf" />
<img width="200" src="https://github.com/user-attachments/assets/2ae74813-b54e-4682-be93-e78584bfc1a9" />
<img width="200" src="https://github.com/user-attachments/assets/97a6991f-60d5-4ca9-8d60-9c0112640e1b" />
<img width="200" src="https://github.com/user-attachments/assets/40021e7a-24ba-45bb-ab06-152e48ad8b48" />


---

### Admin Dashboard (Trang quản trị)

Giao diện web quản lý sản phẩm, đơn hàng, khách hàng và tin nhắn thời gian thực.

<img width="600" src="https://github.com/user-attachments/assets/548f650c-c925-4323-bf39-96b2b3a57818" /> <br>
<img width="600" src="https://github.com/user-attachments/assets/05579f77-3bde-45d9-af14-077a47b63f86" />
<img width="600" src="https://github.com/user-attachments/assets/cf506727-c40d-4030-82d7-31faa0efe2d5" />
<img width="600" src="https://github.com/user-attachments/assets/980091f7-97da-46b3-9496-7297ffd99a4c" />
<img width="600" src="https://github.com/user-attachments/assets/84e5bbc2-52fd-4908-a46c-c117d43b2f29" />

---

## 🖥 Yêu cầu hệ thống

| Công cụ | Phiên bản tối thiểu |
|---|---|
| Node.js | >= 20.x |
| npm / yarn | >= 9.x / >= 1.22.x |
| Expo CLI | >= 0.18.x |
| MongoDB | >= 6.0 (local hoặc Atlas) |
| Git | Bất kỳ |
| Android Studio / Xcode | Mới nhất (để chạy trên Simulator) |

---

## 🚀 Cài đặt & Chạy ứng dụng

### 1. Clone dự án

```bash
git clone https://github.com/your-username/e-commerce-app.git
cd e-commerce-app
```

---

### 2. Cài đặt & Cấu hình Backend

#### Cài đặt dependencies

```bash
cd backend
npm install
```

#### Cấu hình biến môi trường

Tạo file `.env` trong thư mục `backend/`:

```env
# Server
PORT=5000

# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ecommerce

# Clerk Authentication
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxx
CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx

# Stripe
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Inngest
INNGEST_EVENT_KEY=xxxxxxxxxxxx
INNGEST_SIGNING_KEY=xxxxxxxxxxxx

# Sentry
SENTRY_DSN=https://xxxxxxxxxxxx@sentry.io/xxxxxxx
```

> 🔒 **Lưu ý bảo mật:** Không commit file `.env` lên repository. File này đã được thêm vào `.gitignore`.

#### Chạy Backend

```bash
# Development
npm run dev

# Production
npm start
```

Backend sẽ chạy tại: **http://localhost:5000**

---

### 3. Cài đặt & Cấu hình Admin

#### Cài đặt dependencies

```bash
cd admin
npm install
```

#### Cấu hình biến môi trường

Tạo file `.env` trong thư mục `admin/`:

```env
VITE_API_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx
```

#### Chạy Admin

```bash
# Development
npm run dev

# Build production
npm run build
```

Admin Dashboard sẽ chạy tại: **http://localhost:5173**

---

### 4. Cài đặt & Cấu hình Mobile

#### Cài đặt dependencies

```bash
cd mobile
npm install
```

#### Kiểm tra môi trường Expo

```bash
npx expo doctor
```

Đảm bảo không có lỗi đỏ. Nếu thiếu Android SDK hoặc Xcode, làm theo hướng dẫn in ra trên terminal.

#### Cấu hình biến môi trường

Tạo file `.env` trong thư mục `mobile/`:

```env
EXPO_PUBLIC_API_URL=http://localhost:5000
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx
EXPO_PUBLIC_SENTRY_DSN=https://xxxxxxxxxxxx@sentry.io/xxxxxxx
```

#### Chạy Mobile App

```bash
# Xem danh sách thiết bị đang kết nối
npx expo devices

# Chạy trên Android
npx expo run:android

# Chạy trên iOS
npx expo run:ios

# Chạy bằng Expo Go (development)
npx expo start
```

Ứng dụng sẽ mở trên Simulator hoặc thiết bị thực của bạn.

---

### Build Production (Mobile)

```bash
# Cài đặt EAS CLI
npm install -g eas-cli

# Đăng nhập Expo
eas login

# Build APK cho Android
eas build --platform android --profile preview

# Build App Bundle cho Android (Google Play)
eas build --platform android --profile production

# Build iOS (App Store)
eas build --platform ios --profile production
```
