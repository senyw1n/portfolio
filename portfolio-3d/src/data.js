/* Весь текст сайта в одном месте — правьте здесь. */

// Станции сцены. w/h — размер объекта в метрах сцены (для автоподгонки),
// cy — высота центра объекта, layout: 'side' — текст слева, 'compact' — короткий заголовок.
export const STATIONS = [
  { id: 'top', name: '00_Главная', w: 5.4, h: 4.6, cy: 2.2, layout: 'side', panel: 720 },
  { id: 'about', name: '01_Обо_мне', w: 3.2, h: 4.7, cy: 2.2, layout: 'side' },
  { id: 'skills', name: '02_Навыки', w: 8.2, h: 3.4, cy: 1.4, layout: 'side' },
  { id: 'work', name: '03_Проекты', w: 10.8, h: 4.2, cy: 1.7, layout: 'compact' },
  { id: 'path', name: '04_Опыт', w: 8.4, h: 4.0, cy: 1.9, layout: 'side' },
  { id: 'contact', name: '05_Контакты', w: 4.4, h: 4.6, cy: 2.3, layout: 'side' },
]

export const PROPS = [
  ['Имя', 'Sayat Zhaksybay'],
  ['Позиция', 'Junior UX/UI-дизайнер'],
  ['Город', 'Алматы, Казахстан'],
  ['Образование', 'Narxoz, 2025'],
  ['Занятость', 'Полная, в офисе'],
]

export const SKILLS = [
  { group: 'Дизайн', items: ['UX', 'UI', 'Web Design', 'Figma', 'Photoshop'] },
  { group: '3D', items: ['3D-моделирование', '3ds Max', 'Blender', 'V-Ray'] },
  { group: 'Данные', items: ['Базы данных', 'PostgreSQL', 'API', 'Postman'] },
]

export const LANGS = [
  ['Казахский', 'родной'],
  ['Русский', 'B2'],
]

/* Проекты. url — ссылка на файл в Figma. */
export const PROJECTS = [
  {
    title: 'DortMate',
    tag: 'Дипломный проект · Narxoz',
    desc: 'Дипломная работа с университетом Narxoz: от идеи и сценариев до десятков готовых экранов.',
    url: 'https://www.figma.com/design/bAH38YcqmVi86RLrCn2Bw5/Untitled',
  },
  {
    title: 'Редизайн сайта Aiges',
    tag: 'Тестовое задание · Web Design',
    desc: 'Редизайн сайта компании по ТЗ: новая структура страниц, сетка и визуальный стиль.',
    url: 'https://www.figma.com/design/bxF51HGquZW4AvIIs7GJ1B/%D0%A2%D0%97',
  },
  {
    title: 'Кофейный концепт',
    tag: 'Личный проект',
    desc: 'Проект на тему кофе, сделанный для себя: пробовал новые приёмы и подходы в дизайне.',
    url: 'https://www.figma.com/design/Ra4juISp0416V8mUSb1iNY/Untitled?node-id=2-10',
  },
]

export const EXPERIENCE = [
  { when: '2025', title: 'Narxoz', text: 'Высшее образование, направление «Цифровой менеджмент и дизайн».' },
  { when: 'Стажировка', title: '3D-моделирование — Seneca Partners', text: 'Работал с моделями и сценами в 3ds Max.' },
  { when: 'Сейчас', title: 'Ищу первую постоянную работу', text: 'Полная занятость в Алматы, в офисе. UX/UI и веб-дизайн.', now: true },
]

export const CONTACTS = [
  { label: 'Telegram', value: '@senyw1n', href: 'https://t.me/senyw1n' },
  { label: 'Почта', value: 'zhaksybay009@mail.ru', href: 'mailto:zhaksybay009@mail.ru' },
  { label: 'Телефон', value: '+7 (707) 255-80-27', href: 'tel:+77072558027' },
]
