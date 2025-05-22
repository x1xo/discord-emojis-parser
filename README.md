# EmojiParser

A lightweight utility to parse all types of Discord emojis from a message string — including:

- ✅ **Custom Emojis** (`<:name:id>` and `<a:name:id>`)
- ✅ **Unicode Emojis** (like 😂, ❤️, 🐍)
- ✅ **Text Representation Emojis** (`:smile:`, `:heart:`)

Returns full metadata about each emoji including:
- Type (`unicode`, `custom`, or `text`)
- Position in the input string
- Name
- Emoji ID (if custom)
- Image link (CDN)
- Animation flag

---

## 🔧 Installation

```bash
npm install discord-emoji-parser
````

Or clone this repo directly if using as a module:

```bash
git clone https://github.com/x1xo/discord-emojis-parser
```

---

## 📦 Usage

```js
const emojiParser = require('discord-emoji-parser');

const input = 'Hello <:wave:123456789012345678> :smile: 😂 <a:party:987654321098765432>';
const parsed = emojiParser.parse(input);

console.log(parsed);
```

### ✅ Output

```js
[
  {
    id: '123456789012345678',
    name: 'wave',
    type: 'custom',
    unicode: '<:wave:123456789012345678>',
    position: { from: 6, to: 31 },
    link: 'https://cdn.discordapp.com/emojis/123456789012345678.png',
    animated: false
  },
  {
    id: null,
    name: 'smile',
    type: 'text',
    unicode: '😄',
    position: { from: 32, to: 39 },
    link: 'https://discord.com/assets/abcd1234.svg', // if available
    animated: false
  },
  {
    id: null,
    name: 'face with tears of joy',
    type: 'unicode',
    unicode: '😂',
    position: { from: 40, to: 41 },
    link: 'https://discord.com/assets/efgh5678', // if available
    animated: false
  },
  {
    id: '987654321098765432',
    name: 'party',
    type: 'custom',
    unicode: '<a:party:987654321098765432>',
    position: { from: 42, to: 70 },
    link: 'https://cdn.discordapp.com/emojis/987654321098765432.gif',
    animated: true
  }
]
```

---

## 🧠 Emoji Types Explained

| Type      | Description                        | Example             |
| --------- | ---------------------------------- | ------------------- |
| `custom`  | Custom emoji from Discord server   | `<:blob:123>`       |
| `unicode` | Native emoji character             | `😂`, `❤️`          |
| `text`    | Text representation like `:smile:` | `:heart:`, `:wave:` |

---

## 📜 License

MIT — feel free to use and modify.

## Credits

Credits to [NervN](https://github.com/NervN/discord-emojis).