<template>
<div>
    <!-- 导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>课程管理</el-breadcrumb-item>
    <el-breadcrumb-item>引流课</el-breadcrumb-item>
    </el-breadcrumb>

<!-- 表单区域 -->
 <el-form ref="runFormRef" :model="runForm" :rules="runRule" label-width="80px">

  <el-row :gutter="20">
  <el-col :span="6">
    <div class="grid-content bg-purple">
      <el-form-item label="测试环境" prop="env">
      <el-select v-model="shopValue" value-key="id" clearable placeholder="请选择测试环境" @change="changeshop">
<el-option
      v-for="(item,index)  in envs"
      :key="item.id"
      :label="item.label"
      :value="item">
    </el-option>
  </el-select>
  </el-form-item>
    </div>
  </el-col>
  <el-col :span="6">
    <div class="grid-content bg-purple">
        <el-form-item label="测试店铺" prop="shop">
      <el-select v-model="runForm.shop" clearable placeholder="请选择测试店铺">
    <el-option
      v-for="item in shops"
      :key="item.shop"
      :label="item.shop_label"
      :value="item.shop">
    </el-option>
  </el-select>
  </el-form-item>
      </div></el-col>
</el-row>
<!-- 
<el-form-item label="测试环境" prop="env">
      <el-select v-model="shopValue" value-key="id" clearable placeholder="请选择测试环境" @change="changeshop">
<el-option
      v-for="(item,index)  in envs"
      :key="item.id"
      :label="item.label"
      :value="item">
    </el-option>
  </el-select>
  </el-form-item>

  <el-form-item label="测试店铺" prop="shop">
      <el-select v-model="runForm.shop" clearable placeholder="请选择测试店铺">
    <el-option
      v-for="item in shops"
      :key="item.shop"
      :label="item.shop_label"
      :value="item.shop">
    </el-option>
  </el-select>
  </el-form-item> -->

    <el-form-item label="token" prop="token">
  <el-input
    placeholder="请输入token"
  v-model="runForm.token"
  clearable>
</el-input>
  </el-form-item>
<!-- 
  <el-form-item label="运行脚本" prop="src_name">
<el-select v-model="runForm.src_name" clearable placeholder="请选择要运行的脚本" @change="currentSel">
    <el-option
      v-for="item in run_srcs"
      :key="item.src_name"
      :label="item.src_label"
      :value="item.src_name">
    </el-option>
  </el-select> 
  </el-form-item> -->

    <el-form-item label="运行脚本" prop="src_name">
<el-select v-model="selectValue" value-key="id" clearable placeholder="请选择要运行的脚本" @change="currentSel">
    <el-option
      v-for="(item,index) in run_srcs"
      :key="item.id"
      :label="item.src_label"
      :value="item">
    </el-option>
  </el-select> 
  </el-form-item>

  <el-form-item label="描述" prop="src_desc">
<el-input
  placeholder="使用参数"
  type='textarea'
  autosize
  v-model="src_desc"
  :disabled="true">
</el-input>
  </el-form-item>
  
  <!-- 添加参数表单项 -->
  <el-form-item
    v-for="(domain, index) in runForm.domains"
    :label="'参数' + index"
    :key="domain.key"
    :prop="'domains.' + index + '.value'"
    :rules="{
      required: true, message: '参数不能为空', trigger: 'blur'
    }"
  >
  <!-- 一行布局 -->
  <el-row :gutter="20">
  <el-col :span="6"><div class="grid-content bg-purple"><el-input v-model="domain.value" placeholder="参数格式key:value"></el-input></div></el-col>
  <el-col :span="6"><div class="grid-content bg-purple"><el-button type="danger" @click.prevent="removeDomain(domain)">删除</el-button></div></el-col>
</el-row>
  </el-form-item>

   <el-form-item>
    <el-button type="primary" @click="create_src">运行</el-button>
    <!-- 添加参数 -->
      <el-button type="primary" @click="addDomain">添加参数</el-button>
  </el-form-item>

 </el-form>

<!-- 控制台输出 -->
<el-input
  type="textarea"
  autosize
  placeholder="运行记录"
  v-model="console_text"
  :disabled="true">
</el-input>

</div>
</template>
<script>
export default {
  // 进入页面调用
    created () {
      // 获取脚本信息
        this.get_src()
    },
    data () {
        return {
          // 运行表单参数
          runForm: {
            'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjdXJyZW50LXVzZXIiOiIwOjExODrpmYjomY4iLCJleHAiOjE2MjczMTI4NjF9.jtq4nW9-aq5h0rk3VbuavVzY8YzkBqL7RwZ6rGE7SiU',
            'env': '',
            'shop': '',
            'src_name': '',
            // 动态参数
          //   domains: [{
          //   value: ''
          // }]
          domains: []
          },
            form: {
            },
            envs: [{
              id: 1,
              env: 'https://janus.stage.tenclass.com',
              label: 'stage'
            }, {
              id: 2,
              env: 'https://janus.uat.tenclass.com',
              label: 'uat'
            }],
            // shops: [{
            //     shop_id: '00001',
            //     shop_label: '产研中台'
            // },
            // {
            //     shop_id: '00009',
            //     shop_label: '兰心'
            // }
            // ],
            // run_srcs: [{
            //     id: 1,
            //     src_name: 'create_yinliu',
            //     src_label: '创建引流录播课',
            //     src_desc: '1.创建引流录播课' + '\n' + '2.绑定微信皮肤'
            // },
            // {
            //     id: 2,
            //     src_name: 'create_camp',
            //     src_label: '创建引流训练课',
            //     src_desc: '1.创建引流训练营' + '\n' + '2.绑定微信皮肤'
            // }
            // ],
            run_srcs: [],
            shops: [],
            runRule: {
             env: [{ required: true, message: '测试环境不能为空', trigger: 'blur' }],
             shop_id: [{ required: true, message: '测试店铺不能为空', trigger: 'blur' }],
             src_name: [{ required: true, message: '测试脚本不能为空', trigger: 'blur' }],
             token: [{ required: true, message: 'token不能为空', trigger: 'blur' }]
            },
            src_desc: '',
            selectValue: {},
            shopValue: {},
            // 控制台文本
            console_text: ''
        }
    },
    methods: {
      // 运行脚本请求
        create_src() {
        this.$refs.runFormRef.validate(valid =>{
            if (!valid) return 
            // 判断是否有添加参数
            var v = this.runForm.domains.length
            if (this.runForm.domains === undefined || v <= 0){ 
             this.$http.post('run_src',this.runForm)
              // console.log(this.runForm)
              }
            else{ 
              for(let i = 0; i < this.runForm.domains.length; i++){
                  // console.log(this.runForm.domains[i].value)
                  var a1 = this.runForm.domains[i].value
                  if( a1.search(':') === -1 ){ console.log('添加参数不合法') }
                  var a2 = a1.split(':')
                  this.$set(this.runForm,a2[0],a2[1])
              }
              this.$http.post('run_src',this.runForm)
            }
            this.console_text = '运行成功'
        })
      },
      // 根据环境获取店铺信息
      async get_shop(env){
       const { data: res } = await this.$http.get('shop_list',{ params: { 'env': env } })
       if (res.code !== 200) return this.$message.error('获取店铺列表失败')
       console.log(res)
       this.shops = res.data
    },
      async get_src(){
        // 请求获取脚本信息
        const { data: res } = await this.$http.get('src_info',{ params: { 'page_name': 'yinliu' } })
         if (res.code !== 200) return this.$message.error('获取脚本信息失败')
         this.run_srcs = res.data
        //  console.log(this.run_srcs)
      },
      // 选择脚本时改变脚本描述
      currentSel(){
        // console.log(this.selectValue.src_desc)
        this.src_desc = this.selectValue.src_desc
        this.runForm.src_name = this.selectValue.src_name
      },
      // 根据店铺环境改变shops的值
      changeshop(){
        this.runForm.env = this.shopValue.env
        this.shops = this.get_shop(this.shopValue.label)
        // 清除所选的值
        this.runForm.shop = ''
      },
      // 删除动态参数
       removeDomain(item) {
        var index = this.runForm.domains.indexOf(item)
        if (index !== -1) {
          this.runForm.domains.splice(index, 1)
        }
      },
      // 动态添加参数
       addDomain() {
        this.runForm.domains.push({
          value: '',
          key: Date.now()
        })
      }
    }
    
}
</script>
<style lang="less" scoped>

</style>