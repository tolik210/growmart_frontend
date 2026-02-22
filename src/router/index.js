import { createRouter, createWebHashHistory } from "vue-router";
import routes from "./routes";

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach(async (to) => {
  // Читаем ТОЧНО те ключи, которые мы сохранили в LoginPage
  const token = localStorage.getItem("token") || "";
  const role = localStorage.getItem("user_role") || localStorage.getItem("role") || "";

  console.log(`[Router] Пытаемся перейти на: ${to.path}`);
  console.log(`[Router] Токен есть: ${!!token} | Роль: ${role}`);

  const publicPaths = ["/", "/login", "/register"];
  if (publicPaths.includes(to.path)) {
    return true; // На логин пускаем всегда
  }

  if (!token) {
    console.error("[Router] ОШИБКА: Нет токена! Отменяем переход.");
    return "/"; // Кидаем обратно на главную
  }

  if (to.path.startsWith("/seller") && !["farmer", "seller", "admin"].includes(role)) {
    console.error(`[Router] ОШИБКА: Роль '${role}' не пущена в кабинет продавца`);
    return "/";
  }

  if (to.path.startsWith("/buyer") && !role.includes("buyer") && role !== "admin") {
    console.error(`[Router] ОШИБКА: Роль '${role}' не пущена в кабинет покупателя`);
    return "/";
  }

  console.log("[Router] ДОСТУП РАЗРЕШЕН! Переходим...");
  return true;
});

export default router;
