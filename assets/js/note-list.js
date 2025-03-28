class NoteListElement extends HTMLElement {
    static observedAttributes = ['timestamp'];

    constructor() {
        super();

        this._showArchived = false;
    }

    connectedCallback() {
        this.render();
    }

    getNotes() {
        const keyword = document.querySelector('search-bar input').value;
        const notes = JSON.parse(localStorage.getItem('notes'));

        return notes.filter(note => note.archived == this._showArchived)
            .filter(note => note.title.toLowerCase().includes(keyword.toLowerCase()))
            .reverse();
    }

    showNotes(active) {
        this._showArchived = active == 'archived';
        this.render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if(name == 'timestamp') {
            this.render();
        }
    }

    render() {
        const notes = this.getNotes();

        this.innerHTML = '';
        notes.map(item => {
            const noteItem = document.createElement('note-item');

            noteItem.setNote(item);
            this.appendChild(noteItem);
        });

        if(notes.length == 0) {
            const emptyNotes = document.querySelector('template#empty-notes').content.cloneNode(true);

            if(this._showArchived) {
                emptyNotes.querySelector('p').textContent = 'Tidak ada catatan yang diarsipkan';
            }

            this.appendChild(emptyNotes);
        }

        this.classList.add('note-list', this.getAttribute('type'));
    }
}

customElements.define('note-list', NoteListElement);
