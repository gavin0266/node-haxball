module.exports = function(API){
  const { OperationType, VariableType, ConnectionState, AllowFlags, Direction, CollisionFlags, CameraFollow, BackgroundType, GamePlayState, Callback, Utils, Room, Replay, Query, Library, RoomConfig, Plugin, Renderer, Errors, Language, Impl } = API;

  Object.setPrototypeOf(this, RoomConfig.prototype);
  RoomConfig.call(this, { // Every roomConfig should have a unique name.
    name: "modifyPlayerInput",
    version: "0.1",
    author: "abc",
    description: `This roomConfig lets players modify other players' input key events.
    Key input value can be calculated as ([kick]*16+[right]*8+[left]*4+[up]*2+[down]*1) where [kick], [right], [left], [up], [down] are all 0(not pressed) or 1(pressed).
    Available commands: 
    - !input [id] [value]: Set the key input value for the player whose playerId=[id] as [value]. 0<=value<=31.`,
    allowFlags: AllowFlags.CreateRoom // We allow this roomConfig to be activated on CreateRoom only.
  });

  var staticInputs = {}, room = null;

  var setPlayerInput = function(playerId, value){
    if (!room.getPlayer(playerId))
      return;
    /*
    if (!inputPermitted[byPlayerId]) // example for custom permission logic
      return;
    */
    staticInputs[playerId] = (isNaN(value) || value<0 || value>31) ? null : value;  // store a static input value for this player
  };

  this.initialize = function(_room){
    room = _room;
  };

  this.finalize = function(){
    room = null;
  };

  this.onOperationReceived = function(type, msg, globalFrameNo, clientFrameNo, customData){
    var playerId = msg.byId;
    switch (type){
      case OperationType.SendChat: {
        /*
        var m = msg.text;
        if (m.startsWith("!")){  // custom chat logic for extra commands
        */
        if (customData.isCommand){ // same as above 2 lines.
          var arr = customData.data; // same as var arr = m.trimEnd().split(" ");
          switch (arr[0]){
            case "!input":
              setPlayerInput(parseInt(arr[1]), parseInt(arr[2]));
              break;
          }
          //return false; // do not block this event from being processed. it is done automatically in onAfterOperationReceived. 
        }
        break;
      }
      case OperationType.SendInput: { // this event runs only when player presses/releases a key
        var input = staticInputs[playerId]; // get a static input value for the player who sent this event.
        if (input != null) // if it exists,
          msg.input = input; // set the event's input value to it.
        break;
      }
    }
    return true;
  };

  this.onPlayerLeave = function(playerObj, reason, isBanned, byId, customData){
    // get player's id
    var id = playerObj.id;

    // free extra memory allocated
    delete staticInputs[id];
  };
};
