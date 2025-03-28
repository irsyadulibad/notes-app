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
        const toast = document.querySelector('toast-message');

        if(this._note) {
            const notes = JSON.parse(localStorage.getItem('notes'));
            note.archived = this._note.archived;

            notes.map((item, index) => {
                if(item.id == this._note.id) {
                    notes[index] = note;
                }
            });

            localStorage.setItem('notes', JSON.stringify(notes));
            toast.show('Catatan berhasil diubah');
            return;
        }

        const notes = JSON.parse(localStorage.getItem('notes'));
        notes.push(note);
        localStorage.setItem('notes', JSON.stringify(notes));
        toast.show('Catatan berhasil disimpan');
    }

    _customValidation(event) {
        event.target.setCustomValidity('');

        if(event.target.validity.valueMissing) {
            event.target.setCustomValidity('Tidak boleh kosong');
            return;
        }

        if(event.target.validity.tooShort) {
            event.target.setCustomValidity('Minimal panjang 4 karakter');
            return;
        }

        if(event.target.validity.patternMismatch) {
            event.target.setCustomValidity('Tidak valid');
            return;
        }

        if(event.target.validity.typeMismatch) {
            event.target.setCustomValidity('Tidak valid');
            return;
        }
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
        const form = this.querySelector('form');

        this._overlay.style.opacity = 0;
        drawer.style.animation = 'slide-down .3s ease forwards';

        form.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
        });

        setTimeout(() => {
            this._overlay.style.opacity = 1;
            this._overlay.classList.remove('show');

            drawer.classList.remove('show');
            drawer.style.animation = '';

            this._note = null;
            form.reset();
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

        form.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('change', this._customValidation);
            input.addEventListener('input', this._customValidation);
            input.addEventListener('focus', this._customValidation);

            input.addEventListener('blur', e => {
                const isValid = e.target.validity.valid;
                const errorMessage = e.target.validationMessage;
                const errorElement = document.getElementById(
                    e.target.getAttribute('aria-describedby')
                );

                if(isValid) {
                    errorElement.textContent = '';
                } else {
                    errorElement.textContent = errorMessage;
                }
            });
        })

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
