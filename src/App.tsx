import { useState } from 'react'
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState('main');
  const [totalScore, setTotalScore] = useState(() => {
    const relaxScore = parseInt(localStorage.getItem('relaxScore')) || 0;
    const workScore = parseInt(localStorage.getItem('workScore')) || 0;
    return relaxScore + workScore;
  });

  useEffect(() => {
    const updateTotalScore = () => {
      const relaxScore = parseInt(localStorage.getItem('relaxScore')) || 0;
      const workScore = parseInt(localStorage.getItem('workScore')) || 0;
      setTotalScore(relaxScore + workScore);
    };

    const interval = setInterval(updateTotalScore, 1000);
    window.addEventListener('storage', updateTotalScore);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', updateTotalScore);
    };
  }, []);

  const MainPage = () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200">
      <div className="h-2 bg-gradient-to-r from-blue-200 via-cyan-200 to-pink-200" />
      
      <div className="max-w-lg mx-auto p-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800">探索你的第二人生</h1>
        </div>
        
        <div className="flex flex-col gap-4">
          <button
            onClick={() => setCurrentPage('relax')}
            className="p-6 bg-blue-200 rounded-xl hover:bg-blue-300 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M3 7v14M21 7v14M3 17h18M3 7h18" strokeLinecap="round" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white">躺平區</h2>
            </div>
          </button>

          <button
            onClick={() => setCurrentPage('work')}
            className="p-6 rounded-xl transition-colors" style={{backgroundColor: '#9FD4A3', ':hover': {backgroundColor: '#8FC393'}}}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <circle cx="12" cy="6" r="2" />
                  <path d="M8 14l3-3 2 2 1-4" strokeLinecap="round" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white">勞動區</h2>
            </div>
          </button>

          <button
            onClick={() => setCurrentPage('scan')}
            className="p-6 bg-pink-200 rounded-xl hover:bg-pink-300 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M8 7h8M8 12h8M8 17h8" strokeLinecap="round"/>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-white">分級說明</h2>
            </div>
          </button>

          <div className="bg-white rounded-xl p-5 shadow flex justify-center items-center gap-2">
            <span className="text-xl text-slate-800">個人累積分數：</span>
            <span className="text-2xl font-semibold text-yellow-500">{totalScore}</span>
          </div>
        </div>

        <footer className="mt-8 pt-6 text-center text-sm text-slate-500 border-t border-slate-200">
          <div className="mb-4">開始你的新旅程 © 2024</div>
          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2">關於我們</h3>
            <p className="leading-relaxed">
              五旬節聖潔會迦福堂<br />
              地址：九龍觀塘成業街10號電訊一代廣場23樓<br />
              ig：kafook.andrew.fellowship
            </p>
          </div>
        </footer>
      </div>
    </div>
  );

  const Timer = ({ type }) => {
    const [timeCount, setTimeCount] = useState(() => {
      const saved = localStorage.getItem(`${type}Time`);
      return saved ? parseInt(saved) : 0;
    });
    
    const [currentScore, setCurrentScore] = useState(() => {
      const saved = localStorage.getItem(`${type}Score`);
      return saved ? parseInt(saved) : 0;
    });
    
    const [isActive, setIsActive] = useState(false);
    const intervalRef = useRef(null);
    const lastScoreRef = useRef(0);
    const interval = type === 'relax' ? 90 : 60; // 1.5分鐘或1分鐘
    const scoreIncrement = type === 'relax' ? 3 : 4; // 躺平區3分，勞動區4分
    const bgColor = type === 'relax' ? '#93C5FD' : '#9FD4A3'; // Pastel 藍色
    const bgColorHover = type === 'relax' ? '#7AB3FC' : '#8FC393';

    useEffect(() => {
      if (isActive) {
        const tick = () => {
          setTimeCount(prevTime => {
            const newTime = prevTime + 1;
            localStorage.setItem(`${type}Time`, newTime.toString());

            // 檢查是否需要加分
            const currentInterval = Math.floor(newTime / interval);
            const lastInterval = Math.floor(lastScoreRef.current / interval);

            if (currentInterval > lastInterval) {
              setCurrentScore(prevScore => {
                const newScore = prevScore + scoreIncrement;
                localStorage.setItem(`${type}Score`, newScore.toString());
                return newScore;
              });
              lastScoreRef.current = currentInterval * interval;
            }

            return newTime;
          });
        };

        // 設置初始計分點
        if (lastScoreRef.current === 0) {
          lastScoreRef.current = Math.floor(timeCount / interval) * interval;
        }

        intervalRef.current = setInterval(tick, 1000);

        return () => {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        };
      }
    }, [isActive, interval, type, scoreIncrement]);

    const formatTime = (seconds) => {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200">
        <div className="h-2" style={{
          background: type === 'relax' 
            ? 'linear-gradient(to right, #BFDBFE, #93C5FD)'
            : 'linear-gradient(to right, #9FD4A3, #8FC393)'
        }} />

        <div className="p-6">
          <button 
            onClick={() => setCurrentPage('main')}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft size={20} />
            <span>返回</span>
          </button>

          <div className="max-w-lg mx-auto mt-6 text-center">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-800">
                {type === 'relax' ? '躺平區' : '勞動區'}
              </h1>
              <p className="text-slate-500">
                {type === 'relax' ? '放鬆心情，享受時光' : '專注工作，創造價值'}
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-sm mb-6">
              <div className="mb-6">
                <div className="text-5xl font-mono text-slate-800 tracking-wider">
                  {formatTime(timeCount)}
                </div>
                <div className="text-xl mt-4">
                  累積分數: 
                  <span className={`font-semibold text-${bgColor}-500 ml-2`}>
                    {currentScore}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsActive(!isActive)}
                className="w-full py-4 px-6 rounded-xl text-white font-medium transition-colors"
                style={{
                  backgroundColor: isActive ? '#FDA4AF' : bgColor,
                  ':hover': {
                    backgroundColor: isActive ? '#FB7185' : bgColorHover
                  }
                }}
              >
                {isActive ? '暫停' : '開始'}
              </button>
            </div>

            <div className="rounded-xl p-6" style={{backgroundColor: type === 'relax' ? '#EFF6FF' : '#F0F9F1'}}>
              <div className="flex gap-4 items-start">
                <div className="p-2 rounded-lg mt-1" style={{backgroundColor: type === 'relax' ? '#BFDBFE' : '#9FD4A3'}}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-slate-800 mb-1">計時規則</h3>
                  <p className="text-sm text-slate-500">
                    {type === 'relax' 
                      ? '每1.5分鐘可獲得3分，時間會自動累積。' 
                      : '每1分鐘可獲得4分，時間會自動累積。'
                    }
                    離開頁面後重新進入，記錄會保留。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ScanPage = () => (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200">
      <div className="h-2 bg-gradient-to-r from-blue-200 via-cyan-200 to-pink-200" />
      
      <div className="p-6">
        <button 
          onClick={() => setCurrentPage('main')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft size={20} />
          <span>返回</span>
        </button>
        
        <div className="max-w-4xl mx-auto mt-8">
          <h2 className="text-2xl font-bold text-center mb-8">分級說明</h2>
          
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-6">生命設計師 - 生命元素</h3>
            
            <div className="grid grid-cols-4 border rounded-lg overflow-hidden text-sm">
              {/* 第一列：標題 */}
              <div className="p-4 bg-gray-100 font-bold">生命元素</div>
              <div className="p-4 bg-gray-100 font-bold">Lv1 (差於平均)<br/>累積2分</div>
              <div className="p-4 bg-gray-100 font-bold">Lv2 (平均水準)<br/>累積4分</div>
              <div className="p-4 bg-gray-100 font-bold">Lv3 (最高水平)<br/>累積8分</div>
              
              {/* 壽數和病痛 (綠色背景) */}
              <div className="p-4 bg-green-50">壽數</div>
              <div className="p-4 bg-green-50">壽命比平均短20年</div>
              <div className="p-4 bg-green-50">壽命接近平均</div>
              <div className="p-4 bg-green-50">壽命比平均長20年</div>

              <div className="p-4 bg-green-50">病痛</div>
              <div className="p-4 bg-green-50">長期病患，行動不便</div>
              <div className="p-4 bg-green-50">偶有健康問題，需定期關注</div>
              <div className="p-4 bg-green-50">健康典範，身心無憂</div>

              {/* 家庭相關 (粉色背景) */}
              <div className="p-4 bg-red-50">家庭</div>
              <div className="p-4 bg-red-50">關係疏遠或不和</div>
              <div className="p-4 bg-red-50">關係穩定，但感情一般</div>
              <div className="p-4 bg-red-50">同甘共苦，感情深厚</div>

              <div className="p-4 bg-red-50">愛情</div>
              <div className="p-4 bg-red-50">關係不穩，充滿矛盾</div>
              <div className="p-4 bg-red-50">關係穩定，但深度不足</div>
              <div className="p-4 bg-red-50">靈魂伴侶，關係深入穩定</div>

              <div className="p-4 bg-red-50">友情及其他關係</div>
              <div className="p-4 bg-red-50">基本互動，功能性關係</div>
              <div className="p-4 bg-red-50">關係穩定，但深度不足</div>
              <div className="p-4 bg-red-50">推心置腹，毫無保留的關係</div>

              {/* 收入與影響力 (藍色背景) */}
              <div className="p-4 bg-blue-50">收入及物質享受</div>
              <div className="p-4 bg-blue-50">基本溫飽，略中羞澀</div>
              <div className="p-4 bg-blue-50">穩定收入，略有餘裕</div>
              <div className="p-4 bg-blue-50">財務自由，生活充裕</div>

              <div className="p-4 bg-blue-50">影響力及權力</div>
              <div className="p-4 bg-blue-50">人微言輕</div>
              <div className="p-4 bg-blue-50">在特定領域有影響力</div>
              <div className="p-4 bg-blue-50">意見領袖，持續有效影響他人</div>

              {/* 自我相關 (黃色背景) */}
              <div className="p-4 bg-yellow-50">自我滿足/娛樂</div>
              <div className="p-4 bg-yellow-50">絕少能自我滿足/娛樂</div>
              <div className="p-4 bg-yellow-50">偶然有機會自我滿足/娛樂</div>
              <div className="p-4 bg-yellow-50">逍遙自在，持續有機會自我滿足</div>

              <div className="p-4 bg-yellow-50">自我挑戰/突破（體驗）</div>
              <div className="p-4 bg-yellow-50">絕少自我挑戰/突破的體驗</div>
              <div className="p-4 bg-yellow-50">偶有自我挑戰/突破的體驗</div>
              <div className="p-4 bg-yellow-50">持續解鎖各種人生成就</div>

              {/* 技能知識 (紫色背景) */}
              <div className="p-4 bg-purple-50">技能/知識的深度*</div>
              <div className="p-4 bg-purple-50">對某技能/知識有基本理解</div>
              <div className="p-4 bg-purple-50">具備一定深度/熟練度</div>
              <div className="p-4 bg-purple-50">深入掌握，成為專家</div>

              <div className="p-4 bg-purple-50">技能/知識的廣度*</div>
              <div className="p-4 bg-purple-50">對單一領域有認識，其餘所知甚少</div>
              <div className="p-4 bg-purple-50">在數個領域有一定認識</div>
              <div className="p-4 bg-purple-50">文武雙全，在多個領域融會貫通</div>
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              * 兩項必須同時升級，所需分數等同一項
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'relax':
        return <Timer type="relax" />;
      case 'work':
        return <Timer type="work" />;
      case 'scan':
        return <ScanPage />;
      default:
        return <MainPage />;
    }
  };

  return <div className="min-h-screen">{renderPage()}</div>;
};

export default PreviewApp;