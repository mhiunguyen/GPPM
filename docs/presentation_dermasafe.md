---
# DermaSafe-AI (GPPM)
## Sàng lọc rủi ro da liễu an toàn, minh bạch cho cộng đồng

Ghi chú:
- Bài thuyết trình ngắn gọn (8–10 slide) để mô tả cách dự án giải quyết bài toán: người dân mô tả triệu chứng + gửi ảnh da để nhận tư vấn sơ bộ, đáng tin cậy và an toàn.
- Có thể copy nội dung từng slide sang PowerPoint hoặc dùng công cụ như Marp để xuất PDF.
---
# 1. Vấn đề & Mục tiêu

- Nhiều người gặp vấn đề da (mụn, dị ứng, viêm da…) nhưng khó tiếp cận bác sĩ chuyên khoa
- Tự tra cứu trên mạng → thông tin rời rạc, mơ hồ, đôi khi sai lệch
- Mục tiêu: Ứng dụng AI giúp mô tả triệu chứng + gửi ảnh da → phản hồi sơ bộ đáng tin cậy, ưu tiên an toàn
- Nhấn mạnh: đây là sàng lọc ban đầu (triage), không thay thế chẩn đoán y khoa

Ghi chú:
- Đặt bối cảnh cộng đồng và nhu cầu có công cụ hỗ trợ ban đầu, hướng người dùng tới chăm sóc y tế phù hợp.
---
# 2. Giải pháp tổng quan

- Ứng dụng web: tải ảnh vùng da + chọn/mô tả triệu chứng
- Dịch vụ AI phân tích ảnh (DermLIP) + kết hợp luật y khoa → mức rủi ro (Cao/Trung bình/Thấp)
- Chatbot (Gemini) giải thích kết quả và hướng dẫn tiếp theo
- Ưu tiên an toàn, riêng tư, minh bạch nguồn mở

Sơ đồ (tóm tắt):
Frontend → Backend API → AI Service (phân tích ảnh) → Kết quả + Giải thích
                                  ↘ Chatbot Service (tư vấn NL)

Ghi chú:
- Nhấn luồng dữ liệu chính và vai trò từng thành phần.
---
# 3. Kiến trúc hệ thống (triển khai nhanh)

- Frontend (React + Vite): giao diện upload ảnh, chọn triệu chứng, xem kết quả
- Backend API (FastAPI): proxy đến AI, lưu log phân tích (Postgres tùy chọn), proxy chatbot
- AI Service (FastAPI): phân tích ảnh với DermLIP + smart capture (chất lượng/Enhance)
- Chatbot Service (FastAPI + Gemini): Q&A, giải thích kết quả, trích xuất triệu chứng NL

Cổng mặc định:
- Frontend: 5173 | Backend: 8000 | AI: 8001 | Chatbot: 8002

Ghi chú:
- Docker compose/quick_start có sẵn; docs/README chỉ dẫn đầy đủ.
---
# 4. Hành trình người dùng (User Journey)

1) Mở web → đọc rõ cảnh báo y tế và quyền riêng tư
2) Chụp/tải ảnh vùng da, hệ thống gợi ý cách chụp (ánh sáng, nét, khung hình)
3) Chọn/mô tả triệu chứng + thời gian diễn ra
4) Nhấn Phân tích → nhận mức rủi ro + lý do + khuyến nghị
5) Dùng Chatbot để hỏi thêm, hiểu kết quả, biết khi nào cần đi khám

Ghi chú:
- Nhấn “triage-first”: đánh giá sơ bộ, hướng dẫn hành động an toàn.
---
# 5. Các thành phần & API chính

- AI Service
  - POST /analyze: ảnh + triệu chứng → AnalyzeResult (risk, reason, diseases, recommendations)
  - /capture: check-quality/tips/guidelines (smart capture)
- Backend API
  - POST /api/v1/analyze (proxy AI) | /api/v1/capture/* | /api/v1/chat (proxy Chatbot)
  - POST /api/v1/validate-symptoms: nhờ LLM trích xuất triệu chứng từ mô tả tự nhiên
- Chatbot Service
  - POST /chat: trả lời dựa trên context phân tích + lịch sử thoại; gợi ý câu hỏi tiếp theo

Ghi chú:
- Lớp Backend giúp đồng bộ giao tiếp và logging; Chatbot dùng GEMINI_API_KEY.
---
# 6. Quy trình phân tích ảnh & triệu chứng

- Nếu có: Smart Capture → kiểm tra chất lượng + tăng cường ảnh (không lưu ảnh)
- Phân tích ảnh: DermLIP (DermatologyAnalyzer) → bệnh chính + bệnh thay thế + độ tin cậy
- Kết hợp triệu chứng: điều chỉnh điểm theo SYMPTOM_HINTS và ưu tiên an toàn (critical/severe)
- Tính risk (CAO/🟥, TRUNG BÌNH/🟨, THẤP/🟩) + lý do + khuyến nghị hành động
- Trạng thái nhận diện: detected/normal/undetectable (dựa ảnh + triệu chứng)

Ghi chú:
- Luật thời lượng triệu chứng (dưới 1 tuần, 1–4 tuần, 1–3 tháng, >3 tháng, bẩm sinh) điều chỉnh mức cảnh báo.
---
# 7. An toàn, đạo đức & quyền riêng tư

- Không lưu ảnh người dùng; log chỉ lưu thông tin phân tích đã ẩn danh (tùy chọn)
- Cảnh báo rõ: không thay thế chẩn đoán, khuyến khích khám bác sĩ khi cần
- Chatbot có hệ thống hướng dẫn an toàn (không kê đơn/liều; escalations khi nguy cấp)
- Mã nguồn mở, minh bạch quy tắc và mô hình sử dụng

Ghi chú:
- Nhấn mạnh tính tuân thủ và bảo vệ người dùng.
---
# 8. Demo sử dụng (Quick Start)

- One-liner: ./quick_start.sh (yêu cầu Docker + Docker Compose)
- Hoặc thủ công:
  - AI Service: uvicorn ai_app.main:app --port 8001 --reload
  - Backend: uvicorn backend_app.main:app --port 8000 --reload
  - Frontend: npm run dev (5173)
  - Chatbot (tuỳ chọn): set GEMINI_API_KEY → uvicorn chatbot_app.main:app --port 8002

Mở:
- Frontend: http://localhost:5173
- API docs: http://localhost:8000/docs | http://localhost:8001/docs

Ghi chú:
- Có /health và /capture/tips để kiểm nhanh.
---
# 9. Kết quả mong đợi & giới hạn

Kết quả mong đợi:
- Phản hồi sơ bộ đáng tin cậy, có giải thích, hướng dẫn an toàn
- Hỗ trợ quyết định: có nên đi khám, khi nào cần khẩn cấp

Giới hạn:
- Không thay thế bác sĩ; chất lượng ảnh/triệu chứng ảnh hưởng kết quả
- DermLIP cần tài nguyên; có fallback đơn giản khi thiếu deps

Hướng phát triển:
- Lưu lịch sử cá nhân (được phép) | Báo cáo/giám sát chất lượng | Hỗ trợ đa ngôn ngữ
- Huấn luyện/điều chỉnh mô hình nội bộ; thêm kiểm định lâm sàng

Ghi chú:
- Đề xuất lộ trình nâng cấp theo nhu cầu.
---
# 10. Q&A

- Câu hỏi về triển khai, hiệu năng, độ chính xác, bảo mật?
- Thảo luận thêm kịch bản tích hợp thực tế (y tế cộng đồng, tele-dermatology)

Ghi chú:
- Gợi ý demo trực tiếp upload ảnh test và xem phản hồi.
