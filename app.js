/**
 * SMARTBUILD — HOUSE 01
 * Smart Home Management System • Master Application Logic
 * Modern, Calm, Accessible & Synchronized State Architecture
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. DEFAULT STATE CONFIGURATION (HOUSE 01 • SINGLE-STOREY)
  // -------------------------------------------------------------------------
  const DEFAULT_ROOMS = {
    living: {
      id: 'living',
      name: 'Ruang Tamu (Living Room)',
      shortName: 'Ruang Tamu',
      icon: '🛋️',
      occupied: true,
      people: 2,
      currentTemp: 24.5,
      targetTemp: 24,
      lightOn: true,
      brightness: 80,
      hvacOn: true,
      hvacMode: 'COOL',
      fanSpeed: 'Sedang'
    },
    master: {
      id: 'master',
      name: 'Kamar Utama (Master Bed)',
      shortName: 'Kamar Utama',
      icon: '🛏️',
      occupied: true,
      people: 1,
      currentTemp: 23.5,
      targetTemp: 23,
      lightOn: true,
      brightness: 60,
      hvacOn: true,
      hvacMode: 'AUTO',
      fanSpeed: 'Rendah'
    },
    bed2: {
      id: 'bed2',
      name: 'Kamar Tidur 2 (Bedroom 2)',
      shortName: 'Kamar Tidur 2',
      icon: '🛏️',
      occupied: false,
      people: 0,
      currentTemp: 25.5,
      targetTemp: 26,
      lightOn: false,
      brightness: 0,
      hvacOn: false,
      hvacMode: 'AUTO',
      fanSpeed: 'Rendah'
    },
    kitchen: {
      id: 'kitchen',
      name: 'Dapur (Kitchen)',
      shortName: 'Dapur',
      icon: '🍳',
      occupied: true,
      people: 0, // Activity sensor without distinct seating
      currentTemp: 25.0,
      targetTemp: 25,
      lightOn: true,
      brightness: 75,
      hvacOn: true,
      hvacMode: 'COOL',
      fanSpeed: 'Sedang'
    },
    bath: {
      id: 'bath',
      name: 'Kamar Mandi (Bathroom)',
      shortName: 'Kamar Mandi',
      icon: '🚿',
      occupied: false,
      people: 0,
      currentTemp: 26.0,
      targetTemp: 26,
      lightOn: false,
      brightness: 0,
      hvacOn: false,
      hvacMode: 'AUTO',
      fanSpeed: 'Rendah'
    },
    garage: {
      id: 'garage',
      name: 'Garasi (Garage Area)',
      shortName: 'Garasi',
      icon: '🚗',
      occupied: false,
      people: 0,
      currentTemp: 27.0,
      targetTemp: 26,
      lightOn: false,
      brightness: 0,
      hvacOn: false,
      hvacMode: 'AUTO',
      fanSpeed: 'Rendah'
    }
  };

  const DEFAULT_STATE = {
    houseName: 'House 01',
    residentName: 'Admin',
    houseMode: 'home', // 'home' | 'away' | 'night'
    alarmArmed: true,
    automations: {
      lightingAuto: true,
      hvacAuto: true,
      energyAuto: true,
      occupancyRule: true,
      nightRule: true,
      awayRule: true
    },
    settings: {
      largeText: false,
      highReadability: false,
      reduceAnimation: false
    },
    sensors: {
      mainDoor: false,
      backDoor: false,
      livingWindow: false,
      garageDoor: false
    },
    motion: {
      living: false,
      hallway: false,
      garage: false,
      backyard: false
    },
    awaySnapshot: null,
    skylights: {
      skylight1: { id: 'skylight1', name: 'Skylight Taman 1', mode: 'auto', isOpen: false, opening: 0, condition: 'Aman', reason: 'Cahaya alami cukup' },
      skylight2: { id: 'skylight2', name: 'Skylight Taman 2', mode: 'auto', isOpen: false, opening: 0, condition: 'Aman', reason: 'Cahaya alami cukup' }
    },
    rooms: DEFAULT_ROOMS,
    notifications: [
      {
        id: 'notif-1',
        type: 'smart',
        icon: '✨',
        title: 'Sistem Tersinkronisasi',
        text: 'Seluruh sistem lampu, suhu & AC, listrik, dan keamanan House 01 telah terhubung.',
        timestamp: 'Hari ini, 08:00',
        category: 'today',
        read: false
      },
      {
        id: 'notif-2',
        type: 'energy',
        icon: '⚡',
        title: 'Optimasi Listrik Otomatis',
        text: 'Sistem penghematan aktif: 3 ruangan kosong berada dalam mode hemat daya.',
        timestamp: 'Hari ini, 07:45',
        category: 'today',
        read: true
      },
      {
        id: 'notif-3',
        type: 'security',
        icon: '🛡️',
        title: 'Pemeriksaan Keamanan Rutin',
        text: 'Semua sensor pintu dan jendela dalam kondisi terkunci rapat.',
        timestamp: 'Kemarin, 22:30',
        category: 'earlier',
        read: true
      }
    ]
  };

  const STORAGE_KEY = 'smartbuild_house01_state_v18';

  // -------------------------------------------------------------------------
  // 2. STATE MANAGEMENT & LOCAL STORAGE
  // -------------------------------------------------------------------------
  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return deepClone(DEFAULT_STATE);
      const parsed = JSON.parse(saved);
      const merged = deepClone(DEFAULT_STATE);
      Object.assign(merged, parsed);
      merged.rooms = Object.assign(deepClone(DEFAULT_ROOMS), parsed.rooms || {});
      merged.sensors = Object.assign(deepClone(DEFAULT_STATE.sensors), parsed.sensors || {});
      merged.motion = Object.assign(deepClone(DEFAULT_STATE.motion), parsed.motion || {});
      merged.automations = Object.assign(deepClone(DEFAULT_STATE.automations), parsed.automations || {});
      merged.settings = Object.assign(deepClone(DEFAULT_STATE.settings), parsed.settings || {});
      merged.skylights = Object.assign(deepClone(DEFAULT_STATE.skylights), parsed.skylights || {});
      Object.keys(DEFAULT_STATE.skylights).forEach(id => {
        merged.skylights[id] = Object.assign(deepClone(DEFAULT_STATE.skylights[id]), (parsed.skylights || {})[id] || {});
      });
      return merged;
    } catch (e) {
      console.warn('Gagal memuat state dari localStorage, menggunakan default:', e);
      return deepClone(DEFAULT_STATE);
    }
  }

  let state = loadState();
  let selectedRoomId = 'living';
  let selectedHVACZone = 'living';
  let currentPage = 'dashboard';

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Gagal menyimpan state ke localStorage:', e);
    }
  }

  function formatTimeNow() {
    const d = new Date();
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    return `Hari ini, ${h}:${m}`;
  }

  function addNotification(type, icon, title, text, category = 'today') {
    const notif = {
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      type,
      icon,
      title,
      text,
      timestamp: formatTimeNow(),
      category,
      read: false
    };
    state.notifications.unshift(notif);
    if (state.notifications.length > 50) {
      state.notifications = state.notifications.slice(0, 50);
    }
    saveState();
  }

  function notifyFromState() {
    saveState();
    refreshAllViews();
  }

  // -------------------------------------------------------------------------
  // 3. TOAST NOTIFICATION HELPER (SINGLE INSTANCE)
  // -------------------------------------------------------------------------
  let toastTimer = null;

  function showToast(icon, title, text) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    container.innerHTML = '';
    if (toastTimer) clearTimeout(toastTimer);

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.innerHTML = `
      <span class="toast-icon" aria-hidden="true">${icon}</span>
      <div class="toast-body"><strong>${title}</strong><p>${text}</p></div>
      <button class="toast-close" type="button" aria-label="Tutup Pemberitahuan">×</button>
    `;
    const closeBtn = toast.querySelector('.toast-close');
    const closeToast = () => {
      if (!toast.parentElement) return;
      toast.classList.add('is-closing');
      setTimeout(() => { if (toast.parentElement) toast.remove(); }, 170);
    };
    closeBtn.addEventListener('click', closeToast);
    container.appendChild(toast);
    toastTimer = setTimeout(closeToast, 3200);
  }

  // -------------------------------------------------------------------------
  // 4. COMPUTED METRICS & HELPERS
  // -------------------------------------------------------------------------
  function getOccupiedRooms() {
    if (state.houseMode === 'away') return [];
    return Object.values(state.rooms).filter(r => r.occupied);
  }

  function getEmptyRooms() {
    if (state.houseMode === 'away') return Object.values(state.rooms);
    return Object.values(state.rooms).filter(r => !r.occupied);
  }

  function getLightsOnRooms() {
    return Object.values(state.rooms).filter(r => r.lightOn && r.brightness > 0);
  }

  function getHVACActiveRooms() {
    return Object.values(state.rooms).filter(r => r.hvacOn && r.hvacMode !== 'OFF');
  }

  function getAverageTemperature() {
    const rooms = Object.values(state.rooms);
    const sum = rooms.reduce((acc, r) => acc + r.currentTemp, 0);
    return (sum / rooms.length).toFixed(1);
  }

  function calculateLightingWatts() {
    return getLightsOnRooms().reduce((sum, r) => {
      return sum + Math.round((r.brightness / 100) * 85); // Up to ~85W per room LED array
    }, 0);
  }

  function calculateHVACLoadPercent() {
    const active = getHVACActiveRooms();
    if (!active.length) return 0;
    const avgDiff = active.reduce((sum, r) => sum + Math.abs(r.currentTemp - r.targetTemp), 0) / active.length;
    return Math.min(95, Math.round(25 + avgDiff * 18));
  }

  function calculateHVACPowerKw() {
    const active = getHVACActiveRooms();
    if (!active.length) return 0.0;
    const base = active.length * 0.45; // ~0.45 kW per zone
    const loadFactor = calculateHVACLoadPercent() / 100;
    return (base + loadFactor * 0.95).toFixed(1);
  }

  function calculateTotalCurrentPower() {
    if (state.houseMode === 'away') {
      return '0.22 kW'; // Base vampire/standby load in away mode
    }
    const lightKw = calculateLightingWatts() / 1000;
    const hvacKw = parseFloat(calculateHVACPowerKw());
    const baseLoads = 0.35; // Fridge, WiFi, smart hub
    return (lightKw + hvacKw + baseLoads).toFixed(2) + ' kW';
  }

  function calculateDailyEnergyKwh() {
    if (state.houseMode === 'away') {
      return '4.8';
    }
    const lightKwh = (calculateLightingWatts() / 1000) * 8.5;
    const hvacKwh = parseFloat(calculateHVACPowerKw()) * 4.2;
    const baseKwh = 3.2;
    return (lightKwh + hvacKwh + baseKwh).toFixed(1);
  }

  function calculateEnergySavingPercent() {
    let saving = 12.0;
    if (state.automations.lightingAuto) saving += 4.5;
    if (state.automations.hvacAuto) saving += 5.0;
    if (state.houseMode === 'away') saving += 12.0;
    if (state.houseMode === 'night') saving += 3.5;
    const emptyCount = getEmptyRooms().length;
    saving += emptyCount * 1.2;
    return Math.min(38.5, saving).toFixed(1);
  }

  function calculateSecurityScore() {
    let score = 98;
    const openSensors = Object.values(state.sensors).filter(Boolean).length;
    score -= openSensors * 8;
    const motionCount = Object.values(state.motion).filter(Boolean).length;
    score -= motionCount * 4;
    if (!state.alarmArmed) score -= 15;
    return Math.max(45, score);
  }

  function calculateComfortScore() {
    const occ = getOccupiedRooms();
    if (!occ.length) return 100;
    const penalty = occ.reduce((sum, r) => {
      const diff = Math.abs(r.currentTemp - r.targetTemp);
      const hvacPenalty = r.hvacOn ? 0 : 8;
      return sum + diff * 6 + hvacPenalty;
    }, 0);
    return Math.max(65, Math.round(100 - penalty));
  }

  function getContextualGreeting() {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 11) return 'Selamat Pagi';
    if (hour >= 11 && hour < 15) return 'Selamat Siang';
    if (hour >= 15 && hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  }

  // -------------------------------------------------------------------------
  // 5. SKYLIGHT STATE & AUTOMATION
  // -------------------------------------------------------------------------
  function getSkylightValues() { return Object.values(state.skylights || {}); }
  function getOpenSkylightCount() { return getSkylightValues().filter(s => s.isOpen).length; }

  function evaluateSkylightAutomation(announce = false) {
    const skylights = getSkylightValues();
    if (!skylights.length) return;
    const hottestTemp = Math.max(...Object.values(state.rooms).map(r => r.currentTemp));
    const safeMode = state.houseMode === 'away' || state.houseMode === 'night';
    const heatPressure = hottestTemp >= 26;

    skylights.forEach((s, index) => {
      if (s.mode !== 'auto') return;
      const wasOpen = !!s.isOpen;
      const wasCondition = s.condition;

      if (safeMode) {
        s.isOpen = false; s.opening = 0; s.condition = 'Mode aman';
        s.reason = state.houseMode === 'away' ? 'Rumah AWAY • skylight ditutup' : 'Mode NIGHT • skylight ditutup';
      } else if (heatPressure) {
        s.isOpen = index === 0 || hottestTemp >= 27;
        s.opening = s.isOpen ? (index === 0 ? 75 : 55) : 0;
        s.condition = s.isOpen ? 'Kurangi panas' : 'Siap otomatis';
        s.reason = s.isOpen ? `Suhu area tinggi (${hottestTemp.toFixed(1)}°C)` : 'Ventilasi masih cukup';
      } else {
        s.isOpen = false; s.opening = 0; s.condition = 'Aman'; s.reason = 'Cahaya alami cukup';
      }

      if (announce && (wasOpen !== s.isOpen || wasCondition !== s.condition)) {
        addNotification('smart', s.isOpen ? '☀️' : '🌿', `${s.name} ${s.isOpen ? 'Dibuka Otomatis' : 'Ditutup Otomatis'}`, `${s.reason}. Mode otomatis SmartBuild menyesuaikan kondisi rumah.`);
      }
    });
  }

  function setSkylight(id, action) {
    const s = state.skylights[id];
    if (!s) return;
    if (action === 'auto' || action === 'manual') {
      s.mode = action;
      if (action === 'auto') evaluateSkylightAutomation(true);
    } else if (action === 'open' || action === 'close') {
      s.mode = 'manual';
      s.isOpen = action === 'open';
      s.opening = s.isOpen ? 100 : 0;
      s.condition = s.isOpen ? 'Manual • Terbuka' : 'Manual • Tertutup';
      s.reason = s.isOpen ? 'Dibuka dari aplikasi' : 'Ditutup dari aplikasi';
    }
    saveState();
    refreshAllViews();
  }

  // -------------------------------------------------------------------------
  // 6. HOUSE SECURITY MODES & AUTOMATION LOGIC
  // -------------------------------------------------------------------------
  function applyHouseMode(mode, emitNotification = true) {
    const prevMode = state.houseMode;
    state.houseMode = mode;

    if (mode === 'away') {
      // 1. Snapshot previous state before turning everything off
      if (!state.awaySnapshot) {
        state.awaySnapshot = deepClone(state.rooms);
      }

      // 2. Turn all lights OFF
      Object.values(state.rooms).forEach(r => {
        r.lightOn = false;
        r.brightness = 0;
        r.hvacOn = false;
        r.occupied = false;
        r.people = 0;
      });

      getSkylightValues().forEach(s => {
        s.isOpen = false; s.opening = 0; s.condition = 'Mode aman'; s.reason = 'Rumah AWAY • skylight ditutup';
      });

      // 4. Ensure alarm is armed
      state.alarmArmed = true;

      if (emitNotification) {
        addNotification(
          'security',
          '🧳',
          'Mode Pergi (AWAY) Diaktifkan',
          'Rumah kosong: seluruh lampu dipadamkan, AC memasuki mode standby, dan sistem alarm diaktifkan penuh.'
        );
        showToast('🧳', 'Mode Pergi (AWAY) Aktif', 'Lampu OFF, AC Standby & Rumah Terkunci.');
      }
    } else if (mode === 'home') {
      // Restore previous state if snapshot exists
      if (state.awaySnapshot) {
        Object.entries(state.awaySnapshot).forEach(([id, snap]) => {
          if (state.rooms[id]) {
            state.rooms[id].lightOn = snap.lightOn;
            state.rooms[id].brightness = snap.brightness;
            state.rooms[id].hvacOn = snap.hvacOn;
            state.rooms[id].hvacMode = snap.hvacMode;
            state.rooms[id].occupied = snap.occupied;
            state.rooms[id].people = snap.people;
          }
        });
        state.awaySnapshot = null;
      } else {
        // Safe standard home defaults
        state.rooms.living.occupied = true;
        state.rooms.living.people = 2;
        state.rooms.living.lightOn = true;
        state.rooms.living.brightness = 80;
        state.rooms.living.hvacOn = true;
        state.rooms.master.occupied = true;
        state.rooms.master.people = 1;
      }

      if (emitNotification && prevMode !== 'home') {
        addNotification(
          'smart',
          '🏠',
          'Mode Di Rumah (HOME) Diaktifkan',
          'Selamat datang di rumah: pencahayaan dan pendingin ruangan dipulihkan ke pengaturan nyaman Anda.'
        );
      }
    } else if (mode === 'night') {
      // Night calm mode
      if (state.awaySnapshot) {
        Object.entries(state.awaySnapshot).forEach(([id, snap]) => {
          if (state.rooms[id]) {
            state.rooms[id].occupied = snap.occupied;
            state.rooms[id].people = snap.people;
          }
        });
        state.awaySnapshot = null;
      }

      // Optimize lights for sleep
      Object.values(state.rooms).forEach(r => {
        if (r.id === 'master') {
          r.hvacOn = true;
          r.targetTemp = 23;
          r.lightOn = true;
          r.brightness = 25; // Gentle night lamp
        } else if (r.id === 'living') {
          r.lightOn = false;
          r.brightness = 0;
          r.hvacOn = false;
        } else {
          r.lightOn = false;
          r.brightness = 0;
          r.hvacOn = false;
        }
      });

      getSkylightValues().forEach(s => {
        s.isOpen = false; s.opening = 0; s.condition = 'Mode aman'; s.reason = 'Mode NIGHT • skylight ditutup';
      });

      state.alarmArmed = true;

      if (emitNotification) {
        addNotification(
          'smart',
          '🌙',
          'Mode Malam (NIGHT) Diaktifkan',
          'Pencahayaan umum dipadamkan, lampu kamar diredupkan, dan pendingin kamar diatur ke suhu nyaman 23°C.'
        );
      }
    }

    notifyFromState();
  }

  // -------------------------------------------------------------------------
  // 6. VIEW RENDERING: 1. DASHBOARD
  // -------------------------------------------------------------------------
  function renderDashboard() {
    const greeting = getContextualGreeting();
    const dashGreetingEl = document.getElementById('dashGreeting');
    if (dashGreetingEl) dashGreetingEl.textContent = greeting;

    const residentName = state.residentName || 'Admin';
    const topUserName = document.getElementById('topUserName');
    const sideUserName = document.getElementById('sideUserName');
    if (topUserName) topUserName.textContent = residentName;
    if (sideUserName) sideUserName.textContent = residentName;

    // Mode Pill in Header
    const topModeText = document.getElementById('topModeText');
    const topModePill = document.getElementById('topModePill');
    const sideHouseMode = document.getElementById('sideHouseMode');
    const modeLabel = state.houseMode.toUpperCase() + ' MODE';
    if (topModeText) topModeText.textContent = modeLabel;
    if (sideHouseMode) sideHouseMode.textContent = modeLabel;
    if (topModePill) {
      topModePill.className = 'mode-pill-top ' + (state.houseMode === 'away' ? 'status-alert' : 'status-safe');
    }

    // Answers to 5 Key Questions
    const openSensors = Object.values(state.sensors).filter(Boolean).length;
    const isSafe = openSensors === 0 && state.alarmArmed;
    const ansSafe = document.getElementById('ansSafe');
    const ansSafeSub = document.getElementById('ansSafeSub');
    if (ansSafe) ansSafe.textContent = isSafe ? 'Aman Terkunci' : 'Perlu Perhatian';
    if (ansSafeSub) ansSafeSub.textContent = isSafe ? 'Sensor & alarm aktif siaga' : `${openSensors} sensor terbuka`;

    const occCount = getOccupiedRooms().length;
    const totalPeople = Object.values(state.rooms).reduce((sum, r) => sum + r.people, 0);
    const ansOccupancy = document.getElementById('ansOccupancy');
    const ansOccupancySub = document.getElementById('ansOccupancySub');
    if (ansOccupancy) {
      ansOccupancy.textContent = state.houseMode === 'away' ? 'Rumah Kosong (Away)' : `${totalPeople} Orang di Rumah`;
    }
    if (ansOccupancySub) {
      ansOccupancySub.textContent = state.houseMode === 'away' ? 'Semua penghuni bepergian' : `${occCount} dari 6 ruangan aktif`;
    }

    const lightsOnCount = getLightsOnRooms().length;
    const ansLights = document.getElementById('ansLights');
    const ansLightsSub = document.getElementById('ansLightsSub');
    if (ansLights) ansLights.textContent = `${lightsOnCount} Lampu Menyala`;
    if (ansLightsSub) ansLightsSub.textContent = `${6 - lightsOnCount} ruangan padam otomatis`;

    const avgTemp = getAverageTemperature();
    const ansTemp = document.getElementById('ansTemp');
    const ansTempSub = document.getElementById('ansTempSub');
    if (ansTemp) ansTemp.textContent = `${avgTemp}°C • Nyaman`;
    if (ansTempSub) ansTempSub.textContent = `Indeks kenyamanan ${calculateComfortScore()}%`;

    const dailyKwh = calculateDailyEnergyKwh();
    const ansPower = document.getElementById('ansPower');
    const ansPowerSub = document.getElementById('ansPowerSub');
    if (ansPower) ansPower.textContent = `${dailyKwh} kWh • Normal`;
    if (ansPowerSub) ansPowerSub.textContent = `Hemat ${calculateEnergySavingPercent()}% hari ini`;

    // Summary Stats Cards
    const dashOccupiedCount = document.getElementById('dashOccupiedCount');
    const dashPeopleCount = document.getElementById('dashPeopleCount');
    if (dashOccupiedCount) dashOccupiedCount.textContent = `${occCount} Ruangan`;
    if (dashPeopleCount) dashPeopleCount.textContent = `Total ${totalPeople} orang di dalam`;

    const dashLightsOnCount = document.getElementById('dashLightsOnCount');
    const dashLightsWatt = document.getElementById('dashLightsWatt');
    if (dashLightsOnCount) dashLightsOnCount.textContent = `${lightsOnCount} / 6`;
    if (dashLightsWatt) dashLightsWatt.textContent = `Beban lampu ~${calculateLightingWatts()} W`;

    const hvacActiveCount = getHVACActiveRooms().length;
    const dashHVACActiveCount = document.getElementById('dashHVACActiveCount');
    if (dashHVACActiveCount) dashHVACActiveCount.textContent = `${hvacActiveCount} Ruangan`;

    const dashCurrentPower = document.getElementById('dashCurrentPower');
    if (dashCurrentPower) dashCurrentPower.textContent = calculateTotalCurrentPower();

    // Quick Actions States
    const dashQuickLightBadge = document.getElementById('dashQuickLightBadge');
    if (dashQuickLightBadge) {
      dashQuickLightBadge.textContent = `${lightsOnCount} ON`;
      dashQuickLightBadge.className = 'action-badge ' + (lightsOnCount > 0 ? 'active' : '');
    }

    const dashQuickHomeBadge = document.getElementById('dashQuickHomeBadge');
    const dashQuickAwayBadge = document.getElementById('dashQuickAwayBadge');
    if (dashQuickHomeBadge) {
      dashQuickHomeBadge.className = 'action-badge ' + (state.houseMode === 'home' ? 'active' : '');
      dashQuickHomeBadge.textContent = state.houseMode === 'home' ? 'AKTIF' : 'PILIH';
    }
    if (dashQuickAwayBadge) {
      dashQuickAwayBadge.className = 'action-badge ' + (state.houseMode === 'away' ? 'active' : '');
      dashQuickAwayBadge.textContent = state.houseMode === 'away' ? 'AKTIF' : 'SIAP';
    }

    // Safety Pill
    const dashboardSafetyPill = document.getElementById('dashboardSafetyPill');
    const dashboardSafetyText = document.getElementById('dashboardSafetyText');
    if (dashboardSafetyPill && dashboardSafetyText) {
      if (isSafe) {
        dashboardSafetyPill.className = 'status-pill status-safe';
        dashboardSafetyText.textContent = '✓ All Secure • Rumah Aman';
      } else {
        dashboardSafetyPill.className = 'status-pill status-alert';
        dashboardSafetyText.textContent = `⚠️ Perhatian • ${openSensors} Sensor Terbuka`;
      }
    }

    getSkylightValues().forEach(s => {
      const status = document.getElementById(`dashSkylightStatus-${s.id}`);
      const condition = document.getElementById(`dashSkylightCondition-${s.id}`);
      const card = document.getElementById(`dashSkylightCard-${s.id}`);
      if (status) status.textContent = `${s.isOpen ? 'OPEN' : 'CLOSED'} • ${s.mode.toUpperCase()}`;
      if (condition) condition.textContent = `${s.condition} • ${s.reason}`;
      if (card) card.classList.toggle('is-open', s.isOpen);
    });
    const dashboardSkylightOpen = document.getElementById('dashboardSkylightOpen');
    if (dashboardSkylightOpen) dashboardSkylightOpen.onclick = () => {
      navigateTo('rooms');
      setTimeout(() => {
        const panel = document.getElementById('skylightControlPanel');
        if (panel) panel.scrollIntoView({ behavior: state.settings.reduceAnimation ? 'auto' : 'smooth', block: 'start' });
      }, 70);
    };

    // Recent Activities List
    const activityContainer = document.getElementById('dashboardActivityList');
    if (activityContainer) {
      const recent = state.notifications.slice(0, 4);
      activityContainer.innerHTML = recent.map(n => `
        <div class="activity-item">
          <div class="activity-icon-box" aria-hidden="true">${n.icon}</div>
          <div>
            <strong>${n.title}</strong>
            <p>${n.text}</p>
            <small>${n.timestamp}</small>
          </div>
        </div>
      `).join('');
    }
  }

  // -------------------------------------------------------------------------
  // 7. VIEW RENDERING: 2. ROOM MONITORING & FLOOR PLAN
  // -------------------------------------------------------------------------
  function renderRooms() {
    const occRooms = getOccupiedRooms();
    const emptyRooms = getEmptyRooms();
    const lightsOn = getLightsOnRooms();

    const roomOccupiedCount = document.getElementById('roomOccupiedCount');
    const roomEmptyCount = document.getElementById('roomEmptyCount');
    const roomLightsRatio = document.getElementById('roomLightsRatio');
    const roomAutoModeState = document.getElementById('roomAutoModeState');

    if (roomOccupiedCount) roomOccupiedCount.textContent = `${occRooms.length} Ruangan`;
    if (roomEmptyCount) roomEmptyCount.textContent = `${emptyRooms.length} Ruangan`;
    if (roomLightsRatio) roomLightsRatio.textContent = `${lightsOn.length} / 6`;
    if (roomAutoModeState) roomAutoModeState.textContent = state.automations.lightingAuto ? 'AKTIF' : 'MANUAL';

    // Update Floor Plan Room Badges
    Object.values(state.rooms).forEach(r => {
      const roomBtn = document.getElementById('planRoom-' + r.id);
      if (roomBtn) {
        roomBtn.className = 'plan-room ' +
          (r.id === selectedRoomId ? 'selected ' : '') +
          (!r.occupied ? 'empty' : '');

        const occEl = document.getElementById('planOcc-' + r.id);
        const tempEl = document.getElementById('planTemp-' + r.id);
        const lightEl = document.getElementById('planLight-' + r.id);
        const hvacEl = document.getElementById('planHVAC-' + r.id);

        if (occEl) occEl.textContent = state.houseMode === 'away' ? 'Kosong (Away)' : (r.occupied ? (r.people ? `👤 ${r.people} Orang` : 'Aktivitas') : 'Kosong');
        if (tempEl) tempEl.textContent = `${r.currentTemp.toFixed(1)}°C`;
        if (lightEl) {
          lightEl.textContent = r.lightOn && r.brightness > 0 ? `💡 ${r.brightness}%` : '💡 OFF';
          lightEl.className = 'plan-badge light ' + (r.lightOn && r.brightness > 0 ? '' : 'off');
        }
        if (hvacEl) {
          hvacEl.textContent = r.hvacOn ? `❄ ${r.hvacMode}` : 'STANDBY';
          hvacEl.className = 'plan-badge hvac ' + (r.hvacOn ? '' : 'off');
        }
      }
    });

    // Render Skylight Controls + Selected Room Panel
    renderSkylights();
    renderSelectedRoomDetail();

    // Render 6-Room Condition List
    const condList = document.getElementById('roomConditionList');
    if (condList) {
      condList.innerHTML = Object.values(state.rooms).map(r => `
        <div class="condition-item">
          <div class="condition-left">
            <span class="condition-icon" aria-hidden="true">${r.icon}</span>
            <div>
              <strong>${r.shortName}</strong>
              <small>${state.houseMode === 'away' ? 'Mode Pergi (Standby)' : (r.occupied ? `Berpenghuni (${r.people} orang)` : 'Kosong (Hemat Daya)')}</small>
            </div>
          </div>
          <div class="condition-right">
            <strong>${r.lightOn && r.brightness > 0 ? `💡 ON (${r.brightness}%)` : '💡 OFF'}</strong>
            <small>${r.hvacOn ? `❄ ${r.targetTemp}°C ${r.hvacMode}` : '❄ AC Standby'}</small>
          </div>
        </div>
      `).join('');
    }
  }

  function renderSkylights() {
    getSkylightValues().forEach(s => {
      const planStatus = document.getElementById(`planSkylightStatus-${s.id}`);
      const planBtn = document.getElementById(`planSkylight-${s.id}`);
      const card = document.querySelector(`[data-skylight-card="${s.id}"]`);
      const chip = document.getElementById(`skylightStatusChip-${s.id}`);
      const mode = document.getElementById(`skylightModeLabel-${s.id}`);
      const condition = document.getElementById(`skylightConditionLabel-${s.id}`);
      const opening = document.getElementById(`skylightOpeningLabel-${s.id}`);
      const progress = document.getElementById(`skylightProgress-${s.id}`);
      const note = document.getElementById(`skylightNote-${s.id}`);
      if (planStatus) planStatus.textContent = s.isOpen ? `OPEN ${s.opening}%` : 'CLOSED';
      if (planBtn) planBtn.classList.toggle('is-open', s.isOpen);
      if (card) card.classList.toggle('is-open', s.isOpen);
      if (chip) { chip.textContent = s.isOpen ? 'OPEN' : 'CLOSED'; chip.className = `skylight-status-chip ${s.isOpen ? 'open' : 'closed'}`; }
      if (mode) mode.textContent = s.mode.toUpperCase();
      if (condition) condition.textContent = s.condition;
      if (opening) opening.textContent = `${s.opening}%`;
      if (progress) progress.style.width = `${s.opening}%`;
      if (note) note.textContent = s.mode === 'manual'
        ? (s.isOpen ? 'Kontrol manual aktif • Skylight tetap terbuka sampai Anda menutupnya.' : 'Kontrol manual aktif • Skylight tetap tertutup sampai Anda membukanya.')
        : `AUTO aktif • ${s.reason}.`;
      if (card) card.querySelectorAll('[data-skylight-action="mode"]').forEach(btn => btn.classList.toggle('active', btn.dataset.mode === s.mode));
    });
    const tag = document.getElementById('skylightSummaryTag');
    const openCount = getOpenSkylightCount();
    if (tag) tag.textContent = `${openCount} OPEN • ${2-openCount} CLOSED`;
  }

  function renderSelectedRoomDetail() {
    const room = state.rooms[selectedRoomId] || state.rooms.living;
    const selectedRoomTitle = document.getElementById('selectedRoomTitle');
    const selectedRoomIcon = document.getElementById('selectedRoomIcon');
    const selectedRoomBadge = document.getElementById('selectedRoomBadge');
    const selectedRoomPeople = document.getElementById('selectedRoomPeople');
    const selectedRoomTemp = document.getElementById('selectedRoomTemp');
    const selectedRoomTarget = document.getElementById('selectedRoomTarget');
    const selectedRoomLightState = document.getElementById('selectedRoomLightState');
    const selectedRoomLightWatt = document.getElementById('selectedRoomLightWatt');
    const selectedRoomHVACState = document.getElementById('selectedRoomHVACState');
    const selectedRoomHVACMode = document.getElementById('selectedRoomHVACMode');

    if (selectedRoomTitle) selectedRoomTitle.textContent = room.name;
    if (selectedRoomIcon) selectedRoomIcon.textContent = room.icon;

    if (selectedRoomBadge) {
      const isOcc = state.houseMode !== 'away' && room.occupied;
      selectedRoomBadge.textContent = isOcc ? 'BERPENGHUNI' : 'KOSONG (HEMAT)';
      selectedRoomBadge.className = 'room-chip ' + (isOcc ? 'active-chip' : 'empty-chip');
    }

    if (selectedRoomPeople) {
      selectedRoomPeople.textContent = state.houseMode === 'away' ? '0 Orang (Away)' : `${room.people} Orang`;
    }
    if (selectedRoomTemp) selectedRoomTemp.textContent = `${room.currentTemp.toFixed(1)}°C`;
    if (selectedRoomTarget) selectedRoomTarget.textContent = `Target ${room.targetTemp}°C`;

    const isLightOn = room.lightOn && room.brightness > 0;
    if (selectedRoomLightState) {
      selectedRoomLightState.textContent = isLightOn ? `MENYALA (${room.brightness}%)` : 'PADAM (OFF)';
    }
    if (selectedRoomLightWatt) {
      selectedRoomLightWatt.textContent = isLightOn ? `Konsumsi ~${Math.round((room.brightness / 100) * 85)} W` : 'Konsumsi 0 W';
    }

    if (selectedRoomHVACState) {
      selectedRoomHVACState.textContent = room.hvacOn ? `AKTIF • ${room.hvacMode}` : 'STANDBY (HEMAT)';
    }
    if (selectedRoomHVACMode) {
      selectedRoomHVACMode.textContent = room.hvacOn ? `Kipas: ${room.fanSpeed}` : 'Kipas Nonaktif';
    }

    // Update Interactive Controls in Panel
    const lightToggle = document.getElementById('selectedRoomLightToggle');
    if (lightToggle) lightToggle.checked = isLightOn;

    const brightSlider = document.getElementById('selectedRoomBrightnessSlider');
    const brightVal = document.getElementById('selectedRoomBrightnessVal');
    if (brightSlider) brightSlider.value = room.brightness;
    if (brightVal) brightVal.textContent = `${room.brightness}%`;

    const hvacToggle = document.getElementById('selectedRoomHVACToggle');
    if (hvacToggle) hvacToggle.checked = room.hvacOn;

    const targetVal = document.getElementById('roomTargetTempVal');
    if (targetVal) targetVal.textContent = `${room.targetTemp}°C`;
  }

  // -------------------------------------------------------------------------
  // 8. VIEW RENDERING: 3. LIGHTING (LAMPU)
  // -------------------------------------------------------------------------
  function renderLighting() {
    const lightsOn = getLightsOnRooms();
    const totalWatt = calculateLightingWatts();

    const activeCount = document.getElementById('lightingActiveCount');
    const totalWattEl = document.getElementById('lightingTotalWatt');
    const autoText = document.getElementById('lightingAutoText');
    const globalToggle = document.getElementById('globalLightingAutoToggle');

    if (activeCount) activeCount.textContent = `${lightsOn.length} / 6 Ruangan`;
    if (totalWattEl) totalWattEl.textContent = `${totalWatt} W`;
    if (autoText) autoText.textContent = state.automations.lightingAuto ? 'AKTIF (AUTO)' : 'MANUAL';
    if (globalToggle) globalToggle.checked = state.automations.lightingAuto;

    // Render 6 room cards
    const grid = document.getElementById('lightCardsGrid');
    if (grid) {
      grid.innerHTML = Object.values(state.rooms).map(r => {
        const isOn = r.lightOn && r.brightness > 0;
        return `
          <article class="light-room-card ${isOn ? 'is-on' : ''}" data-room-card="${r.id}">
            <div class="light-card-top">
              <div class="room-icon-box" aria-hidden="true">${r.icon}</div>
              <label class="toggle-switch" aria-label="Nyalakan atau matikan lampu ${r.shortName}">
                <input type="checkbox" class="room-light-checkbox" data-room-id="${r.id}" ${isOn ? 'checked' : ''}>
                <span class="toggle-slider"></span>
              </label>
            </div>
            <div class="light-card-body">
              <h3>${r.shortName}</h3>
              <p>${state.houseMode === 'away' ? 'Mode Pergi' : (r.occupied ? `Ada Penghuni (${r.people} orang)` : 'Ruangan Kosong')}</p>
              <span class="light-status-tag ${isOn ? 'on' : 'off'}">${isOn ? `MENYALA (${r.brightness}%)` : 'PADAM'}</span>
            </div>
            <div class="light-slider-section">
              <div class="slider-label-row">
                <span>Tingkat Cahaya:</span>
                <strong id="cardBrightText-${r.id}">${r.brightness}%</strong>
              </div>
              <input type="range" min="0" max="100" value="${r.brightness}" class="room-light-slider" data-room-id="${r.id}" aria-label="Slider Kecerahan ${r.shortName}">
            </div>
          </article>
        `;
      }).join('');

      // Attach event listeners to lighting checkboxes
      grid.querySelectorAll('.room-light-checkbox').forEach(cb => {
        cb.addEventListener('change', e => {
          const roomId = e.target.dataset.roomId;
          const room = state.rooms[roomId];
          if (!room) return;
          room.lightOn = e.target.checked;
          if (room.lightOn && room.brightness === 0) {
            room.brightness = 75;
          } else if (!room.lightOn) {
            room.brightness = 0;
          }
          notifyFromState();
        });
      });

      // Attach event listeners to brightness sliders
      grid.querySelectorAll('.room-light-slider').forEach(slider => {
        slider.addEventListener('input', e => {
          const roomId = e.target.dataset.roomId;
          const room = state.rooms[roomId];
          if (!room) return;
          const val = parseInt(e.target.value, 10);
          room.brightness = val;
          room.lightOn = val > 0;
          const label = document.getElementById('cardBrightText-' + roomId);
          if (label) label.textContent = `${val}%`;
          notifyFromState();
        });
      });
    }
  }

  // -------------------------------------------------------------------------
  // 9. VIEW RENDERING: 4. CLIMATE / SUHU & AC (HVAC)
  // -------------------------------------------------------------------------
  function renderHVAC() {
    const avgTemp = getAverageTemperature();
    const hvacLoad = calculateHVACLoadPercent();
    const hvacPower = calculateHVACPowerKw();
    const selectedRoom = state.rooms[selectedHVACZone] || state.rooms.living;

    const hvacAvgTempDisplay = document.getElementById('hvacAvgTempDisplay');
    const hvacSelectedTargetDisplay = document.getElementById('hvacSelectedTargetDisplay');
    const hvacSelectedZoneName = document.getElementById('hvacSelectedZoneName');
    const hvacLoadDisplay = document.getElementById('hvacLoadDisplay');
    const hvacPowerDisplay = document.getElementById('hvacPowerDisplay');

    if (hvacAvgTempDisplay) hvacAvgTempDisplay.textContent = `${avgTemp}°C`;
    if (hvacSelectedTargetDisplay) hvacSelectedTargetDisplay.textContent = `${selectedRoom.targetTemp}°C`;
    if (hvacSelectedZoneName) hvacSelectedZoneName.textContent = selectedRoom.shortName;
    if (hvacLoadDisplay) hvacLoadDisplay.textContent = `${hvacLoad}%`;
    if (hvacPowerDisplay) hvacPowerDisplay.textContent = `${hvacPower} kW`;

    // Zone Selector Buttons (6 Rooms)
    const selectorGrid = document.getElementById('hvacZoneSelectorGrid');
    if (selectorGrid) {
      selectorGrid.innerHTML = Object.values(state.rooms).map(r => `
        <button type="button" class="zone-btn ${r.id === selectedHVACZone ? 'active' : ''}" data-zone-id="${r.id}">
          <strong>${r.shortName}</strong>
          <small>${r.currentTemp.toFixed(1)}°C • ${r.hvacOn ? r.hvacMode : 'STANDBY'}</small>
        </button>
      `).join('');

      selectorGrid.querySelectorAll('.zone-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          selectedHVACZone = btn.dataset.zoneId;
          renderHVAC();
        });
      });
    }

    // Thermostat Display Details
    const zoneTitle = document.getElementById('thermostatZoneTitle');
    const currentTemp = document.getElementById('thermostatCurrentTemp');
    const targetTempDisplay = document.getElementById('hvacTargetTempDisplay');
    const occupancyDisplay = document.getElementById('hvacZoneOccupancy');
    const fanSpeedDisplay = document.getElementById('hvacFanSpeedDisplay');
    const powerToggle = document.getElementById('hvacZonePowerToggle');
    const powerToggleLabel = document.getElementById('hvacPowerToggleLabel');

    if (zoneTitle) zoneTitle.textContent = selectedRoom.name.toUpperCase();
    if (currentTemp) currentTemp.textContent = `${selectedRoom.currentTemp.toFixed(1)}°C`;
    if (targetTempDisplay) targetTempDisplay.textContent = `${selectedRoom.targetTemp}°C`;
    if (occupancyDisplay) {
      occupancyDisplay.textContent = state.houseMode === 'away' ? '0 Orang (Away)' : (selectedRoom.occupied ? `${selectedRoom.people} Orang` : 'Ruangan Kosong');
    }
    if (fanSpeedDisplay) fanSpeedDisplay.textContent = selectedRoom.hvacOn ? selectedRoom.fanSpeed : 'Mati (Standby)';
    if (powerToggle) powerToggle.checked = selectedRoom.hvacOn;
    if (powerToggleLabel) powerToggleLabel.textContent = selectedRoom.hvacOn ? 'AC RUANGAN: ON' : 'AC RUANGAN: OFF';

    // Highlight Active HVAC Mode
    document.querySelectorAll('#page-hvac .btn-mode').forEach(btn => {
      const mode = btn.dataset.mode;
      const isActive = selectedRoom.hvacOn && selectedRoom.hvacMode === mode;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-checked', isActive ? 'true' : 'false');
    });

    // Comfort Score
    const comfortVal = calculateComfortScore();
    const comfortScoreVal = document.getElementById('comfortScoreVal');
    const comfortScoreFillBar = document.getElementById('comfortScoreFillBar');
    if (comfortScoreVal) comfortScoreVal.textContent = comfortVal;
    if (comfortScoreFillBar) comfortScoreFillBar.style.width = comfortVal + '%';

    // HVAC Table for 6 Zones
    const tableBody = document.getElementById('hvacTableBody');
    if (tableBody) {
      tableBody.innerHTML = Object.values(state.rooms).map(r => `
        <tr>
          <td><strong>${r.shortName}</strong></td>
          <td>${r.currentTemp.toFixed(1)}°C</td>
          <td>${r.targetTemp}°C</td>
          <td><span class="table-badge-mode">${r.hvacMode}</span></td>
          <td>${state.houseMode === 'away' ? 'Kosong (Away)' : (r.occupied ? `Ada (${r.people} orang)` : 'Kosong')}</td>
          <td><span class="table-badge-status ${r.hvacOn ? '' : 'standby'}">${r.hvacOn ? 'RUNNING (AKTIF)' : 'STANDBY'}</span></td>
        </tr>
      `).join('');
    }
  }

  // -------------------------------------------------------------------------
  // 10. VIEW RENDERING: 5. ENERGY (LISTRIK)
  // -------------------------------------------------------------------------
  function renderEnergy() {
    const totalKwh = calculateDailyEnergyKwh();
    const savingPct = calculateEnergySavingPercent();
    const lightingWatts = calculateLightingWatts();
    const hvacKw = calculateHVACPowerKw();

    const energyTotalKwh = document.getElementById('energyTotalKwh');
    const energySavingPct = document.getElementById('energySavingPct');
    const energyLightingLoadVal = document.getElementById('energyLightingLoadVal');
    const energyHVACLoadVal = document.getElementById('energyHVACLoadVal');
    const donutTotalKwh = document.getElementById('donutTotalKwh');

    if (energyTotalKwh) energyTotalKwh.textContent = `${totalKwh} kWh`;
    if (energySavingPct) energySavingPct.textContent = `${savingPct}%`;
    if (energyLightingLoadVal) energyLightingLoadVal.textContent = `${lightingWatts} W`;
    if (energyHVACLoadVal) energyHVACLoadVal.textContent = `${hvacKw} kW`;
    if (donutTotalKwh) donutTotalKwh.textContent = totalKwh;

    // Breakdown proportions
    const lightKwh = parseFloat(((lightingWatts / 1000) * 8.5).toFixed(1));
    const hvacTotalKwh = parseFloat((parseFloat(hvacKw) * 4.2).toFixed(1));
    const otherKwh = 3.3;
    const sum = lightKwh + hvacTotalKwh + otherKwh || 1;

    const lp = Math.round((lightKwh / sum) * 100);
    const hp = Math.round((hvacTotalKwh / sum) * 100);
    const op = Math.max(0, 100 - lp - hp);

    const breakdownLightingKwh = document.getElementById('breakdownLightingKwh');
    const breakdownLightingPct = document.getElementById('breakdownLightingPct');
    const breakdownHVACKwh = document.getElementById('breakdownHVACKwh');
    const breakdownHVACPct = document.getElementById('breakdownHVACPct');
    const breakdownOtherKwh = document.getElementById('breakdownOtherKwh');
    const breakdownOtherPct = document.getElementById('breakdownOtherPct');
    const donutRing = document.getElementById('energyDonutRing');

    if (breakdownLightingKwh) breakdownLightingKwh.textContent = `${lightKwh} kWh terpakai`;
    if (breakdownLightingPct) breakdownLightingPct.textContent = `${lp}%`;
    if (breakdownHVACKwh) breakdownHVACKwh.textContent = `${hvacTotalKwh} kWh terpakai`;
    if (breakdownHVACPct) breakdownHVACPct.textContent = `${hp}%`;
    if (breakdownOtherKwh) breakdownOtherKwh.textContent = `${otherKwh} kWh terpakai`;
    if (breakdownOtherPct) breakdownOtherPct.textContent = `${op}%`;

    if (donutRing) {
      donutRing.style.background = `conic-gradient(var(--primary) 0% ${lp}%, #68A7B3 ${lp}% ${lp + hp}%, #D2E2E5 ${lp + hp}% 100%)`;
    }

    const energySkylightNote = document.getElementById('energySkylightNote');
    if (energySkylightNote) {
      const openCount = getOpenSkylightCount();
      const autoCount = Object.values(state.skylights || {}).filter(s => s.mode === 'auto').length;
      energySkylightNote.textContent = openCount > 0
        ? `Skylight aktif: ${openCount}/2 terbuka • ventilasi/cahaya alami ikut diperhitungkan.`
        : `Skylight: 2/2 tertutup • mode otomatis ${autoCount}/2 • tidak ada beban motor aktif.`;
    }

    // Chart Area Visual Response
    const chartAreaFill = document.getElementById('chartAreaFill');
    const chartLineStroke = document.getElementById('chartLineStroke');
    if (chartAreaFill && chartLineStroke) {
      const activeKw = parseFloat(calculateTotalCurrentPower());
      const factor = Math.min(1.0, activeKw / 4.0);
      const topPct = Math.round(55 - factor * 30);
      chartLineStroke.style.top = `${topPct}%`;
      chartAreaFill.style.clipPath = `polygon(0% 100%, 0% ${topPct + 35}%, 15% ${topPct + 25}%, 30% ${topPct + 10}%, 45% ${topPct + 20}%, 60% ${topPct - 5}%, 75% ${topPct + 5}%, 90% ${topPct - 15}%, 100% ${topPct - 20}%, 100% 100%)`;
    }
  }

  // -------------------------------------------------------------------------
  // 11. VIEW RENDERING: 6. SECURITY (KEAMANAN)
  // -------------------------------------------------------------------------
  function renderSecurity() {
    const openCount = Object.values(state.sensors).filter(Boolean).length;
    const motionCount = Object.values(state.motion).filter(Boolean).length;
    const isSafe = openCount === 0 && motionCount === 0 && state.alarmArmed;

    const secOverallState = document.getElementById('secOverallState');
    const secOpenSensorsCount = document.getElementById('secOpenSensorsCount');
    const secMotionActiveCount = document.getElementById('secMotionActiveCount');
    const secAlarmState = document.getElementById('secAlarmState');

    if (secOverallState) {
      secOverallState.textContent = isSafe ? '✓ All Secure' : '⚠️ Perlu Perhatian';
      secOverallState.style.color = isSafe ? 'var(--success)' : 'var(--danger)';
    }
    if (secOpenSensorsCount) secOpenSensorsCount.textContent = `${openCount} Sensor Terbuka`;
    if (secMotionActiveCount) secMotionActiveCount.textContent = `${motionCount} Titik Gerak`;
    if (secAlarmState) secAlarmState.textContent = state.alarmArmed ? 'AKTIF (ARMED)' : 'NONAKTIF (DISARMED)';

    // Mode Buttons active state
    document.querySelectorAll('.sec-mode-btn').forEach(btn => {
      const mode = btn.dataset.secMode;
      btn.classList.toggle('active', mode === state.houseMode);
      btn.setAttribute('aria-checked', mode === state.houseMode ? 'true' : 'false');
      const badge = btn.querySelector('.sec-mode-badge');
      if (badge) badge.textContent = mode === state.houseMode ? 'AKTIF' : 'PILIH';
    });

    // Integration Effect text
    const effectTitle = document.getElementById('secModeEffectTitle');
    const effectDesc = document.getElementById('secModeEffectDesc');
    if (effectTitle && effectDesc) {
      if (state.houseMode === 'away') {
        effectTitle.textContent = 'Efek Mode Pergi (AWAY)';
        effectDesc.textContent = 'Seluruh lampu OFF, semua zona AC standby, dan sensor pintu/jendela memicu alarm seketika saat terbuka.';
      } else if (state.houseMode === 'night') {
        effectTitle.textContent = 'Efek Mode Malam (NIGHT)';
        effectDesc.textContent = 'Perimeter luar siaga penuh, lampu umum padam, dan kamar tidur terjaga pada suhu nyaman 23°C.';
      } else {
        effectTitle.textContent = 'Efek Mode Di Rumah (HOME)';
        effectDesc.textContent = 'Pencahayaan dan pendingin ruangan mengikuti kebutuhan normal masing-masing ruangan. Sensor gerak bekerja wajar.';
      }
    }

    // Alarm Card
    const alarmTitle = document.getElementById('alarmCardTitle');
    const alarmDesc = document.getElementById('alarmCardDesc');
    const alarmBtnText = document.getElementById('btnAlarmText');
    const alarmIcon = document.getElementById('alarmBadgeIcon');
    if (alarmTitle) alarmTitle.textContent = state.alarmArmed ? 'Sistem Alarm Siaga (ARMED)' : 'Sistem Alarm Nonaktif (DISARMED)';
    if (alarmDesc) alarmDesc.textContent = state.alarmArmed ? 'Sensor keamanan aktif memantau akses rumah secara menyeluruh.' : 'Alarm dinonaktifkan sementara untuk kemudahan akses penghuni.';
    if (alarmBtnText) alarmBtnText.textContent = state.alarmArmed ? 'NONAKTIFKAN (DISARM)' : 'AKTIFKAN ALARM (ARM)';
    if (alarmIcon) alarmIcon.textContent = state.alarmArmed ? '🛡️' : '🔓';

    // Health Score
    const secHealth = calculateSecurityScore();
    const secHealthScoreVal = document.getElementById('secHealthScoreVal');
    const secHealthBar = document.getElementById('secHealthBar');
    if (secHealthScoreVal) secHealthScoreVal.textContent = secHealth;
    if (secHealthBar) secHealthBar.style.width = secHealth + '%';

    // Sensor Toggles & Badges
    Object.entries(state.sensors).forEach(([key, isOpen]) => {
      const toggle = document.querySelector(`.sensor-toggle-input[data-sensor-key="${key}"]`);
      const badge = document.getElementById('sensorStatus-' + key);
      if (toggle) toggle.checked = isOpen;
      if (badge) {
        badge.textContent = isOpen ? 'TERBUKA' : 'TERTUTUP (RAPAT)';
        badge.className = 'sensor-status-badge ' + (isOpen ? 'open' : 'closed');
      }
    });

    // Motion Sensor Indicators
    Object.entries(state.motion).forEach(([key, isMotion]) => {
      const tag = document.getElementById('motionStatus-' + key);
      if (tag) {
        tag.textContent = isMotion ? 'TERDETEKSI GERAKAN' : 'NORMAL';
        tag.className = 'motion-tag ' + (isMotion ? 'alert' : '');
      }
    });

    // Security History Events
    const historyContainer = document.getElementById('securityEventsList');
    if (historyContainer) {
      const secEvents = state.notifications.filter(n => n.type === 'security');
      if (secEvents.length === 0) {
        historyContainer.innerHTML = '<p class="data-action-note">Belum ada peristiwa keamanan tercatat.</p>';
      } else {
        historyContainer.innerHTML = secEvents.slice(0, 6).map(e => `
          <div class="sec-event-item">
            <span class="sec-event-icon" aria-hidden="true">${e.icon}</span>
            <div>
              <strong>${e.title}</strong>
              <p>${e.text}</p>
              <small>${e.timestamp}</small>
            </div>
          </div>
        `).join('');
      }
    }
  }

  // -------------------------------------------------------------------------
  // 12. VIEW RENDERING: 7. NOTIFICATIONS (NOTIFIKASI)
  // -------------------------------------------------------------------------
  function renderNotifications() {
    const unreadCount = state.notifications.filter(n => !n.read).length;
    const secCount = state.notifications.filter(n => n.type === 'security').length;
    const energyCount = state.notifications.filter(n => n.type === 'energy').length;
    const smartCount = state.notifications.filter(n => n.type === 'smart').length;

    const notifUnreadCount = document.getElementById('notifUnreadCount');
    const notifSecurityCount = document.getElementById('notifSecurityCount');
    const notifEnergyCount = document.getElementById('notifEnergyCount');
    const notifSmartCount = document.getElementById('notifSmartCount');

    if (notifUnreadCount) notifUnreadCount.textContent = unreadCount;
    if (notifSecurityCount) notifSecurityCount.textContent = secCount;
    if (notifEnergyCount) notifEnergyCount.textContent = energyCount;
    if (notifSmartCount) notifSmartCount.textContent = smartCount;

    // Badges in Topbar and Sidebar
    const navBadge = document.getElementById('navBadge');
    const mobileMoreNotifBadge = document.getElementById('mobileMoreNotifBadge');
    const topAlertDot = document.getElementById('topAlertDot');

    if (navBadge) navBadge.textContent = unreadCount;
    if (mobileMoreNotifBadge) mobileMoreNotifBadge.textContent = unreadCount;
    if (topAlertDot) topAlertDot.classList.toggle('hidden', unreadCount === 0);

    // Grouping: Today and Earlier
    const todayList = document.getElementById('notifListToday');
    const earlierList = document.getElementById('notifListEarlier');

    const todayItems = state.notifications.filter(n => n.category === 'today' || n.timestamp.startsWith('Hari ini'));
    const earlierItems = state.notifications.filter(n => n.category === 'earlier' && !n.timestamp.startsWith('Hari ini'));

    function renderNotifItems(items) {
      if (!items.length) {
        return '<p class="data-action-note" style="padding: 10px 0;">Tidak ada pemberitahuan.</p>';
      }
      return items.map(n => `
        <div class="notification-row type-${n.type} ${n.read ? '' : 'unread'}">
          <span class="notif-icon-circle" aria-hidden="true">${n.icon}</span>
          <div class="notif-content-wrap">
            <strong>${n.title}</strong>
            <p>${n.text}</p>
            <small>${n.timestamp}</small>
          </div>
          <span class="notif-status-badge ${n.read ? 'read' : 'new'}">${n.read ? 'DIBACA' : 'BARU'}</span>
        </div>
      `).join('');
    }

    if (todayList) todayList.innerHTML = renderNotifItems(todayItems);
    if (earlierList) earlierList.innerHTML = renderNotifItems(earlierItems);
  }

  // -------------------------------------------------------------------------
  // 13. VIEW RENDERING: 8. SETTINGS & ACCESSIBILITY
  // -------------------------------------------------------------------------
  function applyAccessibilitySettings() {
    const root = document.documentElement;
    root.classList.toggle('large-text', !!state.settings.largeText);
    root.classList.toggle('high-readability', !!state.settings.highReadability);
    root.classList.toggle('reduce-animation', !!state.settings.reduceAnimation);
  }

  function renderSettings() {
    const largeTextCb = document.getElementById('settingLargeText');
    const highReadCb = document.getElementById('settingHighReadability');
    const reduceAnimCb = document.getElementById('settingReduceAnimation');
    const houseNameInput = document.getElementById('cfgHouseName');
    const homeOwnerInput = document.getElementById('cfgHomeOwner');

    if (largeTextCb) largeTextCb.checked = !!state.settings.largeText;
    if (highReadCb) highReadCb.checked = !!state.settings.highReadability;
    if (reduceAnimCb) reduceAnimCb.checked = !!state.settings.reduceAnimation;
    if (houseNameInput) houseNameInput.value = state.houseName || 'House 01';
    if (homeOwnerInput) homeOwnerInput.value = state.residentName || 'Admin';

    applyAccessibilitySettings();
  }

  // -------------------------------------------------------------------------
  // 14. ROUTING & NAVIGATION
  // -------------------------------------------------------------------------
  function navigateTo(pageId) {
    currentPage = pageId;

    // Hide all pages, show target
    document.querySelectorAll('.page-view').forEach(v => v.classList.add('hidden'));
    const targetEl = document.getElementById('page-' + pageId);
    if (targetEl) targetEl.classList.remove('hidden');

    // Update active nav in Desktop Sidebar
    document.querySelectorAll('.nav-item[data-page]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.page === pageId);
    });

    // Update active nav in Mobile Bottom Nav
    document.querySelectorAll('.mobile-nav-item[data-page]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.page === pageId);
    });

    // Close Mobile More Sheet if open
    const moreMenu = document.getElementById('mobileMoreMenu');
    if (moreMenu) moreMenu.classList.add('hidden');

    // Update Breadcrumb
    const pageTitle = document.getElementById('pageTitle');
    const titleMap = {
      dashboard: 'Beranda',
      rooms: 'Ruangan',
      lighting: 'Lampu',
      hvac: 'Suhu & AC',
      energy: 'Listrik',
      security: 'Keamanan',
      notifications: 'Notifikasi',
      settings: 'Pengaturan'
    };
    if (pageTitle) pageTitle.textContent = titleMap[pageId] || 'Beranda';

    // Scroll to top comfortably
    window.scrollTo({ top: 0, behavior: state.settings.reduceAnimation ? 'auto' : 'smooth' });

    // Re-render corresponding page view
    refreshAllViews();
  }

  function refreshAllViews() {
    evaluateSkylightAutomation(false);
    applyAccessibilitySettings();
    renderDashboard();
    renderRooms();
    renderLighting();
    renderHVAC();
    renderEnergy();
    renderSecurity();
    renderNotifications();
    renderSettings();
  }

  // -------------------------------------------------------------------------
  // 15. INITIALIZATION & GLOBAL EVENT LISTENERS
  // -------------------------------------------------------------------------
  let handlersInitialized = false;

  function initEventHandlers() {
    if (handlersInitialized) return;
    handlersInitialized = true;
    // 1. Login Form Submit
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');
    const loginPage = document.getElementById('loginPage');
    const appPage = document.getElementById('appPage');

    if (loginForm) {
      loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const u = document.getElementById('username').value.trim();
        const p = document.getElementById('password').value.trim();

        if (u === 'admin' && p === 'admin123') {
          if (loginMessage) loginMessage.textContent = '';
          loginPage.classList.add('hidden');
          appPage.classList.remove('hidden');
          navigateTo('dashboard');
          showToast('🏠', 'Selamat Datang di House 01', 'Sistem rumah pintar siap digunakan.');
        } else {
          if (loginMessage) {
            loginMessage.textContent = 'Nama pengguna atau kata sandi salah. Gunakan admin / admin123.';
            loginMessage.className = 'message error';
          }
        }
      });
    }

    // Show Password Checkbox
    const showPassword = document.getElementById('showPassword');
    const passwordInput = document.getElementById('password');
    if (showPassword && passwordInput) {
      showPassword.addEventListener('change', () => {
        passwordInput.type = showPassword.checked ? 'text' : 'password';
      });
    }

    // Logout Buttons (Desktop and Mobile)
    const logoutBtn = document.getElementById('logoutBtn');
    const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
    function performLogout() {
      appPage.classList.add('hidden');
      loginPage.classList.remove('hidden');
      if (loginMessage) loginMessage.textContent = '';
      showToast('↪', 'Telah Keluar', 'Anda telah keluar dari sistem.');
    }
    if (logoutBtn) logoutBtn.addEventListener('click', performLogout);
    if (mobileLogoutBtn) mobileLogoutBtn.addEventListener('click', performLogout);

    // Navigation Click Handlers (Delegated)
    document.addEventListener('click', e => {
      const pageBtn = e.target.closest('[data-page]');
      if (pageBtn) {
        const page = pageBtn.dataset.page;
        navigateTo(page);
      }
    });

    // Mobile More Menu Drawer Toggle
    const mobileMoreBtn = document.getElementById('mobileMoreBtn');
    const mobileMoreMenu = document.getElementById('mobileMoreMenu');
    const closeMobileMore = document.getElementById('closeMobileMore');

    if (mobileMoreBtn && mobileMoreMenu) {
      mobileMoreBtn.addEventListener('click', e => {
        e.stopPropagation();
        mobileMoreMenu.classList.toggle('hidden');
      });
    }
    if (closeMobileMore && mobileMoreMenu) {
      closeMobileMore.addEventListener('click', () => {
        mobileMoreMenu.classList.add('hidden');
      });
    }

    // Accessibility Quick Font Toggle in Topbar
    const quickFontToggle = document.getElementById('quickFontToggle');
    if (quickFontToggle) {
      quickFontToggle.addEventListener('click', () => {
        state.settings.largeText = !state.settings.largeText;
        notifyFromState();
      });
    }

    // Dashboard Quick Action: All Lights Toggle
    const dashQuickAllLights = document.getElementById('dashQuickAllLights');
    if (dashQuickAllLights) {
      dashQuickAllLights.addEventListener('click', () => {
        const anyOn = getLightsOnRooms().length > 0;
        Object.values(state.rooms).forEach(r => {
          r.lightOn = !anyOn;
          r.brightness = anyOn ? 0 : 75;
        });
        notifyFromState();
      });
    }

    // Dashboard Quick Action: Home Mode
    const dashQuickHomeMode = document.getElementById('dashQuickHomeMode');
    if (dashQuickHomeMode) {
      dashQuickHomeMode.addEventListener('click', () => applyHouseMode('home', true));
    }

    // Dashboard Quick Action: Away Mode
    const dashQuickAwayMode = document.getElementById('dashQuickAwayMode');
    if (dashQuickAwayMode) {
      dashQuickAwayMode.addEventListener('click', () => {
        if (state.houseMode === 'away') return;
        if (confirm('Aktifkan Mode AWAY? Semua lampu dan AC akan dinonaktifkan, skylight ditutup, dan alarm diaktifkan.')) {
          applyHouseMode('away', true);
        }
      });
    }

    // Floor Plan Interactive Room Selection
    document.querySelectorAll('.plan-room').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedRoomId = btn.dataset.roomId;
        renderRooms();
      });
    });

    // Skylight controls: no popup for routine open/close/mode changes
    document.querySelectorAll('.plan-skylight').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.skylightId;
        navigateTo('rooms');
        setTimeout(() => {
          const target = document.querySelector(`[data-skylight-card="${id}"]`);
          if (target) {
            target.classList.add('is-focused');
            target.scrollIntoView({ behavior: state.settings.reduceAnimation ? 'auto' : 'smooth', block: 'center' });
            setTimeout(() => target.classList.remove('is-focused'), 1000);
          }
        }, 70);
      });
    });
    document.querySelectorAll('[data-skylight-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.skylightId;
        const action = btn.dataset.skylightAction === 'mode' ? btn.dataset.mode : btn.dataset.skylightAction;
        setSkylight(id, action);
      });
    });

    // Selected Room Quick Controls in Room Monitoring
    const selectedRoomLightToggle = document.getElementById('selectedRoomLightToggle');
    if (selectedRoomLightToggle) {
      selectedRoomLightToggle.addEventListener('change', e => {
        const room = state.rooms[selectedRoomId];
        if (!room) return;
        room.lightOn = e.target.checked;
        room.brightness = room.lightOn ? (room.brightness || 75) : 0;
        notifyFromState();
      });
    }

    const selectedRoomBrightnessSlider = document.getElementById('selectedRoomBrightnessSlider');
    if (selectedRoomBrightnessSlider) {
      selectedRoomBrightnessSlider.addEventListener('input', e => {
        const room = state.rooms[selectedRoomId];
        if (!room) return;
        const val = parseInt(e.target.value, 10);
        room.brightness = val;
        room.lightOn = val > 0;
        notifyFromState();
      });
    }

    const selectedRoomHVACToggle = document.getElementById('selectedRoomHVACToggle');
    if (selectedRoomHVACToggle) {
      selectedRoomHVACToggle.addEventListener('change', e => {
        const room = state.rooms[selectedRoomId];
        if (!room) return;
        room.hvacOn = e.target.checked;
        notifyFromState();
      });
    }

    const roomTempMinusBtn = document.getElementById('roomTempMinusBtn');
    const roomTempPlusBtn = document.getElementById('roomTempPlusBtn');
    if (roomTempMinusBtn) {
      roomTempMinusBtn.addEventListener('click', () => {
        const room = state.rooms[selectedRoomId];
        if (!room) return;
        room.targetTemp = Math.max(18, room.targetTemp - 1);
        room.hvacOn = true;
        notifyFromState();
      });
    }
    if (roomTempPlusBtn) {
      roomTempPlusBtn.addEventListener('click', () => {
        const room = state.rooms[selectedRoomId];
        if (!room) return;
        room.targetTemp = Math.min(30, room.targetTemp + 1);
        room.hvacOn = true;
        notifyFromState();
      });
    }

    // Global Lighting Master Buttons
    const btnAllLightsOn = document.getElementById('btnAllLightsOn');
    const btnAllLightsOff = document.getElementById('btnAllLightsOff');
    if (btnAllLightsOn) {
      btnAllLightsOn.addEventListener('click', () => {
        Object.values(state.rooms).forEach(r => {
          r.lightOn = true;
          r.brightness = r.brightness || 75;
        });
        notifyFromState();
      });
    }
    if (btnAllLightsOff) {
      btnAllLightsOff.addEventListener('click', () => {
        Object.values(state.rooms).forEach(r => {
          r.lightOn = false;
          r.brightness = 0;
        });
        notifyFromState();
      });
    }

    const globalLightingAutoToggle = document.getElementById('globalLightingAutoToggle');
    if (globalLightingAutoToggle) {
      globalLightingAutoToggle.addEventListener('change', e => {
        state.automations.lightingAuto = e.target.checked;
        notifyFromState();
      });
    }

    // Climate HVAC Page Controls
    const hvacZonePowerToggle = document.getElementById('hvacZonePowerToggle');
    if (hvacZonePowerToggle) {
      hvacZonePowerToggle.addEventListener('change', e => {
        const room = state.rooms[selectedHVACZone];
        if (!room) return;
        room.hvacOn = e.target.checked;
        notifyFromState();
      });
    }

    const hvacMinusTempBtn = document.getElementById('hvacMinusTempBtn');
    const hvacPlusTempBtn = document.getElementById('hvacPlusTempBtn');
    if (hvacMinusTempBtn) {
      hvacMinusTempBtn.addEventListener('click', () => {
        const room = state.rooms[selectedHVACZone];
        if (!room) return;
        room.targetTemp = Math.max(18, room.targetTemp - 1);
        room.hvacOn = true;
        notifyFromState();
      });
    }
    if (hvacPlusTempBtn) {
      hvacPlusTempBtn.addEventListener('click', () => {
        const room = state.rooms[selectedHVACZone];
        if (!room) return;
        room.targetTemp = Math.min(30, room.targetTemp + 1);
        room.hvacOn = true;
        notifyFromState();
      });
    }

    // HVAC Mode Buttons: AUTO, COOL, DRY, FAN, OFF
    document.querySelectorAll('#page-hvac .btn-mode').forEach(btn => {
      btn.addEventListener('click', () => {
        const room = state.rooms[selectedHVACZone];
        if (!room) return;
        const mode = btn.dataset.mode;
        if (mode === 'OFF') {
          room.hvacOn = false;
          room.hvacMode = 'OFF';
        } else {
          room.hvacOn = true;
          room.hvacMode = mode;
        }
        notifyFromState();
      });
    });

    const smartHVACMasterToggle = document.getElementById('smartHVACMasterToggle');
    if (smartHVACMasterToggle) {
      smartHVACMasterToggle.addEventListener('change', e => {
        state.automations.hvacAuto = e.target.checked;
        notifyFromState();
      });
    }

    const refreshHVACTableBtn = document.getElementById('refreshHVACTableBtn');
    if (refreshHVACTableBtn) {
      refreshHVACTableBtn.addEventListener('click', () => {
        renderHVAC();
      });
    }

    // Energy Optimization Action
    const btnRunOptimization = document.getElementById('btnRunOptimization');
    if (btnRunOptimization) {
      btnRunOptimization.addEventListener('click', () => {
        // Logically dim over-bright occupied rooms slightly and turn off empty room lights
        Object.values(state.rooms).forEach(r => {
          if (!r.occupied && r.lightOn) {
            r.lightOn = false;
            r.brightness = 0;
          } else if (r.occupied && r.brightness > 70) {
            r.brightness = 65; // High efficiency comfortable lighting
          }
        });
        addNotification('energy', '⚡', 'Optimasi Energi Berhasil Dijalankan', 'Pencahayaan diselaraskan dan konsumsi listrik rumah berkurang.');
        showToast('⚡', 'Optimasi Selesai', 'Penggunaan listrik berhasil dioptimalkan.');
        notifyFromState();
      });
    }

    // Security Mode Buttons
    document.querySelectorAll('.sec-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const nextMode = btn.dataset.secMode;
        if (nextMode === 'away' && state.houseMode !== 'away') {
          if (!confirm('Aktifkan Mode AWAY? Semua lampu dan AC akan dinonaktifkan, skylight ditutup, dan alarm diaktifkan.')) return;
        }
        applyHouseMode(nextMode, true);
      });
    });

    // Alarm Toggle Button
    const btnToggleAlarm = document.getElementById('btnToggleAlarm');
    if (btnToggleAlarm) {
      btnToggleAlarm.addEventListener('click', () => {
        state.alarmArmed = !state.alarmArmed;
        addNotification(
          'security',
          state.alarmArmed ? '🛡️' : '🔓',
          state.alarmArmed ? 'Alarm Keamanan Diaktifkan' : 'Alarm Keamanan Dinonaktifkan',
          state.alarmArmed ? 'Seluruh perimeter rumah dalam status siaga.' : 'Alarm dinonaktifkan oleh pengguna.'
        );
        showToast(state.alarmArmed ? '🛡️' : '🔓', 'Alarm Rumah', state.alarmArmed ? 'Alarm telah SIAGA.' : 'Alarm telah DINONAKTIFKAN.');
        notifyFromState();
      });
    }

    // Sensor Toggle Inputs
    document.querySelectorAll('.sensor-toggle-input').forEach(input => {
      input.addEventListener('change', e => {
        const key = e.target.dataset.sensorKey;
        state.sensors[key] = e.target.checked;
        const sensorNames = {
          mainDoor: 'Pintu Utama Depan',
          backDoor: 'Pintu Belakang',
          livingWindow: 'Jendela Ruang Tamu',
          garageDoor: 'Pintu Garasi'
        };
        const name = sensorNames[key] || key;
        addNotification(
          e.target.checked ? 'security' : 'smart',
          e.target.checked ? '🚨' : '🚪',
          `${name} ${e.target.checked ? 'Terbuka' : 'Ditutup'}`,
          `Sensor mendeteksi ${name} kini dalam kondisi ${e.target.checked ? 'TERBUKA' : 'TERTUTUP'}.`
        );
        if (e.target.checked && state.houseMode === 'away') {
          showToast('🚨', 'PERINGATAN KEAMANAN', `${name} terbuka saat Mode Pergi aktif!`);
        }
        notifyFromState();
      });
    });

    // Simulate Motion Trigger
    const btnSimulateMotion = document.getElementById('btnSimulateMotion');
    if (btnSimulateMotion) {
      btnSimulateMotion.addEventListener('click', () => {
        const keys = ['living', 'hallway', 'garage', 'backyard'];
        const chosen = keys[Math.floor(Math.random() * keys.length)];
        state.motion[chosen] = true;
        const labels = { living: 'Ruang Tamu', hallway: 'Lorong Kamar', garage: 'Garasi', backyard: 'Halaman Belakang' };
        addNotification('security', '👁️', `Gerakan Terdeteksi di ${labels[chosen]}`, 'Sensor infra-merah mendeteksi pergerakan.');
        showToast('👁️', 'Deteksi Gerak', `Gerakan terdeteksi di area ${labels[chosen]}.`);
        notifyFromState();

        setTimeout(() => {
          state.motion[chosen] = false;
          notifyFromState();
        }, 3600);
      });
    }

    // Clear Security History
    const btnClearSecurityHistory = document.getElementById('btnClearSecurityHistory');
    if (btnClearSecurityHistory) {
      btnClearSecurityHistory.addEventListener('click', () => {
        state.notifications = state.notifications.filter(n => n.type !== 'security');
        addNotification('smart', '✓', 'Riwayat Keamanan Dibersihkan', 'Daftar catatan keamanan telah diperbarui.');
        notifyFromState();
      });
    }

    // Notification Actions
    const btnMarkAllRead = document.getElementById('btnMarkAllRead');
    if (btnMarkAllRead) {
      btnMarkAllRead.addEventListener('click', () => {
        state.notifications.forEach(n => n.read = true);
        notifyFromState();
      });
    }

    const btnClearAllNotifs = document.getElementById('btnClearAllNotifs');
    if (btnClearAllNotifs) {
      btnClearAllNotifs.addEventListener('click', () => {
        state.notifications = [];
        addNotification('smart', '✓', 'Daftar Notifikasi Dikosongkan', 'Semua riwayat notifikasi telah dibersihkan.');
        notifyFromState();
      });
    }

    // Accessibility Settings Checkboxes
    const settingLargeText = document.getElementById('settingLargeText');
    if (settingLargeText) {
      settingLargeText.addEventListener('change', e => {
        state.settings.largeText = e.target.checked;
        notifyFromState();
      });
    }

    const settingHighReadability = document.getElementById('settingHighReadability');
    if (settingHighReadability) {
      settingHighReadability.addEventListener('change', e => {
        state.settings.highReadability = e.target.checked;
        notifyFromState();
      });
    }

    const settingReduceAnimation = document.getElementById('settingReduceAnimation');
    if (settingReduceAnimation) {
      settingReduceAnimation.addEventListener('change', e => {
        state.settings.reduceAnimation = e.target.checked;
        notifyFromState();
      });
    }

    // Settings Profile Fields
    const cfgHouseName = document.getElementById('cfgHouseName');
    if (cfgHouseName) {
      cfgHouseName.addEventListener('change', e => {
        state.houseName = e.target.value.trim() || 'House 01';
        notifyFromState();
      });
    }

    const cfgHomeOwner = document.getElementById('cfgHomeOwner');
    if (cfgHomeOwner) {
      cfgHomeOwner.addEventListener('change', e => {
        state.residentName = e.target.value.trim() || 'Admin';
        notifyFromState();
      });
    }

    // Reset Demo Data Button
    const btnResetDemoData = document.getElementById('btnResetDemoData');
    if (btnResetDemoData) {
      btnResetDemoData.addEventListener('click', () => {
        if (confirm('Kembalikan seluruh data dan kondisi perangkat ke pengaturan awal demo?')) {
          localStorage.removeItem(STORAGE_KEY);
          state = deepClone(DEFAULT_STATE);
          selectedRoomId = 'living';
          selectedHVACZone = 'living';
          notifyFromState();
          showToast('🔄', 'Data Direset', 'Kondisi Rumah 01 dikembalikan ke awal demonstrasi.');
        }
      });
    }
  }

  // -------------------------------------------------------------------------
  // 16. BOOTSTRAP APPLICATION
  // -------------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    initEventHandlers();
    refreshAllViews();
  });

  // If DOM is already ready
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    initEventHandlers();
    refreshAllViews();
  }

})();
