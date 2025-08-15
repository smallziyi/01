import useUserStore from '@/store/modules/useUserStore.ts';
import { ref, onUnmounted } from 'vue';

const ws = ref<WebSocket | null>(null);
const reconnectAttempts = ref(0);
const maxReconnectAttempts = 200;
let heartbeatTimer: NodeJS.Timeout | null = null;
let reconnectTimer: NodeJS.Timeout | null = null;

export function useWS(teachPlanId: string) {
	const { user } = useUserStore();

	const connectWebSocket = () => {
		if (ws.value) {
			ws.value.close();
			ws.value = null;
		}

		try {
			ws.value = new WebSocket(`${window.config.wsUrl}/websocket/${teachPlanId}/${user.value!.id}`);

			ws.value.onopen = () => {
				console.log('WebSocket连接已建立');
				reconnectAttempts.value = 0;
				startHeartbeat();
			};

			ws.value.onerror = (error) => {
				console.error('WebSocket错误:', error);
				stopHeartbeat();
				tryReconnect();
			};

			ws.value.onclose = (event) => {
				console.log('WebSocket连接已关闭, 代码:', event.code, '原因:', event.reason);
				stopHeartbeat();
				if (event.code !== 1000) {
					tryReconnect();
				}
			};

			let messageTimer: NodeJS.Timeout | null = null;
			ws.value.onmessage = (event) => {
				if (event.data === 'pong') {
					return;
				}

				try {
					if (messageTimer) clearTimeout(messageTimer);
					messageTimer = setTimeout(() => {
						console.warn('WebSocket消息接收超时');
						ws.value?.close();
					}, 60000);
				} catch (error) {
					console.error('WebSocket消息解析失败:', error);
				}
			};
		} catch (error) {
			console.error('WebSocket连接创建失败:', error);
			tryReconnect();
		}
	};

	const tryReconnect = () => {
		if (reconnectAttempts.value >= maxReconnectAttempts) {
			console.log('达到最大重连次数，停止重连');
			return;
		}

		if (reconnectTimer) {
			clearTimeout(reconnectTimer);
		}

		reconnectAttempts.value++;
		console.log(`尝试第 ${reconnectAttempts.value} 次重连...`);

		const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.value), 30000);
		reconnectTimer = setTimeout(connectWebSocket, delay);
	};

	const startHeartbeat = () => {
		stopHeartbeat();
		heartbeatTimer = setInterval(() => {
			if (ws.value?.readyState === WebSocket.OPEN) {
				try {
					ws.value.send('ping');
				} catch (error) {
					console.error('心跳发送失败:', error);
					ws.value?.close();
				}
			}
		}, 5000);
	};

	const stopHeartbeat = () => {
		if (heartbeatTimer) {
			clearInterval(heartbeatTimer);
			heartbeatTimer = null;
		}
	};

	const cleanup = () => {
		stopHeartbeat();
		if (reconnectTimer) {
			clearTimeout(reconnectTimer);
			reconnectTimer = null;
		}
		if (ws.value) {
			ws.value.close(1000, '正在关闭');
			ws.value = null;
		}
	};

	connectWebSocket();

	onUnmounted(cleanup);

	return ws;
}
