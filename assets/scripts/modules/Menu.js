export default class Menu {
    attributes = {
        menu:    'data-menu',
        btn:     'data-menu-btn',
        noOverlay: 'data-menu-no-overlay'
    }
    constructor() {
        this.overlay = document.getElementById('overlay')

        this.activeMenu = null

        this.initListeners();
    }
    initListeners() {
        document.addEventListener('click', (e) => {
            const target = e.target
            const btn = target.closest(`[${this.attributes.btn}]`)

            if (btn) {
                const dataValue = btn.getAttribute(`${this.attributes.btn}`)
                const menu = document.querySelector(`[${this.attributes.menu}="${dataValue}"]`)
                const hasOverlay = btn.hasAttribute(`${this.attributes.noOverlay}`)


                this.classManager(menu, hasOverlay);
                return;
            }
            if ((btn || !target.closest(`[${this.attributes.menu}]`)) && 
                this.activeMenu) {
                this.closeActive()
            }
        })
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Escape' && this.activeMenu) {
                this.closeActive()
            }
        })
    }
    classManager(menu, noOverlay) {
        if (this.activeMenu === menu) {
            this.closeActive()
        } else {
            menu.classList.add('active')
            this.closeActive()

            if (!noOverlay) {
                this.overlay.classList.add('active')
            }
            this.activeMenu = menu;
        }        
    }
    closeActive() {
        this.activeMenu?.classList.remove('active')
        this.activeMenu = null
        this.overlay?.classList.remove('active')
    }
}