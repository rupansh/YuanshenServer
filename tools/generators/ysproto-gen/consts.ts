export const PROTOS = [
  // Dispatch protocol
  "QueryRegionListHttpRsp",
  "QueryCurrRegionHttpRsp",
  "RegionSimpleInfo",
  "RegionInfo",

  // Game protocol
  "PacketHead",
  // Platform type enum
  "PlatformType",

  "UnionCmdNotify",
  "GetPlayerTokenReq",
  "GetPlayerTokenRsp",
  "PlayerLoginReq",
  "OpenStateUpdateNotify",
  "StoreWeightLimitNotify",
  "PlayerStoreNotify",
  "AvatarDataNotify",
  "PlayerEnterSceneNotify",
  "PlayerLoginRsp",
  "GetPlayerSocialDetailReq",
  "GetPlayerSocialDetailRsp",
  "EnterSceneReadyReq",
  "EnterSceneReadyRsp",
  "SceneInitFinishReq",
  "EnterScenePeerNotify",
  "WorldDataNotify",
  "WorldPlayerInfoNotify",
  "ScenePlayerInfoNotify",
  "PlayerEnterSceneInfoNotify",
  "PlayerGameTimeNotify",
  "SceneTimeNotify",
  "SceneDataNotify",
  "HostPlayerNotify",
  "SceneTeamUpdateNotify",
  "SceneInitFinishRsp",
  "EnterSceneDoneReq",
  "SceneEntityAppearNotify",
  "SceneEntityDisappearNotify",
  "EnterSceneDoneRsp",
  "PostEnterSceneReq",
  "PostEnterSceneRsp",
  
  "WorldPlayerRTTNotify",
  "PingReq",
  "PingRsp",
  "PlayerDataNotify",

  "EnterWorldAreaReq",
  "EnterWorldAreaRsp",

  "CombatInvocationsNotify",

  // Internal CIN data
  "EntityMoveInfo",
  "EvtSetAttackTargetInfo",
  "EvtFaceToDirInfo",
  "EvtBeingHitInfo",

  "NpcTalkReq",
  "NpcTalkRsp",
  "GetShopReq",
  "GetShopRsp",
  "BuyGoodsReq",
  "BuyGoodsRsp",
  "Shop",
  "GetSceneAreaReq",
  "GetSceneAreaRsp",
  "GetScenePointReq",
  "GetScenePointRsp",
  "CityInfo",
  "PlayerSetPauseReq",
  "PlayerSetPauseRsp",
  "GetPlayerBlacklistReq",
  "GetPlayerBlacklistRsp",
  "GetPlayerFriendListReq",
  "GetPlayerFriendListRsp",


  "OpenStateType",
  "GrowCurveType",
  "ArithType",
  "FightPropType",
  "PropType",
];

export const PROTOS_PROJECT = "ysproto";
export const PROTOS_DEFAULT = "assets/protos";