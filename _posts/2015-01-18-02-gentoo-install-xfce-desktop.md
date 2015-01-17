---
layout: post
title: "gentoo install xfce desktop"
pid: 2015011802
comments: true
keywords: ""
description: ""
categories: [学习笔记]
tags: [Linux, Gentoo]
---

接上篇安装完nvidia显卡驱动后, 这篇文章要安装xfce桌面环境.

- <https://wiki.gentoo.org/wiki/Xfce>
- <https://wiki.gentoo.org/wiki/Xfce/HOWTO>

1. 确认目前选择的profile为desktop, 但不是为gnome或者kde
2. 为一些软件配置USE标记

        echo 'app-text/poppler -qt4' >> /etc/portage/package.use
        echo 'dev-util/cmake -qt4' >> /etc/portage/package.use
        echo 'gnome-base/gvfs -http' >> /etc/portage/package.use
3. 设置xfce的插件

        echo 'XFCE_PLUGINS="brightness clock trash"' >> /etc/portage/make.conf

3. 安装xfce

        emerge --ask xfce4-meta xfce4-notifyd; emerge --deselect y xfce4-notifyd
        emerge --ask xfwm4 xfce4-panel
        emerge --ask x11-terms/xfce4-terminal

4. 配置xorg server启动时, 默认启动xfce

        echo "exec startxfce4" > ~/.xinitrc

5. 启动xorg server, 此时应该就可以进入到xfce桌面了

        startx