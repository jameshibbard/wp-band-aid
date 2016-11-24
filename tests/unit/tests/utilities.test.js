/* global require, describe, it */

const assert = require('chai').assert;
const include = require('../helpers').include;

include('../../scripts/utils/utilities.js');

/* global getAllMatches */
describe('getAllMatches', () => {
  it('should return an empty array if no matches found', () => {
    const html = '<p>Some test text in a paragraph</p>';
    const pattern = /<(h[2-6]).+>(.+)<\/\1>/ig;

    const result = getAllMatches(pattern, html);

    assert.equal(result.length, 0);
  });

  it('should return all matches', () => {
    const html = `
      <div>
        <h2 id="firstheading">First heading</h2>
        <p>Some test text in a paragraph</p>
        <h3 id="secondheading">Second heading</h3>
      </div>`;
    const pattern = /<(h[2-6]).+>(.+)<\/\1>/ig;

    const result = getAllMatches(pattern, html);

    assert.equal(result.length, 2);
  });
});
