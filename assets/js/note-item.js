class NoteItemElement extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(
            document.querySelector('template#note-item').content.cloneNode(true)
        );
    }

    setNote(note) {
        this.setAttribute('data-noteid', note.id);
        this._note = note;
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.querySelector('.note-title').textContent = this._note.title;
        this.shadowRoot.querySelector('.note-body').textContent = this._note.body;

        if(this._note.archived) {
            const icon = this.shadowRoot.querySelector('.archive-button i');

            icon.setAttribute('title', 'Batalkan arsip');
            icon.classList.remove('ti-archive');
            icon.classList.add('ti-archive-off');
        }

        this.attachListeners();
    }

    attachListeners() {
        const noteId = this.getAttribute('data-noteid');
        const notes = JSON.parse(localStorage.getItem('notes'));

        this.shadowRoot.querySelector('.archive-button').addEventListener('click', e => {
            e.preventDefault();

            const newNotes = notes.map(note => {
                if(note.id == noteId) {
                    note.archived = !note.archived;
                }

                return note;
            });

            localStorage.setItem('notes', JSON.stringify(newNotes));
            document.querySelector('note-list').setAttribute('timestamp', Date.now());
        });

        this.shadowRoot.querySelector('.delete-button').addEventListener('click', e => {
            e.preventDefault();

            const newNotes = notes.filter(note => note.id != noteId);

            localStorage.setItem('notes', JSON.stringify(newNotes));
            document.querySelector('note-list').setAttribute('timestamp', Date.now());
        });

        this.shadowRoot.querySelector('.edit-button').addEventListener('click', e => {
            e.preventDefault();
            document.querySelector('note-form').edit(this._note);
        });
    }
}

customElements.define('note-item', NoteItemElement);
