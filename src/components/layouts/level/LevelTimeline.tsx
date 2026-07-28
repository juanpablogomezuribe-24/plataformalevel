import React from 'react';

interface TimelineEvent {
  text: React.ReactNode;
  type: 'default' | 'warning' | 'danger' | 'info';
}

export interface LevelTimelineData {
  title: string;
  events: TimelineEvent[];
}

export const LevelTimeline: React.FC<{ data: LevelTimelineData }> = ({ data }) => {
  const getStyles = (type: string) => {
    switch (type) {
      case 'warning': return { dot: "bg-amber-500", box: "bg-amber-50 border-amber-100 text-amber-900" };
      case 'danger': return { dot: "bg-red-500", box: "bg-red-50 border-red-100 text-red-900" };
      case 'info': return { dot: "bg-indigo-500", box: "bg-indigo-50 border-indigo-100 text-indigo-900" };
      default: return { dot: "bg-cyan-500", box: "bg-slate-50 border-slate-100" };
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 mt-12">
      <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">{data.title}</h2>
      <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden relative">
        <div className="absolute left-8 md:left-1/2 top-8 bottom-8 w-1 bg-slate-100 -translate-x-1/2 rounded-full"></div>
        
        <div className="space-y-4 relative">
          {data.events.map((event, idx) => {
            const isLeft = idx % 2 === 0;
            const styles = getStyles(event.type);
            return (
              <div key={idx} className={`flex items-center relative left-12 md:left-0 mb-4 ${isLeft ? 'md:justify-end md:w-1/2 md:pr-8' : 'md:w-1/2 md:pl-8 md:ml-auto'}`}>
                <div className={`absolute w-4 h-4 rounded-full border-4 border-white shadow-sm z-10 ${styles.dot} ${isLeft ? '-left-[45px] md:-right-[37px] md:left-auto' : '-left-[45px] md:-left-[21px]'}`}></div>
                <div className={`p-3 rounded-xl shadow-sm text-sm w-full border ${styles.box}`}>
                  {event.text}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
