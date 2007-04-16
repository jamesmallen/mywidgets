

function glob(path, testRE, recurse) {
	var ret = [];
	var dArray = filesystem.getDirectoryContents(path, recurse);
	
	for (var i in dArray) {
		if (testRE.test(dArray[i])) {
			ret.push(dArray[i]);
		}
	}
	return ret;
}




