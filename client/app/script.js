// Global Variable
var SERVER = "http://nodepj.com:9000/";
var TEMPLATE = "./template/";
var SESSION_USER = {"userName": null, "id": null};
var SESSION_TREE = "";
var TREE = {};
var VIEW = "timeline";
var pollTime = 2000; // 폴링 주기
var poll = new Timeout(fnpoll, pollTime); // 폴링 객체

// Initialize
(function init() {
    $('.ui.sidebar').sidebar('toggle'); // Aside 출력
    fnpoll(); // 최초 실행
})();

// Define Timer
function Timeout(fn, interval) {
    this.id = setInterval(fn, interval);
    this.cleared = false;
    this.clear = function () {
        this.cleared = true;
        clearInterval(this.id);
    };
    this.restart = function (){
        this.id = setInterval(fn, interval);
    }
}

// Polling Function
function fnpoll(){
    //console.log("..");
    if(!SESSION_USER.userName) getSession();
    $.ajax({
        type:"get",
        url: SERVER + "contents/list",
        dataType:"json",
        success : function(data) {
            TREE = data;
        },
        error : function(xhr, status, error) {
        }
    });
}

// Function
function getSession(){
    if(poll.cleared = false) poll.clear();
    $('#login').modal('setting', {
            closable  : false
     }).modal('show');
}

function layout(id){
    $(".tree-view").addClass("tree-undisplay");
    if($("#"+ id).hasClass('tree-undisplay')) $("#"+ id).removeClass('tree-undisplay');
    switch(id){
        case "timeline":
            $.get(TEMPLATE + "timeline.html", function(template){
                _.extend(TREE, data_format);
                var html = _.template(template, {tree: TREE});
                $("#timeline").html(html);
            });
        break;
        case "schedule":
            $.get(TEMPLATE + "schedule.html", function(template){
                _.extend(TREE, data_format);
                var html = _.template(template, {tree: TREE});
                $("#schedule").html(html);
            });
            break;
    }
}

function data_format(dates){
    var date = new Date(dates);
    var day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var month = date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    var year = date.getFullYear();

    return year + '-' + month + '-' + day;
}


// Event Handler
$(document).on("click","div.link",function(){
    var id = $(this).attr("data-menu"); // menu
    layout(id);
    VIEW = id;
});

$(document).on("click","div.submit",function(){
    var id = $(this).attr("data-id"); // menu
    var url = $(this).attr("data-url"); // Mapping URL
    switch(id){
        // 사용자 로그인, 추가
        case "tree-login":
            $('#' + id).ajaxSubmit({
                type: 'get',
                url: SERVER + url,
                dataType: 'json',
                success: function (data) {
                    if(data._id && data.userName){
                        SESSION_USER.id = data._id;
                        SESSION_USER.userName = data.userName;
                        $('#login').hide();
                        poll.restart();
                    }
                }
            });
            break;
        case "tree-write":
            var data = {treeType:1, contentUser:SESSION_USER.id, contentUserName: SESSION_USER.userName };
            $('#' + id).ajaxSubmit({
                type: 'get',
                url: SERVER + url,
                data: data,
                dataType: 'json',
                success: function (data) {
                    fnpoll();
                    $('#' + id)[0].reset();
                    setTimeout(layout(VIEW), 5000);
                }
            });
            break;
        default:
            break;
    }
});