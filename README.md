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
│   ├── js/main.js        # สลับภาษา, เมนู, active nav, render cards
│   ├── data/projects.json# ข้อมูลโปรเจกต์ (JS โหลดมาแสดงเป็นการ์ด)
│   ├── og.svg            # ต้นแบบภาพ social (แก้แล้วแปลงเป็น og.png)
│   └── og.png            # ภาพ social 1200×630 (ใช้กับ OG/Twitter)
├── sitemap.xml           # แผนที่เว็บ (SEO)
├── robots.txt            # อนุญาต crawler + ชี้ sitemap
├── LICENSE               # MIT
├── .github/workflows/
│   └── validate-html.yml # CI ตรวจ HTML ตอน push/PR
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
| ลิงก์/รายละเอียดโปรเจกต์ | `assets/data/projects.json` (เพิ่ม/ลบ object ได้เลย) |
| meta/SEO (canonical, OG, JSON-LD) | `index.html` ใน `<head>` |
| จำนวน/รายละเอียดที่โชว์บนการ์ดแชร์ | ดูหัวข้อ "อัปเดตภาพ OG" ด้านล่าง |

## 🖼️ อัปเดตภาพ OG (social share)

แก้ `assets/og.svg` (ไฟล์ต้นแบบ) แล้วแปลงเป็น PNG ขนาด 1200×630:

```bash
# ด้วย rsvg-convert (มีในระบบนี้)
rsvg-convert -w 1200 -h 630 assets/og.svg -o assets/og.png

# ทางเลือกอื่น
# convert assets/og.svg -background none -resize 1200x630 assets/og.png   # ImageMagick
# inkscape assets/og.svg --export-type=png -w 1200 -h 630 -o assets/og.png
```

หลังอัปเดต ให้ตรวจ preview (cache อาจค้าง — ต้อง scrape ใหม่):
- Facebook: https://developers.facebook.com/tools/debug/
- Twitter/X: https://cards-dev.twitter.com/validator

## 🔢 อัปเดตเวอร์ชัน (cache-busting)

เมื่อแก้ `style.css` หรือ `main.js` ให้ bump เลข `?v=` ใน `index.html`:

```html
<link rel="stylesheet" href="assets/css/style.css?v=1.1.0" />
<script src="assets/js/main.js?v=1.1.0"></script>
```

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

CI (`validate-html.yml`) จะรันตรวจ HTML อัตโนมัติทุก push/PR — ดูผลที่แท็บ **Actions**

## 📄 สัญญาอนุญาต

MIT — ดู [LICENSE](LICENSE) · © 2026 Saharat Labs
