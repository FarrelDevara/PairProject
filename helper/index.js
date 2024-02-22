class helper {

    static formatDate(value){
        return value.toLocaleString("en-CA",{
            year : "numeric",month : "numeric",day : "numeric"
        })
    }
    
}

module.exports = helper