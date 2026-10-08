==================================================
PROJECT NAME
==================================================
SMARTBUILD
Smart Home Management System
House 01 (Single-Storey House)

==================================================
PROJECT OVERVIEW & CONTEXT
==================================================
SmartBuild is a university Smart Building prototype designed for residential single-family housing. While the broader academic research encompasses a 15-house residential estate, this prototype specifically delivers the refined, complete smart-home experience for HOUSE 01.

House 01 is an architecturally planned SINGLE-STOREY residential unit comprising six core rooms:
1. Ruang Tamu (Living Room)
2. Kamar Utama (Master Bedroom)
3. Kamar Tidur 2 (Bedroom 2)
4. Dapur (Kitchen)
5. Kamar Mandi (Bathroom)
6. Garasi (Garage & Carport)

==================================================
KEY IMPROVEMENTS & REDESIGN PRINCIPLES
==================================================
1. Modern, Calm & Comforting Light Visual Identity:
   - Replaced tiring high-contrast dark/neon cyberpunk motifs with a serene, natural, trustworthy light palette.
   - Warm off-white background (#F5F7F6), clean white surface cards (#FFFFFF), muted teal/blue-green primary (#1F6E7C), calming success green (#2A7955), warm amber warning (#B07016), and soft red (#BA3D3D).
   - High legibility charcoal text (#1D2D35 & #344852) - strictly avoiding pure #000000 black.

2. Designed for Parents & Older Adults (Accessibility-First):
   - Clear visual hierarchy with generous font sizes (no unreadable 8px-10px text).
   - Standard minimum touch target of 48px–56px for all buttons, toggles, steppers, and sliders.
   - "ICON + TEXT" pairing on all primary navigation and actions to eliminate cognitive ambiguity.
   - Direct accessibility toggles in Settings: Large Text (+scale), High Readability (contrast enhancement), and Reduce Animation.

3. Mobile-First Optimization (Tested at 390x844, 360x800, 430x932):
   - Dedicated 5-item mobile bottom navigation bar (Beranda, Ruangan, Lampu, Suhu, Lainnya).
   - "Lainnya" drawer sheet smoothly housing Listrik, Keamanan, Notifikasi, Pengaturan, and Keluar.
   - Safe-area inset spacing ensuring bottom navigation never clips or obscures content.
   - Floor plan contains a dedicated internal horizontal scroll wrapper on mobile, preserving digital architectural room layout, boundaries, and labels without distorting the page.

4. 100% Synchronized Shared State (Single Source of Truth):
   - All modules (Dashboard, Room Monitoring, Lighting, Climate, Energy, Security, Notifications) share one centralized state.
   - Changes made in any module (e.g., toggling a light, changing a temperature, activating Away mode, or opening a door sensor) instantly update every connected view and metric.
   - Full persistence via localStorage (`smartbuild_house01_state_v18`): page refresh preserves all user actions.

==================================================
APPLICATION MODULES & CORE CAPABILITIES
==================================================
1. Login:
   - Credentials:
     Username: admin
     Password: admin123
   - Welcoming card with house identity, Show Password toggle, and demo guidance.

2. Dashboard / Beranda:
   - Instantly answers the 5 essential homeowner questions:
     * Is the house safe? (✓ All Secure / Attention)
     * Is anyone home? (Occupancy count & room count)
     * Are the lights on? (Active light count)
     * Is the temperature comfortable? (Average temperature & comfort score)
     * Is electricity usage normal? (Daily kWh & savings)
   - Contextual greeting: Selamat Pagi / Siang / Sore / Malam based on time of day.
   - Quick Actions: All Lights Toggle, Home Mode, Away Mode, and Temperature shortcut.

3. Room Monitoring / Ruangan:
   - Digital architectural floor plan representation with room boundaries, doors, and driveway.
   - Interactive room selection updating the Room Details panel.
   - Direct controls on the selected room: Light toggle, Brightness slider, HVAC toggle, and [ - ] Target [ + ] temperature stepper.

4. Lighting / Lampu:
   - Master controls: SEMUA LAMPU ON, SEMUA LAMPU OFF, and Occupancy Automation.
   - Individual 6-room cards with large switches and brightness sliders.
   - Dynamic power calculation responding to brightness and room state.

5. Climate / Suhu & AC (HVAC):
   - Zone selection across all 6 rooms of House 01.
   - Master HVAC toggle per room.
   - Big thermostat display with [ - ] 24°C [ + ] controls.
   - 5 operation modes: AUTO, COOL, DRY, FAN, and OFF.
   - Family Comfort Index calculation and 6-zone state table.

6. Energy / Listrik:
   - Logical simulation reflecting real device states (more lights -> higher load, Away mode -> low standby ~0.2 kW).
   - Hourly trend simulation and dynamic donut chart breakdown (Lighting, HVAC, Other loads).
   - "Jalankan Optimasi Energi Sekarang" action to optimize household consumption.

7. Security / Keamanan:
   - Three distinct modes:
     * HOME: Standard residential operation.
     * AWAY: Automatically turns off all lights, sets all HVAC to standby, enables maximum alarm siaga, updates energy and dashboard.
     * NIGHT: Dims non-essential lighting, optimizes master bedroom temperature, and secures the perimeter.
   - Interactive door & window sensors (Main Door, Back Door, Living Window, Garage Door).
   - Motion detection testing and ARMED/DISARMED alarm toggle.

8. Notifications / Notifikasi:
   - Interactivity-driven event logging grouped into "HARI INI (TODAY)" and "SEBELUMNYA (EARLIER)".
   - Real-time unread badge tracking across topbar, desktop sidebar, and mobile menu.
   - "Tandai Semua Dibaca" and "Hapus Semua Notifikasi" controls.

9. Settings / Pengaturan:
   - Accessible UI toggles: Large Text, High Readability, and Reduce Animation.
   - Household profile customization and complete demo data reset.

==================================================
TECHNOLOGY STACK
==================================================
- Semantic HTML5
- Responsive Modern CSS3 (Grid, Flexbox, Custom Properties, Media Queries)
- Vanilla JavaScript (ES6+, Event-driven, LocalStorage Persistence)
- Zero external build dependencies — immediately runnable in any standard web browser.


============================================================
SMARTBUILD MOBILE REFINEMENT — REFERENSI + SKYLIGHT + UX
============================================================

Perubahan pada versi ini diprioritaskan untuk penggunaan smartphone.
Target viewport utama: 390 x 844.
Validasi tambahan: 360 x 800, 430 x 932, dan 768 x 1024.

Arah desain:
- modern, premium, warm, calm, clean
- terinspirasi dari kumpulan referensi UI smart-home, bukan copy salah satu gambar
- base light/warm dengan aksen hijau/earthy dan dark sebagai kontras
- elderly-friendly: teks readable, touch target besar, icon + text

Perbaikan UX:
- interaksi rutin menggunakan inline feedback, bukan popup
- toast dibatasi menjadi satu instance sehingga tidak dapat menumpuk
- tindakan penting dapat menggunakan toast ringan
- tindakan kritis menggunakan confirmation dialog

Fitur baru:
- Skylight Taman 1
- Skylight Taman 2
- mode AUTO / MANUAL
- kontrol OPEN / CLOSE
- status opening, kondisi, dan alasan automation
- integrasi dengan HOME / AWAY / NIGHT
- integrasi Dashboard, Room Monitoring, Climate, Energy, Security, Notifications
- dua marker skylight pada digital floor plan
- konsep indoor greenery di bawah skylight

PWA / App-like:
- manifest.json
- service worker sw.js
- icon-192.png dan icon-512.png

Cara menjalankan:
1. Buka index.html di browser untuk penggunaan biasa.
2. Untuk pengalaman PWA/installable, jalankan melalui web server lokal/hosting HTTPS,
   kemudian gunakan opsi Install App dari browser bila tersedia.
3. Untuk pengujian desain, gunakan Chrome DevTools > Device Toolbar dengan ukuran
   390 x 844 sebagai prioritas utama.
