const users = [];

// Join user to chat
function  userJoin(id, username, room) {
    const user = { id, username, room };

    // add to array
    users.push(user);

    return user;
}

// Get current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {
    // remove user from the array
    // find the user id that is equal to the id passed in
    const index = users.findIndex(user => user.id === id);

    if(index !== -1) {
        // splice(start: number, deleteCount: number)
        // instead of returning entire array, we just want to return the user
        return users.splice(index, 1)[0];
    }
}

// Get room users
function getRoomUsers(room) {
    // only fetch users that in the same room as room name passed in
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};
