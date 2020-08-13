// eslint-disable-next-line no-unused-vars
const app = new Vue({
  el: "#app",
  data: {
    alldata: [], //所有项目信息
    pageAlldata: [], //分页后当前页的所有项目信息
    baseURL: "http://127.0.0.1:8000/",
    inputStr: "", //输入的查询条件
    value: "",

    //====分页相关变量====//
    total: 0, //数据总行数
    currentpage: 1, //当前所在的页
    pagesize: 5 //每页显示行数
  },
  //====Select选择器====//

  //自动加载数据
  mounted() {
    this.getalldata();
  },
  methods: {
    //获取所有项目信息
    getalldata: function() {
      //记录this的地址
      let that = this;
      //使用Axios实现Ajax请求
      // eslint-disable-next-line no-undef
      axios
        .get(that.baseURL + "alldata/")
        .then(function(res) {
          //请求成功后执行的函数
          if (res.data.code === 1) {
            //把数据传给alldata
            that.alldata = res.data.data;
            //获取返回记录的总行数
            that.total = res.data.data.length;
            //获取当前页的数据
            that.getpageAlldata();
            //提示:
            that.$message({
              message: "数据加载成功！",
              type: "success"
            });
          } else {
            //失败的提示：
            that.$message.error(res.data.msg);
          }
        })
        .catch(function(err) {
          //请求失败后执行的函数
          console.log(err);
        });
    },
    //获取当前页的项目信息
    getpageAlldata() {
      //清空数据
      this.pageAlldata = [];
      //获得当前页的数据
      for (
        let i = (this.currentpage - 1) * this.pagesize;
        i < this.total;
        i++
      ) {
        //遍历数据添加到pageAlldata中
        this.pageAlldata.push(this.alldata[i]);
        //判断是否到一页的要求
        if (this.pageAlldata.length === this.pagesize) break;
      }
    },
    //实现项目条件信息查询
    queryData() {
      //使用ajax请求--POST-->传递inputStr
      let that = this;
      //开始ajax请求
      axios
        .post(that.baseURL + "alldata/query/", {
          query_value: that.query_value,
          inputStr: that.inputStr
        })
        .then(function(res) {
          //请求成功后执行的函数
          if (res.data.code === 1) {
            that.alldata = res.data.data;
            //获取返回记录的总行数
            that.total = res.data.data.length;
            //获取当前页的数据
            that.getpageAlldata();
            //提示:
            that.$message({
              message: "查询数据加载成功！",
              type: "success"
            });
          } else {
            //查询失败提示
            that.$message.error(res.data.msg);
          }
        })
        .catch(function(err) {
          console.log(err);
          that.$message.error("获取后端查询结果异常！");
        });
    },

    //分页时修改每页的行数
    handleSizeChange(size) {
      //修改当前每页数据的行数
      this.pagesize = size;
      //数据重新分页
      this.getpageAlldata();
    },
    //调整当前的页码
    handleCurrentChange(pageNumber) {
      this.currentpage = pageNumber;
      //数据重新分页
      this.getpageAlldata();
    }
  }
});
