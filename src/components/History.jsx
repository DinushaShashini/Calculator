function History({ history, onSelect }) {
  return (
    <div className="history">
      <h2>History</h2>

      {history.length === 0 ? (
        <p>No calculations yet.</p>
      ) : (
        history.map((item, index) => (
          <div
            className="history-item"
            key={index}
            onClick={() => onSelect(item)}
          >
            <span>{item.expression}</span>
            <strong>= {item.result}</strong>
          </div>
        ))
      )}
    </div>
  );
}

export default History;
