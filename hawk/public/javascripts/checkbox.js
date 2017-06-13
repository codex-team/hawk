module.exports = function () {

    let init = function () {

        let checkboxes = document.querySelectorAll('.form__checkbox');

        if (!checkboxes) {
            console.log('There are no checkboxes on page');
            return;
        }

        Array.prototype.forEach.call(checkboxes, prepareElements);

        console.log('Checkboxes initialized');

    };

    let prepareElements = function (checkbox) {

        let input = document.createElement('input');

        input.type = 'checkbox';
        input.classList.add('js-checkbox');

        input.name = checkbox.dataset.name;
        input.value = checkbox.dataset.value;

        if (checkbox.dataset.checked) {
            input.checked = true;
        }

        checkbox.appendChild(input);
        checkbox.addEventListener('click', checkboxClicked);

    };

    let checkboxClicked = function (e) {

        let label = this,
            input = this.querySelector('.js-checkbox');

        label.classList.toggle('form__checkbox--checked');
        input.checked = !input.checked;

        e.preventDefault();

    };

    return {
        init: init
    }

}();