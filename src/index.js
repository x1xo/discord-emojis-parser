const emojis=require('./files/UnicodeEmojis.json');
const svgs=require('./files/UnicodeEmojisSVG.json');
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
            // reps=reps.map(rep=>rep.slice(1,-1)).filter(rep=>this.isEmojiRep(rep)).map(rep=>this.getEmojiFromTextRep(rep));
        }
        return reps;
    }
    charToHex(c){
        return c.codePointAt()?.toString(16)//.padStart(4,"0").toUpperCase();
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
            svg:"https://discord.com/assets/"+svgs[[...emoji].map(this.charToHex).join('-')],
            unicode:emoji,
        }
    }
    parseUnicode(content){
        let tree=this.getTree();
        content=[...content];
        let parsedEmojis=[];
        let current=tree;
        let emojiUnicodes=[]
        for(let i=0;i<content.length;i++){
            let code=this.charToHex(content[i]);
            if(!(code in current)){
                current=tree
                continue;
            }
            current=current[code];
            emojiUnicodes.push(code);
            if(this.charToHex(content[i+1]??"") in current) continue;
            if(("default" in current))parsedEmojis.push({
                position:i-emojiUnicodes.length+1,
                emoji:this.getEmojiFromUnicode(content.slice(i-emojiUnicodes.length+1,i+1).join('')),
            });
            current=tree;
            emojiUnicodes=[]
            
        }
        return parsedEmojis;
    }
    getTree(){
        this._tree??=this.buildTree();
        return this._tree;
    }
    buildTree(){
        let tree={}
        let emojiList=Object.keys(require('./files/UnicodeEmojisSVG'));
        for(let i=0;i<emojiList.length;i++){
            let line=emojiList[i].split("-");
            // let unicode=line.pop();
            let current=tree;
            // console.log({line,current,unicode})
            while(line.length!=1)
            {
                let code=line.shift()
                current[code]??={}
                current=current[code];
            }
            let last=line.shift();
            current[last]??={};
            current[last]['default']=true;
        }
        this._tree=tree;
        return tree;
    }

}
exports=new EmojiParser();