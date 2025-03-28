class ToastElement extends HTMLElement {
    constructor() {
        super();

        this._message = null;
        this.classList.add('toast');
    }

    connectedCallback() {
        this.render();
    }

    show(message) {
        this._message = message;
        this.render();

        this.classList.add('show');

        setTimeout(() => {
            this.classList.remove('show');
            this._message = null;
        }, 3000);
    }

    render() {
        this.innerHTML = `
            <p>${this._message || ''}</p>
        `;
    }
}

customElements.define('toast-message', ToastElement);
