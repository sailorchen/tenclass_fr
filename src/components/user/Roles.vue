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
<!-- <el-form-item label="测试环境" prop="env" >
      <el-select v-model="runForm.env" clearable placeholder="请选择测试环境">
<el-option
      v-for="item in envs"
      :key="item.env"
      :label="item.label"
      :value="item.env">
    </el-option>
  </el-select>
  </el-form-item> --> 

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

  <el-form-item label="测试店铺" prop="shop_id">
      <el-select v-model="runForm.shop_id" clearable placeholder="请选择测试店铺">
    <el-option
      v-for="item in shops"
      :key="item.shop_id"
      :label="item.shop_label"
      :value="item.shop_id">
    </el-option>
  </el-select>
  </el-form-item>

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
  :rows='3'
  v-model="src_desc"
  :disabled="true">
</el-input>
  </el-form-item>
  
   <el-form-item>
    <el-button type="primary" @click="create_src">运行</el-button>
  </el-form-item>
 </el-form>
</div>
</template>
<script>
export default {
  // 进入页面调用
    created () {
      // 获取店铺信息
        //  this.get_shop('stage')
        // this.runForm.shop_id = this.shops[0].shop_id
      // 获取脚本信息
        this.get_src()
    },
    data () {
        return {
          // 运行表单参数
          runForm: {
            'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjdXJyZW50LXVzZXIiOiIwOjExODrpmYjomY4iLCJleHAiOjE2MjY2MTY3Njh9.YhAjA-rZQ0WT6fa4WbNvNhvpjpoUKPAEBbAaYSgHmm0',
            'env': '',
            'shop_id': '',
            'src_name': ''
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
            shopValue: {}
        }
    },
    methods: {
      // 运行脚本请求
      create_src() {
        this.$refs.runFormRef.validate(valid =>{
            if (!valid) return 
            console.log(this.runForm)
            var env = this.runForm.env
            var shop = this.runForm.shop_id
            var token = this.runForm.token
            var src = this.runForm.src_name
            this.$http.post('/run_src',this.runForm)
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
        this.runForm.shop_id = ''
      }
    }
    
}
</script>
<style lang="less" scoped>

</style>