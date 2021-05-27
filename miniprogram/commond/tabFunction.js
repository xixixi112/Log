/*
    切换方法的封装
    参数一:样式参数
    参数二:滑动swiper下标
*/
function tabComper(styles,index = 0){
  styles.map((val,key) =>{
        if(key == index){
          return styles[key].class = 'icon';
        }else{
          return styles[key].class = '';
        }
  })
  //返回对象
  return{
      index,
      styles
  };


}
//小程序 导出
module.exports ={
  tabComper : tabComper
}