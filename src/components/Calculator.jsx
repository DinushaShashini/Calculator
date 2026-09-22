import { useEffect, useState } from "react";
import { evaluate } from "mathjs";

function Calculator() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("calculator-history")) || [];
    } catch {
      return [];
    }
  });
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("calculator-theme") || "dark");

  useEffect(() => {
    localStorage.setItem("calculator-history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("calculator-theme", theme);
  }, [theme]);

  const appendNumber = (value) => {
    setExpression((current) => result ? result + value : current + value);
    setResult("");
  };

  const appendOperator = (operator) => {
    setExpression((current) => {
      const baseExpression = result || current;
      if (!baseExpression) return operator === "-" ? "-" : baseExpression;
      if (/[+\-*/]$/.test(baseExpression)) return baseExpression.slice(0, -1) + operator;
      return baseExpression + operator;
    });
    setResult("");
  };

  const appendDecimal = () => {
    setExpression((current) => {
      const baseExpression = result || current;
      const currentNumber = baseExpression.split(/[+\-*/]/).pop();
      if (currentNumber.includes(".")) return current;
      return baseExpression && !/[+\-*/]$/.test(baseExpression) ? `${baseExpression}.` : `${baseExpression}0.`;
    });
    setResult("");
  };

  const calculate = () => {
    if (!expression) return;

    try {
      const answer = evaluate(expression);
      if (!Number.isFinite(answer)) throw new Error("Invalid result");

      const formatted = Number.isInteger(answer)
        ? String(answer)
        : String(Number(answer.toFixed(10)));
      setResult(formatted);
      setHistory((current) => [{ expression, result: formatted }, ...current]);
    } catch {
      setResult("Error");
    }
  };

  const handleButton = (value) => {
    if (/^\d$/.test(value)) return appendNumber(value);
    if (value === "00") return appendNumber("00");
    if (["+", "-", "*", "/"].includes(value)) return appendOperator(value);
    if (value === ".") return appendDecimal();
    if (value === "C") {
      setExpression("");
      setResult("");
    }
    if (value === "⌫") {
      setExpression((current) => current.slice(0, -1));
      setResult("");
    }
    if (value === "%") {
      setExpression((current) => current.replace(/(\d+\.?\d*)$/, (number) => String(Number(number) / 100)));
      setResult("");
    }
    if (value === "±") {
      setExpression((current) => (current.startsWith("-") ? current.slice(1) : `-${current}`));
      setResult("");
    }
    if (value === "=") calculate();
  };

  const buttons = [
    ["C", "⌫", "%", "/"],
    ["7", "8", "9", "*"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["00", "0", ".", "="],
  ];

  return (
    <div className={`calculator-shell ${theme}-theme`}>
      {isHistoryOpen && (
        <aside className="history-panel">
          <button className="history-close" onClick={() => setIsHistoryOpen(false)}>×</button>
          <h2>Calculation history</h2>
          {history.length === 0 ? (
            <p>No calculations yet</p>
          ) : (
            history.map((item, index) => (
              <button className="history-entry" key={`${item.expression}-${index}`} onClick={() => {
                setExpression(item.expression);
                setResult(item.result);
                setIsHistoryOpen(false);
              }}>
                <span>{item.expression}</span>
                <strong>= {item.result}</strong>
              </button>
            ))
          )}
        </aside>
      )}

      <div className="calculator">
        <div className="display-area">
          <div className="display-tools">
            <button aria-label="Open calculation history" onClick={() => setIsHistoryOpen(true)}>◷</button>
            <button
              className="theme-toggle"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              onClick={() => setTheme((current) => current === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? "☼" : "☾"}
            </button>
          </div>
          <div className="display-label">CALCULATOR</div>
          <div className="display-content">
            <div className={`display-value ${result ? "has-result" : ""}`}>
              {expression ? expression.replace(/\*/g, "×").replace(/\//g, "÷") : "0"}
            </div>
            {result && <div className="display-answer">{result}</div>}
          </div>
        </div>

        <div className="keypad">
          {buttons.flat().map((value, index) => (
            <button
              key={`${value}-${index}`}
                className={`key-button ${value === "=" ? "equals-button" : ["+", "-", "*", "/"].includes(value) ? "operator-button" : ["C", "⌫", "%"].includes(value) ? "action-button" : ""}`}
              onClick={() => handleButton(value)}
            >
              {value === "/" ? "÷" : value === "*" ? "×" : value}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Calculator;