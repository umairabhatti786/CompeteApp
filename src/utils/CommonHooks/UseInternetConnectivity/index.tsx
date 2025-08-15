import { useEffect, useState } from "react";
import NetInfo,{NetInfoState} from "@react-native-community/netinfo";

const useInternetConnectivity = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
	const [isVisible, setIsVisible] = useState<boolean | null>(false);
	const [isInternetReachable, setIsInternetReachable] = useState<boolean | null>(true);
  const [counter, setCounter] = useState<number | null>(null)


  useEffect(() => {
		const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
			setIsConnected(state.isConnected);
			setIsInternetReachable(state.isInternetReachable);
		});
		const startCountdown = () => {
			let secondsLeft = 2;

			const countdownInterval = setInterval(() => {
				setCounter(secondsLeft);
				secondsLeft -= 1;

				if (secondsLeft < 0)
				{
					clearInterval(countdownInterval);
					if (!isConnected || !isInternetReachable)
					{
						setIsVisible(true);
					}
				}
			}, 1000);

			return countdownInterval;
		};

		const clearCountdownInterval = (intervalId: NodeJS.Timeout) => {
			clearInterval(intervalId);
			setCounter(null)
			// startCountdown()
		};

		if (isConnected && isInternetReachable)
		{
			setCounter(null);
			setIsVisible(false);
		}

		if (!isConnected || !isInternetReachable)
		{
			const countdownInterval = startCountdown();

			return () => {
				unsubscribe();
				clearCountdownInterval(countdownInterval);
			};
		}

	}, [isConnected, isInternetReachable]);
  // useEffect(() => {
  //   setTimeout(() => {
  //     setVislble(true);
  //   }, 5000);
  //   const unsubscribe = NetInfo.addEventListener((state) => {
  //     setIsConnected(state.isConnected);
  //     setIsInternetReachable(state.isInternetReachable);
  //   });
  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);

  return {
    isVisible: counter === 0 && (!isConnected || !isInternetReachable),
      counter:counter
  };
};

export { useInternetConnectivity };
