/**
 * 文字列をエスケープして返す
 * @param {string} str 文字れる
 * @returns {string}
 */
export function escapeSpecialChars(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * HTML文字列からHTML要素を作成して返す
 * @param {string} html HTML文字列
 * @returns {Element}
 */
export function htmlToElement(html) {
  const template = document.createElement('template');
  template.innerHTML = html;
  return template.content.firstElementChild;
}

/**
 * HTML文字列からDOM Nodeを作成して返すタグ関数
 * @returns {Element}
 */
export function element(strings, ...values) {
  const htmlString = strings.reduce((result, str, i) => {
    const value = values[i - 1];
    if (typeof value === 'string') {
      return result + escapeSpecialChars(value) + str;
    } else {
      return result + String(value) + str;
    }
  });
  return htmlToElement(htmlString);
}

/**
 * コンテナ要素の中身をbodyで上書きする
 * @param {Element} body コンテナ要素の中身となる要素
 * @param {Element} container コンテナ要素
 */
export function render(body, container) {
  container.innerHTML = '';
  container.appendChild(body);
}
