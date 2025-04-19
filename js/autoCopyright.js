/**
 * Auto Copyright
 * Author: Taigo Ito (https://qwel.design/)
 * Location: Fukui, Japan
 */

export default class AutoCopyright {
  constructor(startYear, companyName, elem) {
    elem ||= document.querySelector('.footer__copyright');
    if (elem) elem.innerHTML = this.generate(startYear, companyName);
  }

  generate(startYear, companyName) {
    const currentYear = new Date().getFullYear();
    if (startYear == currentYear) {
      return `&copy; ${startYear} ${companyName}`
    } else {
      return `&copy; ${startYear} - ${currentYear} ${companyName}`;
    }
  }
}
