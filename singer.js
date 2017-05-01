const request = require('request')
const mysql = require('mysql')
// const co = require('co')

const CMDID = require('./cmdid.config.js')
const mysqlConfig = require('./mysql.config.js')

const BASE_URL = 'https://mobile.ktvme.com/'
const TABLE_NAME = 'singer'

// 数据获取
//{"cmdid":"D324","letterindex":"热门","songstertypeid":"1","requestnum":"40","startpos":"1"}

var pos = 1
const STEP_LENGTH = 40
const MAX_STEP = 4000

var connection = mysql.createConnection(mysqlConfig)
connection.connect()

function formatBody ({
	cmdid = CMDID.INDEX_SINGER,
	letterindex = '热门',
	songstertypeid = '3', // 1 男, 2女 3组合 4欧美 5 日韩
	requestnum = '40',
	startpos = '1'
} = {}) {
	return JSON.stringify({
		cmdid,
		letterindex,
		songstertypeid,
		requestnum,
		startpos
	})
}

function getData () {
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
				'cmmid': CMDID.INDEX_SINGER,
				'customerid': '38418311'
			},
			form: {
				body: formatBody({startpos: pos + ''})
			}
		}, (error, response, body) => {
			let data = JSON.parse(body)
			if (data.rs) {
				resolve(data)
			} else {
				reject('over')
			}
		})
	})
}

function saveData (data) {
	//body.rs.r
	let INSERT = 'INSERT INTO singer VALUES '
	for (let i = 0; i < data.length; i++) {
		let v = data[i]
		INSERT += `("${v.fid}", "${v.id}", "${v.lfid}", "${v.bfid}", "${v.mfid}", "${v.name}", "${v.jp}")`
		if (i === data.length - 1) {
			INSERT += ';'
		} else {
			INSERT += ','
		}
	}
	return new Promise((resolve, reject) => {
		connection.query(INSERT, (error, results, fields) => {
			if (error){
				reject(error)
			} else {
				resolve()
			}
		})
	})
}

//getData().then()
/*
(100, 'Name 1', 'Value 1', 'Other 1'),
(101, 'Name 2', 'Value 2', 'Other 2'),
(102, 'Name 3', 'Value 3', 'Other 3'),
(103, 'Name 4', 'Value 4', 'Other 4');
*/

function run () {
	getData().then(result => {
		if (pos > MAX_STEP) {
			return Promise.reject('over')
		} else {
			console.log(pos)
			pos += STEP_LENGTH
			return saveData(result.rs.r)
		}
	}).then(() => {
		setTimeout(() => {
			run()
		}, 3000)
	}).catch((e) => {
		console.log(e)
		console.log(pos)
		connection.end()
	})
}

run()




