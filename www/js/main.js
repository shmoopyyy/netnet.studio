/* global Netitor, WindowManager, Menu, Widget, NetitorEventParser */

const nne = new Netitor({
  ele: '#nn-editor',
  render: '#nn-output',
  background: false,
  code: `<!DOCTYPE html>
<style>
  @keyframes animBG {
    0% { background-position: 0% 50% }
    50% { background-position: 100% 50% }
    100% { background-position: 0% 50% }
  }

  body {
    background: linear-gradient(230deg, #81c994, #dacb8e, #515199);
    background-size: 300% 300%;
    animation: animBG 30s infinite;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
</style>
  `
})

const nnw = new WindowManager({
  layout: 'separate-window'
})

const nnm = new Menu({
  ele: '#nn-menu',
  radius: 100,
  items: {
    search: {
      path: 'images/menu/search.png',
      click: () => { window.alert('open search') }
    },
    settings: {
      path: 'images/menu/settings.png',
      click: new Widget({ title: 'settings' })
    },
    save: {
      path: 'images/menu/save.png',
      click: () => { nne.saveToHash() }
    },
    open: {
      path: 'images/menu/open.png',
      click: () => { window.alert('open project') }
    }
  }
})

// •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*
// •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•* EVENT LISTENERS

nne.on('lint-error', (eve) => {
  nne.marker()
  nnm.clearAlerts()
  nne.highlight(0)
  if (nnm.opened && nnm.opened.type === 'textbubble') nnm.hideTextBubble()
  if (eve.length > 0) {
    const err = eve[0]
    const clr = err.type === 'error' ? 'red' : 'yellow'
    nne.marker(err.line, clr)
    const content = (eve.length > 1)
      ? NetitorEventParser.toContentArray(eve) : err.friendly || err.message
    nnm.showAlert(err.type, content)
  }
})

nne.on('edu-info', (eve) => {
  if (!eve) {
    if (nnm.opened && nnm.opened.sub === 'information') nnm.hideAlert()
  } else if (eve.nfo) {
    const nfo = NetitorEventParser.toHTMLStr(eve)
    nnm.showAlert('information', nfo)
  }
})

// •.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*•.¸¸¸.•*

window.addEventListener('DOMContentLoaded', (e) => {
  // if there is code saved in the URL load it to the editor
  if (nne.hasCodeInHash) nne.loadFromHash()
})

window.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.keyCode === 83) { // s
    e.preventDefault()
    nne.saveToHash()
  } else if ((e.ctrlKey || e.metaKey) && e.keyCode === 190) { // >
    e.preventDefault()
    nnw.nextLayout()
  } else if ((e.ctrlKey || e.metaKey) && e.keyCode === 188) { // <
    e.preventDefault()
    nnw.prevLayout()
  } else if ((e.ctrlKey || e.metaKey) && e.keyCode === 59) { // :
    e.preventDefault()
    nnw.opacity = nnw.opacity > 0 ? nnw.opacity - 0.05 : 0
  } else if ((e.ctrlKey || e.metaKey) && e.keyCode === 222) { // "
    e.preventDefault()
    nnw.opacity = nnw.opacity < 1 ? nnw.opacity + 0.05 : 1
  }
})
