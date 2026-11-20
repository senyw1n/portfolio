/* Весь текст сайта в одном месте — правьте здесь (RU и EN рядом).
   В текстах: **жирный**, __контурный акцент__ (для заголовков). */

// Станции сцены. w/h — размер объекта в метрах сцены (для автоподгонки),
// cy — высота центра объекта, layout: 'side' — текст слева, 'compact' — короткий заголовок.
export const STATIONS = [
  { id: 'top', w: 5.4, h: 4.6, cy: 2.2, layout: 'side', panel: 720 },
  { id: 'about', w: 3.2, h: 4.7, cy: 2.2, layout: 'side' },
  { id: 'skills', w: 8.2, h: 3.4, cy: 1.4, layout: 'side' },
  { id: 'work', w: 10.8, h: 4.2, cy: 1.7, layout: 'compact' },
  { id: 'path', w: 8.4, h: 4.0, cy: 1.9, layout: 'side' },
  { id: 'contact', w: 5.2, h: 4.6, cy: 2.3, layout: 'side', panel: 540 },
]

const FIGMA = {
  dortmate: 'https://www.figma.com/design/bAH38YcqmVi86RLrCn2Bw5/Untitled',
  aiges: 'https://www.figma.com/design/bxF51HGquZW4AvIIs7GJ1B/%D0%A2%D0%97',
  coffee: 'https://www.figma.com/design/Ra4juISp0416V8mUSb1iNY/Untitled?node-id=2-10',
}
const TG = 'https://t.me/senyw1n'
const LINKEDIN = 'https://www.linkedin.com/in/sayat-zhaksybay-345513437/'

const ru = {
  meta: { title: 'Sayat Zhaksybay — UX/UI-дизайнер' },
  names: ['00_Главная', '01_Обо_мне', '02_Навыки', '03_Проекты', '04_Опыт', '05_Контакты'],
  ui: {
    sections: 'Разделы',
    viewport: ['Перспектива', 'Каркас'],
    prev: 'Предыдущий объект',
    next: 'Следующий объект',
    langSwitch: 'Switch to English',
  },
  hero: {
    roles: ['UX / UI', 'Web Design', 'Figma'],
    lead: 'Проектирую понятные интерфейсы в **Figma** — от пользовательских сценариев и вайрфреймов до готовых экранов и прототипов.',
    cta: 'Смотреть проекты →',
  },
  about: {
    title: 'Интерфейсы, __понятные__ людям',
    lead: 'В 2025 году окончил **Narxoz** по направлению «Цифровой менеджмент и дизайн». Занимаюсь **UX/UI и веб-дизайном**: разбираюсь в задаче, продумываю сценарии, собираю вайрфреймы и прототипы в Figma. Сейчас работаю в **технической поддержке** — каждый день вижу продукт глазами пользователей и разработчиков, поэтому знаю, где интерфейс мешает людям, и говорю с командой на одном языке.',
    panel: 'Свойства объекта',
    props: [
      ['Имя', 'Sayat Zhaksybay'],
      ['Позиция', 'Junior UX/UI-дизайнер'],
      ['Образование', 'Narxoz, 2025'],
      ['Занятость', 'Полная, в офисе'],
    ],
    status: ['Статус', '● Открыт к предложениям'],
    tag: 'Sayat_Zhaksybay · нажми на меня',
    phrases: [
      'Привет! Я Саят 👋',
      'Ищу команду — давай работать вместе!',
      'Люблю, когда интерфейс понятен с первого клика',
      'Кликни ещё раз 🙂',
      'Пиши в Telegram: @senyw1n',
    ],
  },
  skills: {
    title: 'Стек __модификаторов__',
    lead: 'Наведите на плиту, чтобы выделить навык. Три стека — три направления работы.',
    groups: [
      { group: 'Дизайн', items: ['UX', 'UI', 'Web Design', 'Figma', 'Photoshop'] },
      { group: '3D', items: ['3D-моделирование', '3ds Max', 'Blender', 'V-Ray'] },
      { group: 'Данные', items: ['Базы данных', 'PostgreSQL', 'API', 'Postman'] },
    ],
    langsLabel: 'Языки:',
    langs: [
      ['Казахский', 'родной'],
      ['Русский', 'B2'],
      ['Английский', 'B1 (в процессе улучшения)'],
    ],
  },
  work: {
    title: 'Работы __из Figma__',
    lead: 'Нажмите на экран монитора, чтобы открыть макет.',
    open: 'Открыть в Figma ↗',
    projects: [
      { title: 'DortMate', tag: 'Дипломный проект · Narxoz', desc: 'Дипломная работа с университетом Narxoz: от идеи и сценариев до десятков готовых экранов.', url: FIGMA.dortmate },
      { title: 'Редизайн сайта Aiges', tag: 'Тестовое задание · Web Design', desc: 'Редизайн сайта компании по ТЗ: новая структура страниц, сетка и визуальный стиль.', url: FIGMA.aiges },
      { title: 'Кофейный концепт', tag: 'Личный проект', desc: 'Проект на тему кофе, сделанный для себя: пробовал новые приёмы и подходы в дизайне.', url: FIGMA.coffee },
    ],
  },
  path: {
    title: 'Ключевые __кадры__',
    items: [
      { when: 'Учебная практика', title: 'Seneca Partners — 3D-визуализация ЖК', text: 'Задача — 3D-модели одного жилого комплекса: смоделировал квартиры, мебель и предметы интерьера в 3ds Max.' },
      { when: '2025', title: 'Окончил Narxoz', text: 'Высшее образование по направлению «Цифровой менеджмент и дизайн».' },
      { when: 'Сейчас', title: 'Специалист технической поддержки', text: 'Разбираю сложные обращения пользователей: воспроизвожу проблему, проверяю кейс на техническую ошибку и передаю разработчикам с понятным описанием и шагами воспроизведения. Каждый день вижу, где пользователи спотыкаются об интерфейс и что мешает команде быстро это исправить.', now: true },
    ],
  },
  contact: {
    status: 'Открыт к предложениям',
    title: 'На __связи__',
    lead: 'Открыт к предложениям на позицию **UX/UI-дизайнера**, полная занятость. Напишите, буду рад обсудить задачу.',
    cta: 'Написать в Telegram',
    copy: 'Скопировать почту',
    copied: 'Почта скопирована ✓',
    city: 'Алматы',
    links: [
      { icon: 'tg', label: 'Telegram', value: '@senyw1n', href: TG },
      { icon: 'in', label: 'LinkedIn', value: 'Sayat Zhaksybay', href: LINKEDIN },
      { icon: 'mail', label: 'Почта', value: 'zhaksybay009@mail.ru', href: 'mailto:zhaksybay009@mail.ru' },
      { icon: 'phone', label: 'Телефон', value: '+7 (707) 255-80-27', href: 'tel:+77072558027' },
    ],
  },
}

const en = {
  meta: { title: 'Sayat Zhaksybay — UX/UI Designer' },
  names: ['00_Home', '01_About', '02_Skills', '03_Projects', '04_Experience', '05_Contact'],
  ui: {
    sections: 'Sections',
    viewport: ['Perspective', 'Wireframe'],
    prev: 'Previous object',
    next: 'Next object',
    langSwitch: 'Переключить на русский',
  },
  hero: {
    roles: ['UX / UI', 'Web Design', 'Figma'],
    lead: 'I design clear interfaces in **Figma** — from user flows and wireframes to polished screens and prototypes.',
    cta: 'View projects →',
  },
  about: {
    title: 'Interfaces __people__ understand',
    lead: 'I graduated from **Narxoz University** in 2025 (Digital Management and Design). I work in **UX/UI and web design**: I dig into the problem, map user flows, and build wireframes and prototypes in Figma. Today I work in **technical support** — every day I see the product through the eyes of users and developers, so I know where an interface gets in people’s way and speak the team’s language.',
    panel: 'Object properties',
    props: [
      ['Name', 'Sayat Zhaksybay'],
      ['Role', 'Junior UX/UI Designer'],
      ['Education', 'Narxoz, 2025'],
      ['Employment', 'Full-time, on-site'],
    ],
    status: ['Status', '● Open to offers'],
    tag: 'Sayat_Zhaksybay · click me',
    phrases: [
      'Hi! I’m Sayat 👋',
      'Looking for a team — let’s work together!',
      'I love interfaces that make sense at first click',
      'Click me again 🙂',
      'Message me on Telegram: @senyw1n',
    ],
  },
  skills: {
    title: 'Modifier __stack__',
    lead: 'Hover a slab to highlight a skill. Three stacks — three areas of work.',
    groups: [
      { group: 'Design', items: ['UX', 'UI', 'Web Design', 'Figma', 'Photoshop'] },
      { group: '3D', items: ['3D modeling', '3ds Max', 'Blender', 'V-Ray'] },
      { group: 'Data', items: ['Databases', 'PostgreSQL', 'API', 'Postman'] },
    ],
    langsLabel: 'Languages:',
    langs: [
      ['Kazakh', 'native'],
      ['Russian', 'B2'],
      ['English', 'B1 (improving)'],
    ],
  },
  work: {
    title: 'Work __from Figma__',
    lead: 'Click a monitor screen to open the design file.',
    open: 'Open in Figma ↗',
    projects: [
      { title: 'DortMate', tag: 'Graduation project · Narxoz', desc: 'My thesis project with Narxoz University: from the idea and user flows to dozens of finished screens.', url: FIGMA.dortmate },
      { title: 'Aiges website redesign', tag: 'Test assignment · Web Design', desc: 'A company website redesign from a brief: new page structure, grid and visual style.', url: FIGMA.aiges },
      { title: 'Coffee concept', tag: 'Personal project', desc: 'A coffee-themed side project where I tried out new techniques and approaches.', url: FIGMA.coffee },
    ],
  },
  path: {
    title: 'Key __frames__',
    items: [
      { when: 'Internship', title: 'Seneca Partners — residential 3D', text: 'The task: 3D models for a single residential complex — I modeled the apartments, furniture and interior details in 3ds Max.' },
      { when: '2025', title: 'Graduated from Narxoz', text: 'Bachelor’s degree in Digital Management and Design.' },
      { when: 'Now', title: 'Technical Support Specialist', text: 'I investigate complex user issues: reproduce the problem, check whether it’s a technical bug, and hand it off to developers with a clear description and steps to reproduce. Every day I see where users get stuck in an interface and what keeps the team from fixing it fast.', now: true },
    ],
  },
  contact: {
    status: 'Open to work',
    title: 'Let’s __connect__',
    lead: 'Open to **UX/UI designer** roles, full-time. Drop me a message, I’d be glad to talk about your project.',
    cta: 'Message on Telegram',
    copy: 'Copy email',
    copied: 'Email copied ✓',
    city: 'Almaty',
    links: [
      { icon: 'tg', label: 'Telegram', value: '@senyw1n', href: TG },
      { icon: 'in', label: 'LinkedIn', value: 'Sayat Zhaksybay', href: LINKEDIN },
      { icon: 'mail', label: 'Email', value: 'zhaksybay009@mail.ru', href: 'mailto:zhaksybay009@mail.ru' },
      { icon: 'phone', label: 'Phone', value: '+7 (707) 255-80-27', href: 'tel:+77072558027' },
    ],
  },
}

export const CONTENT = { ru, en }
