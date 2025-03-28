const addButton = document.querySelector('#add-button');
const formDrawer = document.querySelector('note-form');

addButton.addEventListener('click', e => {
    e.preventDefault();
    formDrawer.show();
});
