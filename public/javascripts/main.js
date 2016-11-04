var jcrop_api;

$('input[type=file]').change(function(){
    $("#div1").hTML="";
    var file=this.files[0];
    if (typeof jcrop_api != 'undefined')
        jcrop_api.destroy();
    var reader=new FileReader();
    reader.readAsDataURL(file);
    reader.onload=function(){
        //alert(document.getElementById("images").offsetHeight=null);

        var url=reader.result;//通过reader.result 来访问生成的 DataURL
        setImageUrl(url);//设置图片显示(每次alert得到的是不同url)
        document.getElementById("div1").appendChild(img);

        document.getElementById("div1").style.height=img.offsetHeight+"px";
        var divHeiaht=  $("#div1").width();
        $("#divWidth").val(divHeiaht);
        function showCoords(c)
        {
            $('#x1').val(c.x);
            $('#y1').val(c.y);
            $('#x2').val(c.x2);
            $('#y2').val(c.y2);
            $('#w').val(c.w);
            $('#h').val(c.h);
        };
        function clearCoords()
        {
            $('#coords input').val('');
        };

        $('img').Jcrop({
            onChange:   showCoords,
            onSelect:   showCoords,
            onRelease:  clearCoords
        },function(){
            jcrop_api = this;
        });
    };
});
var img=new  Image();
function setImageUrl(url){  //设置图片URL

    img.src=url;
    img.style.width=100+"%";
}
$(document).ready(function () {
    $("button").click(function () {
       var formData = new FormData(document.getElementById("form1"));

        $.ajax({
            type: "POST",
            url: "/users/upImg",
            data: formData,
            cache:false,
            contentType: false, //必须false才会避开jQuery对 formdata 的默认处理 XMLHttpRequest会对 formdata 进行正确的处理
            processData: false, //必须false才会自动加上正确的Content-Type
            success: function () {
                window.location.href="/users/image";
            }

        });
    });
});