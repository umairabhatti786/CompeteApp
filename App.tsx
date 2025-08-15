import React from 'react';
import RootNavigator from './src/routes/RootNavigator';
import {View} from 'react-native';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import { useInternetConnectivity } from './src/utils/CommonHooks/UseInternetConnectivity';
import InternetConnection from './src/screens/Main/InternetConnection';


const App = ({children, edges}: any) => {
  const { isVisible, counter } = useInternetConnectivity();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <Provider store={store}>
      <BottomSheetModalProvider>
        {isVisible === false && counter !== null && counter > 0 ? (
          <></>
        ) : (
          <InternetConnection isVisible={isVisible} />
        )}

        <RootNavigator />

        {/* <BottomSheetModalProvider
        snapPoints={["100%"]}
        handleStyle={{
          display: "none"
        }}
      > */}
      </BottomSheetModalProvider>
      {/* </BottomSheetModalProvider> */}
    </Provider>
  </GestureHandlerRootView>
  );
};

export default App;
