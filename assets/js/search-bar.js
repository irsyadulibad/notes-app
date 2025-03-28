class SearchBarElement extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
            <div class="search-bar">
                <i class="ti ti-search"></i>
                <input type="search" placeholder="Cari catatan..." />
            </div>
        `;

        this.attachListeners();
    }

    attachListeners() {
        this.querySelector('input').addEventListener('keyup', e => {
            document.querySelector('note-list').setAttribute('timestamp', Date.now());
        });
    }
}

customElements.define('search-bar', SearchBarElement);
