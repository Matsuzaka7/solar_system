import { TextureLoader, LoadingManager } from 'three'
const manager = new LoadingManager();
manager.onStart = function ( url, itemsLoaded, itemsTotal ) {
	console.log( '开始加载： ' + url + '.\n第 ' + itemsLoaded + '/' + itemsTotal + ' 文件.' );
};

manager.onLoad = function ( ) {
	console.log( '全部加载完成!');
};

manager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
	console.log( '加载中: ' + url + '.\n第 ' + itemsLoaded + '/' + itemsTotal + ' 文件.' );
};

manager.onError = function ( url ) {
	console.log( '加载错误：' + url );
};

export default new TextureLoader(manager)