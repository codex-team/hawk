module.exports = function () {

    let init = function () {

        let elems = document.getElementsByName('js-copyable');

        if (!elems) {
            console.log('There are no copyable elements');
            return;
        }

        Array.prototype.forEach.call(elems, prepareElements);

        console.log('Copyable module initialized');

    };

    let prepareElements = function (element) {

        element.addEventListener('click', elementClicked);

    };

    let elementClicked = function (e) {

        let selection = window.getSelection(),
            range     = document.createRange();

        range.selectNode(this);
        selection.removeAllRanges();
        selection.addRange(range);

        document.execCommand('copy');
        selection.removeAllRanges();

    };

    return {
        init: init
    }

}();