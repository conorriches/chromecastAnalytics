$(document).ready(function () {
    "use strict";


    var applicationID = '3A344528';
    var namespace = 'com.conorriches.helloworld';
    var session = null;


    initializeCastApi();

    /**
     * initialization
     */
    function initializeCastApi() {
        console.log("Loaded");
        var sessionRequest = new chrome.cast.SessionRequest(applicationID);
        var apiConfig = new chrome.cast.ApiConfig(sessionRequest,
            sessionListener,
            receiverListener);

        chrome.cast.initialize(apiConfig, onInitSuccess, onError);
    };

    /**
     * initialization success callback
     */
    function onInitSuccess() {
        appendMessage("onInitSuccess");
    }

    /**
     * initialization error callback
     */
    function onError(message) {
        appendMessage("onError: " + JSON.stringify(message));
    }

    /**
     * generic success callback
     */
    function onSuccess(message) {
        appendMessage("onSuccess: " + message);
    }

    /**
     * callback on success for stopping app
     */
    function onStopAppSuccess() {
        appendMessage('onStopAppSuccess');
    }

    /**
     * session listener during initialization
     */
    function sessionListener(e) {
        appendMessage('New session ID:' + e.sessionId);
        session = e;
        session.addUpdateListener(sessionUpdateListener);
        session.addMessageListener(namespace, receiverMessage);
    }

    /**
     * listener for session updates
     */
    function sessionUpdateListener(isAlive) {
        var message = isAlive ? 'Session Updated' : 'Session Removed';
        message += ': ' + session.sessionId;
        appendMessage(message);
        if (!isAlive) {
            session = null;
        }
    };

    /**
     * utility function to log messages from the receiver
     * @param {string} namespace The namespace of the message
     * @param {string} message A message string
     */
    function receiverMessage(namespace, message) {
        appendMessage("receiverMessage: " + namespace + ", " + message);
    };

    /**
     * receiver listener during initialization
     */
    function receiverListener(e) {
        if (e === 'available') {
            appendMessage("receiver found");
        }
        else {
            appendMessage("receiver list empty");
        }
    }

    /**
     * stop app/session
     */
    function stopApp() {
        session.stop(onStopAppSuccess, onError);
    }

    /**
     * send a message to the receiver using the custom namespace
     * receiver CastMessageBus message handler will be invoked
     * @param {string} message A message string
     */
    function sendMessage(message) {
        if (session != null) {
            session.sendMessage(namespace, message, onSuccess.bind(this, "Message sent: " + message), onError);
        }
        else {
            chrome.cast.requestSession(function (e) {
                session = e;
                session.sendMessage(namespace, message, onSuccess.bind(this, "Message sent: " + message), onError);
            }, onError);
        }
    }

    /**
     * append message to debug message window
     * @param {string} message A message string
     */
    function appendMessage(message) {
        console.log(message);
    };


    function update() {
        sendMessage(document.getElementById("input").value);
    }


});