
import React, { useEffect, useRef } from 'react';

const TickerTape: React.FC = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (container.current && !container.current.querySelector('script')) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
      script.type = 'text/javascript';
      script.async = true;
      script.innerHTML = JSON.stringify({
        "symbols": [
          { "proName": "BINANCE:BTCUSDT", "title": "BTC/USDT" },
          { "proName": "BINANCE:ETHUSDT", "title": "ETH/USDT" },
          { "proName": "BITSTAMP:BTCUSD", "title": "Bitcoin" },
          { "proName": "FX_IDC:EURUSD", "title": "EUR/USD" },
          { "proName": "FOREXCOM:SPXUSD", "title": "S&P 500" },
          { "proName": "BINANCE:SOLUSDT", "title": "SOL/USDT" }
        ],
        "showSymbolLogo": true,
        "colorTheme": "dark",
        "isTransparent": false,
        "displayMode": "adaptive",
        "locale": "en"
      });
      container.current.appendChild(script);
    }
  }, []);

  return (
    <div className="tradingview-widget-container bg-[#1e222d] border-b border-[#2a2e39]" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
};

export default TickerTape;
