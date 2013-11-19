var NodeCanvas = {};

NodeCanvas.Client = function () {
    this.endPointBase = "",
    this.apiVersion = "0.01",
    this._initialize();
};

NodeCanvas.Client.prototype = {
    _initialize: function () {
        var host = "http://localhost:5000";
        this.endPointBase = host + "/imageProcess/";
    },

    compositeOperation: function (img1, img2, op, callback) {
        var params = {
            "img1": img1,
            "img2": img2,
            "op": op
        };
        return this.callServer("globalCompositeOperation", params, callback);
    },

    callServer: function (apipath, params, callback) {
        var apiUrl = this.endPointBase + apipath;
        return this._ajax({
            type: 'POST',
            url: apiUrl,
            data: params,
            success: callback,
            error: function(jqXHR, retStatus, errThrown) {
                console.log('AJAX error: ' + errThrown + 'on call: ' + apipath);
                if (callback && typeof callback == 'function') {
                    callback(undefined);
                }
            }
        });
    },

    _ajax: function (options) {
        var response;
        var isAsync = (options.success && typeof options.success == 'function') ? true : false;
        var onError = function (data) {
            if (options.error && typeof options.error == 'function') {
                options.error(data);
            }
        };

        var onSuccess = function (data) {
            if (data && data.errorCode) {
                onError(data);
                return;
            }

            if (isAsync) {
                options.success(data);
            } else {
                response = data;
            }
        };

        var commonOptions = {
            async: isAsync,
            cache: false,
            dataType: 'json',
            success: onSuccess,
            error: onError
        };

        var innerOpts = $.extend(commonOptions, options);
        $.ajax(innerOpts);

        return response;
    }
};


NodeCanvas.Client.instance = NodeCanvas.Client.instance || function() {

    if (!NodeCanvas.Client._instance) {
        NodeCanvas.Client._instance = new NodeCanvas.Client();
    }
    return NodeCanvas.Client._instance;
};
