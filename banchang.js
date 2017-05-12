const req = require('request')

const defaultCookie = 'PHPSESSID=uvgolpd3fr6sqg6h5rj12qklf1; Hm_lpvt_c50838245838ade2d680b14ce86d4c51=1494613273; Hm_lvt_c50838245838ade2d680b14ce86d4c51=1494605790,1494607605,1494608440,1494613273; snStatistics=be842ef6-69fd-4830-a4f7-50c4f3d72c95'

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


function switchSong() {
	request.post('http://kmdg.ktvme.com/wap/app/playMenuController/', {
		form: {
			"playkey": 104
		}
	}, (error, response, body) => {
		console.log(body)
	})
}
setInterval(() => {
	switchSong()
}, 2000)

