/* global Widget, WIDGETS, STORE */
/*
  -----------
     info
  -----------

  the main menu's Widgets sub-menu

  -----------
     usage
  -----------

  // this widget is instantiated by the WindowManager as...
  WIDGETS['widgets-menu'] = new MenuWidgets()

  // it has the following methods
  WIDGETS['widgets-menu']...

  // also inherits all the properties/methods of the base Widget class
  // refer to www/js/Widget.js
*/
class MenuWidgets extends Widget {
  constructor (opts) {
    super(opts)
    this.title = 'Widgets Menu'
    this.key = 'widgets-menu'
    this.listed = false // make sure it doesn't show up in Widgets Menu
    this.resizable = false
    this.keywords = ['gizmos', 'tools', 'toolbar', 'doodad', 'gui', 'interface', 'windows', 'helpers']
    STORE.subscribe('widgets', (arr) => { this.updateView() })
  }

  updateView () {
    // first order list by most recently LOADED, OPENED or CLOSED
    let keyList = STORE.state.widgets
      .filter(w => w.ref.listed).map(w => w.key).reverse()
    // then remove any starred widgets && place them on top
    let stared = window.localStorage.getItem('stared-widgets')
    stared = stared ? JSON.parse(stared) : []
    keyList = keyList.filter(key => !stared.includes(key))
    keyList = [...stared, ...keyList]
    // remove itself && Functions && Tutorials
    const no = [
      'widgets-menu', 'functions-menu', 'tutorials-menu', 'example-widget'
    ]
    keyList = keyList.filter(key => !no.includes(key))

    // create menu list
    const parent = document.createElement('div')
    parent.id = 'wig-menu-content'
    keyList.forEach(key => {
      // HACK: seems to be some weird race condition i can't figure out
      // so putting this in a conditional for now...
      if (WIDGETS[key]) {
        const div = document.createElement('div')
        const str = stared.includes(key) ? '★' : ''
        div.textContent = `${str} ${WIDGETS[key].title}`
        div.className = 'link'
        div.addEventListener('click', () => STORE.dispatch('OPEN_WIDGET', key))
        parent.appendChild(div)
      }
    })
    this.innerHTML = parent
    if (this._recentered) this.update({ right: 20, top: 20 })
  }
}

window.MenuWidgets = MenuWidgets