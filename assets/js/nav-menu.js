class NavMenuElement extends HTMLElement {
    constructor() {
        super();

        this._menus = [
            {icon: 'notes', title: 'Catatan', show: 'notes'},
            {icon: 'archive', title: 'Arsip', show: 'archived'},
        ];

        this._defaultMenu = this._menus[0].show;

        this.render();
        this.attachListeners();
    }

    generateMenu() {
        return this._menus.map(menu => `
            <li>
                <a href="#" data-show="${menu.show}" class="${this._defaultMenu === menu.show ? 'active' : ''}">
                    <i class="ti ti-${menu.icon}"></i>
                    <span>${menu.title}</span>
                </a>
            </li>
        `).join('');
    }

    render() {
        this.innerHTML = `
        <nav>
            <ul>
                ${this.generateMenu()}
            </ul>
        </nav>
        `;
    }

    attachListeners() {
        this.querySelector('nav').addEventListener('click', e => {
            const link = e.target.closest('a');
            if(!link) return;

            const show = link.dataset.show;
            e.preventDefault();

            this.querySelectorAll('a').forEach(a => {
                a.classList.remove('active');
            });

            link.classList.add('active');
            document.querySelector(`note-list`).showNotes(show);
        });
    }
}

customElements.define('nav-menu', NavMenuElement);
