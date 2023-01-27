const fs = require('fs');

const fileSystemHelper = {
    write: (data)=>{
        fs.writeFileSync('users.json', JSON.stringify(data));
    },
    read: () =>{
        const data = fs.readFileSync("users.json");
        return JSON.parse(data);
    }
}

const dateHelper = {
    parseUTCString: (date) =>{
        return new Date(date).toUTCString().split(/[,\s]+/).slice(0, 4).join(" ");
    }
}

module.exports = {dateHelper, fileSystemHelper};