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
    <div class="footer-container">
      <!-- Top Section -->
      <div class="footer-top">
        <!-- Brand -->
        <div class="footer-brand">
          <div class="footer-logo">
            <svg class="footer-logo-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z"/>
              <path d="m6.2 5.3 3.1 3.9"/>
              <path d="m12.4 3.4 3.1 4"/>
              <path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>
            </svg>
            <span class="footer-logo-text">CINEWORLD</span>
          </div>
          <p class="footer-desc">
            Website xem phim online ch&#7845;t l&#432;&#7907;ng cao v&#7899;i kho phim &#273;a d&#7841;ng,
            c&#7853;p nh&#7853;t li&ecirc;n t&#7909;c c&aacute;c b&#7897; phim m&#7899;i nh&#7845;t.
          </p>
        </div>

        <!-- Nav Column 1 -->
        <div class="footer-nav">
          <h4 class="footer-heading">Danh M&#7909;c</h4>
          <ul class="footer-links">
            <li><router-link to="/phim-bo">Phim B&#7897;</router-link></li>
            <li><router-link to="/phim-le">Phim L&#7867;</router-link></li>
            <li><router-link to="/hoat-hinh">Ho&#7841;t H&igrave;nh</router-link></li>
            <li><router-link to="/tv-shows">TV Shows</router-link></li>
          </ul>
        </div>

        <!-- Nav Column 2 -->
        <div class="footer-nav">
          <h4 class="footer-heading">Th&#7875; Lo&#7841;i</h4>
          <ul class="footer-links">
            <li v-for="genre in genres.slice(0, 4)" :key="genre._id">
              <router-link :to="`/the-loai/${genre.slug}`">{{ genre.name }}</router-link>
            </li>
          </ul>
        </div>

        <!-- Nav Column 3 -->
        <div class="footer-nav">
          <h4 class="footer-heading">Qu&#7889;c Gia</h4>
          <ul class="footer-links">
            <li v-for="country in countries.slice(0, 4)" :key="country._id">
              <router-link :to="`/quoc-gia/${country.slug}`">{{ country.name }}</router-link>
            </li>
          </ul>
        </div>

        <!-- Nav Column 4 -->
        <div class="footer-nav">
          <h4 class="footer-heading">H&#7895; Tr&#7907;</h4>
          <ul class="footer-links">
            <li><a href="#">Li&ecirc;n h&#7879;</a></li>
            <li><a href="#">&#272;i&#7873;u kho&#7843;n</a></li>
            <li><a href="#">B&#7843;o m&#7853;t</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>
      </div>

      <!-- Divider -->
      <div class="footer-divider"></div>

      <!-- Bottom Section -->
      <div class="footer-bottom">
        <p class="footer-copyright">&copy; {{ currentYear }} Cineworld. B&#7843;n quy&#7873;n thu&#7897;c v&#7873; ch&uacute;ng t&ocirc;i.</p>
        <div class="footer-socials">
          <a href="#" class="social-link" aria-label="Facebook">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
          </a>
          <a href="#" class="social-link" aria-label="Twitter">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
            </svg>
          </a>
          <a href="#" class="social-link" aria-label="Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
            </svg>
          </a>
          <a href="#" class="social-link" aria-label="Youtube">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
              <path d="m10 15 5-3-5-3z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #050505;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  padding: 56px 56px 32px;
}

.footer-container {
  max-width: 1440px;
  margin: 0 auto;
}

.footer-top {
  display: flex;
  justify-content: space-between;
  gap: 32px;
  margin-bottom: 40px;
}

.footer-brand {
  width: 300px;
  flex-shrink: 0;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.footer-logo-icon {
  color: #E50914;
}

.footer-logo-text {
  font-family: 'Sora', sans-serif;
  font-size: 18px;
  font-weight: 800;
  color: #FFFFFF;
  letter-spacing: 2px;
}

.footer-desc {
  font-size: 13px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.4);
}

.footer-nav {
  flex-shrink: 0;
}

.footer-heading {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 16px;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.footer-links a {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.35);
  transition: var(--transition);
}

.footer-links a:hover {
  color: #FFFFFF;
}

.footer-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.07);
  margin-bottom: 24px;
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-copyright {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.2);
}

.footer-socials {
  display: flex;
  align-items: center;
  gap: 20px;
}

.social-link {
  color: rgba(255, 255, 255, 0.3);
  transition: var(--transition);
  display: flex;
}

.social-link:hover {
  color: #FFFFFF;
}

@media (max-width: 1024px) {
  .footer {
    padding: 40px 24px 24px;
  }

  .footer-top {
    flex-wrap: wrap;
  }

  .footer-brand {
    width: 100%;
    margin-bottom: 16px;
  }
}

@media (max-width: 768px) {
  .footer-top {
    flex-direction: column;
    gap: 24px;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
}
</style>
