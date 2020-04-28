(function($) {

    'use strict';
    //menu
    var dropdown = {};
    $('.menu')
        .on('dropdown-show', function(e) {
            dropdown.loadOnce($(this), dropdown.buildMenuItem);
        })
        .dropdown({
            css3: true,
            js: false
        });

    dropdown.buildMenuItem = function($elem, data) {

        var html = "";
        if (data.length === 0) return;
        for (var i = 0; i < data.length; i++) {
            html += '<li><a href="' + data[i].url + '" target="_blank" class="menu-item">' + data[i].name + '</a></li>'
        }
        $elem.find('.dropdown-layer').html(html);

    };

    //cart
    $('#cart').on('dropdown-show', function() {
        dropdown.loadOnce($(this), function($elem, data) {
            dropdown.buildCartItem($elem, data);
            // dropdown.updateCart($elem, data);
        });
    }).dropdown({

        css3: true,
        js: false
    });


    dropdown.buildCartItem = function($elem, data) {

        var html = "";
        if (data.length === 0) { // no goods
            html += '<div class="cart-nogoods"><i class="icon cart-nogoods-icon fl">&#xe600;</i><div class="cart-nogoods-text fl">购物车里还没有商品<br />赶紧去选购吧！</div></div>';
            $elem.find('.dropdown-layer').html(html);
            return;
        }

        html += '<h4 class="cart-title">最新加入的商品</h4><ul class="cart-list">';

        for (var i = 0; i < data.length; i++) {
            html += '<li class="cart-item"><a href="###" target="_blank" class="cart-item-pic fl"><img src="' + data[i].pic + '" alt="" /></a><div class="fl"><p class="cart-item-name text-ellipsis"><a href="###" target="_blank" class="link">' + data[i].name + '</a></p><p class="cart-item-price"><strong>￥' + data[i].price + ' x ' + data[i].num + '</strong></p></div><a href="javascript:;" title="删除" class="cart-item-delete link fr">X</a></li>';
        }

        html += '</ul><div class="cart-info"><span class="fl">共 <strong class="cart-total-num">0</strong> 件商品　共计<strong class="cart-total-price">￥ 0.00</strong></span><a href="###" target="_blank" class="cart-info-btn btn fr">去购物车</a></div>';

        // setTimeout(function(){
        $elem.find('.dropdown-layer').html(html);
        // },1000);
    };

    function updateCart($elem, data) {
        var $cartNum = $elem.find('.cart-num'),
            $cartTotalNum = $elem.find('.cart-total-num'),
            $cartTotalPrice = $elem.find('.cart-total-price'),
            dataNum = data.length,
            totalNum = 0,
            totalPrice = 0;

        if (dataNum === 0) { // no goods
            return;
        }

        for (var i = 0; i < dataNum; i++) {
            totalNum += +data[i].num;
            totalPrice += +data[i].num * +data[i].price;
        }

        $cartNum.html(totalNum);
        $cartTotalNum.html(totalNum);
        $cartTotalPrice.html('￥' + totalPrice);
    };


    //header search
    var search = {};
    search.$headerSearch = $('#header-search');
    search.$headerSearch.html = '';
    search.$headerSearch.maxNum = 10;

    // 获得数据处理
    search.$headerSearch.on('search-getData', function(e, data) {
        var $this = $(this);
        search.$headerSearch.html = search.$headerSearch.createHeaderSearchLayer(data, search.$headerSearch.maxNum);
        $this.search('appendLayer', search.$headerSearch.html);
        // 将生成的html呈现在页面中        
        if (search.$headerSearch.html) {
            $this.search('showLayer');
        } else {
            $this.search('hideLayer');

        }
    }).on('search-noData', function(e) {
        // 没获得数据处理
        $(this).search('hideLayer').search('appendLayer', '');

    }).on('click', '.search-layer-item', function() {
        // 点击每项时，提交
        search.$headerSearch.search('setInputVal', $(this).html());
        search.$headerSearch.search('submit');
    });

    search.$headerSearch.search({
        autocomplete: true,
        css3: false,
        js: false,
        animation: 'fade',
        getDataInterval: 0
    });

    // 获取数据，生成html

    search.$headerSearch.createHeaderSearchLayer = function(data, maxNum) {
        var html = '',
            dataNum = data['result'].length;

        if (dataNum === 0) {
            return '';
        }
        for (var i = 0; i < dataNum; i++) {
            if (i >= maxNum) break;
            html += '<li class="search-layer-item text-ellipsis">' + data['result'][i][0] + '</li>';
        }
        return html;

    };

    // focus-category

    $('#focus-category').find('.dropdown')
        .on('dropdown-show', function() {
            dropdown.loadOnce($(this), dropdown.createCategoryDetails);
        })
        .dropdown({
            css3: false,
            js: false
        });

    dropdown.createCategoryDetails = function($elem, data) {
        var html = '';
        for (var i = 0; i < data.length; i++) {
            html += '<dl class="category-details cf"><dt class="category-details-title fl"><a href="###" target="_blank" class="category-details-title-link">' + data[i].title + '</a></dt><dd class="category-details-item fl">';

            for (var j = 0; j < data[i].items.length; j++) {
                html += '<a href="###" target="_blank" class="link">' + data[i].items[j] + '</a>';
            }
            html += '</dd></dl>';
        }
        // setTimeout(function () {
        $elem.find('.dropdown-layer').html(html);
        // },1000);

    };

    dropdown.loadOnce = function($elem, success) {
        var dataLoad = $elem.data('load');
        if (!dataLoad) return;
        if (!$elem.data('loaded')) {
            $elem.data('loaded', true);
            $.getJSON(dataLoad).done(function(data) {
                if (typeof success === 'function') success($elem, data);
            }).fail(function() {
                $elem.data('loaded', false);
            });
        }
    };

    // imgLoader
    var imgLoader = {};
    imgLoader.loadImg = function(url, imgLoaded, imgFailed) {
        var image = new Image();
        image.onerror = function() {
            if (typeof imgFailed === 'function') imgFailed(url);
        }
        image.onload = function() {
            if (typeof imgLoaded === 'function') imgLoaded(url);
        };
        // image.src=url;     
        setTimeout(function() {
            image.src = url;
        }, 1000);
    };

    imgLoader.loadImgs = function($imgs, success, fail) {
        // var $imgs=$(elelm).find('.floor-img');          

        $imgs.each(function(_, el) { // _ 相当占位，不使用该参数。
            var $img = $(el);
            imgLoader.loadImg($img.data('src'), function(url) {
                $img.attr('src', url);
                success();
            }, function(url) {
                console.log('从' + url + '加载图片失败');
                // 多加载一次
                // 显示备用图片
                // $img.attr('src', 'img/floor/placeholder.png');
                fail($img, url);
            });
        });
    }

    //lazyLoad

    var lazyLoad = {};

    lazyLoad.loadUntil = function(options) {

        var items = {},
            loadedItemNum = 0,
            // totalItemNum = $floor.length,
            loadItemFn = null,
            $elem = options.$container,
            id = options.id
        // 什么时候开始加载
        $elem.on(options.triggerEvent, loadItemFn = function(e, index, elem) {
            // console.log(1);
            if (items[index] !== 'loaded') {
                $elem.trigger(id + '-loadItem', [index, elem, function() {
                    items[index] = 'loaded';
                    // console.log(items[index]);
                    loadedItemNum++;
                    console.log(index + ': loaded');
                    if (loadedItemNum === options.totalItemNum) {
                        // 全部加载完毕
                        $elem.trigger(id + '-itemsLoaded');
                    }
                }]);
            }
        });

        //加载中
        // $elem.on(id+'-loadItem', function(e, index, elem) {

        //        $elem.trigger(id+'-loadItems',[]);          

        //             items[index] = 'loaded';
        //             console.log(items[index]);
        //             loadedItemNum++;
        //             console.log(index + ': loaded');
        //             if (loadedItemNum === totalItemNum) {
        //                 // 全部加载完毕
        //                 $elem.trigger(id+'-itemsLoaded');
        //             }
        // });

        //加载完毕
        $elem.on(id + '-itemsLoaded', function(e) {
            console.log(id + '-itemsLoaded');
            // 清除事件
            $elem.off(options.triggerEvent, loadItemFn);
            // $win.off('scroll resize', timeToShow);
        });

    }

    lazyLoad.isVisible = function(floorData) {
        var $win = floor.$win;
        return ($win.height() + $win.scrollTop() > floorData.offsetTop) && ($win.scrollTop() < floorData.offsetTop + floorData.height)
    }


    // foucs-slider
    var slider = {};
    slider.$focusSlider = $('#focus-slider');

    slider.$focusSlider.on('focus-loadItem', function(e, index, elem, success) {

        imgLoader.loadImgs($(elem).find('.slider-img'), success, function($img, url) {
            $img.attr('src', 'img/focus-slider/placeholder.png');
        });
    });

    lazyLoad.loadUntil({
        $container: slider.$focusSlider,
        totalItemNum: slider.$focusSlider.find('.slider-img').length,
        triggerEvent: 'slider-show',
        id: 'focus'
    });

    // slider.loadImg = function(url, imgLoaded, imgFailed) {
    //     var image = new Image();
    //     image.onerror = function() {
    //         if (typeof imgFailed === 'function') imgFailed(url);
    //     }
    //     image.onload = function() {
    //         if (typeof imgLoaded === 'function') imgLoaded(url);
    //     };
    //     // image.src=url;     
    //     setTimeout(function() {
    //         image.src = url;
    //     }, 1000);
    // };

    // slider.lazyLoad = function($elem) {
    //     $elem.items = {};
    //     $elem.loadedItemNum = 0;
    //     $elem.totalItemNum = $elem.find('.slider-img').length;
    //     $elem.on('slider-show', $elem.loadItem = function(e, index, elem) {
    //         console.log(1);
    //         if ($elem.items[index] !== 'loaded') {
    //             $elem.trigger('slider-loadItem', [index, elem]);
    //         }
    //     });
    //     $elem.on('slider-loadItem', function(e, index, elem) {
    //         // 按需加载
    //         var $imgs = $(elem).find('.slider-img');
    //         $imgs.each(function(_, el) { // _ 相当占位，不使用该参数。
    //             var $img = $(el);
    //             slider.loadImg($img.data('src'), function(url) {
    //                 $img.attr('src', url);
    //                 $elem.items[index] = 'loaded';
    //                 $elem.loadedItemNum++;
    //                 console.log(index + ': loaded');
    //                 if ($elem.loadedItemNum === $elem.totalItemNum) {
    //                     // 全部加载完毕
    //                     $elem.trigger('slider-itemsLoaded');
    //                 }
    //             }, function(url) {
    //                 console.log('从' + url + '加载图片失败');
    //                 // 多加载一次
    //                 // 显示备用图片
    //                 $img.attr('src', 'img/focus-slider/placeholder.png');
    //             });
    //         });

    //     });

    //     $elem.on('slider-itemsLoaded', function(e) {
    //         console.log('itemsLoaded');
    //         // 清除事件
    //         $elem.off('slider-show', $elem.loadItem);
    //     });
    // }

    // slider.lazyLoad(slider.$focusSlider);



    slider.$focusSlider.slider({
        css3: true,
        js: false,
        animation: 'fade', // fade  slide
        activeIndex: 0,
        interval: 3000
    });


    // todays-slider   
    slider.$todaysSlider = $('#todays-slider');

    slider.$todaysSlider.on('todays-loadItem', function(e, index, elem, success) {

        imgLoader.loadImgs($(elem).find('.slider-img'), success, function($img, url) {
            $img.attr('src', 'img/todays-slider/placeholder.png');
        });
    });

    lazyLoad.loadUntil({
        $container: slider.$todaysSlider,
        totalItemNum: slider.$todaysSlider.find('.slider-img').length,
        triggerEvent: 'slider-show',
        id: 'todays'
    });

    slider.$todaysSlider.slider({
        css3: true,
        js: false,
        animation: 'fade', // fade  slide
        activeIndex: 0,
        interval: 0
    });



    //floor
    var floor = {};
    floor.$floor = $('.floor');

    // 删除内容
    //  function lazyLoadFloorImgs($elem) {
    //          var items = {},
    //          loadedItemNum = 0,
    //          totalItemNum = $elem.find('.floor-img').length,
    //          loadItemFn=null;             

    //          $elem.on('tab-show', loadItemFn = function(e, index, elem) {
    //              // console.log(1);
    //              if (items[index] !== 'loaded') {
    //                  $elem.trigger('tab-loadItem', [index, elem]);
    //              }
    //          });
    //          $elem.on('tab-loadItem', function(e, index, elem) {
    //              // 按需加载
    //              var $imgs = $(elem).find('.floor-img');
    //              $imgs.each(function(_, el) { // _ 相当占位，不使用该参数。
    //                  var $img = $(el);
    //                  slider.loadImg($img.data('src'), function(url) {
    //                      $img.attr('src', url);
    //                      items[index] = 'loaded';
    //                      console.log(items[index]);
    //                      loadedItemNum++;
    //                      console.log(index + ': loaded');
    //                      if (loadedItemNum === totalItemNum) {
    //                          // 全部加载完毕
    //                          $elem.trigger('tab-itemsLoaded');
    //                      }
    //                  }, function(url) {
    //                      console.log('从' + url + '加载图片失败');
    //                      // 多加载一次
    //                      // 显示备用图片
    //                      $img.attr('src', 'img/floor/placeholder.png');
    //                  });
    //              });

    //          });

    //          $elem.on('tab-itemsLoaded', function(e) {
    //              console.log('tab-itemsLoaded');
    //              // 清除事件
    //              $elem.off('tab-show', loadItemFn);
    //          });

    // }

    // $floor.each(function (_,elem) {

    //     lazyLoadFloorImgs($(elem));
    // });



    //  $floor.tab({
    //      event:'mouseenter',// mouseenter或click
    //      css3:false,
    //      js:false,
    //      animation:'fade',
    //      activeIndex:0,
    //      interval:0,
    //      delay:0
    //  });


    floor.floorData = [{
        num: '1',
        text: '米面粮油',
        tabs: ['综合', '干果', '米面粮油'],
        offsetTop: floor.$floor.eq(0).offset().top,
        height: floor.$floor.eq(0).height(),
        items: [
            [{
                name: '剑南春 水晶剑 52度 整箱白酒 500ml*6瓶 口感浓香型',
                price: 479
            }, {
                name: '金纺 衣物护理剂 一身薰衣草 2.5L+2.5L(柔顺性)',
                price: 335
            }, {
                name: '百草味 坚果临时干果 每日坚果 奶油味夏威夷果200g/袋（内含开果器）',
                price: 159
            }, {
                name: '优选100有机速冻鲜食玉米黄糯玉米 240g/支 年货礼盒',
                price: 65
            }, {
                name: '三只松鼠每日坚果礼盒零食年货大礼包开心果混合果仁30袋 750g/盒',
                price: 69
            }, {
                name: '农夫山泉 17°5 橙子 3kg装 铂金年货礼盒 新鲜水果',
                price: 4999
            }, {
                name: '八马茶叶 云南普洱熟茶茶饼黑茶简易装357g',
                price: 289
            }, {
                name: '金龙鱼食用油 压榨 特香型花生油6.18L（定制装）',
                price: 369
            }, {
                name: '澳洲进口 德运 脱脂成人奶粉 原装进口奶粉 1kg/袋',
                price: 399
            }, {
                name: '福临门 太余香 一品茉莉香米 井口原粮 大米 中粮出品 5kg（包装更新，新老包装随机发放）',
                price: 689
            }, {
                name: '送4只 城阳福记 大闸蟹全母蟹2.6-2.3两/只 6只装生鲜鲜活现货湖蟹螃蟹',
                price: 269
            }],
            [{
                name: '百草味 坚果临时干果 每日坚果 奶油味夏威夷果200g/袋（内含开果器）',
                price: 479
            }, {
                name: '三只松鼠每日坚果礼盒零食年货大礼包开心果混合果仁30袋 750g/盒',
                price: 335
            }],
            [{
                name: '金龙鱼食用油 压榨 特香型花生油6.18L（定制装）',
                price: 479
            }, {
                name: '福临门 太余香 一品茉莉香米 井口原粮 大米 中粮出品 5kg（包装更新，新老包装随机发放）',
                price: 335
            }]
        ]
    }, {
        num: '2',
        text: '个护美妆',
        tabs: ['综合', '粉底液', '面膜'],
        offsetTop: floor.$floor.eq(1).offset().top,
        height: floor.$floor.eq(1).height(),
        items: [
            [{
                name: '【大容量300ml限量抢】滋润维护芦荟胶（补水保湿后修护）祛痘印收缩毛孔',
                price: 169
            }, {
                name: '魏宝莲 超然无限 03自然色 巨遮瑕轻薄裸妆滋润保湿隔离+替换装',
                price: 198
            }, {
                name: '阿玛尼ARMANI赤色哑光染唇液506.3ml(小胖丁 口红 轻薄持久)',
                price: 79.9
            }, {
                name: '美宝莲 MAYBELLINE 定制柔粉雾粉底液125ml 30ml （fit me 粉底液）',
                price: 228
            }, {
                name: '欧莱雅男士补水保湿护肤套装 洁面膏100ml +水凝露120ml',
                price: 119
            }, {
                name: '泰国进口 庄磊RAY 金色蚕丝面膜 10片/盒 提亮修复 抗皱紧致 清透 品牌直供',
                price: 39
            }, {
                name: '美宝莲 MAYBELLINE 超然无暇 二合一 提亮轻垫霜 01 亮肤色 11.5g',
                price: 299
            }, {
                name: '欧莱雅集团 小美盒补水保湿护肤品套装礼盒 兰蔻HR YSL美丽奇遇盒 爽肤水+精华+口红+香水',
                price: 257
            }, {
                name: '美迪惠儿梁鹏 水润保湿面膜10片（韩国进口）补水面膜',
                price: 199
            }, {
                name: '珀莱雅 保湿五件套 （洁面120ml+水150ml+乳液120ml+面霜50g+面膜*2）',
                price: 36
            }, {
                name: '欧莱雅 MAYBELLINE 定制柔粉雾粉底液125ml 30ml （fit me 粉底液）',
                price: 139
            }, {
                name: 'MG 美即面膜 MAYBELLINE 定制柔粉雾粉底液 男女面膜贴',
                price: 99
            }],
            [{
                name: '欧莱雅 MAYBELLINE 定制柔粉雾粉底液125ml 30ml （fit me 粉底液）',
                price: 169
            }, {
                name: '美迪惠儿梁鹏 水润保湿面膜10片（韩国进口）补水面膜',
                price: 198
            }, {
                name: '魏宝莲 超然无限 03自然色 巨遮瑕轻薄裸妆滋润保湿隔离+替换装',
                price: 79.9
            }],
            [{
                name: '美迪惠儿梁鹏 水润保湿面膜10片（韩国进口）补水面膜',
                price: 169
            }, {
                name: '【大容量300ml限量抢】滋润维护芦荟胶（补水保湿后修护）祛痘印收缩毛',
                price: 198
            }, {
                name: '御泥坊红酒透亮矿物蚕丝面膜贴',
                price: 79.9
            }, {
                name: '泰国进口 庄磊RAY 金色蚕丝面膜 10片/盒 提亮修复 抗皱紧致 清透 品牌直供',
                price: 228
            }]
        ]
    }];




    floor.buildFloor = function(floorData) {
        var html = '';

        html += '<div class="container">';
        html += floor.buildFloorHead(floorData);
        html += floor.buildFloorBody(floorData);
        html += '</div>';

        return html;
    };

    floor.buildFloorHead = function(floorData) {
        var html = '';
        html += '<div class="floor-head">';
        html += '<h2 class="floor-title fl"><span class="floor-title-num">' + floorData.num + 'F</span><span class="floor-title-text">' + floorData.text + '</span></h2>';
        html += '<ul class="tab-item-wrap fr">';
        for (var i = 0; i < floorData.tabs.length; i++) {
            html += '<li class="fl"><a href="javascript:;" class="tab-item">' + floorData.tabs[i] + '</a></li>';
            if (i !== floorData.tabs.length - 1) {
                html += '<li class="floor-divider fl text-hidden">分隔线</li>';
            }
        }
        html += '</ul>';
        html += '</div>';
        return html;
    };

    floor.buildFloorBody = function(floorData) {
        var html = '';
        html += '<div class="floor-body">';
        for (var i = 0; i < floorData.items.length; i++) {
            html += '<ul class="tab-panel">';
            for (var j = 0; j < floorData.items[i].length; j++) {
                html += '<li class="floor-item fl">';
                html += '<p class="floor-item-pic"><a href="###" target="_blank"><img src="img/floor/loading.gif" class="floor-img" data-src="img/floor/' + floorData.num + '/' + (i + 1) + '/' + (j + 1) + '.jpg" alt="" /></a></p>';
                html += '<p class="floor-item-name"><a href="###" target="_blank" class="link">' + floorData.items[i][j].name + '</a></p>';
                html += '<p class="floor-item-price">' + floorData.items[i][j].price + '</p>';
                html += '</li>';
            }

            html += '</ul>';
        }

        html += '</div>';

        return html;
    };

    floor.$win = $(window);
    floor.$doc = $(document);



    floor.timeToShow = function() {
        console.log('time to show');
        floor.$floor.each(function(index, elem) {
            if (lazyLoad.isVisible(floor.floorData[index])) {
                // console.log('the'+(index+1)+'floor is visible');
                floor.$doc.trigger('floor-show', [index, elem]);
            }
        });
    }

    floor.$win.on('scroll resize', floor.showFloor = function() {
        clearTimeout(floor.floorTimer);
        floor.floorTimer = setTimeout(floor.timeToShow, 250);
    });

    floor.$floor.on('floor-loadItem', function(e, index, elem, success) {

        imgLoader.loadImgs($(elem).find('.floor-img'), success, function($img, url) {
            $img.attr('src', 'img/floor.placeholder.png');
        });
    });

    floor.$doc.on('floors-loadItem', function(e, index, elem, success) {

        var html = floor.buildFloor(floor.floorData[index]),
            $elem = $(elem);
        success();
        setTimeout(function() {
            $elem.html(html);
            lazyLoad.loadUntil({
                $container: $elem,
                totalItemNum: $elem.find('.floor-img').length,
                triggerEvent: 'tab-show',
                id: 'floor'
            });
            $elem.tab({
                event: 'mouseenter', // mouseenter或click
                css3: false,
                js: false,
                animation: 'fade',
                activeIndex: 0,
                interval: 0,
                delay: 0
            });

        }, 1000);
    });

    floor.$doc.on('floors-itemsLoaded', function() {
        floor.$win.off('scroll resize', floor.showFloor);
    });

    lazyLoad.loadUntil({
        $container: floor.$doc,
        totalItemNum: floor.$floor.length,
        triggerEvent: 'floor-show',
        id: 'floors'
    });

    floor.timeToShow();

    // elevator
    floor.whichFloor = function() {
        var num = -1;

        floor.$floor.each(function(index, elem) {
            var floorData = floor.floorData[index];

            num = index;

            if (floor.$win.scrollTop() + floor.$win.height() / 2 < floorData.offsetTop) {
                num = index - 1;
                return false;
            }
        });

        return num;
    };
    console.log(floor.whichFloor());

    floor.$elevator = $('#elevator');
    floor.$elevator.$items = floor.$elevator.find('.elevator-item');
    floor.setElevator = function() {
        var num = floor.whichFloor();

        if (num === -1) { // hide
            floor.$elevator.fadeOut();
        } else { // show
            floor.$elevator.fadeIn();
            floor.$elevator.$items.removeClass('elevator-active');
            floor.$elevator.$items.eq(num).addClass('elevator-active');
        }
    };

    floor.setElevator();

    floor.$win.on('scroll resize', function() {
        clearTimeout(floor.elevatorTimer);
        floor.elevatorTimer = setTimeout(floor.setElevator, 250);
    });

    floor.$elevator.on('click', '.elevator-item', function() {
        $('html, body').animate({
            scrollTop: floor.floorData[$(this).index()].offsetTop
        });
    });

    $('#backToTop').on('click', function() {
        $('html, body').animate({
            scrollTop: 0
        });
    });

})(jQuery);