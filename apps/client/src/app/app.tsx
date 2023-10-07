// eslint-disable-next-line @typescript-eslint/no-unused-vars
import BestGainOfYearComponent from '../features/components/best-gain-of-year.component';
import StocksPricesChartComponent from '../features/components/stocks-prices-chart.component';

export function App() {
  return (
    <main style={{ padding: '1rem' }}>
      <header>
        <h1 style={{ textAlign: 'center' }}>Evolution du prix des actions Amazon et Google sur 2022</h1>
      </header>
      <section>
        <StocksPricesChartComponent/>
      </section>
      <section>
        <BestGainOfYearComponent company="GOOGLE" year={2022} capital={100000} userName="Ayman" />
        <BestGainOfYearComponent company="AMAZON" year={2022} capital={100000} userName="Anouar" />
      </section>
    </main>
  );
}

export default App;
