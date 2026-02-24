<template>
  <div class="welcome-container">
    <main class="main-content">

      <section class="search-section">
        <div class="search-box">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Поиск товаров, услуг и сервисов"
            class="search-input"
            @keyup.enter="handleSearch"
          />
          <button class="search-btn" @click="handleSearch">Найти</button>
        </div>
      </section>

      <section class="services-section">
        <div class="services-grid">
          <div
            class="service-tile"
            v-for="service in services"
            :key="service.id"
            @click="handleServiceClick(service)"
          >
            <div class="service-icon">
              <template v-if="service.isLogo">
                <div class="gm-logo-icon">
                  <div class="gm-top">
                    <span class="gm-grow">grow</span>
                    <span class="gm-kz">kz</span>
                  </div>
                  <div class="gm-bottom">
                    <span class="gm-mart">mart</span>
                  </div>
                </div>
              </template>
              <template v-else-if="service.isImage">
                <img :src="service.imagePath" class="service-image-icon" alt="icon" />
              </template>
              <template v-else>
                {{ service.icon }}
              </template>
            </div>
            <span class="service-name">{{ service.name }}</span>
          </div>
        </div>
      </section>

      <section class="promo-section">
        <div class="promo-banner">
          <div class="promo-info">
            <span class="promo-badge">Акция дня</span>
            <h2 class="promo-title">Льготный лизинг на технику</h2>
            <p class="promo-text">Оформите заявку через "Мой Банк" и получите сниженную ставку.</p>
            <button class="promo-btn" @click="$router.push('/finance')">Узнать подробности</button>
          </div>
          <div class="promo-visual">
            <div class="promo-circle"></div>
          </div>
        </div>
      </section>

      <section class="products-section" v-if="products.length > 0">
        <h3 class="section-title">Свежие предложения</h3>
        <div class="products-grid">
          <div class="product-card cursor-pointer" v-for="product in products" :key="product.id" @click="$router.push('/product/' + product.id)">
            <div class="product-image">
              <img v-if="product.image" :src="'https://v1.growmart.ltd' + product.image" alt="Товар" />
              <span v-else>Нет фото</span>
            </div>
            <div class="product-info">
              <h4 class="product-title">{{ product.title || product.crop_name || 'Без названия' }}</h4>
              <div class="product-price">{{ product.price ? product.price + ' ₸' : 'Договорная' }} / {{ product.unit }}</div>
              <div class="product-meta">
                {{ product.region || 'Регион не указан' }}<br>
                В наличии: {{ product.stock || 0 }} {{ product.unit }}
              </div>
              <button class="buy-btn">Смотреть детали</button>
            </div>
          </div>
        </div>
      </section>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from 'src/services/api'

const router = useRouter()
const searchQuery = ref('')
const products = ref([])

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('Ищем:', searchQuery.value)
  }
}

const handleServiceClick = (service) => {
  if (service.id === 1) {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
  }
  router.push(service.route)
}

const fetchProducts = async () => {
  try {
    const res = await api.get('/products/published')
    if (res.data && res.data.products) {
      products.value = res.data.products
    }
  } catch (e) {
    console.error('Ошибка загрузки витрины:', e)
  }
}

const services = ref([
  { id: 1, name: 'АПК', isLogo: true, route: '/catalog' },
  { id: 2, name: 'Мой Банк', icon: '🏦', route: '/my-bank' },
  { id: 3, name: 'Аналитика', icon: '📊', route: '/analytics' },
  { id: 4, name: 'Gosagro.kz', isImage: true, imagePath: '/gosagro.png', route: '/subsidies' },
  { id: 5, name: 'Брокеры', icon: '📈', route: '/brokers' },
  { id: 6, name: 'Логистика', icon: '🚚', route: '/logistics' },
  { id: 7, name: 'Финансовые институты', icon: '💼', route: '/finance' },
  { id: 8, name: 'Агрострахования', icon: '🛡️', route: '/insurance' },
])

onMounted(() => {
  fetchProducts()
})
</script>

<style scoped>
.welcome-container { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: #050505; color: #ffffff; min-height: 100vh; display: flex; flex-direction: column; }
.main-content { max-width: 1200px; margin: 0 auto; padding: 32px 16px; width: 100%; display: flex; flex-direction: column; gap: 32px; }
.search-section { width: 100%; }
.search-box { display: flex; width: 100%; background: #ffffff; border-radius: 12px; padding: 4px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); }
.search-input { flex: 1; background: transparent; border: none; color: #000; padding: 0 16px; font-size: 16px; outline: none; height: 48px; width: 100%; }
.search-input::placeholder { color: #888; font-size: 15px; }
.search-btn { background-color: #333; color: white; border: none; padding: 0 24px; border-radius: 8px; font-weight: 700; font-size: 16px; cursor: pointer; height: 48px; transition: background 0.2s; }
.search-btn:hover { background-color: #555; }
.services-section { width: 100%; }
.services-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.service-tile { background: #111112; border: 1px solid #222; border-radius: 12px; padding: 20px 8px; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; cursor: pointer; transition: all 0.2s ease; }
.service-tile:hover { border-color: #777; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(255, 255, 255, 0.1); }
.service-icon { font-size: 32px; margin-bottom: 12px; height: 40px; display: flex; align-items: center; justify-content: center; }
.service-name { font-size: 14px; font-weight: 600; color: #fff; text-align: center; line-height: 1.2; }
.service-image-icon { width: 44px; height: 44px; object-fit: contain; }
.gm-logo-icon { display: flex; flex-direction: column; align-items: center; font-weight: 800; line-height: 0.85; letter-spacing: -0.5px; }
.gm-top { display: flex; align-items: flex-start; }
.gm-bottom { margin-top: -6px; }
.gm-grow { color: #ffffff; font-size: 22px; }
.gm-kz { color: #ffffff; font-size: 7px; border: 1px solid #ffffff; border-radius: 50%; padding: 1px 2px; margin-left: 2px; margin-top: 1px; font-weight: 700; }
.gm-mart { color: #7b61ff; font-size: 22px; }
.promo-section { width: 100%; }
.promo-banner { background: linear-gradient(135deg, #1a1a1c 0%, #111 100%); border: 1px solid #333; border-radius: 16px; padding: 32px 24px; display: flex; align-items: center; justify-content: space-between; overflow: hidden; position: relative; }
.promo-info { position: relative; z-index: 2; max-width: 500px; }
.promo-badge { background: #333; border: 1px solid #555; color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-bottom: 12px; display: inline-block; }
.promo-title { font-size: 24px; font-weight: 800; margin: 0 0 12px 0; color: #fff; line-height: 1.2; }
.promo-text { font-size: 14px; color: #aaa; line-height: 1.5; margin: 0 0 20px 0; }
.promo-btn { background: transparent; color: #fff; border: 2px solid #fff; padding: 10px 20px; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; transition: all 0.2s; }
.promo-btn:hover { background: #fff; color: #000; }
.promo-visual { position: absolute; right: -50px; top: -50px; z-index: 1; opacity: 0.5; }
.promo-circle { width: 200px; height: 200px; border-radius: 50%; background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0) 70%); }
.products-section { width: 100%; margin-top: 16px; }
.section-title { font-size: 20px; font-weight: 700; margin-bottom: 16px; color: #fff; }
.products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
.product-card { background: #111112; border: 1px solid #222; border-radius: 12px; overflow: hidden; display: flex; flex-direction: column; transition: transform 0.2s; }
.product-card:hover { transform: translateY(-4px); border-color: #777; }
.product-image { width: 100%; height: 160px; background: #1a1a1c; display: flex; align-items: center; justify-content: center; overflow: hidden; color: #555; font-size: 12px; }
.product-image img { width: 100%; height: 100%; object-fit: cover; }
.product-info { padding: 16px; display: flex; flex-direction: column; flex: 1; }
.product-title { font-size: 16px; font-weight: 600; margin: 0 0 8px 0; color: #fff; line-height: 1.3; }
.product-price { font-size: 18px; font-weight: 800; color: #fff; margin-bottom: 8px; }
.product-meta { font-size: 12px; color: #888; margin-bottom: 16px; flex: 1; line-height: 1.5; }
.buy-btn { background: #222; color: #fff; border: none; padding: 10px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: background 0.2s; width: 100%; }
.buy-btn:hover { background: #fff; color: #000; }
@media (max-width: 768px) {
  .main-content { gap: 24px; padding: 16px; }
  .search-input { font-size: 14px; padding: 0 12px; height: 44px; }
  .search-btn { font-size: 14px; padding: 0 16px; height: 44px; }
  .services-grid { gap: 8px; }
  .service-tile { padding: 12px 4px; border-radius: 10px; }
  .service-icon { margin-bottom: 8px; }
  .service-image-icon { width: 36px; height: 36px; }
  .gm-grow { font-size: 18px; }
  .gm-mart { font-size: 18px; }
  .gm-kz { font-size: 6px; padding: 1px; }
  .gm-bottom { margin-top: -4px; }
  .service-name { font-size: 10px; word-wrap: break-word; }
  .promo-banner { flex-direction: column; text-align: left; padding: 24px 16px; }
  .promo-title { font-size: 20px; }
  .promo-btn { width: 100%; text-align: center; }
  .products-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .product-image { height: 120px; }
  .product-title { font-size: 14px; }
  .product-price { font-size: 16px; }
}
</style>
