
function Game(obj) {

	this.initPlayer(obj.dom)
}

Game.prototype.initPlayer=function (dom) {
	var play=document.createElement('div');
	addClass('play',play);
	debugger
	dom.appendChild(play);
}

var box=document.getElementById('play-box');
var game=new Game({'dom':box});