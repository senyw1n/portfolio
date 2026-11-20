/* Простая разметка в текстах из data.js: **жирный** → <b>, __акцент__ → <em> (контурный) */
export default function Rich({ text }) {
  return text.split(/(\*\*[^*]+\*\*|__[^_]+__)/g).map((part, i) => {
    if (part.startsWith('**')) return <b key={i}>{part.slice(2, -2)}</b>
    if (part.startsWith('__')) return <em key={i}>{part.slice(2, -2)}</em>
    return part
  })
}
