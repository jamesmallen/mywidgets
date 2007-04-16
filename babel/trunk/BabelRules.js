


function isValidWord(str)
{
	var sql = 'SELECT COUNT(*) FROM words WHERE word="' + addSlashes(str) + '"';
	log(sql);
	var res = globals.db.catchQuery(sql).getColumn(0);
	
	if (res && res != 0) {
		return true;
	} else {
		return false;
	}
}





