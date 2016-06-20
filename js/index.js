'use strict';

var board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

var X_VAL = 1;
var O_VAL = 2;
var NO_VAL = 0;
var TIE_VAL = -1;

var HUMAN_PLAYER = X_VAL;
var AI_PLAYER = O_VAL;
var AI_MOVE = false;

var checkVictory = function checkVictory(board) {
    var allNotZeros = true;
    //check for rows
    for (var i = 0; i < 3; i++) {
        if (board[i][0] !== NO_VAL && board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
            return board[i][0];
        }
    }
    //check for cols
    for (var j = 0; j < 3; j++) {
        if (board[0][j] !== NO_VAL && board[0][j] === board[1][j] && board[1][j] === board[2][j]) {
            return board[0][j];
        }
    }
    //check for left->bottom diagonal
    if (board[0][0] !== NO_VAL && board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
        return board[0][0];
    }
    //check for right->bottom diagnol
    if (board[2][2] !== NO_VAL && board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
        return board[0][2];
    }
    //check for tie
    for (var k = 0; k < 3; k++) {
        for (var l = 0; l < 3; l++) {
            if (board[k][l] === NO_VAL) {
                allNotZeros = false;
            }
        }
    }
    if (allNotZeros) return TIE_VAL;

    //return no victory
    return NO_VAL;
};

var getBestMove = function getBestMove(board, player) {
    var rv = checkVictory(board);
    if (rv !== NO_VAL) {
        switch (rv) {
            case HUMAN_PLAYER:
                return [-10, board];
            case AI_PLAYER:
                return [10, board];
            case TIE_VAL:
                return [0, board];
        }
    } else {
        var nextVal = null;
        var nextBoard = null;
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (board[i][j] === NO_VAL) {
                    board[i][j] = player;
                    var value;
                    if (player === AI_PLAYER) {
                        value = getBestMove(board, HUMAN_PLAYER)[0];
                        if (nextVal === null || value > nextVal) {
                            nextBoard = board.map(function (arr) {
                                return arr.slice();
                            });
                            nextVal = value;
                        }
                    } else {
                        value = getBestMove(board, AI_PLAYER)[0];
                        if (nextVal === null || value < nextVal) {
                            nextBoard = board.map(function (arr) {
                                return arr.slice();
                            });
                            nextVal = value;
                        }
                    }
                    board[i][j] = NO_VAL;
                }
            }
        }
        return [nextVal, nextBoard];
    }
};

var updateView = function updateView() {
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            $('#' + i + '' + j).text(board[i][j] === AI_PLAYER ? 'O' : board[i][j] === HUMAN_PLAYER ? 'X' : '');
            if (board[i][j] !== NO_VAL) {
                $('#' + i + '' + j).removeClass('filled').addClass('filled');
            }
        }
    }
};

var updateMove = function updateMove() {
    updateView();
    var rv = checkVictory(board);
    //update info according to rv
    $(".info").text(rv === AI_PLAYER ? "AI Won!" : rv == HUMAN_PLAYER ? "You Won!" : rv === TIE_VAL ? "Tie!" : "");
    if (rv != NO_VAL) {
        $('.button-container a').addClass('show');
        $('.cell').each(function () {
            $(this).addClass('no-click');
        });
    }
};

var makeAiMove = function makeAiMove() {
    board = getBestMove(board, AI_PLAYER)[1];
    AI_MOVE = false;
    $('.content').addClass('hide');
    $('.loading').addClass('show');
    updateMove();
};

$(document).ready(function () {
    updateMove();
    $('.cell').on('click', function (e) {
        var cell = $(this).attr('id');
        var cellParts = cell.split('');
        var x = parseInt(cellParts[0]);
        var y = parseInt(cellParts[1]);
        if ($('#' + cell).hasClass('filled')) {
            return;
        }
        if (!AI_MOVE) {
            board[x][y] = HUMAN_PLAYER;
            updateMove();
            AI_MOVE = true;
            makeAiMove();
        }
    });
    $('#restart').on('click', function (e) {
        e.preventDefault();
        board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        HUMAN_PLAYER = X_VAL;
        AI_PLAYER = O_VAL;
        AI_MOVE = false;
        $('.player-selection').removeClass('hide');
        $('.player.x').find('.value').text('N/A');
        $('.player.o').find('.value').text('N/A');
        $('.content').removeClass('hide');
        $('.loading').removeClass('show');
        $('.button-container a').removeClass('show');
        $('.cell').each(function () {
            $(this).removeClass('filled').removeClass('no-click');
        });
        updateMove();
    });
    $('#x').on('click', function (e) {
        e.preventDefault();
        console.log('clicked');
        HUMAN_PLAYER = X_VAL;
        AI_PLAYER = O_VAL;
        AI_MOVE = false;
        $('.player-selection').addClass('hide');
        $('.player.x').find('.value').text('You');
        $('.player.o').find('.value').text('Computer');
        $('.content').addClass('hide');
        $('.loading').addClass('show');
    });
    $('#o').on('click', function (e) {
        e.preventDefault();
        HUMAN_PLAYER = O_VAL;
        AI_PLAYER = X_VAL;
        AI_MOVE = true;
        $('.content').addClass('hide');
        $('.loading').addClass('show');
        $('.player.x').find('.value').text('Computer');
        $('.player.o').find('.value').text('You');
        makeAiMove();
        $('.player-selection').addClass('hide');
    });
});