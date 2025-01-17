package cn.rongcloud.scriptgame.ui.room;

import android.view.View;

import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModel;

import cn.rongcloud.scriptgame.R;
import cn.rongcloud.scriptgame.SealMicApp;
import cn.rongcloud.scriptgame.bean.repo.CreateRoomRepo;
import cn.rongcloud.scriptgame.common.NetStateLiveData;
import cn.rongcloud.scriptgame.common.constant.UserRoleType;
import cn.rongcloud.scriptgame.manager.CacheManager;
import cn.rongcloud.scriptgame.manager.NavOptionsRouterManager;
import cn.rongcloud.scriptgame.model.RoomModel;
import cn.rongcloud.scriptgame.util.PatternUtil;
import cn.rongcloud.scriptgame.util.RandomUtil;
import cn.rongcloud.scriptgame.util.ToastUtil;

/**
 * 开启新房间VM
 */
public class CreateRoomViewModel extends ViewModel {

    private MutableLiveData<String> roomName;
    private RoomModel roomModel;
    private NetStateLiveData<CreateRoomRepo> createRoomRepoLiveData;
    private Observer<CreateRoomRepo> createRoomRepoObserver;

    public CreateRoomViewModel(RoomModel roomModel) {
        roomName = new MutableLiveData<>();
        this.roomModel = roomModel;
    }

    public MutableLiveData<String> getRoomName() {
        if (roomName == null) {
            roomName = new MutableLiveData<>();
        }
        return roomName;
    }

    public void createRoom(final View view, String roomName) {

        //校验
        if (!PatternUtil.filterRoomName(roomName)) {
            //校验未通过
            ToastUtil.showToast(SealMicApp.getApplication().getResources().getString(R.string.create_room_error));
            return;
        }

        String roomThemeUrl = RandomUtil.getRoomThemeImage();
        createRoomRepoLiveData = roomModel.createRoom(roomName, roomThemeUrl);
        createRoomRepoObserver = new Observer<CreateRoomRepo>() {
            @Override
            public void onChanged(CreateRoomRepo createRoomRepo) {
                if (createRoomRepo != null) {
                    String roomId = createRoomRepo.getRoomId();
                    String roomName = createRoomRepo.getRoomName();
                    String roomTheme = createRoomRepo.getThemePictureUrl();
                    //缓存房间ID
                    CacheManager.getInstance().cacheRoomId(roomId);
                    //创建完房间之后进入房间，此时人物的角色一定为主持人
                    NavOptionsRouterManager.getInstance()
                            .gotoChatRoomFragmentAndBackStack(view,
                                    roomId,
                                    roomName,
                                    roomTheme,
                                    UserRoleType.HOST);
                }
            }
        };
        createRoomRepoLiveData.observeForever(createRoomRepoObserver);
    }

    @Override
    protected void onCleared() {
        super.onCleared();
        if (createRoomRepoLiveData != null && createRoomRepoObserver != null) {
            createRoomRepoLiveData.removeObserver(createRoomRepoObserver);
            createRoomRepoObserver = null;
        }
    }
}