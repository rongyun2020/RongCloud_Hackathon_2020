package cn.rongcloud.scriptgame.model;

import java.util.List;

import cn.rongcloud.scriptgame.bean.repo.CreateRoomRepo;
import cn.rongcloud.scriptgame.bean.repo.NetResult;
import cn.rongcloud.scriptgame.bean.repo.RoomDetailRepo;
import cn.rongcloud.scriptgame.bean.repo.RoomListRepo;
import cn.rongcloud.scriptgame.bean.repo.RoomMemberRepo;
import cn.rongcloud.scriptgame.bean.req.CreateRoomReq;
import cn.rongcloud.scriptgame.bean.req.MessageBroadCastReq;
import cn.rongcloud.scriptgame.bean.req.RoomBanUserReq;
import cn.rongcloud.scriptgame.bean.req.RoomKickUserReq;
import cn.rongcloud.scriptgame.bean.req.RoomSettingReq;
import cn.rongcloud.scriptgame.common.NetStateLiveData;
import cn.rongcloud.scriptgame.net.client.RetrofitClient;
import cn.rongcloud.scriptgame.net.service.RoomService;

/**
 * 房间模块数据层(M层)
 */
public class RoomModel {

    private RoomService roomService;

    public RoomModel(RetrofitClient client) {
        roomService = client.createService(RoomService.class);
    }

    public NetStateLiveData<CreateRoomRepo> createRoom(String name, String themeUrl) {
        return roomService.createRoom(new CreateRoomReq(name, themeUrl));
    }

    public NetStateLiveData<NetResult<Void>> roomSetting(String roomId, boolean allowedAudienceJoinRoom, boolean allowedAudienceFreeJoinMic) {
        return roomService.roomSetting(new RoomSettingReq(roomId, allowedAudienceJoinRoom, allowedAudienceFreeJoinMic));
    }

    public NetStateLiveData<RoomListRepo> roomList(String fromRoomId, int size) {
        return roomService.roomList(fromRoomId, size);
    }

    public NetStateLiveData<RoomDetailRepo> roomDetail(String roomId) {
        return roomService.roomDetail(roomId);
    }

    public NetStateLiveData<NetResult<List<RoomMemberRepo.MemberBean>>> roomMembers(String roomId) {
        return roomService.roomMembers(roomId);
    }

    public NetStateLiveData<NetResult<List<RoomMemberRepo.MemberBean>>> micMembers(String roomId) {
        return roomService.micMembers(roomId);
    }

    public NetStateLiveData<NetResult<List<RoomMemberRepo.MemberBean>>> gagMembers(String roomId) {
        return roomService.gagMembers(roomId);
    }

    public NetStateLiveData<NetResult<Void>> kickMember(String roomId, List<String> memberIds) {
        RoomKickUserReq roomKickUserReq = new RoomKickUserReq(roomId, memberIds);
        return roomService.kickMember(roomKickUserReq);
    }

    public NetStateLiveData<NetResult<Void>> banMember(String roomId, String operation, List<String> memberIds) {
        RoomBanUserReq roomBanUserReq = new RoomBanUserReq(roomId, operation, memberIds);
        return roomService.banMember(roomBanUserReq);
    }

    public NetStateLiveData<NetResult<Void>> messageBroad(String fromUserId, String objectName, String content) {
        MessageBroadCastReq messageBroadCastReq = new MessageBroadCastReq(fromUserId, objectName, content);
        return roomService.messageBroadcast(messageBroadCastReq);
    }
}
