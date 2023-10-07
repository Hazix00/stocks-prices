// eslint-disable-next-line @typescript-eslint/no-unused-vars
import StocksPricesChartComponent from '../features/components/stocks-prices-chart.component';

export function App() {
  return (
    <div>
      <header>
        <h1 style={{ textAlign: 'center' }}>Evolution du prix des actions Amazon et Google sur 2022</h1>
      </header>
      <section>
        <StocksPricesChartComponent/>
      </section>
    </div>
  );
}

export default App;
