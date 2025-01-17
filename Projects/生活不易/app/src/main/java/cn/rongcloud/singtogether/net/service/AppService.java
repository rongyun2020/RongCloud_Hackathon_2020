package cn.rongcloud.singtogether.net.service;

import cn.rongcloud.singtogether.bean.repo.VersionCheckRepo;
import cn.rongcloud.singtogether.common.NetStateLiveData;
import cn.rongcloud.singtogether.net.SealMicUrl;
import retrofit2.http.GET;
import retrofit2.http.Query;

/**
 * APP版本管理模块接口封装
 */
public interface AppService {

    @GET(SealMicUrl.APP_VERSION_LATEST)
    NetStateLiveData<VersionCheckRepo> versionCheck(@Query("platform") String platform, @Query("versionCode") Long versionCode);

}
