<template>
  <div class="border-box">
    <!-- 微博 -->
    <div class="data-center"
         v-if="this.type === 'wb'">
      <div class="account-detail">
        <div>
          <el-image :src='accountDetail.headimg'
                    :fit="'fill'"
                    class="head-img"></el-image>
        </div>
        <div>
          <h2>{{accountDetail.nick}}</h2>
          <span class="sizin">
            <i>地区:</i>
            <span class="color-blue">{{accountDetail.province}}</span>
          </span>
          <span class="sizin">
            <i>用户名:</i>
            <span class="color-blue">{{accountDetail.nick}}</span>
          </span>
        </div>
      </div>
      <!-- 微博内容列表 -->
      <div class="data-out-list">
        <div class="data-center-list">
          <div class="data-page"
               v-for="(item,index) in centerList"
               :key="index">
            <div style="width:100%">
             <div class="list-title" v-if="item.article.content">
              <h2 v-html="item.article.content"
                  @click="Websock(item.article,index)"></h2>
            </div>
            <div class="list-cont lin-clamp-3"
                 v-if="item.article.title"
                 @click="Websock(item.article,index)"
                 v-html="item.article.title"></div>
            <!-- <div v-else
                 style="height: 66px; line-height:33px">暂无内容...</div> -->
              <div class="list-see">
                <ul>
                  <li>
                    <span>发布时间:</span>
                    <p class="color-blue">{{item.article.pubtimeformat}}</p>
                  </li>
                  <li>
                    <span>评论数:</span>
                    <p class="color-blue">{{item.article.pinglun}}</p>
                  </li>
                  <li class="read-num">
                    <span>点赞数:</span>
                    <p class="color-blue">{{item.article.dianzan}}</p>
                  </li>
                  <li>
                    <span>转发数:</span>
                    <p class="color-blue">{{item.article.zhuanfa}}</p>
                  </li>
                </ul>
              </div>
            </div>
            <div class="user-dialog">
              <el-dialog :visible.sync="item.dialogVisible"
                         :modal="ismodal"
                         @close="getDialog(item, index)"
                         center
                         width="30%">
                <el-form :model="fromDate"
                         ref="fromDate"
                         :rules="rules">
                  <el-form-item class="bordno"
                                prop="type">
                    <el-checkbox-group v-model="fromDate.type">
                      <el-checkbox label="微信"><img :src="addAccountimg.weixin">微信</el-checkbox>
                      <el-checkbox label="微博"><img :src="addAccountimg.weibo">微博</el-checkbox>
                      <el-checkbox label="网站"><img :src="addAccountimg.wangzhan">网站</el-checkbox>
                      <el-checkbox label="今日头条"><img :src="addAccountimg.toutiao">今日头条</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                  <el-form-item prop="number">
                    <el-input type="textarea"
                              :rows="4"
                              placeholder="请输入推荐理由"
                              v-model="fromDate.number">
                    </el-input>
                  </el-form-item>
                </el-form>
                <span slot="footer"
                      class="dialog-footer">
                  <el-button type="primary"
                             @click="setDialogText(item, index)">确 定</el-button>
                  <el-button @click="getDialog(item, index)">取 消</el-button>
                </span>
              </el-dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 微信 -->
    <div class="data-center"
         v-if="this.type === 'wx'">
      <div class="account-detail">
        <div>
          <div class="head-img"
               :style="{ 'backgroundImage': 'url(' + accountDetail.avatar + ')' }">
          </div>
        </div>
        <div>
          <h2>{{accountDetail.nickname}}</h2>
          <span class="sizin">
            <i>微信号：</i>
            <span class="color-blue">{{accountDetail.name}}</span>
          </span>
          <span class="sizin">
            <i>地区:</i>
            <span class="color-blue">{{accountDetail.province}}</span>
          </span>
          <p>{{accountDetail.uint}}</p>
          <!-- <el-button size="mini"
                     class='active'
                     v-if="accountDetail.createStatus === 1"
                     @click="cancelActive">取消星标</el-button>
          <el-button size="mini"
                     class='active2'
                     v-else
                     @click="addlActive">添加星标</el-button> -->
        </div>
      </div>
      <!-- 微信内容列表 -->
      <div class="data-out-list">
        <div class="data-center-list">
          <div class="data-page"
               v-for="(item,index) in centerList"
               :key="index">
            <div class="list-left">
              <img :src="item.article.cover"
                   v-if="item.article.cover">
              <img v-else
                   :src="require('@/assets/images/default.jpg')"
                   alt="">
            </div>
            <div class="list-right">
              <!-- <div class="list-user">
                <div class="head-image"
                     :style="{ 'backgroundImage': 'url(' + item.article.picurl + ')' }">
                </div>
                <span class="user-name">{{item.nickname}}</span>
              </div> -->
              <div class="list-title">
                <h2 @click="Websock(item.article,index)"
                    v-html="item.article.title"></h2>
              </div>
              <div class="list-cont wx-cont lin-clamp-3"
                   v-if="item.article.synopsis"
                   @click="Websock(item.article,index)"
                   v-html="item.article.synopsis"></div>
              <!-- <div v-else
                   style="height: 66px; line-height:33px">暂无内容...</div> -->
              <div class="list-see">
                <ul>
                  <li>
                    <span>发布时间:</span>
                    <p class="color-blue">{{item.article.pubtime}}</p>
                  </li>
                  <li>
                    <span>阅读数:</span>
                    <p class="color-blue">{{item.article.readnum}}</p>
                  </li>
                  <li>
                    <span>在看数:</span>
                    <p class="color-blue">{{item.article.likenum}}</p>
                  </li>
                </ul>
              </div>
            </div>
            <div class="user-dialog">
              <el-dialog :visible.sync="item.dialogVisible"
                         :modal="ismodal"
                         @close="getDialog(item, index)"
                         center
                         width="30%">
                <el-form :model="fromDate"
                         ref="fromDate"
                         :rules="rules">
                  <el-form-item class="bordno"
                                prop="type">
                    <el-checkbox-group v-model="fromDate.type">
                      <el-checkbox label="微信"><img :src="addAccountimg.weixin">微信</el-checkbox>
                      <el-checkbox label="微博"><img :src="addAccountimg.weibo">微博</el-checkbox>
                      <el-checkbox label="网站"><img :src="addAccountimg.wangzhan">网站</el-checkbox>
                      <el-checkbox label="今日头条"><img :src="addAccountimg.toutiao">今日头条</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                  <el-form-item prop="number">
                    <el-input type="textarea"
                              :rows="4"
                              placeholder="请输入推荐理由"
                              v-model="fromDate.number">
                    </el-input>
                  </el-form-item>
                </el-form>
                <span slot="footer"
                      class="dialog-footer">
                  <el-button type="primary"
                             @click="setDialogText(item, index)">确 定</el-button>
                  <el-button @click="getDialog(item, index)">取 消</el-button>
                </span>
              </el-dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 网站 -->
    <div class="data-center"
         v-if="this.type === 'website'">
      <div class="account-detail">
        <div>
          <el-image :src="require('@/assets/images/gh.png')"
                    :fit="'fill'"
                    lazy
                    class="head-img"></el-image>
        </div>
        <div>
          <h2>{{accountDetail.name}}</h2>
          <span class="sizin">
            <i>所属地区:</i>
            <span class="color-blue">{{accountDetail.city}}</span>
          </span>
          <span class="sizin">
            <i>网址:</i>
            <span class="web-blank"
                  @click="checked(accountDetail.url)">{{accountDetail.url}}</span>
          </span>
        </div>
      </div>
      <!-- 网站内容列表 -->
      <div class="data-out-list">
        <div class="data-center-list">
          <div class="data-page"
               v-for="(item,index) in centerList"
               :key="index">
            <div style="width:100%">
              <div class="list-title">
                <h2 v-html="item.article.title"
                    @click="Websock(item.article,index)"></h2>
              </div>
              <div class="list-cont lin-clamp-3"
                   v-if="item.article.summary"
                   @click="Websock(item.article,index)"
                   v-html="item.article.summary"></div>
              <div v-else
                   style="height: 66px; line-height:33px"></div>
              <div class="list-see">
                <ul>
                  <li>
                    <div>
                      <span>发布时间:</span>
                    </div>
                    <div>
                      <p class="color-blue">{{item.article.publish_date}}</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div class="user-dialog">
              <el-dialog :visible.sync="item.dialogVisible"
                         :modal="ismodal"
                         @close="getDialog(item, index)"
                         center
                         width="30%">
                <el-form :model="fromDate"
                         ref="fromDate"
                         :rules="rules">
                  <el-form-item class="bordno"
                                prop="type">
                    <el-checkbox-group v-model="fromDate.type">
                      <el-checkbox label="微信"><img :src="addAccountimg.weixin">微信</el-checkbox>
                      <el-checkbox label="微博"><img :src="addAccountimg.weibo">微博</el-checkbox>
                      <el-checkbox label="网站"><img :src="addAccountimg.wangzhan">网站</el-checkbox>
                      <el-checkbox label="今日头条"><img :src="addAccountimg.toutiao">今日头条</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                  <el-form-item prop="number">
                    <el-input type="textarea"
                              :rows="4"
                              placeholder="请输入推荐理由"
                              v-model="fromDate.number">
                    </el-input>
                  </el-form-item>
                </el-form>
                <span slot="footer"
                      class="dialog-footer">
                  <el-button type="primary"
                             @click="setDialogText(item, index)">确 定</el-button>
                  <el-button @click="getDialog(item, index)">取 消</el-button>
                </span>
              </el-dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 头条 -->
    <div class="data-center"
         v-if="this.type === 'toutiao'">
      <div class="account-detail">
        <div>
          <el-image v-if="accountDetail.avatar_img"
                    :src="accountDetail.avatar_img"
                    :fit="'fill'"
                    lazy
                    class="head-img"></el-image>
          <el-image v-else
                    :src="require('@/assets/images/gh.png')"
                    :fit="'fill'"
                    lazy
                    class="head-img"></el-image>
          <!-- <el-image :src="accountDetail.headPic"
                    :fit="'fill'"
                    lazy></el-image> -->
        </div>
        <div>
          <h2>{{accountDetail.name}}</h2>
          <span class="sizin">
            <i>地区:</i>
            <span class="color-blue">{{accountDetail.province}}</span>
          </span>
          <p>{{accountDetail.verified_content}}</p>
        </div>
      </div>
      <!-- 头条内容列表 -->
      <div class="data-out-list">
        <div class="data-center-list">
          <div class="data-page"
               v-for="(item,index) in centerList"
               :key="index">
            <div class="list-left">
              <img :src="item.article.image_url"
                   v-if="item.article.image_url">
              <img v-else
                   :src="require('@/assets/images/default.jpg')"
                   alt="">
            </div>
            <div class="list-right">
              <div class="list-title">
                <h2 v-html="item.article.title"
                    @click="Websock(item.article,index)"></h2>
              </div>
              <div class="list-cont lin-clamp-3"
                   v-if="item.article.article_abstract"
                   @click="Websock(item.article,index)"
                   v-html="item.article.article_abstract"></div>
              <!-- <div v-else
                   style="height: 66px; line-height:33px">暂无内容...</div> -->
              <div class="list-see">
                <ul>
                  <li>
                    <span>发布时间:</span>
                    <p class="color-blue">{{item.article.publish_time}}</p>
                  </li>
                  <li>
                    <span>点赞数:</span>
                    <p class="color-blue">{{item.article.digg_count}}</p>
                  </li>
                  <li>
                    <span>转发数:</span>
                    <p class="color-blue">{{item.article.forward_count}}</p>
                  </li>
                  <li>
                    <span>阅读数:</span>
                    <p class="color-blue">{{item.article.read_count}}</p>
                  </li>
                  <li>
                    <span>评论数:</span>
                    <p class="color-blue">{{item.article.comment_count}}</p>
                  </li>
                </ul>
              </div>
            </div>
            <div class="user-dialog">
              <el-dialog :visible.sync="item.dialogVisible"
                         :modal="ismodal"
                         @close="getDialog(item, index)"
                         center
                         width="30%">
                <el-form :model="fromDate"
                         ref="fromDate"
                         :rules="rules">
                  <el-form-item class="bordno"
                                prop="type">
                    <el-checkbox-group v-model="fromDate.type">
                      <el-checkbox label="微信"><img :src="addAccountimg.weixin">微信</el-checkbox>
                      <el-checkbox label="微博"><img :src="addAccountimg.weibo">微博</el-checkbox>
                      <el-checkbox label="网站"><img :src="addAccountimg.wangzhan">网站</el-checkbox>
                      <el-checkbox label="今日头条"><img :src="addAccountimg.toutiao">今日头条</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                  <el-form-item prop="number">
                    <el-input type="textarea"
                              :rows="4"
                              placeholder="请输入推荐理由"
                              v-model="fromDate.number">
                    </el-input>
                  </el-form-item>
                </el-form>
                <span slot="footer"
                      class="dialog-footer">
                  <el-button type="primary"
                             @click="setDialogText(item, index)">确 定</el-button>
                  <el-button @click="getDialog(item, index)">取 消</el-button>
                </span>
              </el-dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 抖音 -->
    <div class="data-center"
         v-if="this.type === 'douyin'">
      <div class="account-detail">
        <div>
          <div class="douyin-img"
               :style="{ 'backgroundImage': 'url(' + accountDetail.avatar_img + ')' }">
          </div>
        </div>
        <div>
          <h2>{{accountDetail.nickname}}</h2>
          <span class="sizin">
            <i>抖音号：</i>
            <span class="color-blue">{{accountDetail.uid}}</span>
          </span>
          <span class="sizin">
            <i>地区:</i>
            <span class="color-blue">{{accountDetail.province}}</span>
          </span>
          <p>{{accountDetail.synopsis}}</p>
        </div>
      </div>
      <!-- 抖音内容列表 -->
      <div class="data-out-list">
        <div class="data-center-douyin">
          <div class="douyin-page"
               v-for="(item,index) in centerList"
               :key="index">
            <!-- 抖音 -->
            <div class="douyin-right">
              <div class="douyin-cont"
                   v-if="item.video.cover_url">
                <el-image :src="item.video.cover_url"
                          fit="cover"
                          @click="Websock(item.video)"></el-image>
                <div class="douyin-title"
                     @click="Websock(item.video)">
                  {{item.video.video_desc}}
                </div>
                <div class="douyin-see">
                  <ul class="see-left">

                    <li>
                      <p class="color-blue">
                        <img :src="require('@/assets/images/allmonit/xin.png')">
                        <span>{{item.video.digg_count}}</span></p>
                    </li>
                    <li>
                      <p class="color-blue">
                        <img :src="require('@/assets/images/allmonit/pinglun.png')">
                        <span>{{item.video.comment_count}}</span>
                      </p>
                    </li>
                    <li>
                      <p class="color-blue">
                        <img :src="require('@/assets/images/allmonit/zhuanfa.png')">
                        <span>{{item.video.forward_count}}</span></p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="user-dialog">
              <el-dialog :visible.sync="item.dialogVisible"
                         :modal="ismodal"
                         @close="getDialog(item, index)"
                         center
                         width="30%">
                <el-form :model="fromDate"
                         ref="fromDate"
                         :rules="rules">
                  <el-form-item class="bordno"
                                prop="type">
                    <el-checkbox-group v-model="fromDate.type">
                      <el-checkbox label="微信"><img :src="addAccountimg.weixin">微信</el-checkbox>
                      <el-checkbox label="微博"><img :src="addAccountimg.weibo">微博</el-checkbox>
                      <el-checkbox label="网站"><img :src="addAccountimg.wangzhan">网站</el-checkbox>
                      <el-checkbox label="今日头条"><img :src="addAccountimg.toutiao">今日头条</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                  <el-form-item prop="number">
                    <el-input type="textarea"
                              :rows="4"
                              placeholder="请输入推荐理由"
                              v-model="fromDate.number">
                    </el-input>
                  </el-form-item>
                </el-form>
                <span slot="footer"
                      class="dialog-footer">
                  <el-button type="primary"
                             @click="setDialogText(item, index)">确 定</el-button>
                  <el-button @click="getDialog(item, index)">取 消</el-button>
                </span>
              </el-dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 一点 -->
    <div class="data-center"
         v-if="this.type === 'yidian'">
      <div class="account-detail">
        <div>
          <el-image v-if="accountDetail.channel_cover"
                    :src="accountDetail.channel_cover"
                    :fit="'fill'"
                    lazy
                    class="head-img"></el-image>
          <el-image v-else
                    :src="require('@/assets/images/gh.png')"
                    :fit="'fill'"
                    lazy
                    class="head-img"></el-image>
          <!-- <el-image :src="accountDetail.headPic"
                    :fit="'fill'"
                    lazy></el-image> -->
        </div>
        <div>
          <h2>{{accountDetail.media_name}}</h2>
          <span class="sizin">
            <i>一点号：</i>
            <span class="color-blue">{{accountDetail.channel_id}}</span>
          </span>
          <span class="sizin">
            <i>地区:</i>
            <span class="color-blue">{{accountDetail.province}}</span>
          </span>
          <p>{{accountDetail.unit_name}}</p>
        </div>
      </div>
      <!-- 一点内容列表 -->
      <div class="data-out-list">
        <div class="data-center-list">
          <div class="data-page"
               v-for="(item,index) in centerList"
               :key="index">
            <div class="list-left">
              <img :src="item.article.image_url"
                   v-if="item.article.image_url">
              <img v-else
                   :src="require('@/assets/images/default.jpg')"
                   alt="">
            </div>
            <div class="list-right">
              <div class="list-title">
                <h2 v-html="item.article.title"
                    @click="Websock(item.article,index)"></h2>
              </div>
              <div class="list-cont lin-clamp-3"
                   v-if="item.article.summary"
                   @click="Websock(item.article,index)"
                   v-html="item.article.summary"></div>
              <!-- <div v-else
                   style="height: 66px; line-height:33px">暂无内容...</div> -->
              <div class="list-see">
                <ul>
                  <li>
                    <span>发布时间:</span>
                    <p class="color-blue">{{item.article.publish_time}}</p>
                  </li>
                  <!-- <li>
                    <span>评论数:</span>
                    <p class="color-blue">{{item.article.comment_count}}</p>
                  </li>
                  <li>
                    <span>点赞数:</span>
                    <p class="color-blue">{{item.article.like_count}}</p>
                  </li>
                  <li>
                    <span>转发数:</span>
                    <p class="color-blue">{{item.article.down_count}}</p>
                  </li> -->
                </ul>
              </div>
            </div>
            <div class="user-dialog">
              <el-dialog :visible.sync="item.dialogVisible"
                         :modal="ismodal"
                         @close="getDialog(item, index)"
                         center
                         width="30%">
                <el-form :model="fromDate"
                         ref="fromDate"
                         :rules="rules">
                  <el-form-item class="bordno"
                                prop="type">
                    <el-checkbox-group v-model="fromDate.type">
                      <el-checkbox label="微信"><img :src="addAccountimg.weixin">微信</el-checkbox>
                      <el-checkbox label="微博"><img :src="addAccountimg.weibo">微博</el-checkbox>
                      <el-checkbox label="网站"><img :src="addAccountimg.wangzhan">网站</el-checkbox>
                      <el-checkbox label="今日头条"><img :src="addAccountimg.toutiao">今日头条</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                  <el-form-item prop="number">
                    <el-input type="textarea"
                              :rows="4"
                              placeholder="请输入推荐理由"
                              v-model="fromDate.number">
                    </el-input>
                  </el-form-item>
                </el-form>
                <span slot="footer"
                      class="dialog-footer">
                  <el-button type="primary"
                             @click="setDialogText(item, index)">确 定</el-button>
                  <el-button @click="getDialog(item, index)">取 消</el-button>
                </span>
              </el-dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="dataNull"
         class="text-center">
      <img :src="require('@/assets/images/empty-data.png')">
    </div>
    <!-- 选择文件夹 -->
    <div class="user-dialog">
      <el-dialog :visible.sync="starVisible"
                 :modal="ismodal"
                 @close="getStars()"
                 center
                 width="30%">
        <span>请选择文件夹:</span>
        <el-select v-model="value"
                   placeholder="请选择"
                   size="small"
                   @change="disableds">
          <el-option v-for="item in options"
                     :key="item.id"
                     :label="item.folder_name"
                     :value="item.id">
          </el-option>
        </el-select>
        <span slot="footer"
              class="dialog-footer">
          <el-button type="primary"
                     @click="setDialog()"
                     :disabled="openIsDisabled">确 定</el-button>
          <el-button @click="getStars()">取 消</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 暂无用户信息 -->
    <scroll-data @getData="getData"
                 :dataLess="dataLess"></scroll-data>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import ScrollData from '@/components/ScrollData'
export default {
  props: ['message'],
  data () {
    return {
      dataNull: false,
      fromDate: {
        type: [],
        number: '',
        name: ''
      },
      dataLess: false,
      openIsDisabled: true,
      options: [],
      rules: {
        type: [
          { required: true, message: '请选择账号类型', trigger: 'change' }
        ]
      },
      addAccountimg: {
        weixin: require('@/assets/images/dataimg/u5586.png'),
        weibo: require('@/assets/images/dataimg/u1770.png'),
        wanzhan: require('@/assets/images/dataimg/u5607.png'),
        toutiao: require('@/assets/images/dataimg/u1766.png')
      },
      userData: {
        sortDirection: '',
        sortField: '',
        pageNum: 1,
        pageSize: 20
      },
      parameter: {},
      type: '',
      ids: '', // 类型 1:微信,2微博,3网站
      value: '',
      checkOne: false,
      checkTwo: false,
      titleimg: require('@/assets/images/dataimg/tuijian.png'),
      dialogVisible: false, // 回复弹框
      starVisible: false, // 选择文件弹框
      ismodal: false, // 遮罩
      centerList: [],
      accountDetail: {}
    }
  },
  methods: {
    // 获取数据位置
    getRouterData () {
      // 个人账户详情
      if (this.type === 'wb') {
        // 微博个人信息
        this.$http.get(`${this.$api.wbById}/${this.userData.id}`)
          .then(res => {
            if (res.data.code === 200 && res.data.data) {
              this.accountDetail = res.data.data.list[0]
            }
          })
          .catch(() => {
          })
        // 微博个人文章列表
        this.$http.post(this.$api.wbPersonNews, this.userData)
          .then(res => {
            if (res.data.code === 200 && res.data.data) {
              this.centerList.push(...res.data.data.list)
              if (res.data.data.list.length < 20) {
                this.dataLess = true
              }
            } else {
              this.centerList = []
              this.dataNull = true
            }
          })
          .catch(() => {

          })
      } else if (this.type === 'wx') {
        // 微信个人信息
        this.$http.get(`${this.$api.wxById}/${this.userData.id}`)
          .then(res => {
            if (res.data.code === 200 && res.data.data) {
              this.accountDetail = res.data.data.list[0]
            } else {
              this.$message.error(res.data.message)
            }
          })
          .catch(() => {
          })
        // 微信个人文章列表
        this.$http.post(this.$api.wxPersonNews, this.userData)
          .then(res => {
            if (res.data.code === 200 && res.data.data) {
              this.centerList.push(...res.data.data.list)
              this.centerList.forEach(item => {
                item.article.title = item.article.title.replace(/&amp;lt;/g, '《').replace(/&amp;gt;/g, '》')
                if (item.article.likenum === null) {
                  item.article.likenum = 0
                }
                if (item.article.readnum === null) {
                  item.article.readnum = 0
                }
              })
              if (res.data.data.list.length < 20) {
                this.dataLess = true
              }
            } else {
              this.centerList = []
              this.dataNull = true
            }
          })
          .catch(() => {
          })
      } else if (this.type === 'website') {
        // 网站个人信息
        this.$http.get(`${this.$api.wzById}/${this.userData.id}`)
          .then(res => {
            if (res.data.code === 200 && res.data.data) {
              this.accountDetail = res.data.data.list[0]
            } else {
              this.$message.error(res.data.message)
            }
          })
          .catch(() => {
          })
        // 网站个人文章列表
        this.$http.post(this.$api.wzPersonNews, this.userData)
          .then(res => {
            if (res.data.code === 200 && res.data.data) {
              this.centerList.push(...res.data.data.list)
              if (res.data.data.list.length < 20) {
                this.dataLess = true
              }
            } else {
              this.centerList = []
              this.dataNull = true
            }
          })
          .catch(() => {
          })
      } else if (this.type === 'toutiao') {
        // 头条个人信息
        this.$http.get(`${this.$api.ttById}/${this.userData.id}`)
          .then(res => {
            if (res.data.code === 200 && res.data.data) {
              this.accountDetail = res.data.data.list[0]
            }
          })
          .catch(() => {
          })
        // 头条个人文章列表
        this.$http.post(this.$api.ttPersonNews, this.userData)
          .then(res => {
            if (res.data.code === 200 && res.data.data) {
              this.centerList.push(...res.data.data.list)
              if (res.data.data.list.length < 20) {
                this.dataLess = true
              }
            }
          })
          .catch(() => {
          })
      } else if (this.type === 'douyin') {
        // 抖音个人信息
        this.$http.get(`${this.$api.dyById}/${this.userData.id}`)
          .then(res => {
            if (res.data.code === 200 && res.data.data) {
              this.accountDetail = res.data.data.list[0]
            } else {
              this.$message.error(res.data.message)
            }
          })
          .catch(() => {
          })
        // 抖音个人文章列表
        this.$http.post(this.$api.dyPersonNews, this.userData)
          .then(res => {
            if (res.data.code === 200 && res.data.data) {
              this.centerList.push(...res.data.data.list)
              if (res.data.data.list.length < 20) {
                this.dataLess = true
              }
              this.centerList.forEach(item => {
                if (item.like > 10000) {
                  item.like = item.like / 1000 + 'w'
                }
                if (item.comment > 10000) {
                  item.comment = item.comment / 1000 + 'w'
                }
                if (item.transmit > 10000) {
                  item.transmit = item.transmit / 1000 + 'w'
                }
                item.cover = item.cover.replace(/jpeg/, 'jpg')
              })
            } else {
              this.centerList = []
              this.dataNull = true
            }
          })
          .catch(() => {
          })
      } else if (this.type === 'yidian') {
        // 一点个人信息
        this.$http.get(`${this.$api.ydById}/${this.userData.id}`)
          .then(res => {
            if (res.data.code === 200 && res.data.data) {
              this.accountDetail = res.data.data.list[0]
            }
          })
          .catch(() => {
          })
        // 一点个人文章列表
        this.userData.jrttId = this.userData.id
        this.$http.post(this.$api.ydPersonNews, this.userData)
          .then(res => {
            if (res.data.code === 200 && res.data.data) {
              this.centerList.push(...res.data.data.list)
              this.centerList.forEach(item => {
                item.dialogVisible = this.dialogVisible
              })
              if (res.data.data.list.length < 20) {
                this.dataLess = true
              }
            }
          })
          .catch(() => {
          })
      }
    },
    // 取消星标
    cancelActive () {
      this.accountDetail.createStatus = 0
      if (this.type === 'wb') {
        this.$http.get(this.$api.updateCreate, { params: { wbId: this.accountDetail.wbid, createStatus: 0, folderId: this.accountDetail.folderId } })
          .then(res => {
            if (res.data.code === 200) {
              this.$message.success(res.data.message)
            }
          })
          .catch(() => {
          })
      } else if (this.type === 'wx') {
        this.$http.get(this.$api.wxCreate, { params: { wxId: this.accountDetail.wxid, createStatus: 0, folderId: this.accountDetail.folderId } })
          .then(res => {
            if (res.data.code === 200) {
              this.$message.success(res.data.message)
            }
          })
      } else if (this.type === 'website') {
        this.$http.get(this.$api.wzCreate, { params: { wzId: this.accountDetail.eid, createStatus: 0, folderId: this.accountDetail.folderId } })
          .then(res => {
            if (res.data.code === 200) {
              this.$message.success(res.data.message)
            }
          })
      } else if (this.type === 'toutiao') {
        this.$http.get(this.$api.tdCreate, { params: { jrttId: this.accountDetail.jrttId, createStatus: 0, folderId: this.accountDetail.folderId } })
          .then(res => {
            if (res.data.code === 200) {
              this.$message.success(res.data.message)
            }
          })
      }
    },
    // 获取文章点击
    Websock (item, index) {
      console.log(item)
      if (item.content_url) {
        window.open(item.content_url, '_blank')
      } else if (item.article_url) {
        window.open(item.article_url, '_blank')
      } else if (item.video_url) {
        window.open(item.video_url, '_blank')
      } else if (item.source_url) {
        window.open(item.source_url, '_blank')
      } else if (item.url) {
        window.open(item.url, '_blank')
      } else {
        this.$message.warning('链接为空,')
      }
    },
    // 排序
    sort (item, index) {
      if (item.standard === '1') {
        item.standard = '2'
      } else if (item.standard === '2') {
        item.standard = '3'
      } else {
        item.standard = '1'
      }
    },
    disableds () {
      if (this.value) {
        this.openIsDisabled = false
      }
    },
    // 网站外部
    checked (url) {
      window.open(url, '_blank')
    },
    // 弹窗
    getDialog (item, index) {
      item.dialogVisible = false
      this.$set(this.centerList, index, item)
    },
    // 推荐
    setDialogText (item, index) {
      this.$set(this.centerList, index, item)
      let listcread = {
        suitRange: this.dynamicValidateForm.type1.toString(),
        adviseReason: this.dynamicValidateForm.number
      }
      if (this.type === 'wx') {
        listcread.articleId = item.wxid
      } else if (this.type === 'wb') {
        listcread.articleId = item.wbid
      } else if (this.type === 'website') {
        listcread.articleId = item.eid
      } else if (this.type === 'toutiao') {
        listcread.articleId = item.id
        item.content = item.title // 标题
      }
      listcread.articleSummary = item.content.substring(0, 100) // 摘要
      listcread.articleTitle = item.title // 标题
      listcread.externalUrl = item.contenturl // 稿件外部链接
      if (listcread.suitRange) {
        this.$http.post(this.$api.adviseExternal, listcread)
          .then(res => {
            if (res.data.code === 200) {
              item.dialogVisible = false
              this.$message.success(res.data.message)
              this.$router.push({ name: 'TeamMessage' })
            }
          })
          .catch(() => {
          })
      } else {
        this.$message.success('选择账号类型')
      }
    },
    showTeamDialog (item, index) {
      item.dialogVisible = true
      this.$set(this.centerList, index, item)
    },
    // 添加星标
    modifyStar () {
      this.parameter.folderId = this.value
      this.$http.get(this.starApi, { params: this.parameter })
        .then(res => {
          if (res.data.code === 200) {
            this.accountDetail.createStatus = 1
            this.$message.success(res.data.message)
          }
        })
        .catch(() => {
        })
    },
    // 点击添加星标
    addlActive () {
      this.starVisible = true
      this.createStatus = 1
      switch (this.type) {
        case 'wb':
          this.ids = 2
          this.starApi = this.$api.updateCreate
          this.parameter.wbId = this.accountDetail.wbId
          this.parameter.createStatus = this.createStatus
          break
        case 'wx':
          this.ids = 1
          this.starApi = this.$api.wxCreate
          this.parameter.wxId = this.accountDetail.wxid
          this.parameter.createStatus = this.createStatus
          break
        case 'website':
          this.ids = 3
          this.starApi = this.$api.wzCreate
          this.parameter.wzId = this.accountDetail.eid
          this.parameter.createStatus = this.createStatus
          break
        case 'td':
          this.ids = 4
          this.starApi = this.$api.tdCreate
          this.parameter.jrttId = this.accountDetail.jrttId
          this.parameter.createStatus = this.createStatus
          break
      }
      this.getFolder()
    },
    // 获取文件夹信息
    getFolder () {
      this.$http.get(this.$api.showFolderById, { params: { type: this.ids } })
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.options = res.data.data
          }
        })
        .catch(() => {
        })
    },
    // 确定
    setDialog () {
      this.starVisible = false
      this.modifyStar()
    },
    getStars () { this.starVisible = false },
    // 下拉加载
    getData () {
      this.userData.pageNum++
      this.getRouterData()
    }
  },
  computed: {
    ...mapState({
      loading: state => state.mutations.loading
    })
  },
  components: {
    ScrollData
  },
  created () {
    this.type = this.$route.query.type
    this.userData.id = this.$route.query.id
    this.getRouterData()
  },
  watch: {
    $route () {
      this.type = this.$route.query.type
      this.userData.id = this.$route.query.id
      this.getRouterData()
    }
  }
}
</script>
<style scoped>
.data-center {
  box-sizing: border-box;
  padding: 20px;
}
.data-out-list {
  overflow: hidden;
  width: 1069px;
}
.data-center-list {
  width: 1069px;
  margin-top: 10px;
}

.user-dialog .data-page {
  top: 0px;
}
.user-dialog .el-checkbox-group img {
  vertical-align: middle;
  margin-right: 13px;
}
.data-center-list .data-page {
  border-bottom: 1px solid #ccc;
  margin-bottom: 16px;
  position: relative;
  margin-right: 12px;
  display: flex;
}
/* .list-left {
  width: 255px;
  height: 168px;
  margin-right: 29px;
}
.list-left img {
  max-width: 100%;
  max-height: 100%;
  display: block;
  margin: auto;
} */
.list-left {
  margin-right: 29px;
}
.list-left img {
  width: 255px;
  height: 168px;
}
.list-right {
  width: 74%;
}
.list-title {
  overflow: hidden;
}
.list-title h2 {
  width: 90%;
  height: 20px;
  font-size: 20px;
  font-weight: bold;
  color: #333;
  float: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}
.wx-cont{
  height: 110px;
}
.list-cont {
  max-height: 110px;
  min-height: 60px;
  text-align: left;
  text-indent: 28px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 22px;
  margin: 10px 0;
  padding-right: 20px;
  cursor: pointer;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  position: relative;
}
.list-user {
  display: flex;
  margin-bottom: 10px;
  line-height: 32px;
}
.list-user .el-image {
  border-radius: 50%;
  margin-top: 5px;
}
.list-user .user-name {
  font-weight: 400;
  text-decoration: underline;
  color: rgba(56, 117, 240, 1);
  line-height: 32px;
  cursor: pointer;
}
.list-see {
  overflow: hidden;
}
.list-see .user-name {
  text-decoration: underline;
  color: rgba(56, 117, 240, 1);
  cursor: pointer;
}
.list-user span {
  display: inline-block;
  font-size: 15px;
  font-weight: 400;
  color: rgba(175, 175, 175, 1);
  line-height: 32px;
  margin-left: 10px;
}
.data-center .list-see ul {
  margin-right: 10px;
  display: flex;
  margin-bottom: 20px;
}
.data-center .list-see ul li {
  display: flex;
  color: #aaaaaa;
}
.list-see p {
  font-size: 14px;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
  line-height: 18px;
  margin-left: 7px;
}
.data-center .list-see ul li:nth-of-type(2) img {
  margin-top: -2px;
}
.list-title i {
  float: right;
  padding-right: 26px;
  cursor: pointer;
}
.account-detail {
  overflow: hidden;
  font-size: 15px;
  margin-bottom: 20px;
}
.account-detail div img {
  width: 104px;
  height: 104px;
  border-radius: 50%;
  margin: 12px 35px 0 27px;
}
.account-detail div {
  float: left;
}
.account-detail div h2 {
  font-size: 25px;
  font-weight: bold;
  color: rgba(56, 117, 240, 1);
  line-height: 25px;
  cursor: pointer;
  height: 25px;
  margin: 10px 0;
}
.account-detail div i {
  letter-spacing: 5px;
  font-style: normal;
}
.account-detail div .sizin {
  display: block;
  font-size: 15px;
  font-weight: 400;
  color: rgba(175, 175, 175, 1);
  line-height: 32px;
}
.account-detail div p {
  /* width: 230px; */
  font-weight: 400;
  color: rgba(175, 175, 175, 1);
  line-height: 20px;
}
.account-detail div a {
  width: 76px;
  font-weight: 400;
  color: rgba(29, 142, 228, 1);
  line-height: 32px;
  /* height: 15px; */
  margin-bottom: 17px;
  margin-right: 10px;
}
.account-detail div .el-button {
  border: none;
  line-height: 22px;
  font-size: 12px;
  border-radius: 5px;
  font-weight: bold;
  margin: 10px 0;
  cursor: pointer;
  padding: 2px 10px;
}
.account-detail div .active {
  background-color: #6db8ef;
  color: #fff;
}
.account-detail div .active2 {
  background-color: #cbcbcb;
  color: #fff;
}
.account-detail .head-img {
  width: 80px;
  height: 80px;
  overflow: hidden;
  position: relative;
  border-radius: 50%;
  margin-right: 20px;
  background-position: center;
}
.account-detail .douyin-img {
  width: 80px;
  height: 80px;
  overflow: hidden;
  position: relative;
  border-radius: 50%;
  margin-right: 20px;
  background-position: center;
  background-size: 80px;
}
.list-user .head-image {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-top: 0px;
  overflow: hidden;
  background-position: center;
  background-size: 145px;
}
.list-see .color-blue {
  color: #309ade;
}
.data-center-douyin {
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
  scrollbar-width: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.douyin-right {
  cursor: pointer;
}
.data-center-douyin .douyin-page {
  width: 23%;
  top: 0px;
  overflow: hidden;
  margin-bottom: 16px;
  position: relative;
  margin-right: 12px;
  display: flex;
}
.douyin-title {
  width: 84%;
  position: absolute;
  color: #fff;
  bottom: 25px;
  font-size: 14px;
  line-height: 20px;
  padding: 5px;
  box-sizing: border-box;
}
.douyin-see {
  width: 40px;
  padding: 5px;
  position: absolute;
  bottom: 3px;
  right: 0px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  display: flex;
}
.douyin-see li {
  height: 60px;
}
.douyin-see .color-blue img {
  display: block;
  width: 30px;
  height: 30px;
}
.douyin-see .header-img {
  height: 50px;
}
.douyin-see .header-img .color-blue img {
  border-radius: 50%;
}
.douyin-see li .color-blue span {
  display: block;
  text-align: center;
  margin-top: 5px;
}
.hover-con {
  position: absolute;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  padding: 5px;
}
.hover-con p {
  line-height: 20px;
}
.see-right p {
  height: 40px;
  line-height: 40px;
}
.data-center-douyin {
  width: 100%;
  margin-top: 10px;
  min-height: 400px;
  overflow-x: hidden;
  overflow-y: scroll;
}
.data-center-douyin::-webkit-scrollbar {
  display: none;
}
.data-center-douyin {
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
  scrollbar-width: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.web-blank {
  color: #309ade;
  text-decoration: underline;
  cursor: pointer;
}
</style>
