declare module "discord-emoji-parser" {
  interface EmojiPosition {
    from: number;
    to: number;
  }

  interface BaseEmoji {
    name: string;
    unicode: string;
    position: EmojiPosition;
    link: string | null;
    animated: boolean;
  }

  /**
   * Represents a unicode emoji.
   */
  interface UnicodeEmoji extends BaseEmoji {
    type: "unicode";
    id: null;
  }

  /**
   * Represents a text-based emoji like `:emoji_name:`.
   */
  interface TextEmoji extends BaseEmoji {
    type: "text";
    id: null;
  }

  /**
   * Represents a Discord custom emoji like `<:name:id>` or `<a:name:id>`.
   */
  interface CustomEmoji extends BaseEmoji {
    type: "custom";
    id: string; // Required when type is "custom"
  }

  /**
   * Represents a parsed emoji from message content.
   */
  type Emoji = UnicodeEmoji | TextEmoji | CustomEmoji;

  class EmojiParser {
    /**
     * Parses a message string and returns all emojis (unicode, text-based, and custom).
     * @param content - The message content to parse.
     * @returns An array of parsed emojis.
     */
    parse(content: string): Emoji[];

    /**
     * Parses unicode emojis from content.
     * @param content - The message content to search.
     * @param skipRanges - Emoji ranges to skip, usually from other parsing stages.
     * @returns An array of unicode emojis.
     */
    parseUnicode(content: string, skipRanges?: Emoji[]): Emoji[];

    /**
     * Parses `:emoji_name:` style emojis.
     * @param content - The message content to search.
     * @param skipRanges - Emoji ranges to skip, usually from other parsing stages.
     * @returns An array of text representation emojis.
     */
    parseTextRepresentation(content: string, skipRanges?: Emoji[]): Emoji[];

    /**
     * Parses Discord custom emojis like `<:name:id>` or `<a:name:id>`.
     * @param content - The message content to search.
     * @returns An array of custom emojis.
     */
    parseDiscordCustom(content: string): Emoji[];

    /**
     * Converts a unicode emoji to its codepoint format.
     * @param str - The emoji string.
     * @param sep - Separator to use (default is "-").
     * @returns Codepoint string.
     */
    toCodePoint(str: string, sep?: string): string;
  }

  const parser: EmojiParser;
  export = parser;
}
