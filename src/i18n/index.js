import { createI18n } from 'vue-i18n'

const messages = {
  ru: {
    auth: {
      login: 'Вход',
      register: 'Регистрация',
      continue: 'Продолжить',
      phone: 'Телефон',
      password: 'Пароль',
      forgot_password: 'Забыли пароль?',
      btn_cancel: 'Отмена',
      btn_next: 'Далее',
      iin: 'ИИН/БИН',
      placeholder_iin: 'Введите 12 цифр',
      placeholder_phone: '+7 (___) ___-__-__',
      org_name: 'Организация',
      type: 'Тип',
      email: 'Email',
      agreement: 'Согласен с правилами'
    },
    roles: {
      select_title: 'Выберите роль',
      select_subtitle: 'Куда зайти в системе',
      seller: 'Фермер (поставщик)',
      buyer: 'Покупатель',
      akimat: 'Регулятор',
      admin: 'Администратор'
    }
  },
  kk: { auth: {}, roles: {} },
  'en-US': { auth: {}, roles: {} }
}

export const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('growmart_lang') || 'ru',
  fallbackLocale: 'ru',
  messages
})
