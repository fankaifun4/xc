var screenWidth, screenHeight, screenDisplayWidth, screenDisplayHeight, domainUri, time = 1,
    feedTime = 1,
    commentTime = 1,
    inMsnry = 0,
    inCommentMsnry = 0,
    initCommentFeed = 0,
    initFeed = 0,
    msnry, feedMsnry, commentMsnry, clickEvent, currentDisplay = 1,
    userid, mySwiper, loadWXReady = 0;
domainUri = "http://www.yingetime.com/";
wx.config({
    debug: false,
    appId: 'wx7058fcc275f23301',
    timestamp: '1518239193',
    nonceStr: '2oQ4T5gb28TQYb2W',
    signature: '36c5c475f95ca7e425749894724fe2a5454f90f5',
    jsApiList: [
        'checkJsApi',
        'openLocation',
        'getLocation',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        "chooseImage",
        "previewImage",
    ]
});
wx.ready(function() {
    loadWXReady = 1;
    var id = $(".productContainer").attr("data-id");
    var cid = "template_22_" + id;
    var link = window.location.href;
    var title = "可爱兔斯基@";
    var des = "";
    var imgUrl = $(".shareThumb").find("img").attr("src");
    wxShareFriend(title, des, link, imgUrl, cid, userid);
    wxShareTimeline(title, link, imgUrl, cid, userid);
    $(".pickupPhotoesBtn").attr("class", "defaultBtn defaultBottomBtn pickupPhotoesBtn");
    $(".pickupPhotoesBtn").on("touchend", function(e) {
        //alert("pickupPhotoesBtn");
        e.preventDefault();
        e.stopPropagation();
        var num = parseInt($(this).attr("data-num"));
        if (!num) num = 9;
        var tcid = $(this).attr("data-templateid");
        var pcid = $(this).attr("data-product");
        // alert(pi+"/"+num);

        //num = 1;
        if (num > 9) num = 9
        wx.chooseImage({
            count: num,
            sizeType: ['original'],
            //sourceType: ['album'], 
            success: function(res) {
                //alert(res.localIds.length);
                var k = "tempWXImg_" + tcid + "_" + pcid + "_" + userid;
                var timek = "tempWXImgTime_" + tcid + "_" + pcid + "_" + userid;
                var timestamp = new Date().getTime();
                var imgs = "";
                for (var ii = 0; ii < res.localIds.length; ii++) {
                    img = res.localIds[ii];
                    imgs += "_-_" + img;
                }

                imgs = imgs.substring(3);
                //alert(k+"/"+imgs);
                localStorage.setItem(k, imgs);
                localStorage.setItem(timek, timestamp);
                var tk = "tempWorkName_" + tcid + "_" + pcid + "_" + userid;
                localStorage.setItem(tk, "");

                var url = "index.php?m=main&c=index&a=create&tid=" + tcid + "&pcid=" + pcid + "&source=templateDetail";
                url = domainUri + url;
                hrefTo(url);
            }
        });
    })
});