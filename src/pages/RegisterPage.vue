<template>
  <div class="fullscreen flex flex-center bg-dark text-white">
    <div style="width: 100%; max-width: 450px; padding: 20px;">
      
      <div class="text-center q-mb-xl">
        <div class="text-h3 text-weight-bold">
          grow<span style="font-size: 14px; border: 1px solid white; border-radius: 50%; padding: 2px;">kz</span>
        </div>
        <div class="text-h4 text-primary">mart</div>
      </div>

      <div class="text-h5 text-center q-mb-md">Регистрация</div>

      <form @submit.prevent="onRegister" style="display: flex; flex-direction: column; gap: 12px;">
        
        <input v-model="form.iin_bin" type="text" placeholder="ИИН/БИН" maxlength="12" required
          style="width: 100%; padding: 12px; border-radius: 8px; background: #222; color: white; border: 1px solid #444;" />

        <select v-model="form.org_type" 
          style="width: 100%; padding: 12px; border-radius: 8px; background: #222; color: white; border: 1px solid #444; cursor: pointer;">
          <option value="ip">ИП</option>
          <option value="too">ТОО</option>
          <option value="khoz">Крестьянское хозяйство</option>
        </select>

        <input 
          v-model="form.phone" 
          type="tel" 
          placeholder="+7 (771) 000-00-00" 
          @input="handlePhoneInput"
          required
          style="width: 100%; padding: 12px; border-radius: 8px; background: #222; color: white; border: 1px solid #444;" 
        />

        <input v-model="form.email" type="email" placeholder="Email почта" required
          style="width: 100%; padding: 12px; border-radius: 8px; background: #222; color: white; border: 1px solid #444;" />

        <input v-model="form.password" type="password" placeholder="Пароль" required
          style="width: 100%; padding: 12px; border-radius: 8px; background: #222; color: white; border: 1px solid #444;" />

        <input v-model="form.confirm_password" type="password" placeholder="Подтвердите пароль" required
          style="width: 100%; padding: 12px; border-radius: 8px; background: #222; color: white; border: 1px solid #444;" />

        <div class="flex items-center q-gutter-sm" style="font-size: 13px; color: #aaa;">
          <input type="checkbox" id="confirm" v-model="form.agreement" required style="cursor: pointer;" />
          <label for="confirm" style="cursor: pointer;">Я подтверждаю достоверность данных</label>
        </div>

        <div v-if="error" style="color: #ff4d4f; text-align: center; font-size: 14px;">{{ error }}</div>

        <button type="submit" :disabled="loading"
          style="margin-top: 10px; padding: 15px; border-radius: 8px; background: #7b61ff; color: white; font-weight: bold; border: none; cursor: pointer;">
          {{ loading ? 'Создание аккаунта...' : 'Зарегистрироваться' }}
        </button>

        <div class="text-center q-mt-sm">
          <a href="/#/" style="color: #aaa; text-decoration: none; font-size: 14px;">Уже есть аккаунт? Войти</a>
        </div>
      </form>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import api from "src/services/api";

const router = useRouter();
const loading = ref(false);
const error = ref("");

const form = reactive({
  iin_bin: "",
  org_type: "ip",
  phone: "",
  email: "",
  password: "",
  confirm_password: "",
  agreement: false,
  role: "buyer_b2b"
});

// Красивое форматирование номера: +7 (XXX) XXX-XX-XX
function handlePhoneInput(e) {
  let input = e.target.value.replace(/\D/g, ""); // Оставляем только цифры
  
  // Если вводят 8 в начале, меняем на 7
  if (input.startsWith("8")) input = "7" + input.substring(1);
  // Если начинают вводить не с 7, добавляем 7 в начало
  if (input.length > 0 && !input.startsWith("7")) input = "7" + input;
  // Если пусто, очищаем поле
  if (input.length === 0) {
    form.phone = "";
    return;
  }

  let result = "+7";
  if (input.length > 1) result += " (" + input.substring(1, 4);
  if (input.length > 4) result += ") " + input.substring(4, 7);
  if (input.length > 7) result += "-" + input.substring(7, 9);
  if (input.length > 9) result += "-" + input.substring(9, 11);

  form.phone = result;
}

async function onRegister() {
  // Проверка длины (с учетом всех скобок и тире должно быть 18 символов)
  if (form.phone.length < 18) {
    error.value = "Введите полный номер телефона";
    return;
  }
  if (form.password !== form.confirm_password) {
    error.value = "Пароли не совпадают";
    return;
  }
  
  loading.value = true;
  error.value = "";
  
  try {
    // Перед отправкой на бэкенд можно очистить телефон от лишних символов, если бэкенд ждет чистые цифры:
    const cleanPhone = form.phone.replace(/\D/g, "");
    
    await api.post("/auth/register", { ...form, phone: cleanPhone });
    alert("Регистрация прошла успешно!");
    router.push("/");
  } catch (e) {
    error.value = e?.response?.data?.error || "Ошибка при регистрации.";
  } finally {
    loading.value = false;
  }
}
</script>
