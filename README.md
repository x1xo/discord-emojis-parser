# discord-emojis
a useful jsons of unicode emojis that are used in discord
and, i will try to keep it up-to-date with the discord latest changes
the json file is in simple format of
```json
{
 "unicode_emoji":"emoji name",
 "emoji name":"unicode_emoji"
}
```

You can easily use this json to validate and parse unicode emojis from the discord message
if the emoji is not in the list it means, that emoji is not supported in the discord

# Example 1: validate
```js
const unicodeEmojis=require("./UnicodeEmojis.json")
function validateEmoji(emoji){
  if(emoji.startsWith(':') && emoji.endsWith(':')) emoji=emoji.slice(1,-1) // just in case it's in form of :smile:
  return emoji in unicodeEmojis
}

let emoji="grinning"
if(validateEmoji(emoji)) console.log("it's a valid emoji for discord")
else console.log("Nah, this is not a valid emoji for discord")
```

# Example 2: validate and return the emoji name
```js
const unicodeEmojis=require("./UnicodeEmojis.json")
function validateEmoji(emoji){
  if(emoji.startsWith(':') && emoji.endsWith(':')) emoji=emoji.slice(1,-1) // just in case it's in form of :smile:
  return emoji in unicodeEmojis
}
function emojiName(emoji){
  return unicodeEmojis[emoji]
}
let emoji="😀"
if(!validateEmoji(emoji)) console.log("Nah, this is not a valid emoji for discord")
console.log("This unicode emoji name is:",emojiName(emoji))
```
