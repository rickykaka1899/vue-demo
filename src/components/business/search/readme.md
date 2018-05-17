#按钮类型 #
一、组件属性：
1、searchCallBack
返回搜索的input的value值的回调
2、searchVal
input的value值
3、focusStatus
是否获取焦点
4、placeholder
默认文字
5、disabled
通过添加disabled属性可设置为不可用状态。

二、调用方式：
<search placeholder="搜索应用" searchVal="刘洪彬" focusStatus="true" :searchCallBack="searchCallBack" disabled="true"></search>
