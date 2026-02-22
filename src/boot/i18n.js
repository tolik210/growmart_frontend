import { createI18n } from 'vue-i18n'

const messages = {
  ru: {
    auth: {
      login: 'Вход',
      register: 'Регистрация',
      continue: 'Продолжить',
      iin: 'ИИН / БИН',
      placeholder_iin: 'Введите 12 цифр',
      org_name: 'Организация',
      type: 'Тип',
      phone: 'Телефон',
      placeholder_phone: '+7 (___) ___-__-__',
      email: 'Email',
      password: 'Пароль',
      password_confirm: 'Подтвердите пароль',
      agreement: 'Я принимаю условия',
      forgot_password: 'Забыли пароль?',
      recovery_title: 'Восстановление',
      btn_cancel: 'Отмена',
      btn_next: 'Далее'
    },
    roles: {
      select_title: 'Выберите роль',
      select_subtitle: 'Куда зайти в систему',
      seller: 'Фермер / Поставщик',
      buyer: 'Покупатель',
      akimat: 'Регулятор / Госорганы',
      admin: 'Администратор'
    }
  },

  kk: {
    auth: {
      login: 'Кіру',
      register: 'Тіркелу',
      continue: 'Жалғастыру',
      iin: 'ЖСН / БСН',
      placeholder_iin: '12 сан енгізіңіз',
      org_name: 'Ұйым',
      type: 'Түрі',
      phone: 'Телефон',
      placeholder_phone: '+7 (___) ___-__-__',
      email: 'Email',
      password: 'Құпиясөз',
      password_confirm: 'Құпиясөзді растау',
      agreement: 'Шарттарды қабылдаймын',
      forgot_password: 'Құпиясөзді ұмыттыңыз ба?',
      recovery_title: 'Қалпына келтіру',
      btn_cancel: 'Бас тарту',
      btn_next: 'Келесі'
    },
    roles: {
      select_title: 'Рөлді таңдаңыз',
      select_subtitle: 'Жүйеге кіру бағыты',
      seller: 'Фермер / Жеткізуші',
      buyer: 'Сатып алушы',
      akimat: 'Реттеуші / Меморган',
      admin: 'Әкімші'
    }
  },

  'en-US': {
    auth: {
      login: 'Login',
      register: 'Register',
      continue: 'Continue',
      iin: 'IIN / BIN',
      placeholder_iin: 'Enter 12 digits',
      org_name: 'Organization',
      type: 'Type',
      phone: 'Phone',
      placeholder_phone: '+7 (___) ___-__-__',
      email: 'Email',
      password: 'Password',
      password_confirm: 'Confirm password',
      agreement: 'I accept the terms',
      forgot_password: 'Forgot password?',
      recovery_title: 'Recovery',
      btn_cancel: 'Cancel',
      btn_next: 'Next'
    },
    roles: {
      select_title: 'Select role',
      select_subtitle: 'Choose where to enter',
      seller: 'Farmer / Supplier',
      buyer: 'Buyer',
      akimat: 'Regulator / Government',
      admin: 'Administrator'
    }
  }
}

const saved = localStorage.getItem('growmart_lang') || 'ru'

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: saved,
  fallbackLocale: 'ru',
  messages
})

export default ({ app }) => {
  app.use(i18n)
}

export { i18n }
