var express = require('express')
    , cors = require('cors');
var app = express();
app.use(express.static(__dirname));
var http = require('http').createServer(app).listen(9000);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;
mongoose.connect('mongodb://localhost/pinetree');

console.log("PineTree Service....9000");
app.use(cors());
var contentSchema= mongoose.Schema({
    tree: { type: Schema.ObjectId },
    treeName: { type: String },
    contentType: { type: Number, default: 1 }, // 1 (메모)  2(일정)  3(자료
    contentUser: { type: Schema.ObjectId, default: new ObjectId()}, // 작성자 객체
    contentUserName: { type: String, default: "Not Found" }, // 작성자 이름
    contentMemo: { type: String, default: "" }, // 컨텐츠
    contentFile: { type: Array, default: []},
    contentImage: { type: Array, default: []},
    contentTime: { type: Date, default: Date.now }
});

var treeSchema = mongoose.Schema({
    treeName: { type: String, required: true },
    treeMemo: { type: String, default: ""}
});

var userSchema = mongoose.Schema({
    userName: { type: String, required: true, index: { unique: true } },
    userPassword: { type: String, required: true}
});

var contentModel = mongoose.model('content',contentSchema);
var userModel = mongoose.model('user',userSchema);
var treeModel = mongoose.model('tree',treeSchema);


// 그룹단위 목록 보기 ( GET )
app.get('/contents/list', function(req, res) {
    res.set('Content-Type', 'application/json');
    contentModel.find({}, null, {sort: {contentTime: -1}}, function (err, datas) {
        return res.send(JSON.stringify(datas));
    });
});

// 특정 게시물 내용 ( GET )
app.get('/contents/:id', function(req, res) {
    res.set('Content-Type', 'application/json');
    contentModel.find({_id: req.query.contentIndex}, null, {sort: {contentTime: -1}}, function (err, datas) {
        return res.send(req.query.callback + '('+ JSON.stringify(datas) + ');');
    });
});

// 게시물 등록 ( POST )
app.get('/contents', function(req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.set('Content-Type', 'application/json');
    var newContent = new contentModel();
    newContent.contentType = req.query.treeType;
    newContent.contentUser = req.query.contentUser;
    newContent.contentUserName = req.query.contentUserName;
    newContent.contentMemo = req.query.contentMemo;
    newContent.save(function (err) {
        if (!err) console.log('Success!');
        else console.log(err);
    });
    return res.send(JSON.stringify(req.query));
});

// 게시물 업데이트 ( PUT )
app.put('/contents/:id', function (req, res){
    console.log("put Sucesss");
    return res.send({ status: 'PUT' });
});

// 게시물 삭제 ( DELETE )
app.delete('/contents/:id', function (req, res){
    return res.send({ status: 'DELETE' });
});

// 사용자 생성 ( POST )
app.get('/user', function(req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.set('Content-Type', 'application/json');

    // 새 유저 객체
    var newuser = new userModel();
    newuser.userName = req.query.UserName;
    newuser.userPassword = req.query.UserPassword;
    // 사용자 유무 체크
    userModel.findOne({userName: req.query.UserName, userPassword: req.query.UserPassword}, null, null, function (err, datas) {
        if(!datas){
            newuser.save(function (err) {
                if (!err) console.log('Success!');
                else console.log(err);
            });
            res.send(JSON.stringify(req.query));
        } else {
            console.log(datas);
            res.send(JSON.stringify(datas));
        }
    });
});

// 트리 생성 ( POST )
app.post('/tree', function(req, res) {
    res.send({ status: 'POST' });
});