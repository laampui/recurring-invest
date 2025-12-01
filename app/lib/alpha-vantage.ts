const ALPHA_VANTAGE_API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;

export async function getDailyAdjusted(symbol: string) {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${symbol}&outputsize=full&apikey=${ALPHA_VANTAGE_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data['Monthly Time Series'];
}
