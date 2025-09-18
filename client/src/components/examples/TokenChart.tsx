import TokenChart from '../TokenChart';

export default function TokenChartExample() {
  return (
    <div className="p-8 bg-background grid grid-cols-1 lg:grid-cols-2 gap-8">
      <TokenChart token="MGC" />
      <TokenChart token="RZ" />
    </div>
  );
}