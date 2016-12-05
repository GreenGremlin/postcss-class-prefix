'use strict';
var postcss = require('postcss');

var validTags = [
    'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote',
    'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist',
    'dd', 'del', 'dfn', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer',
    'form', 'h1', '-', 'h6', 'head', 'header', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd',
    'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'meta', 'meter', 'nav', 'noscript',
    'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'pre', 'progress', 'q', 'rb', 'rp', 'rt',
    'rtc', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style',
    'sub', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title',
    'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr', '*'
];

module.exports = postcss.plugin('postcss-class-prefix', classPrefix);

function classPrefix(prefix, options) {
  options = options || {};

  return function(root) {

    root.walkRules(function (rule) {
      if (!rule.selectors){
        return rule;
      }

      rule.selectors = rule.selectors.map(function(selector) {
        if (!isClassSelector(selector)) {
          if (options.tagScope && validTags.filter(function(tag) {
            //   console.info(`${selector.substr(0, tag.length)} === ${tag}`);
              return selector.substr(0, tag.length) === tag;
          }).length > 0) {
              if (typeof options.tagScope === 'function') {
                  return options.tagScope(selector);
              }
              return options.tagScope + ' ' + selector;
          }
          return selector;
        }

        var classes = selector.split('.');

        return classes.map(function(clss){
          if (classMatchesTest(clss, options.ignore) || clss.trim().length === 0) {
            return clss;
          }
          return prefix + clss;
        }).join('.');
      });
    });
  };
}

/**
 * Determine if class passes test
 *
 * @param {string} clss
 * @param {string} test
 */
function classMatchesTest(clss, test) {
  if (!test) {
    return false;
  }

  clss = clss.trim();

  if (test instanceof RegExp) {
    return test.exec(clss);
  }

  if (Array.isArray(test)) {
    // Reassign arguments
    var tests = test;
    test = undefined;

    return tests.some(function(test) {
      if (test instanceof RegExp) {
        return test.exec(clss);
      } else {
        return clss === test;
      }
    });
  }

  return clss === test;
}

/**
 * Determine if selector is a class
 *
 * @param {string} selector
 */
function isClassSelector(selector) {
  return selector.indexOf('.') === 0;
}
