const emojis = require('../assets/UnicodeEmojis.json');
const svgs = require('../assets/UnicodeEmojisSVG.json');
const emojiRegex = require('../assets/UnicodeEmojiRegex.js');

/**
 * @typedef {Object} EmojiPosition
 * @property {number} from - Start index in the string.
 * @property {number} to - End index in the string.
 */

/**
 * @typedef {'unicode' | 'text' | 'custom'} EmojiType
 */

/**
 * @typedef {Object} ParsedEmoji
 * @property {string|null} id - ID for custom emoji, null otherwise.
 * @property {string} name - Name of the emoji or shortcode.
 * @property {EmojiType} type - Type of the emoji (unicode, text, or custom).
 * @property {string} unicode - The original emoji or shortcode.
 * @property {EmojiPosition} position - Character range in the source string.
 * @property {string|null} link - URL to emoji image if available.
 * @property {boolean} animated - Whether the emoji is animated.
 */

class DiscordEmojiParser {
  /**
   * Parses any Discord-related emoji from content.
   * @param {string} content - The message string to parse.
   * @returns {ParsedEmoji[]} Array of parsed emojis.
   */
  parse(content) {
    const customEmojis = this.parseDiscordCustom(content);
    const unicodeEmojis = this.parseUnicode(content, customEmojis);
    const textEmojis = this.parseTextRepresentation(content, customEmojis);

    const all = [...unicodeEmojis, ...textEmojis, ...customEmojis];
    all.sort((a, b) => a.position.from - b.position.from);
    return all;
  }

  /**
   * Parses Unicode emojis (e.g. 😂) from content.
   * @param {string} content - The message string.
   * @param {ParsedEmoji[]} [skipRanges=[]] - Ranges to skip parsing inside.
   * @returns {ParsedEmoji[]} Parsed unicode emojis.
   */
  parseUnicode(content, skipRanges = []) {
    return [...content.matchAll(emojiRegex)].map(match => {
      const unicode = match[0];
      const from = match.index;
      const to = from + unicode.length;

      if (this.isInsideRange(from, skipRanges)) return null;

      const name = emojis[unicode];
      const codePoint = this.toCodePoint(unicode, '-');
      let link = null;
      if (svgs[codePoint]) link = `https://discord.com/assets/${svgs[codePoint]}`;

      return {
        id: null,
        name,
        type: 'unicode',
        unicode,
        position: { from, to },
        link,
        animated: false
      };
    }).filter(Boolean);
  }

  /**
   * Parses emoji text representations like :smile: from content.
   * @param {string} content - The message string.
   * @param {ParsedEmoji[]} [skipRanges=[]] - Ranges to skip parsing inside.
   * @returns {ParsedEmoji[]} Parsed text-based emojis.
   */
  parseTextRepresentation(content, skipRanges = []) {
    const regex = /:([\w_]+):/g;
    const results = [];
    let match;

    while ((match = regex.exec(content))) {
      const fullMatch = match[0];
      const name = match[1];
      const from = match.index;
      const to = from + fullMatch.length;

      if (this.isInsideRange(from, skipRanges)) continue;
      if (!(name in emojis)) continue;

      const unicode = emojis[name];
      const codePoint = this.toCodePoint(unicode, '-');
      let link = null;
      if (svgs[codePoint]) link = `https://discord.com/assets/${svgs[codePoint]}.svg`;

      results.push({
        id: null,
        name,
        type: 'text',
        unicode,
        position: { from, to },
        link,
        animated: false
      });
    }

    return results;
  }

  /**
   * Parses Discord custom emojis like <:name:id> or <a:name:id>.
   * @param {string} content - The message string.
   * @returns {ParsedEmoji[]} Parsed custom emojis.
   */
  parseDiscordCustom(content) {
    const regex = /<(?<animated>a?):(?<name>\w+):(?<id>\d+)>/g;
    const results = [];
    let match;

    while ((match = regex.exec(content))) {
      const { name, id, animated } = match.groups;
      const from = match.index;
      const to = from + match[0].length;

      results.push({
        id,
        name,
        type: 'custom',
        unicode: match[0],
        position: { from, to },
        link: `https://cdn.discordapp.com/emojis/${id}.${animated ? 'gif' : 'png'}`,
        animated: !!animated
      });
    }

    return results;
  }

  /**
   * Converts a Unicode string to code point format.
   * @param {string} str - The emoji string.
   * @param {string} [sep='-'] - Separator between code points.
   * @returns {string} Code point string.
   */
  toCodePoint(str, sep = '-') {
    return Array.from(str)
      .map(char => char.codePointAt(0).toString(16))
      .join(sep);
  }

  /**
   * Checks if a given index is inside any of the emoji ranges.
   * @param {number} index - Index to check.
   * @param {ParsedEmoji[]} ranges - Emoji entries to check against.
   * @returns {boolean} True if index is inside any emoji range.
   */
  isInsideRange(index, ranges) {
    return ranges.some(({ position }) => index >= position.from && index < position.to);
  }
}

module.exports = new DiscordEmojiParser();
