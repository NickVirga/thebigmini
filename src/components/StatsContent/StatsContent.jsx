import "./StatsContent.scss";
import {useState, useEffect, useContext} from "react";
import axios from 'axios'
import { AuthContext } from "../../context/AuthContext";

function StatsContent() {
  const { accessToken } = useContext(AuthContext);

  const [wins, setWins] = useState(null)
  const [avgScore, setAvgScore] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const getStats = async () => {
    try {
    const response = await axios.get(`${import.meta.env.VITE_SERVER_BASE_URL}/api/games/stats`,
      {
        headers: {
          Authorization: `Bearer ${
            accessToken
          }`,
        },
      })
    setWins(response.data.wins)
    setAvgScore(response.data.avgScore)
    setIsLoading(false)
    } catch(err) {
      console.error('Failed to get user statistics:', err);
    }
  }

  useEffect(() =>  {
    getStats()
    
  },[accessToken])

  return (
    <div>
      <h2 className="stats__title">Statistics</h2>
      {!isLoading && <ul className="stats__list">
        <li className="stats__item">
          <h3 className="stats__option">Wins: {wins && wins}</h3>
        </li>
        <li className="stats__item">
          <h3 className="stats__option">Score Average: {avgScore && avgScore.toFixed(1)}%</h3>
        </li>
      </ul>}
    </div>
  );
}

export default StatsContent;