//var API;
var roomCallback = function(room){
  //const { OperationType, VariableType, ConnectionState, AllowFlags, Callback, Utils, Room, Replay, RoomConfig, Plugin, Renderer, Impl } = API;
  var eLink = document.getElementById("link");
  // This is a headless bot test:
  room.onRoomLink = (roomLink, customData)=>{
    console.log(roomLink);
    eLink.href = roomLink;
    eLink.innerText = roomLink;
  };
  room.startGame();
  room.onPlayerJoin = (playerObj, customData) => {
    //console.log("Player joined : ", playerObj);
    var {id, name} = playerObj;
    room.setPlayerAdmin(id, true); // make everybody admin
  };
};
/*API = */init(true, roomCallback);
