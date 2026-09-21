import { useState } from "react";
import { evaluate } from "mathjs";

function Calculator() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleNumber = (value) => {
    setExpression((prev) => prev + value);
    setResult("");
  };

  const handleOperator = (operator) => {
    setExpression((prev) => {
      if (!prev) {
        return operator === "-" ? "-" : "";
      }

      const last = prev.slice(-1);

      if (["+", "-", "*", "/"].includes(last)) {
        return prev.slice(0, -1) + operator;
      }

      return prev + operator;
    });

    setResult("");
  };

  const handleDecimal = () => {
    setExpression((prev) => {
      const parts = prev.split(/[+\-*/()]/);
      const currentNumber = parts[parts.length - 1];

      if (currentNumber.includes(".")) {
        return prev;
      }

      if (!prev || ["+", "-", "*", "/", "("].includes(prev.slice(-1))) {
        return prev + "0.";
      }

      return prev + ".";
    });

    setResult("");
  };

  const handlePercentage = () => {
    setExpression((prev) => {
      if (!prev) return "";

      const match = prev.match(/(\d+\.?\d*)$/);

      if (!match) return prev;

      const number = match[1];
      const percentage = Number(number) / 100;

      return prev.slice(0, prev.length - number.length) + percentage;
    });

    setResult("");
  };

  const handleBracket = (bracket) => {
    setExpression((prev) => prev + bracket);
    setResult("");
  };

  const handlePlusMinus = () => {
    setExpression((prev) => {
      if (!prev) {
        return "-";
      }

      const match = prev.match(/(\d+\.?\d*)$/);

      if (!match) {
        return prev;
      }

      const number = match[1];
      const startIndex = prev.length - number.length;

      if (startIndex === 0) {
        return "-" + number;
      }

      const beforeNumber = prev.slice(0, startIndex);

      if (beforeNumber.endsWith("-")) {
        return beforeNumber.slice(0, -1) + number;
      }

      return beforeNumber + "-" + number;
    });

    setResult("");
  };

  const handleClear = () => {
    setExpression("");
    setResult("");
  };

  const handleBackspace = () => {
    setExpression((prev) => prev.slice(0, -1));
    setResult("");
  };

  const handleCalculate = () => {
    if (!expression) return;

    try {
      const answer = evaluate(expression);

      if (!Number.isFinite(answer)) {
        setResult("Cannot divide by zero");
        return;
      }

      const formattedAnswer = Number.isInteger(answer)
        ? answer.toString()
        : Number(answer.toFixed(10)).toString();

      setResult(formattedAnswer);
      setHistory((prev) => [{ expression, result: formattedAnswer }, ...prev]);
    } catch (error) {
      setResult("Invalid expression");
    }
  };

  const handleHistoryClick = (item) => {
    setExpression(item.expression);
    setResult(item.result);
  };

  const handleButtonClick = (value) => {
    if (/^\d$/.test(value)) {
      handleNumber(value);
      return;
    }

    switch (value) {
      case "C":
        handleClear();
        break;
      case "⌫":
        handleBackspace();
        break;
      case "%":
        handlePercentage();
        break;
      case "/":
      case "x":
        handleOperator(value === "x" ? "*" : "/");
        break;
      case "+":
      case "-":
      case "*":
        handleOperator(value);
        break;
      case ".":
        handleDecimal();
        break;
      case "(":
      case ")":
        handleBracket(value);
        break;
      case "±":
        handlePlusMinus();
        break;
      case "=":
        handleCalculate();
        break;
      default:
        break;
    }
  };

  return (
    <div className="Calculator-container">
      <div className="Calculator shell">
        <div className={`sidebar-panel ${isHistoryOpen ? "open" : ""}`}>
          <div className="sidebar-topbar">
            <button className="menu-button" onClick={() => setIsHistoryOpen((prev) => !prev)} aria-label="Toggle history">
              ≡
            </button>
          </div>
          <div className="history-header">History</div>
          {history.length > 0 ? (
            history.map((item, index) => (
              <button key={`${item.expression}-${index}`} className="history-item" onClick={() => handleHistoryClick(item)}>
                {item.expression} = {item.result}
              </button>
            ))
          ) : (
            <div className="history-empty">No calculations yet</div>
          )}
        </div>

        <div className="main-panel">
          <div className="window-header">
            <div className="window-title">Calculator</div>
          </div>

          <div className="mode-bar" />

          <div className="display-wrap">
          <div className="display">{expression || "0"}</div>
          {result && <div className="result">= {result}</div>}
        </div>

          <div className="buttons">
            <button onClick={() => handleButtonClick("C")}>C</button>
            <button onClick={() => handleButtonClick("⌫")}>⌫</button>
            <button onClick={() => handleButtonClick("%")}>%</button>
            <button className="operator" onClick={() => handleButtonClick("/")}>÷</button>

            <button onClick={() => handleButtonClick("7")}>7</button>
            <button onClick={() => handleButtonClick("8")}>8</button>
            <button onClick={() => handleButtonClick("9")}>9</button>
            <button className="operator" onClick={() => handleButtonClick("x")}>x</button>

            <button onClick={() => handleButtonClick("4")}>4</button>
            <button onClick={() => handleButtonClick("5")}>5</button>
            <button onClick={() => handleButtonClick("6")}>6</button>
            <button className="operator" onClick={() => handleButtonClick("-")}>-</button>

            <button onClick={() => handleButtonClick("1")}>1</button>
            <button onClick={() => handleButtonClick("2")}>2</button>
            <button onClick={() => handleButtonClick("3")}>3</button>
            <button className="operator" onClick={() => handleButtonClick("+")}>+</button>

            <button onClick={() => handleButtonClick("±")}>±</button>
            <button onClick={() => handleButtonClick("0")}>0</button>
            <button onClick={() => handleButtonClick(".")}>.</button>
            <button className="equal" onClick={() => handleButtonClick("=")}>=</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calculator;
