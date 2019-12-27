<%--
  Created by IntelliJ IDEA.
  User: 蛟川小盆友
  Date: 2017/12/6
  Time: 13:41
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <meta charset="utf-8">
    <title>文章列表--layui后台管理模板</title>
    <meta name="renderer" content="webkit">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="format-detection" content="telephone=no">
    <link rel="stylesheet" href="../../layui/css/layui.css" media="all"/>
    <link rel="stylesheet" href="../../css/font_eolqem241z66flxr.css" media="all"/>
    <link rel="stylesheet" href="../../css/news.css" media="all"/>
</head>
<body class="childrenBody">
<blockquote class="layui-elem-quote news_search">
    <p align="left"><input type="button" onclick="window.location.reload()" value="刷新"/></p>
</blockquote>
<div class="layui-form cars_list">

    <table class="layui-table">
        <colgroup>
            <%--<col width="50">
            <col>
            <col width="9%">
            <col width="9%">
            <col width="9%">
            <col width="9%">
            <col width="9%">
            <col width="15%">--%>
            <col width="3%">
            <col width="10%">
            <col width="20%">
            <col width="9%">
            <col width="9%">
            <col width="9%">
            <col width="9%">
            <col width="5%">
        </colgroup>
        <thead>
        <tr>
            <th><input type="checkbox" name="" lay-skin="primary" lay-filter="allChoose" id="allChoose"></th>
            <th style="text-align:left;">订单ID</th>
            <th style="text-align:left;">车辆名称</th>

            <th style="text-align:left;">车辆ID</th>
            <%--car_id--%>
            <th>发布人ID</th>
            <%--sender_id--%>

            <th>车辆出租状态码</th>
            <th>发布人姓名</th>
            <th>操作</th>
        </tr>
        </thead>
        <tbody class="cars_content"></tbody>
    </table>
</div>
<div id="page"></div>
<script type="text/javascript" src="../../layui/layui.js"></script>
<script type="text/javascript" src="../../js/jquery-2.1.4.min.js"></script>
<script type="text/javascript" src="../../js/jquery.cookie.js"></script>
<!--获取根路径-->
<script type="text/javascript" src="../../js/getRootPath.js"></script>
<script type="text/javascript" src="../ground/user_rent_in.js"></script>
</body>
</html>
