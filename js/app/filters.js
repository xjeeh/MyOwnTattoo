angular.module('myownApp')

.filter('hourAndMinutes', [function () {
    return function (hour) {
        return new moment(hour, 'HH:mm:ss').format('HH:mm');
    };
}])

.filter('fullDate', function () {
    return function (date) {
        return new moment(date).format("dddd, DD MMMM YYYY")
    }
})


.filter('encodeURIComponent', function () {
    return window.encodeURIComponent;
})
.filter('decodeURIComponent', function () {
    return window.decodeURIComponent;
})


.filter('characters', function () {
    return function (input, chars, breakOnWord) {
        if (isNaN(chars)) return input;
        if (chars <= 0) return '';
        if (input && input.length > chars) {
            input = input.substring(0, chars);

            if (!breakOnWord) {
                var lastspace = input.lastIndexOf(' ');
                //get last space
                if (lastspace !== -1) {
                    input = input.substr(0, lastspace);
                }
            } else {
                while (input.charAt(input.length - 1) === ' ') {
                    input = input.substr(0, input.length - 1);
                }
            }
            return input;
        }
        return input;
    };
})

.filter('charactersWithDots', function () {
    return function (input, chars, breakOnWord) {
        if (isNaN(chars)) return input;
        if (chars <= 0) return '';
        if (input && input.length > chars) {
            input = input.substring(0, chars);

            if (!breakOnWord) {
                var lastspace = input.lastIndexOf(' ');
                //get last space
                if (lastspace !== -1) {
                    input = input.substr(0, lastspace);
                }
            } else {
                while (input.charAt(input.length - 1) === ' ') {
                    input = input.substr(0, input.length - 1);
                }
            }
            return input + " ...";
        }
        return input;
    };
})

.filter('splitcharacters', function () {
    return function (input, chars) {
        if (isNaN(chars)) return input;
        if (chars <= 0) return '';
        if (input && input.length > chars) {
            var prefix = input.substring(0, chars / 2);
            var postfix = input.substring(input.length - chars / 2, input.length);
            return prefix + '...' + postfix;
        }
        return input;
    };
})

.filter('words', function () {
    return function (input, words) {
        if (isNaN(words)) return input;
        if (words <= 0) return '';
        if (input) {
            var inputWords = input.split(/\s+/);
            if (inputWords.length > words) {
                input = inputWords.slice(0, words).join(' ');
            }
        }
        return input;
    };
})

.filter('wordsWithDots', function () {
    return function (input, words) {
        if (isNaN(words)) return input;
        if (words <= 0) return '';
        if (input) {
            var inputWords = input.split(/\s+/);
            if (inputWords.length > words) {
                input = inputWords.slice(0, words).join(' ') + " ...";
            }
        }
        return input;
    };
})