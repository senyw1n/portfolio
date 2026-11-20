import { STATIONS } from '../data'
import { useLang, useT, setLang } from '../i18n'
import Rich from './Rich'

const pad = (n) => String(n).padStart(2, '0')

function HeroPanel({ go, t }) {
  return (
    <>
      <h1>
        <span className="stroke">Sayat</span>
        <span className="fill">Zhaksybay</span>
      </h1>
      <div className="roles">
        {t.hero.roles.map((r) => <span key={r}>{r}</span>)}
      </div>
      <p className="lead"><Rich text={t.hero.lead} /></p>
      <div className="btns">
        <button className="btn go" onClick={() => go(3)}>{t.hero.cta}</button>
        <a className="btn" href="https://t.me/senyw1n" target="_blank" rel="noopener">Telegram @senyw1n</a>
      </div>
    </>
  )
}

function AboutPanel({ t }) {
  const a = t.about
  return (
    <>
      <h2><Rich text={a.title} /></h2>
      <p className="lead"><Rich text={a.lead} /></p>
      <div className="panel">
        <div className="panel-head"><span>{a.panel}</span><span>▾</span></div>
        {a.props.map(([k, v]) => (
          <div className="prop" key={k}><span>{k}</span><b>{v}</b></div>
        ))}
        <div className="prop"><span>{a.status[0]}</span><b className="acc">{a.status[1]}</b></div>
      </div>
    </>
  )
}

function SkillsPanel({ t }) {
  const s = t.skills
  return (
    <>
      <h2><Rich text={s.title} /></h2>
      <p className="lead">{s.lead}</p>
      <div className="chips-groups">
        {s.groups.map((g) => (
          <div key={g.group}>
            <small>{g.group}</small>
            <div className="chips">{g.items.map((x) => <span key={x}>{x}</span>)}</div>
          </div>
        ))}
      </div>
      <div className="langs">
        <span>{s.langsLabel}</span>
        {s.langs.map(([l, v]) => <span key={l}><b>{l}</b> — {v}</span>)}
      </div>
    </>
  )
}

function WorkPanel({ t }) {
  const w = t.work
  return (
    <>
      <h2><Rich text={w.title} /></h2>
      <p className="lead">{w.lead}</p>
      <div className="list-m">
        {w.projects.map((p, i) => (
          <a key={p.url} href={p.url} target="_blank" rel="noopener">
            <small>{pad(i + 1)} · {p.tag}</small>
            <b>{p.title} ↗</b>
          </a>
        ))}
      </div>
    </>
  )
}

function PathPanel({ t }) {
  return (
    <>
      <h2><Rich text={t.path.title} /></h2>
      <div className="track">
        {[...t.path.items].reverse().map((e) => (
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

function ContactPanel({ t }) {
  return (
    <div className="render">
      <h2><Rich text={t.contact.title} /></h2>
      <div className="links">
        {t.contact.links.map((c) => (
          <a key={c.href} href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener">
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
  const lang = useLang()
  const t = useT()
  const st = STATIONS[active]
  const Panel = PANELS[active]
  const last = STATIONS.length - 1
  return (
    <div className="ui">
      <aside className="side">
        <div className="file">
          <span>{t.ui.city}</span>
          <div className="lang" role="group" aria-label={t.ui.langSwitch}>
            {['ru', 'en'].map((l) => (
              <button key={l} className={l === lang ? 'on' : ''} aria-pressed={l === lang} onClick={() => setLang(l)}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <nav className="tree" aria-label={t.ui.sections}>
          {STATIONS.map((s, i) => (
            <button key={s.id} className={i === active ? 'on' : ''} aria-current={i === active} onClick={() => go(i)}>
              <i />{t.names[i]}
            </button>
          ))}
        </nav>
      </aside>

      <div className="vp-tag">[ {t.ui.viewport[0]} ] [ <span>{t.ui.viewport[1]}</span> ] — {t.names[active]}</div>

      <section key={`${active}-${lang}`} className={`content is-${st.layout} st-${st.id}`} data-scroll>
        <Panel go={go} t={t} />
      </section>

      <div className="pager">
        <button onClick={() => go(active - 1)} disabled={active === 0} aria-label={t.ui.prev}>◂</button>
        <span>{pad(active)} / {pad(last)}</span>
        <button onClick={() => go(active + 1)} disabled={active === last} aria-label={t.ui.next}>▸</button>
      </div>
    </div>
  )
}
