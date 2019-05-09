var http = require("http");
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var md5 = require('md5');
var nunjucks  = require('nunjucks');
var mysql      = require('mysql');

var root = express();

root.use(cookieParser());
root.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

root.use(bodyParser.urlencoded({extended : true}));
root.use(bodyParser.json());
root.use(express.static(__dirname + '/assets'));

var db = mysql.createConnection({
  host     : 'localhost', //mysql database host name
  user     : 'root', //mysql database user name
  password : '', //mysql database password
  database : 'safario2' //mysql database name
});

db.connect(function(err) {
  if (err){
    console.log('Cek your DB Connection');
    console.log(err);
  }else{
    console.log('You are now connected with mysql database...');
  }
})


// Apply nunjucks and add custom filter and function (for example). 
root.set('view engine', 'njk');
var env = nunjucks.configure(['views/'], { // set folders with templates
  autoescape: true, 
  express: root
});

env.addFilter('myFilter', function(obj, arg1, arg2) {
  console.log('myFilter', obj, arg1, arg2);
    // Do smth with obj
    return obj;  
  });
env.addGlobal('myFunc', function(obj, arg1) { 
  console.log('myFunc', obj, arg1);
    // Do smth with obj
    return obj;
  });

//----auth
root.get('/auth', function(request, response) { 
  if(request.session.flashdata){
    var flash = request.session.flashdata;
  }
  response.render('auth/login.njk',{flash});
});

root.post('/auth/login', function(request, response) {
  var user = request.body.username;
  var passw = request.body.password;
  var pass = md5(passw);
  console.log("user "+user);
  console.log("pass "+pass);
    // console.log("PASSWORD2 "+pass);
    let sql = "SELECT * FROM user where nrp_nip ='"+user+"' AND password='"+pass+"' limit 1";
    let query = db.query(sql, (err, results, fields) => {
      if(err){
        console.log(err);
      }
        // console.log(results);
        if (results.length > 0) { 
            //add to session         
            request.session.id_user = results[0].id_user;
            request.session.nrp_nip = results[0].nrp_nip;
            request.session.nama_user = results[0].nama_user;
            request.session.role = results[0].role;

            if(request.session.role == 1){
              response.redirect('/dosen');
            }else{
                // response.redirect('/mahasiswa');
                response.redirect('/mahasiswa');
              }


            }else{
            // console.log("SALLAH");
            request.session.flashdata = "Kombinasi username dan password salah !!";
            response.redirect('/auth');
          }
        });
  });


root.get('/auth/logout', function(request, response) {
  request.session.destroy();    
  response.redirect('/auth');
});
//-----------------------ENDAUTH-----------------

//----REGISTER-----------------------
root.get('/auth/register', function(request, response) {
  response.render('auth/register');
});

root.post('/auth/registeruser', function(request, response) {
  var user = request.body.username;
  var passw = request.body.password;
  var pass = md5(passw);
  var nama = request.body.nama;
  var category = request.body.category;

  let sql = "SELECT * FROM user where nrp_nip ='"+user+"'";
  let query = db.query(sql, (err, results, fields) => {
    if (results.length > 0) {        
      request.session.flashdata = "NRP/NIP telah digunakan oleh akun lain";
      response.redirect('/auth');
    }else{
      let sql = "INSERT INTO `user`(`nrp_nip`,`nama_user`,`password`,`role`) values ('"+user+"','"+nama+"','"+pass+"','"+category+"')";
      db.query(sql, function (err, result) {
        if(err){
          console.log(err);
        }else{
          console.log("Number of records inserted: " + result.affectedRows);
        }
      });
      request.session.flashdata = "Akun "+nama+" berhasil dibuat";
      response.redirect('/auth');
    }
  });
});
//-------------------ENDREGISTER--------------------

//-------------------DOSEN---------------------
root.get('/dosen', function(request, response) {
  if (request.session.role != 1) {
    response.redirect('/mahasiswa');
  }else{
    let sql = "SELECT * FROM matkul";
    let query = db.query(sql, (err, results,fields) => {
      if(err)if(err){
        console.log(err);
      }
      response.render('dosen/index',{results});
    });
  }
});

root.post('/dosen/addkelas', function(request, response) {
  var nama_matkul = request.body.nama_matkul;
  var kelas = request.body.kelas;
  sql = "INSERT INTO `matkul`(`nama_matkul`,`kelas`) values ('"+nama_matkul+"','"+kelas+"')";
  query = db.query(sql, (err, results) => {
    if(err){
      console.log(err);
    }
    response.redirect('/dosen');
  });
});
//-------------------ENDDOSEN---------------------

//-------------------MAHASISWA------------------
root.get('/mahasiswa', function(request, response) {
  var username = request.session.username;
  var nama = request.session.nama; 
  var id = request.session.id_user;
  let sql = "SELECT * FROM matkul where nrp_nip = '"+id+"'";
  let query = db.query(sql, (err, results,fields) => {
    if(err){
      console.log(err);
    }
    // console.log(matkuls);
    response.render('mahasiswa/index',{results,username,nama,id});
  });
    //response.render('mahasiswa/index.njk',{username,nama});
  });

root.post('/mahasiswa/absen', function(request, response) {
  var id = request.body.id_user;
  var matkul = request.body.id_matkul;
  var status = request.body.status;

  let sql = "INSERT INTO `absen`(`id_user`,`id_matkul`,`status`) values (`"+id+"`,`"+matkul+"`,`"+status+"`) ";
  let query = db.query(sql, (err, results) => {
    if(err){
      console.log(err);
    }
    response.redirect('mahasiswa/index.njk');
  });
});

//-------------------ENDMAHASISWA------------------

//-------------------API---------------------------
root.post('/login', function (req, res) {
  var user = req.body.nrp;
  var passw = req.body.password;
  var pass = md5(passw);
  db.query('select id_user,nrp_nip,nama_user from user where nrp_nip=? and password=?',
   [user,pass], function (error, results, fields) {
    if (error){
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
    if (results.length > 0){
      res.status(200).json(results);
    }else{
      res.status(404).json({ error: 'Username dan password tidak tepat' });
    }
  });
});

//tambah mahasiswa
root.post('/tambahmahasiswa', function (req, res) {
  console.log(req.body);
  var user = req.body.nrp;
  var nama = req.body.nama;
  var passw = req.body.password;
  var pass  = md5(passw);
  db.query('select id_user from user where nrp_nip=? and password=?',
   [user,pass], function (error, results, fields) {
    if (error){
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
    if (results.length > 0){
      res.status(404).json({ error: 'NRP/NIP sudah digunakan' });
    }else{
      db.query('INSERT INTO user (nrp_nip,nama_user,password,role) values (?,?,?,?)',
       [user,nama,pass,'2'], function (error, results, fields) {
        if (error){
          console.log(error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
        res.status(200).json({ OK: 'Akun dengan nrp '+user+' berhasil dibuat' });
      });
    }
  });
});

//tambah matkul
root.post('/tambahmatkul', function (req, res) {
  console.log(req.body);
  var nama_matkul = req.body.nama_matkul;
  var kelas = req.body.kelas;
  db.query('select id_matkul from matkul where nama_matkul=? and kelas=?',
   [nama_matkul,kelas], function (error, results, fields) {
    if (error){
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
    if (results.length > 0){
      res.status(404).json({ error: 'Kelas telah ditambahkan' });
    }else{
      db.query('INSERT INTO matkul (nama_matkul,kelas) values (?,?)',
        [nama_matkul,kelas], function (error, results, fields) {
          if (error){
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
          }else{
            res.status(200).json({ OK: 'Kelas '+nama_matkul+' '+kelas+' berhasil dibuat' });
          }
        });
    }
  });
});

//tambah peserta
root.get('/tambahpeserta/:id_matkul/:nrp', function (req, res) {
  var id_matkul = req.params.id_matkul;
  var nrp_nip = req.params.nrp;

  db.query('SELECT * FROM matkul m, daftar_peserta d,user u WHERE m.id_matkul=d.id_matkul AND u.id_user=d.id_user AND id_matkul=? and id_user=?',
   [id_matkul,nrp_nip], function (error, results, fields) {
    if (error){
      console.log(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
    if (results.length > 0){
      res.status(404).json({ error: 'Peserta '+results[0].nama_user+' telah terdaftar di Kelas' });
    }else{
      db.query('INSERT INTO daftar_peserta (id_matkul,id_user) values (?,?)',
        [id_matkul,nrp_nip], function (error, results, fields) {
          if (error){
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
          }else{
            res.status(200).json({ OK: 'Berhasil ditambahkan dalam kelas' });
          }
        });
    }
  });
});

root.listen(3000, '0.0.0.0', function() {
  console.log('Listening to port:  ' + 3000);
});