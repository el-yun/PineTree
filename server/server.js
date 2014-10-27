var express = require('express')
    , cors = require('cors')
    , multipart = require('connect-multiparty')
    , fs = require('fs')
    , easyimg = require('easyimage');
var app = express();
app.use(express.static(__dirname));
var http = require('http').createServer(app).listen(9000);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;
var multipartMiddleware = multipart();

mongoose.connect('mongodb://localhost/pinetree');

console.log("PineTree Service....9000");


app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    next();
});


var contentSchema= mongoose.Schema({
    tree: { type: Schema.ObjectId },
    treeName: { type: String },
    contentType: { type: Number, default: 1 }, // 1 (메모)  2(일정)  3(자료
    contentUser: { type: Schema.ObjectId, default: new ObjectId()}, // 작성자 객체
    contentUserName: { type: String, default: "Not Found" }, // 작성자 이름
    contentMemo: { type: String, default: "" }, // 컨텐츠
    contentFile: { type: Array, default: []},
    contentTime: { type: Date, default: Date.now },
    contentRange: { type: Array, default: null},
    contentTag: { type:String, default:""}
});

var treeSchema = mongoose.Schema({
    treeName: { type: String, required: true },
    treeMemo: { type: String, default: ""},
    treeImage: { type: Array, default: []}
});

var treeUserSchema = mongoose.Schema({
    tree: { type: Schema.ObjectId },
    treeName: { type: String, default: ""},
    User: { type: Schema.ObjectId, default: new ObjectId()},
    Message: { type: String, default: ""},
    Permission: { type: Number, default: 0} // 1: 일반 0: 미수락
});

var userSchema = mongoose.Schema({
    userName: { type: String, required: true, index: { unique: true } },
    userEmail: { type: String, default: ""},
    userPassword: { type: String, required: true},
});

var contentModel = mongoose.model('content',contentSchema);
var userModel = mongoose.model('user',userSchema);
var treeModel = mongoose.model('tree',treeSchema);
var treeUserModel = mongoose.model('treeUser',treeUserSchema);


// 그룹단위 목록 보기 ( GET )
app.get('/contents/list', function(req, res) {
    res.set('Content-Type', 'application/json');
    contentModel.find({tree: mongoose.Types.ObjectId(req.query.tree)}, null, {sort: {contentTime: -1}}, function (err, datas) {
        return res.send(JSON.stringify(datas));
    });
});

// 특정 게시물 내용 ( GET )
app.get('/contents', function(req, res) {
    res.set('Content-Type', 'application/json');
    contentModel.find({_id: mongoose.Types.ObjectId(req.query.contentIndex)}, null, {sort: {contentTime: -1}}, function (err, datas) {
        return res.send(datas);
    });
});

// 게시물 등록 ( POST )
app.post('/contents', multipartMiddleware, function(req, res, next) {
    res.set('Content-Type', 'application/json');
    var newContent = new contentModel();
    var update_id = null;
    newContent.tree = req.body.tree;
    newContent.contentType = req.body.treeType;
    newContent.contentUser = req.body.contentUser;
    newContent.contentUserName = req.body.contentUserName;
    newContent.contentMemo = req.body.contentMemo;
    if(req.body.contentRange_Start && req.body.contentRange_End){
        newContent.contentRange = { start: req.body.contentRange_Start , end : req.body.contentRange_End}
    }
    if(Object.keys(req.files).length > 0) {
        fs.readFile(req.files.contentFile.path, function (error, data) {
            var destination = __dirname + '\\.\\uploaded\\' + req.files.contentFile.name;
            fs.writeFile(destination, data, function (error) {
                if (error) {
                    console.log(error);
                    throw error;
                } else {
                    newContent.contentFile = {filename: req.files.contentFile.name};
                    newContent.save(function (err) {
                        if (!err) {
                            console.log('Success!');
                        } else {
                            console.log(err);
                        }
                    });
                }
            });
        });
    } else {
        newContent.save(function (err) {
            if (!err) {
                console.log('Success!');
            } else {
                console.log(err);
            }
        });
    }
    return res.send(JSON.stringify(req.body));
});

// 게시물 업데이트 ( PUT )
app.put('/contents', multipartMiddleware, function(req, res, next) {
    res.set('Content-Type', 'application/json');
    var newContent = {
        "contentType" : req.body.treeType,
        "contentUserName" : req.body.contentUserName,
        "contentMemo" : req.body.contentMemo,
        "contentFile" : req.body.contentMemo,
        "start" : req.body.contentRange_Start,
        "end" : req.body.contentRange_End
    };
    contentModel.findOneAndUpdate({_id: mongoose.Types.ObjectId(req.query.contentIndex)}, newContent, {upsert: false}, function(err, doc){
        if(err) return res.send({ error: err });
        return res.send(doc);
    });
});

// 게시물 삭제 ( DELETE )
app.delete('/contents', function (req, res){
    contentModel.find({_id: mongoose.Types.ObjectId(req.query.contentIndex)},function(err){
        if(err) return res.send({ error: err });
    }).remove(function(err,doc){
        if(err) return res.send({ error: err });
        else res.send({"result":"ok"});
    });
});

// 사용자 생성 ( POST )
app.get('/user', function(req, res) {
    res.set('Content-Type', 'application/json');

    // 새 유저 객체
    var newuser = new userModel();
    newuser.userName = req.query.UserName;
    newuser.userEmail = req.query.UserEmail;
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
            res.send(JSON.stringify(datas));
        }
    });
});

// 사용자 목록 보기 ( GET )
app.get('/user/list', function(req, res) {
    res.set('Content-Type', 'application/json');
    userModel.find({}, null, null, function (err, datas) {
        return res.send(JSON.stringify(datas));
    });
});

// 트리 생성 ( POST )
app.post('/tree',  multipartMiddleware, function(req, res, next) {
    // 새 트리 객체
    var newtree = new treeModel();
    newtree.treeName = req.body.treeName;
    newtree.treeMemo = req.body.treeMemo;

    // 트리 존재 유무 체크
    treeModel.findOne({treeName: req.body.treeName}, null, null, function (err, datas) {
        if(!datas){
            newtree.save(function (err, doc) {
                if (!err) {
                    console.log('Success!');
                    // 트리 생성 후 최초 사용자 추가
                    var newTreeUser = new treeUserModel();
                    newTreeUser.tree = doc.id;
                    newTreeUser.user = req.query.contentUser;
                    TreeNewUser(newTreeUser);
                    FileUpload(req, treeModel, doc.id);
                    res.send(JSON.stringify(doc));
                }
                else {
                    console.log(doc);
                }
            });
        } else {
            res.send({"error": "이미 존재하는 트리입니다."});
        }
    });
});

// 트리 초대 ( POST )
app.post('/tree/newuser', multipartMiddleware, function(req, res, next) {
    // 새 트리 객체
    userModel.findOne({userEmail: req.body.inviteEmail}, null, null, function (err, datas) {
        if(datas){
            var newTreeUser = new treeUserModel();
            newTreeUser.tree = req.body.tree;
            newTreeUser.treeName = req.body.treename;
            newTreeUser.user = datas._id;
            newTreeUser.Message = req.body.inviteText;
            TreeNewUser(newTreeUser);
        }
        return res.send(JSON.stringify(datas));
    });
});


// 트리 목록 ( GET )
app.get('/tree/list', function(req, res) {
    res.set('Content-Type', 'application/json');
    var list = [];
    treeUserModel.find({User: mongoose.Types.ObjectId(req.query.user), Permission: 1}, null, null, function (err, datas) {
        return res.send(JSON.stringify(datas));
    });
});

// 가입 초대 확인 ( GET )
app.get('/tree/newuser', function(req, res) {
    res.set('Content-Type', 'application/json');
    treeUserModel.findOne({User: mongoose.Types.ObjectId(req.query.user), Permission: 0}, null, null, function (err, datas) {
        return res.send(JSON.stringify(datas));
    });
});

// 가입 초대 승인 ( GET )
app.get('/tree/apply', function(req, res) {
    res.set('Content-Type', 'application/json');
    var newContent = {
        "Permission" : 1
    };
    treeUserModel.findOneAndUpdate({User: mongoose.Types.ObjectId(req.query.contentUser), tree: mongoose.Types.ObjectId(req.query.tree)}, newContent, {upsert: false}, function(err, doc){
        if(err) return res.send({ error: err });
        return res.send(doc);
    });
});

// 트리 목록 보기 ( GET )
app.get('/tree/list', function(req, res) {
    res.set('Content-Type', 'application/json');
    treeModel.find({}, null, null, function (err, datas) {
        return res.send(JSON.stringify(datas));
    });
});

// 파일 다운로드 ( get )
app.get('/download', function(req, res){
    var file = fs.readFileSync(__dirname + '/uploaded/' + req.query.filename, 'binary');
    res.setHeader('Content-Length', file.length);
    res.write(file, 'binary');
    res.end();
});

// 트리 사용자 추가 함수
function TreeNewUser(newTreeUser){
    newTreeUser.save(function (err, doc) {
        if (!err) {
            console.log('Success!');
        }
        else {
            console.log(err);
        }
    });
}

function FileUpload(req, model, id){
    if(Object.keys(req.files).length > 0) {
        fs.readFile(req.files.attachFile.path, function (error, data) {
            var destination = __dirname + '\\.\\uploaded\\' + req.files.attachFile.name;
            console.log(destination);
            fs.writeFile(destination, data, function (error) {
                if (error) {
                    console.log(error);
                    throw error;
                } else {
                    var upload = {treeImage: req.files.attachFile.name};
                    model.findOneAndUpdate({_id: mongoose.Types.ObjectId(id)}, upload, {upsert: false}, function(err, doc){
                        if(err) return res.send({ error: err });
                    });
                    //createThumb(req.files.attachFile.path, req.files.attachFile.name);
                }
            });
        });
    }
}

function createThumb(src,name){
    easyimg.thumbnail({
        src: src,
        dst: __dirname + '\\.\\uploaded\\thumb_' + name,
        width:500, height:500,
    }).then(
        function(image) {
            console.log('CreateThumbnail: ' + image.width + ' x ' + image.height);
        },
        function (err) {
            console.log(err);
        }
    );
}