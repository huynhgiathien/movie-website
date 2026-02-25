<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const genres = computed(() => store.state.genres.slice(0, 8))
const countries = computed(() => store.state.countries.slice(0, 8))
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col">
          <h3 class="footer-title">PhimHay</h3>
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
        <p>&copy; 2024 PhimHay. Tất cả các quyền được bảo lưu.</p>
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
  padding: 3rem 0 1.5rem;
  margin-top: 3rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 2rem;
}

.footer-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.footer-desc {
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.7;
}

.footer-heading {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-links a {
  color: var(--text-secondary);
  font-size: 0.9rem;
  transition: var(--transition);
}

.footer-links a:hover {
  color: var(--primary-color);
}

.footer-links-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.footer-bottom {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-color);
  text-align: center;
}

.footer-bottom p {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.disclaimer {
  margin-top: 0.5rem;
  font-size: 0.8rem !important;
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
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
