// Global Variable
var SERVER = "http://nodepj.com:9000/";
var TEMPLATE = "./template/";
var SESSION_USER = {"userName": null, "id": null, "tree": null, "treeid": null};
var TREE = {};
var VIEW = "timeline";
var pollTime = 2000; // 폴링 주기
var poll = new Timeout(fnpoll, pollTime); // 폴링 객체

// Initialize
function init() {
    $('.ui.sidebar').sidebar('toggle'); // Aside 출력
    fnpoll(); // 최초 실행
    setTimeout(layout(VIEW), 5000);
}

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
        this.cleared = false;
    }
}

// Polling Function
function fnpoll(){
    if(sessionStorage.length > 0){
        SESSION_USER.id = sessionStorage.getItem("USER_ID");
        SESSION_USER.userName = sessionStorage.getItem("USER_USERNAME");
        SESSION_USER.tree = sessionStorage.getItem("USER_TREE");
        SESSION_USER.treeid = sessionStorage.getItem("USER_TREEID");
        if(SESSION_USER.tree) $("#tree-title").html(SESSION_USER.tree);
    }
    if(!SESSION_USER.userName || !SESSION_USER.id) getSession();
    if(SESSION_USER.treeid && SESSION_USER.treeid != "undefined" && SESSION_USER.id) {
        $.ajax({
            type: "get",
            url: SERVER + "contents/list",
            data: {tree: SESSION_USER.treeid},
            dataType: "json",
            success: function (data) {
                TREE = data;
            },
            error: function (xhr, status, error) {
            }
        });
        $.ajax({
            type: "get",
            url: SERVER + "tree/newuser",
            data: {user: SESSION_USER.id},
            dataType: "json",
            success: function (data) {
                if(data) {
                    $('#inviteApply').modal('setting', {
                        closable: false
                    }).modal('show');
                    $('#inviteMessage').html(data.Message);
                    if(poll.cleared = false) poll.clear();
                }
            },
            error: function (xhr, status, error) {
            }
        });
    }
}

// Function
function getSession(){
    if(poll.cleared = false) poll.clear();
    $('#login').modal('setting', {
            closable  : false
     }).modal('show');
}

function layout(id, data_id, data_name){
    $(".tree-view").addClass("tree-undisplay");
    if($("#"+ id).hasClass('tree-undisplay')) $("#"+ id).removeClass('tree-undisplay');
    switch(id){
        case "timeline":
            $.get(TEMPLATE + "timeline.html", function(template){
                var today = new Date();
                _.extend(TREE, data_format);
                _.extend(TREE, string_cut);
                _.extend(TREE, today);
                _.extend(TREE, daysInMonth);
                var html = _.template(template, {tree: TREE});
                $("#timeline").html(html);
            });
        break;
        case "file":
            $.get(TEMPLATE + "file.html", function(template){
                _.extend(TREE, data_format);
                _.extend(TREE, string_cut);
                var html = _.template(template, {tree: TREE});
                $("#file").html(html);
            });
            break;
        case "chart":
            $.get(TEMPLATE + "chart.html", function(template){
                _.extend(TREE, data_format);
                _.extend(TREE, getDay);
                _.extend(TREE, daysInMonth);
                var html = _.template(template, {tree: TREE});
                $("#chart").html(html);
            });
            break;
        case "treelist":
            $.ajax({
                type:"get",
                url: SERVER + "tree/list",
                dataType:"json",
                data: {user: SESSION_USER.id},
                success : function(data) {
                    $.get(TEMPLATE + "treelist.html", function(template){
                        _.extend(TREE, data_format);
                        _.extend(TREE, getDay);
                        _.extend(TREE, daysInMonth);
                        var html = _.template(template, {tree: data});
                        $("#treelist").html(html);
                    });
                },
                error : function(xhr, status, error) {
                }
            });
            break;
        case "graph":
            var options = {
                'legend':{
                    names: ['09-10', '09-11', '09-12', '09-13', '09-14', '09-15', '09-16']
                },
                'dataset':{
                    title:'트리 작성 수',
                    values: [[2,1, 0], [0,3, 2], [2,1, 0], [2,0, 2], [1, 1, 4], [0, 0,2], [1, 0,0]],
                    colorset: ['#DC143C','#FF8C00', '#2EB400'],
                    fields:['사용자A', '사용자B', '사용자C']
                },
                'chartDiv' : 'treechart',
                'chartType' : 'line',
                'leftOffsetValue': 50,
                'bottomOffsetValue': 60,
                'chartSize' : {width:700, height:300},
                'minValue' : 0,
                'maxValue' : 6,
                'increment' : 2
            };
            Nwagon.chart(options);
            break;
        case "ready":
            $('#ready').modal('show');
            break;
        case "newtree":
            $('#tree').modal('show');
            break;
        case "treeinvite":
            if(SESSION_USER.treeid && SESSION_USER.treeid != "undefined") $('#treeInvite').modal('show');
            break;
        case "treeChange":
            SESSION_USER.tree = data_name;
            SESSION_USER.treeid = data_id;
            sessionStorage.setItem("USER_TREE",data_name);
            sessionStorage.setItem("USER_TREEID",data_id);
            window.location.reload();
            break;
    }
}

function daysInMonth(iMonth, iYear)
{
    return 32 - new Date(iYear, iMonth, 32).getDate();
}

function getDay(date){
    var d = new Date(date);
    return d.getDate();
}

function string_cut(str, len){
    if(str.length > len){
        return str.substring(0, len);
    } else {
        return str;
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
$(document).ready(function(){
    init();
});
$(document).on("click","div.link",function(){
    var id = $(this).attr("data-menu"); // menu
    layout(id);
    VIEW = id;
});

$(document).on("click","div.listlink",function(){
    var id = $(this).attr("data-menu"); // menu
    var data_id = $(this).attr("data-id");
    var data_name = $(this).attr("data-name");
    layout(id, data_id, data_name);
    VIEW = id;
});

$(document).on("click","i#attach_file",function(){
    $("#contentFile").click();
});

$(document).on("click","div.filedown",function(){
    var link = $(this).attr("data-link");
    window.location.href = SERVER + 'download/?filename=' + link;
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
                        sessionStorage.setItem("USER_ID",data._id);
                        sessionStorage.setItem("USER_USERNAME",data.userName);
                        $('#login').hide();
                        poll.restart();
                    }
                }
            });
            break;
        // 트리 추가 & 사용
        case "tree-add":
            var data = {treeType:1, contentUser:SESSION_USER.id, contentUserName: SESSION_USER.userName };
            $('#' + id).ajaxSubmit({
                type: 'post',
                mimeType:"multipart/form-data",
                url: SERVER + url,
                data: data,
                dataType: 'json',
                success: function (data) {
                    SESSION_USER.tree = data.treeName;
                    SESSION_USER.treeid = data._id;
                    sessionStorage.setItem("USER_TREE",data.treeName);
                    sessionStorage.setItem("USER_TREEID",data._id);
                    if(SESSION_USER.tree) $("#tree-title").html(SESSION_USER.tree);
                }
            });
            break;
        // 트리 초대
        case "tree-invite":
            var data = {contentUser:SESSION_USER.id, contentUserName: SESSION_USER.userName, tree: SESSION_USER.treeid, treename: SESSION_USER.tree };
            $('#' + id).ajaxSubmit({
                type: 'post',
                mimeType:"multipart/form-data",
                url: SERVER + url,
                data: data,
                dataType: 'json',
                success: function (data) {
                    $('#treeInvite').modal('show');
                    $('#msg').html("새로운 사용자를 초대했습니다.");
                }
            });
            break;
        // 트리 초대 승인
        case "invite-apply":
            var data = {contentUser:SESSION_USER.id, contentUserName: SESSION_USER.userName, tree: SESSION_USER.treeid };
            $.ajax({
                type: 'get',
                mimeType:"multipart/form-data",
                url: SERVER + url,
                data: data,
                dataType: 'json',
                success: function (data) {
                    $('#message').modal('show');
                    $('#msg').html("새로운 트리에 가입했습니다. 새로운 트리에 참여해보세요!");
                    poll.start();
                }
            });
            break;
        case "tree-write":
            var data = {treeType:1, contentUser:SESSION_USER.id, contentUserName: SESSION_USER.userName, tree:SESSION_USER.treeid };

            $('#' + id).ajaxSubmit({
                type: 'post',
                mimeType:"multipart/form-data",
                url: SERVER + url,
                data: data,
                dataType: 'json',
                success: function (data) {
                    fnpoll();
                    $('#' + id)[0].reset();
                    setTimeout(layout(VIEW), 5000);
                }
            });
            /*
            $('#' + id).ajaxSubmit({
                type: 'post',
                url: SERVER + url,
                data: data,
                dataType: 'json',
                success: function (data) {
                    fnpoll();
                    $('#' + id)[0].reset();
                    setTimeout(layout(VIEW), 5000);
                }
            });
            */
            break;
        default:
            break;
    }
});