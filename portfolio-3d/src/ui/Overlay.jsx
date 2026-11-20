import { STATIONS } from '../data'
import { useLang, useT, setLang } from '../i18n'
import { useEffect, useState } from 'react'
import Rich from './Rich'
import Icon from './Icon'

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
  const c = t.contact
  const [copied, setCopied] = useState(false)
  const email = c.links.find((l) => l.icon === 'mail').value
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      location.href = `mailto:${email}`
    }
  }
  return (
    <div className="contact">
      <span className="avail"><i />{c.status}</span>
      <h2><Rich text={c.title} /></h2>
      <p className="lead"><Rich text={c.lead} /></p>
      <div className="btns">
        <a className="btn go" href={c.links[0].href} target="_blank" rel="noopener">
          <Icon name="tg" size={16} />{c.cta}
        </a>
        <a className="btn" href={c.links[1].href} target="_blank" rel="noopener">
          <Icon name="in" size={16} />LinkedIn
        </a>
        <button className={`btn ${copied ? 'ok' : ''}`} onClick={copy} aria-live="polite">
          <Icon name="copy" size={16} />{copied ? c.copied : c.copy}
        </button>
      </div>
      <div className="clist">
        {c.links.map((l) => (
          <a key={l.href} href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noopener">
            <span className="ic"><Icon name={l.icon} /></span>
            <span className="tx"><small>{l.label}</small><b>{l.value}</b></span>
            <span className="ar"><Icon name="arrow" size={16} /></span>
          </a>
        ))}
      </div>
    </div>
  )
}

const PANELS = [HeroPanel, AboutPanel, SkillsPanel, WorkPanel, PathPanel, ContactPanel]

export default function Overlay({ active, go }) {
  const lang = useLang()
  const t = useT()
  // Плавная смена текста: старый блок гаснет, затем появляется новый
  const [shown, setShown] = useState(active)
  const [leaving, setLeaving] = useState(false)
  useEffect(() => {
    if (active === shown) return
    setLeaving(true)
    const id = setTimeout(() => {
      setShown(active)
      setLeaving(false)
    }, 280)
    return () => clearTimeout(id)
  }, [active, shown])
  const st = STATIONS[shown]
  const Panel = PANELS[shown]
  const last = STATIONS.length - 1
  return (
    <div className="ui">
      <aside className="side">
        <div className="file">
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

      <section key={`${shown}-${lang}`} className={`content is-${st.layout} st-${st.id} ${leaving ? "leaving" : ""}`} data-scroll>
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
