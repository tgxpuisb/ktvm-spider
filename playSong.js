const req = require('request')

const defaultCookie = 'song_singer_id=139; magicFacevip=1; search_history=%u8F6C%u5F2F%2C%u5FD8%u60C5%u6C34%2C%u4E0D%u518D%u8054%u7CFB%2C%u65AD%u70B9%2C%u767D%u6708%u5149; PHPSESSID=bsje545v75ioc1hfbu60g43u90; Hm_lpvt_c50838245838ade2d680b14ce86d4c51=1494604288; Hm_lvt_c50838245838ade2d680b14ce86d4c51=1493487711,1493489830,1494604166,1494604288; snStatistics=be842ef6-69fd-4830-a4f7-50c4f3d72c95'

const baseUrl = 'http://www.ktvme.com/wap/app/playSongController/'


const request = req.defaults({
	headers: {
		'User-Agent': 'Mozilla/5.0 (Linux; Android 4.4.2; SM701 Build/SANFRANCISCO) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/37.0.0.0 Mobile MQQBrowser/6.8 TBS/036824 Safari/537.36 MicroMessenger/6.3.27.880 NetType/WIFI Language/zh_CN',
		'Origin': 'http://www.ktvme.com',
		'Referer': 'http://www.ktvme.com/wap/app?from=kmgzh&oauthid=otCz6vibKvxR4EuxMSyHi26OAwog&barcode=10289101813149',
		'Host': 'www.ktvme.com',
		'Accept': 'application/json, text/javascript, */*; q=0.01',
		'X-Request-With': 'XMLHttpRequest',
		'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
		'Accept-Encoding': 'gzip, deflate',
		'Accept-Language': 'zh-CN,en-US;q=0.8',
		Cookie: defaultCookie
	},
	jar: true,
	gzip: true,
	json: true
})


function playSong(id) {
	request.post('http://www.ktvme.com/wap/app/playSongController/', {
		form: {
			"playkey": id
		}
	}, (error, response, body) => {
		console.log(body)
	})
}

['00022825', '00054588'].forEach(v => {
	playSong(v)
})

