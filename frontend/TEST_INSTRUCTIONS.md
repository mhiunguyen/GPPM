# 🔧 Hướng dẫn Test & Debug

## Vấn đề: Trang web chỉ hiển thị HTML trắng

### Bước 1: Mở Browser Console (F12)

1. Mở trình duyệt tại `http://localhost:5173/`
2. Nhấn **F12** để mở Developer Tools
3. Chuyển sang tab **Console**
4. Kiểm tra xem có lỗi màu đỏ nào không

### Bước 2: Kiểm tra Network Tab

1. Chuyển sang tab **Network**
2. Refresh trang (F5)
3. Kiểm tra xem các file sau có load thành công không:
   - `main.tsx` (status 200)
   - `App.tsx` (status 200)
   - `DermaSafeAI.tsx` (status 200)
   - `lucide-react` modules

### Bước 3: Xóa localStorage

Mở Console và chạy:
```javascript
localStorage.clear()
location.reload()
```

Điều này sẽ xóa cache localStorage và reload trang.

### Bước 4: Hard Refresh

Thử các cách sau:
- **Windows**: Ctrl + Shift + R hoặc Ctrl + F5
- **Mac**: Cmd + Shift + R

### Bước 5: Kiểm tra Console Logs

Sau khi refresh, bạn sẽ thấy các logs sau trong Console:

```
App: Checking localStorage, hasAccepted = null (hoặc 'true')
App: disclaimerAccepted = false, loading = true
App: disclaimerAccepted = false, loading = false
```

Nếu bạn thấy disclaimer accepted = true, bạn sẽ thấy thêm:
```
App: disclaimerAccepted = true, loading = false
```

### Bước 6: Test Manual

Nếu vẫn không hiển thị gì, hãy thử test với một component đơn giản:

#### Option A: Test React cơ bản

Mở file `frontend/src/App.tsx` và tạm thời thay đổi nội dung thành:

```tsx
function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1f2937'
    }}>
      ✅ React đang hoạt động!
    </div>
  );
}

export default App;
```

Nếu bạn thấy text "React đang hoạt động!", có nghĩa là React chạy OK và vấn đề nằm ở component.

#### Option B: Test với DisclaimerModal đơn giản

```tsx
import { useState } from 'react';

function App() {
  const [accepted, setAccepted] = useState(false);

  if (!accepted) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '16px',
          maxWidth: '500px',
          textAlign: 'center'
        }}>
          <h2 style={{ marginBottom: '20px', color: '#dc2626' }}>⚠️ Cảnh báo</h2>
          <p style={{ marginBottom: '20px' }}>Đây không phải là công cụ chẩn đoán y tế.</p>
          <button
            onClick={() => setAccepted(true)}
            style={{
              padding: '12px 24px',
              backgroundColor: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Đồng ý
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>DermaSafeAI</h1>
      <p>Bạn đã đồng ý disclaimer!</p>
    </div>
  );
}

export default App;
```

### Bước 7: Kiểm tra Vite Server

Trong terminal, đảm bảo thấy:
```
VITE v5.4.21  ready in XXX ms

➜  Local:   http://localhost:5173/
```

Nếu không thấy, restart server:
```bash
# Stop server (Ctrl+C)
# Start lại
npm run dev
```

### Bước 8: Kiểm tra Dependencies

```bash
cd frontend
npm list react react-dom lucide-react
```

Đảm bảo tất cả packages đã được cài:
- react@^19.1.1
- react-dom@^19.1.1
- lucide-react@^0.546.0

Nếu thiếu, chạy:
```bash
npm install
```

### Bước 9: Build Test

Thử build production để kiểm tra lỗi:
```bash
npm run build
```

Nếu có lỗi, nó sẽ hiện rõ ràng trong output.

### Bước 10: Restart Everything

```bash
# 1. Stop Vite server (Ctrl+C)

# 2. Xóa node_modules và cache
rmdir /s /q node_modules
rmdir /s /q .vite

# 3. Cài lại dependencies
npm install

# 4. Start lại dev server
npm run dev
```

## 🐛 Common Issues

### Issue 1: "Cannot find module 'react'"
**Solution**: 
```bash
npm install react react-dom
```

### Issue 2: "Cannot find module 'lucide-react'"
**Solution**:
```bash
npm install lucide-react --legacy-peer-deps
```

### Issue 3: Trang trắng nhưng không có lỗi
**Solution**:
- Xóa localStorage: `localStorage.clear()`
- Hard refresh: Ctrl+Shift+R
- Kiểm tra ad-blocker có chặn không

### Issue 4: DisclaimerModal không hiển thị
**Solution**:
- Kiểm tra localStorage: `localStorage.getItem('dermasafe_disclaimer_accepted')`
- Nếu = 'true', xóa đi: `localStorage.removeItem('dermasafe_disclaimer_accepted')`

### Issue 5: DermaSafeAI component không render
**Solution**:
- Kiểm tra import lucide-react: Mở Console, xem có lỗi import không
- Nếu có, reinstall: `npm install lucide-react --legacy-peer-deps --force`

## 📝 Debug Checklist

- [ ] Vite server đang chạy tại http://localhost:5173/
- [ ] Browser console không có lỗi đỏ
- [ ] Network tab cho thấy main.tsx load thành công
- [ ] localStorage đã được xóa
- [ ] Hard refresh đã thử
- [ ] react, react-dom, lucide-react đã cài đặt
- [ ] npm run build không có lỗi

## 🆘 Nếu vẫn không được

Hãy gửi cho tôi:
1. Screenshot của Browser Console (F12 > Console tab)
2. Screenshot của Network tab (F12 > Network tab)
3. Output của `npm list` trong terminal
4. Output của Vite server trong terminal

Tôi sẽ giúp bạn debug tiếp!
