import { STATIONS, PROPS, SKILLS, LANGS, PROJECTS, EXPERIENCE, CONTACTS } from '../data'

const pad = (n) => String(n).padStart(2, '0')

function HeroPanel({ go }) {
  return (
    <>
      <h1>
        <span className="stroke">Sayat</span>
        <span className="fill">Zhaksybay</span>
      </h1>
      <div className="roles">
        <span>UX / UI</span>
        <span>Web Design</span>
        <span>Figma</span>
      </div>
      <p className="lead">
        UX/UI-дизайнер из <b>Алматы</b>. Проектирую понятные интерфейсы в Figma — от пользовательских
        сценариев и вайрфреймов до готовых экранов и прототипов.
      </p>
      <div className="btns">
        <button className="btn go" onClick={() => go(3)}>Смотреть проекты →</button>
        <a className="btn" href="https://t.me/senyw1n" target="_blank" rel="noopener">Telegram @senyw1n</a>
      </div>
    </>
  )
}

function AboutPanel() {
  return (
    <>
      <h2>Интерфейсы, <em>понятные</em> людям</h2>
      <p className="lead">
        Выпускник <b>Narxoz</b> по направлению «Цифровой менеджмент и дизайн». Занимаюсь <b>UX/UI и
        веб-дизайном</b>: разбираюсь в задаче, продумываю сценарии, собираю вайрфреймы и прототипы в Figma.
        Понимаю техническую сторону продукта — базы данных, PostgreSQL, API, Postman — поэтому говорю
        с разработчиками на одном языке.
      </p>
      <div className="panel">
        <div className="panel-head"><span>Свойства объекта</span><span>▾</span></div>
        {PROPS.map(([k, v]) => (
          <div className="prop" key={k}><span>{k}</span><b>{v}</b></div>
        ))}
        <div className="prop"><span>Статус</span><b className="acc">● Ищу работу</b></div>
      </div>
    </>
  )
}

function SkillsPanel() {
  return (
    <>
      <h2>Стек <em>модификаторов</em></h2>
      <p className="lead">Наведите на плиту, чтобы выделить навык. Три стека — три направления работы.</p>
      <div className="chips-groups">
        {SKILLS.map((g) => (
          <div key={g.group}>
            <small>{g.group}</small>
            <div className="chips">{g.items.map((s) => <span key={s}>{s}</span>)}</div>
          </div>
        ))}
      </div>
      <div className="langs">
        <span>Языки:</span>
        {LANGS.map(([l, v]) => <span key={l}><b>{l}</b> — {v}</span>)}
      </div>
    </>
  )
}

function WorkPanel() {
  return (
    <>
      <h2>Работы <em>из Figma</em></h2>
      <p className="lead">Нажмите на экран монитора, чтобы открыть макет.</p>
      <div className="list-m">
        {PROJECTS.map((p, i) => (
          <a key={p.title} href={p.url} target="_blank" rel="noopener">
            <small>{pad(i + 1)} · {p.tag}</small>
            <b>{p.title} ↗</b>
          </a>
        ))}
      </div>
    </>
  )
}

function PathPanel() {
  return (
    <>
      <h2>Ключевые <em>кадры</em></h2>
      <div className="track">
        {[...EXPERIENCE].reverse().map((e) => (
          <div className={`key ${e.now ? 'now' : ''}`} key={e.title}>
            <small>{e.when}</small>
            <h3>{e.title}</h3>
            <p>{e.text}</p>
          </div>
        ))}
      </div>
    </>
  )
}

function ContactPanel() {
  return (
    <div className="render">
      <h2>Для <em>сотрудничества</em></h2>
      <div className="links">
        {CONTACTS.map((c) => (
          <a key={c.label} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener">
            <small>{c.label}</small>
            <b>{c.value}</b>
          </a>
        ))}
      </div>
      <div className="foot">© {new Date().getFullYear()} Sayat Zhaksybay</div>
    </div>
  )
}

const PANELS = [HeroPanel, AboutPanel, SkillsPanel, WorkPanel, PathPanel, ContactPanel]

export default function Overlay({ active, go }) {
  const st = STATIONS[active]
  const Panel = PANELS[active]
  const last = STATIONS.length - 1
  return (
    <div className="ui">
      <aside className="side">
        <div className="file"><span>Алматы · 2026</span></div>
        <nav className="tree" aria-label="Разделы">
          {STATIONS.map((s, i) => (
            <button key={s.id} className={i === active ? 'on' : ''} aria-current={i === active} onClick={() => go(i)}>
              <i />{s.name}
            </button>
          ))}
        </nav>
      </aside>

      <div className="vp-tag">[ Перспектива ] [ <span>Каркас</span> ] — {st.name}</div>

      <section key={active} className={`content is-${st.layout} st-${st.id}`} data-scroll>
        <Panel go={go} />
      </section>

      <div className="pager">
        <button onClick={() => go(active - 1)} disabled={active === 0} aria-label="Предыдущий объект">◂</button>
        <span>{pad(active)} / {pad(last)}</span>
        <button onClick={() => go(active + 1)} disabled={active === last} aria-label="Следующий объект">▸</button>
      </div>
    </div>
  )
}
