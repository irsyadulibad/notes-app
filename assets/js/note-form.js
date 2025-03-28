class NoteFormElement extends HTMLElement {
    constructor() {
        super();

        this._overlay = document.createElement('div');
        this._overlay.classList.add('form-overlay');

        this._template = document.querySelector('template#note-form-drawer')
            .content.cloneNode(true);
    }

    connectedCallback() {
        this.render();
    }

    show() {
        document.body.style.overflow = 'hidden';

        this._overlay.classList.add('show');
        this._overlay.querySelector('.form-drawer').classList.add('show');
        this.querySelector('input').focus();
    }

    hide() {
        const drawer = this._overlay.querySelector('.form-drawer');

        this._overlay.style.opacity = 0;
        drawer.style.animation = 'slide-down .3s ease forwards';

        setTimeout(() => {
            this._overlay.style.opacity = 1;
            this._overlay.classList.remove('show');

            drawer.classList.remove('show');
            drawer.style.animation = '';
        }, 300);

        document.body.style.overflow = 'unset';
    }

    render() {
        this._overlay.appendChild(this._template);

        this.innerHTML = '';
        this.appendChild(this._overlay);
        this.attachListeners();
    }

    attachListeners() {
        this._overlay.addEventListener('click', e => {
            if(e.target.closest('.form-drawer')) return;
            this.hide();
        });
    }
}

customElements.define('note-form', NoteFormElement);
