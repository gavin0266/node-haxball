module.exports = function(API){
  const { OperationType, VariableType, ConnectionState, AllowFlags, Direction, CollisionFlags, CameraFollow, BackgroundType, GamePlayState, Callback, Utils, Room, Replay, Query, Library, RoomConfig, Plugin, Renderer, Errors, Language, Impl } = API;

  Object.setPrototypeOf(this, Library.prototype);
  Library.call(this, "GM_ironRegen", { // "GM_ironRegen" is library's name. Every library should have a unique name.
    version: 0.1,
    author: "abc",
    description: `This is the implementation of the game mode 'Iron-man Regeneration'.
    Available commands: 
    - !iron: Activate/deactivate ironman.`
  });

  var room, playerData, latestTick = 0, params = {
    maxRegen: 20000,
    massiveDecrease: 2500,
    minBeforeCanUse: 7500,
    decrease: 320,
    increase: 120,
    chatStatusMsgLength: 10,
    intervalMsec: 1000
  };
  var originalPlayerProps = {
    radius: 15,
    invMass: 0.5
  };
  var playerProps = {
    radius: 10,
    invMass: 0.00000000001
  };
  
  this.initialize = function(_room){
    room = _room;
  };

  this.finalize = function(){
    room = null;
  };

  this.initializeMode = function(){
    playerData = {};
    room.players.forEach(({id})=>{
      playerData[id]={
        value: 0,
        lastSentState: null,
        active: false
      };
    });
    room.librariesMap.commands?.add({
      name: "iron",
      parameters: [],
      minParameterCount: 0,
      helpText: "Activate/deactivate ironman.",
      callback: (_params, byId) => {
        var data = playerData[byId];
        if (!data)
          return;
        if (!data.active){
          if (data.value<params.minBeforeCanUse)
            return;
          data.value -= params.massiveDecrease;
          var state = Math.round(params.chatStatusMsgLength*data.value/params.maxRegen);
          if (data.lastSentState!=state){
            room.setPlayerAvatar(byId, ""+state);
            data.lastSentState = state;
          }
        }
        setIronmanActive(byId, !data.active);
      }
    });
  };

  this.finalizeMode = function(){
    room.librariesMap?.commands?.remove("iron");
    room.players.forEach(({id})=>{
      room.setPlayerAvatar(id, null);
      setIronmanActive(id, false);
    });
    playerData = null;
  };

  this.onModePlayerJoin = function(playerObj, customData){
    playerData[playerObj.id]={
      value: 0,
      lastSentState: null,
      active: false
    };
  };

  this.onModePlayerLeave = function(playerObj, reason, isBanned, byId, customData){
    delete playerData[playerObj.id];
  };

  function setIronmanActive(id, active){
    if (playerData[id]!=null)
      playerData[id].active = active;
    if (active)
      room.setPlayerDiscProperties(id, playerProps);
    else
      room.setPlayerDiscProperties(id, originalPlayerProps);
  }

  this.onModePositionsReset = function(customData){
    room.players.forEach(({id})=>{
      setIronmanActive(id, false);
    });
  };

  this.onModePlayerTeamChange = function(id, teamId, byId, customData){
    setIronmanActive(id, false);
  };

  this.onModeGameTick = function(customData){
    var t = performance.now();
    if (t-latestTick<params.intervalMsec)
      return;
    latestTick = t;
    var p = params;
    Object.keys(playerData).forEach((id)=>{
      var ptr = playerData[id];
      var val = ptr.value;
      if (ptr.active){
        if (val<p.decrease){
          val = 0;
          setIronmanActive(parseInt(id), false);
        }
        else
          val-=p.decrease;
      }
      else{
        if (val>p.maxRegen-p.increase)
          val = p.maxRegen;
        else
          val += p.increase;
      }
      ptr.value = val;
      var state = Math.round(p.chatStatusMsgLength*val/p.maxRegen);
      if (ptr.lastSentState!=state){
        room.setPlayerAvatar(parseInt(id),""+state);
        ptr.lastSentState = state;
      }
    });
  };
};
