class NoteFormElement extends HTMLElement {
    constructor() {
        super();

        this._note = null;
        this._overlay = document.createElement('div');
        this._overlay.classList.add('form-overlay');

        this._template = document.querySelector('template#note-form-drawer')
            .content.cloneNode(true);
    }

    connectedCallback() {
        this.render();
    }

    _save(note) {
        if(this._note) {
            const notes = JSON.parse(localStorage.getItem('notes'));

            notes.map((item, index) => {
                if(item.id == this._note.id) {
                    notes[index] = note;
                }
            });

            localStorage.setItem('notes', JSON.stringify(notes));
            return;
        }

        const notes = JSON.parse(localStorage.getItem('notes'));
        notes.push(note);
        localStorage.setItem('notes', JSON.stringify(notes));
    }

    show() {
        document.body.style.overflow = 'hidden';

        this._overlay.classList.add('show');
        this._overlay.querySelector('.form-drawer').classList.add('show');
        this.querySelector('input').focus();

        if(this._note) {
            this.querySelector('.form-title').textContent = 'Edit Catatan';
            this.querySelector('input').value = this._note.title;
            this.querySelector('textarea').value = this._note.body;
        }
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

            this._note = null;
            this.querySelector('form').reset();
            this.querySelector('.form-title').textContent = 'Tambah Catatan';
        }, 300);

        document.body.style.overflow = 'unset';
    }

    edit(note) {
        this._note = note;
        this.show();
    }

    render() {
        this._overlay.appendChild(this._template);

        this.innerHTML = '';
        this.appendChild(this._overlay);
        this.attachListeners();
    }

    attachListeners() {
        const form = this.querySelector('form');

        this._overlay.addEventListener('click', e => {
            if(e.target.closest('.form-drawer')) return;
            this.hide();
        });

        form.addEventListener('submit', e => {
            e.preventDefault();

            const formData = new FormData(e.target);
            const note = {
                id: 'notes-' + crypto.randomUUID(),
                title: formData.get('title'),
                body: formData.get('body'),
                archived: false,
                createdAt: new Date().toISOString(),
            };


            this._save(note);
            this.hide();

            form.reset();
            document.querySelector('note-list').setAttribute('timestamp', Date.now());
        });
    }
}

customElements.define('note-form', NoteFormElement);
