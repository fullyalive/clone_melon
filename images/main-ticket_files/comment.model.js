/**
 * 댓글 데이터 호출
 */
define(['Model'], function(Model) {

	var CommentModel = function(){

		var _this = this;

		/**
		 * 리스트 조회 API 호출
		 */
		_this._listComment = function(pData) {
			ActionHandler.apis['api.api_listCmt'].execute({
				data: pData,
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('listComment', $.extend({params:pData}, d));
					}
				}
			});
		},

		/**
		 * 댓글상세정보 조회
		 */
		_this._informCmt = function(pData) {
			/**
			 * 기대평 request에 필요없는 param이 들어가고 있어서 제거함.
			 * Deep copy 이용
			 */
			var params = $.extend(true, {}, pData);
			params.cmtInfo = null;
			params.memberInfo = null;
			params.atachList = null;

			ActionHandler.apis['api.api_informCmt'].execute({
				//data: pData,
				data: params,
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('informCmt', d);
					}
				}
			});
		},

		/**
		 * 댓글등록하기
		 */
		_this._insertCmt = function(pData) {
			ActionHandler.apis['api.api_insertCmt'].execute({
				data: pData,
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('insertCmt', d);
					}
				}
			});
		},

		/**
		 * 댓글수정하기
		 */
		_this._updateCmt = function(pData) {
			ActionHandler.apis['api.api_updateCmt'].execute({
				data: pData,
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('updateCmt', d);
					}
				}
			});
		},

		/**
		 * 댓글 삭제하기
		 */
		_this._deleteCmt = function(pData) {
			ActionHandler.apis['api.api_deleteCmt'].execute({
				data: pData,
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('deleteCmt', d);
					}
				}
			});
		},

		/**
		 * 댓글 신고하기
		 */
		_this._insertReprt = function(pData) {
			ActionHandler.apis['api.api_insertReprt'].execute({
				data: pData,
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('insertReprt', d);
					}
				}
			});
		},

		/**
		 * 추천/비추천 요청
		 */
		_this._insertRecm = function(pData) {
			ActionHandler.apis['api.api_insertRecm'].execute({
				data: pData,
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('insertRecm', d);
					}
				}
			});
		},

		/**
		 * 답글 등록요청
		 */
		_this._insertAdcmt = function(pData) {
			ActionHandler.apis['api.api_insertAdcmt'].execute({
				data: pData,
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('insertAdcmt', d);
					}
				}
			});
		},

		/**
		 * 답글 삭제요청
		 */
		_this._deleteAdcmt = function(pData) {
			ActionHandler.apis['api.api_deleteAdcmt'].execute({
				data: pData,
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('deleteAdcmt', d);
					}
				}
			});
		},

		/**
		 * 미디어 검색
		 */
		_this._listMusic = function(pData) {
			ActionHandler.apis['api.api_listMusic'].execute({
				data: pData,
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('listMusic', d);
					}
				}
			});
		},

		/**
		 * Youtube 링크 검증
		 */
		_this._informOembed = function(pData) {
			ActionHandler.apis['api.api_informOembed'].execute({
				data: pData,
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('informOembed', d);
					}
				}
			});
		},

		/**
		 * 리뷰 별점 등록
		 */
		_this._addReviewRate = function(pData) {
			ActionHandler.apis['performance.addReviewRate'].execute({
				data: pData,
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('addReviewRate', d);
					}
				}
			});
		},

		/**
		 * 리뷰 별점 수정
		 */
		_this._modReviewRate = function(pData) {
			ActionHandler.apis['performance.modReviewRate'].execute({
				data: pData,
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('addReviewRate', d);
					}
				}
			});
		},

		/**
		 * 댓글별 리뷰 평점 리스트 가져오기
		 */
		_this._listReviewRate = function(pData) {
			ActionHandler.apis['performance.listReviewRate'].execute({
				data: pData,
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('listReviewRate', d.data);
					}
				}
			});
		},

		/**
		 * 예매자 정보 가져오기
		 */
		_this._getReservationInfos = function(pData) {
			ActionHandler.apis['reservation.member.list'].execute({
				data: pData,
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('getReservationInfos', d);
					}
				}
			});
		},

		/**
		 * QNA 등록 시 관리자 테이블 추가등록
		 */
		_this._addCmt = function(pData) {
			ActionHandler.apis['qna.addCmt'].execute({
				data: pData,
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('addCmt', d);
					}
				}
			});
		},

		/**
		 * 이미지 업로드 인증키 발급
		 */
		_this._authUpload = function(pData) {
			ActionHandler.apis['auth.authhs_jsonp'].execute({
				data: pData,
				callback: function(d) {
					if (undefined !== d) {
						_this.setData('authUpload', d);
					}
				}
			});
		},

		this.listComment = function(pData) {
			if (false === _this.bindDeliver('listComment')) {
				_this._listComment(pData);
			}
		}

		this.informCmt = function(pData) {
			if (false === _this.bindDeliver('informCmt')) {
				_this._informCmt(pData);
			}
		}

		this.insertCmt = function(pData) {
			if (false === _this.bindDeliver('insertCmt')) {
				_this._insertCmt(pData);
			}
		}

		this.updateCmt = function(pData) {
			if (false === _this.bindDeliver('updateCmt')) {
				_this._updateCmt(pData);
			}
		}

		this.deleteCmt = function(pData) {
			if (false === _this.bindDeliver('deleteCmt')) {
				_this._deleteCmt(pData);
			}
		}

		this.insertReprt = function(pData) {
			if (false === _this.bindDeliver('insertReprt')) {
				_this._insertReprt(pData);
			}
		}

		this.insertRecm = function(pData) {
			if (false === _this.bindDeliver('insertRecm')) {
				_this._insertRecm(pData);
			}
		}

		this.insertAdcmt = function(pData) {
			if (false === _this.bindDeliver('insertAdcmt')) {
				_this._insertAdcmt(pData);
			}
		}

		this.deleteAdcmt = function(pData) {
			if (false === _this.bindDeliver('deleteAdcmt')) {
				_this._deleteAdcmt(pData);
			}
		}

		this.listMusic = function(pData) {
			if (false === _this.bindDeliver('listMusic')) {
				_this._listMusic(pData);
			}
		}

		this.informOembed = function(pData) {
			if (false === _this.bindDeliver('informOembed')) {
				_this._informOembed(pData);
			}
		}

		this.addReviewRate = function(pData) {
			_this._addReviewRate(pData);
		}

		this.modReviewRate = function(pData) {
			_this._modReviewRate(pData);
		}

		this.listReviewRate = function(pData) {
			if (false === _this.bindDeliver('listReviewRate')) {
				_this._listReviewRate(pData);
			}
		}

		this.addCmt = function(pData) {
			_this._addCmt(pData);
		}

		this.authUpload = function(pData) {
			if (false === _this.bindDeliver('authUpload')) {
				_this._authUpload(pData);
			}
		}

		this.getReservationInfos = function(pData) {
			if (false === _this.bindDeliver('getReservationInfos')) {
				_this._getReservationInfos(pData);
			}
		}

	};

	// Extends Model
	CommentModel.prototype = new Model;
	CommentModel.prototype.constructor = CommentModel;

	return (CommentModel);
});