<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const genres = computed(() => store.state.genres.slice(0, 8))
const countries = computed(() => store.state.countries.slice(0, 8))
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <h3 class="footer-title">Free Movie</h3>
          <p class="footer-desc">
            Website xem phim online chất lượng cao với kho phim đa dạng,
            cập nhật liên tục các bộ phim mới nhất.
          </p>
        </div>

        <div class="footer-col">
          <h4 class="footer-heading">Danh Mục Phim</h4>
          <ul class="footer-links">
            <li><router-link to="/phim-bo">Phim Bộ</router-link></li>
            <li><router-link to="/phim-le">Phim Lẻ</router-link></li>
            <li><router-link to="/hoat-hinh">Hoạt Hình</router-link></li>
            <li><router-link to="/tv-shows">TV Shows</router-link></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4 class="footer-heading">Thể Loại</h4>
          <ul class="footer-links footer-links-grid">
            <li v-for="genre in genres" :key="genre._id">
              <router-link :to="`/the-loai/${genre.slug}`">{{ genre.name }}</router-link>
            </li>
          </ul>
        </div>

        <div class="footer-col">
          <h4 class="footer-heading">Quốc Gia</h4>
          <ul class="footer-links footer-links-grid">
            <li v-for="country in countries" :key="country._id">
              <router-link :to="`/quoc-gia/${country.slug}`">{{ country.name }}</router-link>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} Free Movie. Tất cả các quyền được bảo lưu.</p>
        <p class="disclaimer">
          Website không lưu trữ bất kỳ tệp phim nào trên máy chủ.
          Tất cả nội dung được cung cấp bởi bên thứ ba.
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  padding: 4rem 0 2rem;
  margin-top: 4rem;
  position: relative;
}

.footer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--primary-color), var(--secondary-color), transparent);
  opacity: 0.5;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 3rem;
}

.footer-title {
  font-size: 1.75rem;
  font-weight: 800;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.footer-desc {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.8;
  max-width: 300px;
}

.footer-heading {
  font-size: 0.875rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  color: var(--text-color);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.footer-links li {
  margin-bottom: 0.75rem;
}

.footer-links a {
  color: var(--text-muted);
  font-size: 0.9rem;
  transition: var(--transition);
  display: inline-block;
}

.footer-links a:hover {
  color: var(--primary-color);
  transform: translateX(4px);
}

.footer-links-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem 1rem;
}

.footer-bottom {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
  text-align: center;
}

.footer-bottom p {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.disclaimer {
  margin-top: 0.75rem;
  font-size: 0.8rem !important;
  opacity: 0.7;
}

@media (max-width: 768px) {
  .footer {
    padding: 3rem 0 1.5rem;
  }

  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  .footer-col:first-child {
    grid-column: 1 / -1;
  }
}

@media (max-width: 480px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }
}
</style>
