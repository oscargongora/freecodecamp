const { v4: uuidv4 } = require('uuid');
const {dateHelper, fileSystemHelper} = require("./helpers");


const newId =()=> uuidv4();

const db = {
    addUser: (username) =>{
        if(username){
            let users = fileSystemHelper.read();
            let newUser = {};
            newUser.username = username;
            newUser._id = newId();
            fileSystemHelper.write({...users, [newUser._id]:{username: newUser.username, logs:{}} });
            return { succeeded: true, data: newUser };
        }
        return { succeeded: false };
    },
    getUsers: () =>{
        const users = fileSystemHelper.read();
        const usersArr = Object.keys(users).map(userId => {
            return {_id: userId, username: users[userId].username};
        });
        return usersArr
    },
    updateUser: (id, description, duration, date) =>{
        if(id && description && duration){
            let users = fileSystemHelper.read();
            let usedDate = new Date();
            if(date){
                usedDate = new Date(date);
            }
            users[id] = {
                username: users[id].username,
                logs:{
                    ...users[id].logs,
                    [Object.keys(users[id].logs).length + 1]:{
                        description: description,
                        duration: duration,
                        date: usedDate
                    }
                }
            };
            fileSystemHelper.write(users);
            const data = {
                _id: id,
                username: users[id].username,
                date: usedDate.toDateString(),
                duration: duration,
                description: description
            };
            return { succeeded: true, data };
        }
        return { succeeded: false };
    },
    getUserWithLogs: (id, from, to, limit)=>{
        let fromDate, toDate, _limit;
        try {
            fromDate = from && new Date(from);
            toDate = to && new Date(to);
            _limit = limit && Number(limit);
        } catch (error) {
            
        }

        const users = fileSystemHelper.read();

        const resUser = {
            _id: id,
            username: users[id].username,
        };

        resUser.log = Object.keys(users[id].logs).filter(userLogId =>{
            const userLog = users[id].logs[userLogId];
            const userLogDate = new Date(userLog.date);
            if(from && fromDate && fromDate > userLogDate) return false;
            if(to && toDate && toDate <= userLogDate) return false;
            return true;
        });

        if(_limit){
            resUser.log = resUser.log.slice(0, _limit);
        }

        resUser.log = resUser.log.map(userLogId =>{
            const userLog = users[id].logs[userLogId];
            return{
                description: userLog.description,
                duration: userLog.duration,
                date: new Date(userLog.date).toDateString()
            };
        });

        resUser.count = resUser.log.length;
        return { succeeded: true, data: resUser };
    }
};

module.exports = db;