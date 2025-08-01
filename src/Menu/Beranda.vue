<template>
  <div class="page animated-background">
    <div class="wave-background">
      <svg viewBox="0 0 1200 200" preserveAspectRatio="none">
        <path d="M0,100 C300,200 900,0 1200,100 L1200,200 L0,200 Z"></path>
      </svg>
    </div>
    
    <header class="hero">
      <div class="logo-container">
        <img src="../assets/logo.png" alt="Logo" class="logo" />
        <h1 class="judul wave-text">
          <span>S</span><span>h</span><span>o</span><span>l</span><span>a</span><span>t</span><span>.</span><span>I</span><span>D</span>
        </h1>
      </div>
      <p class="tagline">Waktu Sholat Akurat Untuk Umat Muslim</p>

      <div class="uabh-search-container">
        <div class="input-group search-hero-input">
          <input
            type="text"
            v-model="searchKota"
            placeholder="Ketik nama kota/kabupaten..."
            @input="filterKota"
            @focus="showSuggestions = true"
            @blur="hideSuggestions"
            @keyup.enter="selectFirstKota"
            class="form-input-hero" />
          <ul v-if="showSuggestions && filteredKota.length" class="suggestions-hero">
          </ul>
        </div>
      </div>
    </header>

    <main class="main-content">
      <section class="card current-prayer-summary">
        <div class="location-header">
          <h2 class="current-location">{{ selectedKotaNama || 'Pilih Kota Anda' }}</h2>
          <p class="current-date-info">
            {{ jadwal ? jadwal.tanggal : '' }}
            <span class="hijri-date" v-if="hijriDate">({{ hijriDate }})</span>
          </p>
        </div>

        <div class="next-prayer-display" v-if="jadwal && nextPrayer.name">
          <p class="next-prayer-label">Waktu Sholat Berikutnya:</p>
          <div class="next-prayer-details">
            <span class="next-prayer-name">{{ nextPrayer.name }}</span>
            <span class="next-prayer-time">{{ nextPrayer.time }}</span>
          </div>
        </div>
        <div v-else class="next-prayer-display">
            <p class="no-schedule-message">Tidak ada jadwal sholat tersedia. Silakan cari kota.</p>
        </div>
      </section>

      <section class="card prayer-times-grid-section">
        <h3 class="card-section-title" >Jadwal Sholat Hari Ini</h3>
        <div class="prayer-times-grid">
          <div class="prayer-item" v-for="(time, key) in prayerTimesDisplay" :key="key">
            <span class="prayer-name">{{ time.label }}</span>
            <span class="prayer-time-value">{{ time.value }}</span>
          </div>
        </div>
      </section>
      
      <section class="card search-monthly-section">
        <h3 class="card-section-title">Jadwal Sholat Bulan Ini</h3> <div class="monthly-schedule-area" v-if="jadwalBulanan.length">
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Imsak</th>
                  <th>Subuh</th>
                  <th>Dzuhur</th>
                  <th>Ashar</th>
                  <th>Maghrib</th>
                  <th>Isya</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(j, index) in jadwalBulanan" :key="index" class="table-row-animated">
                  <td>{{ j.tanggal }}</td>
                  <td>{{ j.imsak }}</td>
                  <td>{{ j.subuh }}</td>
                  <td>{{ j.dzuhur }}</td>
                  <td>{{ j.ashar }}</td>
                  <td>{{ j.maghrib }}</td>
                  <td>{{ j.isya }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
    <footer class="site-footer new-footer">
      <div class="footer-content-wrapper">
        <div class="footer-brand">
          <img src="../assets/logo1.jpg" alt="Biznizo Logo" class="footer-logo" />
          <span class="footer-brand-name">Biznizo</span>
        </div>
        <div class="footer-info">
          <p class="footer-tagline">
            Inovasi digital untuk kemudahan beribadah.
          </p>
          <a href="https://biznizo.com" target="_blank" rel="noopener noreferrer" class="biznizo-link-footer">
            Kunjungi Biznizo.com
          </a>
        </div>
        <div class="footer-copyright">
          <p>&copy; {{ currentYear }} Biznizo. All rights reserved.</p>
          <p>Ditenagai oleh teknologi akurat.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import axios from '@/axios';

export default {
  data() {
    return {
      allKotaList: [],
      filteredKota: [],
      selectedKota: '',
      selectedKotaNama: '',
      searchKota: '',
      showSuggestions: false,
      jadwal: null,
      hijriDate: '',
      jadwalBulanan: [],
      currentMonth: new Date().getMonth() + 1,
      currentYear: new Date().getFullYear(),
    };
  },
  computed: {
    prayerTimesDisplay() {
      if (!this.jadwal) return {};
      return {
        imsak: { label: 'Imsak', value: this.jadwal.imsak },
        subuh: { label: 'Subuh', value: this.jadwal.subuh },
        dzuhur: { label: 'Dzuhur', value: this.jadwal.dzuhur },
        ashar: { label: 'Ashar', value: this.jadwal.ashar },
        maghrib: { label: 'Maghrib', value: this.jadwal.maghrib },
        isya: { label: 'Isya', value: this.jadwal.isya },
      };
    },
    nextPrayer() {
      if (!this.jadwal) return {};

      const now = new Date();
      
      const times = [
        { name: 'Imsak', time: this.jadwal.imsak },
        { name: 'Subuh', time: this.jadwal.subuh },
        { name: 'Dzuhur', time: this.jadwal.dzuhur },
        { name: 'Ashar', time: this.jadwal.ashar },
        { name: 'Maghrib', time: this.jadwal.maghrib },
        { name: 'Isya', time: this.jadwal.isya },
      ];

      for (const p of times) {
        const [hour, minute] = p.time.split(':').map(Number);
        const prayerDateTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0);

        if (prayerDateTime > now) {
          return { name: p.name, time: p.time };
        }
      }
      return { name: 'Fajar Besok', time: 'Lihat jadwal bulanan' }; 
    },
  },
  mounted() {
    this.loadKota();
    this.$nextTick(() => {
      this.selectDefaultCity();
    });
  },
  methods: {
    async loadKota() {
      try {
        const res = await axios.get('/sholat/kota/semua');
        this.allKotaList = res.data.data;
      } catch (error) {
        console.error("Error loading city data:", error);
      }
    },
    selectDefaultCity() {
      const malang = this.allKotaList.find(k => k.lokasi.toLowerCase().includes('kota malang'));
      if (malang) {
        this.selectKota(malang);
      } else if (this.allKotaList.length > 0) {
        this.selectKota(this.allKotaList[0]);
      }
    },
    filterKota() {
      const keyword = this.searchKota.toLowerCase();
      this.filteredKota = this.allKotaList.filter(k =>
        k.lokasi.toLowerCase().includes(keyword)
      );
      this.showSuggestions = true;
    },
    selectKota(kota) {
      this.selectedKota = kota.id;
      this.selectedKotaNama = kota.lokasi;
      this.searchKota = kota.lokasi; 
      this.showSuggestions = false;
      this.getJadwal();
      this.getJadwalBulanan();
    },
    selectFirstKota() {
      const keyword = this.searchKota.toLowerCase();
      const found = this.filteredKota.find(k =>
        k.lokasi.toLowerCase().includes('kota malang')
      ) || this.filteredKota.find(k =>
        k.lokasi.toLowerCase().includes(keyword)
      ) || this.filteredKota[0];

      if (found) {
        this.selectKota(found);
        this.showSuggestions = false; 
        this.searchKota = '';       
      }
    },
    hideSuggestions() {
      setTimeout(() => {
        this.showSuggestions = false;
      }, 150);
    },
    async getJadwal() {
      if (!this.selectedKota) return;
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];

      try {
        const res = await axios.get(`/sholat/jadwal/${this.selectedKota}/${dateStr}`);
        this.jadwal = res.data.data.jadwal;
        this.getHijriDate(dateStr);
      } catch (err) {
        console.error("Failed to load daily prayer schedule:", err);
        this.jadwal = null;
        this.hijriDate = "Gagal memuat tanggal Hijriah";
      }
    },
    async getHijriDate(dateStr) {
      try {
        const res = await axios.get(`/cal/hijr/${dateStr}?adj=-1`);
        if (res?.data?.data?.date?.[1]) {
          this.hijriDate = res.data.data.date[1];
        } else {
          this.hijriDate = "Tanggal Hijriah tidak ditemukan";
        }
      } catch (err) {
        this.hijriDate = "Gagal memuat tanggal Hijriah";
        console.error("Failed to load Hijri date:", err);
      }
    },
    async getJadwalBulanan() {
      if (!this.selectedKota) return;
      try {
        const res = await axios.get(`/sholat/jadwal/${this.selectedKota}/${this.currentYear}/${this.currentMonth}`);
        this.jadwalBulanan = res.data.data.jadwal;
      } catch (err) {
        console.error('Failed to load monthly prayer schedule:', err);
        this.jadwalBulanan = [];
      }
    }
  }
};
</script>