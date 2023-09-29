const emojis=require('../assets/UnicodeEmojis.json');
const svgs=require('../assets/UnicodeEmojisSVG.json');
const emojiReg = require('../assets/UnicodeEmojiRegex.js');

class EmojiParser {
    constructor(){
    }
    parse(content){
        let unicodes=this.parseUnicode(content)
        unicodes=unicodes.concat(this.parseTextRep(content));
        unicodes.sort((a,b)=>a.position-b.position)

        return unicodes.map(v=>v.emoji)
    }
    parseTextRep(content){
        let regexp=/:([\w_]+):/g;
        let reps=[];
        let match;
        while(!!(match=regexp.exec(content))){
            let name=match[1];
            let index=match.index;
            if(!this.isEmojiRep(name))  continue;
            reps.push({
                position:index,
                emoji:this.getEmojiFromTextRep(name)
            });
        }
        return reps;
    }
    charToHex(c){
        return c.codePointAt()?.toString(16)//.padStart(4,"0").toUpperCase();
    }
    toCodePoint(unicodeSurrogates, sep) {
        unicodeSurrogates=unicodeSurrogates.indexOf(String.fromCharCode(0x200d)) < 0 ? unicodeSurrogates.replace(/\uFE0F/g, '') : unicodeSurrogates;
        var
          r = [],
          c = 0,
          p = 0,
          i = 0;
        while (i < unicodeSurrogates.length) {
          c = unicodeSurrogates.charCodeAt(i++);
          if (p) {
            r.push((0x10000 + ((p - 0xD800) << 10) + (c - 0xDC00)).toString(16));
            p = 0;
          } else if (0xD800 <= c && c <= 0xDBFF) {
            p = c;
          } else {
            r.push(c.toString(16));
          }
        }
        return r.join(sep || '-');
    }
    isEmojiRep(name){
        return name in emojis
    }
    getEmojiFromTextRep(name){
        return this.getEmojiFromUnicode(emojis[name]);
    }
    getEmojiFromUnicode(emoji){
        return {
            name:emojis[emoji],
            svg:"https://discord.com/assets/"+svgs[this.toCodePoint(emoji,'-')],
            unicode:emoji,
        }
    }
    parseUnicode(content){
        let matchList=[...content.matchAll(emojiReg)];
        return matchList.map(match=>{
            return ({
                emoji:this.getEmojiFromUnicode(match[0]),
                position:match.index,
            })
        })
    }
}
module.exports=new EmojiParser();