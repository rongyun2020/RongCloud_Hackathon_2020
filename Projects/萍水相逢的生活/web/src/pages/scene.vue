<template>
  <f7-page name="scene" @page:afterin="refreshConversations" @page:reinit="refreshScene">
    <f7-navbar back-link="返回">
      <f7-nav-title>当前场景：{{ sourceScene.name }}</f7-nav-title>
      <f7-nav-right>
        <f7-link icon-f7="bars" :href="`/scenes/${sourceSceneId}/edit/`" />
      </f7-nav-right>
    </f7-navbar>

    <f7-block>
      我的场景号是：<strong>{{ sourceScene.number }}</strong>，把此号码分享给小伙伴以实现沟通吧。
      <f7-button @click="$refs.shareActions.open()">分享</f7-button>
    </f7-block>

    <f7-actions ref="shareActions">
      <f7-actions-group>
        <f7-actions-label>分享</f7-actions-label>
        <f7-actions-button bold @click="shareLink">分享链接</f7-actions-button>
        <f7-actions-button>待补充……</f7-actions-button>
        <f7-actions-button color="red">取消</f7-actions-button>
      </f7-actions-group>
    </f7-actions>

    <f7-list>
      <f7-list-input 
        placeholder="输入对方场景号即可发起会话"
        :value="targetSceneNumber"
        @input="targetSceneNumber = $event.target.value"
      ></f7-list-input>
      <f7-list-button @click="connect" title="发起会话"></f7-list-button>
    </f7-list>

    <!-- 会话列表 -->
    <f7-list media-list>
      <f7-list-item v-for="conversation in conversations" :key="conversation.id"
                    v-if="conversation.lastMessage"
                    :title="conversation.targetScene.nickname" 
                    :text="conversation.getSummaryOfLastMessage()"
                    :link="$f7router.generateUrl({ name: 'conversation', params: { id: conversation.id } })"
                    no-chevron
      >
        <img slot="media" :src="conversation.targetScene.avatar" width="44" />
        <span slot="after" style="font-size: 0.8em;">
          {{ conversation.lastMessage.time | accordingToNow('short') }}
          <f7-badge color="red" v-show="conversation.unreadCount">
            {{ conversation.unreadCount }}
          </f7-badge>
        </span>
      </f7-list-item>
    </f7-list>
  </f7-page>
</template>

<script>
import { Scene, Conversation } from '@/models'
import { accordingToNow } from '@/js/filters'
import MessageLib from '@/js/message-lib'

export default {
  name: 'ScenePage',
  filters: {
    accordingToNow
  },
  data () {
    return {
      conversations: [],
      sourceScene: {},
      targetSceneNumber: null,
      firstInit: true
    }
  },
  computed: {
    sourceSceneId () {
      return this.sourceScene.id
    }
  },
  async mounted () {
    const sceneId = parseInt(this.$f7route.params.id)
    const scene = await Scene.find(sceneId)
    this.sourceScene = scene

    const conversations = await Conversation.list({ sceneId })
    this.conversations = conversations
    this.firstInit = false

    MessageLib.addListener(this.receiveMessage)
  },
  beforeDestroy () {
    MessageLib.removeListener(
      this.receiveMessage, 
      () => console.log('场景页删除消息监听器成功'),
      () => console.error('场景页删除消息监听器失败'),
    )
  },
  methods: {
    shareLink () {
      const host = window.location.origin
      const path = this.$f7router.generateUrl({
        name: 'initiate-conversation',
        query: {
          t: this.sourceScene.id
        }
      })
      const link = `${host}/#!${path}`
      console.log('share link', link)

      this.$f7.dialog.create({ 
        title: '分享链接',
        text: link,
        content: '<br>将以上链接分享给他人，对方就可以发起与你的会话',
        buttons: [
          { text: 'OK' }
        ]
      }).open()
    },
    async refreshScene () {
      const sceneId = parseInt(this.$f7route.params.id)
      const scene = await Scene.find(sceneId)
      this.sourceScene = scene
    },
    async refreshConversations () {
      if (this.firstInit) return

      this.conversations = await Conversation.list({ sceneId: this.sourceSceneId })
    },
    async receiveMessage (message) {
      // 首先，找到会话 id
      const index = this.conversations.findIndex(
        conversation => conversation.id === message.conversationId
      )
      let conversation = this.conversations[index]

      let newConversation = null
      if (index >= 0) {
        const conversation = this.conversations[index]
        this.conversations.splice(index, 1)

        newConversation = conversation.clone()
        newConversation.unreadCount += 1
        newConversation.lastMessage = message
      } else {
        const conversation = await Conversation.find(message.conversationId)
        newConversation = conversation
      }

      this.conversations.unshift(newConversation)
    },
    async connect () {
      try {
        const conversation = await Conversation.initiate({
          sourceSceneId: this.sourceSceneId,
          targetSceneNumber: this.targetSceneNumber
        })
        this.$f7router.navigate( {
          name: 'conversation',
          params: { id: conversation.id }
        })
      } catch (e) {
        if (e.code === 'resource_not_found') {
          this.$f7.toast.show({
            text: '无此场景',
            position: 'center',
            closeTimeout: 2000,
          })
        } else {
          throw e
        }
      }
    }
  }
}
</script>
