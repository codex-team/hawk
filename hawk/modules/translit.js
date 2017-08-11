/**
 * Translit module
 *
 * @param {String} string
 * @param {Boolean} isUrl — if true, ignore punctuation marks and replace spaces with -
 * @returns {string}
 */
module.exports = function (string, isUrl=false) {
  let lettersTable = {
    'а': 'a',
    'б': 'b',
    'в': 'v',
    'г': 'g',
    'д': 'd',
    'е': 'e',
    'ё': 'yo',
    'ж': 'zh',
    'з': 'z',
    'и': 'i',
    'й': 'j',
    'к': 'k',
    'л': 'l',
    'м': 'm',
    'н': 'n',
    'о': 'o',
    'п': 'p',
    'р': 'r',
    'с': 's',
    'т': 't',
    'у': 'u',
    'ф': 'f',
    'х': 'h',
    'ц': 'cz',
    'ч': 'ch',
    'ш': 'sh',
    'щ': 'shh',
    'ы': 'y',
    'э': 'e',
    'ю': 'yu',
    'я': 'ya',
    ' ': isUrl ? '-' : ' ',
    '.': isUrl ? '-' : '.'
  };

  let letters = string.toLowerCase().trim().split('');

  let translitedLetters  = letters.map(function (letter) {
    if (lettersTable[letter]) {
      return lettersTable[letter];
    }

    if (/[a-z]/.test(letter) || !isUrl) {
      return letter;
    } else {
      return '';
    }
  });

  let translitedString = translitedLetters.join('');

  if (isUrl) {
    translitedString = translitedString.replace(/-+/g, '-');
  }

  return translitedString;
};