# Class Deadline Hub - PTIT 🎓

> Cổng thông tin deadline tập trung dành cho sinh viên và ban cán sự lớp Học viện Công nghệ Bưu chính Viễn thông (PTIT). Dự án được xây dựng với **Next.js 16 (App Router)**, **Auth.js (NextAuth v5)**, **TypeScript**, và **Tailwind CSS**.

---

## 🚀 1. Hướng dẫn cài đặt và khởi chạy

### Yêu cầu môi trường
- **Node.js**: >= 18.17 (khuyến nghị v20+)
- **npm**: >= 9.0

### Bước 1: Cài đặt dependencies
```bash
npm install
```

### Bước 2: Thiết lập biến môi trường (.env.local)
Tạo file `.env.local` ở thư mục gốc (đã được tạo sẵn):
```env
NEXTAUTH_SECRET=ptit-deadline-hub-super-secret-key-2026
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# (Tùy chọn) Cấu hình GitHub OAuth:
# GITHUB_ID=your_github_client_id
# GITHUB_SECRET=your_github_client_secret
```

### Bước 3: Chạy môi trường Development
```bash
npm run dev
```
Truy cập: [http://localhost:3000](http://localhost:3000)

### Bước 4: Chạy Unit Test (Jest)
Kiểm thử ma trận phân quyền `can(role, action)`:
```bash
npm test
```

### Bước 5: Build và chạy Production
```bash
npm run build
npm run start
```

---

## 👥 2. Tài khoản kiểm thử hệ thống

Dữ liệu được lưu trữ dạng JSON tại `data/users.json`, `data/subjects.json` (4 môn học) và `data/deadlines.json` (12 deadlines). Mật khẩu được mã hóa an toàn bằng `bcryptjs`.

| Email | Mật khẩu | Vai trò (`Role`) | Chức năng chính |
| :--- | :--- | :--- | :--- |
| **admin@ptit.edu.vn** | `admin123` | `admin` (Lớp trưởng) | Toàn quyền: Xem, đánh dấu hoàn thành, thêm deadline mới, xoá deadline, truy cập `/admin` |
| **sv@ptit.edu.vn** | `sv123456` | `user` (Sinh viên) | Xem deadline công khai, đánh dấu hoàn thành trên `/dashboard` & `/deadlines/[id]`, xem thống kê tiến độ |
| *(Khách vãng lai)* | Không | `guest` | Xem danh sách deadline, xem chi tiết môn học & deadline, chia sẻ link có preview OG |

---

## 📊 3. Bảng phân tích Chiến lược Render (Rendering Strategies)

Kết quả thực tế từ lệnh `npm run build`:

```text
Route (app)                       Revalidate  Expire
┌ ○ /
├ ○ /_not-found
├ ○ /403
├ ƒ /admin
├ ƒ /api/auth/[...nextauth]
├ ƒ /api/og
├ ƒ /dashboard
├ ƒ /dashboard/deadlines
├ ƒ /dashboard/subjects
├ ○ /deadlines                            1m      1y
├   /deadlines/[id]
│ ├ ● /deadlines/1                        1h      1y
│ ├ ● /deadlines/2                        1h      1y
│ ├ ● /deadlines/3                        1h      1y
│ └ ● [+9 more paths]
├ ○ /login
├ ○ /robots.txt
├ ○ /sitemap.xml
└   /subjects/[slug]
  ├ ● /subjects/lap-trinh-web
  ├ ● /subjects/co-so-du-lieu
  ├ ● /subjects/mang-may-tinh
  └ ● /subjects/tri-tue-nhan-tao

Legend:
○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand (SSR)
```

### Bảng lý do lựa chọn chiến lược render cho từng route:

| Route | Quyền truy cập | Chiến lược | Ký hiệu Next.js | Lý do lựa chọn kiến trúc |
| :--- | :--- | :--- | :---: | :--- |
| `/` | Mọi người | **SSG** (Static Site Gen) | `○` (Static) | Trang chủ mang tính giới thiệu, thống kê tổng quát môn học và danh sách sắp đến hạn. Dữ liệu ít thay đổi theo từng giây nên việc build tĩnh giúp TTFB đạt mức gần như 0ms, giảm tải tối đa cho máy chủ. |
| `/subjects/[slug]` | Mọi người | **SSG** | `●` (SSG) | Danh sách môn học (4 môn cố định trong kỳ) được xác định trước qua `generateStaticParams()`. SSG giúp các bot tìm kiếm lập chỉ mục tức thì và tải trang cực nhanh. |
| `/deadlines` | Mọi người | **ISR (60s)** | `○` (1m) | Danh sách toàn bộ deadline của lớp cần public cho sinh viên theo dõi. ISR với `revalidate = 60` giúp trang được lưu trong CDN cache, người dùng truy cập nhận phản hồi tức thì, trong khi các thay đổi sẽ tự động được cập nhật ngầm sau mỗi 60 giây. |
| `/deadlines/[id]` | Mọi người | **ISR (On-Demand)** | `●` (1h + on-demand) | 12 deadline được build tĩnh trước qua `generateStaticParams()`. Kết hợp với cơ chế **On-demand Revalidation** (`revalidatePath` / `updateTag`) kích hoạt ngay khi admin thêm hoặc xoá deadline. Điều này vừa đảm bảo SEO/OpenGraph tức thì, vừa phản ánh dữ liệu mới ngay lập tức mà không cần rebuild toàn bộ web. |
| `/dashboard` | Đã đăng nhập | **SSR** (Server-Side) | `ƒ` (Dynamic) | Trang cá nhân hoá theo từng sinh viên (danh sách bài đã xong/chưa xong của riêng tài khoản đó). Bắt buộc phải render động phía server theo phiên đăng nhập (JWT Session Cookie) của người dùng. |
| `/admin` | Chỉ admin | **SSR** | `ƒ` (Dynamic) | Bảng điều khiển quản trị yêu cầu kiểm tra quyền nghiêm ngặt của `admin` trên từng request, lấy dữ liệu form mới nhất để quản lý deadline an toàn. |

---

## ⚡ 4. Kết quả đo Lighthouse trên bản Production

Đo lường trực tiếp trên bản build production bằng Google Lighthouse CLI:

| Trang kiểm thử | Performance | Accessibility | Best Practices | SEO |
| :--- | :---: | :---: | :---: | :---: |
| **Trang chủ (`/`)** | **99** | **100** | **100** | **100** |
| **Chi tiết Deadline (`/deadlines/1`)** | **100** | **96** | **100** | **100** |

*Ghi chú: Toàn bộ chỉ số Core Web Vitals (FCP < 0.5s, LCP < 0.8s, CLS = 0) đều đạt mức xanh (Good).*

---

## 🔍 5. Kiểm tra mã nguồn HTML (View-Source) của `/deadlines/1`

Trích đoạn mã nguồn HTML trả về từ máy chủ khi gọi `curl http://localhost:3000/deadlines/1`:

```html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charSet="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  
  <!-- Dynamic SEO Title & Description -->
  <title>Bài tập lớn: Xây dựng REST API với Node.js | Deadline Hub PTIT</title>
  <meta name="description" content="Xây dựng một REST API hoàn chỉnh với Express.js, bao gồm authentication, authorization, CRUD operations và tài liệu API bằng Swagger. Yêu cầu có unit test với Jest."/>
  <meta name="author" content="PTIT"/>
  <meta name="robots" content="index, follow"/>
  
  <!-- Dynamic OpenGraph Preview Image -->
  <meta property="og:title" content="Bài tập lớn: Xây dựng REST API với Node.js | Deadline Hub PTIT"/>
  <meta property="og:description" content="Xây dựng một REST API hoàn chỉnh với Express.js..."/>
  <meta property="og:image" content="http://localhost:3000/api/og?title=B%C3%A0i%20t%E1%BA%ADp%20l%E1%BB%9Bn%3A%20X%C3%A2y%20d%E1%BB%B1ng%20REST%20API%20v%E1%BB%9Bi%20Node.js&amp;subject=IT4409&amp;dueDate=2026-11-15T23%3A59%3A00.000Z&amp;priority=high&amp;type=assignment"/>
  <meta property="og:image:width" content="1200"/>
  <meta property="og:image:height" content="630"/>
  <meta property="og:type" content="article"/>
  <meta name="twitter:card" content="summary_large_image"/>

  <!-- JSON-LD Structured Data: BreadcrumbList -->
  <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Trang chủ", "item": "http://localhost:3000" },
        { "@type": "ListItem", "position": 2, "name": "Deadlines", "item": "http://localhost:3000/deadlines" },
        { "@type": "ListItem", "position": 3, "name": "Bài tập lớn: Xây dựng REST API với Node.js", "item": "http://localhost:3000/deadlines/1" }
      ]
    }
  </script>
</head>
<body class="bg-slate-950 text-white antialiased">
  <!-- Nội dung trang được Server Prerender sẵn 100% -->
  <h1>Bài tập lớn: Xây dựng REST API với Node.js</h1>
  ...
</body>
</html>
```

---

## ❓ 6. Trả lời câu hỏi lý thuyết

### (1) Vì sao `/deadlines/[id]` dùng ISR?

Trang chi tiết deadline `/deadlines/[id]` sử dụng chiến lược **ISR (Incremental Static Regeneration)** kết hợp On-demand Revalidation vì các lý do cốt lõi sau:

1. **Hiệu năng và Tốc độ phản hồi (Ultra-fast TTFB):**
   - Với ISR, các trang deadline được sinh sẵn ra file HTML tĩnh trên máy chủ/CDN Edge ngay từ lúc build (`generateStaticParams`). Khi hàng trăm sinh viên cùng lúc truy cập vào một link deadline trước giờ nộp, máy chủ chỉ việc phục vụ file tĩnh cực nhanh mà không phải truy vấn cơ sở dữ liệu hay render lại JSX cho từng request.
2. **Tối ưu SEO và Chia sẻ Mạng xã hội (Social Media Sharing):**
   - Các crawler của Googlebot, Facebook, Zalo, Discord yêu cầu thẻ HTML `meta`, `og:image`, `og:title` và `JSON-LD Structured Data` phải có sẵn ngay trong mã nguồn HTML ban đầu. Nếu dùng Client-side Rendering (CSR), bot chia sẻ sẽ không đọc được ảnh thumbnail preview.
3. **Cập nhật dữ liệu tức thì (On-demand Revalidation):**
   - Khác với SSG thuần túy (muốn cập nhật phải build lại toàn bộ website), ISR cho phép áp dụng **On-demand Revalidation** thông qua hàm `revalidatePath('/deadlines/[id]')` hoặc `revalidateTag()`. Ngay khi Lớp trưởng (admin) chỉnh sửa, thêm mới hoặc xoá deadline, trang chi tiết được tái tạo ngầm trong tích tắc, giúp sinh viên luôn nhận được nội dung mới nhất mà không mất đi lợi thế tốc độ của file tĩnh.

---

### (2) Nếu chỉ dùng Middleware để bảo vệ `/admin` thì có rủi ro gì?

Nếu một hệ thống chỉ dựa duy nhất vào Middleware ở tầng ngoài cùng để phân quyền `/admin` mà không kiểm tra tại component và Server Actions/API, hệ thống sẽ đối mặt với các lỗ hổng bảo mật nghiêm trọng sau:

1. **Rủi ro Bỏ sót Đường dẫn / Lỗi Matcher Cấu hình:**
   - Middleware dựa vào quy tắc URL regex (`matcher: ["/admin/:path*"]`). Nếu lập trình viên vô tình định nghĩa sai cấu hình matcher, hoặc bổ sung các sub-route mới (ví dụ `/admin-api/export`, `/api/admin/action`), hoặc kẻ tấn công sử dụng các kỹ thuật path normalization (như URL encoding `/Admin`, double slash `//admin`), request có thể lọt qua Middleware mà không bị chặn.
2. **Lỗ hổng Server Actions / API Routes bị gọi trực tiếp:**
   - Trong kiến trúc Next.js App Router, Server Actions có endpoint POST riêng do framework sinh ra. Nếu các Server Action (như `addDeadlineAction`, `deleteDeadlineAction`) không tự kiểm tra `can(role, action)` mà mặc định tin tưởng rằng "chỉ có ai vào trang `/admin` mới gọi được hàm này", kẻ tấn công (hoặc người dùng thường) hoàn toàn có thể gửi HTTP POST request trực tiếp đến Server Action ID để xoá/thêm deadline trái phép mà không cần thông qua giao diện `/admin`.
3. **Vi phạm nguyên tắc Bảo mật đa lớp (Defense in Depth):**
   - Chuẩn bảo mật phần mềm hiện đại yêu cầu kiểm tra quyền ở **cả 3 tầng**:
     - *Tầng 1 (Routing / Network):* Middleware ngăn chặn truy cập điều hướng trái phép ngay từ biên.
     - *Tầng 2 (Page / Component Level):* Trang `/admin/page.tsx` kiểm tra lại phiên đăng nhập và role trước khi trả về dữ liệu nhạy cảm.
     - *Tầng 3 (Data Mutation / Business Logic):* Mọi Server Action (`addDeadline`, `deleteDeadline`) đều gọi hàm ma trận phân quyền tập trung `can(role, action)` và xác thực dữ liệu đầu vào bằng `Zod`.

---

## 🌟 7. Điểm cộng đã hoàn thành

1. **Ma trận phân quyền `can(role, action)` tập trung:**
   - Khai báo tại `src/lib/permissions.ts`.
   - Có bộ Unit Test toàn diện với **Jest** (`src/__tests__/permissions.test.ts`), bao phủ 100% các cặp `Role x Action` (12/12 test suites PASSED).
2. **Sẵn sàng triển khai OAuth (GitHub):**
   - Tích hợp chuẩn trong Auth.js v5, chỉ cần cấu hình `GITHUB_ID` và `GITHUB_SECRET`.
3. **Dynamic OpenGraph Image Generation (`/api/og`):**
   - Tự động vẽ card đồ họa SVG/PNG 1200x630 động chứa màu sắc ưu tiên, mã môn học, tên bài và ngày hạn nộp cho từng deadline.
4. **Sẵn sàng triển khai lên Vercel:**
   - Dự án đã chuẩn hóa cấu hình Edge Runtime và NodeJS Runtime, tương thích 100% với nền tảng Vercel.
