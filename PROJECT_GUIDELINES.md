# Nguyên tắc Phát triển Dự án / Project Guidelines

Tài liệu tổng hợp từ `GUIDELINES.md` và `PROJECT_GUIDELINES.md`. Mục đích: hợp nhất các nguyên tắc phát triển, yêu cầu mở nguồn và hướng dẫn thực hành tốt để giảm "Points of FAIL" (PoF) và đảm bảo dự án dễ duy trì, có thể xây dựng, cài đặt và phát hành đúng chuẩn.

---

## Tổng quan (Overview)
- Mục tiêu: giảm thiểu PoF, duy trì khả năng phát triển bền vững.
- Yêu cầu chung: mã nguồn công khai, giấy phép OSI-approved, hướng dẫn build & cài đặt rõ ràng, kênh giao tiếp công khai, phát hành theo semver.

---

## Thước đo PoF (FAIL METER)
- 0 PoF: Hoàn hảo.
- 5-25 PoF: Tốt.
- 30-60 PoF: Cần cải tiến.
- 65-90 PoF: Rất không tốt.
- 95-130 PoF: Nguy hiểm.
- 135+ PoF: Dự án thất bại hoàn toàn.
- Mục tiêu dự án: PoF ≤ 60.

---

## I. Quản lý Mã nguồn (Source Control)
- BẮT BUỘC: Sử dụng VCS công khai (ưu tiên Git).
- BẮT BUỘC: Cung cấp trình xem web cho kho mã nguồn (GitHub/GitLab).
- BẮT BUỘC: Tài liệu cho người mới về cách dùng VCS (README / CONTRIBUTING).
- TUYỆT ĐỐI TRÁNH: Tự tạo hệ thống VCS riêng không chuẩn.

---

## II. Dịch từ Mã nguồn (Building From Source)
- BẮT BUỘC: Hướng dẫn build chi tiết, chính xác (README.md, INSTALL.md).
- BẮT BUỘC: Sử dụng công cụ xây dựng tiêu chuẩn (Make, CMake, setup.py/poetry cho Python, npm cho JS).
- TUYỆT ĐỐI TRÁNH: Yêu cầu chỉnh file config/header thủ công hoặc script cấu hình riêng.
- TUYỆT ĐỐI TRÁNH: Phụ thuộc vào công cụ đóng (ví dụ: Visual Studio-only).

---

## III. Quản lý Thư viện & Gói kèm (Libraries & Bundling)
- ƯU TIÊN: Dùng thư viện hệ thống khi có thể.
- ƯU TIÊN: Xây dựng shared libraries và đánh số phiên bản rõ ràng.
- TRÁNH: Chỉ build static libraries khi không thể khác.
- TRÁNH: Gói kèm mã nguồn của phụ thuộc; nếu bắt buộc thì không chỉnh sửa mã nguồn của chúng.
- ĐẢM BẢO: Tương thích giấy phép giữa các phụ thuộc và giấy phép chính.

---

## IV. Cài đặt (Installation)
- BẮT BUỘC: Cung cấp cơ chế cài đặt chuẩn (ví dụ: `make install`, `pip install .`, đóng gói `.deb`/Docker).
- BẮT BUỘC: Tuân thủ FHS và đường dẫn cài đặt chuẩn OS khi phù hợp.
- TRÁNH: Thiết kế chương trình chỉ chạy trong thư mục mã nguồn.

---

## V. Chất lượng Mã nguồn (Code Quality)
- BẮT BUỘC: Dùng LF (Unix) cho line endings.
- TUYỆT ĐỐI TRÁNH: Phụ thuộc vào lỗi/đặc tính của một trình biên dịch cụ thể.
- TUYỆT ĐỐI TRÁNH: Phụ thuộc vào công cụ đóng như Visual Studio.
- YÊU CẦU: Header tệp nguồn nêu rõ giấy phép và bản quyền khi cần.

---

## VI. Giao tiếp & Cộng đồng (Communication)
- BẮT BUỘC: Có website chính thức hoặc trang project.
- BẮT BUỘC: Có hệ thống quản lý lỗi công khai (Issues).
- BẮT BUỘC: Có kênh giao tiếp công khai (Discord/Telegram/Mailing list).
- BẮT BUỘC: Thông báo phát hành (release notes) cho mỗi phiên bản.

---

## VII. Phát hành (Releases)
- BẮT BUỘC: Dùng versioning rõ ràng (SemVer: Major.Minor.Patch).
- BẮT BUỘC: Sử dụng định dạng nén mở tiêu chuẩn (.tar.gz, .zip, .tar.xz).
- BẮT BUỘC: Khi giải nén phải có thư mục gốc chứa tên dự án và số phiên bản (ví dụ: my-project-1.2.3/).
- TUYỆT ĐÓI TRÁNH: Phát hành bằng định dạng độc quyền (.rar, .arj) hoặc chỉ đính kèm trên diễn đàn.

---

## VIII. Giấy phép (Licensing)
- BẮT BUỘC: Chọn giấy phép OSI-approved (MIT, Apache-2.0, GPLv3, BSD...).
- BẮT BUỘC: Bao gồm tệp `LICENSE` ở thư mục gốc.
- BẮT BUỘC: Ghi rõ giấy phép trong phần header từng tệp mã nguồn.
- BẮT BUỘC: Đảm bảo phụ thuộc tương thích license.

---

## IX. Tài liệu (Documentation)
- BẮT BUỘC: Có tài liệu hướng dẫn sử dụng và tài liệu kỹ thuật.
- BẮT BUỘC: Có changelog cho mỗi bản phát hành.
- KHUYẾN NGHỊ: Đưa docs lên website/ReadTheDocs/wiki; thêm ví dụ, ảnh chụp màn hình và video demo ngắn.

---

## X. Yêu cầu Tính năng & Chất lượng Sản phẩm (from PROJECT_GUIDELINES)
- Phần mềm phải chạy ổn định, core features đầy đủ với lỗi tối thiểu (ví dụ: CRUD, auth nếu cần).
- Có tính thân thiện người dùng: CLI có `--help`, Web UI responsive nếu có.
- Kỹ thuật: khuyến nghị sử dụng kiến trúc sạch, modular, patterns có thể mở rộng.
- Unit tests: bao gồm (pytest/unittest cho Python, jest/mocha cho JS).
- CI/CD: Thiết lập workflow (ví dụ: GitHub Actions) để tự động test/build.

---

## XI. Cấu trúc đề xuất dự án (Recommended Project Structure)
```
project/
│
├── README.md
├── LICENSE
├── INSTALL.md
├── CONTRIBUTING.md
├── docs/
├── src/
├── tests/
└── .github/
```

---

## XII. Mẹo phát triển (Development Tips)
- Commit nhỏ, có message rõ ràng.
- Giữ README ngắn gọn nhưng đủ (setup + usage).
- Ưu tiên giải pháp đơn giản, hoạt động hơn là phức tạp chưa hoàn thiện.
- Duy trì hoạt động repo: commits, issues, discussions.

---

## Phụ lục: Checklist nhanh trước khi release
- [ ] LICENSE có mặt và phù hợp.
- [ ] README + INSTALL + CONTRIBUTING cập nhật.
- [ ] Build & install test thành công từ source.
- [ ] Tests chạy và CI passing.
- [ ] Release notes rõ ràng theo SemVer.
- [ ] Changelog cập nhật.
- [ ] Kênh liên lạc và issue tracker hoạt động.

---

Tập hợp này kết hợp các yêu cầu bắt buộc và khuyến nghị nhằm giảm PoF và đảm bảo dự án dễ đóng góp, xây dựng và phát hành.
