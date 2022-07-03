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
