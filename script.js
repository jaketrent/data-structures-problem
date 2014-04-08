var users_joined = []
var chatrooms = {'west_side':{}, 'east_side':{}}

window.new_user_joined = function(name) {
  users_joined.unshift(name)
}

//this function is only called once by the server every five seconds
window.assign_to_chatroom = function() {
  var longestWaitingUser = function () {
    return users_joined.pop()
  }

  var numOfUsersIn = function (key) {
    return Object.keys(chatrooms[key]).length
  }

  var roomKeyWithLeastUsers = function () {
    var min = Infinity
    var minKey = null
    Object.keys(chatrooms).forEach(function (key) {
      var numStudents = numOfUsersIn(key)
      if (numStudents < min) {
        min = numStudents
        minKey = key
      }
    })
    return minKey
  }

  var usersInRoomByJoinTime = function (room) {
    return Object.keys(room).map(function (user) {
      return { name: user, time: room[user] }
    }).sort(function (a, b) {
      return a.time < b.time ? -1 : 1
    }).map(function (userObj) {
      return userObj.name
    })
  }

  var renderUsersInRoom = function (users, roomKey) {
    var frag = document.createDocumentFragment()
    users.forEach(function (user) {
      frag.appendChild($('<p><button type="button" class="btn btn-warning btn-xs">' + user + '</button></p>')[0])
    })
    $('.chat-' + roomKey).find('.users').html(frag)
  }

  var userToAssign = longestWaitingUser()
  var roomKey = roomKeyWithLeastUsers()
  chatrooms[roomKey][userToAssign] = Date.now()
  renderUsersInRoom(usersInRoomByJoinTime(chatrooms[roomKey]), roomKey)

  console.log('assigning ' + userToAssign + ' to ' + roomKey)
}