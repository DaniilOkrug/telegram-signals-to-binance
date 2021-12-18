const formatterSigns = {
    "{{symbol}}": "{{symbol}}",
    "{{action}}": "{{action}}",
    "{{price}}": "{{price}}",
    "{{timeframe}}": "{{timeframe}}",
    "{{takeprofit}}": "{{takeprofit}}",
    "{{stoploss}}": "{{stoploss}}",
    "{{leverage}}": "{{leverage}}"
}

function signalParser(message, formatter) {
    const signal = {
        symbol: '',
        action: '',
        timeframe: '',
        leverage: '1',
        price: [],
        takeprofit: [],
        stoploss: []
    };

    const messageTokens = message.split('\n');
    const formatterTokens = formatter.split('\n');

    formatterTokens.forEach((formatterToken) => {
        Object.keys(formatterSigns).forEach((sign) => {
            if (formatterToken.includes(sign)) {
                const textParts = formatterToken.split(sign);
                
                messageTokens.forEach((messageToken) => {
                    if (messageToken.includes(textParts[0]) && messageToken.includes(textParts[1])) {
                        const value = messageToken.replace(new RegExp(textParts[0], 'g'), '').replace(new RegExp(textParts[1], 'g'), '');
                        
                        switch (sign) {
                            case '{{symbol}}':
                                signal.symbol = value;
                                break;
                            case '{{action}}':
                                signal.action = value;
                                break;
                            case '{{price}}':
                                signal.price.push(value);
                                break;
                            case '{{leverage}}':
                                signal.leverage = value;
                            case '{{takeprofit}}':
                                signal.takeprofit.push(value);
                                break;
                            case '{{stoploss}}':
                                signal.stoploss.push(value);
                                break;
                        }
                    }
                });
            }
        });
    });

    return signal;
}

module.exports = {
    signalParser
}