import React from 'react';
import {
  ImageBackground,
  StyleSheet,
  ViewStyle,
  ImageSourcePropType,
  SafeAreaView,
  View
} from 'react-native';
import { theme } from '../../utils/Themes';

interface BackgroundContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  backgroundSource?: ImageSourcePropType;
}

const ScreenLayout: React.FC<BackgroundContainerProps> = ({
  children,
  style,
  backgroundSource,
}) => {
  return (
    <SafeAreaView style={[styles.container]}>
      <View style={[styles.container, style]}>
      {children}
      </View>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});

export default ScreenLayout;
