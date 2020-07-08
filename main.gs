/* ------------------------------------------------------- */
// setting: LINE BOT
var LINEBOT_CHANNEL_TOKEN = 'XXXXXXXXXXXXXXXX'; 

// setting: Line Notify ※必要であれば
var LINE_NOTIFY_TOKEN = "XXXXXXXXXXXXXXXX";

// setting: GAMIL ※未読 かつ ラベル名
var GMAIL_QUERY = "is:unread label:ラベル名";
/* ------------------------------------------------------- */

// func: LINE BOT
function pushMessageLineBot( _message ) {
    var _postData = {
        "messages": [{
        "type": "text",
        "text": _message,
        }]
    };

    var _url = "https://api.line.me/v2/bot/message/broadcast";
    var _headers = {
        "Content-Type": "application/json",
        'Authorization': 'Bearer ' + LINEBOT_CHANNEL_TOKEN,
    };

    var _options = {
        "method": "post",
        "headers": _headers,
        "payload": JSON.stringify(_postData)
    };
    var response = UrlFetchApp.fetch(_url, _options);
}

// func: LINE Notify ※必要であれば
function pushLineNotify(_message){
    var _options = {
        "method"  : "post",
        "payload" : {'message' : _message},
        "headers" : {"Authorization" : "Bearer "+ LINE_NOTIFY_TOKEN}  
    };
    UrlFetchApp.fetch("https://notify-api.line.me/api/notify", _options);
}

// func: get GMAIL message
function getMessageGmail() {

    // Search Gmail with the given query.
    var _gmailThread = GmailApp.search(GMAIL_QUERY);
    var _messages = GmailApp.getMessagesForThreads(_gmailThread);
    var _items = [];

    for(var _idx = 0; _idx < _messages.length;_idx++){
        _items[_idx] =            
            "\n[from]\n" + _messages[_idx].slice(-1)[0].getFrom()
            + "\n"
            + "\n[date]\n"
            + _messages[_idx].slice(-1)[0].getDate().getFullYear()
            + "/" + _messages[_idx].slice(-1)[0].getDate().getMonth()
            + "/" + _messages[_idx].slice(-1)[0].getDate().getDate() 
            + " " + _messages[_idx].slice(-1)[0].getDate().getHours()
            + ":" + _messages[_idx].slice(-1)[0].getDate().getMinutes()
            + "\n"
            + "\n[sbject]\n" + _messages[_idx].slice(-1)[0].getSubject()
            + "\n"
            + "\n[Message]\n"+ _messages[_idx].slice(-1)[0].getPlainBody()
            + "\n";
        _messages[_idx][0].markRead();
    }

    return _items;
}

// func: main
function main() {
    _items = getMessageGmail()
    if( _items.length > 0 ){
        for( var _idx = ( _items.length - 1) ; _idx >= 0; _idx-- ){
            //pushLineNotify( _items[ _idx ] );
            pushMessageLineBot( _items[ _idx ] );
        }
    }
}