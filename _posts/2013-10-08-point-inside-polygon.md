---
layout: post
title: "判断一个点是否在多边形内"
pid: 2013100801
comments: true
keywords: ""
description: ""
categories: [学习笔记]
tags: [JavaScript, CoffeeScript]
---
使用Canvas绘制图形时,为了使得在鼠标移动到某个多边形内部时,对整个多边形进行高亮显示,这里就需要用到判断某个点是否在多边形内部的算法.

其实用到的几何原理就是,
从要判断的点任意作一条射线, 然后计数射线与多边形相交点的个数,若相交点个数为奇数个,刚此点位于多边形内部,若相交点个数为偶数个,刚此点位于多边形外部.

所以下面的三个方法就是实现这个目的.

    // CoffeeScript
    
    max = (a, b)->
      if a > b then a else b

    min = (a, b)->
      if a < b then a else b

    insidePolygon = (d, x, y)->
      p1x = d[0]
      p1y = d[1]
      N = d.length / 2
      counter = 0
      for i in [0..N]
        p2x = d[2 * (i % N)]
        p2y = d[2 * (i % N) + 1]
        if y > min p1y, p2y
          if y <= max p1y, p2y
            if x <= max p1x, p2x
              if p1y != p2y
                xinters = (y - p1y) * (p2x - p1x) / (p2y - p1y) + p1x
                if p1x is p2x or x <= xinters
                  counter++
        p1x = p2x
        p1y = p2y

      if counter % 2 is 0
        0
      else
        1

## 检验方法
    
    // CoffeeScript

    // 多边形
    polygon = [
      0, 0,
      0, 2,
      2, 2,
      2, 0,
      0, 0
    ];

    point = [1, 1];

    console.log insidePolygon(polygon, point[0], point[1]);
    // = 1, 证明要检验的点位于多边形内部