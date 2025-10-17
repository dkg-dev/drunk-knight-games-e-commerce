import "../style/test.css";

export default function CornerFillCard() {
  return (
    <div className="corner-card group">
      <div className="corner-fill" />
      
      <div className="corner-content">
        <h2>Hover Me</h2>
        <p>The circle morphs into the card shape!</p>
      </div>
    </div>
  );
}
