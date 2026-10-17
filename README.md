# Saharat Labs — Website

เว็บไซต์ทางการขององค์กร **Saharat Labs** · The official website for **Saharat Labs**.

> AI agents, tools, and experiments — local-first and practical.

## 🔗 ลิงก์

- **เว็บที่เผยแพร่:** https://saharat-labs.github.io/
- **องค์กร:** https://github.com/Saharat-labs
- **ชุมชน (Discussions):** https://github.com/Saharat-labs/community/discussions

## 🧱 เทคโนโลยี

- Static **HTML / CSS / JavaScript** ล้วน — ไม่มี build step, ไม่มี dependency
- โฮสต์บน **GitHub Pages** (repo `<org>.github.io` = หน้าแรกขององค์กร)

```
.
├── index.html            # หน้าเดียว (single page)
├── assets/
│   ├── css/style.css     # ธีมมินิมอลโหมดมืด
│   └── js/main.js        # สลับภาษา, เมนู, animation
├── .nojekyll             # ปิดการประมวลผล Jekyll ของ Pages
└── README.md
```

## 🌐 การสลับภาษา (TH / EN)

ข้อความทุกชิ้นใช้แอตทริบิวต์กำกับ:

```html
<p data-th="ข้อความภาษาไทย" data-en="English text">ข้อความภาษาไทย</p>
```

- `main.js` จะสลับ `textContent` ตามภาษาที่เลือก
- จำค่าไว้ใน `localStorage` (`sl-lang`)
- ค่าเริ่มต้น: ไทย (ถ้าเบราว์เซอร์ตั้งภาษาไทยไว้ จะใช้ไทยอัตโนมัติ)

## ✏️ แก้ไขเนื้อหา

| อยากแก้ | ไปที่ |
|---|---|
| ข้อความทั้งหมด | `index.html` |
| สี / ธีม / ระยะห่าง | `assets/css/style.css` (ตัวแปรใน `:root`) |
| ลิงก์โปรเจกต์ | `index.html` ส่วน `#projects` |

## 🧪 รันในเครื่อง

```bash
python3 -m http.server 8080
# เปิด http://127.0.0.1:8080
```

## 🚀 เผยแพร่ (Deploy)

Push ขึ้น branch `main` — GitHub Pages จะอัปเดตอัตโนมัติภายใน ~1 นาที

```bash
git add -A
git commit -m "feat: ..."
git push
```

## 📄 สัญญาอนุญาต

© Saharat Labs
