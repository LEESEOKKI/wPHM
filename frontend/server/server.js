/* server/server.js */

const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const db = require('./config/db');
const cors = require('cors');
const bodyParser = require('body-parser');


// JSON 형식의 요청 본문 파싱
app.use(bodyParser.json());

// URL-encoded 형식의 요청 본문 파싱
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());
app.get('/api/host', (req, res) => {
    res.send({ host : 'sejun' });
})


app.get('/api/test', (req, res) => {
    db.query("select * from User", (err, data) => {
        if(!err) {
            res.send(data);

        } else {
            console.log(err);
            res.send(err);
        }
    })
})


app.post('/api/TestIDs/test', (req, res) => {
    const name = req.body.name;
    const phoneNumber = req.body.phoneNumber;
    
    // name과 phoneNumber 데이터를 이용하여 사용자 ID를 찾고, 결과를 반환하는 로직을 구현합니다.
    const queryString = 'SELECT ID FROM User WHERE Name = ? AND PhoneNumber = ?';
    db.query(queryString, [name, phoneNumber], (error, results) => {
    if (error) {
    console.error(error);
    res.status(500).send("해당 유저정보는 없습니다.");
    } else {
    const userId = results[0]?.ID;
    if (userId) {
    // 결과 반환
    res.status(200).send(userId);
    } else {
    res.status(404).send('User not found');
    }
    }
    });
    });
  

app.post('/api/updatePermission', (req, res) => {
    console.log(req.body.Name)
    // console.log(res)
    console.log("afsaifsaifiasif")
    const Name = req.body.Name;
    const Permission = req.body.Permission;
    const query = `UPDATE User SET Permission = '${Permission}' WHERE ID = ${Name}`;
   
    db.query(query, (err, result) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.send("Permission updated successfully");
      }
    });
  });
  

app.listen(PORT, () => {
    console.log(`Server On : http://localhost:${PORT}/`);
})