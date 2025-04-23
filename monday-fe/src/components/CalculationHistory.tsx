import { Props } from '../types/history'

const CalculationHistory = ({ history }: Props) => {

  return (
    <>
    <h2 className="text-xl font-semibold mb-4 text-center">History</h2>

      <table className="results-table">
        <thead>
          <tr>
            <th>Input</th>
            <th>Factor</th>
            <th>Output</th>
          </tr>
          </thead>

      {history.map((item, index)=>(
        <tbody key={index}>
          <tr>
            <td>{item.input}</td>
            <td>{item.factor}</td>
            <td className="product-cell">{item.output}</td>
          </tr>
        </tbody>
      ))}
       </table>
      </>
  )
};

export default CalculationHistory;