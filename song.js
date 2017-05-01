const request = require('request')
const mysql = require('mysql')
const co = require('co')

const CMDID = require('./cmdid.config.js')
const mysqlConfig = require('./mysql.config.js')

const BASE_URL = 'https://mobile.ktvme.com/'
const TABLE_NAME = 'songs'

const SINGERS = 3016


let offset = 0 // 查询歌手偏移量

var connection = mysql.createConnection(mysqlConfig)
connection.connect()

//{"songsterid":"1","requestnum":"15","cmdid":"D544","supportfullsongdb":"0","startpos":"1","typeid":"0"}

function formatBody ({
	requestnum = "15",
	cmdid = CMDID.GET_SONS,
	supportfullsongdb = "0",
	typeid = "0",
	startpos = "1",
	songsterid
} = {}) {
	if (!songsterid) {
		return console.log('没有歌手id')
	}
	return JSON.stringify({
		songsterid,
		requestnum,
		cmdid,
		supportfullsongdb,
		startpos,
		typeid
	})
}

function getSingerID (offset) {
	return new Promise((resolve, reject) => {
		connection.query(`SELECT * FROM singer limit ${offset},1;`, (error, results, fields) => {
			if (error) {
				reject(error)
			} else {
				if (results && results[0] && results[0].id) {
					resolve(results[0].id)
				} else {
					reject('id 有误')
				}
			}
		})
	})

}
// getSingerID(offset)

function getSongsDataBySingerID (songsterid, pos) {
	return new Promise((resolve, reject) => {
		request({
			url: BASE_URL,
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'User-Agent': 'kmdg/4.6.6/2/iphone/10.3.1',
				'authcode': '{61E9A6DA-10C8-69FC-D909-97E6540025AF}',
				'buid': '848DEA58E0914292BBE312E615296FC9',
				'devicetag': '{C77D61B6-ED27-F238-18C6-58B1CE19B66E}-{SgLbnh}',
				// 'ck': '4e89fddd5a668325bae1a425131dc253',
				'token': '{C77D61B6-ED27-F238-18C6-58B1CE19B66E}-{SgLbnh}',
				'cmmid': CMDID.GET_SONS,
				'customerid': '38418311'
			},
			form: {
				body: formatBody({startpos: pos + '', songsterid: songsterid + ''})
			}
		}, (error, response, body) => {
			let data = JSON.parse(body)
			console.log(formatBody({startpos: pos + '', songsterid: songsterid + ''}))
			if (data.rs) {
				resolve(data)
			} else {
				console.log(data)
				resolve(false)
			}
		})
	})
}

function saveData (data) {

	let INSERT = 'INSERT INTO songs VALUES '
	for (let i = 0; i < data.length; i++) {
		let v = data[i]
		INSERT += `("${v.id}", "${v.g}", "${v.isexist}", "${v.s}", "${v.pktext}", "${v.p}", "${v.gid}", "${v.matchid}", "${v.kp}", "${v.m}")`
		if (i === data.length - 1) {
			INSERT += ';'
		} else {
			INSERT += ','
		}
	}
	return new Promise((resolve, reject) => {
		connection.query(INSERT, (error, results, fields) => {
			if (error){
				console.log('bad sql')
				console.log(INSERT)
				reject(error)
			} else {
				resolve()
			}
		})
	})
}

// getSingerID(offset)
// 	.then(id => getSongsDataBySingerID(id))
// 	.catch()

function* getAllSongBySingerID (songsterid) {
	let pos = 1
	const step = 15
	while (true) {
		let data = yield getSongsDataBySingerID(songsterid, pos)
		if (data && data.rs && data.rs.r && data.rs.r.length > 0) {
			yield saveData(data.rs.r)
			// yield new Promise(resolve => {setTimeout(() => {resolve()}, 4000)})
			pos += step
		} else {
			break
		}
	}
}

function run () {
	getSingerID(offset).then(id => {
		co
			.wrap(getAllSongBySingerID)(id)
			.then(() => {
				console.log('offset:' + offset)
				offset++
				if (offset > SINGERS) {
					return Promise.reject('over')
				}
				console.log('id:' + id)
				run()
			})
			.catch(e => {console.log('a');console.log(e)})
	}).catch(e => {
		console.log('b')
		console.log(e)
	})
}

run()





//connection.end()






/*
{"songsterid":"1","requestnum":"15","cmdid":"D544","supportfullsongdb":"0","startpos":"1","typeid":"0"
{"songsterid":"1","requestnum":"15","cmdid":"D545","supportfullsongdb":"0","startpos":"1","typeid":"0"}
*/









