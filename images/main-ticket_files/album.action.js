/**
 * 곡정보 조회
 */
define(['model/album.model',
        'util/stringUtils',
        'util/jsonUtils',
        'util/imageUtils'],
function(AlbumModel,
		 StringUtils,
		 JsonUtils,
		 ImageUtils) {

	var albumModel = new AlbumModel();

	var MENU_ID = 2802010;

	/**
	 * 앨범 재생
	 *
	 * @param pData	{albumId : n}
	 */
	var _playAlbum = function( pData ){

		albumModel
			.deliver(function(d) {
				if(JsonUtils.isNotEmpty(d)) {
					var _as = [];

					$.each(d, function( _i, _v ){
						var __o = new Object();

						__o.songId = _v.songId;
						__o.adultFlg = _v.adultFlg;

						_as.push( __o );
					});

					// 앨범 재생
					if( _as.length > 0 ) {
						__appSvcSongsPlay(MENU_ID, _as );
					}
				}
			})
			.listSong(pData)
	},
	 _playAlbumMove = function( albumId, albumTitle ){
		//Melon App의 album으로 이동
		app_album_move(albumId, albumTitle);
	},
	/**
	 *
	 * @param pSongId - 곡 아이디
	 */
	_playSong = function(pSongId) {
		__appSongPlay(false, MENU_ID, pSongId, false);
	},

	/**
	 *
	 * @param pSongIds - 곡 아이디 list
	 */
	_playSongs = function(pSongIds) {
		var _songs = [];
		$.each(pSongIds, function(_i, _v){
			_songs.push({songId:_v, adultFlg: false});
		});
		__appSvcSongsPlay(MENU_ID, _songs);
	}

	return {
			playAlbum: function(pData) {
				_playAlbum(pData)
			},
			playAlbumMove: function(albumId, albumTitle) {
				_playAlbumMove(albumId, albumTitle);
			},

			playSong: function(pSongId) {
				_playSong(pSongId);
			},

			playSongs: function(pSongIds) {
				_playSongs(pSongIds);
			}

	};
});