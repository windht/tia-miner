const low = require('lowdb');
const path = require('path');
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync(path.join(__dirname,'db.json'));
const db = low(adapter)

// Set some defaults
db.defaults({ pools: [
	{
		id:1,
		name:"Dummy",
		server:"btg.suprnova.cc",
		port:"8816",
		user:"windht.office",
		pass:"xxxxxx",
		currency:{
			name:"BTG",
			slug:"bitcoin-gold"
		}
	}
  ]})
  .write()

module.exports = db;