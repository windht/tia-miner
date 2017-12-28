var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var path = require('path');
var fs = require('fs');
var miner;

module.exports = {
	start:start,
	stop:stop
}

function start(server,port,user,pass){


	// fs.writeFileSync(path.join(__dirname,"miner.bat"),
	// 	`miner.exe ` +
	// 	`--server ` + server + ` ` +
	// 	`--port ` + port + ` ` +
	// 	`--user ` + user + ` ` +
	// 	`--pass ` + pass + ` --pec --fee 0`
	// )

	// var code = path.join(__dirname,"miner.exe")+ ` --server ` + server + ` ` +
	// 	`--port ` + port + ` ` +
	// 	`--user ` + user + ` ` +
	// 	`--pass ` + pass + ` --pec --fee 0`;

	// console.log(code)
	// miner = exec(code)



	miner = spawn(path.join(__dirname,"miner.exe"),[
		'--server',server,
		'--port',port,
		'--user',user,
		'--pass',pass,
		'--api',
		'--pec',
		'--fee',0
	])

	// miner.stdout.setEncoding('utf8')
	// miner.stdout.on('data', (data) => {
	//     console.log(data);
	// });

	// miner.stderr.on('data', (data) => {
	//     console.log(data);
	// });

}

function stop(){
	if (miner){
		miner.kill()
		miner = null;
	}
	
}