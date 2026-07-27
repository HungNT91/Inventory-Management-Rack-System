# Inventory Management Rack System — Bản deploy trên GitHub Pages

## Tin quan trọng trước tiên

File `index.html` bạn upload (bản có nhúng Supabase JS SDK) **đã là một web app tĩnh hoàn chỉnh**, không còn phụ thuộc vào Google Apps Script nữa. Toàn bộ các hàm backend (`searchItem`, `saveImportTransaction`, `authenticateUser`...) đã được viết lại thành JavaScript chạy thẳng trong trình duyệt, gọi trực tiếp tới Supabase qua `supabase-js`. Đoạn code cuối file còn có một lớp "giả lập" `google.script.run` để các hàm `google.script.run.withSuccessHandler(...).xxx()` cũ vẫn chạy được mà không cần sửa lại toàn bộ UI code.

➡️ Vì vậy: **`Code.gs`, `css.html`, `js.html` không cần dùng nữa.** Đó là bản Google Apps Script cũ (dùng Vue.js, gọi `google.script.run` thật sự tới server GAS). Bản `index.html` mới đã thay thế hoàn toàn phần đó bằng Supabase. Bạn chỉ cần deploy đúng 1 file `index.html` này.

## Cách deploy lên GitHub Pages

1. Tạo repo mới trên GitHub (public hoặc private đều được, nhưng Pages miễn phí chỉ chạy được với public repo trừ khi bạn có GitHub Pro/Team).
2. Đưa file `index.html` vào root của repo (hoặc vào thư mục `/docs` nếu bạn muốn dùng thư mục đó làm nguồn Pages).
3. Vào **Settings → Pages** của repo:
   - Source: chọn nhánh (thường là `main`) và thư mục (`/root` hoặc `/docs`).
   - Bấm Save.
4. Sau khoảng 1–2 phút, GitHub sẽ cung cấp URL dạng:
   `https://<username>.github.io/<ten-repo>/`
5. Mở URL đó lên — vì file đã tự load `supabase-js` và `html5-qrcode` từ CDN, không cần build gì thêm.

Nếu muốn deploy nhanh không cần thao tác UI, dùng lệnh:

```bash
git init
git add index.html README.md
git commit -m "Deploy inventory app"
git branch -M main
git remote add origin https://github.com/<username>/<ten-repo>.git
git push -u origin main
```

Rồi bật Pages như bước 3.

## ⚠️ Lưu ý bảo mật quan trọng

Trước đây với Google Apps Script, đoạn code kiểm tra mật khẩu (`authenticateUser`) chạy **trên server** — người dùng không thể đọc được logic hay SUPABASE key. Giờ khi chuyển sang static site (GitHub Pages), **toàn bộ code chạy trong trình duyệt của người dùng**, nghĩa là:

- `SUPABASE_URL` và `SUPABASE_ANON_KEY` sẽ hiển thị công khai trong mã nguồn trang (ai mở DevTools cũng thấy). Đây là điều bình thường với anon/publishable key của Supabase — **miễn là bạn đã bật Row Level Security (RLS)** đúng cách trên các bảng `employees`, `rack_inventory`, `products`, `transaction_history`.
- Hàm `authenticateUser` hiện đang so sánh mật khẩu dạng plain-text (`data.password_hash === password.trim()`) ngay trên client. Bất kỳ ai cũng có thể tự gọi Supabase REST API bằng anon key để đọc bảng `employees` nếu RLS không chặn.
- **Khuyến nghị**: 
  1. Bật RLS cho tất cả bảng, chỉ cho phép SELECT/UPDATE theo policy hợp lý (ví dụ chặn SELECT cột `password_hash` trực tiếp).
  2. Cân nhắc chuyển sang Supabase Auth (email/password có hash sẵn) thay vì tự so sánh password trong bảng `employees`.
  3. Không đưa quyền `service_role key` vào file frontend — chỉ dùng `anon key`.

Tôi không sửa lại phần logic đăng nhập vì đó là thay đổi lớn về kiến trúc — nếu bạn muốn, mình có thể giúp thiết kế lại phần xác thực an toàn hơn (ví dụ dùng Supabase Auth) hoặc viết policy RLS mẫu.

## File trong bản deploy này
- `index.html` — toàn bộ app (HTML + CSS + JS + kết nối Supabase), sẵn sàng deploy tĩnh.
