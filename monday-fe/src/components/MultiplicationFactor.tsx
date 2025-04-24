import { useState, useEffect } from "react";
import mondaySdk from 'monday-sdk-js'
//hooks
import useMutation from '../../hooks/useMutations'
import useMondayItem from '../../hooks/useMondayItem'
import useFetcher from '../../hooks/useFetcher'
//components
import CalculationHistory from './CalculationHistory'
import Loader from './Loader'
//constants
import { getItemHistoryUrl, getItemUrl, updateFactorUrl } from '../constants/apis'

const monday = mondaySdk();

const MultiplicationFactor = () => {
  const { item, error } = useMondayItem()

  //states
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [multiplicationFactor, setMultiplicationFactor] = useState<string>('');
  const [history, setHistory] = useState<{factor: number, input: number, output: number }[]>([]);
  
  //hooks
  const { putRequest } = useMutation()
  const { fetcher } = useFetcher<any>()

  //functions
  const fetchHistory = async () => {
    if (!item?.id) return;

    const response = await fetcher(getItemHistoryUrl(item.id));

    if (!response) { 
      setHistory([]);
    } else {
      setHistory(response);
    }
  }

  const fetchFactor = async () => {
    if (!item?.id) return;
    try {
      const response = await fetcher(getItemUrl(item.id));
      setMultiplicationFactor(response?.factor?.toString() || '');
    } catch (err) {
      monday.execute("notice", {
        message: "Failed to fetch factor. Please try again.",
        type: "error",
        timeout: 5000
      });
    }
  };

  const handleMultiplicationFactorChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setMultiplicationFactor(e.target.value);
  };

  const handleCalculate = async () => {
    if (!multiplicationFactor || !item?.id) return;
    setIsLoading(true);
    let interval: NodeJS.Timeout;
    let currentProgress = 0;
    interval = setInterval(() => {
      if (currentProgress >= 100) {
        clearInterval(interval);
      } else {
        currentProgress += 10;
        setProgress(currentProgress);
      }
    }, 500);
    try {
      const response = await putRequest(updateFactorUrl(item.id), {
        options: {
          data: {
            factor: Number(multiplicationFactor),
            boardId: item.fullContext.boardId,
            changeEvent: 'factor'
          }
        }
      });
      if (!response) {
        monday.execute("notice", {
          message: "Failed to update calculation. Please try again.",
          type: "error",
          timeout: 10000
        });
        return;
      }

      if (response?.error) {
        monday.execute("notice", {
          message: response.error,
          type: "error",
          timeout: 10000
        });
        return;
      }

      if (response?.history) {
        setHistory(prev => {
          const newHistory = [response.history, ...prev];
          return newHistory;
        });
        
        monday.execute("notice", {
          message: "Calculation completed successfully!",
          type: "success",
          timeout: 3000
        });
      }
    } catch (error) {
      monday.execute("notice", {
        message: "Failed to update calculation. Please try again.",
        type: "error",
        timeout: 10000
      });
    } finally {
      clearInterval(interval);
      setIsLoading(false);
      setProgress(0);
    }
  };

  useEffect(() => {
    if (!item?.id) return;
    fetchFactor();
    fetchHistory();
  }, [item?.id]);


  if (error) {
    return <div className="error-message">Error: {error}</div>
  }

  return (
    <div className="multiplication-container">
      <Loader 
        isLoading={isLoading} 
        progress={progress} 
        message="Calculating..."
      />
      
      <div className="input-container">
      <h2 className="text-xl font-semibold mb-4">Set Your Factor</h2>

      {/* <label className="block text-sm font-medium text-gray-300 mb-2"htmlFor="factor-input">
  Enter Multiplier
</label> */}
        <div className="input-wrapper">
          <input
            id="factor-input"
            type="number"
            value={multiplicationFactor}
            onChange={handleMultiplicationFactorChange}
            disabled={!item?.id || isLoading}
            className="factor-input"
            inputMode="decimal"
            step="0.01"
            min="0"
            aria-label="Enter custom factor"
            placeholder="Enter custom factor"
          />
          <button
            onClick={handleCalculate} 
            disabled={!item?.id || isLoading}
          >
            Calculate
          </button>
        </div>
      </div>
      <div className="min-h-[200px] transition-all duration-300">
        {history.length === 0 ? (
          <p className="text-gray-400 text-center mt-4">No history yet</p>
        ) : (
          <CalculationHistory history={history} />
        )}
      </div>
    </div>
  )
};

export default MultiplicationFactor;