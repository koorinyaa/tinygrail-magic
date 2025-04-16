import { useEffect } from "react";
import { HubConnectionBuilder } from "@microsoft/signalr";

export default function StarTower() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const connection = new HubConnectionBuilder()
          .withUrl("https://tinygrail.com/actionhub")
          .withAutomaticReconnect({
            nextRetryDelayInMilliseconds: (retryContext) => {
              const delay = Math.min(retryContext.previousRetryCount * 1000, 5000);
              console.log(`连接中断，正在第${retryContext.previousRetryCount + 1}次重连 (${delay}ms)`);
              return delay;
            }
          })
          .build();

        connection.onclose(error => {
          if (error) {
            console.log('SignalR连接异常断开:', error);
          } else {
            console.log('SignalR连接正常关闭');
          }
        });

        connection.on('ReceiveStarLog', (log: any) => {
          console.log('[通天塔日志]', log);
        });

        connection.on('ReceiveCharacterInitial', (data: any) => {
          console.log('[ico]', data);
        });

        connection.on('ReceiveCharacter', (update: any) => {
          console.log('[最近活跃]', update);
        });

        await connection.start();
        return () => {
          if (connection) {
            console.log('开始执行SignalR连接清理...');
            try {
              console.log('正在断开SignalR连接...');
              connection.stop().then(() => {
                console.log('SignalR连接已成功断开');
              }).catch((stopError) => {
                console.error('断开连接时发生异常:', stopError);
              });
            } finally {
              console.log('SignalR连接清理流程完成');
            }
          }
        }
      } catch (error) {
        console.error('连接异常:', error);
      }
    };
    const stop = fetchData();
    return () => {
      console.log('StarTower组件卸载');
      if (stop) {
        stop.then((cleanup) => {
          if (typeof cleanup === 'function') {
            cleanup();
          }
        }).catch((error) => {
          console.error('清理连接时发生异常:', error);
        });
      }
    }
    
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-4 h-full">
      <h1 className="text-2xl font-bold mb-4">通天塔</h1>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
        <div className="aspect-video rounded-xl bg-muted/50" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  );
}
