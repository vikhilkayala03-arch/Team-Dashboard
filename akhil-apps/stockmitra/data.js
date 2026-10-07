/* StockMitra data: popular stocks, beginner glossary, practice prices.
   The glossary works without any key (Mitra uses it when Gemini is not set up). */
window.SM_DATA = (function () {
  'use strict';

  /* Alpha Vantage codes for Indian shares end in .BSE */
  const STOCKS = [
    { sym: 'RELIANCE.BSE', name: 'Reliance Industries', about: 'Oil refining, Jio telecom, retail stores' },
    { sym: 'TCS.BSE', name: 'TCS', about: 'IT services, India\'s largest software exporter' },
    { sym: 'HDFCBANK.BSE', name: 'HDFC Bank', about: 'Private bank' },
    { sym: 'INFY.BSE', name: 'Infosys', about: 'IT services' },
    { sym: 'ICICIBANK.BSE', name: 'ICICI Bank', about: 'Private bank' },
    { sym: 'SBIN.BSE', name: 'State Bank of India', about: 'Government-owned bank' },
    { sym: 'ITC.BSE', name: 'ITC', about: 'Cigarettes, foods (Aashirvaad, Sunfeast), hotels' },
    { sym: 'HEROMOTOCO.BSE', name: 'Hero MotoCorp', about: 'Two-wheelers (Splendor, HF Deluxe)' },
    { sym: 'MARUTI.BSE', name: 'Maruti Suzuki', about: 'Cars' },
    { sym: 'ASIANPAINT.BSE', name: 'Asian Paints', about: 'Paints' },
    { sym: 'NIFTYBEES.BSE', name: 'Nifty 50 ETF (NIFTYBEES)', about: 'One fund that holds India\'s 50 biggest companies' }
  ];

  /* Beginner glossary. key: what the app links to; aka: other words people type. */
  const G = [
    ['share', 'Share (stock)', ['stock', 'equity', 'shares'], 'A small piece of ownership in a company. If the company grows and earns more, each piece usually becomes worth more.', 'A company has 10 lakh shares and you own 1,000. You own 0.1% of it.'],
    ['exchange', 'Stock exchange (NSE, BSE)', ['nse', 'bse', 'stock market'], 'The official marketplace where shares are bought and sold. India has two big ones: NSE and BSE.', 'Reliance shares trade on both NSE and BSE at almost the same price.'],
    ['demat', 'Demat account', ['demat'], 'An online account that holds your shares, the way a bank account holds your money. You need one to buy shares or apply for IPOs.', 'You open it through a broker app with PAN, Aadhaar and a bank account.'],
    ['broker', 'Broker', ['brokerage'], 'The app or company that places your buy and sell orders on the exchange. Check that it is registered with SEBI.', 'You tap Buy in the app; the broker sends your order to NSE.'],
    ['ipo', 'IPO (Initial Public Offering)', ['initial public offering', 'public issue'], 'The first time a company sells its shares to the public. After the IPO, the shares trade on the exchange like any other.', 'A company sells shares at ₹100 in its IPO. Two weeks later they start trading on NSE.'],
    ['price-band', 'Price band', ['band'], 'The lowest and highest price you can bid at in an IPO. Most people bid at the highest price (cut-off) to improve their chance.', 'Price band ₹95 to ₹100. Bidding at ₹100 is the usual choice.'],
    ['cut-off', 'Cut-off price', ['cutoff'], 'A box you tick in an IPO form to bid at whatever final price is fixed, which is usually the top of the price band.', 'Tick cut-off and you are treated as bidding ₹100 in a ₹95 to ₹100 band.'],
    ['lot', 'Lot size', ['lot', 'lots', 'market lot'], 'The minimum number of shares you must apply for in an IPO. You can apply only in whole lots.', 'Lot size 150 at ₹100 means at least ₹15,000 to apply.'],
    ['subscription', 'Subscription (times subscribed)', ['subscribed', 'oversubscribed', 'times'], 'How many times the shares on offer were applied for. 20 times means people asked for 20 times more shares than were available.', 'Retail part subscribed 40 times: roughly 1 in 40 retail applicants gets a lot.'],
    ['qib', 'QIB (big institutions)', ['qualified institutional buyers', 'institutional'], 'Qualified Institutional Buyers: mutual funds, banks, insurance companies. High QIB demand shows professionals like the IPO.', 'QIB subscribed 80 times is a strong sign of professional interest.'],
    ['nii', 'NII / HNI', ['hni', 'non-institutional', 'nii'], 'Non-Institutional Investors: individuals or firms applying for more than ₹2 lakh in an IPO.', 'A business owner applying for ₹5 lakh is in the NII category.'],
    ['retail', 'Retail investor', ['rii', 'retail investor'], 'An individual applying for up to ₹2 lakh in an IPO. A part of every IPO is kept for retail investors.', 'You apply for 2 lots worth ₹30,000: you are a retail investor.'],
    ['allotment', 'Allotment', ['allot', 'allotted'], 'When the IPO shares are handed out. If too many people applied, retail allotment is a lottery: lucky applicants get one lot.', 'You get an SMS: 1 lot allotted. Your blocked money for it is now taken.'],
    ['listing', 'Listing day and listing gain', ['listing gain', 'listing day', 'listed'], 'Listing day is the first day the shares trade on the exchange. Listing gain is the difference between the IPO price and the first trading price. It can be a loss too.', 'IPO price ₹100, opens at ₹120 on listing day: a 20% listing gain.'],
    ['gmp', 'GMP (grey market premium)', ['grey market', 'gray market'], 'An unofficial price people quote before listing, outside any exchange. It is not regulated, can be manipulated and is often wrong.', 'A GMP of ₹30 does not mean the share will list ₹30 higher.'],
    ['ofs', 'OFS (offer for sale)', ['offer for sale'], 'Existing owners selling their own shares in the IPO. That money goes to them, not to the company.', 'An IPO of ₹1,000 crore with ₹800 crore OFS: only ₹200 crore reaches the company.'],
    ['fresh-issue', 'Fresh issue', ['new shares', 'fresh'], 'New shares created in the IPO. This money goes to the company to grow, build or repay loans.', '₹500 crore fresh issue to build two new factories.'],
    ['rhp', 'RHP / DRHP', ['red herring', 'prospectus', 'drhp'], 'The official IPO document with the company\'s business, risks, profits and how it will use the money. The "Risk factors" section is worth reading.', 'Find it on the SEBI, NSE or BSE website.'],
    ['asba', 'ASBA / UPI mandate', ['upi mandate', 'mandate', 'asba'], 'When you apply for an IPO your money is only blocked in your bank, not taken. It is taken only if you get shares, otherwise it is released.', 'Approve the UPI mandate for ₹15,000. If you get no shares, the block is removed.'],
    ['ltp', 'Market price (LTP)', ['last traded price', 'market price', 'current price', 'cmp'], 'The price at which the share last traded. It changes every second the market is open (9:15 am to 3:30 pm on weekdays).', 'LTP ₹2,450 means the last trade happened at ₹2,450.'],
    ['52w', '52-week high and low', ['52 week', '52-week', 'yearly high'], 'The highest and lowest price in the past one year. It shows whether today\'s price is near the top or bottom of the year.', 'High ₹500, low ₹300, now ₹480: near its yearly high.'],
    ['moving-average', 'Moving average', ['ma', 'dma', '200 day', '200-day', '50 day'], 'The average price over the last few days or weeks, recalculated every day. It smooths out the daily ups and downs so you can see the trend. A 40-week average is about the same as the popular 200-day average.', 'Price ₹520, 40-week average ₹480: price is above its long-term average.'],
    ['trend', 'Trend (uptrend, downtrend)', ['uptrend', 'downtrend'], 'The general direction of the price over months. Above its long-term average is usually called an uptrend; below it, a downtrend.', 'Price has stayed above its 40-week average all year: an uptrend.'],
    ['volatility', 'Volatility (how bumpy)', ['volatile', 'risk', 'swing'], 'How much the price jumps up and down. High volatility means bigger swings both ways, which is harder to sit through.', 'A stock with 40% volatility can easily move 40% up or down in a year.'],
    ['drawdown', 'Drawdown (worst fall)', ['fall', 'crash', 'correction'], 'How far the price fell from a high point before recovering. It shows the worst pain a holder went through.', 'Price fell from ₹200 to ₹120: a 40% drawdown.'],
    ['cagr', 'CAGR (yearly growth rate)', ['annual return', 'compounded'], 'The average growth per year over several years, counting growth on growth. Useful to compare with a fixed deposit.', '₹10,000 became ₹16,105 in 5 years: that is 10% CAGR.'],
    ['sip', 'SIP (Systematic Investment Plan)', ['systematic investment plan', 'monthly investment'], 'Investing a fixed amount every month instead of all at once. You buy more units when prices are low and fewer when high, so you do not have to guess the best day.', '₹1,000 on the 5th of every month into a Nifty 50 index fund.'],
    ['lump-sum', 'Lump sum', ['one time', 'one-time'], 'Investing all the money at once. It does well if prices rise afterwards and badly if they fall soon after.', 'Putting ₹60,000 in on one day instead of ₹1,000 a month for 5 years.'],
    ['mutual-fund', 'Mutual fund', ['mf', 'fund'], 'A pool of money from many people, managed by a professional who buys many shares or bonds. You own units of the pool.', 'You invest ₹5,000 and get 200 units at ₹25 NAV.'],
    ['nav', 'NAV', ['net asset value'], 'The price of one unit of a mutual fund, calculated once a day.', 'NAV ₹25 means one unit costs ₹25 today.'],
    ['index', 'Index (Nifty 50, Sensex)', ['nifty', 'sensex', 'nifty 50'], 'A number that tracks a basket of big companies to show how the market is doing. Nifty 50 follows 50 large companies on NSE; Sensex follows 30 on BSE.', '"Nifty up 1%" means those 50 companies rose about 1% on average.'],
    ['index-fund', 'Index fund / ETF', ['etf', 'exchange traded fund', 'niftybees', 'index fund'], 'A low-cost fund that simply copies an index, so you own all its companies at once. Often suggested as a first investment because one company\'s trouble hurts less.', 'NIFTYBEES is an ETF that follows the Nifty 50.'],
    ['pe', 'P/E ratio', ['p/e', 'pe ratio', 'price to earnings', 'pe'], 'Share price divided by yearly profit per share. It tells how many rupees you pay for ₹1 of the company\'s yearly profit. Compare it with similar companies, not across industries.', 'Price ₹500, profit per share ₹20: P/E is 25.'],
    ['eps', 'EPS (earnings per share)', ['earnings per share', 'earnings'], 'The company\'s yearly profit divided by the number of shares.', 'Profit ₹100 crore and 5 crore shares: EPS is ₹20.'],
    ['market-cap', 'Market cap (large, mid, small)', ['market capitalisation', 'market capitalization', 'large cap', 'small cap', 'mid cap'], 'Share price times the number of shares: the total value the market puts on the company. Large caps are usually steadier; small caps swing more.', '10 crore shares at ₹500 = ₹5,000 crore market cap.'],
    ['dividend', 'Dividend', ['dividends', 'payout'], 'A part of the company\'s profit paid to shareholders, usually once or twice a year.', 'Dividend ₹10 per share: 100 shares pay you ₹1,000.'],
    ['bonus-split', 'Bonus shares and stock split', ['bonus', 'split'], 'The company gives extra shares free or splits each share into smaller ones. The price drops in the same ratio, so your total value stays the same.', '1:1 bonus: 10 shares at ₹1,000 become 20 shares at ₹500.'],
    ['bull-bear', 'Bull and bear market', ['bull', 'bear', 'bullish', 'bearish'], 'Bull market: prices rising for months. Bear market: prices falling for months, usually 20% or more from the top.', 'In March 2020, Indian markets fell sharply: a bear phase.'],
    ['diversification', 'Diversification', ['diversify', 'spread'], 'Spreading money over many companies and types of investment, so one bad result does not hurt too much.', 'Ten companies from different industries instead of one.'],
    ['stop-loss', 'Stop-loss', ['stoploss', 'sl'], 'An order that sells your shares automatically if the price falls to a level you choose, to limit losses.', 'Bought at ₹200, stop-loss at ₹180: the app sells if price hits ₹180.'],
    ['fno', 'Intraday and F&O trading', ['intraday', 'f&o', 'futures', 'options', 'derivatives'], 'Short-term trading within a day (intraday) or with futures and options. SEBI\'s studies found about 9 out of 10 individual F&O traders lost money. Not for beginners.', 'Many "tips" on Telegram push options trading. Avoid them.'],
    ['sebi', 'SEBI', ['regulator', 'sebi registered'], 'The Securities and Exchange Board of India, the market regulator. Anyone giving paid stock advice must be SEBI-registered.', 'Check an adviser\'s registration number on the SEBI website.'],
    ['fd', 'Fixed deposit (FD)', ['fixed deposit'], 'A bank deposit with a fixed interest rate for a fixed time. Safe and predictable; a useful yardstick for share returns.', '₹1 lakh at 7% for 1 year becomes about ₹1,07,000.'],
    ['inflation', 'Inflation', ['price rise'], 'Prices of things going up over time, so the same money buys less. Your investments need to grow faster than inflation.', 'If prices rise 5% a year, ₹100 of groceries costs ₹105 next year.'],
    ['emergency-fund', 'Emergency fund', ['emergency'], 'Money kept aside in a bank for sudden needs, usually 3 to 6 months of expenses, before you invest in shares.', 'Monthly expenses ₹20,000: keep ₹60,000 to ₹1,20,000 aside first.'],
    ['capital-gains', 'Capital gains tax', ['stcg', 'ltcg', 'tax'], 'Tax on profit when you sell shares. Short-term (sold within 1 year) and long-term gains are taxed differently, and the rates change in budgets, so check the current rules.', 'Bought at ₹100, sold at ₹150: ₹50 per share is a capital gain.']
  ];
  const GLOSSARY = G.map(([key, term, aka, meaning, example]) => ({ key, term, aka, meaning, example }));
  const byKey = Object.fromEntries(GLOSSARY.map(g => [g.key, g]));

  /** Find glossary entries mentioned in some text. */
  function findTerms(text) {
    const t = ' ' + String(text).toLowerCase().replace(/[^\w&/\- ]+/g, ' ') + ' ';
    return GLOSSARY.filter(g => [g.term.toLowerCase().split(' (')[0], ...g.aka].some(w => t.includes(' ' + w.toLowerCase() + ' ') || t.includes(' ' + w.toLowerCase() + 's ')));
  }

  /* Practice prices for a MADE-UP company, so the app can be tried without a key.
     Seeded, so everyone in the team sees the same chart. Not real data. */
  function practiceSeries() {
    let s = 20240611;
    const rand = () => { s |= 0; s = (s + 0x6D2B79F5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const gauss = () => { let u = 0, v = 0; while (!u) u = rand(); while (!v) v = rand(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
    const out = [];
    const end = new Date(); end.setHours(0, 0, 0, 0); end.setDate(end.getDate() - ((end.getDay() + 2) % 7)); // last Friday
    const start = new Date(end); start.setFullYear(end.getFullYear() - 8);
    let p = 100;
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 7)) {
      const y = d.getFullYear(), m = d.getMonth();
      let drift = 0.13 / 52, vol = 0.24 / Math.sqrt(52);
      if (y === 2020 && m === 2) drift = -0.09;            // a sharp crash, like March 2020
      if (y === 2020 && m >= 4 && m <= 11) drift = 0.03;   // and the recovery
      if (y === 2022 && m <= 5) drift = -0.006;            // a slow, dull year
      p = Math.max(5, p * Math.exp(drift + vol * gauss()));
      out.push({ t: d.getTime(), c: Math.round(p * 100) / 100 });
    }
    return out;
  }

  return { STOCKS, GLOSSARY, byKey, findTerms, practiceSeries };
})();
