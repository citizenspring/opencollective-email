export const requireAttributes = (obj, attributes, getErrorMsg) => {
  attributes.map(attr => {
    if (!obj[attr]) {
      return new Error(getErrorMsg(attr));
    }
  });
  return true;
};

/**
 * Generate the mailto value for href
 * @param {*} to
 * @param {*} subject
 * @param {*} body
 */
export const mailto = (to, action, subject = '', body = '') => {
  // let email = to.indexOf('@') === -1 ? `${to}@${domain}` : to;
  let email = to;
  if (action) {
    email = email.replace('@', `/${action}@`);
  }
  return `mailto:${email.replace('/', '%2F')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

export const keepAnchorsShort = (html, maxLength = 40) => {
  return html.replace(/(<a href="([^ ]+)">)([^ <]+)<\/a>/g, (match, tag, url, displayUrl) => {
    if (url === displayUrl && displayUrl.length > maxLength) {
      return `${tag}${displayUrl.replace(/^https?:\/\/(www\.)?/i, '').substr(0, maxLength - 1)}…</a>`;
    }
    return match;
  });
};
