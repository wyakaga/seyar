import { BottomSheetModal, BottomSheetView, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import * as React from 'react';
import { StyleSheet } from 'react-native';


type BottomSheetProps = Omit<React.ComponentPropsWithoutRef<typeof BottomSheetModal>, 'children'> & {
  children: React.ReactNode;
};

const BottomSheet = React.forwardRef<BottomSheetModal, BottomSheetProps>(
  ({ children, ...props }, ref) => {
    return (
      <BottomSheetModal
        ref={ref}
        {...props}
        backgroundStyle={{ backgroundColor: '#18181B' }}
        handleIndicatorStyle={{ backgroundColor: '#71717A' }}
      >
        <BottomSheetView style={styles.contentContainer}>
          {children}
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

BottomSheet.displayName = 'BottomSheet';

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 24,
  },
});

export { BottomSheet, BottomSheetModalProvider };