//
//  LookRtcMainVC.swift
//  AnimailHome
//
//  Created by XianHong zhang on 2020/9/20.
//  Copyright © 2020 XianHong zhang. All rights reserved.
//

import UIKit

class LookRtcMainVC: LookRtcBaseVC {
    
    
    var sinputView:MsgInputButtomView?
    var tabview:MsgListTabView?
    var bottomView:LookLWBottomView?
    var topRightView:RtcTopRightView?
    override func viewDidLoad() {
        super.viewDidLoad()
        //接收消息中心
        NotificationCenter.default.addObserver(self, selector: #selector(notiaction(noti:)), name: NSNotification.Name(rawValue: "receivemessage"), object: nil)
        //距离底部距离
        var bottomspace = 50.0
        var bottomViewHeight = 200.0
        if PlayRtcOC.isSafaBottom() == true{
            bottomspace = 60.0
            bottomViewHeight = 220.0
        }
        
        
        
        tabview = MsgListTabView.init(frame: CGRect.init(x: 0, y: kScreenHeight/2+100, width: kScreenWidth-100, height: kScreenHeight/2-100-CGFloat(bottomspace)), style: .grouped)
        
        
        self.contentBgView?.addSubview(tabview!)
        sinputView = MsgInputButtomView(frame: CGRect.init(x: 0, y: kScreenHeight-CGFloat(bottomspace), width: kScreenWidth-100, height: 30))
        self.contentBgView?.addSubview(sinputView!)
        sinputView?.btn?.addTarget(self, action: #selector(sendAction(btn:)), for: .touchUpInside)
        sinputView?.liwuBtn?.addTarget(self, action: #selector(showBottomView), for: .touchUpInside)
        //头像昵称
        let imgV = UIImageView.init(frame: CGRect.init())
        imgV.layer.cornerRadius = 20
        imgV.layer.masksToBounds = true
        self.contentBgView?.addSubview(imgV)
        
        //顶部右侧视图
        topRightView = RtcTopRightView.init(frame: CGRect.zero)
        self.contentBgView?.addSubview(topRightView!)
        topRightView?.setDataDic(self.dic ?? ["":""])
        topRightView?.snp_makeConstraints({ (make) in
            make.right.equalTo(-10)
            make.top.equalTo(34)
            make.width.equalTo(100)
            make.height.equalTo(50)
        })
        
        //底部礼物试图
        bottomView = LookLWBottomView.init(frame: CGRect.init(x: 0, y: kScreenHeight, width: kScreenWidth, height: CGFloat(bottomViewHeight)))
        self.contentBgView?.addSubview(bottomView!)
        bottomView?.itemFunction = { [weak self](dataDic) in
            self?.sendLWMsg(dataDic: dataDic)
        }
        let tap = UITapGestureRecognizer.init(target: self, action: #selector(hiddenBottomView))
        tap.numberOfTouchesRequired = 1
        tap.numberOfTapsRequired = 1
        self.contentBgView?.addGestureRecognizer(tap)
    }
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        
//        IQKeyboardManager.shared().isEnabled = false;
//        IQKeyboardManager.shared().isEnableAutoToolbar = false;
    }
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
//        IQKeyboardManager.shared().isEnabled = true;
//        IQKeyboardManager.shared().isEnableAutoToolbar = true;
    }
    
    override func joinChatRoomSuccess(){
        DispatchQueue.main.async {
            let txt = "加入了房间"
            self.tabview?.addMsg(txt: userInfo.name + txt)
            self.sendmsg(txt: txt,extra: "")
            
            self.sendmsg(txt: TxtMsgKeyType.joinChatRoomKey.rawValue, extra: "")
        }
        
    }
    override func closeWindow() {
        super.closeWindow()
         DispatchQueue.main.async {
            self.sendmsg(txt: TxtMsgKeyType.quitChatRoomKey.rawValue, extra: "")
        }
        
    }
    @objc func hiddenBottomView(){
        sinputView?.textF?.resignFirstResponder()
        UIView.animate(withDuration: 0.35) {
            var rect = self.bottomView?.frame
            rect?.origin.y = kScreenHeight
            self.bottomView?.frame = rect!
        }
    }
    @objc func showBottomView(){
        sinputView?.textF?.resignFirstResponder()
        UIView.animate(withDuration: 0.35) {
            var rect = self.bottomView?.frame
            rect?.origin.y = kScreenHeight-(self.bottomView?.height)!
            self.bottomView?.frame = rect!
        }
    }
    
    deinit{
        NotificationCenter.default.removeObserver(self, name: NSNotification.Name(rawValue: "receivemessage"), object: nibName)
    }
    
}
