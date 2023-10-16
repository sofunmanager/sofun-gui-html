

class DB{
    constructor(){
        this.savePath="/db.json"
        this.is_clien=window.localStorage.length?true:false
    }
    setItem(){
        alert(this.is_clien)
    }

}

const _db = new DB();
export {_db as db}