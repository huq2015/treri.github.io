--- 
layout: post
title: 单PHP文件原生js版PhilnaSay
pid: 250
comments: true
tags: [PhilNa2, JavaScript]
categories: [学习笔记]
---
刚有个朋友问我博客右上角的PhilnaSay,想让我帮忙提取出来,所以弄了一下,先是给那位朋友弄了一个用jq库的.然后我又弄了一下,搞了一个原生js版单PHP文件版的

如果想用的话,直接把PHP文件包含到想展示PhilnaSay的地方就行了,其它的都不用动.

把以下代码随便保存一个名字,比如 `PhilnaSay.php`在想展示PhilnaSay的地方输入以下内容,
&lt;?php include 'PhilnaSay.php';?>

    <?php
    $philnasay_ary_ = array( '格言1','格言2','格言3','格言4','格言5','格言6','格言7','格言8');
    $word_ = $philnasay_ary_[ mt_rand(0, count($philnasay_ary_) - 1) ];
        if (isset($_GET['philnasay'])) {
            echo $word_;
        }else{
            echo '<p id="philna_say" style="cursor: pointer" title="点击更换新一条">'.$word_.'</p>'."n";
            $ary = preg_split('/[/\\]/',__FILE__);
        ?>
        <script type="text/javascript">
            (function(){
                    var philnasay = document.getElementById("philna_say");
                    function handle(){
                        var xmlhttp;
                        if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
                            xmlhttp=new XMLHttpRequest();
                        }else{// code for IE6, IE5
                            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
                        }
                        xmlhttp.onreadystatechange=function(){
                            if (xmlhttp.readyState==4 && xmlhttp.status==200){
                                document.getElementById("philna_say").innerHTML=xmlhttp.responseText;
                            }
                        }
                        xmlhttp.open("GET","<?php echo $ary[count($ary)-1];?>?philnasay=true&t="+Math.random(),true);
                        xmlhttp.send();
                    }
                    if (philnasay.addEventListener) {
                        philnasay.addEventListener('click',handle,false);
                    }else{
                        philnasay.attachEvent('onclick',handle);
                    }
            })();
            </script>
        <?php } ?>
